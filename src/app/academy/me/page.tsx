import type { Metadata } from "next";

import { MyProgress } from "@/components/academy/my-progress";
import { PageHeader } from "@/components/academy/ui";

export const metadata: Metadata = { title: "My progress" };

export default function MePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader eyebrow="My progress" title="Your learning profile" lead="Progress is stored only in this browser. Export it any time." />
      <MyProgress />
    </main>
  );
}
