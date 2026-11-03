"use client";

import {
  BookOpen,
  Briefcase,
  FlaskConical,
  Headphones,
  Home,
  Library,
  Route,
  Swords,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/academy/cn";

const ITEMS = [
  { href: "/academy", label: "Home", icon: Home, exact: true },
  { href: "/academy/learn", label: "Learn", icon: BookOpen, also: ["/academy/blocks"] },
  { href: "/academy/challenges", label: "Challenges", icon: Swords },
  { href: "/academy/lab", label: "Agent Lab", icon: FlaskConical },
  { href: "/academy/cases", label: "Case packs", icon: Briefcase },
  { href: "/academy/credentials", label: "Credentials", icon: Library },
  { href: "/academy/media", label: "Watch & listen", icon: Headphones },
  { href: "/academy/paths", label: "Paths", icon: Route },
  { href: "/academy/me", label: "My progress", icon: UserRound },
];

export function AcademyNav() {
  const pathname = usePathname();
  const isActive = (item: (typeof ITEMS)[number]) =>
    item.exact
      ? pathname === item.href
      : pathname.startsWith(item.href) || (item.also ?? []).some((p) => pathname.startsWith(p));

  return (
    <nav className="sticky top-16 z-40 border-b border-line bg-white/95 backdrop-blur" aria-label="Academy">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 md:px-6 [scrollbar-width:none]">
        <span className="mr-2 hidden shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-sodexo lg:inline">Academy</span>
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition",
                active ? "bg-navy text-white" : "text-navy hover:bg-panel",
              )}
            >
              <Icon size={15} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
