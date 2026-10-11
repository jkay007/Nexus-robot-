import { Paintbrush, Scissors } from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { Grid, Section, Segmented, Slider, Swatches } from "@/components/ui/controls";
import { ACCENT_COLORS, FANTASY_HAIR, FRINGES, HAIR_COLOR_MODES, HAIR_STYLES, NATURAL_HAIR, PARTS } from "@/data/options";
import type { HairConfig } from "@/types/persona";
import { Avatar } from "@/components/avatar/Avatar";
import { cn } from "@/lib/cn";

const LONG_STYLES = ["long-straight", "long-wavy", "curly", "braids", "side-shave", "afro"];

export function HairStep() {
  const { persona, update } = usePersona();
  const h = persona.hair;
  const set = (patch: Partial<HairConfig>) => update("hair", patch);

  return (
    <div className="space-y-5">
      <Section title="Hairstyle" description="Tap a style to try it on." icon={<Scissors className="h-4 w-4" />}>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {HAIR_STYLES.map((s) => {
            const active = s.value === h.style;
            const preview = { ...persona, hair: { ...h, style: s.value as HairConfig["style"] } };
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => set({ style: s.value as HairConfig["style"] })}
                aria-pressed={active}
                className={cn(
                  "overflow-hidden rounded-xl border text-xs transition",
                  active ? "border-neon-pink/70 bg-neon-pink/10 shadow-glow" : "border-forge-700 bg-forge-950/40 hover:border-forge-500",
                )}
              >
                <Avatar persona={preview} animate={false} crop="head" className="h-24 w-full" title={s.label} />
                <span className="block bg-forge-900/90 py-1.5 font-medium text-white">{s.label}</span>
              </button>
            );
          })}
        </div>
        <Segmented label="Fringe / bangs" value={h.fringe} onChange={(fringe) => set({ fringe })} options={FRINGES} />
        <Segmented label="Parting" value={h.part} onChange={(part) => set({ part })} options={PARTS} />
        <Grid>
          <Slider
            label="Length"
            value={h.length}
            onChange={(length) => set({ length })}
            low="Shoulder"
            high="Waist"
            format={(v) => (LONG_STYLES.includes(h.style) ? `${v}%` : "fixed by style")}
          />
          <Slider label="Volume" value={h.volume} onChange={(volume) => set({ volume })} low="Sleek" high="Big" />
        </Grid>
      </Section>

      <Section title="Colour" description="Natural shades, fantasy colours, or any custom colour." icon={<Paintbrush className="h-4 w-4" />}>
        <Swatches label="Natural shades" value={h.color} onChange={(color) => set({ color })} swatches={NATURAL_HAIR} allowCustom={false} />
        <Swatches label="Fantasy & custom" value={h.color} onChange={(color) => set({ color })} swatches={FANTASY_HAIR} />
        <Segmented label="Colour technique" value={h.colorMode} onChange={(colorMode) => set({ colorMode })} options={HAIR_COLOR_MODES} />
        {h.colorMode !== "solid" && (
          <Swatches
            label="Second colour"
            value={h.secondaryColor}
            onChange={(secondaryColor) => set({ secondaryColor })}
            swatches={[...FANTASY_HAIR.slice(0, 10), ...NATURAL_HAIR.slice(10)]}
          />
        )}
        <Slider label="Shine" value={h.shine} onChange={(shine) => set({ shine })} low="Matte" high="Glossy" />
        <Swatches label="Hair ties, bands & clips" value={h.accessoryColor} onChange={(accessoryColor) => set({ accessoryColor })} swatches={ACCENT_COLORS} />
      </Section>
    </div>
  );
}
