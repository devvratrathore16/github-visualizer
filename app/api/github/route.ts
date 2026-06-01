import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// RATE LIMITER
// ============================================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  if (record.count >= RATE_LIMIT_MAX) return true;
  record.count++;
  return false;
}

// ============================================================
// SECTION 1: TYPE DEFINITIONS
// ============================================================
interface RawRepo {
  name: string;
  description: string | null;
  stargazerCount: number;
  pushedAt: string;
  url: string;
  primaryLanguage: { name: string; color: string } | null;
  languages: {
    edges: Array<{ size: number; node: { name: string; color: string } }>;
  };
  defaultBranchRef: {
    target: {
      history: { nodes: Array<{ message: string; committedDate: string }> };
    };
  } | null;
}

interface RawGitHubUser {
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  contributionsCollection: {
    contributionCalendar: { totalContributions: number };
  };
  repositories: { nodes: RawRepo[] };
}

// ============================================================
// SECTION 2: SANITIZER
// Fix 3 — Only send top 3 repos to AI to reduce tokens and speed up response
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

  // Fix 3 — slice(0, 3) sends only top 3 repos instead of all 10
  const repoSummaries = user.repositories.nodes
    .slice(0, 3)
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
// SECTION 3: ROUTE HANDLER
// AI has been removed from this route entirely.
// This route now only fetches GitHub data and returns it fast.
// AI synthesis is handled separately by /api/analyze
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before searching again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a GitHub username to search.' },
        { status: 400 }
      );
    }

    const sanitisedUsername = username.trim().replace(/[^a-zA-Z0-9\-]/g, '');
    if (!sanitisedUsername || sanitisedUsername.length > 39) {
      return NextResponse.json(
        { error: 'Please enter a valid GitHub username. Usernames can only contain letters, numbers, and hyphens.' },
        { status: 400 }
      );
    }

    const githubToken = process.env.GITHUB_PAT;
    if (!githubToken) {
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

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
                contributionCalendar { totalContributions }
              }
              repositories(
                first: 10
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
                          nodes { message committedDate }
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
      console.error('GitHub HTTP error:', githubResponse.status);
      return NextResponse.json(
        { error: 'GitHub is not responding right now. Please try again in a moment.' },
        { status: 502 }
      );
    }

    const githubResult = await githubResponse.json();

    if (githubResult.errors) {
      console.error('GitHub GraphQL errors:', githubResult.errors);
      const rateLimited = githubResult.errors.some(
        (e: any) => e.type === 'RATE_LIMITED'
      );
      if (rateLimited) {
        return NextResponse.json(
          { error: 'GitHub rate limit reached. Please wait a minute and try again.' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: 'Could not load GitHub data. Please try again in a moment.' },
        { status: 502 }
      );
    }

    const user: RawGitHubUser = githubResult.data?.user;
    if (!user) {
      return NextResponse.json(
        { error: `No GitHub user found with the username "${sanitisedUsername}". Please check the spelling and try again.` },
        { status: 404 }
      );
    }

    // Build sanitized string and return it alongside raw data
    // Client will pass sanitizedData to /api/analyze separately
    const sanitizedData = sanitizeForAI(user, sanitisedUsername);

    return NextResponse.json({
      success: true,
      data: user,
      sanitizedData,
    });

  } catch (error) {
    console.error('Unexpected route error:', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please try again.' },
      { status: 500 }
    );
  }
}