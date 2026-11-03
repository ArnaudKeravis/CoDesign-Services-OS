"use client";

import { Award, Download, Flame, Lock, RotateCcw } from "lucide-react";
import { useState } from "react";

import { blocksInSection, campus, SECTION_TONE } from "@/lib/academy/campus";
import { cn } from "@/lib/academy/cn";
import { glossary } from "@/lib/academy/extras";
import { ACTIVITY_XP, completedBlocks, RANKS, rankFor } from "@/lib/academy/gamification";

import { Avatar } from "./avatar";
import { ProfileEditor } from "./profile-editor";
import { useProgress } from "./progress-provider";

export function MyProgress() {
  const { state, badges, reset } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const rank = rankFor(state.xp);
  const done = completedBlocks(state, campus.blocks.map((b) => b.id));

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codesign-academy-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-3xl border border-line bg-white p-6">
          <div className="flex items-center gap-4">
            <Avatar choice={state.profile.avatar} size={72} />
            <div>
              <p className="font-display text-2xl font-bold text-navy">{state.profile.name || "Anonymous learner"}</p>
              <p className="text-sm text-muted">{state.profile.role || "Set your role below"}</p>
            </div>
          </div>
          <div className="mt-6"><ProfileEditor /></div>
        </section>

        <section className="rounded-3xl border border-line bg-white p-6">
          <h2 className="text-xl font-bold">Rank ladder</h2>
          <p className="text-sm text-muted">XP ranks reward learning activity. They are not N-levels.</p>
          <ol className="mt-4 space-y-2">
            {RANKS.map((r, i) => {
              const reached = state.xp >= r.min;
              const current = i === rank.index;
              return (
                <li key={r.name} className={cn("flex items-center gap-3 rounded-xl border px-3 py-2.5", current ? "border-sodexo bg-panel-2" : "border-line")}>
                  <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold", reached ? "bg-gold text-navy-deep" : "bg-panel text-muted")}>{i + 1}</span>
                  <span className="flex-1">
                    <span className="font-semibold text-navy">{r.name}</span>
                    <span className="block text-xs text-muted">{r.blurb}</span>
                  </span>
                  <span className="text-xs font-semibold text-muted">{r.min} XP</span>
                </li>
              );
            })}
          </ol>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-panel p-3"><p className="text-2xl font-bold text-navy">{state.xp}</p><p className="text-xs text-muted">XP</p></div>
            <div className="rounded-xl bg-panel p-3"><p className="flex items-center justify-center gap-1 text-2xl font-bold text-navy"><Flame size={18} className="text-s04" />{state.streak.best}</p><p className="text-xs text-muted">best streak</p></div>
            <div className="rounded-xl bg-panel p-3"><p className="text-2xl font-bold text-navy">{done.length}/35</p><p className="text-xs text-muted">blocks</p></div>
          </div>
        </section>
      </div>

      <section>
        <h2 className="text-2xl font-bold">Badges <span className="text-base font-normal text-muted">{badges.filter((b) => b.has).length}/{badges.length}</span></h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b) => (
            <div key={b.id} className={cn("flex items-center gap-3 rounded-2xl border p-4", b.has ? "border-transparent bg-white shadow-md" : "border-dashed border-line bg-panel/50")}>
              <span
                className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white", !b.has && "opacity-30 grayscale")}
                style={{ background: b.tone, clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }}
              >
                {b.has ? <Award size={20} /> : <Lock size={16} />}
              </span>
              <span>
                <span className={cn("block font-semibold", b.has ? "text-navy" : "text-muted")}>{b.name}</span>
                <span className="block text-xs text-muted">{b.description}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-white p-6">
          <h2 className="text-xl font-bold">Self-assessed maturity by section</h2>
          <p className="text-sm text-muted">Average of your “after” ratings (1 Not yet → 4 I could coach).</p>
          <div className="mt-4 space-y-3">
            {campus.sections.map((s) => {
              const ratings = blocksInSection(s.code).map((b) => state.selfAssess[b.id]?.after).filter((v): v is number => typeof v === "number");
              const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
              return (
                <div key={s.code}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-navy">{s.name}</span>
                    <span className="text-muted">{ratings.length ? `${avg.toFixed(1)} / 4 · ${ratings.length} rated` : "not rated"}</span>
                  </div>
                  <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-panel">
                    <div className="h-full rounded-full" style={{ width: `${(avg / 4) * 100}%`, background: SECTION_TONE[s.code].bg }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-white p-6">
          <h2 className="text-xl font-bold">Recent activity</h2>
          {state.history.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nothing yet. Read a method card to earn your first {ACTIVITY_XP.read} XP.</p>
          ) : (
            <ul className="mt-3 max-h-80 space-y-1.5 overflow-y-auto text-sm">
              {state.history.map((h) => (
                <li key={h.key} className="flex justify-between gap-3 rounded-lg px-2 py-1 hover:bg-panel">
                  <span className="text-navy">{h.label}</span>
                  <span className="shrink-0 font-semibold text-s05">+{h.xp}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={exportJson} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-navy">
              <Download size={14} /> Export my progress
            </button>
            {!confirmReset ? (
              <button type="button" onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-muted">
                <RotateCcw size={14} /> Reset
              </button>
            ) : (
              <button type="button" onClick={() => { reset(); setConfirmReset(false); }} className="rounded-lg bg-star px-3 py-1.5 text-xs font-semibold text-white">
                Confirm: erase all progress
              </button>
            )}
          </div>
        </div>
      </section>

      <section id="glossary" className="scroll-mt-32">
        <h2 className="text-2xl font-bold">Glossary</h2>
        <dl className="mt-4 grid gap-3 md:grid-cols-2">
          {glossary.map((g) => (
            <div key={g.term} className="rounded-2xl bg-panel p-4">
              <dt className="font-bold text-navy">{g.term}</dt>
              <dd className="mt-1 text-sm">{g.definition}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
