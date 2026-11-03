import type { MethodBlock, Segment } from "@/lib/academy/types";

import data from "./credentials.json";

export type CredentialSegment = Segment | "OTHER";

export type Credential = {
  id: string;
  page: number;
  client: string;
  title: string;
  year: number | null;
  country: string;
  amount: string;
  dealType: string;
  impact: string;
  segment: CredentialSegment;
  format: "case-study" | "card";
  status: "complete" | "to-complete";
  hmw: string;
  challenge: string;
  approach: string[];
  outcome: string[];
  results: string;
  deliverables: string[];
  kpis: string[];
  themes: string[];
};

export const credentialSource = data.source;
export const credentials = data.items as Credential[];

export const SEGMENT_LABEL: Record<CredentialSegment, string> = {
  WORK: "WORK · workplaces",
  PLAY: "PLAY · sports & leisure",
  HEAL: "HEAL · health & care",
  LEARN: "LEARN · education",
  OTHER: "Other / internal",
};

export function credentialImage(credential: Pick<Credential, "page">): string {
  return `/credentials/p${String(credential.page).padStart(2, "0")}.jpg`;
}

export function credentialById(id: string): Credential | undefined {
  return credentials.find((c) => c.id === id);
}

function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9& ]/g, " ");
}

export function credentialText(c: Credential): string {
  return normalise(
    [
      c.client,
      c.title,
      c.country,
      c.dealType,
      c.segment,
      c.hmw,
      c.challenge,
      c.results,
      ...c.approach,
      ...c.outcome,
      ...c.deliverables,
      ...c.kpis,
      ...c.themes,
      c.year ? String(c.year) : "",
    ].join(" "),
  );
}

export type CredentialFilters = {
  query?: string;
  segment?: CredentialSegment | "ALL";
  format?: Credential["format"] | "ALL";
  theme?: string;
  includeDrafts?: boolean;
};

export function scoreCredential(c: Credential, query: string): number {
  const terms = normalise(query).split(/\s+/).filter((t) => t.length > 1);
  if (terms.length === 0) return 1;
  const haystack = credentialText(c);
  const client = normalise(c.client);
  let score = 0;
  for (const term of terms) {
    if (client.includes(term)) score += 5;
    if (c.themes.some((theme) => normalise(theme).includes(term))) score += 3;
    if (haystack.includes(term)) score += 1;
    else return 0;
  }
  return score;
}

export function searchCredentials(filters: CredentialFilters): Credential[] {
  const query = filters.query ?? "";
  return credentials
    .filter((c) => filters.includeDrafts || c.status === "complete")
    .filter((c) => !filters.segment || filters.segment === "ALL" || c.segment === filters.segment)
    .filter((c) => !filters.format || filters.format === "ALL" || c.format === filters.format)
    .filter((c) => !filters.theme || c.themes.includes(filters.theme))
    .map((c) => ({ c, score: scoreCredential(c, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || (b.c.year ?? 0) - (a.c.year ?? 0))
    .map(({ c }) => c);
}

export function allThemes(): { theme: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of credentials) {
    if (c.status !== "complete") continue;
    for (const theme of c.themes) counts.set(theme, (counts.get(theme) ?? 0) + 1);
  }
  return Array.from(counts, ([theme, count]) => ({ theme, count })).sort(
    (a, b) => b.count - a.count || a.theme.localeCompare(b.theme),
  );
}

const BLOCK_THEME_HINTS: Record<string, string[]> = {
  "04.01": ["Personas"],
  "04.02": ["Journeys"],
  "04.04": ["Concepts", "Concept sheets"],
  "05.07": ["Idea sheets"],
  "06.02": ["Prioritisation"],
  "06.03": ["Value proposition"],
  "06.X3": ["Prototypes", "User tests"],
  "06.X4": ["Impact map", "Business case"],
  "06.X5": ["Roadmap"],
  "03.04": ["Benchmark"],
};

/** Credentials that illustrate a block: named in its text first, then same segment and theme. */
export function credentialsForBlock(block: MethodBlock, limit = 4): Credential[] {
  const text = normalise([block.example, block.cred, ...Object.values(block.var)].join(" "));
  const complete = credentials.filter((c) => c.status === "complete");
  const named = complete.filter((c) => {
    const first = normalise(c.client).split(" ")[0];
    return first.length > 3 && text.includes(first);
  });
  const hints = BLOCK_THEME_HINTS[block.id] ?? [];
  const themed = complete.filter((c) => hints.some((hint) => c.themes.includes(hint)));
  const segment = complete.filter((c) => c.segment === block.primary && c.format === "case-study");
  const seen = new Set<string>();
  const result: Credential[] = [];
  for (const c of [...named, ...themed, ...segment]) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    result.push(c);
    if (result.length >= limit) break;
  }
  return result;
}

export function credentialsForSegment(segment: CredentialSegment, limit = 6): Credential[] {
  return credentials
    .filter((c) => c.status === "complete" && c.segment === segment)
    .sort((a, b) => (a.format === b.format ? (b.year ?? 0) - (a.year ?? 0) : a.format === "case-study" ? -1 : 1))
    .slice(0, limit);
}
