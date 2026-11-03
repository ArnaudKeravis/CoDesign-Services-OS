import { describe, expect, it } from "vitest";

import {
  blockById,
  campus,
  expandRouteToken,
  isKnownLevel,
  isSegment,
} from "@/lib/academy/campus";

describe("CoDesign Academy campus", () => {
  it("keeps six sections and one introduction before the diamond", () => {
    expect(campus.sections.map((section) => section.code)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
    ]);
    expect(campus.taxonomy).toMatch(/Presales precedes/);
  });

  it("loads every method block once, with a real section, level and segment", () => {
    const ids = campus.blocks.map((block) => block.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toHaveLength(35);

    for (const block of campus.blocks) {
      expect(campus.sections.some((section) => section.name === block.phase)).toBe(
        true,
      );
      expect(isKnownLevel(block.lvl)).toBe(true);
      expect(isSegment(block.primary)).toBe(true);
      expect(block.answer_key.sample_answer.length).toBeGreaterThan(0);
      expect(block.exercise.questions.length).toBeGreaterThan(0);
      expect(blockById(block.id)?.name).toBe(block.name);
    }
  });

  it("keeps fictional case packs for all four segments", () => {
    for (const segment of campus.segments) {
      const pack = campus.case_packs[segment];
      expect(pack.evidence.length).toBeGreaterThan(0);
      expect(pack.journey.length).toBeGreaterThanOrEqual(5);
      expect(`${pack.client} ${pack.credentials}`.toLowerCase()).toMatch(/fiction|fictional|verify/);
    }
  });

  it("sums the workshop formats to a half day and a full day", () => {
    const sum = (code: "A" | "B") =>
      campus.workshop_formats[code].agenda.reduce((total, item) => total + item.minutes, 0);
    expect(sum("A")).toBe(240);
    expect(sum("B")).toBe(480);
  });

  it("expands learning-route tokens onto real blocks", () => {
    expect(expandRouteToken("01.*")).toEqual(["01.01", "01.02", "01.03", "01.04"]);
    expect(expandRouteToken("04.01-04.07")).toEqual([
      "04.01",
      "04.02",
      "04.03",
      "04.04",
      "04.05",
      "04.06",
      "04.07",
    ]);
    expect(expandRouteToken("06.X1-X6")).toEqual([
      "06.X1",
      "06.X2",
      "06.X3",
      "06.X4",
      "06.X5",
      "06.X6",
    ]);
    expect(expandRouteToken("04.02")).toEqual(["04.02"]);
  });
});
