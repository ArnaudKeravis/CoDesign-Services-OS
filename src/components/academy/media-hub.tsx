"use client";

import { CheckCircle2, Headphones, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SECTION_TONE } from "@/lib/academy/campus";
import { cn } from "@/lib/academy/cn";
import { ACTIVITY_XP, activityKey } from "@/lib/academy/gamification";
import type { PodcastLine, VideoScene } from "@/lib/academy/learning";

import { PodcastPlayer } from "./podcast-player";
import { useProgress } from "./progress-provider";
import { VideoPlayer } from "./video-player";

export type MediaItem = {
  id: string;
  name: string;
  section: string;
  tone: string;
  explain: string;
  minutes: number;
  videoSeconds: number;
  lines: PodcastLine[];
  scenes: VideoScene[];
};

export function MediaHub({ items }: { items: MediaItem[] }) {
  const { state, award } = useProgress();
  const [kind, setKind] = useState<"video" | "podcast">("video");
  const [section, setSection] = useState("all");
  const [current, setCurrent] = useState(items[0]);

  const visible = items.filter((i) => section === "all" || i.section === section);
  const done = (id: string) => Boolean(state.awarded[activityKey(id, kind)]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-full bg-panel p-1" role="tablist" aria-label="Media type">
          {(["video", "podcast"] as const).map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={kind === k}
              onClick={() => setKind(k)}
              className={cn("flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition", kind === k ? "bg-navy text-white" : "text-navy")}
            >
              {k === "video" ? <PlayCircle size={16} /> : <Headphones size={16} />}
              {k === "video" ? "Motion explainers" : "Podcasts"}
            </button>
          ))}
        </div>
        <select value={section} onChange={(e) => setSection(e.target.value)} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm" aria-label="Section">
          <option value="all">All sections</option>
          {Object.entries(SECTION_TONE).map(([code, t]) => (
            <option key={code} value={code}>{code} {t.short}</option>
          ))}
        </select>
        <span className="ml-auto text-sm text-muted">
          {items.filter((i) => done(i.id)).length}/{items.length} {kind === "video" ? "watched" : "heard"}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div key={`${kind}-${current.id}`}>
          {kind === "video" ? (
            <VideoPlayer
              scenes={current.scenes}
              tone={current.tone}
              onComplete={() => award(activityKey(current.id, "video"), ACTIVITY_XP.video, `Explainer: ${current.name}`)}
            />
          ) : (
            <PodcastPlayer
              title={`${current.id} ${current.name}`}
              lines={current.lines}
              minutes={current.minutes}
              onComplete={() => award(activityKey(current.id, "podcast"), ACTIVITY_XP.podcast, `Podcast: ${current.name}`)}
            />
          )}
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-navy">{current.id} {current.name}</p>
              <p className="text-sm text-muted">{current.explain}</p>
            </div>
            <Link href={`/academy/blocks/${current.id}#practice`} className="shrink-0 rounded-xl bg-sodexo px-3 py-2 text-sm font-semibold text-white">Practise it →</Link>
          </div>
        </div>
        <ol className="max-h-[640px] space-y-2 overflow-y-auto pr-1" aria-label="Episodes">
          {visible.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setCurrent(item)}
                aria-current={current.id === item.id}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition",
                  current.id === item.id ? "border-sodexo bg-panel-2" : "border-line bg-white hover:border-sodexo",
                )}
              >
                <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: item.tone }}>
                  {kind === "video" ? <PlayCircle size={20} /> : <Headphones size={20} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[11px] text-muted">{item.id} · {kind === "video" ? `${Math.max(1, Math.round(item.videoSeconds / 60))} min` : `${item.minutes} min`}</span>
                  <span className="block truncate text-sm font-semibold text-navy">{item.name}</span>
                </span>
                {done(item.id) && <CheckCircle2 size={18} className="shrink-0 text-s05" aria-label="Done" />}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
