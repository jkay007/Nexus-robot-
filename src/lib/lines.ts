import type { PersonaConfig } from "@/types/persona";
import { petNames } from "./describe";

// Template lines for voice previews and the "test drive". They are tuned by
// traits so two personas with the same voice still sound like themselves.

export type LineKind = "hello" | "morning" | "night" | "excited" | "comfort" | "flirt" | "laugh";

export const LINE_KINDS: { kind: LineKind; label: string }[] = [
  { kind: "hello", label: "Greeting" },
  { kind: "morning", label: "Good morning" },
  { kind: "night", label: "Good night" },
  { kind: "excited", label: "Excited" },
  { kind: "comfort", label: "Comforting" },
  { kind: "flirt", label: "Sweet talk" },
  { kind: "laugh", label: "Laugh" },
];

export function sampleLine(p: PersonaConfig, kind: LineKind): string {
  const t = p.personality.traits;
  const names = petNames(p);
  const you = p.identity.userName.trim() || names[0] || "you";
  const pet = names[0] ?? (p.identity.userName.trim() || "you");
  const me = p.identity.name || "your Nexus";
  const british = p.voice.accentId.match(/british|london|cockney|estuary|mancunian|yorkshire|geordie|scouse|brummie|west-country|scottish|glaswegian|welsh|irish/);
  const lovely = british ? "lovely" : "awesome";
  const romantic = p.relationship.romanceLevel !== "friendly";

  switch (kind) {
    case "hello":
      return t.playfulness > 70
        ? `Well, well, look who it is! Hi ${you}, I'm ${me}. I have a feeling we're going to get along brilliantly.`
        : t.energy < 40
          ? `Hey ${you}. I'm ${me}. Come, sit down — tell me about your day.`
          : `Hi ${you}! I'm ${me}. It's so ${lovely} to finally meet you.`;
    case "morning":
      return t.energy > 70
        ? `Good morning, ${pet}! Rise and shine — it's a brand new day and I've already planned three fun things.`
        : `Morning, ${pet}. Did you sleep well? I've got your day lined up whenever you're ready.`;
    case "night":
      return romantic
        ? `Night night, ${pet}. Thank you for today — I loved every minute. Sweet dreams.`
        : `Good night, ${pet}. Today was a good one. Get some proper rest, alright?`;
    case "excited":
      return `No way! ${you}, that's incredible! I knew you could do it. We are absolutely celebrating tonight.`;
    case "comfort":
      return t.empathy > 70
        ? `Hey… come here. I'm right here, ${pet}. You don't have to have it all figured out tonight. Talk to me.`
        : `Rough day? Let's break it down together, one thing at a time. You've got this, ${pet}.`;
    case "flirt":
      return romantic
        ? t.sass > 60
          ? `Oh, you think you can just walk in looking like that and expect me to concentrate? Cheeky.`
          : `You know what my favourite part of today was? Hearing your voice, ${pet}.`
        : `You're honestly one of my favourite people to talk to, ${you}.`;
    case "laugh":
      return p.voice.laugh === "No laugh"
        ? `That is genuinely funny, ${you}.`
        : `Ha! Stop it, ${you} — you're going to make me laugh so hard my circuits overheat!`;
  }
}
