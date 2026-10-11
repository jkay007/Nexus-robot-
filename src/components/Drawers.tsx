import { useEffect, useState, type ReactNode } from "react";
import { Copy, FolderOpen, Save, Trash2, X } from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { Avatar } from "@/components/avatar/Avatar";
import { PRESETS } from "@/data/presets";
import { loadLibrary, saveLibrary } from "@/lib/library";
import { createDefaultPersona, newId } from "@/lib/persona";
import type { PersonaConfig } from "@/types/persona";

export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="nx-scroll relative h-full w-full max-w-md overflow-y-auto border-l border-forge-700 bg-forge-900 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PresetsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { replace } = usePersona();
  return (
    <Drawer open={open} onClose={onClose} title="Start from a preset">
      <p className="mb-4 text-sm text-forge-300">Pick a starting point, then customise every detail. Your current build stays in history (undo).</p>
      <div className="grid grid-cols-2 gap-3">
        {PRESETS.map((p) => {
          const persona = p.build();
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                replace(p.build());
                onClose();
              }}
              className="overflow-hidden rounded-2xl border border-forge-700 bg-forge-950/40 text-left transition hover:border-neon-pink/60 hover:shadow-glow"
            >
              <Avatar persona={persona} animate={false} crop="head" className="h-36 w-full" />
              <div className="p-2.5">
                <p className="text-sm font-semibold text-white">{p.title}</p>
                <p className="text-xs text-forge-300">{p.tagline}</p>
              </div>
            </button>
          );
        })}
      </div>
    </Drawer>
  );
}

/** Copies a saved persona. Voice samples belong to the original, so the copy starts without a clone. */
function duplicate(item: PersonaConfig): PersonaConfig {
  return {
    ...item,
    id: newId(),
    updatedAt: new Date().toISOString(),
    identity: { ...item.identity, name: `${item.identity.name} copy` },
    voice: { ...item.voice, source: "library", clone: createDefaultPersona().voice.clone },
  };
}

export function LibraryDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { persona, replace } = usePersona();
  const [items, setItems] = useState<PersonaConfig[]>([]);

  useEffect(() => {
    if (open) setItems(loadLibrary());
  }, [open]);

  const persist = (next: PersonaConfig[]) => {
    setItems(next);
    saveLibrary(next);
  };

  const saveCurrent = () => {
    const stamped = { ...persona, updatedAt: new Date().toISOString() };
    const exists = items.some((i) => i.id === persona.id);
    persist(exists ? items.map((i) => (i.id === persona.id ? stamped : i)) : [stamped, ...items]);
  };

  const isSaved = items.some((i) => i.id === persona.id);

  return (
    <Drawer open={open} onClose={onClose} title="My companions">
      <button type="button" className="btn-primary mb-4 w-full" onClick={saveCurrent}>
        <Save className="h-4 w-4" /> {isSaved ? `Update "${persona.identity.name}"` : `Save "${persona.identity.name}"`}
      </button>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-forge-700 p-6 text-center text-sm text-forge-400">
          No saved companions yet. Save builds here to switch between them.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-forge-700 bg-forge-950/40 p-2">
              <Avatar persona={item} animate={false} crop="head" className="h-16 w-14 shrink-0 rounded-xl bg-forge-900" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {item.identity.name}
                  {item.id === persona.id && <span className="ml-2 text-[10px] uppercase text-neon-cyan">editing</span>}
                </p>
                <p className="text-xs text-forge-400">{new Date(item.updatedAt).toLocaleString()}</p>
              </div>
              <button
                type="button"
                className="btn-icon"
                title="Open"
                aria-label={`Open ${item.identity.name}`}
                onClick={() => {
                  replace(item);
                  onClose();
                }}
              >
                <FolderOpen className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="btn-icon"
                title="Duplicate"
                aria-label={`Duplicate ${item.identity.name}`}
                onClick={() => persist([duplicate(item), ...items])}
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="btn-icon hover:text-red-300"
                title="Delete"
                aria-label={`Delete ${item.identity.name}`}
                onClick={() => persist(items.filter((i) => i.id !== item.id))}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
