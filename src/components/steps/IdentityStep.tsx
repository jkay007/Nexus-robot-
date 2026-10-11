import { BadgeCheck, BookUser, Fingerprint } from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { Grid, Section, Segmented, Select, Slider, TextArea, TextInput } from "@/components/ui/controls";
import { HERITAGES, MBTI_TYPES, PRESENTATIONS, PRONOUNS } from "@/data/options";
import { MAX_PERSONA_AGE, MIN_PERSONA_AGE } from "@/lib/persona";
import type { Presentation } from "@/types/persona";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ZODIAC: [string, number, number][] = [
  ["Capricorn", 1, 19], ["Aquarius", 2, 18], ["Pisces", 3, 20], ["Aries", 4, 19], ["Taurus", 5, 20], ["Gemini", 6, 20],
  ["Cancer", 7, 22], ["Leo", 8, 22], ["Virgo", 9, 22], ["Libra", 10, 22], ["Scorpio", 11, 21], ["Sagittarius", 12, 21],
];

function zodiac(mmdd: string): string {
  const [m, d] = mmdd.split("-").map(Number);
  if (!m || !d) return "";
  const sign = ZODIAC.find(([, month, last]) => month === m && d <= last);
  if (sign) return sign[0];
  return m === 12 ? "Capricorn" : ZODIAC[m][0];
}

export function IdentityStep() {
  const { persona, update } = usePersona();
  const id = persona.identity;
  const set = (patch: Partial<typeof id>) => update("identity", patch);
  const [bm, bd] = id.birthday.split("-");

  const setPresentation = (presentation: Presentation) => {
    const pronouns = presentation === "masculine" ? "he/him" : presentation === "androgynous" ? "they/them" : "she/her";
    set({ presentation, pronouns });
    if (presentation === "feminine") update("faceBody", { facialHair: "none" });
  };

  return (
    <div className="space-y-5">
      <Section title="Name & identity" description="Who your companion is. Everything else builds on this." icon={<Fingerprint className="h-4 w-4" />}>
        <Grid>
          <TextInput label="Name" value={id.name} onChange={(name) => set({ name })} placeholder="e.g. Aria" maxLength={32} />
          <TextInput label="Nickname" value={id.nickname} onChange={(nickname) => set({ nickname })} placeholder="Optional" maxLength={24} />
        </Grid>
        <Segmented label="Presentation" value={id.presentation} onChange={setPresentation} options={PRESENTATIONS} />
        <Grid>
          <Select label="Pronouns" value={id.pronouns} onChange={(pronouns) => set({ pronouns })} options={PRONOUNS} />
          <Select label="Personality type" value={id.mbti} onChange={(mbti) => set({ mbti })} options={MBTI_TYPES} hint="MBTI-style" />
        </Grid>
        <Slider
          label="Apparent age"
          value={id.apparentAge}
          min={MIN_PERSONA_AGE}
          max={MAX_PERSONA_AGE}
          onChange={(apparentAge) => set({ apparentAge })}
          low={`${MIN_PERSONA_AGE} — adults only`}
          high={`${MAX_PERSONA_AGE}`}
        />
        <p className="flex items-center gap-2 rounded-lg bg-forge-800/60 px-3 py-2 text-xs text-forge-300">
          <BadgeCheck className="h-4 w-4 shrink-0 text-neon-cyan" />
          Every Nexus persona is an adult. The age limit is enforced on every build, import and share code.
        </p>
      </Section>

      <Section title="Background" description="A backstory gives conversations depth and memories to draw on." icon={<BookUser className="h-4 w-4" />}>
        <Grid>
          <Select label="Heritage" value={id.heritage} onChange={(heritage) => set({ heritage })} options={HERITAGES} />
          <TextInput label="Hometown" value={id.hometown} onChange={(hometown) => set({ hometown })} placeholder="e.g. Kyrenia" />
          <TextInput label="Occupation (backstory)" value={id.occupation} onChange={(occupation) => set({ occupation })} placeholder="e.g. Art curator" />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Birthday"
              value={bm ?? "01"}
              onChange={(m) => set({ birthday: `${m}-${bd ?? "01"}` })}
              options={MONTHS.map((label, i) => ({ value: String(i + 1).padStart(2, "0"), label }))}
            />
            <Select
              label="Day"
              hint={zodiac(id.birthday)}
              value={bd ?? "01"}
              onChange={(d) => set({ birthday: `${bm ?? "01"}-${d}` })}
              options={Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"))}
            />
          </div>
        </Grid>
        <TextArea
          label="Backstory"
          value={id.backstory}
          onChange={(backstory) => set({ backstory })}
          placeholder="Where did they grow up? What do they love? What's a story they'd tell on a first date?"
        />
        <TextInput
          label="What should they call you?"
          value={id.userName}
          onChange={(userName) => set({ userName })}
          placeholder="Your name or nickname"
          hint="Stays on this device"
          maxLength={32}
        />
      </Section>
    </div>
  );
}
