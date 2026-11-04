import type { Metadata } from "next";
import { Suspense } from "react";

import { CredentialQuest } from "@/components/academy/credential-quest";
import { Eyebrow, PageHeader } from "@/components/academy/ui";
import { CredentialsBrowser } from "@/components/credentials/credentials-browser";
import { blockById } from "@/lib/academy/campus";

export const metadata: Metadata = { title: "Credentials" };

export default function AcademyCredentialsPage() {
  const block = blockById("02.02");
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader eyebrow="Credentials" title="Credential Quest" lead={block?.explain} />
      <section>
        <p className="mb-4 max-w-3xl text-muted">
          Pick a fictional brief, search the real credential library, and build a three-credential shortlist with a one-line rationale each. Scoring rewards relevance to the user moment and constraint — not the biggest logo.
        </p>
        <CredentialQuest />
      </section>
      <section className="mt-14">
        <Eyebrow>Library</Eyebrow>
        <h2 className="mb-5 mt-1 text-2xl font-bold">Search all credentials</h2>
        <Suspense>
          <CredentialsBrowser basePath="/academy/credentials" />
        </Suspense>
      </section>
    </main>
  );
}
