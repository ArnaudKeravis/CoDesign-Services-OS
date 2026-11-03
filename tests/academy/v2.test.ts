import { describe, expect, it } from "vitest";

import { blockById, campus } from "@/lib/academy/campus";
import { challenges, dailyChallenge, quests, scoreQuest } from "@/lib/academy/extras";
import {
  applyAward,
  blockProgress,
  buildBadges,
  EMPTY_PROGRESS,
  nextStreak,
  rankFor,
  RANKS,
} from "@/lib/academy/gamification";
import { fillTemplate, podcastFor, promptTemplate, quizFor, shuffledSteps, videoFor } from "@/lib/academy/learning";
import { credentialById, credentials, credentialsForBlock, searchCredentials } from "@/lib/credentials";
import { osAgents } from "@/lib/os/agents";
import { searchAll } from "@/lib/search";

describe("generated learning content", () => {
  it("gives every block a valid quiz with one correct answer per question", () => {
    for (const block of campus.blocks) {
      const quiz = quizFor(block);
      expect(quiz.length).toBeGreaterThanOrEqual(4);
      for (const q of quiz) {
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        expect(new Set(q.options).size).toBe(q.options.length);
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
      }
    }
  });

  it("is deterministic so server and client render the same quiz", () => {
    const block = blockById("04.02")!;
    expect(quizFor(block)).toEqual(quizFor(block));
    expect(shuffledSteps(block)).toEqual(shuffledSteps(block));
  });

  it("never presents the steps already in order", () => {
    for (const block of campus.blocks.filter((b) => b.steps.length > 2)) {
      expect(shuffledSteps(block)).not.toEqual(block.steps);
      expect([...shuffledSteps(block)].sort()).toEqual([...block.steps].sort());
    }
  });

  it("builds a podcast and a motion explainer for every block", () => {
    for (const block of campus.blocks) {
      const lines = podcastFor(block);
      expect(lines[0].speaker).toBe("host");
      expect(lines.some((l) => l.speaker === "expert")).toBe(true);
      const scenes = videoFor(block);
      expect(scenes[0].kind).toBe("title");
      expect(scenes.at(-1)?.kind).toBe("principle");
    }
  });

  it("extracts prompt placeholders and fills them", () => {
    const tpl = promptTemplate(blockById("02.02")!)!;
    expect(tpl.fields).toContain("paste");
    expect(fillTemplate("For [segment] client", { segment: "HEAL" })).toBe("For HEAL client");
    expect(fillTemplate("Keep [unknown]", {})).toBe("Keep [unknown]");
  });
});

describe("gamification", () => {
  it("awards XP once per key and starts a streak", () => {
    const now = new Date("2026-11-03T10:00:00Z");
    const once = applyAward(EMPTY_PROGRESS, "block:01.01:read", 10, "Read", now);
    const twice = applyAward(once, "block:01.01:read", 10, "Read", now);
    expect(once.xp).toBe(10);
    expect(twice).toBe(once);
    expect(once.streak).toEqual({ last: "2026-11-03", count: 1, best: 1 });
  });

  it("extends streaks on consecutive days and resets after a gap", () => {
    const s1 = nextStreak({ last: "2026-11-02", count: 2, best: 2 }, new Date("2026-11-03T08:00:00Z"));
    expect(s1.count).toBe(3);
    const s2 = nextStreak(s1, new Date("2026-11-06T08:00:00Z"));
    expect(s2).toEqual({ last: "2026-11-06", count: 1, best: 3 });
  });

  it("maps XP to ranks in order", () => {
    expect(rankFor(0).current.name).toBe("Spark");
    expect(rankFor(RANKS[2].min).current.name).toBe(RANKS[2].name);
    expect(rankFor(99999).next).toBeUndefined();
  });

  it("completes a block after read, quiz and exercise", () => {
    let state = EMPTY_PROGRESS;
    for (const a of ["read", "quiz"]) state = applyAward(state, `block:04.01:${a}`, 1, a);
    expect(blockProgress(state, "04.01").complete).toBe(false);
    state = applyAward(state, "block:04.01:exercise", 1, "ex");
    expect(blockProgress(state, "04.01").complete).toBe(true);
  });

  it("defines unique badges including one per section", () => {
    const badges = buildBadges({ sections: campus.sections.map((s) => ({ code: s.code, name: s.name, blockIds: [] })), allBlockIds: [] });
    expect(new Set(badges.map((b) => b.id)).size).toBe(badges.length);
    expect(badges.filter((b) => b.id.startsWith("section-"))).toHaveLength(6);
  });
});

describe("credentials", () => {
  it("imports every page of the deck once", () => {
    expect(credentials).toHaveLength(45);
    expect(new Set(credentials.map((c) => c.page)).size).toBe(45);
    expect(new Set(credentials.map((c) => c.id)).size).toBe(45);
  });

  it("finds credentials by client and theme", () => {
    expect(searchCredentials({ query: "clariane" })[0].client).toBe("Clariane");
    expect(searchCredentials({ query: "stadium" }).every((c) => c.segment === "PLAY")).toBe(true);
    expect(searchCredentials({ segment: "LEARN" })).toHaveLength(0);
  });

  it("links blocks to credentials named in their examples", () => {
    const names = credentialsForBlock(blockById("02.02")!).map((c) => c.client);
    expect(names).toContain("Clariane");
  });

  it("only references existing credentials in quests", () => {
    for (const quest of quests) {
      for (const id of [...quest.strong, ...quest.acceptable]) expect(credentialById(id), id).toBeDefined();
      expect(scoreQuest(quest, quest.strong.slice(0, 3)).score).toBe(quest.strong.length >= 3 ? 30 : 10 * quest.strong.length);
    }
  });
});

describe("challenges, agents and search", () => {
  it("has one correct option per challenge, each tied to a real block", () => {
    for (const c of challenges) {
      expect(c.options.filter((o) => o.correct)).toHaveLength(1);
      expect(blockById(c.block)).toBeDefined();
    }
    expect(challenges).toContain(dailyChallenge(new Date("2026-11-03")));
  });

  it("deduplicates OS agents by URL", () => {
    expect(new Set(osAgents.map((a) => a.url)).size).toBe(osAgents.length);
    expect(osAgents.find((a) => a.slug === "journey-map")?.blocks.length).toBeGreaterThanOrEqual(2);
  });

  it("searches across blocks, credentials and agents", () => {
    const hits = searchAll("journey map");
    expect(hits[0].kind).toBe("block");
    expect(searchAll("Roland-Garros").some((h) => h.kind === "credential")).toBe(true);
  });
});
