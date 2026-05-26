const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

function readEnv(name) {
  const raw = process.env[name];
  if (!raw) return undefined;
  const v = raw.trim().replace(/^["'`]|["'`]$/g, "");
  return v || undefined;
}

export async function complete({ provider, system, messages }) {
  if (provider === "anthropic") {
    return completeAnthropic({ system, messages });
  }
  return completeOpenAI({ system, messages });
}

async function completeOpenAI({ system, messages }) {
  const key = readEnv("OPENAI_API_KEY");
  if (!key) throw new Error("OPENAI_API_KEY not set");

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "system", content: system }, ...messages],
      max_tokens: 1024,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function completeAnthropic({ system, messages }) {
  const key = readEnv("ANTHROPIC_API_KEY");
  if (!key) throw new Error("ANTHROPIC_API_KEY not set");

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: readEnv("ANTHROPIC_MODEL") || "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system,
      messages: messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic error: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const block = data.content?.find((b) => b.type === "text");
  return block?.text ?? "";
}

export function getProvider() {
  const p = (readEnv("LLM_PROVIDER") || "").toLowerCase();
  const anthropicKey = readEnv("ANTHROPIC_API_KEY");
  const openaiKey = readEnv("OPENAI_API_KEY");

  if (p === "anthropic" && anthropicKey) return "anthropic";
  if (p === "openai" && openaiKey) return "openai";
  if (anthropicKey) return "anthropic";
  if (openaiKey) return "openai";
  return null;
}

export function fallbackReply(message) {
  return (
    "The assistant is not configured yet. Set OPENAI_API_KEY or ANTHROPIC_API_KEY " +
    "and LLM_PROVIDER in services/chat/.env, then run `npm run chat:dev`.\n\n" +
    `You asked: "${message.slice(0, 120)}${message.length > 120 ? "…" : ""}"\n\n` +
    "Meanwhile: re-read the spec, trace through the visible tests, and try a brute-force " +
    "approach first before optimizing."
  );
}
