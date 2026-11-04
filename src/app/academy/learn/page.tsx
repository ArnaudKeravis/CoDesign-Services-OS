import type { Metadata } from "next";
import { Suspense } from "react";

import { Library } from "@/components/academy/library";
import { PageHeader } from "@/components/academy/ui";
import { campus } from "@/lib/academy/campus";

export const metadata: Metadata = { title: "Learn" };

export default function LearnPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader eyebrow="Learn" title="The method, block by block" lead={campus.taxonomy} />
      <Suspense>
        <Library />
      </Suspense>
    </main>
  );
}
