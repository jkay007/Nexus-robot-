import type { PersonaConfig } from "@/types/persona";
import { loadSample } from "./voiceStore";

// Adapter for the production voice-cloning engine.
//
// The browser never holds provider API keys. Point VITE_VOICE_ENGINE_URL at
// your own backend (e.g. a Supabase edge function) that forwards the samples
// to a cloning provider such as ElevenLabs Instant Voice Cloning and returns
// { voiceId }. See README → "Connecting a voice engine".

const ENGINE_URL = (import.meta.env.VITE_VOICE_ENGINE_URL as string | undefined)?.replace(/\/$/, "");

export const voiceEngineConfigured = Boolean(ENGINE_URL);

export async function submitClone(persona: PersonaConfig): Promise<{ voiceId: string }> {
  if (!ENGINE_URL) throw new Error("No voice engine connected. Set VITE_VOICE_ENGINE_URL.");
  const { clone } = persona.voice;
  if (!clone.consentConfirmed) throw new Error("Speaker consent is required before cloning.");

  const form = new FormData();
  form.append("name", `${persona.identity.name || "Nexus"} voice`);
  form.append(
    "settings",
    JSON.stringify({
      similarity: clone.similarity / 100,
      stability: clone.stability / 100,
      style: clone.styleExaggeration / 100,
      accent: persona.voice.accentId,
    }),
  );
  form.append(
    "consent",
    JSON.stringify({ speaker: clone.speaker, speakerName: clone.speakerName, confirmedAt: clone.consentAt }),
  );
  for (const s of clone.samples) {
    const blob = await loadSample(s.id);
    if (blob) form.append("samples", blob, s.name);
  }

  const res = await fetch(`${ENGINE_URL}/voices`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Voice engine returned ${res.status}`);
  const body = (await res.json()) as { voiceId?: string };
  if (!body.voiceId) throw new Error("Voice engine did not return a voiceId");
  return { voiceId: body.voiceId };
}
