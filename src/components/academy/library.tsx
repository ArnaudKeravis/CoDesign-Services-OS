"use client";

import { Bot, CheckCircle2, Headphones, PlayCircle, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { blockTone, campus, sectionCodeOf, SECTION_TONE } from "@/lib/academy/campus";
import { cn } from "@/lib/academy/cn";
import { blockProgress } from "@/lib/academy/gamification";
import type { LevelCode } from "@/lib/academy/types";

import { useProgress } from "./progress-provider";
import { LevelBar, ProgressRing, TypeTag } from "./ui";

type Status = "all" | "todo" | "doing" | "done";

export function Library() {
  const params = useSearchParams();
  const router = useRouter();
  const { state } = useProgress();
  const section = params.get("section") ?? "all";
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LevelCode | "all">("all");
  const [status, setStatus] = useState<Status>("all");

  const setSection = (code: string) => {
    router.replace(code === "all" ? "/academy/learn" : `/academy/learn?section=${code}`, { scroll: false });
  };

  const blocks = useMemo(() => {
    const q = query.toLowerCase().trim();
    return campus.blocks.filter((b) => {
      if (section !== "all" && sectionCodeOf(b.id) !== section) return false;
      if (level !== "all" && b.lvl !== level) return false;
      const p = blockProgress(state, b.id);
      if (status === "done" && !p.complete) return false;
      if (status === "doing" && (p.complete || p.done.length === 0)) return false;
      if (status === "todo" && p.done.length > 0) return false;
      if (!q) return true;
      return `${b.id} ${b.name} ${b.explain} ${b.obj} ${b.sub} ${b.tools}`.toLowerCase().includes(q);
    });
  }, [query, section, level, status, state]);

  return (
    <div>
      <div className="space-y-3 rounded-2xl border border-line bg-white p-4">
        <label className="flex items-center gap-3 rounded-xl bg-panel px-4 py-2.5 focus-within:ring-2 focus-within:ring-sodexo/40">
          <Search size={18} className="text-muted" aria-hidden />
          <span className="sr-only">Search blocks</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a block, a tool, a skill… e.g. “persona”, “Miro”, “prioritise”"
            className="w-full bg-transparent outline-none placeholder:text-muted"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSection("all")}
            aria-pressed={section === "all"}
            className={cn("rounded-full border px-3 py-1 text-xs font-semibold", section === "all" ? "border-navy bg-navy text-white" : "border-line text-navy")}
          >
            All sections
          </button>
          {campus.sections.map((s) => (
            <button
              key={s.code}
              type="button"
              onClick={() => setSection(s.code)}
              aria-pressed={section === s.code}
              className={cn("rounded-full border px-3 py-1 text-xs font-semibold transition", section === s.code ? "border-transparent text-white" : "border-line text-navy")}
              style={section === s.code ? { background: SECTION_TONE[s.code].bg } : undefined}
            >
              {s.code} {SECTION_TONE[s.code].short}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-muted">Level</span>
            <select value={level} onChange={(e) => setLevel(e.target.value as LevelCode | "all")} className="rounded-lg border border-line bg-white px-2 py-1">
              <option value="all">All</option>
              {campus.levels.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </label>
          <div className="flex gap-1" role="group" aria-label="Progress filter">
            {(["all", "todo", "doing", "done"] as Status[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                aria-pressed={status === s}
                className={cn("rounded-lg px-2.5 py-1 text-xs font-semibold", status === s ? "bg-sodexo text-white" : "bg-panel text-navy")}
              >
                {{ all: "All", todo: "Not started", doing: "In progress", done: "Completed" }[s]}
              </button>
            ))}
          </div>
          <span className="ml-auto text-muted" aria-live="polite">{blocks.length} blocks</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blocks.map((b, i) => {
          const p = blockProgress(state, b.id);
          const tone = blockTone(b);
          return (
            <Link
              key={b.id}
              href={`/academy/blocks/${b.id}`}
              className="group relative flex animate-rise flex-col overflow-hidden rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-sodexo hover:shadow-lg"
              style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
            >
              <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: tone }} aria-hidden />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold" style={{ color: tone }}>{b.id}</span>
                    <TypeTag block={b} />
                  </div>
                  <h3 className="mt-1 text-lg font-bold leading-tight">{b.name}</h3>
                </div>
                {p.complete ? (
                  <CheckCircle2 size={28} className="shrink-0 text-s05" aria-label="Completed" />
                ) : (
                  <ProgressRing value={p.ratio} size={38} stroke={4} color={tone}>{p.done.length}</ProgressRing>
                )}
              </div>
              <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{b.explain}</p>
              <div className="mt-4 flex items-center justify-between">
                <LevelBar level={b.lvl} compact />
                <span className="flex items-center gap-1.5 text-muted" aria-label="Includes video, podcast and agent">
                  <PlayCircle size={15} />
                  <Headphones size={15} />
                  {b.os_agents.length > 0 && <Bot size={15} className="text-sodexo" />}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
