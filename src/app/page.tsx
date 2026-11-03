import { ArrowRight, Bot, GraduationCap, Layers } from "lucide-react";
import Link from "next/link";

import { BrandPanel, CoDesignLockup, SodexoWordmark } from "@/components/platform/brand";
import { campus } from "@/lib/academy/campus";
import { credentials } from "@/lib/credentials";
import { osAgents } from "@/lib/os/agents";

const ENTRIES = [
  {
    href: "/codesign",
    icon: Layers,
    eyebrow: "01 · CoDesign",
    title: "CoDesign Services",
    text: "Our approach, the five phases from Presales to Test & Deliver, and a searchable library of client credentials.",
    cta: "Explore the offer",
    tone: "#293896",
  },
  {
    href: "/os",
    icon: Bot,
    eyebrow: "02 · OS",
    title: "CoDesign OS",
    text: "The AI agents that draft our artefacts — from Brief Challenger to Credential Writer. Human-led, AI-supported.",
    cta: "Open the agent map",
    tone: "#1a6aff",
  },
  {
    href: "/academy",
    icon: GraduationCap,
    eyebrow: "03 · Academy",
    title: "CoDesign Academy",
    text: "Learn the method by doing: explainers, podcasts, quizzes, case packs, an agent lab, XP and badges.",
    cta: "Start learning",
    tone: "#2ea36a",
    isNew: true,
  },
];

export default function Home() {
  const liveCredentials = credentials.filter((c) => c.status === "complete").length;
  return (
    <main>
      <BrandPanel className="pb-28 pt-16 md:pb-36 md:pt-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center gap-3">
            <SodexoWordmark className="text-3xl" />
            <CoDesignLockup />
          </div>
          <h1 className="mt-8 max-w-3xl text-4xl font-bold leading-[1.05] !text-white md:text-6xl">
            Design better experiences, together.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/85 md:text-xl">
            One platform for the CoDesign method, the agents that support it and the academy that teaches it.
          </p>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-white">
            {[
              { k: "Method blocks", v: campus.blocks.length },
              { k: "OS agents in the method", v: osAgents.length },
              { k: "Credentials", v: liveCredentials },
              { k: "Campus sections", v: campus.sections.length },
            ].map((stat) => (
              <div key={stat.k}>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/70">{stat.k}</dt>
                <dd className="font-display text-3xl font-bold">{stat.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </BrandPanel>

      <section className="mx-auto -mt-20 max-w-7xl px-4 md:-mt-24 md:px-6" aria-label="Entry points">
        <div className="grid gap-5 md:grid-cols-3">
          {ENTRIES.map((entry, i) => {
            const Icon = entry.icon;
            return (
              <Link
                key={entry.href}
                href={entry.href}
                className="group relative flex animate-rise flex-col rounded-3xl border border-line bg-white p-7 shadow-[0_20px_50px_-20px_rgba(18,56,196,0.35)] transition hover:-translate-y-1 hover:border-sodexo"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className="absolute inset-x-7 top-0 h-1 rounded-b-full" style={{ background: entry.tone }} aria-hidden />
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: entry.tone }}>
                    <Icon size={22} aria-hidden />
                  </span>
                  {entry.isNew && (
                    <span className="rounded-full bg-panel px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sodexo">New · v2</span>
                  )}
                </div>
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{entry.eyebrow}</p>
                <h2 className="mt-1 text-2xl font-bold">{entry.title}</h2>
                <p className="mt-3 flex-1 text-muted">{entry.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-sodexo">
                  {entry.cta}
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-8 rounded-3xl bg-panel p-8 md:grid-cols-[1.2fr_1fr] md:p-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-sodexo">How it fits together</p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">Learn it in the Academy. Draft it with the OS. Prove it with credentials.</h2>
            <p className="mt-3 text-muted">{campus.taxonomy}</p>
          </div>
          <ol className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-white sm:grid-cols-6">
            {campus.sections.map((s, i) => (
              <li
                key={s.code}
                className="flex aspect-square flex-col items-center justify-center rounded-2xl p-2"
                style={{ background: ["#293896", "#1a6aff", "#8e5cc8", "#ec6a1e", "#2ea36a", "#e0508f"][i] }}
              >
                <span className="text-lg font-bold">{s.code}</span>
                <span className="leading-tight">{s.name.replace(/^\d+\s/, "")}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
