import { NextRequest, NextResponse } from "next/server";
import { callOllama, OLLAMA_MODEL, stripCodeFences } from "@/app/utils/ollama";
import { buildTranslationPrompt } from "@/app/utils/prompts";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      sourceLang,
      targetLang,
      model = OLLAMA_MODEL,
    } = body as {
      code: string;
      sourceLang: string;
      targetLang: string;
      model?: string;
    };

    // ─── Input validation ─────────────────────────────────────────
    if (!code?.trim()) {
      return NextResponse.json({ error: "No code provided." }, { status: 400 });
    }
    if (!sourceLang || !targetLang) {
      return NextResponse.json(
        { error: "Source and target languages are required." },
        { status: 400 }
      );
    }
    if (sourceLang === targetLang) {
      return NextResponse.json(
        { error: "Source and target languages must be different." },
        { status: 400 }
      );
    }
    if (code.trim().length > 15_000) {
      return NextResponse.json(
        { error: "Code is too long. Please limit to 15,000 characters." },
        { status: 400 }
      );
    }

    const prompt = buildTranslationPrompt(code, sourceLang, targetLang);
    const startTime = Date.now();
    const raw = await callOllama(prompt, model, { temperature: 0.1 });
    const elapsed = Date.now() - startTime;

    const result = stripCodeFences(raw);

    return NextResponse.json(
      { result, elapsed, model },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Translation failed.";
    console.error("[/api/translate]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
