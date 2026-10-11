import { useCallback, useEffect, useState, type ComponentType } from "react";
import {
  ArrowLeft, ArrowRight, Bot, Brain, Check, ClipboardList, Dices, HeartHandshake, LayoutGrid, Library, Mic2, Redo2, Scissors, Shield, Shirt,
  Smile, Undo2, UserRound,
} from "lucide-react";
import { PersonaProvider, usePersona } from "@/hooks/usePersona";
import { SpeechProvider } from "@/hooks/useSpeech";
import { AvatarDefs } from "@/components/avatar/Avatar";
import { PreviewPanel } from "@/components/PreviewPanel";
import { LibraryDrawer, PresetsDrawer } from "@/components/Drawers";
import { IdentityStep } from "@/components/steps/IdentityStep";
import { FaceBodyStep } from "@/components/steps/FaceBodyStep";
import { HairStep } from "@/components/steps/HairStep";
import { StyleStep } from "@/components/steps/StyleStep";
import { VoiceStep } from "@/components/steps/VoiceStep";
import { PersonalityStep } from "@/components/steps/PersonalityStep";
import { RelationshipStep } from "@/components/steps/RelationshipStep";
import { AbilitiesStep } from "@/components/steps/AbilitiesStep";
import { PrivacyStep } from "@/components/steps/PrivacyStep";
import { ReviewStep } from "@/components/steps/ReviewStep";
import { randomise } from "@/lib/random";
import { cn } from "@/lib/cn";

interface Step {
  id: string;
  label: string;
  blurb: string;
  icon: ComponentType<{ className?: string }>;
  Component: ComponentType;
}

const STEPS: Step[] = [
  { id: "identity", label: "Identity", blurb: "Name, age & backstory", icon: UserRound, Component: IdentityStep },
  { id: "face", label: "Face & body", blurb: "Features, skin & makeup", icon: Smile, Component: FaceBodyStep },
  { id: "hair", label: "Hair", blurb: "Styles & colours", icon: Scissors, Component: HairStep },
  { id: "style", label: "Style & cyber", blurb: "Outfits, LEDs & accessories", icon: Shirt, Component: StyleStep },
  { id: "voice", label: "Voice & accent", blurb: "Accents, tuning & cloning", icon: Mic2, Component: VoiceStep },
  { id: "personality", label: "Personality", blurb: "Traits, humour & interests", icon: Brain, Component: PersonalityStep },
  { id: "relationship", label: "Relationship", blurb: "Role, rituals & memory", icon: HeartHandshake, Component: RelationshipStep },
  { id: "abilities", label: "Abilities", blurb: "Form, senses & skills", icon: Bot, Component: AbilitiesStep },
  { id: "privacy", label: "Privacy & care", blurb: "Data & wellbeing", icon: Shield, Component: PrivacyStep },
  { id: "review", label: "Review & export", blurb: "Spec, prompt & sharing", icon: ClipboardList, Component: ReviewStep },
];

const VISITED_KEY = "nexus.forge.visited";

function stepFromHash(): number {
  const id = window.location.hash.replace("#", "");
  const i = STEPS.findIndex((s) => s.id === id);
  return i >= 0 ? i : 0;
}

function Forge() {
  const { persona, replace, undo, redo, canUndo, canRedo } = usePersona();
  const [index, setIndex] = useState(stepFromHash);
  const [drawer, setDrawer] = useState<"presets" | "library" | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(VISITED_KEY) ?? "[]") as string[]);
    } catch {
      return new Set();
    }
  });
  const step = STEPS[index];

  const go = useCallback((i: number) => {
    const next = Math.max(0, Math.min(STEPS.length - 1, i));
    setIndex(next);
    window.history.replaceState(null, "", `#${STEPS[next].id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onHash = () => setIndex(stepFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    setVisited((v) => {
      if (v.has(step.id)) return v;
      const next = new Set(v).add(step.id);
      try {
        localStorage.setItem(VISITED_KEY, JSON.stringify([...next]));
      } catch {
        // storage unavailable: progress just isn't remembered
      }
      return next;
    });
  }, [step.id]);

  const progress = Math.round((visited.size / STEPS.length) * 100);
  const closeDrawer = useCallback(() => setDrawer(null), []);

  return (
    <div className="min-h-screen">
      <AvatarDefs />
      <header className="no-print sticky top-0 z-40 border-b border-forge-800/80 bg-forge-950/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-neon-pink to-neon-cyan font-display text-lg font-bold text-forge-950">N</span>
            <div className="leading-tight">
              <p className="font-display text-sm font-bold tracking-[0.2em] text-white">NEXUS</p>
              <p className="text-[11px] text-forge-300">Persona Forge</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <button type="button" className="btn-icon" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" aria-label="Undo">
              <Undo2 className="h-4 w-4" />
            </button>
            <button type="button" className="btn-icon" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" aria-label="Redo">
              <Redo2 className="h-4 w-4" />
            </button>
            <button type="button" className="btn-ghost" onClick={() => replace(randomise(persona))} title="Surprise me">
              <Dices className="h-4 w-4" /> <span className="hidden sm:inline">Randomise</span>
            </button>
            <button type="button" className="btn-ghost" onClick={() => setDrawer("presets")}>
              <LayoutGrid className="h-4 w-4" /> <span className="hidden sm:inline">Presets</span>
            </button>
            <button type="button" className="btn-primary" onClick={() => setDrawer("library")}>
              <Library className="h-4 w-4" /> <span className="hidden sm:inline">My companions</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-[minmax(0,1fr)] gap-5 px-4 py-5 lg:grid-cols-[230px_minmax(0,1fr)_340px] xl:grid-cols-[250px_minmax(0,1fr)_380px]">
        {/* Step navigation */}
        <nav className="no-print min-w-0 lg:sticky lg:top-[76px] lg:self-start" aria-label="Build steps">
          <div className="mb-3 hidden lg:block">
            <div className="mb-1.5 flex justify-between text-xs text-forge-300">
              <span>Build progress</span>
              <span className="font-mono text-neon-cyan">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-forge-800">
              <div className="h-full rounded-full bg-gradient-to-r from-neon-pink to-neon-cyan transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <ol className="nx-scroll -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {STEPS.map((s, i) => {
              const active = i === index;
              const done = visited.has(s.id) && !active;
              return (
                <li key={s.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={active ? "step" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition",
                      active ? "border-neon-pink/60 bg-neon-pink/10 text-white shadow-glow" : "border-transparent text-forge-300 hover:bg-forge-900 hover:text-white",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                        active ? "bg-gradient-to-br from-neon-pink to-neon-violet text-white" : done ? "bg-forge-800 text-neon-cyan" : "bg-forge-800 text-forge-300",
                      )}
                    >
                      {done ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                    </span>
                    <span className="whitespace-nowrap lg:whitespace-normal">
                      <span className="block text-sm font-medium">{s.label}</span>
                      <span className="hidden text-[11px] text-forge-400 lg:block">{s.blurb}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Mobile preview */}
        <div className="no-print lg:hidden">
          <PreviewPanel compact />
        </div>

        {/* Editor */}
        <main className="min-w-0">
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neon-pink">
              Step {index + 1} of {STEPS.length}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
              {index === 0 ? (
                <>
                  Build your <span className="text-gradient">perfect companion</span>
                </>
              ) : (
                step.label
              )}
            </h1>
            <p className="mt-1 text-sm text-forge-300">{step.blurb}</p>
          </div>
          <step.Component />
          <div className="no-print mt-6 flex items-center justify-between gap-3">
            <button type="button" className="btn-ghost" onClick={() => go(index - 1)} disabled={index === 0}>
              <ArrowLeft className="h-4 w-4" /> {index > 0 ? STEPS[index - 1].label : "Back"}
            </button>
            {index < STEPS.length - 1 && (
              <button type="button" className="btn-primary" onClick={() => go(index + 1)}>
                {STEPS[index + 1].label} <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </main>

        {/* Desktop preview */}
        <aside className="no-print hidden lg:sticky lg:top-[76px] lg:block lg:self-start">
          <PreviewPanel />
          <p className="mt-3 px-1 text-center text-[11px] text-forge-400">Autosaved on this device · Ctrl+Z to undo</p>
        </aside>
      </div>

      <PresetsDrawer open={drawer === "presets"} onClose={closeDrawer} />
      <LibraryDrawer open={drawer === "library"} onClose={closeDrawer} />
    </div>
  );
}

export default function App() {
  return (
    <PersonaProvider>
      <SpeechProvider>
        <Forge />
      </SpeechProvider>
    </PersonaProvider>
  );
}
