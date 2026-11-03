"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { blockById } from "@/lib/academy/campus";
import { cn } from "@/lib/academy/cn";
import type { Challenge } from "@/lib/academy/extras";
import { ACTIVITY_XP, dayKey } from "@/lib/academy/gamification";
import { shuffle } from "@/lib/academy/learning";

import { useProgress } from "./progress-provider";

export function ChallengeCard({ challenge, daily = false }: { challenge: Challenge; daily?: boolean }) {
  const { award, state } = useProgress();
  const [picked, setPicked] = useState<number | null>(null);
  const options = shuffle(challenge.options, challenge.id);
  const block = blockById(challenge.block);
  const alreadyDone = Boolean(state.awarded[`challenge:${challenge.id}`]);

  const choose = (index: number) => {
    if (picked !== null) return;
    setPicked(index);
    const correct = options[index].correct;
    award(`challenge:${challenge.id}`, correct ? ACTIVITY_XP.challenge : Math.round(ACTIVITY_XP.challenge / 2), `Challenge: ${challenge.title}`);
    if (daily) award(`daily:${dayKey(new Date())}`, ACTIVITY_XP.daily, "Daily challenge");
  };

  return (
    <article className="rounded-3xl border border-line bg-white p-6">
      <div className="flex flex-wrap items-center gap-2">
        {daily && <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy-deep">Daily challenge</span>}
        {block && (
          <Link href={`/academy/blocks/${block.id}`} className="text-xs font-semibold text-sodexo hover:underline">
            {block.id} {block.name}
          </Link>
        )}
        {alreadyDone && picked === null && <span className="text-xs text-s05">✓ done before — try again for practice</span>}
      </div>
      <h3 className="mt-2 text-xl font-bold">{challenge.title}</h3>
      <p className="mt-2 text-ink">{challenge.situation}</p>
      <p className="mt-3 font-semibold text-navy">{challenge.question}</p>
      <div className="mt-4 grid gap-2">
        {options.map((option, index) => {
          const show = picked !== null;
          const isPicked = picked === index;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => choose(index)}
              disabled={show}
              className={cn(
                "rounded-xl border px-4 py-3 text-left text-sm transition",
                !show && "border-line hover:border-sodexo hover:bg-panel",
                show && option.correct && "border-s05 bg-[#effaf4]",
                show && isPicked && !option.correct && "border-star bg-[#fdeff0]",
                show && !isPicked && !option.correct && "border-line opacity-60",
              )}
            >
              <span className="flex items-start gap-2">
                {show && option.correct && <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-s05" />}
                {show && isPicked && !option.correct && <XCircle size={18} className="mt-0.5 shrink-0 text-star" />}
                <span>
                  {option.text}
                  {show && (isPicked || option.correct) && <span className="mt-1 block text-xs text-muted">{option.feedback}</span>}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <button type="button" onClick={() => setPicked(null)} className="mt-3 text-xs font-semibold text-sodexo hover:underline">
          Try again
        </button>
      )}
    </article>
  );
}
