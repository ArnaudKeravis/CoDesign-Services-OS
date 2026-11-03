import blocks01 from "./data/blocks-01.json";
import blocks02 from "./data/blocks-02.json";
import blocks03 from "./data/blocks-03.json";
import blocks04 from "./data/blocks-04.json";
import blocks05 from "./data/blocks-05.json";
import blocks06 from "./data/blocks-06.json";
import cases from "./data/cases.json";
import formats from "./data/formats.json";
import meta from "./data/meta.json";
import review from "./data/review.json";
import {
  LEVELS,
  SEGMENTS,
  type BlockType,
  type Campus,
  type MethodBlock,
  type Segment,
} from "./types";

export const campus: Campus = {
  meta: meta.meta,
  taxonomy: meta.taxonomy,
  sections: meta.sections,
  lanes: meta.lanes,
  levels: meta.levels as Campus["levels"],
  segments: meta.segments as Segment[],
  blocks: [
    ...blocks01,
    ...blocks02,
    ...blocks03,
    ...blocks04,
    ...blocks05,
    ...blocks06,
  ] as MethodBlock[],
  case_packs: cases as Campus["case_packs"],
  workshop_formats: formats as Campus["workshop_formats"],
  rehearsal_template: review.rehearsal_template,
  maturity_scale: review.maturity_scale,
  rubric_dimensions: review.rubric_dimensions,
  proposed_calendar: review.proposed_calendar,
  sources: review.sources,
  conflicts: review.conflicts,
  miro_board: review.miro_board,
};

export const SECTION_TONE: Record<
  string,
  { bg: string; fg: string; motion: string; short: string }
> = {
  "01": { bg: "#293896", fg: "#ffffff", motion: "Introduction", short: "Our approach" },
  "02": { bg: "#1a6aff", fg: "#ffffff", motion: "Before the diamond", short: "Presales" },
  "03": { bg: "#8e5cc8", fg: "#ffffff", motion: "Diverge", short: "Discover" },
  "04": { bg: "#ec6a1e", fg: "#ffffff", motion: "Converge", short: "Define" },
  "05": { bg: "#2ea36a", fg: "#ffffff", motion: "Diverge", short: "Co-create" },
  "06": { bg: "#e0508f", fg: "#ffffff", motion: "Converge", short: "Test & Deliver" },
};

export const PROPOSED_TONE = "#595959";

export const LEVEL_TONE: Record<string, string> = {
  N0: "#8e5cc8",
  N1: "#1a6aff",
  N2: "#2ea36a",
  N3: "#ec6a1e",
  N4: "#e0508f",
};

export const SEGMENT_TONE: Record<Segment, string> = {
  WORK: "#293896",
  PLAY: "#ec6a1e",
  HEAL: "#2ea36a",
  LEARN: "#8e5cc8",
};

export function blockTone(block: MethodBlock): string {
  if (block.type === "proposed_extension") return PROPOSED_TONE;
  return SECTION_TONE[sectionCodeOf(block.id)]?.bg ?? "#293896";
}

export function sectionCodeOf(id: string): string {
  return id.slice(0, 2);
}

export function blockById(id: string): MethodBlock | undefined {
  return campus.blocks.find((block) => block.id === id);
}

export function blocksInSection(code: string): MethodBlock[] {
  return campus.blocks.filter((block) => sectionCodeOf(block.id) === code);
}

export function blockNeighbors(id: string): {
  prev?: MethodBlock;
  next?: MethodBlock;
} {
  const index = campus.blocks.findIndex((block) => block.id === id);
  return {
    prev: index > 0 ? campus.blocks[index - 1] : undefined,
    next: index >= 0 ? campus.blocks[index + 1] : undefined,
  };
}

export function typeLabel(type: BlockType): string {
  if (type === "foundation") return "Foundation";
  if (type === "source_block") return "Method block";
  return "Proposed extension";
}

export function templateNeedsWork(label: string): boolean {
  return /MISSING|TO LOCATE|TO CREATE|TO CONFIRM/i.test(label);
}

/** Turn a learning-route token into concrete block ids, in campus order. */
export function expandRouteToken(token: string): string[] {
  if (token.endsWith(".*")) {
    const prefix = token.slice(0, -2);
    return campus.blocks
      .filter((block) => block.id.startsWith(`${prefix}.`))
      .map((block) => block.id);
  }

  const numbered = token.match(/^(\d{2})\.(\d{2})-(\d{2})\.(\d{2})$/);
  if (numbered && numbered[1] === numbered[3]) {
    const section = numbered[1];
    const from = Number(numbered[2]);
    const to = Number(numbered[4]);
    return campus.blocks
      .filter((block) => {
        const match = block.id.match(/^(\d{2})\.(\d{2})$/);
        if (!match || match[1] !== section) return false;
        const index = Number(match[2]);
        return index >= from && index <= to;
      })
      .map((block) => block.id);
  }

  if (token === "06.X1-X6") {
    return campus.blocks
      .filter((block) => /^06\.X\d$/.test(block.id))
      .map((block) => block.id);
  }

  return [token];
}

export function isKnownLevel(value: string): boolean {
  return (LEVELS as readonly string[]).includes(value);
}

export function isSegment(value: string): value is Segment {
  return (SEGMENTS as readonly string[]).includes(value);
}
