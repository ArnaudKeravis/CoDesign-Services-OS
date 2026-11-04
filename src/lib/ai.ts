import "server-only";

export function aiEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

type Message = { role: "user" | "assistant"; content: string };

export async function callClaude(system: string, messages: Message[], maxTokens = 900): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5",
      max_tokens: maxTokens,
      system,
      messages,
    }),
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) return null;
  const json = (await response.json()) as { content?: { type: string; text?: string }[] };
  return json.content?.filter((part) => part.type === "text").map((part) => part.text ?? "").join("\n") ?? null;
}
