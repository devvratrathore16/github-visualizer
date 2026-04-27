import { NextRequest, NextResponse } from 'next/server';
import { DeveloperProfile } from '@/lib/types';

export async function POST(request: NextRequest) {
    try {
        const profile: DeveloperProfile = await request.json();

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'OpenRouter API key not configured' },
                { status: 500 }
            );
        }

        // Build a clean summary — don't send the raw object, control exactly what the AI sees
        const sanitizedData = `
Name: ${profile.name} (@${profile.username})
Bio: ${profile.bio}
Total contributions: ${profile.totalContributions}
Top languages: ${profile.topLanguages.map(l => `${l.name} (${l.percentage}%)`).join(', ')}
Top repositories:
${profile.repositories.map(r =>
            `- ${r.name}: ${r.stars} stars, language: ${r.language}, last pushed: ${r.pushedAt}${r.description ? `, description: ${r.description}` : ''}`
        ).join('\n')}
    `.trim();

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.3-70b-instruct:free',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert technical recruiter and developer analyst. 
Given a developer's GitHub profile data, write a concise 3-paragraph professional analysis covering:
1. Their apparent technical strengths and primary stack
2. Their activity level and project patterns
3. A one-line "Developer archetype" summary (e.g. "Full-stack builder with a Python/ML lean")
Keep the tone professional but human. Do not use bullet points. Do not invent facts not present in the data.`,
                    },
                    {
                        role: 'user',
                        content: `Here is the GitHub profile data:\n\n${sanitizedData}`,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter error:', errorText);
            return NextResponse.json(
                { error: 'AI analysis failed' },
                { status: 502 }
            );
        }

        const result = await response.json();
        const analysis = result.choices?.[0]?.message?.content;

        if (!analysis) {
            return NextResponse.json(
                { error: 'No analysis returned from model' },
                { status: 500 }
            );
        }

        return NextResponse.json({ analysis });

    } catch (error) {
        console.error('Analyze route error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}