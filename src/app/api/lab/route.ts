import { NextResponse } from "next/server";

import { aiEnabled, callClaude } from "@/lib/ai";
import { blockById } from "@/lib/academy/campus";

type Body = { blockId?: string; prompt?: string };

export async function GET() {
  return NextResponse.json({ ai: aiEnabled() });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const block = body.blockId ? blockById(body.blockId) : undefined;
  const prompt = (body.prompt ?? "").slice(0, 6000).trim();
  if (!block || !prompt) return NextResponse.json({ error: "Missing block or prompt" }, { status: 400 });
  if (!aiEnabled()) return NextResponse.json({ mode: "offline" });

  const system = `You are a CoDesign OS training agent used inside the CoDesign Academy (Sodexo).
You are helping a learner practise block ${block.id} "${block.name}". Objective: ${block.obj}
Expected output: ${block.output}. Minimum standard: ${block.std}
This is a TRAINING exercise on fictional data. Never invent real client names or figures. Mark every assumption as [ASSUMPTION] and every claim that needs a source as [TO VERIFY].
Keep the draft concise and structured (headings, bullet points, tables in markdown). End with a "Human checks" list: ${block.verify}`;

  const reply = await callClaude(system, [{ role: "user", content: prompt }], 1400);
  if (!reply) return NextResponse.json({ mode: "offline" });
  return NextResponse.json({ mode: "ai", draft: reply });
}
