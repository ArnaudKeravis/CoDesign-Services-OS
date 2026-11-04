"use client";

import { ArrowUpRight, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

import { useProgress } from "@/components/academy/progress-provider";
import { cn } from "@/lib/academy/cn";
import type { AgentTraining, TrainingStep } from "@/lib/os/training";

function isDone(step: TrainingStep, training: AgentTraining, awarded: Record<string, unknown>): boolean {
  const main = training.blocks[0]?.id;
  const has = (key: string) => Boolean(awarded[key]);
  switch (step.id) {
    case "learn":
      return has(`block:${main}:read`);
    case "watch":
      return has(`block:${main}:video`) || has(`block:${main}:podcast`);
    case "practise":
      return has(`block:${main}:quiz`) || has(`block:${main}:exercise`);
    case "lab":
      return training.blocks.some((b) => has(`lab:${b.id}`));
    default:
      return false;
  }
}

export function TrainingSteps({ training, compact = false }: { training: AgentTraining; compact?: boolean }) {
  const { state, ready } = useProgress();
  const doneCount = training.steps.filter((s) => isDone(s, training, state.awarded)).length;
  const readyForOs = doneCount >= 4;
  return (
    <div className={cn("rounded-3xl border border-line bg-white", compact ? "p-4" : "p-6")}>
      <div className="flex items-center justify-between gap-3">
        <h2 className={cn("font-bold", compact ? "text-base" : "text-xl")}>How to train on this agent</h2>
        {ready && <span className="text-xs font-semibold text-muted">{doneCount}/4 done</span>}
      </div>
      <ol className="mt-4 space-y-2">
        {training.steps.map((step, i) => {
          const done = ready && isDone(step, training, state.awarded);
          const external = step.href.startsWith("http");
          const body = (
            <>
              <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", done ? "bg-s05 text-white" : step.id === "use" ? "bg-navy text-white" : "bg-panel text-navy")}>
                {done ? <CheckCircle2 size={15} /> : i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 font-semibold text-navy">
                  {step.label} {external && <ArrowUpRight size={13} />}
                </span>
                {!compact && <span className="block text-xs text-muted">{step.detail}</span>}
              </span>
              {!done && step.id !== "use" && <Circle size={14} className="shrink-0 text-line" aria-hidden />}
            </>
          );
          const cls = cn(
            "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition hover:border-sodexo",
            step.id === "use" && !readyForOs ? "border-dashed border-line" : "border-line",
          );
          return (
            <li key={step.id}>
              {external ? (
                <a href={step.href} target="_blank" rel="noreferrer" className={cls}>{body}</a>
              ) : (
                <Link href={step.href} className={cls}>{body}</Link>
              )}
            </li>
          );
        })}
      </ol>
      {ready && !readyForOs && (
        <p className="mt-3 text-xs text-muted">Finish steps 1–4 before using the agent on a real engagement.</p>
      )}
    </div>
  );
}
