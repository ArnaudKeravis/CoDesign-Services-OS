import type { Metadata } from "next";

import { MediaHub, type MediaItem } from "@/components/academy/media-hub";
import { PageHeader } from "@/components/academy/ui";
import { blockTone, campus, sectionCodeOf } from "@/lib/academy/campus";
import { podcastFor, podcastMinutes, videoFor, videoSeconds } from "@/lib/academy/learning";

export const metadata: Metadata = { title: "Watch & listen" };

export default function MediaPage() {
  const items: MediaItem[] = campus.blocks.map((block) => {
    const lines = podcastFor(block);
    const scenes = videoFor(block);
    return {
      id: block.id,
      name: block.name,
      section: sectionCodeOf(block.id),
      tone: blockTone(block),
      explain: block.explain,
      minutes: podcastMinutes(lines),
      videoSeconds: videoSeconds(scenes),
      lines,
      scenes,
    };
  });
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        eyebrow="Watch & listen"
        title="Learn on the go"
        lead="A motion explainer and a two-voice podcast for every block — generated from the method cards, narrated by your browser."
      />
      <MediaHub items={items} />
    </main>
  );
}
