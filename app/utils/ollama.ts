// ─── Ollama Integration Utility ──────────────────────────────────────────────
// Handles communication with the local Ollama REST API at http://localhost:11434

export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
  };
}

export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

export interface OllamaError {
  error: string;
}

// Configurable Ollama base URL – reads from environment or falls back to localhost
export const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL || "http://localhost:11434";

// Default model – override with env var
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "codellama";

/**
 * Calls the Ollama /api/generate endpoint and returns the text response.
 * Throws a descriptive error if the call fails.
 */
export async function callOllama(
  prompt: string,
  model: string = OLLAMA_MODEL,
  options?: OllamaRequest["options"]
): Promise<string> {
  const requestBody: OllamaRequest = {
    model,
    prompt,
    stream: false,
    options: {
      temperature: 0.1,  // Low temperature for deterministic code output
      top_p: 0.9,
      num_predict: 2048,
      ...options,
    },
  };

  let response: Response;

  try {
    response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      // 120-second timeout for large code inputs
      signal: AbortSignal.timeout(120_000),
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(
        "Request timed out after 120 seconds. The model may be loading — try again in a moment."
      );
    }
    throw new Error(
      `Cannot reach Ollama. Make sure it is running: ollama serve\n\nDetails: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  if (!response.ok) {
    let body = "";
    try { body = await response.text(); } catch {}
    throw new Error(
      `Ollama returned HTTP ${response.status}: ${body || response.statusText}`
    );
  }

  const data: OllamaResponse | OllamaError = await response.json();

  if ("error" in data) {
    throw new Error(`Ollama error: ${data.error}`);
  }

  return (data as OllamaResponse).response.trim();
}

/**
 * Checks whether Ollama is reachable and returns the list of installed models.
 */
export async function checkOllamaHealth(): Promise<{
  alive: boolean;
  models: string[];
  error?: string;
}> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return { alive: false, models: [], error: `HTTP ${res.status}` };
    const data = await res.json();
    const models: string[] = (data.models ?? []).map(
      (m: { name: string }) => m.name
    );
    return { alive: true, models };
  } catch (err) {
    return {
      alive: false,
      models: [],
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Strips markdown code fences that the model may wrap its output in.
 * e.g. ```python\n...\n``` → the inner code
 */
export function stripCodeFences(text: string): string {
  // Remove triple-backtick fences with optional language tag
  return text
    .replace(/^```[\w]*\n?/m, "")
    .replace(/\n?```$/m, "")
    .trim();
}
