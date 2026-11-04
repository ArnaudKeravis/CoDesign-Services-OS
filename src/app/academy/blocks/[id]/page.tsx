import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlockLesson } from "@/components/academy/block-lesson";
import { blockById, blockNeighbors, blockTone, campus } from "@/lib/academy/campus";
import {
  humanChecks,
  podcastFor,
  podcastMinutes,
  promptTemplate,
  quizFor,
  shuffledSteps,
  videoFor,
  videoSeconds,
} from "@/lib/academy/learning";
import { credentialsForBlock } from "@/lib/credentials";

export function generateStaticParams() {
  return campus.blocks.map((block) => ({ id: block.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const block = blockById(id);
  return { title: block ? `${block.id} ${block.name}` : "Block" };
}

export default async function BlockPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const block = blockById(id);
  if (!block) notFound();
  const { prev, next } = blockNeighbors(id);
  const scenes = videoFor(block);
  const podcast = podcastFor(block);

  return (
    <BlockLesson
      block={block}
      tone={blockTone(block)}
      prev={prev && { id: prev.id, name: prev.name }}
      next={next && { id: next.id, name: next.name }}
      quiz={quizFor(block)}
      steps={shuffledSteps(block)}
      scenes={scenes}
      videoSeconds={videoSeconds(scenes)}
      podcast={podcast}
      podcastMinutes={podcastMinutes(podcast)}
      prompt={promptTemplate(block)}
      checks={humanChecks(block)}
      credentials={credentialsForBlock(block)}
    />
  );
}
