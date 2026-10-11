// Accent and voice catalogue.
//
// `lang` is the BCP-47 tag used to pick a device voice for in-browser previews.
// `preferred` lists device voice names (macOS, Windows, Chrome, Android) that
// best match the accent. Regional accents that no browser ships a voice for are
// marked `approximate`: the preview falls back to the closest national voice
// and the production voice engine renders the exact accent.

export type AccentRegion =
  | "British & Irish"
  | "American"
  | "Commonwealth"
  | "International English";

export interface Accent {
  id: string;
  label: string;
  region: AccentRegion;
  lang: string;
  preferred: string[];
  approximate?: boolean;
  description: string;
}

const UK_FEMALE = ["Google UK English Female", "Microsoft Sonia", "Microsoft Libby", "Serena", "Kate", "Stephanie", "Martha"];
const UK_MALE = ["Google UK English Male", "Microsoft Ryan", "Daniel", "Arthur", "Oliver"];
const US_FEMALE = ["Samantha", "Google US English", "Microsoft Aria", "Microsoft Jenny", "Ava", "Allison", "Susan", "Zira"];
const US_MALE = ["Alex", "Microsoft Guy", "Microsoft Davis", "Tom", "Aaron", "David"];

export const ACCENTS: Accent[] = [
  // British & Irish
  { id: "british-rp", label: "British — Received Pronunciation", region: "British & Irish", lang: "en-GB",
    preferred: [...UK_FEMALE, ...UK_MALE], description: "Polished, classic 'Queen's English'." },
  { id: "london", label: "London", region: "British & Irish", lang: "en-GB", preferred: [...UK_FEMALE, ...UK_MALE],
    approximate: true, description: "Modern, multicultural city sound." },
  { id: "cockney", label: "Cockney (East London)", region: "British & Irish", lang: "en-GB", preferred: [...UK_FEMALE, ...UK_MALE],
    approximate: true, description: "Cheeky glottal stops and rhyming slang." },
  { id: "estuary", label: "Estuary (Essex / Kent)", region: "British & Irish", lang: "en-GB", preferred: [...UK_FEMALE, ...UK_MALE],
    approximate: true, description: "Relaxed South-East English." },
  { id: "mancunian", label: "Northern — Manchester", region: "British & Irish", lang: "en-GB", preferred: [...UK_FEMALE, ...UK_MALE],
    approximate: true, description: "Down-to-earth, friendly Northern vowels." },
  { id: "yorkshire", label: "Yorkshire", region: "British & Irish", lang: "en-GB", preferred: [...UK_FEMALE, ...UK_MALE],
    approximate: true, description: "Warm, broad and honest." },
  { id: "geordie", label: "Geordie (Newcastle)", region: "British & Irish", lang: "en-GB", preferred: [...UK_FEMALE, ...UK_MALE],
    approximate: true, description: "Sing-song and full of character." },
  { id: "scouse", label: "Scouse (Liverpool)", region: "British & Irish", lang: "en-GB", preferred: [...UK_FEMALE, ...UK_MALE],
    approximate: true, description: "Quick-witted and musical." },
  { id: "brummie", label: "Brummie (Birmingham)", region: "British & Irish", lang: "en-GB", preferred: [...UK_FEMALE, ...UK_MALE],
    approximate: true, description: "Laid-back Midlands lilt." },
  { id: "west-country", label: "West Country", region: "British & Irish", lang: "en-GB", preferred: [...UK_FEMALE, ...UK_MALE],
    approximate: true, description: "Soft, rolling rural charm." },
  { id: "scottish", label: "Scottish (Edinburgh)", region: "British & Irish", lang: "en-GB",
    preferred: ["Fiona", ...UK_FEMALE, ...UK_MALE], description: "Crisp, gentle Scottish burr." },
  { id: "glaswegian", label: "Glaswegian", region: "British & Irish", lang: "en-GB",
    preferred: ["Fiona", ...UK_FEMALE, ...UK_MALE], approximate: true, description: "Strong, spirited Glasgow sound." },
  { id: "welsh", label: "Welsh", region: "British & Irish", lang: "en-GB", preferred: [...UK_FEMALE, ...UK_MALE],
    approximate: true, description: "Melodic, rising Welsh intonation." },
  { id: "irish", label: "Irish (Dublin)", region: "British & Irish", lang: "en-IE",
    preferred: ["Moira", "Microsoft Emily", "Microsoft Connor"], description: "Soft, lyrical Irish charm." },
  { id: "northern-irish", label: "Northern Irish (Belfast)", region: "British & Irish", lang: "en-IE",
    preferred: ["Moira", "Microsoft Emily"], approximate: true, description: "Distinctive Ulster rhythm." },

  // American
  { id: "general-american", label: "American — General", region: "American", lang: "en-US",
    preferred: [...US_FEMALE, ...US_MALE], description: "Clear, neutral US broadcast English." },
  { id: "californian", label: "Californian", region: "American", lang: "en-US", preferred: [...US_FEMALE, ...US_MALE],
    approximate: true, description: "Sunny, laid-back West Coast." },
  { id: "new-york", label: "New York", region: "American", lang: "en-US", preferred: [...US_FEMALE, ...US_MALE],
    approximate: true, description: "Fast, confident, big-city attitude." },
  { id: "southern", label: "Southern Belle (Georgia)", region: "American", lang: "en-US", preferred: [...US_FEMALE, ...US_MALE],
    approximate: true, description: "Slow, sweet Southern drawl." },
  { id: "texan", label: "Texan", region: "American", lang: "en-US", preferred: [...US_FEMALE, ...US_MALE],
    approximate: true, description: "Warm, wide-open twang." },
  { id: "boston", label: "Boston", region: "American", lang: "en-US", preferred: [...US_FEMALE, ...US_MALE],
    approximate: true, description: "Dropped R's and New England grit." },
  { id: "midwestern", label: "Midwestern", region: "American", lang: "en-US", preferred: [...US_FEMALE, ...US_MALE],
    approximate: true, description: "Friendly, flat-vowelled heartland." },
  { id: "transatlantic", label: "Transatlantic (old Hollywood)", region: "American", lang: "en-US",
    preferred: [...US_FEMALE, ...UK_FEMALE], approximate: true, description: "Glamorous 1940s silver-screen polish." },

  // Commonwealth
  { id: "australian", label: "Australian", region: "Commonwealth", lang: "en-AU",
    preferred: ["Karen", "Catherine", "Microsoft Natasha", "Microsoft William", "Lee"], description: "Easy-going and upbeat." },
  { id: "new-zealand", label: "New Zealand", region: "Commonwealth", lang: "en-NZ",
    preferred: ["Microsoft Molly", "Microsoft Mitchell"], description: "Clipped, friendly Kiwi vowels." },
  { id: "canadian", label: "Canadian", region: "Commonwealth", lang: "en-CA",
    preferred: ["Microsoft Clara", "Microsoft Liam"], description: "Polite and clear." },
  { id: "south-african", label: "South African", region: "Commonwealth", lang: "en-ZA",
    preferred: ["Tessa", "Microsoft Leah", "Microsoft Luke"], description: "Crisp and characterful." },
  { id: "indian", label: "Indian English", region: "Commonwealth", lang: "en-IN",
    preferred: ["Veena", "Rishi", "Microsoft Neerja", "Microsoft Prabhat", "Google हिन्दी"], description: "Bright, rhythmic and expressive." },
  { id: "jamaican", label: "Jamaican", region: "Commonwealth", lang: "en-GB", preferred: [...UK_FEMALE],
    approximate: true, description: "Musical Caribbean warmth." },

  // International English (native-language voice speaking English)
  { id: "french", label: "French", region: "International English", lang: "fr-FR",
    preferred: ["Amélie", "Audrey", "Google français", "Microsoft Denise", "Thomas"], description: "Romantic, softly accented English." },
  { id: "italian", label: "Italian", region: "International English", lang: "it-IT",
    preferred: ["Alice", "Google italiano", "Microsoft Elsa", "Luca"], description: "Expressive and passionate." },
  { id: "spanish", label: "Spanish (Castilian)", region: "International English", lang: "es-ES",
    preferred: ["Mónica", "Google español", "Microsoft Elvira", "Jorge"], description: "Lively and confident." },
  { id: "latina", label: "Latin American", region: "International English", lang: "es-MX",
    preferred: ["Paulina", "Google español de Estados Unidos", "Microsoft Dalia", "Juan"], description: "Warm, vibrant Latin flair." },
  { id: "brazilian", label: "Brazilian", region: "International English", lang: "pt-BR",
    preferred: ["Luciana", "Google português do Brasil", "Microsoft Francisca"], description: "Sunny, flowing Brazilian rhythm." },
  { id: "german", label: "German", region: "International English", lang: "de-DE",
    preferred: ["Anna", "Google Deutsch", "Microsoft Katja", "Markus"], description: "Precise and self-assured." },
  { id: "swedish", label: "Swedish", region: "International English", lang: "sv-SE",
    preferred: ["Alva", "Microsoft Sofie", "Klara"], description: "Light Scandinavian sing-song." },
  { id: "dutch", label: "Dutch", region: "International English", lang: "nl-NL",
    preferred: ["Ellen", "Claire", "Google Nederlands", "Microsoft Fenna"], description: "Direct and friendly." },
  { id: "russian", label: "Russian", region: "International English", lang: "ru-RU",
    preferred: ["Milena", "Google русский", "Microsoft Svetlana", "Yuri"], description: "Deep, mysterious and elegant." },
  { id: "polish", label: "Polish", region: "International English", lang: "pl-PL",
    preferred: ["Zosia", "Google polski", "Microsoft Zofia"], description: "Soft Slavic consonants." },
  { id: "greek", label: "Greek", region: "International English", lang: "el-GR",
    preferred: ["Melina", "Microsoft Athina"], description: "Sunny Mediterranean warmth." },
  { id: "turkish", label: "Turkish", region: "International English", lang: "tr-TR",
    preferred: ["Yelda", "Google Türkçe", "Microsoft Emel", "Microsoft Ahmet"], description: "Warm Anatolian lilt." },
  { id: "arabic", label: "Arabic", region: "International English", lang: "ar-SA",
    preferred: ["Maged", "Microsoft Zariyah", "Google العربية"], description: "Rich and resonant." },
  { id: "japanese", label: "Japanese", region: "International English", lang: "ja-JP",
    preferred: ["Kyoko", "Google 日本語", "Microsoft Nanami", "Otoya"], description: "Gentle and precise." },
  { id: "korean", label: "Korean", region: "International English", lang: "ko-KR",
    preferred: ["Yuna", "Google 한국의", "Microsoft SunHi"], description: "Soft and bright." },
];

export const ACCENT_REGIONS: AccentRegion[] = ["British & Irish", "American", "Commonwealth", "International English"];

export function getAccent(id: string): Accent {
  return ACCENTS.find((a) => a.id === id) ?? ACCENTS[0];
}

export interface VoicePreset {
  id: string;
  name: string;
  gender: "female" | "male" | "neutral";
  description: string;
  /** Base pitch and rate for the Web Speech preview (1 = device default). */
  basePitch: number;
  baseRate: number;
  tone: string;
}

export const VOICE_PRESETS: VoicePreset[] = [
  { id: "velvet", name: "Velvet", gender: "female", description: "Low, smooth and intimate", basePitch: 0.9, baseRate: 0.92, tone: "Velvet" },
  { id: "honey", name: "Honey", gender: "female", description: "Warm, sweet and reassuring", basePitch: 1.05, baseRate: 0.97, tone: "Warm" },
  { id: "silk", name: "Silk", gender: "female", description: "Soft and breathy, ASMR-calm", basePitch: 1.1, baseRate: 0.88, tone: "Breathy" },
  { id: "spark", name: "Spark", gender: "female", description: "Bright, bubbly and energetic", basePitch: 1.25, baseRate: 1.08, tone: "Bright" },
  { id: "ember", name: "Ember", gender: "female", description: "Husky with a smoky edge", basePitch: 0.82, baseRate: 0.95, tone: "Husky" },
  { id: "crystal", name: "Crystal", gender: "female", description: "Clear, crisp and articulate", basePitch: 1.12, baseRate: 1.0, tone: "Crisp" },
  { id: "sunny", name: "Sunny", gender: "female", description: "Cheerful and sing-song", basePitch: 1.2, baseRate: 1.04, tone: "Bright" },
  { id: "midnight", name: "Midnight", gender: "female", description: "Slow, mysterious and sultry-smooth", basePitch: 0.86, baseRate: 0.86, tone: "Smoky" },
  { id: "atlas", name: "Atlas", gender: "male", description: "Deep, calm and grounded", basePitch: 0.75, baseRate: 0.93, tone: "Deep" },
  { id: "orion", name: "Orion", gender: "male", description: "Warm baritone with a smile", basePitch: 0.88, baseRate: 0.98, tone: "Warm" },
  { id: "rio", name: "Rio", gender: "male", description: "Playful, upbeat tenor", basePitch: 1.0, baseRate: 1.06, tone: "Bright" },
  { id: "echo", name: "Echo", gender: "neutral", description: "Balanced, gender-neutral and calm", basePitch: 1.0, baseRate: 0.97, tone: "Neutral" },
];

export function getVoicePreset(id: string): VoicePreset {
  return VOICE_PRESETS.find((v) => v.id === id) ?? VOICE_PRESETS[0];
}

export const VOICE_TONES = ["Warm", "Velvet", "Breathy", "Bright", "Husky", "Crisp", "Smoky", "Deep", "Neutral"];
export const SPEAKING_STYLES = ["Calm", "Chatty", "Playful", "Thoughtful", "Confident", "Dreamy", "Witty"];
export const LAUGHS = ["Soft giggle", "Warm chuckle", "Hearty laugh", "Snort-laugh", "Breathy laugh", "No laugh"];

/** Scripts the user reads aloud when recording clone samples. They cover a broad
 *  phoneme range plus emotional delivery so the engine captures more than a monotone. */
export const RECORDING_SCRIPTS: { title: string; text: string }[] = [
  {
    title: "Phonetic warm-up",
    text:
      "The quick brown fox jumps over the lazy dog. She sells sea shells by the sea shore, " +
      "and the shells she sells are surely seashells. Peter Piper picked a peck of pickled peppers.",
  },
  {
    title: "Everyday chat",
    text:
      "Morning! I slept really well, thanks. I was thinking we could grab a coffee later, " +
      "maybe walk by the water if the weather holds up. What do you fancy doing this weekend?",
  },
  {
    title: "Warm & caring",
    text:
      "Hey, I'm really proud of you. I know today was hard, but you handled it brilliantly. " +
      "Come here, tell me everything. I've got all the time in the world for you.",
  },
  {
    title: "Excited & playful",
    text:
      "No way, that's amazing! Honestly, I knew you could do it. Right, we are celebrating tonight — " +
      "music, good food, and I'm choosing the film. Don't argue, you'll love it!",
  },
  {
    title: "Questions & numbers",
    text:
      "Did you remember the appointment at half past three on Thursday the twenty-first? " +
      "It's at 42 Harbour Road. Should I set a reminder for an hour before, or two?",
  },
];
