import { useState } from "react";
import type { Profile, Source } from "../../domain/model.types";
import { newId } from "../../lib/newId";
import { defaultProfile } from "../../store/defaults";

export function useOnboardingDraft(today: string) {
  const [profile, setProfile] = useState<Profile>(() => defaultProfile(today));
  const [sources, setSources] = useState<Source[]>([]);
  return {
    profile,
    sources,
    patchProfile: (patch: Partial<Profile>) => setProfile((p) => ({ ...p, ...patch })),
    addSource: () => setSources((s) => [...s, { id: newId(), name: "", currency: "EUR", zone: "FR" }]),
    updateSource: (id: string, patch: Partial<Source>) => setSources((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    removeSource: (id: string) => setSources((s) => s.filter((x) => x.id !== id)),
    cleanSources: () => sources.map((s) => ({ ...s, name: s.name.trim() })).filter((s) => s.name),
  };
}
