import type { PersonaConfig, TraitKey } from "@/types/persona";
import {
  ACCENT_COLORS, ARCHETYPES, BROWS, CIRCUITRY, EAR_TYPES, EYE_COLORS, EYE_SHAPES, FACE_SHAPES, FANTASY_HAIR,
  FRINGES, HAIR_COLOR_MODES, HAIR_STYLES, HUMOUR_STYLES, INTERESTS, LIP_COLORS, LIP_SHAPES, MAKEUP, NATURAL_HAIR,
  NOSES, OUTFIT_COLORS, OUTFITS, QUIRKS, REALISM, SKIN_TONES, TRAITS, BUILDS, ACCESSORIES, NAIL_COLORS,
} from "@/data/options";
import { ACCENTS, VOICE_PRESETS } from "@/data/voices";
import { sanitizePersona } from "./persona";

const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];
const some = <T,>(list: readonly T[], min: number, max: number): T[] => {
  const n = min + Math.floor(Math.random() * (max - min + 1));
  return [...list].sort(() => Math.random() - 0.5).slice(0, n);
};
const between = (lo: number, hi: number) => Math.round(lo + Math.random() * (hi - lo));

const FEMININE_NAMES = ["Aria", "Luna", "Sofia", "Elena", "Nova", "Jade", "Ayla", "Isla", "Mila", "Zara", "Ivy", "Freya", "Naomi", "Selin", "Chloe", "Maya", "Rosa", "Eden", "Skye", "Lyra"];
const MASCULINE_NAMES = ["Leo", "Kai", "Ethan", "Rafael", "Oscar", "Theo", "Emre", "Jasper", "Felix", "Noah"];
const NEUTRAL_NAMES = ["Echo", "River", "Sage", "Quinn", "Rowan", "Onyx", "Avery", "Phoenix"];
const FEMININE_STYLES = HAIR_STYLES.filter((s) => !["short-crop", "slicked-back", "buzz"].includes(s.value));
const MASCULINE_STYLES = HAIR_STYLES.filter((s) => ["short-crop", "slicked-back", "buzz", "side-shave", "curly", "afro", "shag", "ponytail"].includes(s.value));

/** Rolls a new look, voice and personality while keeping the owner's name and privacy choices. */
export function randomise(current: PersonaConfig): PersonaConfig {
  const p: PersonaConfig = JSON.parse(JSON.stringify(current));
  const presentation = p.identity.presentation;
  const names = presentation === "masculine" ? MASCULINE_NAMES : presentation === "androgynous" ? NEUTRAL_NAMES : FEMININE_NAMES;
  p.identity.name = pick(names);
  p.identity.apparentAge = between(21, 45);

  const fantasy = Math.random() < 0.3;
  const hairColor = pick(fantasy ? FANTASY_HAIR : NATURAL_HAIR).hex;
  p.hair = {
    ...p.hair,
    style: pick(presentation === "masculine" ? MASCULINE_STYLES : FEMININE_STYLES).value as PersonaConfig["hair"]["style"],
    color: hairColor,
    colorMode: pick(HAIR_COLOR_MODES).value as PersonaConfig["hair"]["colorMode"],
    secondaryColor: pick([...FANTASY_HAIR, ...NATURAL_HAIR]).hex,
    fringe: pick(FRINGES).value as PersonaConfig["hair"]["fringe"],
    length: between(30, 95),
    volume: between(30, 90),
    shine: between(30, 85),
  };

  const realism = pick(REALISM).value as PersonaConfig["style"]["realism"];
  p.faceBody = {
    ...p.faceBody,
    skinTone: pick(realism === "full-cyborg" ? SKIN_TONES.slice(12) : SKIN_TONES.slice(0, 12)).hex,
    build: pick(BUILDS).value as PersonaConfig["faceBody"]["build"],
    heightCm: between(155, presentation === "masculine" ? 192 : 180),
    faceShape: pick(FACE_SHAPES).value as PersonaConfig["faceBody"]["faceShape"],
    eyeShape: pick(EYE_SHAPES).value as PersonaConfig["faceBody"]["eyeShape"],
    eyeColor: pick(EYE_COLORS).hex,
    heterochromia: Math.random() < 0.12,
    eyeColor2: pick(EYE_COLORS).hex,
    brows: pick(BROWS).value as PersonaConfig["faceBody"]["brows"],
    noseShape: pick(NOSES).value as PersonaConfig["faceBody"]["noseShape"],
    lipShape: pick(LIP_SHAPES).value as PersonaConfig["faceBody"]["lipShape"],
    lipColor: pick(LIP_COLORS).hex,
    makeup: (presentation === "masculine" ? "none" : pick(MAKEUP).value) as PersonaConfig["faceBody"]["makeup"],
    freckles: Math.random() < 0.4 ? between(10, 80) : 0,
    blush: between(5, 60),
    beautyMark: Math.random() < 0.3,
  };

  p.style = {
    ...p.style,
    realism,
    accentColor: pick(ACCENT_COLORS).hex,
    circuitry: pick(CIRCUITRY).value as PersonaConfig["style"]["circuitry"],
    earType: pick(EAR_TYPES).value as PersonaConfig["style"]["earType"],
    outfit: pick(OUTFITS).value as PersonaConfig["style"]["outfit"],
    outfitColor: pick(OUTFIT_COLORS).hex,
    accessories: some(ACCESSORIES, 0, 3).map((a) => a.value),
    nailColor: pick(NAIL_COLORS).hex,
    glowIntensity: between(30, 95),
    coreLight: realism === "full-cyborg" || Math.random() < 0.2,
  };

  const genders = presentation === "masculine" ? ["male", "neutral"] : presentation === "androgynous" ? ["neutral", "female", "male"] : ["female"];
  p.voice = {
    ...p.voice,
    presetId: pick(VOICE_PRESETS.filter((v) => genders.includes(v.gender))).id,
    accentId: pick(ACCENTS).id,
    pitch: between(-15, 15),
    rate: between(90, 110),
  };

  const archetype = pick(ARCHETYPES);
  const traits = {} as Record<TraitKey, number>;
  for (const t of TRAITS) traits[t.key] = archetype.traits[t.key] ?? between(25, 85);
  p.personality = {
    ...p.personality,
    archetype: archetype.value,
    traits,
    humourStyles: some(HUMOUR_STYLES, 1, 3),
    interests: some(INTERESTS, 4, 7),
    quirks: some(QUIRKS, 1, 3),
  };
  p.privacy.wakeWord = `Hey ${p.identity.name}`;
  p.updatedAt = new Date().toISOString();
  return sanitizePersona(p, { trusted: true });
}
