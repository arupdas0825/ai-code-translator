import { NextRequest, NextResponse } from "next/server";
import { callOllama, OLLAMA_MODEL } from "@/app/utils/ollama";
import { buildExplanationPrompt } from "@/app/utils/prompts";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      language,
      eli5 = false,
      model = OLLAMA_MODEL,
    } = body as {
      code: string;
      language: string;
      eli5?: boolean;
      model?: string;
    };

    if (!code?.trim()) {
      return NextResponse.json({ error: "No code provided." }, { status: 400 });
    }
    if (!language) {
      return NextResponse.json(
        { error: "Language is required." },
        { status: 400 }
      );
    }
    if (code.trim().length > 15_000) {
      return NextResponse.json(
        { error: "Code is too long. Please limit to 15,000 characters." },
        { status: 400 }
      );
    }

    const prompt = buildExplanationPrompt(code, language, eli5);
    const startTime = Date.now();
    // Slightly higher temperature for natural language output
    const result = await callOllama(prompt, model, { temperature: 0.3, num_predict: 1500 });
    const elapsed = Date.now() - startTime;

    return NextResponse.json({ result, elapsed, model, eli5 }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Explanation failed.";
    console.error("[/api/explain]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
