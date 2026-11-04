import Link from "next/link";
import type { ReactNode } from "react";

import { blockTone, campus, LEVEL_TONE, SECTION_TONE, sectionCodeOf, typeLabel } from "@/lib/academy/campus";
import { cn } from "@/lib/academy/cn";
import type { LevelCode, MethodBlock } from "@/lib/academy/types";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[11px] font-bold uppercase tracking-[0.14em] text-sodexo", className)}>{children}</p>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h1>
        {lead && <p className="mt-3 text-base italic text-sodexo md:text-lg">{lead}</p>}
      </div>
      {children}
    </header>
  );
}

export function SectionPill({ code, className }: { code: string; className?: string }) {
  const tone = SECTION_TONE[code];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", className)}
      style={{ background: tone?.bg, color: tone?.fg }}
    >
      {code} {tone?.short}
    </span>
  );
}

export function LevelBar({ level, compact = false }: { level: LevelCode; compact?: boolean }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Target level ${campus.levels.find((l) => l.code === level)?.label}`}>
      {campus.levels.map((l) => {
        const active = l.code === level;
        return (
          <span
            key={l.code}
            className={cn(
              "rounded-md border text-[11px] font-semibold transition",
              compact ? "px-1.5 py-0.5" : "px-2 py-1",
              active ? "border-transparent text-white" : "border-line text-muted",
            )}
            style={active ? { background: LEVEL_TONE[l.code] } : undefined}
          >
            {active && !compact ? l.label : l.code}
          </span>
        );
      })}
    </div>
  );
}

export function TypeTag({ block }: { block: MethodBlock }) {
  if (block.type === "source_block") return null;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        block.type === "proposed_extension" ? "bg-proposed text-white" : "bg-panel-2 text-navy",
      )}
    >
      {block.type === "proposed_extension" ? "Proposed" : typeLabel(block.type)}
    </span>
  );
}

export function BlockChip({ block, className }: { block: MethodBlock; className?: string }) {
  return (
    <Link
      href={`/academy/blocks/${block.id}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm text-ink transition hover:border-sodexo hover:shadow-sm",
        className,
      )}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: blockTone(block) }} aria-hidden />
      <span className="font-mono text-xs text-muted">{block.id}</span>
      <span className="font-medium">{block.name}</span>
    </Link>
  );
}

export function Panel({ children, className, title }: { children: ReactNode; className?: string; title?: string }) {
  return (
    <section className={cn("rounded-2xl bg-panel p-5", className)}>
      {title && <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-sodexo">{title}</h3>}
      {children}
    </section>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(16,24,64,0.04)]", className)}>{children}</div>;
}

export function ProgressRing({
  value,
  size = 44,
  stroke = 5,
  color = "var(--color-sodexo)",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.max(0, Math.min(1, value)))}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-navy">{children}</span>
    </span>
  );
}

export function FictionalBanner() {
  return (
    <div className="rounded-xl border border-dashed border-s04 bg-[#fff6ef] px-4 py-2 text-sm font-semibold text-[#a4470f]">
      Fictional training data — practice case, not a real client.
    </div>
  );
}

export function ToAdd({ owner, what }: { owner: string; what: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-line bg-white px-2 py-0.5 text-xs text-muted">
      To add: {what} · owner {owner}
    </span>
  );
}

export function sectionOf(block: MethodBlock) {
  return campus.sections.find((s) => s.code === sectionCodeOf(block.id));
}
