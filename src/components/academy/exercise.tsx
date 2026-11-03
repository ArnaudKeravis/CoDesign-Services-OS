"use client";

import { Eye, Lightbulb, PenLine } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { campus, SEGMENT_TONE } from "@/lib/academy/campus";
import { cn } from "@/lib/academy/cn";
import { ACTIVITY_XP, activityKey } from "@/lib/academy/gamification";
import type { MethodBlock, Segment } from "@/lib/academy/types";

import { useProgress } from "./progress-provider";
import { FictionalBanner } from "./ui";

const MIN_CHARS = 20;

export function Exercise({ block }: { block: MethodBlock }) {
  const { state, update, award } = useProgress();
  const [segment, setSegment] = useState<Segment>(block.primary);
  const submittedKey = activityKey(block.id, "exercise");
  const submitted = Boolean(state.awarded[submittedKey]);
  const [reveal, setReveal] = useState(false);
  const [reflection, setReflection] = useState<string | null>(null);
  const pack = campus.case_packs[segment];

  const draftKey = (i: number) => `${block.id}:q${i}`;
  const answers = block.exercise.questions.map((_, i) => state.drafts[draftKey(i)] ?? "");
  const ready = answers.every((a) => a.trim().length >= MIN_CHARS);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-line bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="flex items-center gap-2 text-lg font-bold"><PenLine size={18} /> Apply it to a case</h4>
          <div className="flex gap-1" role="radiogroup" aria-label="Case pack">
            {campus.segments.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={segment === s}
                onClick={() => setSegment(s)}
                className={cn("rounded-full px-3 py-1 text-xs font-bold transition", segment === s ? "text-white" : "bg-panel text-navy")}
                style={segment === s ? { background: SEGMENT_TONE[s] } : undefined}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 space-y-3 rounded-2xl bg-panel p-4">
          <FictionalBanner />
          <p className="font-semibold text-navy">{pack.name}</p>
          <p className="text-sm">{pack.challenge}</p>
          <p className="text-sm"><span className="font-semibold text-navy">Persona: </span>{pack.persona}</p>
          {block.var[segment] && (
            <p className="text-sm"><span className="font-semibold text-navy">For {segment}: </span>{block.var[segment]}</p>
          )}
          <Link href={`/academy/cases/${segment}`} className="text-xs font-semibold text-sodexo hover:underline">Open the full case pack →</Link>
        </div>

        <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-sodexo">Situation</p>
        <p className="mt-1">{block.exercise.situation}</p>
        <div className="mt-4 space-y-4">
          {block.exercise.questions.map((question, i) => (
            <label key={question} className="block">
              <span className="text-sm font-semibold text-navy">{i + 1}. {question}</span>
              <textarea
                value={answers[i]}
                onChange={(e) => {
                  const value = e.target.value;
                  update((s) => ({ ...s, drafts: { ...s.drafts, [draftKey(i)]: value } }));
                }}
                rows={3}
                placeholder="Your answer — short, specific, linked to the evidence."
                className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-sodexo"
              />
            </label>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!ready && !submitted}
            onClick={() => {
              award(submittedKey, ACTIVITY_XP.exercise, `Exercise: ${block.name}`);
              setReveal(true);
            }}
            className="rounded-xl bg-sodexo px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            {submitted ? "Submitted — view model answer" : "Submit my answers"}
          </button>
          {!ready && !submitted && <span className="text-xs text-muted">Write at least {MIN_CHARS} characters per question to unlock the model answer.</span>}
          <span className="text-xs text-muted">Answers are saved on this device.</span>
        </div>
      </div>

      {(reveal || submitted) && (
        <div className="animate-rise rounded-3xl border border-s05/40 bg-[#effaf4] p-6">
          <h4 className="flex items-center gap-2 font-bold !text-s05"><Eye size={18} /> Model answer</h4>
          <p className="mt-2 text-sm">{block.answer_key.sample_answer}</p>
          <p className="mt-4 text-sm font-semibold text-navy">Success criteria</p>
          <p className="text-sm">{block.answer_key.success_criteria}</p>
          <div className="mt-4">
            <p className="text-sm font-semibold text-navy">Does your answer meet the criteria?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Yes", "Partly", "Not yet"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReflection(r)}
                  aria-pressed={reflection === r}
                  className={cn("rounded-full border px-3 py-1 text-xs font-semibold", reflection === r ? "border-navy bg-navy text-white" : "border-line bg-white text-navy")}
                >
                  {r}
                </button>
              ))}
            </div>
            {reflection && reflection !== "Yes" && (
              <p className="mt-3 flex items-start gap-2 text-sm text-ink">
                <Lightbulb size={16} className="mt-0.5 shrink-0 text-gold" />
                Revisit the common mistakes on the Method tab: {block.mistakes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
