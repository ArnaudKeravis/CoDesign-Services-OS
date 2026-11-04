import { campus, sectionCodeOf } from "@/lib/academy/campus";
import { cleanAgentName } from "@/lib/academy/learning";

export const OS_URL = "https://sodexo-codesign-os.vercel.app/";

export type OsAgent = {
  slug: string;
  name: string;
  url: string;
  notes: string[];
  sections: string[];
  blocks: { id: string; name: string }[];
};

function slugOf(url: string): string {
  const match = url.match(/agents\/([^/]+)\.html/);
  return match ? match[1].replace(/-agent$/, "") : url;
}

function buildAgents(): OsAgent[] {
  const byUrl = new Map<string, OsAgent>();
  for (const block of campus.blocks) {
    for (const link of block.os_agents) {
      const existing = byUrl.get(link.url);
      const note = link.name.match(/\(([^)]+)\)/)?.[1];
      const agent =
        existing ??
        ({
          slug: slugOf(link.url),
          name: cleanAgentName(link.name),
          url: link.url,
          notes: [],
          sections: [],
          blocks: [],
        } satisfies OsAgent);
      if (note && !agent.notes.includes(note)) agent.notes.push(note);
      const section = sectionCodeOf(block.id);
      if (!agent.sections.includes(section)) agent.sections.push(section);
      if (!agent.blocks.some((b) => b.id === block.id)) {
        agent.blocks.push({ id: block.id, name: block.name });
      }
      byUrl.set(link.url, agent);
    }
  }
  return Array.from(byUrl.values()).sort(
    (a, b) => a.sections[0].localeCompare(b.sections[0]) || a.name.localeCompare(b.name),
  );
}

export const osAgents: OsAgent[] = buildAgents();

export function agentBySlug(slug: string): OsAgent | undefined {
  return osAgents.find((agent) => agent.slug === slug);
}
