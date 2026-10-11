import { describe, expect, it } from "vitest";
import { pickDeviceVoice } from "../speech";
import { getAccent } from "@/data/voices";

const v = (name: string, lang: string) => ({ name, lang, default: false, localService: true, voiceURI: name }) as SpeechSynthesisVoice;

const VOICES = [
  v("Samantha", "en-US"),
  v("Alex", "en-US"),
  v("Daniel", "en-GB"),
  v("Serena", "en-GB"),
  v("Moira", "en-IE"),
  v("Karen", "en-AU"),
  v("Yelda", "tr-TR"),
];

describe("pickDeviceVoice", () => {
  it("matches accent language and voice gender", () => {
    expect(pickDeviceVoice(VOICES, getAccent("british-rp"), "female")?.name).toBe("Serena");
    expect(pickDeviceVoice(VOICES, getAccent("british-rp"), "male")?.name).toBe("Daniel");
    expect(pickDeviceVoice(VOICES, getAccent("irish"), "female")?.name).toBe("Moira");
    expect(pickDeviceVoice(VOICES, getAccent("australian"), "female")?.name).toBe("Karen");
    expect(pickDeviceVoice(VOICES, getAccent("turkish"), "female")?.name).toBe("Yelda");
  });

  it("honours an explicit device voice override", () => {
    expect(pickDeviceVoice(VOICES, getAccent("british-rp"), "female", "Alex")?.name).toBe("Alex");
  });

  it("falls back to an English voice when the language is missing", () => {
    const picked = pickDeviceVoice(VOICES, getAccent("japanese"), "female");
    expect(picked?.lang.startsWith("en")).toBe(true);
  });
});
