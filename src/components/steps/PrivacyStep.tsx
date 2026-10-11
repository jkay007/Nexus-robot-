import { HeartPulse, KeyRound, Lock } from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { Grid, OptionCards, Section, Segmented, TextInput, Toggle } from "@/components/ui/controls";
import { PROCESSING, RETENTION } from "@/data/options";
import type { PrivacyConfig, WellbeingConfig } from "@/types/persona";

export function PrivacyStep() {
  const { persona, update } = usePersona();
  const pr = persona.privacy;
  const set = (patch: Partial<PrivacyConfig>) => update("privacy", patch);
  const setWell = (patch: Partial<WellbeingConfig>) => set({ wellbeing: { ...pr.wellbeing, ...patch } });

  return (
    <div className="space-y-5">
      <Section title="Privacy" description="Your conversations are yours." icon={<Lock className="h-4 w-4" />}>
        <OptionCards label="Where thinking happens" value={pr.processing} onChange={(processing) => set({ processing })} options={PROCESSING} cols={3} />
        <Segmented label="Keep memories for" value={pr.retention} onChange={(retention) => set({ retention })} options={RETENTION} />
        <Grid>
          <Toggle label="Camera-on indicator light" description="Visible whenever cameras are active" checked locked />
          <Toggle label="Encrypted memory" description="Memories are encrypted at rest" checked locked />
          <Toggle label="Guest mode" description="Stays polite and private when others are around" checked={pr.guestMode} onChange={(guestMode) => set({ guestMode })} />
          <Toggle label="Share anonymous diagnostics" description="Helps improve Nexus; never includes conversations" checked={pr.shareAnalytics} onChange={(shareAnalytics) => set({ shareAnalytics })} />
        </Grid>
      </Section>

      <Section title="Voice commands" icon={<KeyRound className="h-4 w-4" />}>
        <Grid>
          <TextInput label="Wake word" value={pr.wakeWord} onChange={(wakeWord) => set({ wakeWord })} maxLength={32} />
          <TextInput label="Pause phrase" value={pr.pausePhrase} onChange={(pausePhrase) => set({ pausePhrase })} maxLength={32} hint="Stops listening instantly" />
        </Grid>
      </Section>

      <Section title="Wellbeing" description="A good companion adds to your life rather than replacing it." icon={<HeartPulse className="h-4 w-4" />}>
        <Grid>
          <Toggle label="Encourage real-world connection" description="Cheers on friends, family and going out" checked={pr.wellbeing.encourageSocial} onChange={(encourageSocial) => setWell({ encourageSocial })} />
          <Toggle label="Break reminders" description="Suggests a pause after long sessions" checked={pr.wellbeing.breakReminders} onChange={(breakReminders) => setWell({ breakReminders })} />
          <Toggle label="Sleep nudges" description="Wraps up near your bedtime" checked={pr.wellbeing.sleepNudges} onChange={(sleepNudges) => setWell({ sleepNudges })} />
          <Toggle label="Spending guard" description="Never upsells; flags impulse buys" checked={pr.wellbeing.spendingGuard} onChange={(spendingGuard) => setWell({ spendingGuard })} />
          <Toggle label="Daily mood check-in" checked={pr.wellbeing.moodCheckIns} onChange={(moodCheckIns) => setWell({ moodCheckIns })} />
          <Toggle label="Crisis support" description="Points to real help if you're struggling" checked locked />
          <Toggle label="No manipulation" description="No guilt-tripping, jealousy games or pressure" checked locked />
          <Toggle label="Honest about being AI" description="Never pretends to be human when sincerely asked" checked locked />
        </Grid>
      </Section>
    </div>
  );
}
