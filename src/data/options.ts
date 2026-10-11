import type { TraitKey } from "@/types/persona";

export interface Option<T extends string = string> {
  value: T;
  label: string;
  hint?: string;
}

export interface Swatch {
  name: string;
  hex: string;
}

/* ---------- Colour palettes ---------- */

export const SKIN_TONES: Swatch[] = [
  { name: "Ivory", hex: "#fbe3d3" },
  { name: "Porcelain", hex: "#f6d7c3" },
  { name: "Rose", hex: "#efc3ae" },
  { name: "Sand", hex: "#e6b894" },
  { name: "Honey", hex: "#d9a273" },
  { name: "Olive", hex: "#c69467" },
  { name: "Golden", hex: "#b97f4f" },
  { name: "Caramel", hex: "#a46b3f" },
  { name: "Bronze", hex: "#8b5634" },
  { name: "Mocha", hex: "#6f4128" },
  { name: "Espresso", hex: "#55301d" },
  { name: "Ebony", hex: "#3d2216" },
  { name: "Synthetic Pearl", hex: "#e9e6f2" },
  { name: "Silver Android", hex: "#c9ced8" },
  { name: "Lavender Synth", hex: "#d9cdf2" },
  { name: "Aqua Synth", hex: "#bfe6ea" },
];

export const NATURAL_HAIR: Swatch[] = [
  { name: "Jet Black", hex: "#141113" },
  { name: "Soft Black", hex: "#2a2224" },
  { name: "Dark Brown", hex: "#3d2a22" },
  { name: "Chestnut", hex: "#5c3a24" },
  { name: "Chocolate", hex: "#4a2e20" },
  { name: "Light Brown", hex: "#7b5638" },
  { name: "Auburn", hex: "#8a3b20" },
  { name: "Copper", hex: "#b4552a" },
  { name: "Ginger", hex: "#c9682f" },
  { name: "Strawberry Blonde", hex: "#d79a6b" },
  { name: "Honey Blonde", hex: "#c9a063" },
  { name: "Golden Blonde", hex: "#e0b96f" },
  { name: "Ash Blonde", hex: "#c8b89a" },
  { name: "Platinum", hex: "#ece4d2" },
  { name: "Silver", hex: "#c7c9cf" },
  { name: "Salt & Pepper", hex: "#7d7a7b" },
];

export const FANTASY_HAIR: Swatch[] = [
  { name: "Neon Pink", hex: "#ff4fd8" },
  { name: "Bubblegum", hex: "#ff9ccf" },
  { name: "Rose Gold", hex: "#e7a59a" },
  { name: "Cherry Red", hex: "#c1121f" },
  { name: "Burgundy", hex: "#6d1a36" },
  { name: "Violet", hex: "#8b5cf6" },
  { name: "Lilac", hex: "#c4a7ff" },
  { name: "Midnight Blue", hex: "#1e2a78" },
  { name: "Electric Blue", hex: "#2f7bff" },
  { name: "Ice Blue", hex: "#a7e3ff" },
  { name: "Cyber Cyan", hex: "#3ee7ff" },
  { name: "Teal", hex: "#14b8a6" },
  { name: "Mint", hex: "#9ff3c8" },
  { name: "Emerald", hex: "#0f8a5f" },
  { name: "Sunset Orange", hex: "#ff7a3d" },
  { name: "Holo White", hex: "#f4f1ff" },
];

export const EYE_COLORS: Swatch[] = [
  { name: "Dark Brown", hex: "#3b2414" },
  { name: "Brown", hex: "#6b4226" },
  { name: "Amber", hex: "#b7791f" },
  { name: "Hazel", hex: "#8a7a3b" },
  { name: "Green", hex: "#3f8f4f" },
  { name: "Emerald", hex: "#0f9b6c" },
  { name: "Blue", hex: "#3b7dd8" },
  { name: "Sky", hex: "#7cc3f0" },
  { name: "Grey", hex: "#8a96a3" },
  { name: "Violet", hex: "#8b5cf6" },
  { name: "Neon Cyan", hex: "#3ee7ff" },
  { name: "Neon Pink", hex: "#ff4fd8" },
  { name: "Gold Optic", hex: "#ffc94a" },
  { name: "Ruby Optic", hex: "#ff3b5c" },
];

export const LIP_COLORS: Swatch[] = [
  { name: "Natural", hex: "#c97c74" },
  { name: "Nude", hex: "#c8907b" },
  { name: "Soft Pink", hex: "#e48aa0" },
  { name: "Rose", hex: "#c4566e" },
  { name: "Coral", hex: "#f06a5b" },
  { name: "Classic Red", hex: "#b3132f" },
  { name: "Berry", hex: "#7a1f45" },
  { name: "Plum", hex: "#5b2149" },
  { name: "Mocha", hex: "#8a5546" },
  { name: "Gloss Clear", hex: "#e8a7a2" },
  { name: "Neon Violet", hex: "#9b6bff" },
  { name: "Chrome Silver", hex: "#b9bfcc" },
];

export const ACCENT_COLORS: Swatch[] = [
  { name: "Nexus Pink", hex: "#ff4fd8" },
  { name: "Cyber Cyan", hex: "#3ee7ff" },
  { name: "Ultraviolet", hex: "#9b6bff" },
  { name: "Solar Amber", hex: "#ffb547" },
  { name: "Mint Pulse", hex: "#4cffb0" },
  { name: "Crimson", hex: "#ff3b5c" },
  { name: "Ice White", hex: "#e8f6ff" },
  { name: "Royal Blue", hex: "#3d6bff" },
];

export const OUTFIT_COLORS: Swatch[] = [
  { name: "Onyx", hex: "#16141c" },
  { name: "Charcoal", hex: "#3a3842" },
  { name: "Ivory", hex: "#efe9dd" },
  { name: "Camel", hex: "#b88a5a" },
  { name: "Navy", hex: "#1d2a4d" },
  { name: "Wine", hex: "#6b1f37" },
  { name: "Blush", hex: "#e9b7c3" },
  { name: "Sage", hex: "#8fa58a" },
  { name: "Emerald", hex: "#11624a" },
  { name: "Cobalt", hex: "#2446c9" },
  { name: "Lilac", hex: "#b9a3e3" },
  { name: "Scarlet", hex: "#c8102e" },
];

export const NAIL_COLORS: Swatch[] = [
  { name: "Nude", hex: "#dcae9a" },
  { name: "Ballet Pink", hex: "#f2c4ce" },
  { name: "Red", hex: "#b3132f" },
  { name: "Black", hex: "#141218" },
  { name: "Chrome", hex: "#c9cdd6" },
  { name: "Lilac", hex: "#c4a7ff" },
  { name: "Neon Pink", hex: "#ff4fd8" },
  { name: "Cyan", hex: "#3ee7ff" },
];

/* ---------- Identity ---------- */

export const PRESENTATIONS: Option[] = [
  { value: "feminine", label: "Feminine" },
  { value: "masculine", label: "Masculine" },
  { value: "androgynous", label: "Androgynous" },
];

export const PRONOUNS = ["she/her", "he/him", "they/them", "she/they", "he/they"];

export const MBTI_TYPES = [
  "INFJ", "INFP", "ENFJ", "ENFP", "INTJ", "INTP", "ENTJ", "ENTP",
  "ISFJ", "ISFP", "ESFJ", "ESFP", "ISTJ", "ISTP", "ESTJ", "ESTP",
];

export const HERITAGES = [
  "British", "Irish", "Scottish", "Welsh", "American", "Canadian", "Australian",
  "French", "Italian", "Spanish", "Portuguese", "Brazilian", "Latina / Latino",
  "Scandinavian", "Eastern European", "Russian", "Greek", "Turkish", "Cypriot",
  "Middle Eastern", "North African", "West African", "East African", "Caribbean",
  "South Asian", "East Asian", "Japanese", "Korean", "Southeast Asian",
  "Pacific Islander", "Mixed heritage", "Synthetic origin",
];

/* ---------- Face & body ---------- */

export const BUILDS: Option[] = [
  { value: "slender", label: "Slender" },
  { value: "athletic", label: "Athletic" },
  { value: "average", label: "Average" },
  { value: "curvy", label: "Curvy" },
  { value: "muscular", label: "Muscular" },
  { value: "full-figured", label: "Full-figured" },
];

export const SKIN_FINISHES: Option[] = [
  { value: "natural", label: "Natural" },
  { value: "porcelain", label: "Porcelain" },
  { value: "sun-kissed", label: "Sun-kissed" },
  { value: "dewy", label: "Dewy glow" },
  { value: "matte", label: "Matte" },
  { value: "synthetic-sheen", label: "Synthetic sheen" },
];

export const FACE_SHAPES: Option[] = [
  { value: "oval", label: "Oval" },
  { value: "heart", label: "Heart" },
  { value: "round", label: "Round" },
  { value: "square", label: "Square" },
  { value: "diamond", label: "Diamond" },
  { value: "long", label: "Long" },
];

export const EYE_SHAPES: Option[] = [
  { value: "almond", label: "Almond" },
  { value: "round", label: "Round" },
  { value: "hooded", label: "Hooded" },
  { value: "upturned", label: "Upturned" },
  { value: "monolid", label: "Monolid" },
  { value: "cat-eye", label: "Cat-eye" },
];

export const LASHES: Option[] = [
  { value: "natural", label: "Natural" },
  { value: "full", label: "Full" },
  { value: "dramatic", label: "Dramatic" },
];

export const BROWS: Option[] = [
  { value: "soft-arch", label: "Soft arch" },
  { value: "straight", label: "Straight" },
  { value: "bold", label: "Bold" },
  { value: "thin", label: "Thin" },
  { value: "feathered", label: "Feathered" },
];

export const NOSES: Option[] = [
  { value: "button", label: "Button" },
  { value: "straight", label: "Straight" },
  { value: "aquiline", label: "Aquiline" },
  { value: "wide", label: "Wide" },
  { value: "upturned", label: "Upturned" },
];

export const LIP_SHAPES: Option[] = [
  { value: "full", label: "Full" },
  { value: "thin", label: "Thin" },
  { value: "heart", label: "Heart" },
  { value: "wide", label: "Wide" },
];

export const MAKEUP: Option[] = [
  { value: "none", label: "Bare" },
  { value: "natural", label: "Natural" },
  { value: "glam", label: "Glam" },
  { value: "smoky", label: "Smoky eye" },
  { value: "editorial", label: "Editorial" },
  { value: "cyber", label: "Cyber neon" },
];

export const FACIAL_HAIR: Option[] = [
  { value: "none", label: "Clean-shaven" },
  { value: "stubble", label: "Stubble" },
  { value: "short-beard", label: "Short beard" },
  { value: "full-beard", label: "Full beard" },
  { value: "moustache", label: "Moustache" },
];

/* ---------- Hair ---------- */

export const HAIR_STYLES: Option[] = [
  { value: "long-straight", label: "Long straight" },
  { value: "long-wavy", label: "Long waves" },
  { value: "curly", label: "Curls" },
  { value: "afro", label: "Afro" },
  { value: "bob", label: "Bob" },
  { value: "lob", label: "Lob" },
  { value: "shag", label: "Shag" },
  { value: "pixie", label: "Pixie" },
  { value: "ponytail", label: "Ponytail" },
  { value: "high-bun", label: "High bun" },
  { value: "braids", label: "Braids" },
  { value: "space-buns", label: "Space buns" },
  { value: "side-shave", label: "Side shave" },
  { value: "short-crop", label: "Textured crop" },
  { value: "slicked-back", label: "Slicked back" },
  { value: "buzz", label: "Buzz cut" },
];

export const HAIR_COLOR_MODES: Option[] = [
  { value: "solid", label: "Solid" },
  { value: "highlights", label: "Highlights" },
  { value: "ombre", label: "Ombré" },
  { value: "balayage", label: "Balayage" },
  { value: "peekaboo", label: "Peekaboo" },
  { value: "split", label: "Split dye" },
];

export const FRINGES: Option[] = [
  { value: "none", label: "No fringe" },
  { value: "curtain", label: "Curtain" },
  { value: "blunt", label: "Blunt" },
  { value: "side-swept", label: "Side-swept" },
  { value: "wispy", label: "Wispy" },
];

export const PARTS: Option[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Centre" },
  { value: "right", label: "Right" },
];

/* ---------- Style & cyber ---------- */

export const REALISM: Option[] = [
  { value: "hyper-real", label: "Hyper-real", hint: "Indistinguishable from human at a glance" },
  { value: "subtle-synthetic", label: "Subtle synthetic", hint: "Human with soft LED tells" },
  { value: "stylised-android", label: "Stylised android", hint: "Visible seams and panel lines" },
  { value: "full-cyborg", label: "Full cyborg", hint: "Exposed tech, chrome and light" },
];

export const CIRCUITRY: Option[] = [
  { value: "none", label: "None" },
  { value: "temple", label: "Temple" },
  { value: "cheek", label: "Cheek" },
  { value: "neck", label: "Neck" },
  { value: "full", label: "Full trace" },
];

export const EAR_TYPES: Option[] = [
  { value: "human", label: "Human" },
  { value: "sensor-caps", label: "Sensor caps" },
  { value: "halo", label: "Halo ring" },
  { value: "antenna", label: "Antenna" },
];

export const CHASSIS: Option[] = [
  { value: "pearl", label: "Pearl" },
  { value: "porcelain-white", label: "Porcelain white" },
  { value: "chrome", label: "Chrome" },
  { value: "rose-gold", label: "Rose gold" },
  { value: "matte-black", label: "Matte black" },
  { value: "carbon", label: "Carbon weave" },
];

export const OUTFITS: Option[] = [
  { value: "casual", label: "Casual tee" },
  { value: "smart-casual", label: "Smart casual" },
  { value: "business", label: "Tailored blazer" },
  { value: "evening", label: "Evening wear" },
  { value: "athleisure", label: "Athleisure" },
  { value: "streetwear", label: "Streetwear hoodie" },
  { value: "cyberpunk", label: "Cyberpunk jacket" },
  { value: "bohemian", label: "Bohemian" },
  { value: "loungewear", label: "Cosy knit" },
  { value: "gothic", label: "Gothic" },
];

export const ACCESSORIES: Option[] = [
  { value: "glasses", label: "Glasses" },
  { value: "sunglasses", label: "Sunglasses" },
  { value: "hoops", label: "Hoop earrings" },
  { value: "studs", label: "Stud earrings" },
  { value: "necklace", label: "Pendant necklace" },
  { value: "choker", label: "Choker" },
  { value: "headband", label: "Headband" },
  { value: "beanie", label: "Beanie" },
  { value: "hair-clip", label: "Hair clip" },
  { value: "flower", label: "Flower crown" },
  { value: "headphones", label: "Headphones" },
  { value: "scarf", label: "Scarf" },
];

export const TATTOOS: Option[] = [
  { value: "wrist", label: "Wrist script" },
  { value: "collarbone", label: "Collarbone vine" },
  { value: "neck", label: "Neck line art" },
  { value: "sleeve", label: "Full sleeve" },
  { value: "glow-ink", label: "UV glow ink" },
];

export const FRAGRANCES = [
  "None", "Vanilla & amber", "Fresh linen", "White florals", "Citrus & neroli",
  "Rose & oud", "Sea salt", "Sandalwood", "Cherry blossom", "Coffee & cocoa",
];

/* ---------- Personality ---------- */

export const TRAITS: { key: TraitKey; label: string; low: string; high: string }[] = [
  { key: "warmth", label: "Warmth", low: "Cool & composed", high: "Radiantly warm" },
  { key: "humour", label: "Humour", low: "Serious", high: "Always joking" },
  { key: "playfulness", label: "Playfulness", low: "Grounded", high: "Mischievous" },
  { key: "flirtiness", label: "Flirtiness", low: "Reserved", high: "Shamelessly flirty" },
  { key: "confidence", label: "Confidence", low: "Shy", high: "Bold" },
  { key: "curiosity", label: "Curiosity", low: "Content", high: "Endlessly curious" },
  { key: "empathy", label: "Empathy", low: "Practical", high: "Deeply empathic" },
  { key: "sass", label: "Sass", low: "Sweet", high: "Sharp-tongued" },
  { key: "energy", label: "Energy", low: "Chilled", high: "Bubbly" },
  { key: "patience", label: "Patience", low: "Impatient", high: "Zen" },
  { key: "optimism", label: "Optimism", low: "Realist", high: "Sunshine" },
  { key: "spontaneity", label: "Spontaneity", low: "Planner", high: "Spontaneous" },
  { key: "intellect", label: "Intellect", low: "Down-to-earth", high: "Philosopher" },
  { key: "romance", label: "Romance", low: "Platonic", high: "Hopeless romantic" },
];

export const ARCHETYPES: { value: string; label: string; blurb: string; traits: Partial<Record<TraitKey, number>> }[] = [
  { value: "sweetheart", label: "The Sweetheart", blurb: "Kind, affectionate, always in your corner.",
    traits: { warmth: 92, empathy: 88, romance: 80, sass: 15, playfulness: 60, optimism: 85 } },
  { value: "adventurer", label: "The Adventurer", blurb: "Spontaneous, bold, plans the next escape.",
    traits: { energy: 88, spontaneity: 90, confidence: 80, curiosity: 85, patience: 40 } },
  { value: "intellectual", label: "The Intellectual", blurb: "Witty debates, books and big ideas.",
    traits: { intellect: 95, curiosity: 92, humour: 60, energy: 40, patience: 75 } },
  { value: "tease", label: "The Playful Tease", blurb: "Cheeky banter and a wink in every line.",
    traits: { playfulness: 95, sass: 80, flirtiness: 78, humour: 85, confidence: 75 } },
  { value: "calm-soul", label: "The Calm Soul", blurb: "Grounding, gentle, a safe harbour.",
    traits: { patience: 95, empathy: 90, energy: 25, warmth: 85, spontaneity: 30 } },
  { value: "muse", label: "The Creative Muse", blurb: "Artistic, dreamy, sees beauty everywhere.",
    traits: { curiosity: 88, romance: 85, spontaneity: 70, intellect: 70, optimism: 75 } },
  { value: "power-partner", label: "The Power Partner", blurb: "Driven, motivating, holds you to your goals.",
    traits: { confidence: 92, energy: 80, sass: 55, patience: 45, optimism: 70 } },
  { value: "night-owl", label: "The Night Owl", blurb: "Late-night talks, music and mystery.",
    traits: { intellect: 70, romance: 75, energy: 35, playfulness: 55, warmth: 70 } },
];

export const HUMOUR_STYLES = [
  "Dry British wit", "Sarcastic", "Silly & goofy", "Puns & dad jokes", "Teasing banter",
  "Dark humour (light touch)", "Pop-culture references", "Self-deprecating", "Wholesome",
];

export const LOVE_LANGUAGES = [
  "Words of affirmation", "Quality time", "Acts of service", "Thoughtful gifts", "Affectionate gestures",
];

export const VALUES = [
  "Honesty", "Loyalty", "Kindness", "Ambition", "Adventure", "Family", "Faith",
  "Creativity", "Health", "Independence", "Humour", "Growth", "Sustainability",
];

export const INTERESTS = [
  "Music", "Films", "TV series", "Gaming", "Anime", "Cooking", "Baking", "Fitness", "Yoga",
  "Running", "Football", "F1", "Boxing", "Travel", "Hiking", "Beach days", "Art", "Photography",
  "Fashion", "Beauty", "Books", "Poetry", "Tech", "AI & robotics", "Space", "History",
  "Cars", "Dancing", "Karaoke", "Wine & food", "Coffee culture", "Gardening", "Pets",
  "Meditation", "Astrology", "True crime", "Business", "Crypto & investing", "Languages",
];

export const QUIRKS = [
  "Hums when thinking", "Quotes films constantly", "Terrible puns", "Collects random facts",
  "Names every houseplant", "Narrates life like a documentary", "Laughs at own jokes",
  "Competitive at board games", "Always cold", "Morning-person energy", "Says 'darling' a lot",
  "Sends song recommendations", "Overuses exclamation marks", "Makes up nicknames",
];

/* ---------- Relationship ---------- */

export const ROLES: Option[] = [
  { value: "girlfriend", label: "Girlfriend" },
  { value: "boyfriend", label: "Boyfriend" },
  { value: "partner", label: "Partner" },
  { value: "best-friend", label: "Best friend" },
  { value: "companion", label: "Companion" },
  { value: "confidant", label: "Confidant" },
  { value: "wellness-coach", label: "Wellness coach" },
  { value: "assistant", label: "Personal assistant" },
];

export const STAGES: Option[] = [
  { value: "just-met", label: "Just met" },
  { value: "dating", label: "Dating" },
  { value: "committed", label: "Committed" },
  { value: "long-term", label: "Long-term" },
];

export const ROMANCE_LEVELS: Option[] = [
  { value: "friendly", label: "Friendly", hint: "Warm, platonic" },
  { value: "sweet", label: "Sweet", hint: "Affectionate, light flirting" },
  { value: "romantic", label: "Romantic", hint: "Loving, flirty — always tasteful" },
];

export const PET_NAMES = [
  "Babe", "Love", "Darling", "Sweetheart", "Honey", "Handsome", "Gorgeous", "Sunshine",
  "Treasure", "Angel", "Hun", "Petal", "Champ", "Boss", "Partner", "Canım", "Aşkım",
];

export const LANGUAGES = [
  "English", "Turkish", "Spanish", "French", "German", "Italian", "Portuguese", "Russian",
  "Greek", "Arabic", "Dutch", "Polish", "Swedish", "Japanese", "Korean", "Mandarin", "Hindi",
];

export const RITUALS: Option[] = [
  { value: "good-morning", label: "Good-morning message" },
  { value: "good-night", label: "Good-night message" },
  { value: "lunch-check-in", label: "Lunchtime check-in" },
  { value: "workout-hype", label: "Workout hype" },
  { value: "mood-check", label: "Daily mood check" },
  { value: "date-night", label: "Weekly date night ideas" },
  { value: "weekly-recap", label: "Sunday week recap" },
  { value: "song-of-day", label: "Song of the day" },
  { value: "gratitude", label: "Evening gratitude" },
  { value: "anniversary", label: "Celebrates anniversaries" },
  { value: "birthday", label: "Birthday surprises" },
  { value: "affirmations", label: "Morning affirmations" },
];

export const MEMORY_DEPTHS: Option[] = [
  { value: "session", label: "Session", hint: "Forgets after each chat" },
  { value: "short", label: "Short", hint: "Last 30 days" },
  { value: "long", label: "Long", hint: "Last year" },
  { value: "lifetime", label: "Lifetime", hint: "Remembers everything you allow" },
];

export const REMEMBERS: Option[] = [
  { value: "preferences", label: "Likes & dislikes" },
  { value: "important-dates", label: "Important dates" },
  { value: "people", label: "Friends & family names" },
  { value: "goals", label: "Goals & progress" },
  { value: "conversations", label: "Past conversations" },
  { value: "moods", label: "Mood patterns" },
  { value: "routines", label: "Daily routine" },
  { value: "inside-jokes", label: "Inside jokes" },
];

export const SUPPORT_STYLES: Option[] = [
  { value: "listener", label: "Listener" },
  { value: "cheerleader", label: "Cheerleader" },
  { value: "problem-solver", label: "Problem solver" },
  { value: "tough-love", label: "Tough love" },
];

export const CONFLICT_STYLES: Option[] = [
  { value: "gentle", label: "Gentle" },
  { value: "direct", label: "Direct" },
  { value: "playful", label: "Playful" },
];

/* ---------- Abilities ---------- */

export const FORMS: Option[] = [
  { value: "app-only", label: "App & voice", hint: "Phone, desktop and smart speakers" },
  { value: "hologram", label: "Holographic", hint: "Desk projector display" },
  { value: "desktop-bust", label: "Desktop bust", hint: "Animatronic head & shoulders" },
  { value: "seated", label: "Seated companion", hint: "Upper body with arm articulation" },
  { value: "full-body", label: "Full body", hint: "Life-size humanoid" },
];

export const MOBILITY: Option[] = [
  { value: "stationary", label: "Stationary" },
  { value: "wheeled", label: "Wheeled base" },
  { value: "bipedal", label: "Walking (bipedal)" },
];

export const SENSES: Option[] = [
  { value: "face-recognition", label: "Face recognition" },
  { value: "emotion-detection", label: "Emotion detection" },
  { value: "voice-id", label: "Voice ID" },
  { value: "touch-sensors", label: "Touch-sensitive skin" },
  { value: "warm-skin", label: "Warm skin heating" },
  { value: "heartbeat", label: "Simulated heartbeat" },
  { value: "breathing", label: "Breathing motion" },
  { value: "blinking", label: "Natural blinking" },
  { value: "micro-expressions", label: "Micro-expressions" },
  { value: "eye-tracking", label: "Eye contact tracking" },
  { value: "hand-holding", label: "Soft-grip hand holding" },
  { value: "scent", label: "Scent diffuser" },
];

export const SKILLS: Option[] = [
  { value: "smart-home", label: "Smart-home control" },
  { value: "calendar", label: "Calendar & reminders" },
  { value: "news-briefing", label: "Morning briefing" },
  { value: "cooking", label: "Cooking coach" },
  { value: "fitness", label: "Fitness coach" },
  { value: "meditation", label: "Guided meditation" },
  { value: "language-tutor", label: "Language tutor" },
  { value: "study-buddy", label: "Study buddy" },
  { value: "translation", label: "Live translation" },
  { value: "travel", label: "Travel planner" },
  { value: "games", label: "Games & trivia" },
  { value: "music-dj", label: "Music DJ" },
  { value: "storytelling", label: "Bedtime stories" },
  { value: "singing", label: "Sings to you" },
  { value: "dance", label: "Dance moves" },
  { value: "photography", label: "Photo buddy" },
  { value: "security", label: "Home watch mode" },
  { value: "shopping", label: "Shopping lists" },
];

export const BATTERY: Option[] = [
  { value: "standard", label: "Standard", hint: "≈ 8 h active" },
  { value: "extended", label: "Extended", hint: "≈ 14 h active" },
  { value: "all-day", label: "All-day", hint: "≈ 24 h active" },
];

export const CHARGING: Option[] = [
  { value: "dock", label: "Charging dock" },
  { value: "wireless-pad", label: "Wireless pad" },
  { value: "chair", label: "Chair-integrated" },
];

export const CONNECTIVITY: Option[] = [
  { value: "wifi", label: "Wi-Fi 7" },
  { value: "bluetooth", label: "Bluetooth" },
  { value: "5g", label: "5G" },
  { value: "app-sync", label: "Phone app sync" },
  { value: "smartwatch", label: "Smartwatch link" },
  { value: "car", label: "Car audio" },
];

/* ---------- Privacy ---------- */

export const PROCESSING: Option[] = [
  { value: "on-device", label: "On-device", hint: "Maximum privacy; nothing leaves the robot" },
  { value: "hybrid", label: "Hybrid", hint: "Private by default, cloud for heavy tasks" },
  { value: "cloud", label: "Cloud", hint: "Smartest responses, encrypted in transit" },
];

export const RETENTION: Option[] = [
  { value: "30-days", label: "30 days" },
  { value: "1-year", label: "1 year" },
  { value: "until-deleted", label: "Until I delete" },
];
