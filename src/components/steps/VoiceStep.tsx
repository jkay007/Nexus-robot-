import { useMemo, useState } from "react";
import { AudioLines, Globe2, Library, Mic2, Play, SlidersHorizontal, Square, Volume2, Wand2 } from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { useSpeech } from "@/hooks/useSpeech";
import { Grid, Section, Segmented, Select, Slider, Toggle } from "@/components/ui/controls";
import { ACCENT_REGIONS, ACCENTS, getAccent, LAUGHS, SPEAKING_STYLES, VOICE_PRESETS, VOICE_TONES } from "@/data/voices";
import { LINE_KINDS, sampleLine } from "@/lib/lines";
import type { PersonaConfig, VoiceConfig } from "@/types/persona";
import { cn } from "@/lib/cn";
import { VoiceClone } from "./VoiceClone";

const toOptions = (list: string[]) => list.map((v) => ({ value: v, label: v }));

export function VoiceStep() {
  const { persona, update } = usePersona();
  const { speak, stop, speaking, supported, voices } = useSpeech();
  const v = persona.voice;
  const set = (patch: Partial<VoiceConfig>) => update("voice", patch);
  const [region, setRegion] = useState(getAccent(v.accentId).region);
  const [custom, setCustom] = useState("");
  const accent = getAccent(v.accentId);

  const withVoice = (patch: Partial<VoiceConfig>): PersonaConfig => ({ ...persona, voice: { ...v, ...patch } });

  const deviceOptions = useMemo(() => {
    const base = accent.lang.split("-")[0];
    const matching = voices.filter((d) => d.lang.toLowerCase().startsWith(base));
    const rest = voices.filter((d) => !d.lang.toLowerCase().startsWith(base));
    return [
      { value: "", label: "Auto — best match for accent" },
      ...[...matching, ...rest].map((d) => ({ value: d.name, label: `${d.name} (${d.lang})` })),
    ];
  }, [voices, accent.lang]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-forge-700 bg-forge-900/70 p-1.5">
        {(
          [
            { value: "library", label: "Voice library", icon: Library },
            { value: "clone", label: "Your own voice", icon: Mic2 },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => set({ source: tab.value })}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              v.source === tab.value ? "bg-gradient-to-r from-neon-pink/80 to-neon-violet/80 text-white shadow-glow" : "text-forge-300 hover:text-white",
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {v.source === "library" ? (
        <Section title="Voice library" description="Twelve studio voices. Tap play to audition." icon={<Library className="h-4 w-4" />}>
          <div className="grid gap-2 sm:grid-cols-2">
            {VOICE_PRESETS.map((preset) => {
              const active = preset.id === v.presetId;
              return (
                <div
                  key={preset.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 transition",
                    active ? "border-neon-pink/70 bg-neon-pink/10 shadow-glow" : "border-forge-700 bg-forge-950/40",
                  )}
                >
                  <button
                    type="button"
                    aria-label={`Audition ${preset.name}`}
                    onClick={() => speak(sampleLine(persona, "hello"), withVoice({ presetId: preset.id, tone: preset.tone }))}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forge-800 text-neon-cyan hover:bg-forge-700"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                  <button type="button" className="min-w-0 flex-1 text-left" onClick={() => set({ presetId: preset.id, tone: preset.tone })}>
                    <span className="flex items-center gap-2 text-sm font-semibold text-white">
                      {preset.name}
                      <span className="rounded bg-forge-800 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-forge-300">{preset.gender}</span>
                    </span>
                    <span className="block truncate text-xs text-forge-300">{preset.description}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </Section>
      ) : (
        <VoiceClone />
      )}

      <Section
        title="Accent"
        description={`${ACCENTS.length} accents across Britain, Ireland, America and beyond.`}
        icon={<Globe2 className="h-4 w-4" />}
        aside={
          <button type="button" className="btn-ghost shrink-0" onClick={() => speak(sampleLine(persona, "hello"))}>
            <Volume2 className="h-4 w-4" /> Hear it
          </button>
        }
      >
        <Segmented value={region} onChange={setRegion} options={ACCENT_REGIONS.map((r) => ({ value: r, label: r }))} />
        <div className="grid gap-2 sm:grid-cols-2">
          {ACCENTS.filter((a) => a.region === region).map((a) => {
            const active = a.id === v.accentId;
            return (
              <div
                key={a.id}
                className={cn(
                  "flex items-start gap-2 rounded-xl border p-3 transition",
                  active ? "border-neon-cyan/70 bg-neon-cyan/10 shadow-glow-cyan" : "border-forge-700 bg-forge-950/40 hover:border-forge-500",
                )}
              >
                <button type="button" className="min-w-0 flex-1 text-left" aria-pressed={active} onClick={() => set({ accentId: a.id, deviceVoiceName: "" })}>
                  <span className="flex items-center gap-2 text-sm font-medium text-white">
                    {a.label}
                    {a.approximate && (
                      <span
                        title="Your browser preview uses the nearest national voice; the robot renders the exact accent."
                        className="shrink-0 rounded bg-forge-800 px-1.5 py-0.5 text-[10px] text-forge-300"
                      >
                        preview ≈
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-forge-300">{a.description}</span>
                </button>
                <button
                  type="button"
                  aria-label={`Audition ${a.label}`}
                  onClick={() => speak(sampleLine(persona, "hello"), withVoice({ accentId: a.id, deviceVoiceName: "" }))}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forge-800 text-neon-cyan hover:bg-forge-700"
                >
                  <Play className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-forge-400">
          Selected: <span className="text-neon-cyan">{accent.label}</span>. Tap ▶ to audition any accent. Browser previews use the voices installed
          on this device; the Nexus neural voice engine renders every accent natively.
        </p>
      </Section>

      <Section title="Fine-tune the voice" icon={<SlidersHorizontal className="h-4 w-4" />}>
        <Grid>
          <Slider label="Pitch" value={v.pitch} min={-50} max={50} onChange={(pitch) => set({ pitch })} low="Deeper" high="Higher" format={(n) => (n > 0 ? `+${n}` : `${n}`)} />
          <Slider label="Speaking speed" value={v.rate} min={70} max={140} onChange={(rate) => set({ rate })} low="Unhurried" high="Quick" format={(n) => `${n}%`} />
          <Slider label="Warmth" value={v.warmth} onChange={(warmth) => set({ warmth })} low="Cool" high="Warm" />
          <Slider label="Breathiness" value={v.breathiness} onChange={(breathiness) => set({ breathiness })} low="Clear" high="Airy" />
          <Slider label="Expressiveness" value={v.expressiveness} onChange={(expressiveness) => set({ expressiveness })} low="Even" high="Animated" />
          <Slider label="Volume" value={v.volume} onChange={(volume) => set({ volume })} low="Soft" high="Full" />
        </Grid>
        <Segmented label="Tone" value={v.tone} onChange={(tone) => set({ tone })} options={toOptions(VOICE_TONES)} />
        <Segmented label="Speaking style" value={v.speakingStyle} onChange={(speakingStyle) => set({ speakingStyle })} options={toOptions(SPEAKING_STYLES)} />
        <Segmented label="Laugh" value={v.laugh} onChange={(laugh) => set({ laugh })} options={toOptions(LAUGHS)} />
        <Grid>
          <Toggle label="Natural fillers" description={'Little "hmm"s and "oh!"s'} checked={v.naturalFillers} onChange={(naturalFillers) => set({ naturalFillers })} />
          <Toggle label="Whisper after bedtime" description="Softer voice late at night" checked={v.whisperAtNight} onChange={(whisperAtNight) => set({ whisperAtNight })} />
          <Toggle label="Sings" description="Hums and sings along to music" checked={v.singing} onChange={(singing) => set({ singing })} />
        </Grid>
      </Section>

      <Section title="Test the voice" description="Hear your companion in different moods." icon={<AudioLines className="h-4 w-4" />}>
        {!supported && <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-200">This browser can't play voice previews. Try Chrome, Edge or Safari.</p>}
        <div className="flex flex-wrap gap-2">
          {LINE_KINDS.map((l) => (
            <button key={l.kind} type="button" className="btn-ghost" onClick={() => speak(sampleLine(persona, l.kind))}>
              <Play className="h-3.5 w-3.5" /> {l.label}
            </button>
          ))}
          {speaking && (
            <button type="button" className="btn-ghost border-neon-pink/50 text-neon-pink" onClick={stop}>
              <Square className="h-3.5 w-3.5" /> Stop
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <input
            className="w-full rounded-xl border border-forge-700 bg-forge-950/60 px-3 py-2 text-sm text-white placeholder:text-forge-500 outline-none focus:border-neon-pink/70"
            placeholder={`Type anything for ${persona.identity.name || "them"} to say…`}
            value={custom}
            maxLength={400}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && custom.trim() && speak(custom.trim())}
          />
          <button type="button" className="btn-primary shrink-0" disabled={!custom.trim()} onClick={() => speak(custom.trim())}>
            <Wand2 className="h-4 w-4" /> Speak
          </button>
        </div>
        <Select
          label="Preview voice on this device"
          hint={`${voices.length} device voices found`}
          value={v.deviceVoiceName}
          onChange={(deviceVoiceName) => set({ deviceVoiceName })}
          options={deviceOptions}
        />
      </Section>
    </div>
  );
}
