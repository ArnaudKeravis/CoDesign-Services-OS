"use client";

import { ArrowDown, ArrowUp, CheckCircle2, RotateCcw, Trophy, XCircle } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/academy/cn";
import type { QuizQuestion } from "@/lib/academy/learning";

export function Quiz({
  questions,
  onFinish,
}: {
  questions: QuizQuestion[];
  onFinish: (score: number, total: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const q = questions[index];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      setFinished(true);
      onFinish(score, questions.length);
    }
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const perfect = score === questions.length;
    return (
      <div className="animate-pop rounded-3xl border border-line bg-white p-8 text-center">
        <Trophy size={40} className={cn("mx-auto", perfect ? "text-gold" : "text-sodexo")} />
        <p className="mt-3 font-display text-4xl font-bold text-navy">
          {score}/{questions.length}
        </p>
        <p className="mt-1 text-muted">
          {perfect ? "Perfect score. Badge progress: Quiz ace." : score >= 3 ? "Well done — quiz passed." : "Not yet. Re-read the method card and try again."}
        </p>
        <button type="button" onClick={restart} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-semibold text-navy hover:border-sodexo">
          <RotateCcw size={16} /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-6">
      <div className="flex items-center justify-between text-xs font-semibold text-muted">
        <span>Question {index + 1} of {questions.length}</span>
        <span>Score {score}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-panel">
        <div className="h-full rounded-full bg-sodexo transition-[width]" style={{ width: `${(index / questions.length) * 100}%` }} />
      </div>
      <h4 className="mt-5 text-lg font-bold">{q.prompt}</h4>
      <div className="mt-4 grid gap-2">
        {q.options.map((option, i) => {
          const show = picked !== null;
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={show}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                !show && "border-line hover:border-sodexo hover:bg-panel",
                show && i === q.answer && "border-s05 bg-[#effaf4]",
                show && picked === i && i !== q.answer && "border-star bg-[#fdeff0]",
                show && picked !== i && i !== q.answer && "border-line opacity-55",
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-panel text-xs font-bold text-navy">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{option}</span>
              {show && i === q.answer && <CheckCircle2 size={18} className="shrink-0 text-s05" />}
              {show && picked === i && i !== q.answer && <XCircle size={18} className="shrink-0 text-star" />}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-4 flex animate-rise flex-col gap-3 rounded-xl bg-panel p-4 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            <span className="font-bold text-navy">{picked === q.answer ? "Correct. " : "Not quite. "}</span>
            {q.explain}
          </p>
          <button type="button" onClick={next} className="shrink-0 rounded-xl bg-navy px-4 py-2 font-semibold text-white">
            {index < questions.length - 1 ? "Next question" : "See my score"}
          </button>
        </div>
      )}
    </div>
  );
}

export function StepsOrder({
  steps,
  shuffled,
  onSolved,
}: {
  steps: string[];
  shuffled: string[];
  onSolved: () => void;
}) {
  const [order, setOrder] = useState(shuffled);
  const [checked, setChecked] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const solved = checked && order.every((step, i) => step === steps[i]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setOrder(next);
    setChecked(false);
  };

  return (
    <div className="rounded-3xl border border-line bg-white p-6">
      <h4 className="text-lg font-bold">Put the process in the right order</h4>
      <p className="mt-1 text-sm text-muted">Drag the cards, or use the arrows. Then check.</p>
      <ol className="mt-4 space-y-2">
        {order.map((step, i) => {
          const ok = checked && step === steps[i];
          return (
            <li
              key={step}
              draggable
              onDragStart={() => setDragging(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragging !== null) move(dragging, i);
                setDragging(null);
              }}
              className={cn(
                "flex cursor-grab items-center gap-3 rounded-xl border bg-white px-3 py-2.5 text-sm transition active:cursor-grabbing",
                checked ? (ok ? "border-s05 bg-[#effaf4]" : "border-star bg-[#fdeff0]") : "border-line",
                dragging === i && "opacity-50",
              )}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sodexo text-xs font-bold text-white">{i + 1}</span>
              <span className="flex-1">{step}</span>
              <span className="flex gap-1">
                <button type="button" onClick={() => move(i, i - 1)} className="rounded p-1 hover:bg-panel" aria-label={`Move “${step}” up`}>
                  <ArrowUp size={15} />
                </button>
                <button type="button" onClick={() => move(i, i + 1)} className="rounded p-1 hover:bg-panel" aria-label={`Move “${step}” down`}>
                  <ArrowDown size={15} />
                </button>
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setChecked(true);
            if (order.every((step, i) => step === steps[i])) onSolved();
          }}
          className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white"
        >
          Check order
        </button>
        {checked && (
          <span className={cn("text-sm font-semibold", solved ? "text-s05" : "text-star")} aria-live="polite">
            {solved ? "Spot on — that's the method." : `${order.filter((s, i) => s === steps[i]).length}/${steps.length} in place. Keep going.`}
          </span>
        )}
      </div>
    </div>
  );
}
