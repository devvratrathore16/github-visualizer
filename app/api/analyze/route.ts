import { NextRequest, NextResponse } from 'next/server';

// Rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }
  if (record.count >= 10) return true;
  record.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { sanitizedData } = body;

    if (!sanitizedData || typeof sanitizedData !== 'string') {
      return NextResponse.json(
        { error: 'No data provided for analysis.' },
        { status: 400 }
      );
    }

    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (!openrouterKey) {
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 }
      );
    }

    const MODELS = [
      'openrouter/free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'deepseek/deepseek-r1:free',
      'deepseek/deepseek-v3:free',
      'meta-llama/llama-4-maverick:free',
    ];

    const PROMPT = `Analyze this GitHub developer profile in exactly 2 sentences. End with "Archetype: The [Label]" on its own line. Be specific and professional.

${sanitizedData}`;

    let synthesis: string | null = null;

    for (const model of MODELS) {
      const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: PROMPT }],
        }),
      });

      if (aiResponse.ok) {
        const aiResult = await aiResponse.json();
        const text = aiResult.choices?.[0]?.message?.content ?? null;
        if (text) {
          synthesis = text;
          break;
        }
      }

      if (aiResponse.status === 429) continue;

      const errBody = await aiResponse.text();
      console.error(`❌ ${model} failed:`, aiResponse.status, errBody);
    }

    return NextResponse.json({ synthesis });

  } catch (error) {
    console.error('Analyze route error:', error);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}