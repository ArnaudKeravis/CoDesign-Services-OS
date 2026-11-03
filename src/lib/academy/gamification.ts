export const ACTIVITY_XP = {
  read: 10,
  video: 15,
  podcast: 15,
  quiz: 20,
  steps: 10,
  exercise: 25,
  assess: 5,
  lab: 15,
  case: 10,
  quest: 30,
  challenge: 20,
  daily: 15,
} as const;

export type Activity = keyof typeof ACTIVITY_XP;

export const BLOCK_ACTIVITIES = ["read", "video", "podcast", "quiz", "exercise"] as const;
export const CORE_ACTIVITIES = ["read", "quiz", "exercise"] as const;

export type AvatarChoice = { shape: number; color: number };

export type ProgressState = {
  version: 1;
  profile: { name: string; role: string; avatar: AvatarChoice };
  xp: number;
  awarded: Record<string, { xp: number; at: string }>;
  quiz: Record<string, number>;
  selfAssess: Record<string, { before?: number; after?: number }>;
  drafts: Record<string, string>;
  streak: { last: string; count: number; best: number };
  history: { key: string; label: string; xp: number; at: string }[];
};

export const EMPTY_PROGRESS: ProgressState = {
  version: 1,
  profile: { name: "", role: "", avatar: { shape: 0, color: 0 } },
  xp: 0,
  awarded: {},
  quiz: {},
  selfAssess: {},
  drafts: {},
  streak: { last: "", count: 0, best: 0 },
  history: [],
};

export type Rank = { name: string; min: number; blurb: string };

/** XP ranks reward learning activity. They are not the N0–N4 competency levels. */
export const RANKS: Rank[] = [
  { name: "Spark", min: 0, blurb: "You have just lit the fuse." },
  { name: "Explorer", min: 100, blurb: "You are finding your way around the campus." },
  { name: "Mapper", min: 300, blurb: "You can map the method end to end." },
  { name: "Co-creator", min: 650, blurb: "You practise the blocks on real-looking cases." },
  { name: "Catalyst", min: 1100, blurb: "You bring others along and use the OS with care." },
  { name: "Faculty-ready", min: 1800, blurb: "Ready to ask a coach for an N3/N4 observation." },
];

export function rankFor(xp: number): { current: Rank; next?: Rank; progress: number; index: number } {
  let index = 0;
  for (let i = 0; i < RANKS.length; i += 1) {
    if (xp >= RANKS[i].min) index = i;
  }
  const current = RANKS[index];
  const next = RANKS[index + 1];
  const progress = next ? (xp - current.min) / (next.min - current.min) : 1;
  return { current, next, progress: Math.max(0, Math.min(1, progress)), index };
}

export function activityKey(blockId: string, activity: Activity): string {
  return `block:${blockId}:${activity}`;
}

export function hasDone(state: ProgressState, key: string): boolean {
  return Boolean(state.awarded[key]);
}

export function blockProgress(state: ProgressState, blockId: string) {
  const done = BLOCK_ACTIVITIES.filter((activity) => hasDone(state, activityKey(blockId, activity)));
  const complete = CORE_ACTIVITIES.every((activity) => hasDone(state, activityKey(blockId, activity)));
  return { done, complete, ratio: done.length / BLOCK_ACTIVITIES.length };
}

export function completedBlocks(state: ProgressState, blockIds: string[]): string[] {
  return blockIds.filter((id) => blockProgress(state, id).complete);
}

export function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function nextStreak(streak: ProgressState["streak"], now: Date): ProgressState["streak"] {
  const today = dayKey(now);
  if (streak.last === today) return streak;
  const yesterday = dayKey(new Date(now.getTime() - 86_400_000));
  const count = streak.last === yesterday ? streak.count + 1 : 1;
  return { last: today, count, best: Math.max(streak.best, count) };
}

export function applyAward(
  state: ProgressState,
  key: string,
  xp: number,
  label: string,
  now: Date = new Date(),
): ProgressState {
  if (state.awarded[key]) return state;
  const at = now.toISOString();
  return {
    ...state,
    xp: state.xp + xp,
    awarded: { ...state.awarded, [key]: { xp, at } },
    streak: nextStreak(state.streak, now),
    history: [{ key, label, xp, at }, ...state.history].slice(0, 60),
  };
}

export type Badge = {
  id: string;
  name: string;
  description: string;
  tone: string;
  earned: (state: ProgressState, ctx: BadgeContext) => boolean;
};

export type BadgeContext = { sections: { code: string; name: string; blockIds: string[] }[]; allBlockIds: string[] };

function countKeys(state: ProgressState, pattern: RegExp): number {
  return Object.keys(state.awarded).filter((key) => pattern.test(key)).length;
}

export function buildBadges(ctx: BadgeContext): Badge[] {
  const sectionBadges: Badge[] = ctx.sections.map((section) => ({
    id: `section-${section.code}`,
    name: `${section.name.replace(/^\d+\s/, "")} graduate`,
    description: `Complete every block of ${section.name} (learn, quiz and exercise).`,
    tone: `var(--color-s${section.code})`,
    earned: (state) => section.blockIds.every((id) => blockProgress(state, id).complete),
  }));

  return [
    {
      id: "first-step",
      name: "First step",
      description: "Read your first method card.",
      tone: "var(--color-sodexo)",
      earned: (state) => countKeys(state, /:read$/) >= 1,
    },
    {
      id: "quiz-ace",
      name: "Quiz ace",
      description: "Score 5/5 on five block quizzes.",
      tone: "var(--color-gold)",
      earned: (state) => Object.values(state.quiz).filter((score) => score >= 5).length >= 5,
    },
    {
      id: "cinephile",
      name: "Cinephile",
      description: "Watch five motion explainers to the end.",
      tone: "var(--color-s03)",
      earned: (state) => countKeys(state, /:video$/) >= 5,
    },
    {
      id: "podcast-fan",
      name: "Podcast fan",
      description: "Listen to five CoDesign-in-five episodes.",
      tone: "var(--color-s04)",
      earned: (state) => countKeys(state, /:podcast$/) >= 5,
    },
    {
      id: "human-in-the-loop",
      name: "Human in the loop",
      description: "Run three agent drafts in the Lab and tick every human check.",
      tone: "var(--color-s05)",
      earned: (state) => countKeys(state, /^lab:/) >= 3,
    },
    {
      id: "credential-detective",
      name: "Credential detective",
      description: "Solve a Credential Quest with a justified shortlist.",
      tone: "var(--color-navy)",
      earned: (state) => countKeys(state, /^quest:/) >= 1,
    },
    {
      id: "case-cracker",
      name: "Case cracker",
      description: "Explore all four fictional case packs.",
      tone: "var(--color-s06)",
      earned: (state) => countKeys(state, /^case:/) >= 4,
    },
    {
      id: "challenger",
      name: "Challenger",
      description: "Complete five scenario challenges.",
      tone: "var(--color-s02)",
      earned: (state) => countKeys(state, /^challenge:/) >= 5,
    },
    {
      id: "self-aware",
      name: "Self-aware",
      description: "Rate your own maturity on ten blocks.",
      tone: "var(--color-n0)",
      earned: (state) => Object.keys(state.selfAssess).length >= 10,
    },
    {
      id: "streak-3",
      name: "On a roll",
      description: "Learn three days in a row.",
      tone: "var(--color-s04)",
      earned: (state) => state.streak.best >= 3,
    },
    {
      id: "streak-7",
      name: "Habit formed",
      description: "Learn seven days in a row.",
      tone: "var(--color-star)",
      earned: (state) => state.streak.best >= 7,
    },
    ...sectionBadges,
    {
      id: "double-diamond",
      name: "Double Diamond",
      description: "Complete all 35 blocks of the campus.",
      tone: "var(--color-navy)",
      earned: (state) => ctx.allBlockIds.every((id) => blockProgress(state, id).complete),
    },
  ];
}
