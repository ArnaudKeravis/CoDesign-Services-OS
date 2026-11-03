import type { Metadata } from "next";

import { ChallengeCard } from "@/components/academy/challenge-card";
import { PageHeader } from "@/components/academy/ui";
import { challenges } from "@/lib/academy/extras";
import { ACTIVITY_XP } from "@/lib/academy/gamification";

export const metadata: Metadata = { title: "Challenges" };

export default function ChallengesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        eyebrow="Challenges"
        title="What would you do?"
        lead={`Real-life dilemmas from CoDesign engagements. Pick an answer, read the feedback. +${ACTIVITY_XP.challenge} XP when you get it right first time.`}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {challenges.map((c) => (
          <ChallengeCard key={c.id} challenge={c} />
        ))}
      </div>
    </main>
  );
}
