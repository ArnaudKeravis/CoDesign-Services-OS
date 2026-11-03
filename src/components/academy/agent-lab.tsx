"use client";

import { ArrowUpRight, Bot, ClipboardCheck, Copy, FlaskConical, Loader2, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { blockById, blockTone, campus } from "@/lib/academy/campus";
import { cn } from "@/lib/academy/cn";
import { ACTIVITY_XP } from "@/lib/academy/gamification";
import { fillTemplate, humanChecks, promptTemplate, splitList } from "@/lib/academy/learning";
import type { MethodBlock, Segment } from "@/lib/academy/types";
import { osAgents } from "@/lib/os/agents";

import { useProgress } from "./progress-provider";
import { FictionalBanner } from "./ui";

const LAB_BLOCKS = campus.blocks.filter((b) => promptTemplate(b) !== null);

function defaultValues(block: MethodBlock, segment: Segment, fields: string[]): Record<string, string> {
  const pack = campus.case_packs[segment];
  const values: Record<string, string> = {};
  for (const field of fields) {
    const f = field.toLowerCase();
    if (f.includes("segment")) values[field] = segment;
    else if (f.includes("client")) values[field] = pack.client;
    else if (f.includes("persona") || f === "user" || f === "y") values[field] = pack.persona;
    else if (f.includes("challenge") || f === "x" || f.includes("research question")) values[field] = pack.challenge;
    else if (f.includes("hmw") || f === "q") values[field] = pack.hmw[0] ?? "";
    else if (f.includes("paste") || f.includes("attach") || f.includes("table") || f.includes("list")) {
      values[field] = [
        `Case: ${pack.name}`,
        `Evidence: ${pack.evidence.join(" | ")}`,
        `Insights: ${pack.insights.join(" | ")}`,
        `Ideas: ${pack.ideas.join(" | ")}`,
      ].join("\n");
    } else if (f.includes("sector")) values[field] = segment === "WORK" ? "workplace" : segment === "PLAY" ? "sports & leisure" : segment === "HEAL" ? "healthcare" : "education";
    else if (f.includes("participant") || f.includes("group")) values[field] = pack.users;
    else if (f.includes("objective")) values[field] = pack.hmw[0] ?? pack.challenge;
    else if (f.includes("constraint")) values[field] = pack.constraints;
    else values[field] = "";
  }
  return values;
}

function offlineDraft(block: MethodBlock, segment: Segment): string {
  const pack = campus.case_packs[segment];
  const lines = [
    `# Practice draft · ${block.id} ${block.name}`,
    `_Offline practice mode: this scaffold is built from the method card and the ${segment} case pack. Connect the AI key to get a live agent draft._`,
    "",
    `## Objective`,
    block.obj,
    "",
    `## Working steps`,
    ...block.steps.map((s, i) => `${i + 1}. ${s} — [your notes for ${pack.name.split(" — ")[0]}]`),
    "",
    `## Evidence to use (fictional)`,
    ...pack.evidence.map((e) => `- ${e}`),
    "",
    `## Expected output`,
    block.output,
    "",
    `## Quality bar`,
    `- ${block.std}`,
    `- ${block.quality}`,
    "",
    `## Avoid`,
    ...splitList(block.mistakes).map((m) => `- ${m}`),
  ];
  return lines.join("\n");
}

export function AgentLab() {
  const params = useSearchParams();
  const router = useRouter();
  const { award, state } = useProgress();

  const agentParam = params.get("agent");
  const blockParam = params.get("block");
  const initialBlock =
    (blockParam && blockById(blockParam)) ||
    (agentParam && LAB_BLOCKS.find((b) => b.os_agents.some((a) => a.url.includes(`/${agentParam}`)))) ||
    LAB_BLOCKS.find((b) => b.id === "04.02") ||
    LAB_BLOCKS[0];

  const [blockId, setBlockId] = useState(initialBlock.id);
  const block = blockById(blockId) ?? initialBlock;
  const tpl = promptTemplate(block)!;
  const [segment, setSegment] = useState<Segment>(block.primary);
  const [values, setValues] = useState<Record<string, string>>(() => defaultValues(block, block.primary, tpl.fields));
  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState<"ai" | "offline" | null>(null);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const checks = useMemo(() => humanChecks(block), [block]);
  const allChecked = checks.every((c) => checked[c]);
  const runs = Object.keys(state.awarded).filter((k) => k.startsWith("lab:")).length;

  useEffect(() => {
    fetch("/api/lab")
      .then((r) => r.json())
      .then((j: { ai: boolean }) => setAiAvailable(j.ai))
      .catch(() => setAiAvailable(false));
  }, []);

  const selectBlock = (id: string) => {
    const b = blockById(id);
    if (!b) return;
    setBlockId(id);
    setSegment(b.primary);
    setValues(defaultValues(b, b.primary, promptTemplate(b)!.fields));
    setDraft("");
    setChecked({});
    setMode(null);
    router.replace(`/academy/lab?block=${id}`, { scroll: false });
  };

  const changeSegment = (s: Segment) => {
    setSegment(s);
    setValues(defaultValues(block, s, tpl.fields));
  };

  const filled = fillTemplate(tpl.template, values);

  const run = async () => {
    setBusy(true);
    setChecked({});
    try {
      const res = await fetch("/api/lab", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ blockId: block.id, prompt: filled }),
      });
      const json = (await res.json()) as { mode: "ai" | "offline"; draft?: string };
      if (json.mode === "ai" && json.draft) {
        setDraft(json.draft);
        setMode("ai");
      } else {
        setDraft(offlineDraft(block, segment));
        setMode("offline");
      }
    } catch {
      setDraft(offlineDraft(block, segment));
      setMode("offline");
    } finally {
      setBusy(false);
    }
  };

  const tone = blockTone(block);
  const agents = block.os_agents;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4">
        <div className="rounded-2xl border border-line bg-white p-4">
          <label className="block text-sm font-semibold text-navy" htmlFor="lab-block">Block to practise</label>
          <select
            id="lab-block"
            value={blockId}
            onChange={(e) => selectBlock(e.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm"
          >
            {campus.sections.map((s) => (
              <optgroup key={s.code} label={s.name}>
                {LAB_BLOCKS.filter((b) => b.id.startsWith(s.code)).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} {b.name}{b.os_agents.length ? " · agent" : ""}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="mt-4 space-y-2">
            {agents.length ? (
              agents.map((a) => (
                <div key={a.url} className="flex items-center justify-between gap-2 rounded-xl bg-panel px-3 py-2 text-sm">
                  <span className="flex items-center gap-2 font-semibold text-navy"><Bot size={16} style={{ color: tone }} /> {a.name}</span>
                  <a href={a.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-sodexo" aria-label={`Open ${a.name} in CoDesign OS`}>
                    OS <ArrowUpRight size={12} className="inline" />
                  </a>
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-panel px-3 py-2 text-xs text-muted">No dedicated OS agent: generic Claude prompt.</p>
            )}
          </div>
          <Link href={`/academy/blocks/${block.id}`} className="mt-3 inline-block text-xs font-semibold text-sodexo hover:underline">Review the method card →</Link>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-sm font-semibold text-navy">All OS agents</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {osAgents.map((a) => (
              <button
                key={a.slug}
                type="button"
                onClick={() => selectBlock(a.blocks.find((b) => LAB_BLOCKS.some((lb) => lb.id === b.id))?.id ?? a.blocks[0].id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                  agents.some((x) => x.url === a.url) ? "border-sodexo bg-sodexo text-white" : "border-line text-navy hover:border-sodexo",
                )}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-panel p-4 text-sm">
          <p className="flex items-center gap-2 font-semibold text-navy"><ShieldCheck size={16} /> Lab rules</p>
          <ul className="mt-2 space-y-1 text-muted">
            <li>• Fictional case data only — no client documents.</li>
            <li>• AI drafts are never final.</li>
            <li>• Tick every human check to earn XP ({runs} runs so far).</li>
          </ul>
        </div>
      </aside>

      <section className="space-y-5">
        <div className="rounded-3xl border border-line bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-xl font-bold"><Wand2 size={20} style={{ color: tone }} /> 1 · Fill the prompt</h2>
            <div className="flex gap-1" role="radiogroup" aria-label="Case pack">
              {campus.segments.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={segment === s}
                  onClick={() => changeSegment(s)}
                  className={cn("rounded-full px-3 py-1 text-xs font-bold", segment === s ? "bg-navy text-white" : "bg-panel text-navy")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3"><FictionalBanner /></div>
          {tpl.intro && <p className="mt-3 text-sm text-muted">{tpl.intro}</p>}
          {tpl.fields.length > 0 && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {tpl.fields.map((field) => (
                <label key={field} className="block text-sm">
                  <span className="font-mono text-xs font-semibold text-sodexo">[{field}]</span>
                  <textarea
                    value={values[field] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [field]: e.target.value }))}
                    rows={/paste|attach|table|list/i.test(field) ? 4 : 2}
                    className="mt-1 w-full rounded-xl border border-line bg-panel/50 px-3 py-2 text-sm outline-none focus:border-sodexo"
                  />
                </label>
              ))}
            </div>
          )}
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">Prompt preview</p>
          <p className="mt-1 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl bg-navy-deep p-4 font-mono text-[12.5px] leading-relaxed text-white/90">{filled}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={run}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-sodexo px-5 py-2.5 font-semibold text-white disabled:opacity-60"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <FlaskConical size={16} />} Run the agent
            </button>
            <button type="button" onClick={() => void navigator.clipboard.writeText(filled)} className="inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-navy">
              <Copy size={15} /> Copy for CoDesign OS / Claude
            </button>
            <span className="text-xs text-muted">
              {aiAvailable === null ? "" : aiAvailable ? "Live AI connected" : "Offline practice mode (no AI key configured)"}
            </span>
          </div>
        </div>

        {draft && (
          <div className="grid animate-rise gap-5 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl border border-line bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold"><Sparkles size={20} className="text-gold" /> 2 · Agent draft</h2>
                <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase", mode === "ai" ? "bg-sodexo text-white" : "bg-panel text-muted")}>
                  {mode === "ai" ? "AI draft · not final" : "Practice scaffold"}
                </span>
              </div>
              <pre className="mt-4 max-h-[520px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-panel p-4 font-sans text-sm leading-relaxed">{draft}</pre>
            </div>
            <div className="rounded-3xl border border-line bg-white p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold"><ClipboardCheck size={20} className="text-s05" /> 3 · Human checks</h2>
              <p className="mt-1 text-sm text-muted">Tick each one honestly before the draft can be reused.</p>
              <ul className="mt-4 space-y-2">
                {checks.map((c) => (
                  <li key={c}>
                    <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition", checked[c] ? "border-s05 bg-[#effaf4]" : "border-line")}>
                      <input
                        type="checkbox"
                        checked={Boolean(checked[c])}
                        onChange={(e) => setChecked((v) => ({ ...v, [c]: e.target.checked }))}
                        className="mt-0.5"
                      />
                      {c}
                    </label>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={!allChecked}
                onClick={() => {
                  award(`lab:${block.id}`, ACTIVITY_XP.lab, `Agent Lab: ${block.name}`);
                  void navigator.clipboard.writeText(draft);
                }}
                className="mt-4 w-full rounded-xl bg-s05 px-4 py-2.5 font-semibold text-white disabled:opacity-40"
              >
                {allChecked ? `Copy the checked draft (+${ACTIVITY_XP.lab} XP)` : "Complete the checks to unlock"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
