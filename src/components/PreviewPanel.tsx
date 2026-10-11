import { Languages, MessageCircleHeart, Ruler, Square, Volume2 } from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { useSpeech } from "@/hooks/useSpeech";
import { Avatar } from "@/components/avatar/Avatar";
import { accentLabel, roleLabel, topTraits } from "@/lib/describe";
import { sampleLine } from "@/lib/lines";
import { getVoicePreset } from "@/data/voices";
import { cn } from "@/lib/cn";

function SpeakingBars({ active }: { active: boolean }) {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn("w-1 origin-bottom rounded-full bg-neon-cyan", active ? "animate-bar" : "scale-y-[0.3]")}
          style={{ height: "100%", animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  );
}

export function PreviewPanel({ compact = false }: { compact?: boolean }) {
  const { persona } = usePersona();
  const { speak, stop, speaking, supported } = useSpeech();
  const { identity, voice } = persona;
  const traits = topTraits(persona, 3);
  const voiceName = voice.source === "clone" ? "Your cloned voice" : getVoicePreset(voice.presetId).name;

  return (
    <div className={cn("overflow-hidden rounded-3xl border border-forge-700/80 bg-forge-900/70 backdrop-blur", compact ? "flex gap-3 p-3" : "")}>
      <div className={cn("relative", compact ? "w-28 shrink-0" : "")}>
        <Avatar persona={persona} speaking={speaking} className={cn("w-full", compact ? "h-36" : "aspect-[4/5]")} />
        {!compact && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-forge-950/70 px-2 py-1 text-[11px] text-forge-200 backdrop-blur">
            <Ruler className="h-3 w-3" /> {persona.faceBody.heightCm} cm
          </span>
        )}
        {!compact && (
          <span className="absolute right-3 top-3 rounded-full bg-forge-950/70 px-2 py-1 text-[11px] uppercase tracking-wider text-neon-cyan backdrop-blur">
            Live preview
          </span>
        )}
      </div>

      <div className={cn(compact ? "min-w-0 flex-1 py-1" : "border-t border-forge-700/70 p-4")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="truncate font-display text-xl font-semibold text-white">{identity.name || "Unnamed"}</h2>
            <p className="truncate text-sm text-forge-300">
              {roleLabel(persona)} · {identity.apparentAge} · {identity.hometown || identity.heritage}
            </p>
          </div>
          <SpeakingBars active={speaking} />
        </div>

        <div className={cn("mt-3 space-y-1.5 text-xs text-forge-300", compact && "hidden sm:block")}>
          <p className="flex items-center gap-1.5 truncate">
            <Languages className="h-3.5 w-3.5 shrink-0 text-neon-pink" /> {accentLabel(persona)}
          </p>
          <p className="flex items-center gap-1.5 truncate">
            <MessageCircleHeart className="h-3.5 w-3.5 shrink-0 text-neon-pink" /> {voiceName} · {voice.tone} · {voice.speakingStyle}
          </p>
        </div>

        {!compact && (
          <div className="mt-4 space-y-2">
            {traits.map((t) => (
              <div key={t.key}>
                <div className="mb-1 flex justify-between text-[11px] text-forge-300">
                  <span>{t.label}</span>
                  <span className="font-mono">{t.value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-forge-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-neon-pink to-neon-violet" style={{ width: `${t.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          disabled={!supported}
          onClick={() => (speaking ? stop() : speak(sampleLine(persona, "hello")))}
          className={cn("btn-primary mt-4 w-full", compact && "mt-2 py-1.5 text-xs")}
          title={supported ? undefined : "Voice preview isn't supported in this browser"}
        >
          {speaking ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          {speaking ? "Stop" : `Hear ${identity.name || "them"} say hello`}
        </button>
      </div>
    </div>
  );
}
