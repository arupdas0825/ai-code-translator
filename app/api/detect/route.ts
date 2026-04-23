import { NextRequest, NextResponse } from "next/server";
import { callOllama, OLLAMA_MODEL } from "@/app/utils/ollama";
import { buildDetectionPrompt, type SupportedLanguage } from "@/app/utils/prompts";

export const runtime = "nodejs";
export const maxDuration = 30;

const VALID_LANGUAGES: SupportedLanguage[] = [
  "python", "javascript", "typescript", "java", "cpp", "c",
  "go", "rust", "php", "ruby", "swift", "kotlin", "bash", "sql",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, model = OLLAMA_MODEL } = body as {
      code: string;
      model?: string;
    };

    if (!code?.trim()) {
      return NextResponse.json({ error: "No code provided." }, { status: 400 });
    }

    // Use a small snippet for faster detection
    const snippet = code.trim().slice(0, 800);
    const prompt = buildDetectionPrompt(snippet);

    const raw = await callOllama(prompt, model, {
      temperature: 0.0,
      num_predict: 20,
    });

    // Normalise the response to match our language keys
    const detected = raw
      .toLowerCase()
      .trim()
      .replace(/[^a-z+#]/g, "")
      .replace("c++", "cpp")
      .replace("c#", "csharp") as SupportedLanguage;

    const language = VALID_LANGUAGES.includes(detected) ? detected : "python";

    return NextResponse.json({ language }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Language detection failed.";
    console.error("[/api/detect]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
