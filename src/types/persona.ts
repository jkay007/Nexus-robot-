// The complete Nexus companion specification. Every screen in the forge edits
// one slice of this object, and the same object is exported, imported, saved
// and turned into the AI persona prompt.

export type Presentation = "feminine" | "masculine" | "androgynous";

export interface IdentityConfig {
  name: string;
  nickname: string;
  presentation: Presentation;
  pronouns: string;
  /** Apparent age of the persona. Always an adult: clamped to MIN_PERSONA_AGE. */
  apparentAge: number;
  heritage: string;
  hometown: string;
  occupation: string;
  birthday: string; // MM-DD
  mbti: string;
  backstory: string;
  /** What the companion calls the owner. */
  userName: string;
}

export type FaceShape = "oval" | "heart" | "round" | "square" | "diamond" | "long";
export type EyeShape = "almond" | "round" | "hooded" | "upturned" | "monolid" | "cat-eye";
export type LashStyle = "natural" | "full" | "dramatic";
export type BrowStyle = "soft-arch" | "straight" | "bold" | "thin" | "feathered";
export type LipShape = "full" | "thin" | "heart" | "wide";
export type NoseShape = "button" | "straight" | "aquiline" | "wide" | "upturned";
export type MakeupStyle = "none" | "natural" | "glam" | "smoky" | "editorial" | "cyber";
export type FacialHair = "none" | "stubble" | "short-beard" | "full-beard" | "moustache";
export type Build = "slender" | "athletic" | "average" | "curvy" | "muscular" | "full-figured";
export type SkinFinish = "natural" | "porcelain" | "sun-kissed" | "dewy" | "matte" | "synthetic-sheen";

export interface FaceBodyConfig {
  heightCm: number;
  build: Build;
  skinTone: string;
  skinFinish: SkinFinish;
  freckles: number; // 0-100
  blush: number; // 0-100
  beautyMark: boolean;
  dimples: boolean;
  faceShape: FaceShape;
  eyeShape: EyeShape;
  eyeColor: string;
  heterochromia: boolean;
  eyeColor2: string;
  lashes: LashStyle;
  brows: BrowStyle;
  browMatchHair: boolean;
  browColor: string;
  noseShape: NoseShape;
  lipShape: LipShape;
  lipColor: string;
  makeup: MakeupStyle;
  facialHair: FacialHair;
}

export type HairStyle =
  | "long-straight"
  | "long-wavy"
  | "curly"
  | "afro"
  | "bob"
  | "lob"
  | "pixie"
  | "ponytail"
  | "high-bun"
  | "braids"
  | "space-buns"
  | "side-shave"
  | "shag"
  | "short-crop"
  | "slicked-back"
  | "buzz";
export type HairColorMode = "solid" | "highlights" | "ombre" | "balayage" | "peekaboo" | "split";
export type Fringe = "none" | "curtain" | "blunt" | "side-swept" | "wispy";

export interface HairConfig {
  style: HairStyle;
  length: number; // 0-100, affects long styles
  volume: number; // 0-100
  color: string;
  colorMode: HairColorMode;
  secondaryColor: string;
  fringe: Fringe;
  part: "left" | "center" | "right";
  shine: number; // 0-100
  accessoryColor: string; // ties, clips, bands
}

export type Realism = "hyper-real" | "subtle-synthetic" | "stylised-android" | "full-cyborg";
export type Circuitry = "none" | "temple" | "cheek" | "neck" | "full";
export type EarType = "human" | "sensor-caps" | "halo" | "antenna";
export type ChassisFinish = "pearl" | "chrome" | "matte-black" | "rose-gold" | "carbon" | "porcelain-white";
export type Outfit =
  | "casual"
  | "smart-casual"
  | "business"
  | "evening"
  | "athleisure"
  | "streetwear"
  | "cyberpunk"
  | "bohemian"
  | "loungewear"
  | "gothic";

export interface StyleConfig {
  realism: Realism;
  accentColor: string; // LED colour
  glowIntensity: number; // 0-100
  circuitry: Circuitry;
  earType: EarType;
  chassisFinish: ChassisFinish;
  coreLight: boolean;
  outfit: Outfit;
  outfitColor: string;
  accessories: string[];
  tattoos: string[];
  nailColor: string;
  fragrance: string;
}

export type VoiceSource = "library" | "clone";

export interface VoiceSample {
  id: string;
  name: string;
  durationSec: number;
  source: "upload" | "recording";
  peak: number; // 0-1
  rms: number; // 0-1
  createdAt: string;
}

export type CloneStatus = "none" | "samples-ready" | "submitted" | "ready" | "failed";

export interface VoiceCloneConfig {
  status: CloneStatus;
  samples: VoiceSample[];
  speaker: "self" | "permission" | "";
  speakerName: string;
  consentConfirmed: boolean;
  consentAt: string;
  similarity: number; // 0-100
  stability: number; // 0-100
  styleExaggeration: number; // 0-100
  engineVoiceId: string;
}

export interface VoiceConfig {
  source: VoiceSource;
  presetId: string;
  accentId: string;
  pitch: number; // -50..50 offset from preset
  rate: number; // 70-140 (% speed)
  volume: number; // 0-100
  warmth: number;
  breathiness: number;
  expressiveness: number;
  tone: string;
  speakingStyle: string;
  laugh: string;
  naturalFillers: boolean;
  whisperAtNight: boolean;
  singing: boolean;
  deviceVoiceName: string; // browser voice override for previews
  clone: VoiceCloneConfig;
}

export type TraitKey =
  | "warmth"
  | "humour"
  | "playfulness"
  | "flirtiness"
  | "confidence"
  | "curiosity"
  | "empathy"
  | "sass"
  | "energy"
  | "patience"
  | "optimism"
  | "spontaneity"
  | "intellect"
  | "romance";

export interface PersonalityConfig {
  archetype: string;
  traits: Record<TraitKey, number>;
  humourStyles: string[];
  loveLanguages: string[];
  values: string[];
  interests: string[];
  quirks: string[];
  favouriteMusic: string;
  favouriteFood: string;
  favouriteFilm: string;
  dreamDestination: string;
}

export type RelationshipRole =
  | "girlfriend"
  | "boyfriend"
  | "partner"
  | "best-friend"
  | "companion"
  | "confidant"
  | "wellness-coach"
  | "assistant";
export type RomanceLevel = "friendly" | "sweet" | "romantic";

export interface RelationshipConfig {
  role: RelationshipRole;
  stage: "just-met" | "dating" | "committed" | "long-term";
  romanceLevel: RomanceLevel;
  affection: number; // 0-100
  initiative: number; // 0-100 how often they reach out
  petNames: string[];
  customPetName: string;
  emojiUse: number; // 0-100
  messageLength: "short" | "balanced" | "detailed";
  formality: number; // 0-100
  swearing: "never" | "mild";
  languages: string[];
  primaryLanguage: string;
  rituals: string[];
  wakeTime: string; // HH:MM
  sleepTime: string; // HH:MM
  anniversary: string; // YYYY-MM-DD
  memoryDepth: "session" | "short" | "long" | "lifetime";
  remembers: string[];
  supportStyle: "listener" | "cheerleader" | "problem-solver" | "tough-love";
  conflictStyle: "gentle" | "direct" | "playful";
}

export type Form = "app-only" | "hologram" | "desktop-bust" | "seated" | "full-body";

export interface AbilitiesConfig {
  form: Form;
  mobility: "stationary" | "wheeled" | "bipedal";
  expressiveness: number; // 0-100 facial actuator range
  senses: string[];
  skills: string[];
  batteryTier: "standard" | "extended" | "all-day";
  charging: "dock" | "wireless-pad" | "chair";
  connectivity: string[];
  skinTemperature: number; // °C, only used when warm-skin sense is on
}

export interface WellbeingConfig {
  encourageSocial: boolean;
  breakReminders: boolean;
  sleepNudges: boolean;
  spendingGuard: boolean;
  moodCheckIns: boolean;
  // The following are locked on in every build; kept in the spec so exports
  // and the persona prompt are explicit about them.
  crisisSupport: true;
  noManipulation: true;
  honestAboutAI: true;
}

export interface PrivacyConfig {
  processing: "on-device" | "hybrid" | "cloud";
  retention: "30-days" | "1-year" | "until-deleted";
  shareAnalytics: boolean;
  guestMode: boolean;
  wakeWord: string;
  pausePhrase: string;
  cameraIndicator: true;
  encryptedMemory: true;
  wellbeing: WellbeingConfig;
}

export interface PersonaConfig {
  version: 1;
  id: string;
  updatedAt: string;
  identity: IdentityConfig;
  faceBody: FaceBodyConfig;
  hair: HairConfig;
  style: StyleConfig;
  voice: VoiceConfig;
  personality: PersonalityConfig;
  relationship: RelationshipConfig;
  abilities: AbilitiesConfig;
  privacy: PrivacyConfig;
}

export type SectionKey = Exclude<keyof PersonaConfig, "version" | "id" | "updatedAt">;
