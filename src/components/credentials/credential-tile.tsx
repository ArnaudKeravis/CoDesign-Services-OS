import Image from "next/image";

import { cn } from "@/lib/academy/cn";
import { credentialImage, type Credential, type CredentialSegment } from "@/lib/credentials";

export const SEG_TONE: Record<CredentialSegment, string> = {
  WORK: "#293896",
  PLAY: "#ec6a1e",
  HEAL: "#2ea36a",
  LEARN: "#8e5cc8",
  OTHER: "#595959",
};

export function SegmentTag({ segment }: { segment: CredentialSegment }) {
  return (
    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white" style={{ background: SEG_TONE[segment] }}>
      {segment === "OTHER" ? "Other" : segment}
    </span>
  );
}

export function CredentialTile({ credential, selected, compact }: { credential: Credential; selected?: boolean; compact?: boolean }) {
  const draft = credential.status === "to-complete";
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border bg-white text-left transition hover:-translate-y-0.5 hover:shadow-lg",
        selected ? "border-sodexo ring-2 ring-sodexo/30" : "border-line",
      )}
    >
      <div className={cn("relative block w-full overflow-hidden bg-panel", compact ? "aspect-[16/7]" : "aspect-[16/9]")}>
        <Image
          src={credentialImage(credential)}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className={cn("object-cover object-top transition duration-500 group-hover:scale-[1.03]", draft && "opacity-40 grayscale")}
        />
        {draft && (
          <span className="absolute left-3 top-3 rounded-md bg-white px-2 py-1 text-xs font-semibold text-muted shadow">
            To complete · owner Arnaud
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <SegmentTag segment={credential.segment} />
          {credential.year && <span className="text-xs font-semibold text-muted">{credential.year}</span>}
          {credential.dealType && <span className="text-xs text-muted">· {credential.dealType}</span>}
          {credential.format === "card" && <span className="text-xs text-muted">· short card</span>}
        </div>
        <h3 className="text-lg font-bold leading-tight">{credential.client}</h3>
        <p className="-mt-1 text-sm text-muted">{credential.title}</p>
        {!compact && credential.themes.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-2">
            {credential.themes.slice(0, 4).map((theme) => (
              <span key={theme} className="rounded-md bg-panel px-1.5 py-0.5 text-[11px] text-navy">
                {theme}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
