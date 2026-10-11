import { describe, expect, it } from "vitest";
import { createDefaultPersona } from "../persona";
import { exportJson, fromShareCode, importJson, toShareCode } from "../library";

describe("export / import / share codes", () => {
  it("round-trips a persona through JSON", () => {
    const p = createDefaultPersona();
    p.identity.name = "Zoë";
    p.hair.style = "braids";
    const back = importJson(exportJson(p));
    expect(back.identity.name).toBe("Zoë");
    expect(back.hair.style).toBe("braids");
  });

  it("round-trips through a share code, including non-ASCII text", () => {
    const p = createDefaultPersona();
    p.identity.backstory = "Grew up in Girne — loves çay and 🌊";
    p.relationship.petNames = ["Aşkım"];
    const code = toShareCode(p);
    expect(code.startsWith("NXS1.")).toBe(true);
    expect(code).not.toMatch(/[+/=]/);
    const back = fromShareCode(code);
    expect(back.identity.backstory).toBe(p.identity.backstory);
    expect(back.relationship.petNames).toEqual(["Aşkım"]);
  });

  it("rejects codes that aren't Nexus share codes", () => {
    expect(() => fromShareCode("hello")).toThrow();
    expect(() => importJson("{not json")).toThrow();
  });
});
