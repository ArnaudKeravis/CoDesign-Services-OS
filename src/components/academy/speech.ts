"use client";

import { useEffect, useState } from "react";

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function useVoices(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (!speechSupported()) return;
    const load = () => setVoices(window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en")));
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);
  return voices;
}

export function pickVoices(voices: SpeechSynthesisVoice[]): { host?: SpeechSynthesisVoice; expert?: SpeechSynthesisVoice } {
  const preferred = (names: RegExp) => voices.find((v) => names.test(v.name));
  const host = preferred(/Samantha|Google UK English Female|Serena|Karen|Moira|Female/i) ?? voices[0];
  const expert = preferred(/Daniel|Google UK English Male|Alex|Arthur|Oliver|Male/i) ?? voices.find((v) => v !== host) ?? voices[0];
  return { host, expert };
}

export function speak(
  text: string,
  options: { voice?: SpeechSynthesisVoice; rate?: number; pitch?: number; onEnd?: () => void },
): () => void {
  if (!speechSupported()) {
    options.onEnd?.();
    return () => undefined;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  if (options.voice) utterance.voice = options.voice;
  utterance.rate = options.rate ?? 1;
  utterance.pitch = options.pitch ?? 1;
  let cancelled = false;
  utterance.onend = () => {
    if (!cancelled) options.onEnd?.();
  };
  window.speechSynthesis.speak(utterance);
  return () => {
    cancelled = true;
    window.speechSynthesis.cancel();
  };
}
