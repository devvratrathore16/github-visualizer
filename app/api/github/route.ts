import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// SECTION 1: TYPE DEFINITIONS
// ============================================================

interface RawRepo {
    name: string;
    description: string | null;
    stargazerCount: number;
    pushedAt: string;
    url: string;
    primaryLanguage: {
        name: string;
        color: string;
    } | null;
    languages: {
        edges: Array<{
            size: number;
            node: { name: string; color: string };
        }>;
    };
    defaultBranchRef: {
        target: {
            history: {
                nodes: Array<{
                    message: string;
                    committedDate: string;
                }>;
            };
        };
    } | null;
}

interface RawGitHubUser {
    name: string | null;
    avatarUrl: string;
    bio: string | null;
    contributionsCollection: {
        contributionCalendar: {
            totalContributions: number;
        };
    };
    repositories: {
        nodes: RawRepo[];
    };
}

// ============================================================
// SECTION 2: THE SANITIZER FUNCTION
// ============================================================

function sanitizeForAI(user: RawGitHubUser, username: string): string {
    const totalContributions =
        user.contributionsCollection.contributionCalendar.totalContributions;

    const languageCounts: Record<string, number> = {};
    user.repositories.nodes.forEach((repo) => {
        repo.languages.edges.forEach((edge) => {
            const lang = edge.node.name;
            languageCounts[lang] = (languageCounts[lang] || 0) + edge.size;
        });
    });

    const topLanguages = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name]) => name)
        .join(', ');

    const repoSummaries = user.repositories.nodes
        .map((repo) => {
            const lang = repo.primaryLanguage?.name || 'Unknown';
            const commits = repo.defaultBranchRef?.target.history.nodes.length ?? 0;
            return `"${repo.name}" (${lang}, ${repo.stargazerCount} stars, ${commits} recent commits)`;
        })
        .join('; ');

    return `
Developer: ${user.name || username} (@${username})
Bio: ${user.bio || 'Not provided'}
Total contributions this year: ${totalContributions}
Top languages by code volume: ${topLanguages}
Recent repositories: ${repoSummaries}
  `.trim();
}

// ============================================================
// SECTION 3: THE MAIN ROUTE HANDLER
// ============================================================

export async function POST(request: NextRequest) {
    try {
        // --- 3a. Parse and validate the incoming request ---
        const body = await request.json();
        const { username } = body;

        if (!username || typeof username !== 'string') {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            );
        }

        const sanitisedUsername = username.trim().replace(/[^a-zA-Z0-9\-]/g, '');
        if (!sanitisedUsername || sanitisedUsername.length > 39) {
            return NextResponse.json(
                { error: 'Invalid GitHub username' },
                { status: 400 }
            );
        }

        // --- 3b. Validate environment variables ---
        const githubToken = process.env.GITHUB_PAT;
        const openrouterKey = process.env.OPENROUTER_API_KEY;

        if (!githubToken) {
            return NextResponse.json(
                { error: 'GitHub token not configured' },
                { status: 500 }
            );
        }

        if (!openrouterKey) {
            return NextResponse.json(
                { error: 'OpenRouter API key not configured' },
                { status: 500 }
            );
        }

        // --- 3c. Fetch from GitHub GraphQL ---
        const githubResponse = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Content-Type': 'application/json',
                'User-Agent': 'GitHub-Visualizer',
            },
            body: JSON.stringify({
                query: `
          query($username: String!) {
            user(login: $username) {
              name
              avatarUrl
              bio
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                }
              }
              repositories(
                first: 6
                orderBy: { field: PUSHED_AT, direction: DESC }
                ownerAffiliations: OWNER
                privacy: PUBLIC
              ) {
                nodes {
                  name
                  description
                  stargazerCount
                  pushedAt
                  url
                  primaryLanguage { name color }
                  languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
                    edges {
                      size
                      node { name color }
                    }
                  }
                  defaultBranchRef {
                    target {
                      ... on Commit {
                        history(first: 5) {
                          nodes {
                            message
                            committedDate
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
                variables: { username: sanitisedUsername },
            }),
        });

        if (!githubResponse.ok) {
            return NextResponse.json(
                { error: `GitHub API error: ${githubResponse.status}` },
                { status: 502 }
            );
        }

        const githubResult = await githubResponse.json();

        if (githubResult.errors) {
            return NextResponse.json(
                { error: 'GitHub GraphQL error', details: githubResult.errors },
                { status: 502 }
            );
        }

        const user: RawGitHubUser = githubResult.data?.user;

        if (!user) {
            return NextResponse.json(
                { error: `User "${sanitisedUsername}" not found` },
                { status: 404 }
            );
        }

        // --- 3d. Sanitize the raw data ---
        const sanitizedData = sanitizeForAI(user, sanitisedUsername);

        // --- 3e. Call OpenRouter using the free router ---
        // WHY openrouter/free: Instead of hardcoding model names that
        // keep changing, this special ID lets OpenRouter automatically
        // pick the best available free model for us every time.
        let synthesis: string | null = null;

        const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openrouterKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openrouter/free',
                messages: [
                    {
                        role: 'user',
                        content: `You are an expert technical recruiter writing a developer identity card.
Given structured GitHub profile data, write exactly 2-3 sentences that:
1. Identify the developer's primary technical domain and stack
2. Comment on their activity level and project patterns
3. End with "Archetype: The [Label]" on its own new line

Be specific, professional, and concise. Do not invent facts not present in the data.

Here is the sanitized GitHub profile data:

${sanitizedData}`,
                    },
                ],
            }),
        });

        if (aiResponse.ok) {
            const aiResult = await aiResponse.json();
            synthesis = aiResult.choices?.[0]?.message?.content ?? null;
            console.log('✅ Got synthesis:', synthesis);
        } else {
            console.error('❌ AI failed:', aiResponse.status, await aiResponse.text());
        }

        // --- 3f. Return everything to the client ---
        return NextResponse.json({
            success: true,
            data: user,
            synthesis,
            sanitizedData,
        });

    } catch (error) {
        console.error('Route error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}