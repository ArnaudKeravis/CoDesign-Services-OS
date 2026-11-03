import type { Segment } from "./types";
import data from "./data/challenges.json";

export type ChallengeOption = { text: string; correct: boolean; feedback: string };
export type Challenge = {
  id: string;
  block: string;
  title: string;
  situation: string;
  question: string;
  options: ChallengeOption[];
};
export type Quest = {
  id: string;
  segment: Segment;
  title: string;
  brief: string;
  ask: string;
  strong: string[];
  acceptable: string[];
  lesson: string;
};
export type GlossaryEntry = { term: string; definition: string };

export const challenges = data.challenges as Challenge[];
export const quests = data.quests as Quest[];
export const glossary = data.glossary as GlossaryEntry[];
export const extrasMeta = data.meta;

export function scoreQuest(quest: Quest, picks: string[]): { score: number; max: number } {
  const score = picks.reduce(
    (total, id) => total + (quest.strong.includes(id) ? 10 : quest.acceptable.includes(id) ? 5 : 0),
    0,
  );
  return { score, max: 30 };
}

/** Same challenge for everyone on a given day. */
export function dailyChallenge(date: Date): Challenge {
  const day = Math.floor(date.getTime() / 86_400_000);
  return challenges[day % challenges.length];
}
