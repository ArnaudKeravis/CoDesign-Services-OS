"use client";

import { Captions, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Waves } from "@/components/platform/brand";
import { cn } from "@/lib/academy/cn";
import type { VideoScene } from "@/lib/academy/learning";

import { pickVoices, speak, speechSupported, useVoices } from "./speech";

export function VideoPlayer({
  scenes,
  tone,
  onComplete,
}: {
  scenes: VideoScene[];
  tone: string;
  onComplete?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [captions, setCaptions] = useState(true);
  const [ended, setEnded] = useState(false);
  const voices = useVoices();
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const scene = scenes[index];

  useEffect(() => {
    if (!playing) return;
    const advance = () => {
      if (index < scenes.length - 1) setIndex((i) => i + 1);
      else {
        setPlaying(false);
        setEnded(true);
        completeRef.current?.();
      }
    };
    if (voiceOn && speechSupported()) {
      const { expert } = pickVoices(voices);
      let timer: number | undefined;
      let done = false;
      const once = () => {
        if (done) return;
        done = true;
        timer = window.setTimeout(advance, 600);
      };
      const words = scene.narration.split(/\s+/).length;
      const fallback = window.setTimeout(once, Math.max(scene.seconds, words / 2.2) * 1000 + 4000);
      const stop = speak(scene.narration, { voice: expert, rate: 1.02, onEnd: once });
      return () => {
        stop();
        window.clearTimeout(fallback);
        if (timer) window.clearTimeout(timer);
      };
    }
    const timer = window.setTimeout(advance, scene.seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [playing, index, voiceOn, scene, scenes.length, voices]);

  useEffect(() => () => {
    if (speechSupported()) window.speechSynthesis.cancel();
  }, []);

  const go = (i: number) => {
    setIndex(Math.max(0, Math.min(scenes.length - 1, i)));
    setEnded(false);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-navy-deep shadow-xl">
      <div className="relative aspect-video overflow-hidden" style={{ background: `linear-gradient(150deg, #1b2569 0%, ${tone} 140%)` }}>
        <Waves count={12} seed={index * 3 + 1} opacity={0.35} animate={playing} key={index} />
        <div key={`${index}-${playing}`} className="scene-enter absolute inset-0 flex flex-col justify-center p-6 text-white md:p-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
            Scene {index + 1} / {scenes.length}
          </p>
          <h3 className={cn("mt-2 font-bold !text-white", scene.kind === "title" ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl")}>{scene.title}</h3>
          {scene.body && <p className={cn("mt-3 max-w-3xl text-white/90", scene.kind === "title" ? "text-lg" : "text-base md:text-xl")}>{scene.body}</p>}
          {scene.items && scene.items.length > 0 && (
            <ol className={cn("mt-4 grid gap-2", scene.kind === "steps" && scene.items.length > 3 ? "md:grid-cols-2" : "")}>
              {scene.items.map((item, i) => (
                <li
                  key={item}
                  className="flex animate-rise items-start gap-3 rounded-xl bg-white/12 px-3 py-2 text-sm ring-1 ring-white/20 md:text-base"
                  style={{ animationDelay: `${300 + i * 350}ms` }}
                >
                  <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold", scene.kind === "mistake" ? "bg-star" : "bg-white text-navy")}>
                    {scene.kind === "mistake" ? "!" : i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          )}
        </div>
        {!playing && (
          <button
            type="button"
            onClick={() => {
              if (ended) go(0);
              setPlaying(true);
            }}
            className="absolute inset-0 flex items-center justify-center bg-navy-deep/30 transition hover:bg-navy-deep/20"
            aria-label={ended ? "Replay explainer" : "Play explainer"}
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-navy shadow-2xl">
              {ended ? <RotateCcw size={30} /> : <Play size={34} className="ml-1" />}
            </span>
          </button>
        )}
        {captions && playing && (
          <p className="absolute inset-x-4 bottom-4 mx-auto max-w-3xl rounded-lg bg-black/60 px-3 py-2 text-center text-sm text-white">{scene.narration}</p>
        )}
      </div>
      <div className="flex items-center gap-2 bg-navy-deep px-4 py-3 text-white">
        <button type="button" onClick={() => setPlaying((p) => !p)} className="rounded-lg p-1.5 hover:bg-white/10" aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button type="button" onClick={() => go(index - 1)} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Previous scene">
          <ChevronLeft size={18} />
        </button>
        <button type="button" onClick={() => go(index + 1)} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Next scene">
          <ChevronRight size={18} />
        </button>
        <div className="mx-2 flex flex-1 gap-1">
          {scenes.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              className={cn("h-1.5 flex-1 rounded-full transition", i < index ? "bg-white" : i === index ? "bg-gold" : "bg-white/25")}
              aria-label={`Go to scene ${i + 1}: ${s.title}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setVoiceOn((v) => !v)}
          className="rounded-lg p-1.5 hover:bg-white/10"
          aria-label={voiceOn ? "Mute narration" : "Turn narration on"}
          aria-pressed={voiceOn}
          disabled={!speechSupported()}
        >
          {voiceOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <button type="button" onClick={() => setCaptions((c) => !c)} className={cn("rounded-lg p-1.5 hover:bg-white/10", !captions && "opacity-50")} aria-label="Toggle captions" aria-pressed={captions}>
          <Captions size={18} />
        </button>
      </div>
    </div>
  );
}
