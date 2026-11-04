"use client";

import { Headphones, Pause, Play, SkipBack } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/academy/cn";
import type { PodcastLine } from "@/lib/academy/learning";

import { pickVoices, speak, speechSupported, useVoices } from "./speech";

const SPEEDS = [0.9, 1, 1.15, 1.3];

export function PodcastPlayer({
  title,
  lines,
  minutes,
  onComplete,
}: {
  title: string;
  lines: PodcastLine[];
  minutes: number;
  onComplete?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [supported, setSupported] = useState(true);
  const voices = useVoices();
  const listRef = useRef<HTMLOListElement>(null);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => setSupported(speechSupported()), []);

  useEffect(() => {
    if (!playing) return;
    const line = lines[index];
    const { host, expert } = pickVoices(voices);
    let done = false;
    const next = () => {
      if (done) return;
      done = true;
      if (index < lines.length - 1) setIndex((i) => i + 1);
      else {
        setPlaying(false);
        completeRef.current?.();
      }
    };
    const words = line.text.split(/\s+/).length;
    const fallback = window.setTimeout(next, (words / (2.4 * speed)) * 1000 + 4000);
    const stop = speak(line.text, {
      voice: line.speaker === "host" ? host : expert,
      pitch: line.speaker === "host" ? 1.08 : 0.92,
      rate: speed,
      onEnd: next,
    });
    return () => {
      stop();
      window.clearTimeout(fallback);
    };
  }, [playing, index, speed, lines, voices]);

  useEffect(() => {
    const el = listRef.current?.children[index] as HTMLElement | undefined;
    if (playing && el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [index, playing]);

  useEffect(() => () => {
    if (speechSupported()) window.speechSynthesis.cancel();
  }, []);

  const progress = (index + (playing ? 0.5 : 0)) / lines.length;

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white">
      <div className="brand-gradient flex flex-wrap items-center gap-4 p-5 text-white">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
          <Headphones size={34} />
          {playing && (
            <span className="absolute -bottom-1 flex gap-0.5" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="w-1 animate-pulse rounded-full bg-gold" style={{ height: 6 + ((i * 7) % 10), animationDelay: `${i * 120}ms` }} />
              ))}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">CoDesign in five · podcast</p>
          <p className="truncate font-display text-xl font-bold">{title}</p>
          <p className="text-sm text-white/80">Alex (host) &amp; Sam (practitioner) · about {minutes} min</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { setIndex(0); setPlaying(false); }} className="rounded-full p-2 hover:bg-white/10" aria-label="Restart">
            <SkipBack size={18} />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            disabled={!supported}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy shadow-lg disabled:opacity-50"
            aria-label={playing ? "Pause podcast" : "Play podcast"}
          >
            {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded-lg bg-white/15 px-2 py-1 text-sm text-white"
            aria-label="Playback speed"
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s} className="text-navy">{s}×</option>
            ))}
          </select>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-gold transition-[width] duration-500" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      {!supported && (
        <p className="bg-panel px-5 py-2 text-xs text-muted">This browser has no built-in voice. Read the transcript below instead.</p>
      )}
      <ol ref={listRef} className="max-h-96 space-y-2 overflow-y-auto p-5" aria-label="Transcript">
        {lines.map((line, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "flex w-full gap-3 rounded-xl px-3 py-2 text-left text-sm transition",
                i === index ? "bg-panel-2 ring-1 ring-sodexo/30" : "hover:bg-panel",
              )}
            >
              <span className={cn("w-12 shrink-0 text-xs font-bold uppercase", line.speaker === "host" ? "text-sodexo" : "text-s04")}>
                {line.speaker === "host" ? "Alex" : "Sam"}
              </span>
              <span className={cn(i < index ? "text-muted" : "text-ink")}>{line.text}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-muted">
        <span>Script generated from the method card · voice by your browser · studio recording: to add (owner Diane)</span>
        <button type="button" onClick={() => completeRef.current?.()} className="font-semibold text-sodexo hover:underline">
          I read the transcript
        </button>
      </div>
    </div>
  );
}
