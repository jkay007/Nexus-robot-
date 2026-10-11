import { Eye, Palette, PersonStanding, Smile } from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { Grid, Section, Segmented, Slider, Swatches, Toggle } from "@/components/ui/controls";
import {
  BROWS, BUILDS, EYE_COLORS, EYE_SHAPES, FACE_SHAPES, FACIAL_HAIR, LASHES, LIP_COLORS, LIP_SHAPES, MAKEUP,
  NATURAL_HAIR, NOSES, SKIN_FINISHES, SKIN_TONES,
} from "@/data/options";
import type { FaceBodyConfig } from "@/types/persona";

export function FaceBodyStep() {
  const { persona, update } = usePersona();
  const f = persona.faceBody;
  const set = (patch: Partial<FaceBodyConfig>) => update("faceBody", patch);
  const feet = Math.floor(f.heightCm / 30.48);
  const inches = Math.round((f.heightCm / 2.54) % 12);

  return (
    <div className="space-y-5">
      <Section title="Body" description="Frame, height and skin." icon={<PersonStanding className="h-4 w-4" />}>
        <Slider label="Height" value={f.heightCm} min={145} max={200} onChange={(heightCm) => set({ heightCm })} format={(v) => `${v} cm · ${feet}'${inches}"`} />
        <Segmented label="Build" value={f.build} onChange={(build) => set({ build })} options={BUILDS} />
        <Swatches label="Skin tone" value={f.skinTone} onChange={(skinTone) => set({ skinTone })} swatches={SKIN_TONES} />
        <Segmented label="Skin finish" value={f.skinFinish} onChange={(skinFinish) => set({ skinFinish })} options={SKIN_FINISHES} />
        <Grid>
          <Slider label="Freckles" value={f.freckles} onChange={(freckles) => set({ freckles })} low="None" high="Lots" />
          <Slider label="Blush" value={f.blush} onChange={(blush) => set({ blush })} low="None" high="Rosy" />
        </Grid>
        <Grid>
          <Toggle label="Beauty mark" checked={f.beautyMark} onChange={(beautyMark) => set({ beautyMark })} />
          <Toggle label="Dimples" checked={f.dimples} onChange={(dimples) => set({ dimples })} />
        </Grid>
      </Section>

      <Section title="Face shape & features" icon={<Smile className="h-4 w-4" />}>
        <Segmented label="Face shape" value={f.faceShape} onChange={(faceShape) => set({ faceShape })} options={FACE_SHAPES} />
        <Segmented label="Nose" value={f.noseShape} onChange={(noseShape) => set({ noseShape })} options={NOSES} />
        <Segmented label="Lips" value={f.lipShape} onChange={(lipShape) => set({ lipShape })} options={LIP_SHAPES} />
        <Swatches label="Lip colour" value={f.lipColor} onChange={(lipColor) => set({ lipColor })} swatches={LIP_COLORS} />
        {persona.identity.presentation !== "feminine" && (
          <Segmented label="Facial hair" value={f.facialHair} onChange={(facialHair) => set({ facialHair })} options={FACIAL_HAIR} />
        )}
      </Section>

      <Section title="Eyes & brows" description="Optic colours include glowing synthetic irises." icon={<Eye className="h-4 w-4" />}>
        <Segmented label="Eye shape" value={f.eyeShape} onChange={(eyeShape) => set({ eyeShape })} options={EYE_SHAPES} />
        <Swatches label="Eye colour" value={f.eyeColor} onChange={(eyeColor) => set({ eyeColor })} swatches={EYE_COLORS} />
        <Toggle
          label="Heterochromia"
          description="A different colour for each eye"
          checked={f.heterochromia}
          onChange={(heterochromia) => set({ heterochromia })}
        />
        {f.heterochromia && <Swatches label="Second eye colour" value={f.eyeColor2} onChange={(eyeColor2) => set({ eyeColor2 })} swatches={EYE_COLORS} />}
        <Segmented label="Lashes" value={f.lashes} onChange={(lashes) => set({ lashes })} options={LASHES} />
        <Segmented label="Brows" value={f.brows} onChange={(brows) => set({ brows })} options={BROWS} />
        <Toggle label="Match brows to hair" checked={f.browMatchHair} onChange={(browMatchHair) => set({ browMatchHair })} />
        {!f.browMatchHair && <Swatches label="Brow colour" value={f.browColor} onChange={(browColor) => set({ browColor })} swatches={NATURAL_HAIR} />}
      </Section>

      <Section title="Makeup" icon={<Palette className="h-4 w-4" />}>
        <Segmented value={f.makeup} onChange={(makeup) => set({ makeup })} options={MAKEUP} />
      </Section>
    </div>
  );
}
