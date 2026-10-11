import { useMemo, useState } from "react";
import { Check, ClipboardCopy, Download, FileJson, Printer, QrCode, ScrollText, Share2, Upload } from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { Section } from "@/components/ui/controls";
import { specSections } from "@/lib/describe";
import { buildPersonaPrompt } from "@/lib/prompt";
import { exportJson, fromShareCode, importJson, toShareCode } from "@/lib/library";

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch {
      setCopied(null);
    }
  };
  return { copied, copy };
}

function download(filename: string, text: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ReviewStep() {
  const { persona, replace } = usePersona();
  const { copied, copy } = useCopy();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const prompt = useMemo(() => buildPersonaPrompt(persona), [persona]);
  const sections = useMemo(() => specSections(persona), [persona]);
  const slug = (persona.identity.name || "nexus").toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const load = (fn: () => ReturnType<typeof importJson>, label: string) => {
    try {
      replace(fn());
      setMessage({ ok: true, text: `${label} loaded.` });
    } catch {
      setMessage({ ok: false, text: `That ${label.toLowerCase()} couldn't be read.` });
    }
  };

  const onImport = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setMessage({ ok: false, text: "Persona files are small. That one is over 1 MB." });
      return;
    }
    const text = await file.text();
    load(() => importJson(text), "Persona file");
  };

  return (
    <div className="space-y-5">
      <Section title="Spec sheet" description="Everything that goes into the build." icon={<ScrollText className="h-4 w-4" />}>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((s) => (
            <div key={s.title} className="rounded-xl border border-forge-700 bg-forge-950/40 p-3">
              <h4 className="mb-2 font-display text-sm font-semibold text-white">{s.title}</h4>
              <dl className="space-y-1 text-xs">
                {s.rows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[7rem_1fr] gap-2">
                    <dt className="text-forge-400">{k}</dt>
                    <dd className="text-forge-200">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="AI persona prompt"
        description="Paste into any conversational AI to bring this personality to life, or hand it to the Nexus brain."
        icon={<FileJson className="h-4 w-4" />}
        aside={
          <button type="button" className="btn-ghost shrink-0" onClick={() => void copy("prompt", prompt)}>
            {copied === "prompt" ? <Check className="h-4 w-4 text-emerald-400" /> : <ClipboardCopy className="h-4 w-4" />}
            {copied === "prompt" ? "Copied" : "Copy"}
          </button>
        }
      >
        <pre className="nx-scroll max-h-80 overflow-auto whitespace-pre-wrap rounded-xl border border-forge-700 bg-forge-950/80 p-4 font-mono text-xs leading-relaxed text-forge-200">
          {prompt}
        </pre>
      </Section>

      <Section title="Export, import & share" icon={<Share2 className="h-4 w-4" />}>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={() => download(`${slug}.nexus.json`, exportJson(persona))}>
            <Download className="h-4 w-4" /> Download persona file
          </button>
          <label className="btn-ghost cursor-pointer">
            <Upload className="h-4 w-4" /> Import file
            <input type="file" accept=".json,application/json" className="hidden" onChange={(e) => (void onImport(e.target.files), (e.target.value = ""))} />
          </label>
          <button type="button" className="btn-ghost" onClick={() => void copy("code", toShareCode(persona))}>
            {copied === "code" ? <Check className="h-4 w-4 text-emerald-400" /> : <QrCode className="h-4 w-4" />}
            {copied === "code" ? "Share code copied" : "Copy share code"}
          </button>
          <button type="button" className="btn-ghost" onClick={() => download(`${slug}-prompt.txt`, prompt, "text/plain")}>
            <FileJson className="h-4 w-4" /> Download prompt
          </button>
          <button type="button" className="btn-ghost no-print" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print spec
          </button>
        </div>
        <div className="flex gap-2">
          <input
            className="w-full rounded-xl border border-forge-700 bg-forge-950/60 px-3 py-2 font-mono text-xs text-white placeholder:text-forge-500 outline-none focus:border-neon-pink/70"
            placeholder="Paste a share code (NXS1.…)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="button" className="btn-ghost shrink-0" disabled={!code.trim()} onClick={() => load(() => fromShareCode(code), "Share code")}>
            Load
          </button>
        </div>
        {message && <p className={message.ok ? "text-sm text-emerald-300" : "text-sm text-amber-300"}>{message.text}</p>}
        <p className="text-xs text-forge-400">
          Exports and share codes never include your voice samples, voice-clone consent or your own name. Those stay on this device.
        </p>
      </Section>
    </div>
  );
}
