# Nexus Persona Forge

Design every detail of a Nexus robot companion (girlfriend, boyfriend, partner, best friend or assistant) and watch it come to life in a live preview that speaks with the chosen accent.

Built with Vite, React, TypeScript and Tailwind, the same stack Lovable uses, so the repo can be connected to a Lovable project.

## What you can customise

| Step | Highlights |
| --- | --- |
| **Identity** | Name, nickname, presentation (feminine / masculine / androgynous), pronouns, apparent age (adults only, 18+), heritage, hometown, occupation, birthday and star sign, MBTI type, backstory, what they call you |
| **Face & body** | Height, six builds, 16 skin tones plus custom colours, six skin finishes, freckles, blush, beauty mark, dimples, six face shapes, five noses, four lip shapes, lip colour, facial hair |
| **Eyes & makeup** | Six eye shapes, 14 eye colours including glowing optics, heterochromia, lashes, five brow styles, brow colour, six makeup looks (bare to cyber neon) |
| **Hair** | 16 styles (long, waves, curls, afro, bob, lob, shag, pixie, ponytail, high bun, braids, space buns, side shave, crop, slicked back, buzz), each previewed on your companion; fringe, parting, length, volume, shine; 32 natural and fantasy colours plus custom; solid, highlights, ombré, balayage, peekaboo and split dye; colour for ties and clips |
| **Style & cyber** | Realism from hyper-real to full cyborg; LED accent colour and glow; circuit tracing; ear types (human, sensor caps, halo ring, antenna); chassis finish; chest core light; ten outfits with any colour; 12 accessories; tattoos including UV glow ink; nail colour; signature scent |
| **Voice & accent** | 12 studio voices; **44 accents**, including British RP, London, Cockney, Estuary, Manchester, Yorkshire, Geordie, Scouse, Brummie, West Country, Scottish, Glaswegian, Welsh, Irish, Northern Irish, General American, Californian, New York, Southern, Texan, Boston, Midwestern, Transatlantic, Australian, NZ, Canadian, South African, Indian, Jamaican, plus French-, Italian-, Spanish-, Latin-, Brazilian-, German-, Swedish-, Dutch-, Russian-, Polish-, Greek-, Turkish-, Arabic-, Japanese- and Korean-accented English; pitch, speed, warmth, breathiness, expressiveness, volume, tone, speaking style, laugh, natural fillers, bedtime whisper, singing; mood previews and "type anything" |
| **Your own voice** | Upload audio files or record in the browser from guided reading scripts. Each sample gets a waveform plus loudness, clipping and silence checks. Likeness, stability and style tuning. Speaker consent is required first (see below). |
| **Personality** | Eight archetypes, 14 trait dials, humour styles, love languages, values, 39 interests, quirks, favourite music, food, film and destination |
| **Relationship** | Role, stage, romance level (friendly, sweet or romantic; always tasteful), affection, how often they reach out, support and conflict style, pet names (including Turkish), emoji use, formality, message length, languages, daily rituals, wake and sleep times, anniversary, memory depth and what they remember |
| **Abilities** | Form factor (app, hologram, desktop bust, seated, full body), mobility, facial expressiveness, 12 senses (warm skin, heartbeat, breathing, blinking, eye contact…), 18 skills, battery, charging, connectivity |
| **Privacy & care** | On-device, hybrid or cloud processing; retention; guest mode; wake word and pause phrase; wellbeing options |
| **Review & export** | Full spec sheet, a generated **AI persona prompt** that runs the personality on any conversational AI, downloadable persona file, import, share codes, print |

Also included:

- Live SVG avatar that redraws on every change. Blinking and breathing animate when those senses are on, the lips move while speaking, and the hologram form gets a hologram effect.
- Eight starter presets.
- Randomise.
- Undo and redo (Ctrl+Z / Ctrl+Shift+Z).
- Autosave.
- A library of saved companions.
- Step deep links (`#voice`, `#hair`…).
- Mobile layout.

## Getting started

```bash
npm install
npm run dev        # http://localhost:8080
npm test           # unit tests
npm run build      # typecheck + production build
```

## Voice previews and cloning

**Previews** use the browser's Web Speech API. The forge picks the closest voice installed on the device for the chosen accent and gender, then applies pitch, speed and volume. Some regional accents (Geordie, Scouse, Cockney and others) ship on no device, so they're marked **preview ≈** and fall back to the nearest national voice. The production voice engine renders them natively.

**Cloning** works in three stages:

1. **Consent.** The user confirms the voice is their own, or names a speaker who has given explicit permission. Public figures are not allowed.
2. **Samples.** Uploaded and recorded audio is analysed in the browser and stored **only on the device** (IndexedDB). It needs at least 30 seconds; 90 or more is recommended.
3. **Training.** If `VITE_VOICE_ENGINE_URL` is set, samples, tuning and the consent record are POSTed to `${VITE_VOICE_ENGINE_URL}/voices`, which must return `{ "voiceId": "..." }`. Without an engine, the samples are verified and kept on the device, and the UI says plainly that the clone hasn't been trained yet.

### Connecting a voice engine

`supabase/functions/voice-clone` is a reference engine. It creates an ElevenLabs Instant Voice Clone and keeps the API key on the server.

```bash
supabase secrets set ELEVENLABS_API_KEY=your-key
supabase functions deploy voice-clone --no-verify-jwt
# then in .env.local
VITE_VOICE_ENGINE_URL=https://<project>.supabase.co/functions/v1/voice-clone
```

Add authentication and rate limiting before going live, because every call spends cloning credits.

## Safety by design

These rules are enforced in code (`src/lib/persona.ts`) on every build, import, share code and stored persona, so they can't be switched off:

- **Adults only:** apparent age is clamped to 18 or over.
- **Romance stays tasteful:** the highest level is "romantic"; explicit content is never generated.
- **Wellbeing is always on:** crisis support, no manipulation (no guilt-tripping, jealousy games or pressure for money), and honesty about being an AI. The camera indicator and encrypted memory are locked on too.
- **Voice consent:** imported files and share codes never carry voice samples, consent or the owner's name. Consent has to be given again on each device.

The generated persona prompt always ends with these wellbeing rules.

## Project structure

```
src/
  types/persona.ts          the PersonaConfig model
  data/options.ts           every option catalogue (colours, styles, traits…)
  data/voices.ts            accents, voice presets, recording scripts
  data/presets.ts           starter companions
  lib/persona.ts            defaults, sanitising and safety rules
  lib/prompt.ts             AI persona prompt builder
  lib/speech.ts             Web Speech previews and accent → device voice matching
  lib/audio.ts              sample analysis (duration, loudness, clipping, waveform)
  lib/voiceStore.ts         IndexedDB storage for voice samples
  lib/voiceEngine.ts        voice-clone engine adapter
  lib/library.ts            autosave, saved companions, export/import, share codes
  components/avatar/        layered SVG avatar (face, hair, body, accessories)
  components/steps/         one component per build step
supabase/functions/voice-clone   reference cloning backend
```
