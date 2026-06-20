import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

const google = createGoogleGenerativeAI({
  apiKey: apiKey,
});

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 503 });
  }

  // IP Rate Limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  
  const now = Date.now();
  const rateLimitInfo = rateLimitMap.get(ip);
  
  if (rateLimitInfo) {
    if (now > rateLimitInfo.resetTime) {
      // Reset limit
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    } else {
      if (rateLimitInfo.count >= RATE_LIMIT_COUNT) {
        return NextResponse.json({ error: "Rate limit exceeded. You are limited to 5 messages per day since sign-in is not active." }, { status: 429 });
      } else {
        rateLimitInfo.count += 1;
        rateLimitMap.set(ip, rateLimitInfo);
      }
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
  }

  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: `You are an expert AI tutor for JEE (Joint Entrance Examination) aspirants. 
Your primary goal is to help students understand Physics, Chemistry, and Mathematics concepts, solve problems, and clarify doubts.
You must:
- Be clear, concise, and educational.
- Use step-by-step explanations for mathematical and scientific problems.
- Use LaTeX formatting for all mathematical equations, formulas, and symbols. Wrap inline math with single dollar signs (e.g., $E = mc^2$) and block math with double dollar signs (e.g., $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$).
- Encourage the student and maintain a positive, motivating tone.
- Do not provide direct answers without explaining the underlying concepts.`,
      messages,
    });

    console.log("result keys:", Object.keys(result));
    console.log("result proto keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(result)));
    // @ts-ignore
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to generate response", message: error.message }, { status: 500 });
  }
}
