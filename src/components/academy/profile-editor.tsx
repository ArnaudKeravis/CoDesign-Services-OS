"use client";

import { useState } from "react";

import { cn } from "@/lib/academy/cn";

import { Avatar, AVATAR_COLORS, AVATAR_SHAPES } from "./avatar";
import { useProgress } from "./progress-provider";

export const ROLES = [
  "Sales / BRM",
  "Site or operations manager",
  "Designer / CoDesign team",
  "Facilitator / champion",
  "Marketing / offer",
  "Other",
];

export function ProfileEditor({ onDone, compact = false }: { onDone?: () => void; compact?: boolean }) {
  const { state, update, award } = useProgress();
  const [name, setName] = useState(state.profile.name);
  const [role, setRole] = useState(state.profile.role || ROLES[0]);
  const [avatar, setAvatar] = useState(state.profile.avatar);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        update((s) => ({ ...s, profile: { name: name.trim(), role, avatar } }));
        if (name.trim()) award("profile:created", 10, "Learner profile created");
        onDone?.();
      }}
    >
      <div className={cn("grid gap-3", !compact && "sm:grid-cols-2")}>
        <label className="block text-sm">
          <span className="font-semibold text-navy">First name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            placeholder="First name only"
            className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 outline-none focus:border-sodexo"
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold text-navy">I am mostly…</span>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2">
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>
      <fieldset>
        <legend className="text-sm font-semibold text-navy">Avatar</legend>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Avatar shape">
          {AVATAR_SHAPES.map((shape, i) => (
            <button
              key={shape}
              type="button"
              role="radio"
              aria-checked={avatar.shape === i}
              aria-label={shape}
              onClick={() => setAvatar((a) => ({ ...a, shape: i }))}
              className={cn("rounded-full p-0.5 transition", avatar.shape === i ? "ring-2 ring-sodexo" : "opacity-70 hover:opacity-100")}
            >
              <Avatar choice={{ shape: i, color: avatar.color }} size={44} />
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Avatar colour">
          {AVATAR_COLORS.map((color, i) => (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={avatar.color === i}
              aria-label={`Colour ${i + 1}`}
              onClick={() => setAvatar((a) => ({ ...a, color: i }))}
              className={cn("h-7 w-7 rounded-full transition", avatar.color === i ? "ring-2 ring-navy ring-offset-2" : "")}
              style={{ background: color }}
            />
          ))}
        </div>
      </fieldset>
      <button type="submit" className="rounded-xl bg-sodexo px-4 py-2.5 text-sm font-semibold text-white hover:bg-sodexo-deep">
        Save my profile
      </button>
      <p className="text-xs text-muted">Stored only in this browser. No account, no tracking.</p>
    </form>
  );
}
