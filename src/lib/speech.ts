import type { PersonaConfig } from "@/types/persona";
import { getAccent, getVoicePreset, type Accent } from "@/data/voices";

// In-browser voice previews using the Web Speech API. This approximates the
// production voice: it picks the closest device voice for the accent and
// applies pitch, speed and volume. Cloned voices are rendered by the voice
// engine (see voiceEngine.ts) when one is connected.

export const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;

export function loadDeviceVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!speechSupported) return Promise.resolve([]);
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  if (voices.length) return Promise.resolve(voices);
  return new Promise((resolve) => {
    const done = () => resolve(synth.getVoices());
    synth.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 1500);
  });
}

const FEMALE_HINTS = /female|woman|samantha|serena|kate|stephanie|martha|libby|sonia|fiona|moira|karen|catherine|tessa|veena|aria|jenny|ava|allison|susan|zira|amélie|audrey|alice|mónica|paulina|luciana|anna|alva|ellen|claire|milena|zosia|melina|yelda|kyoko|yuna|emily|natasha|molly|clara|leah|neerja|denise|elsa|elvira|dalia|francisca|katja|sofie|fenna|svetlana|zofia|athina|emel|zariyah|nanami|sunhi/i;
const MALE_HINTS = /\bmale\b|daniel|arthur|oliver|alex|guy|davis|tom|aaron|david|ryan|connor|william|lee|mitchell|liam|luke|rishi|prabhat|thomas|luca|jorge|juan|markus|yuri|ahmet|maged|otoya/i;

function genderScore(voice: SpeechSynthesisVoice, gender: "female" | "male" | "neutral"): number {
  if (gender === "neutral") return 0;
  const isFemale = FEMALE_HINTS.test(voice.name);
  const isMale = MALE_HINTS.test(voice.name) && !/female/i.test(voice.name);
  if (gender === "female") return isFemale ? 2 : isMale ? -2 : 0;
  return isMale ? 2 : isFemale ? -2 : 0;
}

/** Picks the best available device voice for an accent and voice gender. */
export function pickDeviceVoice(
  voices: SpeechSynthesisVoice[],
  accent: Accent,
  gender: "female" | "male" | "neutral",
  overrideName?: string,
): SpeechSynthesisVoice | undefined {
  if (overrideName) {
    const exact = voices.find((v) => v.name === overrideName);
    if (exact) return exact;
  }
  const lang = accent.lang.toLowerCase();
  const base = lang.split("-")[0];
  let best: SpeechSynthesisVoice | undefined;
  let bestScore = -Infinity;
  for (const v of voices) {
    const vLang = v.lang.toLowerCase().replace("_", "-");
    let score = 0;
    if (vLang === lang) score += 10;
    else if (vLang.startsWith(base)) score += 5;
    else continue;
    const prefIndex = accent.preferred.findIndex((p) => v.name.toLowerCase().includes(p.toLowerCase()));
    if (prefIndex >= 0) score += 6 - Math.min(prefIndex, 5) * 0.5;
    score += genderScore(v, gender) * 2;
    if (/natural|neural|online|premium|enhanced/i.test(v.name)) score += 1.5;
    if (score > bestScore) {
      bestScore = score;
      best = v;
    }
  }
  // Nothing for this language: fall back to any English voice of the right gender.
  if (!best) {
    const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
    best = english.sort((a, b) => genderScore(b, gender) - genderScore(a, gender))[0] ?? voices[0];
  }
  return best;
}

export interface SpeakHandle {
  stop: () => void;
}

export function speakAsPersona(
  text: string,
  persona: PersonaConfig,
  voices: SpeechSynthesisVoice[],
  events: { onStart?: () => void; onEnd?: () => void } = {},
): SpeakHandle {
  if (!speechSupported) {
    events.onEnd?.();
    return { stop: () => undefined };
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const { voice } = persona;
  const preset = getVoicePreset(voice.presetId);
  const accent = getAccent(voice.accentId);
  const utter = new SpeechSynthesisUtterance(text);
  const device = pickDeviceVoice(voices, accent, preset.gender, voice.deviceVoiceName);
  if (device) {
    utter.voice = device;
    utter.lang = device.lang;
  } else {
    utter.lang = accent.lang;
  }
  // Breathier, warmer voices read a touch lower and slower in the preview.
  const pitch = preset.basePitch + voice.pitch / 100 - voice.breathiness / 1000 - voice.warmth / 2000;
  const rate = preset.baseRate * (voice.rate / 100) * (1 + (voice.expressiveness - 50) / 1000);
  utter.pitch = Math.min(2, Math.max(0, pitch));
  utter.rate = Math.min(2, Math.max(0.5, rate));
  utter.volume = voice.volume / 100;
  utter.onstart = () => events.onStart?.();
  utter.onend = () => events.onEnd?.();
  utter.onerror = () => events.onEnd?.();
  synth.speak(utter);
  return {
    stop: () => {
      synth.cancel();
      events.onEnd?.();
    },
  };
}
