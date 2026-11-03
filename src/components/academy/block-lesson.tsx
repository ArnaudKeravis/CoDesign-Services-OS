"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  Gauge,
  Headphones,
  Library,
  PenLine,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CopyButton } from "@/components/platform/copy-button";
import { campus, SEGMENT_TONE, templateNeedsWork } from "@/lib/academy/campus";
import { cn } from "@/lib/academy/cn";
import { ACTIVITY_XP, activityKey, blockProgress, BLOCK_ACTIVITIES } from "@/lib/academy/gamification";
import type { PodcastLine, PromptTemplate, QuizQuestion, VideoScene } from "@/lib/academy/learning";
import type { MethodBlock, Segment } from "@/lib/academy/types";
import { credentialImage, type Credential } from "@/lib/credentials";

import { Exercise } from "./exercise";
import { PodcastPlayer } from "./podcast-player";
import { useProgress } from "./progress-provider";
import { Quiz, StepsOrder } from "./quiz";
import { LevelBar, Panel, ProgressRing, SectionPill, TypeTag } from "./ui";
import { VideoPlayer } from "./video-player";

type Tab = "method" | "media" | "practice" | "examples" | "ai" | "check";

const TABS: { id: Tab; label: string; lane: string; icon: typeof BookOpen }[] = [
  { id: "method", label: "Method", lane: "A", icon: BookOpen },
  { id: "media", label: "Watch & listen", lane: "B", icon: Headphones },
  { id: "practice", label: "Practice", lane: "C", icon: PenLine },
  { id: "examples", label: "Examples & credentials", lane: "D", icon: Library },
  { id: "ai", label: "AI & tools", lane: "E", icon: Bot },
  { id: "check", label: "Self-check", lane: "F", icon: Gauge },
];

const ACTIVITY_LABEL: Record<(typeof BLOCK_ACTIVITIES)[number], string> = {
  read: "Card read",
  video: "Explainer watched",
  podcast: "Podcast heard",
  quiz: "Quiz passed",
  exercise: "Exercise submitted",
};

export type BlockLessonProps = {
  block: MethodBlock;
  tone: string;
  prev?: { id: string; name: string };
  next?: { id: string; name: string };
  quiz: QuizQuestion[];
  steps: string[];
  scenes: VideoScene[];
  podcast: PodcastLine[];
  podcastMinutes: number;
  videoSeconds: number;
  prompt: PromptTemplate | null;
  checks: string[];
  credentials: Credential[];
};

function MethodTab({ block, tone }: { block: MethodBlock; tone: string }) {
  const { award, state } = useProgress();
  const read = Boolean(state.awarded[activityKey(block.id, "read")]);
  const [segment, setSegment] = useState<Segment>(block.primary);
  return (
    <div className="space-y-5">
      <p className="text-lg italic text-sodexo">{block.obj}</p>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-sodexo">Process</p>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {block.steps.map((step, i) => (
            <li key={step} className="flex items-start gap-3 rounded-xl bg-panel p-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: tone }}>{i + 1}</span>
              <span className="text-sm font-medium text-navy">{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Who does what">
          <ul className="space-y-1.5 text-sm">
            {block.who.split(/\s·\s/).map((w) => <li key={w}>{w}</li>)}
          </ul>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-sodexo">Accountable</p>
          <p className="text-sm">{block.acc}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-sodexo">When</p>
          <p className="text-sm">{block.when}</p>
        </Panel>
        <Panel title="Inputs">
          <p className="text-sm">{block.inputs}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-sodexo">Output</p>
          <p className="text-sm">{block.output}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-sodexo">Quality criteria</p>
          <p className="text-sm">{block.quality}</p>
        </Panel>
        <Panel title="Minimum standard">
          <p className="text-sm">{block.std}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-sodexo">Hand-off</p>
          <p className="text-sm">{block.handoff}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-sodexo">Related tools</p>
          <p className="text-sm">{block.tools}</p>
        </Panel>
      </div>
      <div className="flex items-start gap-3 rounded-2xl border border-[#f4c7c8] bg-[#fdf3f3] p-4">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-star" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-star">Common mistakes</p>
          <p className="text-sm">{block.mistakes}</p>
        </div>
      </div>
      <div className="rounded-2xl bg-panel p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Example by segment</p>
          <div className="flex gap-1">
            {campus.segments.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSegment(s)}
                aria-pressed={segment === s}
                className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold", segment === s ? "text-white" : "bg-white text-navy")}
                style={segment === s ? { background: SEGMENT_TONE[s] } : undefined}
              >
                {s}{s === block.primary ? " ★" : ""}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm italic">{segment === block.primary ? block.example : block.var[segment] ?? "No variant written yet for this segment — to add (owner Diane)."}</p>
      </div>
      <div className="rounded-2xl border border-sodexo/30 bg-panel-2 px-5 py-4">
        <span className="mr-3 text-xs font-bold uppercase tracking-wider text-sodexo">Principle</span>
        <span className="font-semibold italic text-navy">{block.explain}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => award(activityKey(block.id, "read"), ACTIVITY_XP.read, `Read: ${block.name}`)}
          disabled={read}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:bg-s05"
        >
          <CheckCircle2 size={16} /> {read ? "Card read" : `I've read this card (+${ACTIVITY_XP.read} XP)`}
        </button>
        <a href={block.miro_frame_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-sodexo hover:underline">
          Open the Miro frame <ArrowUpRight size={14} />
        </a>
        {block.deck && <span className="text-xs text-muted">Deck refs: {block.deck}</span>}
      </div>
    </div>
  );
}

function MediaTab(props: BlockLessonProps) {
  const { award } = useProgress();
  const { block } = props;
  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h3 className="text-xl font-bold">Motion explainer</h3>
          <span className="text-xs text-muted">{props.scenes.length} scenes · ~{Math.round(props.videoSeconds / 60) || 1} min · +{ACTIVITY_XP.video} XP</span>
        </div>
        <VideoPlayer
          scenes={props.scenes}
          tone={props.tone}
          onComplete={() => award(activityKey(block.id, "video"), ACTIVITY_XP.video, `Explainer: ${block.name}`)}
        />
        <p className="mt-2 text-xs text-muted">Animated from the method card with browser narration. Filmed video with a practitioner: to add (owner Diane).</p>
      </section>
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h3 className="text-xl font-bold">Podcast</h3>
          <span className="text-xs text-muted">+{ACTIVITY_XP.podcast} XP</span>
        </div>
        <PodcastPlayer
          title={`${block.id} ${block.name}`}
          lines={props.podcast}
          minutes={props.podcastMinutes}
          onComplete={() => award(activityKey(block.id, "podcast"), ACTIVITY_XP.podcast, `Podcast: ${block.name}`)}
        />
      </section>
    </div>
  );
}

function PracticeTab(props: BlockLessonProps) {
  const { award, update } = useProgress();
  const { block } = props;
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-xl font-bold">Quick check <span className="text-sm font-normal text-muted">· pass with 3/{props.quiz.length} · +{ACTIVITY_XP.quiz} XP</span></h3>
        <Quiz
          questions={props.quiz}
          onFinish={(score) => {
            update((s) => ({ ...s, quiz: { ...s.quiz, [block.id]: Math.max(s.quiz[block.id] ?? 0, score) } }));
            if (score >= 3) award(activityKey(block.id, "quiz"), ACTIVITY_XP.quiz, `Quiz: ${block.name}`);
          }}
        />
      </div>
      {props.steps.length > 2 && (
        <StepsOrder
          steps={block.steps}
          shuffled={props.steps}
          onSolved={() => award(activityKey(block.id, "steps"), ACTIVITY_XP.steps, `Process order: ${block.name}`)}
        />
      )}
      <Exercise block={block} />
    </div>
  );
}

function ExamplesTab({ block, credentials }: BlockLessonProps) {
  return (
    <div className="space-y-5">
      <Panel title="Worked example">
        <p className="text-sm italic">{block.example}</p>
      </Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        {campus.segments.map((s) =>
          block.var[s] ? (
            <div key={s} className="rounded-2xl border border-line p-4">
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: SEGMENT_TONE[s] }}>{s}</span>
              <p className="mt-2 text-sm">{block.var[s]}</p>
            </div>
          ) : null,
        )}
      </div>
      <div>
        <h3 className="text-xl font-bold">Credentials that illustrate this block</h3>
        <p className="mt-1 text-sm text-muted">{block.cred}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {credentials.map((c) => (
            <Link key={c.id} href={`/academy/credentials?id=${c.id}`} className="group overflow-hidden rounded-2xl border border-line bg-white transition hover:shadow-md">
              <div className="relative aspect-[16/9] bg-panel">
                <Image src={credentialImage(c)} alt="" fill sizes="25vw" className="object-cover object-top" />
              </div>
              <div className="p-3">
                <p className="font-bold text-navy">{c.client}</p>
                <p className="line-clamp-2 text-xs text-muted">{c.title}</p>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/academy/credentials" className="mt-3 inline-block text-sm font-semibold text-sodexo hover:underline">Search all credentials →</Link>
      </div>
    </div>
  );
}

function AiTab({ block, prompt, checks }: BlockLessonProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="CoDesign OS agents">
          {block.os_agents.length === 0 ? (
            <p className="text-sm text-muted">No dedicated agent for this block. Use the generic prompt below.</p>
          ) : (
            <ul className="space-y-2">
              {block.os_agents.map((a) => (
                <li key={a.url} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-navy"><Bot size={16} className="text-sodexo" /> {a.name}</span>
                  <span className="flex gap-2">
                    <Link href={`/academy/lab?block=${block.id}`} className="inline-flex items-center gap-1 rounded-lg bg-sodexo px-2.5 py-1 text-xs font-semibold text-white">
                      <FlaskConical size={13} /> Try in Lab
                    </Link>
                    <a href={a.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-navy">
                      OS <ArrowUpRight size={12} />
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Human checks before reuse">
          <ul className="space-y-1.5 text-sm">
            {checks.map((c) => (
              <li key={c} className="flex gap-2"><ClipboardCheck size={15} className="mt-0.5 shrink-0 text-s05" /> {c}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-sodexo">Manual fallback</p>
          <p className="text-sm">{block.fallback}</p>
        </Panel>
      </div>
      {prompt && (
        <div className="rounded-2xl border border-line p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold">Prompt</h3>
            <div className="flex gap-2">
              <CopyButton text={prompt.template} />
              <Link href={`/academy/lab?block=${block.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-2.5 py-1 text-xs font-semibold text-white">
                <FlaskConical size={13} /> Fill it in the Lab
              </Link>
            </div>
          </div>
          {prompt.intro && <p className="mt-1 text-xs text-muted">{prompt.intro}</p>}
          <p className="mt-3 whitespace-pre-wrap rounded-xl bg-panel p-4 font-mono text-[13px] leading-relaxed">{prompt.template}</p>
        </div>
      )}
      <Panel title="Templates & resources">
        <ul className="space-y-1.5 text-sm">
          {block.templates.map((t) => (
            <li key={t.label} className="flex flex-wrap items-center gap-2">
              {t.url && !templateNeedsWork(t.label) ? (
                <a href={t.url} target="_blank" rel="noreferrer" className="font-medium text-sodexo hover:underline">{t.label} ↗</a>
              ) : (
                <span className="text-muted">{t.label}</span>
              )}
              {templateNeedsWork(t.label) && <span className="rounded bg-[#fff6ef] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#a4470f]">Gap</span>}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">SharePoint links need a Sodexo account.</p>
      </Panel>
    </div>
  );
}

function CheckTab({ block }: BlockLessonProps) {
  const { state, update, award } = useProgress();
  const current = state.selfAssess[block.id] ?? {};
  const set = (moment: "before" | "after", step: number) => {
    update((s) => ({ ...s, selfAssess: { ...s.selfAssess, [block.id]: { ...s.selfAssess[block.id], [moment]: step } } }));
    if (moment === "after") award(activityKey(block.id, "assess"), ACTIVITY_XP.assess, `Self-check: ${block.name}`);
  };
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        Rate yourself before you start and after you practise. This is a self-assessment: N3 and N4 are confirmed only by a coach observing real work with the rubric ({campus.rubric_dimensions.join(", ")}).
      </p>
      {(["before", "after"] as const).map((moment) => (
        <div key={moment}>
          <p className="mb-2 font-semibold text-navy">{moment === "before" ? "Before this block" : "After practising"}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {campus.maturity_scale.map((m) => (
              <button
                key={m.step}
                type="button"
                onClick={() => set(moment, m.step)}
                aria-pressed={current[moment] === m.step}
                className={cn(
                  "rounded-2xl border p-4 text-left transition",
                  current[moment] === m.step ? "border-sodexo bg-panel-2 ring-2 ring-sodexo/30" : "border-line bg-white hover:border-sodexo",
                )}
              >
                <p className="text-xs font-bold text-sodexo">Step {m.step} · maps to {m.maps_to}</p>
                <p className="mt-1 font-bold text-navy">{m.title}</p>
                <p className="mt-1 text-sm text-muted">{m.text}</p>
              </button>
            ))}
          </div>
        </div>
      ))}
      {current.before && current.after && (
        <p className="rounded-xl bg-[#effaf4] p-4 text-sm font-semibold text-s05">
          {current.after > current.before ? `You moved up ${current.after - current.before} step(s). ` : "Same step as before — that's honest. "}
          Next: try this block on a real engagement with a coach to get it observed.
        </p>
      )}
    </div>
  );
}

export function BlockLesson(props: BlockLessonProps) {
  const { block, tone, prev, next } = props;
  const [tab, setTabState] = useState<Tab>("method");
  const { state } = useProgress();

  useEffect(() => {
    const hash = window.location.hash.slice(1) as Tab;
    if (TABS.some((t) => t.id === hash)) setTabState(hash);
  }, [block.id]);

  const setTab = (next: Tab) => {
    setTabState(next);
    window.history.replaceState(null, "", next === "method" ? window.location.pathname : `#${next}`);
  };
  const progress = blockProgress(state, block.id);

  return (
    <main>
      <div className="relative overflow-hidden border-b border-line" style={{ background: `linear-gradient(135deg, ${tone}14 0%, #ffffff 60%)` }}>
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <Link href="/academy/learn" className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy">
            <ArrowLeft size={14} /> All blocks
          </Link>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <SectionPill code={block.id.slice(0, 2)} />
                <span className="font-mono text-sm font-semibold" style={{ color: tone }}>{block.id}</span>
                <TypeTag block={block} />
                <span className="text-sm text-muted">{block.sub}</span>
              </div>
              <h1 className="mt-3 text-3xl font-bold md:text-5xl">{block.name}</h1>
              <div className="mt-4"><LevelBar level={block.lvl} /></div>
              {block.type === "proposed_extension" && (
                <p className="mt-3 inline-block rounded-lg bg-proposed px-3 py-1 text-xs font-semibold text-white">Proposed extension — not yet validated by the method owners</p>
              )}
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
              <ProgressRing value={progress.ratio} size={58} stroke={6} color={tone}>
                {Math.round(progress.ratio * 100)}%
              </ProgressRing>
              <ul className="space-y-0.5 text-xs">
                {BLOCK_ACTIVITIES.map((a) => {
                  const done = progress.done.includes(a);
                  return (
                    <li key={a} className={cn("flex items-center gap-1.5", done ? "text-s05" : "text-muted")}>
                      <CheckCircle2 size={12} className={done ? "" : "opacity-30"} /> {ACTIVITY_LABEL[a]}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-[7.25rem] z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 md:px-6 [scrollbar-width:none]" role="tablist" aria-label="Lanes">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-semibold transition",
                  tab === t.id ? "border-sodexo text-navy" : "border-transparent text-muted hover:text-navy",
                )}
              >
                <span className="rounded bg-panel px-1 font-mono text-[10px] text-muted">{t.lane}</span>
                <Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6" role="tabpanel">
        {tab === "method" && <MethodTab block={block} tone={tone} />}
        {tab === "media" && <MediaTab {...props} />}
        {tab === "practice" && <PracticeTab {...props} />}
        {tab === "examples" && <ExamplesTab {...props} />}
        {tab === "ai" && <AiTab {...props} />}
        {tab === "check" && <CheckTab {...props} />}

        <nav className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-6" aria-label="Block navigation">
          {prev ? (
            <Link href={`/academy/blocks/${prev.id}`} className="group flex items-center gap-2 text-sm text-muted hover:text-navy">
              <ArrowLeft size={16} /> <span><span className="font-mono text-xs">{prev.id}</span> {prev.name}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link href={`/academy/blocks/${next.id}`} className="group flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white">
              Next: <span className="font-mono text-xs opacity-80">{next.id}</span> {next.name} <ArrowRight size={16} />
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
