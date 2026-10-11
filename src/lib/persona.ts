import type { PersonaConfig, RomanceLevel, TraitKey } from "@/types/persona";

/** Every Nexus persona is an adult. Enforced in the UI and on every import. */
export const MIN_PERSONA_AGE = 18;
export const MAX_PERSONA_AGE = 80;

export const MIN_CLONE_SECONDS = 30;
export const RECOMMENDED_CLONE_SECONDS = 90;

const ROMANCE_LEVELS: RomanceLevel[] = ["friendly", "sweet", "romantic"];

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

const DEFAULT_TRAITS: Record<TraitKey, number> = {
  warmth: 85,
  humour: 70,
  playfulness: 65,
  flirtiness: 55,
  confidence: 65,
  curiosity: 75,
  empathy: 85,
  sass: 35,
  energy: 60,
  patience: 70,
  optimism: 75,
  spontaneity: 55,
  intellect: 65,
  romance: 70,
};

export function createDefaultPersona(): PersonaConfig {
  return {
    version: 1,
    id: newId(),
    updatedAt: new Date().toISOString(),
    identity: {
      name: "Aria",
      nickname: "Ari",
      presentation: "feminine",
      pronouns: "she/her",
      apparentAge: 27,
      heritage: "British",
      hometown: "London",
      occupation: "Art curator",
      birthday: "06-14",
      mbti: "ENFJ",
      backstory:
        "Grew up between London galleries and seaside summers in Cornwall. Loves late-night talks, " +
        "rainy-day films and finding the best coffee in any city.",
      userName: "",
    },
    faceBody: {
      heightCm: 168,
      build: "athletic",
      skinTone: "#efc3ae",
      skinFinish: "dewy",
      freckles: 25,
      blush: 40,
      beautyMark: true,
      dimples: false,
      faceShape: "oval",
      eyeShape: "almond",
      eyeColor: "#3f8f4f",
      heterochromia: false,
      eyeColor2: "#3b7dd8",
      lashes: "full",
      brows: "soft-arch",
      browMatchHair: true,
      browColor: "#4a2e20",
      noseShape: "button",
      lipShape: "full",
      lipColor: "#c4566e",
      makeup: "natural",
      facialHair: "none",
    },
    hair: {
      style: "long-wavy",
      length: 70,
      volume: 60,
      color: "#8a3b20",
      colorMode: "balayage",
      secondaryColor: "#d79a6b",
      fringe: "curtain",
      part: "center",
      shine: 55,
      accessoryColor: "#ff4fd8",
    },
    style: {
      realism: "subtle-synthetic",
      accentColor: "#ff4fd8",
      glowIntensity: 55,
      circuitry: "temple",
      earType: "human",
      chassisFinish: "pearl",
      coreLight: false,
      outfit: "smart-casual",
      outfitColor: "#efe9dd",
      accessories: ["studs", "necklace"],
      tattoos: [],
      nailColor: "#f2c4ce",
      fragrance: "Vanilla & amber",
    },
    voice: {
      source: "library",
      presetId: "honey",
      accentId: "british-rp",
      pitch: 0,
      rate: 100,
      volume: 85,
      warmth: 80,
      breathiness: 30,
      expressiveness: 70,
      tone: "Warm",
      speakingStyle: "Playful",
      laugh: "Soft giggle",
      naturalFillers: true,
      whisperAtNight: true,
      singing: false,
      deviceVoiceName: "",
      clone: {
        status: "none",
        samples: [],
        speaker: "",
        speakerName: "",
        consentConfirmed: false,
        consentAt: "",
        similarity: 75,
        stability: 55,
        styleExaggeration: 20,
        engineVoiceId: "",
      },
    },
    personality: {
      archetype: "sweetheart",
      traits: { ...DEFAULT_TRAITS },
      humourStyles: ["Dry British wit", "Teasing banter"],
      loveLanguages: ["Quality time", "Words of affirmation"],
      values: ["Honesty", "Loyalty", "Kindness"],
      interests: ["Art", "Films", "Travel", "Coffee culture", "Music"],
      quirks: ["Hums when thinking", "Sends song recommendations"],
      favouriteMusic: "Indie pop and 80s classics",
      favouriteFood: "Fresh pasta and anything with truffle",
      favouriteFilm: "Notting Hill",
      dreamDestination: "Amalfi Coast",
    },
    relationship: {
      role: "girlfriend",
      stage: "dating",
      romanceLevel: "sweet",
      affection: 75,
      initiative: 55,
      petNames: ["Love", "Darling"],
      customPetName: "",
      emojiUse: 40,
      messageLength: "balanced",
      formality: 25,
      swearing: "never",
      languages: ["English"],
      primaryLanguage: "English",
      rituals: ["good-morning", "good-night", "mood-check", "date-night"],
      wakeTime: "07:30",
      sleepTime: "23:00",
      anniversary: "",
      memoryDepth: "long",
      remembers: ["preferences", "important-dates", "people", "goals", "inside-jokes"],
      supportStyle: "listener",
      conflictStyle: "gentle",
    },
    abilities: {
      form: "desktop-bust",
      mobility: "stationary",
      expressiveness: 70,
      senses: ["face-recognition", "voice-id", "blinking", "breathing", "micro-expressions", "eye-tracking"],
      skills: ["calendar", "news-briefing", "music-dj", "games", "cooking"],
      batteryTier: "extended",
      charging: "wireless-pad",
      connectivity: ["wifi", "bluetooth", "app-sync"],
      skinTemperature: 34,
    },
    privacy: {
      processing: "hybrid",
      retention: "until-deleted",
      shareAnalytics: false,
      guestMode: true,
      wakeWord: "Hey Aria",
      pausePhrase: "Nexus, pause",
      cameraIndicator: true,
      encryptedMemory: true,
      wellbeing: {
        encourageSocial: true,
        breakReminders: true,
        sleepNudges: true,
        spendingGuard: true,
        moodCheckIns: true,
        crisisSupport: true,
        noManipulation: true,
        honestAboutAI: true,
      },
    },
  };
}

/* ---------- Sanitising untrusted persona data (imports, share codes, storage) ---------- */

const HEX = /^#[0-9a-f]{6}$/i;
const MAX_STRING = 4000;

type Json = unknown;

function isPlainObject(v: Json): v is Record<string, Json> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Copies only keys that exist in `base` and whose value has the same shape. */
function mergeKnown<T>(base: T, input: Json): T {
  if (Array.isArray(base)) {
    if (!Array.isArray(input)) return base;
    // String arrays are the common case; object arrays are checked by the caller.
    if (base.length === 0 || typeof base[0] === "string") {
      return input.filter((x) => typeof x === "string").map((s) => (s as string).slice(0, 120)).slice(0, 60) as T;
    }
    return input as T;
  }
  if (isPlainObject(base)) {
    if (!isPlainObject(input)) return base;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(base)) {
      out[key] = mergeKnown((base as Record<string, unknown>)[key], input[key]);
    }
    return out as T;
  }
  if (typeof base === "string") {
    if (typeof input !== "string") return base;
    if (HEX.test(base)) return (HEX.test(input) ? input : base) as T;
    return input.slice(0, MAX_STRING) as T;
  }
  if (typeof base === "number") {
    return (typeof input === "number" && Number.isFinite(input) ? input : base) as T;
  }
  if (typeof base === "boolean") {
    return (typeof input === "boolean" ? input : base) as T;
  }
  return base;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Accepts any JSON-ish value and returns a complete, safe PersonaConfig.
 * `trusted` is true only for data this device wrote itself (local storage);
 * imports and share codes are untrusted, so voice-clone consent and samples
 * from them are discarded — consent must be given on this device.
 */
export function sanitizePersona(input: Json, { trusted = false }: { trusted?: boolean } = {}): PersonaConfig {
  const base = createDefaultPersona();
  const p = mergeKnown(base, input);

  p.version = 1;
  if (!p.id) p.id = newId();

  // Adults only, always.
  p.identity.apparentAge = clamp(Math.round(p.identity.apparentAge), MIN_PERSONA_AGE, MAX_PERSONA_AGE);

  // Romance tops out at tasteful; swearing at mild.
  if (!ROMANCE_LEVELS.includes(p.relationship.romanceLevel)) p.relationship.romanceLevel = "sweet";
  if (p.relationship.swearing !== "never" && p.relationship.swearing !== "mild") p.relationship.swearing = "never";

  // Non-negotiable safety settings.
  p.privacy.cameraIndicator = true;
  p.privacy.encryptedMemory = true;
  p.privacy.wellbeing.crisisSupport = true;
  p.privacy.wellbeing.noManipulation = true;
  p.privacy.wellbeing.honestAboutAI = true;

  // Numeric ranges.
  p.faceBody.heightCm = clamp(p.faceBody.heightCm, 145, 200);
  p.voice.pitch = clamp(p.voice.pitch, -50, 50);
  p.voice.rate = clamp(p.voice.rate, 70, 140);
  p.abilities.skinTemperature = clamp(p.abilities.skinTemperature, 30, 37);
  const pct = (n: number) => clamp(Math.round(n), 0, 100);
  for (const key of Object.keys(p.personality.traits) as TraitKey[]) {
    p.personality.traits[key] = pct(p.personality.traits[key]);
  }
  p.faceBody.freckles = pct(p.faceBody.freckles);
  p.faceBody.blush = pct(p.faceBody.blush);
  p.hair.length = pct(p.hair.length);
  p.hair.volume = pct(p.hair.volume);
  p.hair.shine = pct(p.hair.shine);
  p.style.glowIntensity = pct(p.style.glowIntensity);
  p.voice.volume = pct(p.voice.volume);
  p.voice.warmth = pct(p.voice.warmth);
  p.voice.breathiness = pct(p.voice.breathiness);
  p.voice.expressiveness = pct(p.voice.expressiveness);
  p.relationship.affection = pct(p.relationship.affection);
  p.relationship.initiative = pct(p.relationship.initiative);
  p.relationship.emojiUse = pct(p.relationship.emojiUse);
  p.relationship.formality = pct(p.relationship.formality);
  p.abilities.expressiveness = pct(p.abilities.expressiveness);

  if (!trusted) {
    p.voice.clone = base.voice.clone;
    if (p.voice.source === "clone") p.voice.source = "library";
  }
  const clone = p.voice.clone;
  // mergeKnown treats arrays as string lists, so read sample records from the raw input.
  const rawClone = isPlainObject(input) && isPlainObject(input.voice) && isPlainObject(input.voice.clone) ? input.voice.clone : {};
  const rawSamples: Json[] = trusted && Array.isArray(rawClone.samples) ? rawClone.samples : [];
  clone.samples = rawSamples.flatMap((s) => {
    if (!isPlainObject(s)) return [];
    const { id, name, durationSec, source, peak, rms, createdAt } = s;
    if (typeof id !== "string" || typeof name !== "string" || typeof durationSec !== "number") return [];
    if (source !== "upload" && source !== "recording") return [];
    return [
      {
        id: id.slice(0, 80),
        name: name.slice(0, 120),
        durationSec: clamp(durationSec, 0, 3600),
        source,
        peak: typeof peak === "number" ? clamp(peak, 0, 1) : 0,
        rms: typeof rms === "number" ? clamp(rms, 0, 1) : 0,
        createdAt: typeof createdAt === "string" ? createdAt.slice(0, 40) : new Date().toISOString(),
      },
    ];
  });
  clone.similarity = pct(clone.similarity);
  clone.stability = pct(clone.stability);
  clone.styleExaggeration = pct(clone.styleExaggeration);

  return p;
}

/** Strips device-only data (voice sample references, consent) before sharing a persona. */
export function toShareable(p: PersonaConfig): PersonaConfig {
  const copy: PersonaConfig = JSON.parse(JSON.stringify(p));
  copy.voice.clone = { ...createDefaultPersona().voice.clone };
  if (copy.voice.source === "clone") copy.voice.source = "library";
  copy.identity.userName = "";
  return copy;
}

export function totalSampleSeconds(p: PersonaConfig): number {
  return p.voice.clone.samples.reduce((sum, s) => sum + s.durationSec, 0);
}
