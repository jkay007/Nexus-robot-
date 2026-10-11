import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, CircleDot, FileAudio, Loader2, Mic, Pause, Play, ShieldCheck, Square, Trash2, Upload, XCircle,
} from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { useRecorder } from "@/hooks/useRecorder";
import { Section, Slider } from "@/components/ui/controls";
import { RECORDING_SCRIPTS } from "@/data/voices";
import { analyseAudio, sampleQuality, type AudioAnalysis } from "@/lib/audio";
import { deleteSample, loadSample, saveSample } from "@/lib/voiceStore";
import { submitClone, voiceEngineConfigured } from "@/lib/voiceEngine";
import { MIN_CLONE_SECONDS, newId, RECOMMENDED_CLONE_SECONDS, totalSampleSeconds } from "@/lib/persona";
import type { VoiceCloneConfig, VoiceSample } from "@/types/persona";
import { cn } from "@/lib/cn";

const MAX_SAMPLES = 10;
const MAX_FILE_MB = 25;
const MAX_SAMPLE_SECONDS = 600;

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

function Waveform({ data, className }: { data?: number[]; className?: string }) {
  if (!data) return <div className={cn("h-8 animate-pulse rounded bg-forge-800", className)} />;
  const w = data.length * 3;
  return (
    <svg viewBox={`0 0 ${w} 32`} preserveAspectRatio="none" className={cn("h-8", className)} aria-hidden="true">
      {data.map((v, i) => {
        const h = Math.max(1.5, v * 30);
        return <rect key={i} x={i * 3} y={16 - h / 2} width={2} height={h} rx={1} fill="url(#nx-wave)" />;
      })}
      <defs>
        <linearGradient id="nx-wave" x1="0" x2="1">
          <stop offset="0" stopColor="#ff4fd8" />
          <stop offset="1" stopColor="#3ee7ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function VoiceClone() {
  const { persona, update } = usePersona();
  const clone = persona.voice.clone;
  const setClone = (patch: Partial<VoiceCloneConfig>) => update("voice", { clone: { ...clone, ...patch } });
  const recorder = useRecorder(MAX_SAMPLE_SECONDS);

  const [analyses, setAnalyses] = useState<Record<string, AudioAnalysis>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState<string | null>(null);
  const [script, setScript] = useState(0);
  const [draftSpeaker, setDraftSpeaker] = useState<VoiceCloneConfig["speaker"]>(clone.speaker || "self");
  const [draftName, setDraftName] = useState(clone.speakerName);
  const [draftConfirm, setDraftConfirm] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  const total = totalSampleSeconds(persona);
  const progress = Math.min(1, total / RECOMMENDED_CLONE_SECONDS);
  const consented = clone.consentConfirmed;

  // Re-analyse saved samples so their waveforms and quality checks show after a reload.
  useEffect(() => {
    let alive = true;
    for (const s of clone.samples) {
      if (analyses[s.id]) continue;
      void loadSample(s.id)
        .then((blob) => (blob ? analyseAudio(blob) : null))
        .then((a) => a && alive && setAnalyses((m) => ({ ...m, [s.id]: a })))
        .catch(() => undefined);
    }
    return () => {
      alive = false;
    };
  }, [clone.samples.map((s) => s.id).join(",")]);

  useEffect(() => () => audio.current?.pause(), []);

  const confirmConsent = () => {
    setClone({ speaker: draftSpeaker, speakerName: draftSpeaker === "permission" ? draftName.trim() : "", consentConfirmed: true, consentAt: new Date().toISOString() });
  };

  const addBlobs = async (items: { blob: Blob; name: string; source: VoiceSample["source"] }[]) => {
    setError("");
    setBusy(true);
    const added: VoiceSample[] = [];
    const newAnalyses: Record<string, AudioAnalysis> = {};
    const problems: string[] = [];
    for (const item of items) {
      if (clone.samples.length + added.length >= MAX_SAMPLES) {
        problems.push(`Maximum ${MAX_SAMPLES} samples.`);
        break;
      }
      if (item.blob.size > MAX_FILE_MB * 1024 * 1024) {
        problems.push(`${item.name} is over ${MAX_FILE_MB} MB.`);
        continue;
      }
      try {
        const a = await analyseAudio(item.blob);
        if (a.durationSec > MAX_SAMPLE_SECONDS) {
          problems.push(`${item.name} is longer than 10 minutes — trim it first.`);
          continue;
        }
        const id = newId();
        await saveSample(id, item.blob);
        newAnalyses[id] = a;
        added.push({
          id,
          name: item.name.slice(0, 120),
          durationSec: Math.round(a.durationSec * 10) / 10,
          source: item.source,
          peak: a.peak,
          rms: a.rms,
          createdAt: new Date().toISOString(),
        });
      } catch {
        problems.push(`Couldn't read ${item.name}. Use MP3, WAV, M4A, OGG or WebM audio.`);
      }
    }
    setAnalyses((m) => ({ ...m, ...newAnalyses }));
    if (added.length) {
      setClone({ samples: [...clone.samples, ...added], status: clone.status === "ready" ? "ready" : "none" });
    }
    setError(problems.join(" "));
    setBusy(false);
  };

  const onFiles = (files: FileList | null) => {
    if (!files?.length) return;
    void addBlobs(Array.from(files).map((f) => ({ blob: f, name: f.name, source: "upload" as const })));
  };

  const toggleRecording = async () => {
    if (recorder.state === "recording") {
      const blob = await recorder.stop();
      if (blob) await addBlobs([{ blob, name: `Recording — ${RECORDING_SCRIPTS[script].title}`, source: "recording" }]);
      setScript((i) => Math.min(RECORDING_SCRIPTS.length - 1, i + 1));
    } else {
      void recorder.start();
    }
  };

  const play = async (id: string) => {
    audio.current?.pause();
    if (playing === id) {
      setPlaying(null);
      return;
    }
    const blob = await loadSample(id);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const el = new Audio(url);
    audio.current = el;
    el.onended = () => {
      setPlaying(null);
      URL.revokeObjectURL(url);
    };
    setPlaying(id);
    void el.play();
  };

  const remove = async (id: string) => {
    await deleteSample(id).catch(() => undefined);
    const samples = clone.samples.filter((s) => s.id !== id);
    setClone({ samples, status: samples.length ? clone.status : "none" });
  };

  const deleteEverything = async () => {
    await Promise.all(clone.samples.map((s) => deleteSample(s.id).catch(() => undefined)));
    setAnalyses({});
    update("voice", {
      source: "library",
      clone: { ...clone, samples: [], status: "none", consentConfirmed: false, consentAt: "", speaker: "", speakerName: "", engineVoiceId: "" },
    });
  };

  const createClone = async () => {
    setError("");
    if (!voiceEngineConfigured) {
      setClone({ status: "samples-ready" });
      return;
    }
    setClone({ status: "submitted" });
    try {
      const { voiceId } = await submitClone(persona);
      update("voice", { source: "clone", clone: { ...clone, status: "ready", engineVoiceId: voiceId } });
    } catch (e) {
      setClone({ status: "failed" });
      setError(e instanceof Error ? e.message : "Voice engine error");
    }
  };

  /* ---------- Render ---------- */

  if (!consented) {
    const canConfirm = draftConfirm && (draftSpeaker === "self" || draftName.trim().length > 1);
    return (
      <Section title="Your own voice" description="Upload or record a voice for your companion to speak with." icon={<ShieldCheck className="h-4 w-4" />}>
        <div className="rounded-xl border border-neon-cyan/30 bg-neon-cyan/5 p-4 text-sm text-forge-200">
          <p className="font-medium text-white">Step 1 — consent</p>
          <p className="mt-1 text-forge-300">
            Voice cloning only works with a voice you have the right to use. Cloning a celebrity, public figure or anyone who hasn't agreed is
            not allowed.
          </p>
        </div>
        <div role="radiogroup" aria-label="Whose voice is this?" className="grid gap-2 sm:grid-cols-2">
          {(
            [
              { value: "self", label: "My own voice", hint: "You'll record or upload yourself" },
              { value: "permission", label: "Someone who agreed", hint: "You have their explicit permission" },
            ] as const
          ).map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={draftSpeaker === o.value}
              onClick={() => setDraftSpeaker(o.value)}
              className={cn(
                "rounded-xl border p-3 text-left transition",
                draftSpeaker === o.value ? "border-neon-pink/70 bg-neon-pink/10" : "border-forge-700 bg-forge-950/40 hover:border-forge-500",
              )}
            >
              <span className="block text-sm font-medium text-white">{o.label}</span>
              <span className="block text-xs text-forge-300">{o.hint}</span>
            </button>
          ))}
        </div>
        {draftSpeaker === "permission" && (
          <input
            className="w-full rounded-xl border border-forge-700 bg-forge-950/60 px-3 py-2 text-sm text-white placeholder:text-forge-500 outline-none focus:border-neon-pink/70"
            placeholder="Speaker's full name"
            value={draftName}
            maxLength={80}
            onChange={(e) => setDraftName(e.target.value)}
          />
        )}
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-forge-700 bg-forge-950/40 p-3 text-sm">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#ff4fd8]" checked={draftConfirm} onChange={(e) => setDraftConfirm(e.target.checked)} />
          <span className="text-forge-200">
            I confirm {draftSpeaker === "self" ? "this is my own voice" : "the speaker has given me explicit permission to clone their voice"}, it is
            not a public figure's voice, and I understand the clone is watermarked and can be deleted at any time.
          </span>
        </label>
        <button type="button" className="btn-primary w-full" disabled={!canConfirm} onClick={confirmConsent}>
          <ShieldCheck className="h-4 w-4" /> Confirm & continue
        </button>
      </Section>
    );
  }

  const ready = total >= MIN_CLONE_SECONDS;

  return (
    <Section
      title="Your own voice"
      description={clone.speaker === "self" ? "Consent recorded: your own voice." : `Consent recorded: ${clone.speakerName}.`}
      icon={<ShieldCheck className="h-4 w-4" />}
      aside={
        <button type="button" className="btn-ghost shrink-0 text-xs" onClick={() => void deleteEverything()}>
          <Trash2 className="h-3.5 w-3.5" /> Delete all
        </button>
      }
    >
      {/* Progress */}
      <div>
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="text-forge-200">
            {fmt(total)} recorded · {clone.samples.length}/{MAX_SAMPLES} samples
          </span>
          <span className="text-forge-400">
            minimum {fmt(MIN_CLONE_SECONDS)} · best {fmt(RECOMMENDED_CLONE_SECONDS)}+
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-forge-800">
          <div className="h-full rounded-full bg-gradient-to-r from-neon-pink to-neon-cyan transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {/* Record */}
      <div className="rounded-xl border border-forge-700 bg-forge-950/40 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-white">
            Read aloud · <span className="text-neon-cyan">{RECORDING_SCRIPTS[script].title}</span>
          </p>
          <div className="flex gap-1">
            <button type="button" className="btn-icon h-7 w-7" aria-label="Previous script" disabled={script === 0} onClick={() => setScript((i) => i - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="btn-icon h-7 w-7"
              aria-label="Next script"
              disabled={script === RECORDING_SCRIPTS.length - 1}
              onClick={() => setScript((i) => i + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="text-base leading-relaxed text-forge-200">"{RECORDING_SCRIPTS[script].text}"</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void toggleRecording()}
            disabled={recorder.state === "unsupported" || recorder.state === "requesting" || busy}
            className={cn("btn", recorder.state === "recording" ? "bg-red-500/90 text-white hover:bg-red-500" : "btn-primary")}
          >
            {recorder.state === "recording" ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {recorder.state === "recording" ? `Stop · ${fmt(recorder.seconds)}` : "Record"}
          </button>
          <label className={cn("btn-ghost cursor-pointer", busy && "pointer-events-none opacity-40")}>
            <Upload className="h-4 w-4" /> Upload audio
            <input type="file" accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.flac" multiple className="hidden" onChange={(e) => (onFiles(e.target.files), (e.target.value = ""))} />
          </label>
          {recorder.state === "recording" && (
            <div className="flex h-6 flex-1 items-center gap-0.5" aria-label="Input level">
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i} className={cn("h-full flex-1 rounded-sm", i / 24 < recorder.level * 1.6 ? (i > 19 ? "bg-red-400" : "bg-neon-cyan") : "bg-forge-800")} />
              ))}
            </div>
          )}
          {busy && <Loader2 className="h-4 w-4 animate-spin text-neon-cyan" />}
        </div>
        {recorder.state === "denied" && <p className="mt-2 text-xs text-amber-300">Microphone access was blocked. Allow it in your browser settings, or upload a file instead.</p>}
        {recorder.state === "unsupported" && <p className="mt-2 text-xs text-amber-300">Recording isn't supported in this browser — upload a file instead.</p>}
        <p className="mt-3 text-xs text-forge-400">Tips: quiet room, phone or mic 15–20 cm away, natural voice. Mix calm, happy and excited lines.</p>
      </div>

      {error && <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{error}</p>}

      {/* Samples */}
      {clone.samples.length > 0 && (
        <ul className="space-y-2">
          {clone.samples.map((s) => {
            const a = analyses[s.id];
            const checks = a ? sampleQuality(a) : [];
            return (
              <li key={s.id} className="rounded-xl border border-forge-700 bg-forge-950/40 p-3">
                <div className="flex items-center gap-3">
                  <button type="button" className="btn-icon shrink-0" aria-label={playing === s.id ? "Pause" : "Play sample"} onClick={() => void play(s.id)}>
                    {playing === s.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-sm text-white">
                      {s.source === "recording" ? <CircleDot className="h-3.5 w-3.5 text-red-400" /> : <FileAudio className="h-3.5 w-3.5 text-neon-cyan" />}
                      <span className="truncate">{s.name}</span>
                    </p>
                    <Waveform data={a?.waveform} className="mt-1 w-full" />
                  </div>
                  <span className="shrink-0 font-mono text-xs text-forge-300">{fmt(s.durationSec)}</span>
                  <button type="button" className="btn-icon shrink-0" aria-label="Delete sample" onClick={() => void remove(s.id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {checks.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {checks.map((c) => (
                      <span
                        key={c.label}
                        title={c.detail}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]",
                          c.status === "pass" ? "bg-emerald-500/10 text-emerald-300" : c.status === "warn" ? "bg-amber-500/10 text-amber-300" : "bg-red-500/10 text-red-300",
                        )}
                      >
                        {c.status === "pass" ? <CheckCircle2 className="h-3 w-3" /> : c.status === "warn" ? <AlertTriangle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {c.label}: {c.detail}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Tuning */}
      <div className="grid gap-5 sm:grid-cols-3">
        <Slider label="Likeness" value={clone.similarity} onChange={(similarity) => setClone({ similarity })} low="Loose" high="Exact" />
        <Slider label="Stability" value={clone.stability} onChange={(stability) => setClone({ stability })} low="Expressive" high="Steady" />
        <Slider label="Style boost" value={clone.styleExaggeration} onChange={(styleExaggeration) => setClone({ styleExaggeration })} low="Natural" high="Dramatic" />
      </div>

      {/* Create */}
      <button type="button" className="btn-primary w-full py-3" disabled={!ready || clone.status === "submitted"} onClick={() => void createClone()}>
        {clone.status === "submitted" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
        {clone.status === "ready" ? "Re-train voice clone" : ready ? "Create my voice clone" : `Add ${fmt(MIN_CLONE_SECONDS - total)} more audio to continue`}
      </button>

      {clone.status === "ready" && (
        <p className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          <CheckCircle2 className="h-4 w-4" /> Voice clone ready ({clone.engineVoiceId}). {persona.identity.name} now speaks with this voice.
        </p>
      )}
      {clone.status === "samples-ready" && (
        <div className="rounded-lg bg-neon-cyan/10 px-3 py-2 text-sm text-forge-200">
          <p className="flex items-center gap-2 font-medium text-white">
            <CheckCircle2 className="h-4 w-4 text-neon-cyan" /> Samples verified and saved on this device
          </p>
          <p className="mt-1 text-forge-300">
            No voice engine is connected to this forge yet, so the clone hasn't been trained. Connect one (see README, "Connecting a voice engine")
            and press the button again. Browser previews meanwhile use the closest library voice with your accent settings.
          </p>
        </div>
      )}
    </Section>
  );
}
