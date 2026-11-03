import { campus, sectionCodeOf, SECTION_TONE } from "./campus";
import type { MethodBlock } from "./types";

export type QuizQuestion = {
  id: string;
  kind: "section" | "output" | "mistake" | "check" | "principle" | "agent";
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
};

export type PodcastLine = { speaker: "host" | "expert"; text: string };

export type VideoScene = {
  kind: "title" | "objective" | "steps" | "roles" | "quality" | "mistake" | "principle" | "ai";
  title: string;
  body?: string;
  items?: string[];
  narration: string;
  seconds: number;
};

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seeded(seed: string) {
  let state = hash(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 100000) / 100000;
  };
}

export function shuffle<T>(items: readonly T[], seed: string): T[] {
  const rand = seeded(seed);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickOthers<T>(pool: readonly T[], exclude: T, count: number, seed: string): T[] {
  const unique = Array.from(new Set(pool.filter((item) => item !== exclude)));
  return shuffle(unique, seed).slice(0, count);
}

function buildQuestion(
  block: MethodBlock,
  kind: QuizQuestion["kind"],
  prompt: string,
  correct: string,
  distractors: string[],
  explain: string,
): QuizQuestion {
  const options = shuffle([correct, ...distractors], `${block.id}:${kind}:options`);
  return {
    id: `${block.id}:${kind}`,
    kind,
    prompt,
    options,
    answer: options.indexOf(correct),
    explain,
  };
}

export function splitList(text: string): string[] {
  return text
    .split(/\s·\s|;\s/)
    .map((part) => part.trim().replace(/\.$/, ""))
    .filter((part) => part.length > 0);
}

export function cleanAgentName(name: string): string {
  return name.replace(/\s*\(.*\)\s*$/, "").trim();
}

export function quizFor(block: MethodBlock): QuizQuestion[] {
  const others = campus.blocks.filter((other) => other.id !== block.id);
  const questions: QuizQuestion[] = [];

  const section = campus.sections.find((s) => s.code === sectionCodeOf(block.id));
  if (section) {
    questions.push(
      buildQuestion(
        block,
        "section",
        `In which campus section does “${block.name}” sit?`,
        section.name,
        pickOthers(campus.sections.map((s) => s.name), section.name, 3, `${block.id}:sec`),
        `${section.name} — ${section.subtitle}.`,
      ),
    );
  }

  questions.push(
    buildQuestion(
      block,
      "output",
      `What is the expected output of “${block.name}”?`,
      block.output,
      pickOthers(others.map((o) => o.output), block.output, 3, `${block.id}:out`),
      `Minimum standard: ${block.std}`,
    ),
  );

  const mistakes = splitList(block.mistakes);
  if (mistakes.length > 0) {
    const mistake = mistakes[hash(block.id) % mistakes.length];
    const goodPractice = [block.std, block.quality, block.explain]
      .map((text) => text.replace(/\.$/, ""))
      .filter((text) => text.length > 0);
    questions.push(
      buildQuestion(
        block,
        "mistake",
        `Which of these is a common mistake in “${block.name}”?`,
        mistake,
        goodPractice.slice(0, 3),
        `The other options describe good practice. Common mistakes: ${block.mistakes}`,
      ),
    );
  }

  if (block.verify) {
    questions.push(
      buildQuestion(
        block,
        "check",
        `Before you reuse an AI draft for “${block.name}”, what must a human check?`,
        block.verify,
        pickOthers(others.map((o) => o.verify).filter(Boolean), block.verify, 3, `${block.id}:chk`),
        "AI drafts are never final. A person checks them against the evidence before they reach a client.",
      ),
    );
  }

  const agentNames = Array.from(
    new Set(campus.blocks.flatMap((b) => b.os_agents.map((a) => cleanAgentName(a.name)))),
  );
  const ownAgents = block.os_agents.map((a) => cleanAgentName(a.name));
  if (ownAgents.length > 0) {
    const correct = ownAgents[0];
    questions.push(
      buildQuestion(
        block,
        "agent",
        `Which CoDesign OS agent supports “${block.name}”?`,
        correct,
        pickOthers(
          agentNames.filter((name) => !ownAgents.includes(name)),
          correct,
          3,
          `${block.id}:agent`,
        ),
        `Use ${ownAgents.join(", ")} as a first draft, then apply the human checks.`,
      ),
    );
  } else {
    questions.push(
      buildQuestion(
        block,
        "principle",
        `Which principle best summarises “${block.name}”?`,
        block.explain,
        pickOthers(others.map((o) => o.explain), block.explain, 3, `${block.id}:pri`),
        block.l_obj,
      ),
    );
  }

  return questions;
}

export function shuffledSteps(block: MethodBlock): string[] {
  let attempt = shuffle(block.steps, `${block.id}:steps`);
  if (attempt.join("|") === block.steps.join("|") && block.steps.length > 1) {
    attempt = [...block.steps].reverse();
  }
  return attempt;
}

function sentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

export function podcastFor(block: MethodBlock): PodcastLine[] {
  const section = SECTION_TONE[sectionCodeOf(block.id)]?.short ?? block.phase;
  const steps = block.steps;
  const stepsSpoken =
    steps.length > 1
      ? `${steps.length} moves. ${steps
          .slice(0, -1)
          .map((step, index) => (index === 0 ? `First, ${lowerFirst(step)}` : lowerFirst(step)))
          .join(", then ")}, and finally ${lowerFirst(steps[steps.length - 1])}.`
      : sentence(steps[0] ?? "");
  const agents = block.os_agents.map((a) => cleanAgentName(a.name));

  const lines: PodcastLine[] = [
    {
      speaker: "host",
      text: `Welcome to CoDesign in five minutes. I'm Alex. Today we are in ${section}, block ${block.id}: ${block.name}. With me, our practitioner Sam. Sam, why does this block matter?`,
    },
    { speaker: "expert", text: sentence(block.explain) },
    { speaker: "host", text: "So what are we actually trying to achieve?" },
    { speaker: "expert", text: sentence(block.obj) },
    { speaker: "host", text: "Who is in the room, and who signs it off?" },
    { speaker: "expert", text: `${sentence(block.who)} ${sentence(block.acc)}` },
    { speaker: "host", text: "Walk me through how you run it." },
    { speaker: "expert", text: `It's ${stepsSpoken}` },
    { speaker: "host", text: "And what do you walk out with?" },
    { speaker: "expert", text: `${sentence(block.output)} The bar is simple: ${lowerFirst(sentence(block.std))}` },
    { speaker: "host", text: "Where do people usually go wrong?" },
    { speaker: "expert", text: `Classic traps: ${splitList(block.mistakes).map(lowerFirst).join("; ")}.` },
    { speaker: "host", text: "Give us a concrete example." },
    { speaker: "expert", text: sentence(block.example.replace(/\[[^\]]*\]/g, "").trim()) },
  ];

  if (agents.length > 0) {
    lines.push(
      { speaker: "host", text: "Can CoDesign OS help here?" },
      {
        speaker: "expert",
        text: `Yes — the ${agents.join(" and the ")} agent gives you a first draft. But a human always checks: ${lowerFirst(sentence(block.verify))}`,
      },
    );
  } else if (block.prompt) {
    lines.push(
      { speaker: "host", text: "And AI — does it play a role?" },
      {
        speaker: "expert",
        text: `There's no dedicated agent, but a generic prompt helps you start. Always check: ${lowerFirst(sentence(block.verify || "the evidence behind every claim"))}`,
      },
    );
  }

  lines.push(
    { speaker: "host", text: "One thing listeners should remember?" },
    { speaker: "expert", text: `After this episode you should be able to ${lowerFirst(sentence(block.l_obj))}` },
    { speaker: "host", text: "Thanks Sam. Now head to the Practise tab and try it on a case pack. See you next episode." },
  );

  return lines.filter((line) => line.text.trim().length > 1);
}

export function podcastMinutes(lines: PodcastLine[]): number {
  const words = lines.reduce((total, line) => total + line.text.split(/\s+/).length, 0);
  return Math.max(2, Math.round(words / 150));
}

export function videoFor(block: MethodBlock): VideoScene[] {
  const section = SECTION_TONE[sectionCodeOf(block.id)];
  const roles = block.who
    .split(/\s·\s/)
    .map((part) => part.trim())
    .filter(Boolean);
  const agents = block.os_agents.map((a) => cleanAgentName(a.name));

  const scenes: VideoScene[] = [
    {
      kind: "title",
      title: block.name,
      body: `${block.id} · ${section?.short ?? block.phase} · ${block.sub}`,
      narration: `${block.name}. Block ${block.id}, in ${section?.short ?? block.phase}.`,
      seconds: 5,
    },
    {
      kind: "objective",
      title: "Why it matters",
      body: block.explain,
      narration: `${sentence(block.explain)} The objective: ${lowerFirst(sentence(block.obj))}`,
      seconds: 9,
    },
    {
      kind: "steps",
      title: "How it works",
      items: block.steps,
      narration: `There are ${block.steps.length} steps: ${block.steps.map(lowerFirst).join(", ")}.`,
      seconds: Math.min(16, 5 + block.steps.length * 2),
    },
    {
      kind: "roles",
      title: "Who does what",
      items: roles,
      body: block.acc,
      narration: `${sentence(block.who)} ${sentence(block.acc)}`,
      seconds: 9,
    },
    {
      kind: "quality",
      title: "What good looks like",
      body: block.output,
      items: [block.std, block.quality].filter(Boolean),
      narration: `The output: ${lowerFirst(sentence(block.output))} Good looks like this: ${lowerFirst(sentence(block.quality))}`,
      seconds: 10,
    },
    {
      kind: "mistake",
      title: "Avoid these traps",
      items: splitList(block.mistakes),
      narration: `Watch out for these traps: ${splitList(block.mistakes).map(lowerFirst).join("; ")}.`,
      seconds: 9,
    },
  ];

  if (agents.length > 0 || block.prompt) {
    scenes.push({
      kind: "ai",
      title: "Human-led, AI-supported",
      body: agents.length > 0 ? `CoDesign OS: ${agents.join(" · ")}` : "Generic Claude prompt (no dedicated agent)",
      items: block.verify ? [`Human check: ${block.verify}`] : [],
      narration:
        agents.length > 0
          ? `Use the ${agents.join(" and ")} agent for a first draft, then check: ${lowerFirst(sentence(block.verify))}`
          : `A generic prompt can help you start. Then check: ${lowerFirst(sentence(block.verify || "every claim against the evidence"))}`,
      seconds: 8,
    });
  }

  scenes.push({
    kind: "principle",
    title: "Your takeaway",
    body: block.l_obj,
    narration: `Your takeaway: ${lowerFirst(sentence(block.l_obj))} Now try it in the practice tab.`,
    seconds: 7,
  });

  return scenes;
}

export function videoSeconds(scenes: VideoScene[]): number {
  return scenes.reduce((total, scene) => total + scene.seconds, 0);
}

export type PromptTemplate = {
  intro: string;
  template: string;
  fields: string[];
};

export function promptTemplate(block: MethodBlock): PromptTemplate | null {
  if (!block.prompt || block.prompt === "See each block.") return null;
  const first = block.prompt.indexOf("'");
  const last = block.prompt.lastIndexOf("'");
  const hasQuote = first >= 0 && last > first;
  const template = hasQuote ? block.prompt.slice(first + 1, last) : block.prompt;
  const intro = hasQuote ? block.prompt.slice(0, first).replace(/[:\s]+$/, "") : "";
  const fields = Array.from(new Set(Array.from(template.matchAll(/\[([^\]]+)\]/g), (m) => m[1])));
  return { intro, template, fields };
}

export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\[([^\]]+)\]/g, (match, key: string) => {
    const value = values[key]?.trim();
    return value ? value : match;
  });
}

export function humanChecks(block: MethodBlock): string[] {
  const checks = splitList(block.verify).filter(Boolean);
  return [
    ...checks,
    "Every fact traces to a source I can name",
    "No client-confidential or personal data was pasted",
    "I have rewritten the draft in my own words before sharing",
  ];
}
