import type { Metadata } from "next";
import { Suspense } from "react";

import { AgentLab } from "@/components/academy/agent-lab";
import { PageHeader } from "@/components/academy/ui";

export const metadata: Metadata = { title: "Agent Lab" };

export default function LabPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        eyebrow="Agent Lab"
        title="Try CoDesign OS agents safely"
        lead="Fill a prompt with a fictional case, run the agent, then do what a professional does: check every line before reuse."
      />
      <Suspense>
        <AgentLab />
      </Suspense>
    </main>
  );
}
