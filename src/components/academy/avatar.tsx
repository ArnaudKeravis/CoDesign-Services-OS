import type { AvatarChoice } from "@/lib/academy/gamification";

export const AVATAR_COLORS = ["#1a6aff", "#293896", "#8e5cc8", "#ec6a1e", "#2ea36a", "#e0508f", "#0f9fb5", "#f5b700"];
export const AVATAR_SHAPES = ["Diamond", "Spark", "Bubble", "Compass", "Prism", "Wave"] as const;

function Shape({ shape, color }: { shape: number; color: string }) {
  switch (shape % AVATAR_SHAPES.length) {
    case 0:
      return (
        <g>
          <path d="M32 10 L50 32 L32 54 L14 32 Z" fill={color} />
          <path d="M32 10 L50 32 L32 32 Z" fill="white" fillOpacity={0.25} />
        </g>
      );
    case 1:
      return (
        <path
          d="M32 8 L37 26 L56 32 L37 38 L32 56 L27 38 L8 32 L27 26 Z"
          fill={color}
        />
      );
    case 2:
      return (
        <g>
          <circle cx="32" cy="30" r="18" fill={color} />
          <path d="M22 44 L18 54 L30 47 Z" fill={color} />
        </g>
      );
    case 3:
      return (
        <g>
          <circle cx="32" cy="32" r="20" fill="none" stroke={color} strokeWidth="5" />
          <path d="M32 16 L37 32 L32 48 L27 32 Z" fill={color} />
        </g>
      );
    case 4:
      return (
        <g>
          <path d="M32 10 L52 46 L12 46 Z" fill={color} />
          <path d="M32 10 L52 46 L32 46 Z" fill="white" fillOpacity={0.22} />
        </g>
      );
    default:
      return (
        <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
          <path d="M12 24 C20 16, 26 32, 34 24 S 48 16, 52 24" />
          <path d="M12 36 C20 28, 26 44, 34 36 S 48 28, 52 36" />
          <path d="M12 48 C20 40, 26 56, 34 48 S 48 40, 52 48" strokeOpacity={0.6} />
        </g>
      );
  }
}

export function Avatar({ choice, size = 40, initials }: { choice: AvatarChoice; size?: number; initials?: string }) {
  const color = AVATAR_COLORS[choice.color % AVATAR_COLORS.length];
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-full bg-panel ring-2 ring-white"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" width={size * 0.78} height={size * 0.78} aria-hidden>
        <Shape shape={choice.shape} color={color} />
      </svg>
      {initials && (
        <span
          className="absolute -bottom-1 -right-1 rounded-full bg-navy px-1 text-[9px] font-bold leading-4 text-white"
          aria-hidden
        >
          {initials}
        </span>
      )}
    </span>
  );
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
