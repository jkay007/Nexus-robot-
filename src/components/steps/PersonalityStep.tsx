import { Brain, Heart, Laugh, Sparkles, Star } from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { Chips, Grid, Section, Slider, TextInput } from "@/components/ui/controls";
import { ARCHETYPES, HUMOUR_STYLES, INTERESTS, LOVE_LANGUAGES, QUIRKS, TRAITS, VALUES } from "@/data/options";
import type { PersonalityConfig, TraitKey } from "@/types/persona";
import { cn } from "@/lib/cn";

export function PersonalityStep() {
  const { persona, update } = usePersona();
  const p = persona.personality;
  const set = (patch: Partial<PersonalityConfig>) => update("personality", patch);
  const setTrait = (key: TraitKey, value: number) => set({ traits: { ...p.traits, [key]: value }, archetype: "custom" });

  const applyArchetype = (value: string) => {
    const a = ARCHETYPES.find((x) => x.value === value);
    if (!a) return;
    set({ archetype: value, traits: { ...p.traits, ...a.traits } });
  };

  return (
    <div className="space-y-5">
      <Section title="Archetype" description="Start from a personality, then fine-tune every trait." icon={<Sparkles className="h-4 w-4" />}>
        <div className="grid gap-2 sm:grid-cols-2">
          {ARCHETYPES.map((a) => {
            const active = a.value === p.archetype;
            return (
              <button
                key={a.value}
                type="button"
                onClick={() => applyArchetype(a.value)}
                aria-pressed={active}
                className={cn(
                  "rounded-xl border p-3 text-left transition",
                  active ? "border-neon-pink/70 bg-neon-pink/10 shadow-glow" : "border-forge-700 bg-forge-950/40 hover:border-forge-500",
                )}
              >
                <span className="block text-sm font-semibold text-white">{a.label}</span>
                <span className="block text-xs text-forge-300">{a.blurb}</span>
              </button>
            );
          })}
        </div>
        {p.archetype === "custom" && <p className="text-xs text-neon-cyan">Custom blend: you've tuned the traits by hand.</p>}
      </Section>

      <Section title="Personality traits" description="Fourteen dials that shape how they think, talk and react." icon={<Brain className="h-4 w-4" />}>
        <Grid>
          {TRAITS.map((t) => (
            <Slider key={t.key} label={t.label} value={p.traits[t.key]} onChange={(v) => setTrait(t.key, v)} low={t.low} high={t.high} />
          ))}
        </Grid>
      </Section>

      <Section title="Humour & heart" icon={<Laugh className="h-4 w-4" />}>
        <Chips label="Sense of humour" values={p.humourStyles} onChange={(humourStyles) => set({ humourStyles })} options={HUMOUR_STYLES} max={4} />
        <Chips label="Love languages" values={p.loveLanguages} onChange={(loveLanguages) => set({ loveLanguages })} options={LOVE_LANGUAGES} max={3} />
        <Chips label="Core values" values={p.values} onChange={(values) => set({ values })} options={VALUES} max={5} />
      </Section>

      <Section title="Interests & quirks" description="What lights them up, and the little things that make them them." icon={<Heart className="h-4 w-4" />}>
        <Chips label="Interests" values={p.interests} onChange={(interests) => set({ interests })} options={INTERESTS} max={10} />
        <Chips label="Quirks" values={p.quirks} onChange={(quirks) => set({ quirks })} options={QUIRKS} max={4} />
      </Section>

      <Section title="Favourite things" icon={<Star className="h-4 w-4" />}>
        <Grid>
          <TextInput label="Music" value={p.favouriteMusic} onChange={(favouriteMusic) => set({ favouriteMusic })} />
          <TextInput label="Food" value={p.favouriteFood} onChange={(favouriteFood) => set({ favouriteFood })} />
          <TextInput label="Film" value={p.favouriteFilm} onChange={(favouriteFilm) => set({ favouriteFilm })} />
          <TextInput label="Dream destination" value={p.dreamDestination} onChange={(dreamDestination) => set({ dreamDestination })} />
        </Grid>
      </Section>
    </div>
  );
}
