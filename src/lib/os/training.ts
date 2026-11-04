import { blockById, LEVEL_TONE } from "@/lib/academy/campus";

import { osAgents, type OsAgent } from "./agents";

export type TrainingStep = { id: "learn" | "watch" | "practise" | "lab" | "use"; label: string; detail: string; href: string };

export type AgentTraining = {
  slug: string;
  name: string;
  osUrl: string;
  guide: string;
  level: string;
  levelTone: string;
  blocks: { id: string; name: string; level: string; lesson: string }[];
  steps: TrainingStep[];
};

const LEVEL_ORDER = ["N0", "N1", "N2", "N3", "N4"];

/** How to get ready to use an OS agent, expressed as Academy paths (relative to the Academy origin). */
export function trainingFor(agent: OsAgent): AgentTraining {
  const blocks = agent.blocks
    .map((b) => blockById(b.id))
    .filter((b) => b !== undefined)
    .map((b) => ({ id: b.id, name: b.name, level: b.lvl, lesson: `/academy/blocks/${b.id}` }));
  const main = blocks[0];
  const level = blocks.map((b) => b.level).sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b))[0] ?? "N1";
  return {
    slug: agent.slug,
    name: agent.name,
    osUrl: agent.url,
    guide: `/os/agents/${agent.slug}`,
    level,
    levelTone: LEVEL_TONE[level] ?? "#1a6aff",
    blocks,
    steps: [
      { id: "learn", label: "Learn the method", detail: `Read the ${main.id} ${main.name} card: objective, steps, quality bar.`, href: main.lesson },
      { id: "watch", label: "Watch or listen", detail: "5-minute motion explainer and podcast.", href: `${main.lesson}#media` },
      { id: "practise", label: "Practise without AI", detail: "Quiz, process order and a case exercise.", href: `${main.lesson}#practice` },
      { id: "lab", label: "Try the agent in the Lab", detail: "Fictional case, then tick every human check.", href: `/academy/lab?agent=${agent.slug}` },
      { id: "use", label: "Use it for real in CoDesign OS", detail: "Approved inputs only; the draft is never final.", href: agent.url },
    ],
  };
}

export const agentTrainings: AgentTraining[] = osAgents.map(trainingFor);

/** Block id → OS agents that support it, for links from lessons back into the OS. */
export function agentsForBlock(blockId: string): AgentTraining[] {
  return agentTrainings.filter((t) => t.blocks.some((b) => b.id === blockId));
}
