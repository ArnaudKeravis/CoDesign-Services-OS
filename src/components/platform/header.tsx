"use client";

import { Flame, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Avatar, initialsOf } from "@/components/academy/avatar";
import { useProgress } from "@/components/academy/progress-provider";
import { rankFor } from "@/lib/academy/gamification";
import { cn } from "@/lib/academy/cn";

import { CoDesignLockup, SodexoWordmark } from "./brand";

const NAV = [
  { href: "/codesign", label: "CoDesign", hint: "Services, method & credentials" },
  { href: "/os", label: "OS", hint: "AI agents" },
  { href: "/academy", label: "Academy", hint: "Learn & practise" },
];

function XpPill() {
  const { state, ready } = useProgress();
  if (!ready) return <span className="h-9 w-32" aria-hidden />;
  const rank = rankFor(state.xp);
  return (
    <Link
      href="/academy/me"
      className="flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 text-sm transition hover:border-sodexo"
      title={`${rank.current.name} · ${state.xp} XP`}
    >
      <Avatar choice={state.profile.avatar} size={28} initials={initialsOf(state.profile.name)} />
      <span className="font-bold text-navy">{state.xp} XP</span>
      <span className="hidden text-xs text-muted sm:inline">{rank.current.name}</span>
      {state.streak.count > 0 && (
        <span className="flex items-center gap-0.5 text-xs font-semibold text-s04" title="Day streak">
          <Flame size={14} aria-hidden />
          {state.streak.count}
        </span>
      )}
    </Link>
  );
}

export function PlatformHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="CoDesign platform home">
          <span className="brand-gradient flex h-9 items-center rounded-lg px-2.5">
            <SodexoWordmark className="text-[17px]" />
          </span>
          <CoDesignLockup className="hidden sm:inline-flex" />
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Platform">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.hint}
              aria-current={active(item.href) ? "page" : undefined}
              className={cn(
                "relative rounded-lg px-3.5 py-2 text-sm font-semibold transition",
                active(item.href) ? "bg-panel text-navy" : "text-muted hover:bg-panel hover:text-navy",
              )}
            >
              {item.label}
              {item.href === "/academy" && (
                <span className="ml-1.5 rounded-full bg-sodexo px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">v2</span>
              )}
              {active(item.href) && <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-sodexo" aria-hidden />}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <XpPill />
          <button
            type="button"
            className="rounded-lg p-2 text-navy md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-white px-4 py-3 md:hidden" aria-label="Platform mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-semibold",
                active(item.href) ? "bg-panel text-navy" : "text-muted",
              )}
            >
              {item.label} <span className="font-normal text-muted">· {item.hint}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
