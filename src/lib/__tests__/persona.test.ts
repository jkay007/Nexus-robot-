import { describe, expect, it } from "vitest";
import { createDefaultPersona, MIN_PERSONA_AGE, sanitizePersona, toShareable } from "../persona";
import { buildPersonaPrompt } from "../prompt";
import { randomise } from "../random";
import { PRESETS } from "@/data/presets";

const withClone = () => {
  const p = createDefaultPersona();
  p.voice.source = "clone";
  p.voice.clone = {
    ...p.voice.clone,
    status: "samples-ready",
    speaker: "self",
    consentConfirmed: true,
    consentAt: "2026-10-01T10:00:00.000Z",
    samples: [{ id: "s1", name: "me.wav", durationSec: 42, source: "upload", peak: 0.8, rms: 0.1, createdAt: "2026-10-01T10:00:00.000Z" }],
  };
  return p;
};

describe("sanitizePersona", () => {
  it("returns a complete default persona for garbage input", () => {
    for (const junk of [null, 42, "x", [], { identity: "nope" }]) {
      const p = sanitizePersona(junk);
      expect(p.identity.name).toBe("Aria");
      expect(p.privacy.wellbeing.crisisSupport).toBe(true);
    }
  });

  it("never allows a persona under the minimum age", () => {
    const p = sanitizePersona({ identity: { apparentAge: 12 } });
    expect(p.identity.apparentAge).toBe(MIN_PERSONA_AGE);
  });

  it("caps romance and swearing at the allowed levels", () => {
    const p = sanitizePersona({ relationship: { romanceLevel: "explicit", swearing: "heavy" } });
    expect(p.relationship.romanceLevel).toBe("sweet");
    expect(p.relationship.swearing).toBe("never");
  });

  it("re-locks safety settings that an import tries to switch off", () => {
    const p = sanitizePersona({
      privacy: { cameraIndicator: false, encryptedMemory: false, wellbeing: { crisisSupport: false, noManipulation: false, honestAboutAI: false } },
    });
    expect(p.privacy.cameraIndicator).toBe(true);
    expect(p.privacy.encryptedMemory).toBe(true);
    expect(p.privacy.wellbeing).toMatchObject({ crisisSupport: true, noManipulation: true, honestAboutAI: true });
  });

  it("rejects non-hex colours and clamps numbers", () => {
    const p = sanitizePersona({ hair: { color: "javascript:alert(1)", length: 900 }, voice: { pitch: -999 } });
    expect(p.hair.color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(p.hair.length).toBe(100);
    expect(p.voice.pitch).toBe(-50);
  });

  it("keeps only string entries in list fields", () => {
    const p = sanitizePersona({ personality: { interests: ["Music", 5, { x: 1 }, "Art"] } });
    expect(p.personality.interests).toEqual(["Music", "Art"]);
  });

  it("drops imported voice-clone consent and samples", () => {
    const p = sanitizePersona(JSON.parse(JSON.stringify(withClone())));
    expect(p.voice.clone.consentConfirmed).toBe(false);
    expect(p.voice.clone.samples).toEqual([]);
    expect(p.voice.source).toBe("library");
  });

  it("keeps this device's own clone data when trusted", () => {
    const p = sanitizePersona(JSON.parse(JSON.stringify(withClone())), { trusted: true });
    expect(p.voice.clone.consentConfirmed).toBe(true);
    expect(p.voice.clone.samples).toHaveLength(1);
    expect(p.voice.clone.samples[0]).toMatchObject({ id: "s1", durationSec: 42, source: "upload" });
  });
});

describe("toShareable", () => {
  it("strips the owner's name and voice clone", () => {
    const p = withClone();
    p.identity.userName = "James";
    const shared = toShareable(p);
    expect(shared.identity.userName).toBe("");
    expect(shared.voice.clone.samples).toEqual([]);
    expect(shared.voice.source).toBe("library");
    expect(p.voice.clone.samples).toHaveLength(1); // original untouched
  });
});

describe("buildPersonaPrompt", () => {
  it("always includes the wellbeing rules", () => {
    const prompt = buildPersonaPrompt(createDefaultPersona());
    expect(prompt).toContain("Never produce sexually explicit content");
    expect(prompt).toContain("be honest that you are an AI");
    expect(prompt).toContain("Samaritans");
  });

  it("reflects accent, name and pet names", () => {
    const p = createDefaultPersona();
    p.identity.userName = "James";
    p.voice.accentId = "scottish";
    const prompt = buildPersonaPrompt(p);
    expect(prompt).toContain("Scottish (Edinburgh)");
    expect(prompt).toContain("Relationship with James");
    expect(prompt).toContain("Love, Darling");
    expect(prompt).not.toMatch(/\n{3,}/);
  });
});

describe("presets and randomiser", () => {
  it("every preset is already a valid, sanitised persona", () => {
    for (const preset of PRESETS) {
      const p = preset.build();
      expect(sanitizePersona(p, { trusted: true })).toEqual(p);
    }
  });

  it("randomise keeps the persona valid and adult", () => {
    for (let i = 0; i < 50; i++) {
      const p = randomise(createDefaultPersona());
      expect(p.identity.apparentAge).toBeGreaterThanOrEqual(MIN_PERSONA_AGE);
      expect(p.privacy.wellbeing.noManipulation).toBe(true);
      expect(p.hair.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
