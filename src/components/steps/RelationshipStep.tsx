import { Brain, CalendarHeart, HeartHandshake, MessageCircleHeart } from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { Chips, Grid, OptionCards, Section, Segmented, Select, Slider, TextInput } from "@/components/ui/controls";
import {
  CONFLICT_STYLES, LANGUAGES, MEMORY_DEPTHS, PET_NAMES, REMEMBERS, RITUALS, ROLES, ROMANCE_LEVELS, STAGES, SUPPORT_STYLES,
} from "@/data/options";
import type { RelationshipConfig } from "@/types/persona";

export function RelationshipStep() {
  const { persona, update } = usePersona();
  const r = persona.relationship;
  const set = (patch: Partial<RelationshipConfig>) => update("relationship", patch);
  const name = persona.identity.name || "Your companion";

  const setLanguages = (languages: string[]) => {
    const next = languages.length ? languages : ["English"];
    set({ languages: next, primaryLanguage: next.includes(r.primaryLanguage) ? r.primaryLanguage : next[0] });
  };

  return (
    <div className="space-y-5">
      <Section title="The relationship" description={`How ${name} relates to you: girlfriend, partner, best friend or companion.`} icon={<HeartHandshake className="h-4 w-4" />}>
        <Segmented label="Role" value={r.role} onChange={(role) => set({ role })} options={ROLES} />
        <Segmented label="Where you are together" value={r.stage} onChange={(stage) => set({ stage })} options={STAGES} />
        <OptionCards label="Romance" value={r.romanceLevel} onChange={(romanceLevel) => set({ romanceLevel })} options={ROMANCE_LEVELS} cols={3} />
        <Grid>
          <Slider label="Affection" value={r.affection} onChange={(affection) => set({ affection })} low="Reserved" high="Very affectionate" />
          <Slider label="Reaches out first" value={r.initiative} onChange={(initiative) => set({ initiative })} low="Waits for you" high="Often" />
        </Grid>
        <Grid>
          <Segmented label="Support style" value={r.supportStyle} onChange={(supportStyle) => set({ supportStyle })} options={SUPPORT_STYLES} />
          <Segmented label="In a disagreement" value={r.conflictStyle} onChange={(conflictStyle) => set({ conflictStyle })} options={CONFLICT_STYLES} />
        </Grid>
      </Section>

      <Section title="How you talk" icon={<MessageCircleHeart className="h-4 w-4" />}>
        <Chips label="Pet names for you" values={r.petNames} onChange={(petNames) => set({ petNames })} options={PET_NAMES} max={4} />
        <TextInput label="Custom pet name" value={r.customPetName} onChange={(customPetName) => set({ customPetName })} placeholder="Something only you two use" maxLength={24} />
        <Grid>
          <Slider label="Emoji use" value={r.emojiUse} onChange={(emojiUse) => set({ emojiUse })} low="Never" high="💖✨🔥" />
          <Slider label="Formality" value={r.formality} onChange={(formality) => set({ formality })} low="Casual" high="Formal" />
        </Grid>
        <Grid>
          <Segmented
            label="Message length"
            value={r.messageLength}
            onChange={(messageLength) => set({ messageLength })}
            options={[
              { value: "short", label: "Short" },
              { value: "balanced", label: "Balanced" },
              { value: "detailed", label: "Detailed" },
            ]}
          />
          <Segmented
            label="Swearing"
            value={r.swearing}
            onChange={(swearing) => set({ swearing })}
            options={[
              { value: "never", label: "Never" },
              { value: "mild", label: "Mild" },
            ]}
          />
        </Grid>
        <Chips label="Languages spoken" values={r.languages} onChange={setLanguages} options={LANGUAGES} max={5} />
        <Select label="Default language" value={r.primaryLanguage} onChange={(primaryLanguage) => set({ primaryLanguage })} options={r.languages} />
      </Section>

      <Section title="Daily rituals" description="Little routines that make it feel like a real relationship." icon={<CalendarHeart className="h-4 w-4" />}>
        <Chips values={r.rituals} onChange={(rituals) => set({ rituals })} options={RITUALS} />
        <Grid cols={3}>
          <TextInput label="You usually wake at" type="time" value={r.wakeTime} onChange={(wakeTime) => set({ wakeTime })} />
          <TextInput label="You usually sleep at" type="time" value={r.sleepTime} onChange={(sleepTime) => set({ sleepTime })} />
          <TextInput label="Anniversary" type="date" value={r.anniversary} onChange={(anniversary) => set({ anniversary })} />
        </Grid>
      </Section>

      <Section title="Memory" description="What they remember about you. You can review and erase memories any time." icon={<Brain className="h-4 w-4" />}>
        <OptionCards value={r.memoryDepth} onChange={(memoryDepth) => set({ memoryDepth })} options={MEMORY_DEPTHS} />
        <Chips label="Remembers" values={r.remembers} onChange={(remembers) => set({ remembers })} options={REMEMBERS} />
      </Section>
    </div>
  );
}
