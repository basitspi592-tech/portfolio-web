import { useSyncExternalStore } from "react";
import type { Section } from "./data";

// Shared mutable input state read by the 3D loop every frame.
export const input = { keys: {} as Record<string, boolean>, auto: null as Section | null };

let active: string | null = null;
const subs = new Set<() => void>();
export function setActive(id: string | null) {
  if (id === active) return;
  active = id;
  subs.forEach((f) => f());
}
export function useActive() {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => { subs.delete(cb); }; },
    () => active,
    () => null
  );
}
