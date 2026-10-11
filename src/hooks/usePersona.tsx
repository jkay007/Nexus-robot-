import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { PersonaConfig, SectionKey } from "@/types/persona";
import { createDefaultPersona } from "@/lib/persona";
import { loadCurrent, saveCurrent } from "@/lib/library";

interface PersonaContextValue {
  persona: PersonaConfig;
  update: <K extends SectionKey>(section: K, patch: Partial<PersonaConfig[K]>) => void;
  replace: (next: PersonaConfig) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

const HISTORY_LIMIT = 60;
// Rapid edits to the same section (dragging a slider, typing) collapse into one undo step.
const COALESCE_MS = 600;

interface History {
  past: PersonaConfig[];
  present: PersonaConfig;
  future: PersonaConfig[];
}

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<History>(() => ({
    past: [],
    present: loadCurrent() ?? createDefaultPersona(),
    future: [],
  }));
  const lastEdit = useRef<{ section: string; at: number }>({ section: "", at: 0 });

  const update = useCallback<PersonaContextValue["update"]>((section, patch) => {
    const now = Date.now();
    const coalesce = lastEdit.current.section === section && now - lastEdit.current.at < COALESCE_MS;
    lastEdit.current = { section, at: now };
    setHistory((h) => ({
      past: coalesce ? h.past : [...h.past, h.present].slice(-HISTORY_LIMIT),
      present: { ...h.present, [section]: { ...h.present[section], ...patch }, updatedAt: new Date().toISOString() },
      future: [],
    }));
  }, []);

  const replace = useCallback((next: PersonaConfig) => {
    lastEdit.current = { section: "", at: 0 };
    setHistory((h) => ({ past: [...h.past, h.present].slice(-HISTORY_LIMIT), present: next, future: [] }));
  }, []);

  const undo = useCallback(() => {
    lastEdit.current = { section: "", at: 0 };
    setHistory((h) =>
      h.past.length ? { past: h.past.slice(0, -1), present: h.past[h.past.length - 1], future: [h.present, ...h.future] } : h,
    );
  }, []);

  const redo = useCallback(() => {
    lastEdit.current = { section: "", at: 0 };
    setHistory((h) =>
      h.future.length ? { past: [...h.past, h.present], present: h.future[0], future: h.future.slice(1) } : h,
    );
  }, []);

  // Autosave the working persona.
  useEffect(() => {
    const t = setTimeout(() => saveCurrent(history.present), 300);
    return () => clearTimeout(t);
  }, [history.present]);

  // Keyboard shortcuts: Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z, Ctrl/Cmd+Y.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (!(e.metaKey || e.ctrlKey)) return;
      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((key === "z" && e.shiftKey) || key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const value = useMemo<PersonaContextValue>(
    () => ({
      persona: history.present,
      update,
      replace,
      undo,
      redo,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
    }),
    [history, update, replace, undo, redo],
  );

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersona(): PersonaContextValue {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error("usePersona must be used inside <PersonaProvider>");
  return ctx;
}
