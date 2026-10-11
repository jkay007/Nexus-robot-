import { BatteryCharging, Bot, Fingerprint, Wifi, Wrench } from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { Chips, OptionCards, Section, Segmented, Slider } from "@/components/ui/controls";
import { BATTERY, CHARGING, CONNECTIVITY, FORMS, MOBILITY, SENSES, SKILLS } from "@/data/options";
import type { AbilitiesConfig } from "@/types/persona";

export function AbilitiesStep() {
  const { persona, update } = usePersona();
  const a = persona.abilities;
  const set = (patch: Partial<AbilitiesConfig>) => update("abilities", patch);
  const physical = a.form !== "app-only" && a.form !== "hologram";

  return (
    <div className="space-y-5">
      <Section title="Form factor" description="From a voice in your pocket to a life-size companion." icon={<Bot className="h-4 w-4" />}>
        <OptionCards
          value={a.form}
          onChange={(form) => set({ form, mobility: form === "full-body" ? a.mobility : "stationary" })}
          options={FORMS}
        />
        {a.form === "full-body" && <Segmented label="Mobility" value={a.mobility} onChange={(mobility) => set({ mobility })} options={MOBILITY} />}
        {physical && (
          <Slider label="Facial expressiveness" value={a.expressiveness} onChange={(expressiveness) => set({ expressiveness })} low="Subtle" high="Full range" />
        )}
      </Section>

      <Section title="Senses & lifelike touches" description="Blinking and breathing show live in the preview." icon={<Fingerprint className="h-4 w-4" />}>
        <Chips values={a.senses} onChange={(senses) => set({ senses })} options={physical ? SENSES : SENSES.filter((s) => ["face-recognition", "emotion-detection", "voice-id", "blinking", "breathing", "micro-expressions", "eye-tracking"].includes(s.value))} />
        {physical && a.senses.includes("warm-skin") && (
          <Slider label="Skin temperature" value={a.skinTemperature} min={30} max={37} step={0.5} onChange={(skinTemperature) => set({ skinTemperature })} format={(v) => `${v} °C`} low="Cool" high="Body warm" />
        )}
      </Section>

      <Section title="Skills" description="Everyday abilities and things to do together." icon={<Wrench className="h-4 w-4" />}>
        <Chips values={a.skills} onChange={(skills) => set({ skills })} options={SKILLS} />
      </Section>

      {physical && (
        <Section title="Power" icon={<BatteryCharging className="h-4 w-4" />}>
          <OptionCards value={a.batteryTier} onChange={(batteryTier) => set({ batteryTier })} options={BATTERY} cols={3} />
          <Segmented label="Charging" value={a.charging} onChange={(charging) => set({ charging })} options={CHARGING} />
        </Section>
      )}

      <Section title="Connectivity" icon={<Wifi className="h-4 w-4" />}>
        <Chips values={a.connectivity} onChange={(connectivity) => set({ connectivity })} options={CONNECTIVITY} />
      </Section>
    </div>
  );
}
