"use client";

import { Lightbulb, MapPin, Target, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/academy/cn";
import { ACTIVITY_XP } from "@/lib/academy/gamification";
import type { CasePack, Segment } from "@/lib/academy/types";

import { useProgress } from "./progress-provider";

export function CaseExplorer({ segment, pack, tone }: { segment: Segment; pack: CasePack; tone: string }) {
  const { award } = useProgress();
  const [stage, setStage] = useState(0);
  const [votes, setVotes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const t = window.setTimeout(() => award(`case:${segment}`, ACTIVITY_XP.case, `Case pack explored: ${segment}`), 4000);
    return () => window.clearTimeout(t);
  }, [award, segment]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-line bg-white p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold"><MapPin size={20} style={{ color: tone }} /> Current journey</h2>
        <p className="mt-1 text-sm text-muted">Click a stage to place the evidence. Where does it hurt most?</p>
        <ol className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {pack.journey.map((step, i) => (
            <li key={step} className="min-w-[130px] flex-1">
              <button
                type="button"
                onClick={() => setStage(i)}
                aria-pressed={stage === i}
                className={cn(
                  "relative w-full rounded-2xl border px-3 py-4 text-left text-sm font-semibold transition",
                  stage === i ? "border-transparent text-white shadow-lg" : "border-line bg-panel text-navy hover:border-sodexo",
                )}
                style={stage === i ? { background: tone } : undefined}
              >
                <span className="block text-[10px] font-bold uppercase opacity-70">Stage {i + 1}</span>
                {step}
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {pack.evidence.map((e) => (
            <div key={e} className="rounded-xl border border-dashed border-line bg-white p-3 text-sm">{e}</div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          Selected stage: <span className="font-semibold text-navy">{pack.journey[stage]}</span> — which evidence card belongs here? Discuss in your group, then compare with the insights.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-line bg-white p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Lightbulb size={20} className="text-gold" /> Insights</h2>
          <ul className="mt-3 space-y-2">
            {pack.insights.map((i) => (
              <li key={i} className="rounded-xl bg-panel px-3 py-2 text-sm">{i}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border border-line bg-white p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Target size={20} className="text-sodexo" /> How Might We…</h2>
          <p className="mt-1 text-sm text-muted">Dot-vote the question you would take into the workshop.</p>
          <ul className="mt-3 space-y-2">
            {pack.hmw.map((h, i) => (
              <li key={h}>
                <button
                  type="button"
                  onClick={() => setVotes((v) => ({ ...v, [i]: !v[i] }))}
                  aria-pressed={Boolean(votes[i])}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition",
                    votes[i] ? "border-sodexo bg-panel-2" : "border-line hover:border-sodexo",
                  )}
                >
                  <ThumbsUp size={16} className={cn("mt-0.5 shrink-0", votes[i] ? "text-sodexo" : "text-muted")} />
                  {h}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
