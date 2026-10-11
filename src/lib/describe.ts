import type { PersonaConfig, TraitKey } from "@/types/persona";
import { ACCENTS, getAccent, getVoicePreset } from "@/data/voices";
import {
  ARCHETYPES, BUILDS, CHASSIS, CIRCUITRY, EAR_TYPES, EYE_SHAPES, FACE_SHAPES, FORMS, FRINGES,
  HAIR_COLOR_MODES, HAIR_STYLES, MAKEUP, OUTFITS, REALISM, ROLES, SENSES, SKILLS, STAGES, TRAITS,
  ACCESSORIES, RITUALS, REMEMBERS, MEMORY_DEPTHS, ROMANCE_LEVELS, PROCESSING, RETENTION, BATTERY, CHARGING, MOBILITY,
  type Option,
} from "@/data/options";

export const labelOf = (options: Option[], value: string) => options.find((o) => o.value === value)?.label ?? value;
export const labelsOf = (options: Option[], values: string[]) => values.map((v) => labelOf(options, v));

export function traitWord(value: number): string {
  if (value >= 85) return "extremely";
  if (value >= 70) return "very";
  if (value >= 55) return "fairly";
  if (value >= 40) return "moderately";
  if (value >= 25) return "slightly";
  return "barely";
}

/** The persona's most defining traits, strongest first. */
export function topTraits(p: PersonaConfig, count = 3): { key: TraitKey; label: string; value: number }[] {
  return TRAITS.map((t) => ({ key: t.key, label: t.label, value: p.personality.traits[t.key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
}

export function petNames(p: PersonaConfig): string[] {
  const names = [...p.relationship.petNames];
  if (p.relationship.customPetName.trim()) names.push(p.relationship.customPetName.trim());
  return names;
}

export function roleLabel(p: PersonaConfig) {
  return labelOf(ROLES, p.relationship.role);
}

export function accentLabel(p: PersonaConfig) {
  return getAccent(p.voice.accentId).label;
}

export function lookSummary(p: PersonaConfig): string {
  const f = p.faceBody;
  const h = p.hair;
  const hairMode = h.colorMode === "solid" ? "" : ` with ${labelOf(HAIR_COLOR_MODES, h.colorMode).toLowerCase()}`;
  return [
    `${labelOf(BUILDS, f.build)} build, ${f.heightCm} cm`,
    `${labelOf(FACE_SHAPES, f.faceShape).toLowerCase()} face, ${labelOf(EYE_SHAPES, f.eyeShape).toLowerCase()} eyes`,
    `${labelOf(HAIR_STYLES, h.style).toLowerCase()} hair${hairMode}, ${labelOf(FRINGES, h.fringe).toLowerCase()}`,
    `${labelOf(MAKEUP, f.makeup).toLowerCase()} makeup`,
    `${labelOf(OUTFITS, p.style.outfit).toLowerCase()}`,
  ].join(" · ");
}

export function specSections(p: PersonaConfig): { title: string; rows: [string, string][] }[] {
  const preset = getVoicePreset(p.voice.presetId);
  const accent = getAccent(p.voice.accentId);
  return [
    {
      title: "Identity",
      rows: [
        ["Name", `${p.identity.name}${p.identity.nickname ? ` ("${p.identity.nickname}")` : ""}`],
        ["Pronouns", p.identity.pronouns],
        ["Apparent age", `${p.identity.apparentAge}`],
        ["Heritage", p.identity.heritage],
        ["Hometown", p.identity.hometown],
        ["Occupation", p.identity.occupation],
        ["Type", p.identity.mbti],
      ],
    },
    {
      title: "Look",
      rows: [
        ["Body", `${labelOf(BUILDS, p.faceBody.build)}, ${p.faceBody.heightCm} cm`],
        ["Face", `${labelOf(FACE_SHAPES, p.faceBody.faceShape)}, ${labelOf(EYE_SHAPES, p.faceBody.eyeShape)} eyes`],
        ["Hair", `${labelOf(HAIR_STYLES, p.hair.style)} · ${labelOf(HAIR_COLOR_MODES, p.hair.colorMode)}`],
        ["Makeup", labelOf(MAKEUP, p.faceBody.makeup)],
        ["Outfit", labelOf(OUTFITS, p.style.outfit)],
        ["Accessories", labelsOf(ACCESSORIES, p.style.accessories).join(", ") || "None"],
        ["Fragrance", p.style.fragrance],
      ],
    },
    {
      title: "Synthetic design",
      rows: [
        ["Realism", labelOf(REALISM, p.style.realism)],
        ["Circuitry", labelOf(CIRCUITRY, p.style.circuitry)],
        ["Ears", labelOf(EAR_TYPES, p.style.earType)],
        ["Chassis", labelOf(CHASSIS, p.style.chassisFinish)],
        ["Core light", p.style.coreLight ? "On" : "Off"],
      ],
    },
    {
      title: "Voice",
      rows: [
        ["Source", p.voice.source === "clone" ? `Custom clone (${p.voice.clone.samples.length} samples)` : `${preset.name} — ${preset.description}`],
        ["Accent", accent.label],
        ["Tone / style", `${p.voice.tone} · ${p.voice.speakingStyle}`],
        ["Laugh", p.voice.laugh],
        ["Pitch / speed", `${p.voice.pitch > 0 ? "+" : ""}${p.voice.pitch} · ${p.voice.rate}%`],
      ],
    },
    {
      title: "Personality",
      rows: [
        ["Archetype", ARCHETYPES.find((a) => a.value === p.personality.archetype)?.label ?? "Custom"],
        ["Top traits", topTraits(p, 4).map((t) => t.label).join(", ")],
        ["Humour", p.personality.humourStyles.join(", ") || "—"],
        ["Love languages", p.personality.loveLanguages.join(", ") || "—"],
        ["Interests", p.personality.interests.join(", ") || "—"],
      ],
    },
    {
      title: "Relationship",
      rows: [
        ["Role", `${roleLabel(p)} · ${labelOf(STAGES, p.relationship.stage)}`],
        ["Romance", labelOf(ROMANCE_LEVELS, p.relationship.romanceLevel)],
        ["Pet names", petNames(p).join(", ") || "—"],
        ["Languages", p.relationship.languages.join(", ")],
        ["Rituals", labelsOf(RITUALS, p.relationship.rituals).join(", ") || "—"],
        ["Memory", `${labelOf(MEMORY_DEPTHS, p.relationship.memoryDepth)} — ${labelsOf(REMEMBERS, p.relationship.remembers).join(", ")}`],
      ],
    },
    {
      title: "Hardware & abilities",
      rows: [
        ["Form", `${labelOf(FORMS, p.abilities.form)} · ${labelOf(MOBILITY, p.abilities.mobility)}`],
        ["Senses", labelsOf(SENSES, p.abilities.senses).join(", ") || "—"],
        ["Skills", labelsOf(SKILLS, p.abilities.skills).join(", ") || "—"],
        ["Power", `${labelOf(BATTERY, p.abilities.batteryTier)} battery · ${labelOf(CHARGING, p.abilities.charging)}`],
      ],
    },
    {
      title: "Privacy",
      rows: [
        ["Processing", labelOf(PROCESSING, p.privacy.processing)],
        ["Retention", labelOf(RETENTION, p.privacy.retention)],
        ["Wake word", p.privacy.wakeWord],
        ["Pause phrase", p.privacy.pausePhrase],
      ],
    },
  ];
}

export const ACCENT_COUNT = ACCENTS.length;
