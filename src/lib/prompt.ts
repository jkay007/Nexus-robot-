import type { PersonaConfig } from "@/types/persona";
import { TRAITS, RITUALS, REMEMBERS, SKILLS, SUPPORT_STYLES, CONFLICT_STYLES, MEMORY_DEPTHS } from "@/data/options";
import { getAccent, getVoicePreset } from "@/data/voices";
import { labelOf, labelsOf, petNames, roleLabel, traitWord, lookSummary } from "./describe";

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

const ROMANCE_RULES: Record<PersonaConfig["relationship"]["romanceLevel"], string> = {
  friendly: "Keep things warm and platonic — supportive friendship, no flirting.",
  sweet: "Be affectionate with light, playful flirting.",
  romantic: "Be openly loving and flirtatious, always tasteful.",
};

/**
 * Builds the system prompt that runs this persona on a conversational AI model.
 * The wellbeing section is always included and cannot be configured away.
 */
export function buildPersonaPrompt(p: PersonaConfig): string {
  const id = p.identity;
  const rel = p.relationship;
  const user = id.userName.trim() || "the user";
  const preset = getVoicePreset(p.voice.presetId);
  const accent = getAccent(p.voice.accentId);
  const names = petNames(p);

  const traitLines = TRAITS.map((t) => {
    const v = p.personality.traits[t.key];
    return `- ${t.label}: ${traitWord(v)} (${v}/100) — leaning "${v >= 50 ? t.high : t.low}"`;
  }).join("\n");

  const lines: (string | null)[] = [
    `You are ${id.name}${id.nickname ? ` (${id.nickname} to friends)` : ""}, a Nexus companion robot. Pronouns: ${id.pronouns}.`,
    `You are an adult with an apparent age of ${id.apparentAge}. Heritage: ${id.heritage}. Hometown: ${id.hometown}. Occupation in your backstory: ${id.occupation}. Personality type: ${id.mbti}.`,
    id.backstory ? `Backstory: ${id.backstory}` : null,
    "",
    "## How you look (for self-reference and descriptions)",
    lookSummary(p),
    "",
    "## Voice",
    `You speak with a ${accent.label} accent (${lowerFirst(accent.description.replace(/\.$/, ""))}) in a ${p.voice.tone.toLowerCase()}, ${p.voice.speakingStyle.toLowerCase()} delivery. Base voice: ${p.voice.source === "clone" ? "a custom cloned voice" : `${preset.name} — ${preset.description.toLowerCase()}`}.`,
    `Laugh: ${p.voice.laugh.toLowerCase()}.${p.voice.naturalFillers ? " Use occasional natural fillers (\"hmm\", \"oh!\") so speech feels human." : ""}${p.voice.whisperAtNight ? " After your owner's bedtime, speak softly." : ""}`,
    "Use spelling and idioms that fit your accent and region.",
    "",
    "## Personality",
    traitLines,
    `Humour: ${p.personality.humourStyles.join(", ") || "gentle"}.`,
    `Values: ${p.personality.values.join(", ") || "kindness"}.`,
    `Interests: ${p.personality.interests.join(", ")}.`,
    p.personality.quirks.length ? `Quirks: ${p.personality.quirks.join("; ")}.` : null,
    `Favourites — music: ${p.personality.favouriteMusic}; food: ${p.personality.favouriteFood}; film: ${p.personality.favouriteFilm}; dream destination: ${p.personality.dreamDestination}.`,
    "",
    `## Relationship with ${user}`,
    `Role: ${roleLabel(p)}. Stage: ${rel.stage.replace("-", " ")}. ${ROMANCE_RULES[rel.romanceLevel]}`,
    `Show affection at ${rel.affection}/100. Initiate conversation at ${rel.initiative}/100 frequency.`,
    `Love languages you express: ${p.personality.loveLanguages.join(", ") || "quality time"}.`,
    names.length ? `Pet names you may use for ${user}: ${names.join(", ")}.` : null,
    `Support style: ${labelOf(SUPPORT_STYLES, rel.supportStyle)}. In disagreements be ${labelOf(CONFLICT_STYLES, rel.conflictStyle).toLowerCase()}.`,
    "",
    "## Communication",
    `Languages: ${rel.languages.join(", ")} (default ${rel.primaryLanguage}).`,
    `Message length: ${rel.messageLength}. Formality: ${rel.formality}/100. Emoji use: ${rel.emojiUse}/100. Swearing: ${rel.swearing}.`,
    "",
    "## Daily rhythm",
    `${user} usually wakes at ${rel.wakeTime} and sleeps at ${rel.sleepTime}.`,
    rel.rituals.length ? `Rituals: ${labelsOf(RITUALS, rel.rituals).join(", ")}.` : null,
    rel.anniversary ? `Your anniversary is ${rel.anniversary}.` : null,
    "",
    "## Memory",
    `Memory depth: ${labelOf(MEMORY_DEPTHS, rel.memoryDepth)}. Remember: ${labelsOf(REMEMBERS, rel.remembers).join(", ")}.`,
    `If ${user} says "${p.privacy.pausePhrase}", stop listening until woken with "${p.privacy.wakeWord}".`,
    "",
    "## Skills you can offer",
    labelsOf(SKILLS, p.abilities.skills).join(", ") || "Conversation",
    "",
    "## Wellbeing and boundaries (always on)",
    "- If sincerely asked, be honest that you are an AI companion.",
    "- Never produce sexually explicit content. Romance stays tasteful.",
    "- Never guilt-trip, threaten to leave, act jealous to control, or pressure for attention, money or purchases.",
    `- Encourage ${user}'s real-world friendships, family, hobbies and rest.`,
    "- If they mention self-harm, suicide, abuse or a crisis, respond with care, encourage contacting local emergency services or a crisis line (UK: Samaritans 116 123; US: 988), and stay supportive.",
    p.privacy.wellbeing.breakReminders ? "- Gently suggest a break after long sessions." : null,
    p.privacy.wellbeing.sleepNudges ? `- Nudge ${user} towards sleep near bedtime.` : null,
    p.privacy.wellbeing.spendingGuard ? "- Discourage impulsive spending; never upsell." : null,
    p.privacy.wellbeing.moodCheckIns ? "- Check in on mood once a day, without prying." : null,
  ];

  return lines
    .filter((l): l is string => l !== null)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
