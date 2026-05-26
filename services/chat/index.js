import "./loadEnv.js";
import cors from "cors";
import express from "express";
import { buildSystemPrompt } from "./systemPrompt.js";
import { complete, fallbackReply, getProvider } from "./providers.js";

const PORT = Number(process.env.CHAT_PORT || 8788);
const DAILY_CAP = Number(process.env.CHAT_DAILY_CAP || 50);

const app = express();
app.use(cors());
app.use(express.json({ limit: "256kb" }));

const dailyCounts = new Map();

function checkRateLimit(userKey) {
  const day = new Date().toISOString().slice(0, 10);
  const key = `${userKey}:${day}`;
  const n = dailyCounts.get(key) ?? 0;
  if (n >= DAILY_CAP) return false;
  dailyCounts.set(key, n + 1);
  return true;
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, provider: getProvider() });
});

app.post("/v1/chat", async (req, res) => {
  const { message, context, history } = req.body || {};
  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "message required" });
    return;
  }
  if (!context) {
    res.status(400).json({ error: "context required" });
    return;
  }

  const userKey =
    req.headers.authorization?.slice(7, 20) ?? req.ip ?? "anon";
  if (!checkRateLimit(userKey)) {
    res.status(429).json({ error: "Daily message limit reached" });
    return;
  }

  const trimmed = message.trim().slice(0, 4000);
  const system = buildSystemPrompt(context);
  const msgs = (history ?? [])
    .filter((m) => m.role && m.content)
    .slice(-18)
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content).slice(0, 8000),
    }));
  msgs.push({ role: "user", content: trimmed });

  try {
    const provider = getProvider();
    let content;
    if (!provider) {
      content = fallbackReply(trimmed);
    } else {
      content = await complete({ provider, system, messages: msgs });
    }
    res.json({ content, provider: provider ?? "fallback" });
  } catch (e) {
    res.status(500).json({
      error: e instanceof Error ? e.message : "Chat failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`[chat] :${PORT} provider=${getProvider() ?? "fallback"}`);
});
