import type { PersonaConfig } from "@/types/persona";
import { sanitizePersona, toShareable } from "./persona";

// Saved personas live in localStorage on this device. Every read is
// sanitised, so a corrupted or hand-edited entry can't break the app.

const CURRENT_KEY = "nexus.persona.current";
const LIBRARY_KEY = "nexus.persona.library";

function read(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (private mode): the forge still works in memory.
  }
}

export function loadCurrent(): PersonaConfig | null {
  const raw = read(CURRENT_KEY);
  return raw ? sanitizePersona(raw, { trusted: true }) : null;
}

export function saveCurrent(p: PersonaConfig) {
  write(CURRENT_KEY, p);
}

export function loadLibrary(): PersonaConfig[] {
  const raw = read(LIBRARY_KEY);
  return Array.isArray(raw) ? raw.map((r) => sanitizePersona(r, { trusted: true })) : [];
}

export function saveLibrary(list: PersonaConfig[]) {
  write(LIBRARY_KEY, list);
}

/* ---------- Export / import / share codes ---------- */

export function exportJson(p: PersonaConfig): string {
  return JSON.stringify(toShareable(p), null, 2);
}

export function importJson(text: string): PersonaConfig {
  return sanitizePersona(JSON.parse(text));
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(code: string): string {
  const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function toShareCode(p: PersonaConfig): string {
  return `NXS1.${toBase64Url(JSON.stringify(toShareable(p)))}`;
}

export function fromShareCode(code: string): PersonaConfig {
  const trimmed = code.trim();
  if (!trimmed.startsWith("NXS1.")) throw new Error("Not a Nexus share code");
  return sanitizePersona(JSON.parse(fromBase64Url(trimmed.slice(5))));
}
