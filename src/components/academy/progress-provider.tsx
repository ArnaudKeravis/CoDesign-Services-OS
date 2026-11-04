"use client";

import { Award, Sparkles, TrendingUp } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { campus, blocksInSection } from "@/lib/academy/campus";
import {
  applyAward,
  buildBadges,
  EMPTY_PROGRESS,
  rankFor,
  type Badge,
  type ProgressState,
} from "@/lib/academy/gamification";

const STORAGE_KEY = "codesign-academy-progress-v1";

type Toast = { id: number; title: string; detail: string; kind: "xp" | "rank" | "badge" };

type ProgressApi = {
  state: ProgressState;
  ready: boolean;
  badges: (Badge & { has: boolean })[];
  award: (key: string, xp: number, label: string) => boolean;
  update: (fn: (state: ProgressState) => ProgressState) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressApi | null>(null);

export const badgeContext = {
  sections: campus.sections.map((s) => ({
    code: s.code,
    name: s.name,
    blockIds: blocksInSection(s.code).map((b) => b.id),
  })),
  allBlockIds: campus.blocks.map((b) => b.id),
};
const BADGES = buildBadges(badgeContext);

function load(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as ProgressState;
    return parsed.version === 1 ? { ...EMPTY_PROGRESS, ...parsed } : EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const pushToast = useCallback((toast: Omit<Toast, "id">) => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts((list) => [...list.slice(-2), { ...toast, id }]);
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3800);
  }, []);

  const commit = useCallback(
    (next: ProgressState, previous: ProgressState) => {
      if (next === previous) return;
      const before = rankFor(previous.xp);
      const after = rankFor(next.xp);
      if (after.index > before.index) {
        pushToast({ kind: "rank", title: `New rank: ${after.current.name}`, detail: after.current.blurb });
      }
      for (const badge of BADGES) {
        if (!badge.earned(previous, badgeContext) && badge.earned(next, badgeContext)) {
          pushToast({ kind: "badge", title: `Badge unlocked: ${badge.name}`, detail: badge.description });
        }
      }
      setState(next);
    },
    [pushToast],
  );

  const award = useCallback(
    (key: string, xp: number, label: string) => {
      const previous = stateRef.current;
      if (previous.awarded[key]) return false;
      const next = applyAward(previous, key, xp, label);
      stateRef.current = next;
      pushToast({ kind: "xp", title: `+${xp} XP`, detail: label });
      commit(next, previous);
      return true;
    },
    [commit, pushToast],
  );

  const update = useCallback(
    (fn: (s: ProgressState) => ProgressState) => {
      const previous = stateRef.current;
      const next = fn(previous);
      stateRef.current = next;
      commit(next, previous);
    },
    [commit],
  );

  const reset = useCallback(() => {
    stateRef.current = EMPTY_PROGRESS;
    setState(EMPTY_PROGRESS);
  }, []);

  const badges = useMemo(() => BADGES.map((b) => ({ ...b, has: b.earned(state, badgeContext) })), [state]);

  const api = useMemo(() => ({ state, ready, badges, award, update, reset }), [state, ready, badges, award, update, reset]);

  return (
    <ProgressContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-24 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex animate-pop items-center gap-3 rounded-2xl bg-navy px-4 py-3 text-white shadow-xl"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              {toast.kind === "xp" ? <Sparkles size={16} /> : toast.kind === "rank" ? <TrendingUp size={16} /> : <Award size={16} />}
            </span>
            <span>
              <span className="block text-sm font-bold">{toast.title}</span>
              <span className="block text-xs text-white/80">{toast.detail}</span>
            </span>
          </div>
        ))}
      </div>
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
