import { NextResponse } from "next/server";

import { aiEnabled, callClaude } from "@/lib/ai";
import { RANKS } from "@/lib/academy/gamification";
import { campus } from "@/lib/academy/campus";
import { searchAll, type SearchHit } from "@/lib/search";

type Body = { message?: string; history?: { role: "user" | "assistant"; content: string }[]; page?: string };

const SYSTEM = `You are Didi, the CoDesign Academy coach for Sodexo CoDesign Services.
Rules: answer in short, plain international English (or French if the user writes French). Use only the CONTEXT provided; if the answer is not in it, say so and suggest who to ask (Diane for content, Gabriel for CoDesign OS, Arnaud for credentials).
Never invent client names, figures, agent names or outcomes. Case packs (Northbridge, Riverside, St Aldric, Lakeshore) are fictional training data.
A credential proves a project is referenced, not that a figure is approved for reuse: say "verify before use" when you cite amounts or impacts.
AI drafts are never final: remind people of the human checks when relevant.
${campus.taxonomy}
Levels N0–N4 are certified by observed practice; attending a session never grants N3. XP ranks (${RANKS.map((r) => r.name).join(", ")}) only reward learning activity.
End with one concrete next step in the Academy when useful.`;

function contextOf(hits: SearchHit[]): string {
  return hits.map((hit) => `- [${hit.kind}] ${hit.title} (${hit.subtitle}) → ${hit.href}\n  ${hit.snippet}`).join("\n");
}

function offlineAnswer(message: string, hits: SearchHit[]): string {
  const text = message.toLowerCase();
  if (/^(hi|hello|hey|bonjour|salut)\b/.test(text)) {
    return "Hi, I'm Didi, your CoDesign coach. Ask me about a method block (\"how do I build a persona?\"), a credential (\"stadium F&B credentials\"), an OS agent, or how XP and levels work.";
  }
  if (/\b(xp|rank|badge|streak|points?)\b/.test(text)) {
    return `You earn XP for learning activity: reading a card, watching the explainer, listening to the podcast, the quiz, the exercise, Lab runs and challenges. Ranks: ${RANKS.map((r) => `${r.name} (${r.min} XP)`).join(" → ")}. XP ranks are not N-levels: N0–N4 are certified by a coach on observed practice.`;
  }
  if (/\bn[0-4]\b|level|niveau/.test(text)) {
    return `Levels are cumulative: ${campus.levels.map((l) => l.label).join(" · ")}. Each block shows its target level. Self-study and sessions build toward N1–N2; N3 needs an observed engagement scored with the rubric, and attending a session never grants N3.`;
  }
  if (hits.length === 0) {
    return "I couldn't find that in the campus. Try a block name (Personas, Journey Map, Idea Sheet), a sector (stadium, care home, workplace) or an OS agent name. For content gaps, ask Diane.";
  }
  const top = hits.slice(0, 4);
  const intro = /credential|reference|case stud|client/.test(text)
    ? "Here are the closest credentials and blocks. Figures are internal — verify before use:"
    : "Here is what I found in the campus:";
  return `${intro}\n${top.map((hit) => `• ${hit.title} — ${hit.snippet.slice(0, 160)}${hit.snippet.length > 160 ? "…" : ""}`).join("\n")}`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const message = (body.message ?? "").slice(0, 2000).trim();
  if (!message) return NextResponse.json({ error: "Empty message" }, { status: 400 });

  const hits = searchAll(message, 8);
  const links = hits.slice(0, 4).map(({ title, href, kind }) => ({ title, href, kind }));

  if (aiEnabled()) {
    const history = (body.history ?? []).slice(-6).map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
    const reply = await callClaude(`${SYSTEM}\n\nCONTEXT (current page: ${body.page ?? "unknown"}):\n${contextOf(hits)}`, [
      ...history,
      { role: "user", content: message },
    ]);
    if (reply) return NextResponse.json({ reply, links, mode: "ai" });
  }

  return NextResponse.json({ reply: offlineAnswer(message, hits), links, mode: "offline" });
}
