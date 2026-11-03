"use client";

import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

import { blockById, blockTone } from "@/lib/academy/campus";
import { blockProgress } from "@/lib/academy/gamification";

import { useProgress } from "./progress-provider";
import { ProgressRing } from "./ui";

export function PathProgress({ title, audience, blockIds, tone }: { title: string; audience: string; blockIds: string[]; tone: string }) {
  const { state } = useProgress();
  const done = blockIds.filter((id) => blockProgress(state, id).complete).length;
  const nextId = blockIds.find((id) => !blockProgress(state, id).complete);
  return (
    <article className="flex flex-col rounded-3xl border border-line bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: tone }}>{audience}</p>
          <h3 className="mt-1 text-xl font-bold">{title}</h3>
        </div>
        <ProgressRing value={done / blockIds.length} size={52} color={tone}>{done}/{blockIds.length}</ProgressRing>
      </div>
      <ol className="mt-4 flex-1 space-y-1.5">
        {blockIds.map((id) => {
          const b = blockById(id);
          if (!b) return null;
          const complete = blockProgress(state, id).complete;
          return (
            <li key={id}>
              <Link href={`/academy/blocks/${id}`} className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-panel">
                {complete ? <CheckCircle2 size={16} className="text-s05" /> : <Circle size={16} style={{ color: blockTone(b) }} />}
                <span className="font-mono text-xs text-muted">{id}</span>
                <span className={complete ? "text-muted line-through" : "text-navy"}>{b.name}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      {nextId && (
        <Link href={`/academy/blocks/${nextId}`} className="mt-4 rounded-xl py-2.5 text-center text-sm font-semibold text-white" style={{ background: tone }}>
          {done === 0 ? "Start this path" : "Continue"}
        </Link>
      )}
    </article>
  );
}
