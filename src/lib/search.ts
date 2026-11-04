import { campus } from "@/lib/academy/campus";
import { glossary } from "@/lib/academy/extras";
import { credentials, scoreCredential } from "@/lib/credentials";
import { osAgents } from "@/lib/os/agents";

export type SearchHit = {
  kind: "block" | "credential" | "agent" | "glossary" | "case";
  title: string;
  subtitle: string;
  href: string;
  snippet: string;
  score: number;
};

const STOP = new Set([
  "the", "and", "for", "how", "what", "with", "can", "you", "are", "our", "about", "this", "that",
  "do", "does", "is", "a", "an", "to", "of", "in", "on", "me", "my", "i", "we", "it", "should",
  "which", "when", "who", "why", "use", "show", "give", "tell", "find", "need", "comment", "quel",
  "les", "des", "une", "pour",
]);

export function terms(query: string): string[] {
  return query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9.&]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function scoreText(text: string, words: string[], weight = 1): number {
  const hay = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return words.reduce((total, word) => total + (hay.includes(word) ? weight : 0), 0);
}

export function searchAll(query: string, limit = 8): SearchHit[] {
  const words = terms(query);
  if (words.length === 0) return [];
  const hits: SearchHit[] = [];

  for (const block of campus.blocks) {
    const score =
      scoreText(`${block.id} ${block.name}`, words, 6) +
      scoreText(`${block.obj} ${block.explain} ${block.sub}`, words, 2) +
      scoreText(`${block.steps.join(" ")} ${block.output} ${block.mistakes} ${block.tools}`, words, 1);
    if (score > 0) {
      hits.push({
        kind: "block",
        title: `${block.id} ${block.name}`,
        subtitle: block.phase,
        href: `/academy/blocks/${block.id}`,
        snippet: block.explain,
        score,
      });
    }
  }

  for (const c of credentials) {
    if (c.status !== "complete") continue;
    const score = scoreCredential(c, query) > 0 ? scoreCredential(c, query) + 2 : scoreText(`${c.client} ${c.themes.join(" ")} ${c.challenge}`, words, 1);
    if (score > 0) {
      hits.push({
        kind: "credential",
        title: c.client,
        subtitle: `${c.title}${c.year ? ` · ${c.year}` : ""}`,
        href: `/codesign/credentials?id=${c.id}`,
        snippet: c.results || c.challenge,
        score,
      });
    }
  }

  for (const agent of osAgents) {
    const score = scoreText(agent.name, words, 6) + scoreText(agent.blocks.map((b) => b.name).join(" "), words, 1);
    if (score > 0 || (words.includes("agent") && words.length === 1)) {
      hits.push({
        kind: "agent",
        title: `${agent.name} agent`,
        subtitle: `CoDesign OS · used in ${agent.blocks.map((b) => b.id).join(", ")}`,
        href: `/academy/lab?agent=${agent.slug}`,
        snippet: `Try it in the Agent Lab, then open it in CoDesign OS.`,
        score: score || 1,
      });
    }
  }

  for (const entry of glossary) {
    const score = scoreText(entry.term, words, 8) + scoreText(entry.definition, words, 1);
    if (score > 0) {
      hits.push({
        kind: "glossary",
        title: entry.term,
        subtitle: "Glossary",
        href: "/academy/me#glossary",
        snippet: entry.definition,
        score,
      });
    }
  }

  for (const segment of campus.segments) {
    const pack = campus.case_packs[segment];
    const score = scoreText(`${segment} ${pack.name}`, words, 5) + scoreText(`${pack.challenge} ${pack.persona}`, words, 1);
    if (score > 0) {
      hits.push({
        kind: "case",
        title: pack.name,
        subtitle: `${segment} case pack · fictional training data`,
        href: `/academy/cases/${segment}`,
        snippet: pack.challenge,
        score,
      });
    }
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
