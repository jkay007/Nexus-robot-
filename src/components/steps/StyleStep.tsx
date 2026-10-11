import { Cpu, Gem, Shirt, Sparkles } from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { Chips, OptionCards, Section, Segmented, Select, Slider, Swatches, Toggle } from "@/components/ui/controls";
import {
  ACCENT_COLORS, ACCESSORIES, CHASSIS, CIRCUITRY, EAR_TYPES, FRAGRANCES, NAIL_COLORS, OUTFIT_COLORS, OUTFITS, REALISM, TATTOOS,
} from "@/data/options";
import type { StyleConfig } from "@/types/persona";

export function StyleStep() {
  const { persona, update } = usePersona();
  const s = persona.style;
  const set = (patch: Partial<StyleConfig>) => update("style", patch);

  return (
    <div className="space-y-5">
      <Section title="Synthetic design" description="Choose how human, or how gloriously robotic, they look." icon={<Cpu className="h-4 w-4" />}>
        <OptionCards value={s.realism} onChange={(realism) => set({ realism })} options={REALISM} />
        <Swatches label="LED accent colour" value={s.accentColor} onChange={(accentColor) => set({ accentColor })} swatches={ACCENT_COLORS} />
        <Slider label="Glow intensity" value={s.glowIntensity} onChange={(glowIntensity) => set({ glowIntensity })} low="Subtle" high="Radiant" />
        <Segmented label="Circuit tracing" value={s.circuitry} onChange={(circuitry) => set({ circuitry })} options={CIRCUITRY} />
        <Segmented label="Ears" value={s.earType} onChange={(earType) => set({ earType })} options={EAR_TYPES} />
        <Segmented label="Chassis finish" value={s.chassisFinish} onChange={(chassisFinish) => set({ chassisFinish })} options={CHASSIS} />
        <Toggle label="Chest core light" description="A soft pulsing light that shows mood and battery" checked={s.coreLight} onChange={(coreLight) => set({ coreLight })} />
      </Section>

      <Section title="Wardrobe" description="Swap outfits any time; the robot ships with this look." icon={<Shirt className="h-4 w-4" />}>
        <Segmented label="Outfit" value={s.outfit} onChange={(outfit) => set({ outfit })} options={OUTFITS} />
        <Swatches label="Outfit colour" value={s.outfitColor} onChange={(outfitColor) => set({ outfitColor })} swatches={OUTFIT_COLORS} />
      </Section>

      <Section title="Accessories & body art" icon={<Gem className="h-4 w-4" />}>
        <Chips label="Accessories" values={s.accessories} onChange={(accessories) => set({ accessories })} options={ACCESSORIES} max={5} />
        <Chips label="Tattoos" values={s.tattoos} onChange={(tattoos) => set({ tattoos })} options={TATTOOS} />
        <Swatches label="Nail colour" value={s.nailColor} onChange={(nailColor) => set({ nailColor })} swatches={NAIL_COLORS} />
      </Section>

      <Section title="Signature scent" description="For builds with the scent diffuser module." icon={<Sparkles className="h-4 w-4" />}>
        <Select label="Fragrance" value={s.fragrance} onChange={(fragrance) => set({ fragrance })} options={FRAGRANCES} />
      </Section>
    </div>
  );
}
