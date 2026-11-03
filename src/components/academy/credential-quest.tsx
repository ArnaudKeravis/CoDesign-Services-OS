"use client";

import { CheckCircle2, Search, Target, X } from "lucide-react";
import { useMemo, useState } from "react";

import { CredentialTile } from "@/components/credentials/credential-tile";
import { SEGMENT_TONE } from "@/lib/academy/campus";
import { cn } from "@/lib/academy/cn";
import { quests, scoreQuest, type Quest } from "@/lib/academy/extras";
import { ACTIVITY_XP } from "@/lib/academy/gamification";
import { credentialById, searchCredentials } from "@/lib/credentials";

import { useProgress } from "./progress-provider";

function QuestBoard({ quest, onExit }: { quest: Quest; onExit: () => void }) {
  const { award } = useProgress();
  const [query, setQuery] = useState("");
  const [picks, setPicks] = useState<string[]>([]);
  const [why, setWhy] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; max: number } | null>(null);
  const results = useMemo(() => searchCredentials({ query }).slice(0, 12), [query]);
  const ready = picks.length === 3 && picks.every((id) => (why[id] ?? "").trim().length >= 15);

  const toggle = (id: string) => {
    if (result) return;
    setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < 3 ? [...p, id] : p));
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-line bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: SEGMENT_TONE[quest.segment] }}>{quest.segment}</span>
            <h2 className="mt-2 text-2xl font-bold">{quest.title}</h2>
          </div>
          <button type="button" onClick={onExit} className="rounded-lg p-2 hover:bg-panel" aria-label="Leave quest"><X size={18} /></button>
        </div>
        <p className="mt-2">{quest.brief}</p>
        <p className="mt-2 font-semibold text-navy">{quest.ask} For each, write why it is relevant (one sentence).</p>
        <p className="mt-1 text-xs text-muted">The brief is fictional. The credentials are real — figures stay internal.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div>
          <label className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-2.5 focus-within:border-sodexo">
            <Search size={18} className="text-muted" />
            <span className="sr-only">Search credentials</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the library: sector, moment, deliverable…" className="w-full bg-transparent outline-none" />
          </label>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {results.map((c) => (
              <button key={c.id} type="button" onClick={() => toggle(c.id)} className="text-left" aria-pressed={picks.includes(c.id)}>
                <CredentialTile credential={c} selected={picks.includes(c.id)} compact />
              </button>
            ))}
          </div>
        </div>
        <aside className="h-fit space-y-3 rounded-3xl bg-panel p-5 lg:sticky lg:top-36">
          <p className="flex items-center gap-2 font-bold text-navy"><Target size={18} /> Your shortlist ({picks.length}/3)</p>
          {picks.length === 0 && <p className="text-sm text-muted">Click credentials to add them.</p>}
          {picks.map((id) => {
            const c = credentialById(id)!;
            const strong = quest.strong.includes(id);
            const ok = quest.acceptable.includes(id);
            return (
              <div key={id} className={cn("rounded-xl bg-white p-3", result && (strong ? "ring-2 ring-s05" : ok ? "ring-2 ring-gold" : "ring-2 ring-star"))}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-navy">{c.client}</p>
                  {!result && <button type="button" onClick={() => toggle(id)} className="text-xs text-muted hover:text-star">Remove</button>}
                  {result && <span className="text-xs font-bold">{strong ? "Strong +10" : ok ? "Acceptable +5" : "Weak 0"}</span>}
                </div>
                <textarea
                  value={why[id] ?? ""}
                  onChange={(e) => setWhy((w) => ({ ...w, [id]: e.target.value }))}
                  disabled={Boolean(result)}
                  rows={2}
                  placeholder="Why is it relevant to this brief?"
                  className="mt-2 w-full rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-sodexo"
                />
              </div>
            );
          })}
          {!result ? (
            <button
              type="button"
              disabled={!ready}
              onClick={() => {
                const r = scoreQuest(quest, picks);
                setResult(r);
                award(`quest:${quest.id}`, Math.round((ACTIVITY_XP.quest * r.score) / r.max) + 10, `Credential Quest: ${quest.title}`);
              }}
              className="w-full rounded-xl bg-navy px-4 py-2.5 font-semibold text-white disabled:opacity-40"
            >
              Submit shortlist
            </button>
          ) : (
            <div className="animate-pop rounded-xl bg-white p-4">
              <p className="font-display text-3xl font-bold text-navy">{result.score}/{result.max}</p>
              <p className="mt-2 text-sm">{quest.lesson}</p>
              <p className="mt-3 text-xs font-semibold text-muted">Strong picks for this brief:</p>
              <ul className="mt-1 text-sm">
                {quest.strong.map((id) => (
                  <li key={id} className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-s05" /> {credentialById(id)?.client} — {credentialById(id)?.title}</li>
                ))}
              </ul>
              <button type="button" onClick={() => { setResult(null); setPicks([]); setWhy({}); }} className="mt-3 text-xs font-semibold text-sodexo hover:underline">Try again</button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export function CredentialQuest() {
  const { state } = useProgress();
  const [active, setActive] = useState<Quest | null>(null);
  if (active) return <QuestBoard quest={active} onExit={() => setActive(null)} />;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {quests.map((q) => {
        const done = Boolean(state.awarded[`quest:${q.id}`]);
        return (
          <button
            key={q.id}
            type="button"
            onClick={() => setActive(q)}
            className="group rounded-3xl border border-line bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-sodexo hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: SEGMENT_TONE[q.segment] }}>{q.segment}</span>
              {done && <CheckCircle2 size={18} className="text-s05" aria-label="Done" />}
            </div>
            <h3 className="mt-3 text-lg font-bold">{q.title}</h3>
            <p className="mt-1 line-clamp-3 text-sm text-muted">{q.brief}</p>
            <p className="mt-3 text-sm font-semibold text-sodexo">Start quest · up to {ACTIVITY_XP.quest + 10} XP →</p>
          </button>
        );
      })}
    </div>
  );
}
