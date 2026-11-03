import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/academy/ui";
import { CredentialsBrowser } from "@/components/credentials/credentials-browser";
import { credentials, credentialSource } from "@/lib/credentials";

export const metadata: Metadata = { title: "Credentials" };

export default function CredentialsPage() {
  const live = credentials.filter((c) => c.status === "complete").length;
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        eyebrow="CoDesign · Credentials"
        title="Credentials library"
        lead="Don't show everything we have done. Show what proves we can solve this client's challenge."
      >
        <div className="rounded-2xl bg-panel px-4 py-3 text-sm text-muted">
          <p>
            <span className="font-bold text-navy">{live}</span> credentials from “{credentialSource.name}”
          </p>
          <p className="text-xs">Imported {credentialSource.imported} · owner {credentialSource.owner}</p>
        </div>
      </PageHeader>
      <Suspense>
        <CredentialsBrowser basePath="/codesign/credentials" />
      </Suspense>
    </main>
  );
}
