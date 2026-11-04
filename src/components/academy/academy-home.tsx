"use client";

import { ArrowRight, Flame, FlaskConical, Headphones, Library, PlayCircle, Sparkles, Swords, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BrandPanel } from "@/components/platform/brand";
import { blockTone, campus } from "@/lib/academy/campus";
import { dailyChallenge, type Challenge } from "@/lib/academy/extras";
import { blockProgress, completedBlocks, rankFor } from "@/lib/academy/gamification";

import { Avatar } from "./avatar";
import { CampusMap } from "./campus-map";
import { ChallengeCard } from "./challenge-card";
import { ProfileEditor } from "./profile-editor";
import { useProgress } from "./progress-provider";
import { LevelBar, ProgressRing, TypeTag } from "./ui";

const QUICK = [
  { href: "/academy/media", icon: Headphones, title: "Watch & listen", text: "35 motion explainers and 35 two-voice podcasts.", tone: "#8e5cc8" },
  { href: "/academy/lab", icon: FlaskConical, title: "Agent Lab", text: "Try CoDesign OS agents and prompts on fictional cases.", tone: "#2ea36a" },
  { href: "/academy/credentials", icon: Library, title: "Credential Quest", text: "Search real credentials and build a winning shortlist.", tone: "#1a6aff" },
  { href: "/academy/challenges", icon: Swords, title: "Scenario challenges", text: "Twelve real-life dilemmas with instant feedback.", tone: "#ec6a1e" },
];

export function AcademyHome() {
  const { state, ready, badges } = useProgress();
  const [daily, setDaily] = useState<Challenge | null>(null);
  const [editing, setEditing] = useState(false);
  useEffect(() => setDaily(dailyChallenge(new Date())), []);

  const rank = rankFor(state.xp);
  const ids = campus.blocks.map((b) => b.id);
  const done = completedBlocks(state, ids);
  const next = campus.blocks.filter((b) => !blockProgress(state, b.id).complete).slice(0, 3);
  const earned = badges.filter((b) => b.has);
  const hasProfile = ready && state.profile.name.length > 0;

  return (
    <main>
      <BrandPanel className="pb-10 pt-10 md:pb-14 md:pt-14" seed={5}>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/75">CoDesign Academy · v2</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight !text-white md:text-5xl">
              {hasProfile ? `Welcome back, ${state.profile.name}.` : "Learn CoDesign by doing."}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/85">
              35 method blocks, each with a card, a motion explainer, a podcast, a quiz and a hands-on exercise. Earn XP, unlock badges and practise with CoDesign OS agents.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {next[0] && (
                <Link href={`/academy/blocks/${next[0].id}`} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-navy shadow-lg transition hover:-translate-y-0.5">
                  <PlayCircle size={18} /> {done.length === 0 ? "Start with" : "Continue:"} {next[0].id} {next[0].name}
                </Link>
              )}
              <Link href="/academy/paths" className="inline-flex items-center gap-2 rounded-xl border border-white/50 px-4 py-3 font-semibold text-white hover:bg-white/10">
                Pick a learning path <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white/12 p-5 ring-1 ring-white/25 backdrop-blur">
            {ready && (!hasProfile || editing) ? (
              <div className="rounded-2xl bg-white p-4 text-ink">
                <p className="mb-3 font-bold text-navy">Create your learner profile <span className="text-sm font-normal text-muted">(+10 XP)</span></p>
                <ProfileEditor compact onDone={() => setEditing(false)} />
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4">
                  <Avatar choice={state.profile.avatar} size={64} />
                  <div>
                    <p className="text-sm text-white/80">{state.profile.role}</p>
                    <p className="font-display text-2xl font-bold">{rank.current.name}</p>
                    <button type="button" onClick={() => setEditing(true)} className="text-xs text-white/80 underline">Edit profile</button>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">{state.xp} XP</span>
                    <span className="text-white/80">{rank.next ? `${rank.next.min - state.xp} XP to ${rank.next.name}` : "Top rank"}</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full rounded-full bg-gold transition-[width] duration-700" style={{ width: `${rank.progress * 100}%` }} />
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-white/10 p-3">
                    <Flame size={18} className="mx-auto text-gold" />
                    <p className="mt-1 text-xl font-bold">{state.streak.count}</p>
                    <p className="text-[11px] text-white/75">day streak</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3">
                    <Sparkles size={18} className="mx-auto text-gold" />
                    <p className="mt-1 text-xl font-bold">{done.length}/35</p>
                    <p className="text-[11px] text-white/75">blocks done</p>
                  </div>
                  <Link href="/academy/me" className="rounded-xl bg-white/10 p-3 hover:bg-white/20">
                    <Trophy size={18} className="mx-auto text-gold" />
                    <p className="mt-1 text-xl font-bold">{earned.length}</p>
                    <p className="text-[11px] text-white/75">badges</p>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </BrandPanel>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 md:px-6">
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-bold">Your campus map</h2>
            <Link href="/academy/learn" className="text-sm font-semibold text-sodexo hover:underline">Browse all 35 blocks →</Link>
          </div>
          <CampusMap />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="min-w-0">
            <h2 className="mb-4 text-2xl font-bold">Up next for you</h2>
            <div className="space-y-3">
              {next.map((block) => {
                const p = blockProgress(state, block.id);
                return (
                  <Link
                    key={block.id}
                    href={`/academy/blocks/${block.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-sodexo hover:shadow-md"
                  >
                    <ProgressRing value={p.ratio} color={blockTone(block)}>{p.done.length}/5</ProgressRing>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted">{block.id}</span>
                        <TypeTag block={block} />
                      </div>
                      <p className="truncate font-semibold text-navy">{block.name}</p>
                      <p className="truncate text-sm text-muted">{block.explain}</p>
                    </div>
                    <div className="hidden sm:block"><LevelBar level={block.lvl} compact /></div>
                    <ArrowRight size={18} className="text-sodexo transition group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-bold">Today&apos;s challenge</h2>
            {daily ? <ChallengeCard challenge={daily} daily /> : <div className="h-64 rounded-3xl bg-panel" />}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Ways to learn</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK.map((q) => {
              const Icon = q.icon;
              return (
                <Link key={q.href} href={q.href} className="group rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: q.tone }}>
                    <Icon size={20} />
                  </span>
                  <p className="mt-4 font-bold text-navy">{q.title}</p>
                  <p className="mt-1 text-sm text-muted">{q.text}</p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
