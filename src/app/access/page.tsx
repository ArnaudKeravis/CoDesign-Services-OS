import type { Metadata } from "next";

import { BrandPanel, CoDesignLockup, SodexoWordmark } from "@/components/platform/brand";

export const metadata: Metadata = { title: "Access" };

export default async function AccessPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next = "/", error } = await searchParams;
  return (
    <BrandPanel className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <form action="/api/access" method="post" className="mx-auto w-full max-w-sm rounded-3xl bg-white p-8 text-ink shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="brand-gradient flex h-9 items-center rounded-lg px-2.5"><SodexoWordmark className="text-[17px]" /></span>
          <CoDesignLockup />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Internal platform</h1>
        <p className="mt-1 text-sm text-muted">Enter the team access code to continue.</p>
        <input type="hidden" name="next" value={next} />
        <label className="mt-5 block text-sm font-semibold text-navy" htmlFor="code">Access code</label>
        <input id="code" name="code" type="password" required autoFocus className="mt-1 w-full rounded-xl border border-line px-3 py-2.5 outline-none focus:border-sodexo" />
        {error && <p className="mt-2 text-sm text-star">That code is not valid.</p>}
        <button type="submit" className="mt-5 w-full rounded-xl bg-navy px-4 py-2.5 font-semibold text-white">Enter</button>
      </form>
    </BrandPanel>
  );
}
