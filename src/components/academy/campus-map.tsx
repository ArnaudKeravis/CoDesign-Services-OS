"use client";

import Link from "next/link";

import { blocksInSection, campus, SECTION_TONE } from "@/lib/academy/campus";
import { blockProgress } from "@/lib/academy/gamification";

import { useProgress } from "./progress-provider";

function useSectionProgress() {
  const { state } = useProgress();
  return Object.fromEntries(
    campus.sections.map((s) => {
      const ids = blocksInSection(s.code).map((b) => b.id);
      const done = ids.filter((id) => blockProgress(state, id).complete).length;
      return [s.code, { done, total: ids.length }];
    }),
  ) as Record<string, { done: number; total: number }>;
}

export function CampusMap() {
  const progress = useSectionProgress();
  const W = 1000;
  const H = 300;
  const cy = H / 2;
  const d1 = { x0: 300, x1: 640 };
  const d2 = { x0: 640, x1: 980 };
  const half = (x0: number, x1: number, side: "left" | "right") => {
    const mid = (x0 + x1) / 2;
    return side === "left"
      ? `${x0},${cy} ${mid},${cy - 130} ${mid},${cy + 130}`
      : `${mid},${cy - 130} ${x1},${cy} ${mid},${cy + 130}`;
  };
  const shapes = [
    { code: "03", points: half(d1.x0, d1.x1, "left"), tx: d1.x0 + 105, label: "Discover" },
    { code: "04", points: half(d1.x0, d1.x1, "right"), tx: d1.x1 - 105, label: "Define" },
    { code: "05", points: half(d2.x0, d2.x1, "left"), tx: d2.x0 + 105, label: "Co-create" },
    { code: "06", points: half(d2.x0, d2.x1, "right"), tx: d2.x1 - 105, label: "Test & Deliver" },
  ];

  return (
    <div className="rounded-3xl border border-line bg-white p-4 md:p-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Campus map: our approach, presales, then the double diamond">
        {[
          { code: "01", x: 20, label: "Our approach" },
          { code: "02", x: 160, label: "Presales" },
        ].map((item) => (
          <a key={item.code} href={`/academy/learn?section=${item.code}`}>
            <g className="cursor-pointer transition-opacity hover:opacity-85">
              <rect x={item.x} y={cy - 60} width={125} height={120} rx={18} fill={SECTION_TONE[item.code].bg} />
              <text x={item.x + 62} y={cy - 18} textAnchor="middle" fill="white" fontSize="26" fontWeight="700">{item.code}</text>
              <text x={item.x + 62} y={cy + 8} textAnchor="middle" fill="white" fontSize="14" fontWeight="600">{item.label}</text>
              <text x={item.x + 62} y={cy + 34} textAnchor="middle" fill="white" fillOpacity="0.85" fontSize="13">
                {progress[item.code]?.done}/{progress[item.code]?.total}
              </text>
            </g>
          </a>
        ))}
        {shapes.map((shape) => (
          <a key={shape.code} href={`/academy/learn?section=${shape.code}`}>
            <g className="cursor-pointer transition-opacity hover:opacity-85">
              <polygon points={shape.points} fill={SECTION_TONE[shape.code].bg} stroke="white" strokeWidth="3" />
              <text x={shape.tx} y={cy - 6} textAnchor="middle" fill="white" fontSize="22" fontWeight="700">{shape.code}</text>
              <text x={shape.tx} y={cy + 16} textAnchor="middle" fill="white" fontSize="13" fontWeight="600">{shape.label}</text>
              <text x={shape.tx} y={cy + 38} textAnchor="middle" fill="white" fillOpacity="0.85" fontSize="12">
                {progress[shape.code]?.done}/{progress[shape.code]?.total}
              </text>
            </g>
          </a>
        ))}
        <text x={(d1.x0 + d1.x1) / 2} y={H - 4} textAnchor="middle" fill="#5d6475" fontSize="13">Diamond 1 · the problem</text>
        <text x={(d2.x0 + d2.x1) / 2} y={H - 4} textAnchor="middle" fill="#5d6475" fontSize="13">Diamond 2 · the solution</text>
      </svg>
      <p className="mt-2 text-center text-sm text-muted">{campus.taxonomy}</p>
      <p className="sr-only">
        {campus.sections.map((s) => `${s.name}: ${progress[s.code]?.done} of ${progress[s.code]?.total} blocks complete.`).join(" ")}
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2 md:hidden">
        {campus.sections.map((s) => (
          <Link key={s.code} href={`/academy/learn?section=${s.code}`} className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: SECTION_TONE[s.code].bg }}>
            {s.code} {SECTION_TONE[s.code].short}
          </Link>
        ))}
      </div>
    </div>
  );
}
