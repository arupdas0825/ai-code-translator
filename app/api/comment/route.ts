import { NextRequest, NextResponse } from "next/server";
import { callOllama, OLLAMA_MODEL, stripCodeFences } from "@/app/utils/ollama";
import { buildCommentPrompt } from "@/app/utils/prompts";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      language,
      model = OLLAMA_MODEL,
    } = body as {
      code: string;
      language: string;
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

    const prompt = buildCommentPrompt(code, language);
    const startTime = Date.now();
    const raw = await callOllama(prompt, model, { temperature: 0.15 });
    const elapsed = Date.now() - startTime;

    const result = stripCodeFences(raw);

    return NextResponse.json({ result, elapsed, model }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Comment generation failed.";
    console.error("[/api/comment]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
