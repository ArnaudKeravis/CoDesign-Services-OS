import { cn } from "@/lib/academy/cn";

export function SodexoWordmark({ className, tone = "white" }: { className?: string; tone?: "white" | "navy" }) {
  return (
    <span
      className={cn(
        "relative inline-block font-display text-[1.35em] font-bold italic leading-none tracking-[-0.04em]",
        tone === "white" ? "text-white" : "text-navy",
        className,
      )}
      aria-label="Sodexo"
    >
      sodex
      <span className="relative">
        o
        <span className="absolute -top-[0.28em] left-[0.05em] h-[0.22em] w-[0.22em] rotate-45 rounded-[1px] bg-star" aria-hidden />
      </span>
    </span>
  );
}

export function CoDesignLockup({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-stretch overflow-hidden rounded-[4px] text-[11px] font-semibold", className)}>
      <span className="bg-navy-deep px-2.5 py-1 text-white">CoDesign</span>
      {!compact && <span className="bg-white px-2.5 py-1 text-navy ring-1 ring-inset ring-line">Services</span>}
    </span>
  );
}

/** Flowing vertical strands, like the CoDesign deck's right-hand panel. */
function wavePaths(count: number, width: number, height: number, seed: number): string[] {
  const paths: string[] = [];
  const steps = 48;
  const freq = (Math.PI * 2 * 1.35) / height;
  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    const base = t * width * 1.3 - width * 0.15;
    const amp = 38 + 26 * Math.sin(seed + i * 0.7);
    const phase = seed * 0.9 + t * 1.6;
    const drift = 0.08 + 0.05 * Math.cos(seed + i);
    let d = "";
    for (let s = 0; s <= steps; s += 1) {
      const y = -30 + (s / steps) * (height + 60);
      const x = base + amp * Math.sin(y * freq + phase) + amp * 0.35 * Math.sin(y * freq * 2.1 + phase * 1.7) + drift * y;
      d += `${s === 0 ? "M" : " L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    paths.push(d);
  }
  return paths;
}

export function Waves({
  className,
  count = 16,
  seed = 7,
  opacity = 0.55,
  animate = true,
}: {
  className?: string;
  count?: number;
  seed?: number;
  opacity?: number;
  animate?: boolean;
}) {
  const width = 600;
  const height = 800;
  const paths = wavePaths(count, width, height, seed);
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="white"
          strokeOpacity={opacity * (0.45 + ((i * 29) % 55) / 100)}
          strokeWidth={i % 4 === 0 ? 1.6 : 1}
          className={animate ? "wave-line" : undefined}
          style={animate ? { animationDelay: `${(i % 8) * 0.12}s` } : undefined}
        />
      ))}
    </svg>
  );
}

export function BrandPanel({
  className,
  children,
  seed,
}: {
  className?: string;
  children?: React.ReactNode;
  seed?: number;
}) {
  return (
    <div className={cn("brand-gradient relative overflow-hidden text-white", className)}>
      <Waves seed={seed} />
      <div className="relative">{children}</div>
    </div>
  );
}
