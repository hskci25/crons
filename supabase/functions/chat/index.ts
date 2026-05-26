// Deploy with: supabase functions deploy chat
// Mirrors services/chat for production (Deno)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function buildSystem(context: Record<string, unknown>): string {
  const files = context.files as Record<string, string> | undefined;
  const fileSummary = files
    ? Object.entries(files)
        .map(([p, c]) => `### ${p}\n\`\`\`java\n${String(c).slice(0, 4000)}\n\`\`\``)
        .join("\n\n")
    : "";
  return `You are a senior engineer tutor. Problem: ${context.title}. Spec: ${context.specMd}. Files:\n${fileSummary}\nDo not give full solutions or hidden test details.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, context, history } = await req.json();
    const provider = Deno.env.get("LLM_PROVIDER") ?? "openai";
    const key =
      provider === "anthropic"
        ? Deno.env.get("ANTHROPIC_API_KEY")
        : Deno.env.get("OPENAI_API_KEY");

    if (!key) {
      return new Response(
        JSON.stringify({
          content:
            "Assistant not configured. Set API keys on the edge function.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const system = buildSystem(context);
    const messages = [
      ...(history ?? []).slice(-18),
      { role: "user", content: message },
    ];

    let content = "";
    if (provider === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: Deno.env.get("ANTHROPIC_MODEL") ?? "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system,
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      content = data.content?.[0]?.text ?? "";
    } else {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: system }, ...messages],
          max_tokens: 1024,
        }),
      });
      const data = await res.json();
      content = data.choices?.[0]?.message?.content ?? "";
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
