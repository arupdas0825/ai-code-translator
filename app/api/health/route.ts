import { NextResponse } from "next/server";
import { checkOllamaHealth, OLLAMA_MODEL } from "@/app/utils/ollama";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = await checkOllamaHealth();
  const preferredModel = OLLAMA_MODEL;
  const modelInstalled = health.models.some((m) =>
    m.startsWith(preferredModel)
  );

  return NextResponse.json(
    {
      ...health,
      preferredModel,
      modelInstalled,
      recommendation: !health.alive
        ? "Run `ollama serve` to start Ollama, then `ollama run codellama` to pull the model."
        : !modelInstalled
        ? `Run \`ollama run ${preferredModel}\` to install the model.`
        : "All systems operational.",
    },
    { status: health.alive ? 200 : 503 }
  );
}
