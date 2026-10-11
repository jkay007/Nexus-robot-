import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { loadDeviceVoices, speakAsPersona, speechSupported, type SpeakHandle } from "@/lib/speech";
import { usePersona } from "./usePersona";
import type { PersonaConfig } from "@/types/persona";

interface SpeechContextValue {
  supported: boolean;
  voices: SpeechSynthesisVoice[];
  speaking: boolean;
  /** Speaks as the current persona, or as `override` (used to audition presets and accents). */
  speak: (text: string, override?: PersonaConfig) => void;
  stop: () => void;
}

const SpeechContext = createContext<SpeechContextValue | null>(null);

export function SpeechProvider({ children }: { children: ReactNode }) {
  const { persona } = usePersona();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const handle = useRef<SpeakHandle | null>(null);

  useEffect(() => {
    let alive = true;
    void loadDeviceVoices().then((v) => alive && setVoices(v));
    if (!speechSupported) return;
    const refresh = () => setVoices(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener("voiceschanged", refresh);
    return () => {
      alive = false;
      window.speechSynthesis.removeEventListener("voiceschanged", refresh);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string, override?: PersonaConfig) => {
      handle.current = speakAsPersona(text, override ?? persona, voices, {
        onStart: () => setSpeaking(true),
        onEnd: () => setSpeaking(false),
      });
    },
    [persona, voices],
  );

  const stop = useCallback(() => {
    handle.current?.stop();
    setSpeaking(false);
  }, []);

  const value = useMemo(() => ({ supported: speechSupported, voices, speaking, speak, stop }), [voices, speaking, speak, stop]);
  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
}

export function useSpeech(): SpeechContextValue {
  const ctx = useContext(SpeechContext);
  if (!ctx) throw new Error("useSpeech must be used inside <SpeechProvider>");
  return ctx;
}
