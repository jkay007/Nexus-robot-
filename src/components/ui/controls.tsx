import { useId, type ReactNode } from "react";
import { Check, Pipette } from "lucide-react";
import type { Option, Swatch } from "@/data/options";
import { luminance } from "@/lib/color";
import { cn } from "@/lib/cn";

/* ---------- Layout ---------- */

export function Section({
  title,
  description,
  icon,
  children,
  aside,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-forge-700/70 bg-forge-900/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur sm:p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {icon && (
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-forge-800 text-neon-pink">{icon}</span>
          )}
          <div>
            <h3 className="font-display text-base font-semibold text-white">{title}</h3>
            {description && <p className="mt-0.5 text-sm text-forge-300">{description}</p>}
          </div>
        </div>
        {aside}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-forge-200">
          {label}
        </label>
        {hint && <span className="text-xs text-forge-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function Grid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  return <div className={cn("grid gap-5", cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3")}>{children}</div>;
}

/* ---------- Inputs ---------- */

const inputClass =
  "w-full rounded-xl border border-forge-700 bg-forge-950/60 px-3 py-2 text-sm text-white placeholder:text-forge-500 outline-none transition focus:border-neon-pink/70 focus:ring-2 focus:ring-neon-pink/20";

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
  maxLength = 80,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  maxLength?: number;
  type?: "text" | "time" | "date";
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        type={type}
        className={cn(inputClass, type !== "text" && "[color-scheme:dark]")}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  maxLength = 1200,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}) {
  const id = useId();
  return (
    <Field label={label} hint={`${value.length}/${maxLength}`} htmlFor={id}>
      <textarea
        id={id}
        className={cn(inputClass, "resize-y leading-relaxed")}
        value={value}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | Option)[];
  hint?: string;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <select id={id} className={cn(inputClass, "[color-scheme:dark]")} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </Field>
  );
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  low,
  high,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  low?: string;
  high?: string;
  format?: (v: number) => string;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-forge-200">
          {label}
        </label>
        <span className="font-mono text-xs tabular-nums text-neon-cyan">{format ? format(value) : value}</span>
      </div>
      <input
        id={id}
        type="range"
        className="nx-range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ ["--pct" as string]: `${pct}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {(low || high) && (
        <div className="flex justify-between text-[11px] text-forge-400">
          <span>{low}</span>
          <span>{high}</span>
        </div>
      )}
    </div>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
  locked,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  locked?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={locked}
      onClick={() => !locked && onChange?.(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-xl border px-3.5 py-3 text-left transition",
        checked ? "border-neon-pink/40 bg-neon-pink/5" : "border-forge-700 bg-forge-950/40 hover:border-forge-500",
        locked && "cursor-not-allowed",
      )}
    >
      <span>
        <span className="flex items-center gap-2 text-sm font-medium text-white">
          {label}
          {locked && <span className="rounded bg-forge-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-forge-200">Always on</span>}
        </span>
        {description && <span className="mt-0.5 block text-xs text-forge-300">{description}</span>}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition",
          checked ? "bg-gradient-to-r from-neon-pink to-neon-violet" : "bg-forge-700",
        )}
      >
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
      </span>
    </button>
  );
}

/* ---------- Choice controls ---------- */

export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label?: string;
  value: T;
  onChange: (v: T) => void;
  options: Option[];
  hint?: string;
}) {
  const body = (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.hint}
            onClick={() => onChange(o.value as T)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm transition",
              active
                ? "border-neon-pink/70 bg-neon-pink/15 text-white shadow-glow"
                : "border-forge-700 bg-forge-950/40 text-forge-200 hover:border-forge-500 hover:text-white",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
  return label ? (
    <Field label={label} hint={hint}>
      {body}
    </Field>
  ) : (
    body
  );
}

export function OptionCards<T extends string>({
  label,
  value,
  onChange,
  options,
  cols = 2,
}: {
  label?: string;
  value: T;
  onChange: (v: T) => void;
  options: Option[];
  cols?: 2 | 3;
}) {
  const body = (
    <div role="radiogroup" aria-label={label} className={cn("grid gap-2", cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value as T)}
            className={cn(
              "rounded-xl border p-3 text-left transition",
              active ? "border-neon-pink/70 bg-neon-pink/10 shadow-glow" : "border-forge-700 bg-forge-950/40 hover:border-forge-500",
            )}
          >
            <span className="flex items-center justify-between text-sm font-medium text-white">
              {o.label}
              {active && <Check className="h-4 w-4 text-neon-pink" />}
            </span>
            {o.hint && <span className="mt-1 block text-xs text-forge-300">{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
  return label ? <Field label={label}>{body}</Field> : body;
}

export function Chips({
  label,
  values,
  onChange,
  options,
  max,
  hint,
}: {
  label?: string;
  values: string[];
  onChange: (v: string[]) => void;
  options: (string | Option)[];
  max?: number;
  hint?: string;
}) {
  const toggle = (v: string) => {
    if (values.includes(v)) onChange(values.filter((x) => x !== v));
    else if (!max || values.length < max) onChange([...values, v]);
  };
  const body = (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        const active = values.includes(opt.value);
        const disabled = !active && !!max && values.length >= max;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            disabled={disabled}
            title={opt.hint}
            onClick={() => toggle(opt.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition",
              active
                ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan"
                : "border-forge-700 bg-forge-950/40 text-forge-200 hover:border-forge-500 hover:text-white",
              disabled && "cursor-not-allowed opacity-40",
            )}
          >
            {active && <Check className="-ml-0.5 mr-1 inline h-3 w-3" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
  const fullHint = hint ?? (max ? `${values.length}/${max}` : `${values.length} selected`);
  return label ? (
    <Field label={label} hint={fullHint}>
      {body}
    </Field>
  ) : (
    body
  );
}

export function Swatches({
  label,
  value,
  onChange,
  swatches,
  allowCustom = true,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  swatches: Swatch[];
  allowCustom?: boolean;
}) {
  const id = useId();
  const current = swatches.find((s) => s.hex.toLowerCase() === value.toLowerCase());
  return (
    <Field label={label} hint={current?.name ?? value.toUpperCase()}>
      <div className="flex flex-wrap items-center gap-2">
        {swatches.map((s) => {
          const active = s.hex.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={s.hex + s.name}
              type="button"
              title={s.name}
              aria-label={s.name}
              aria-pressed={active}
              onClick={() => onChange(s.hex)}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full border-2 transition hover:scale-110",
                active ? "border-white ring-2 ring-neon-pink/60" : "border-forge-700",
              )}
              style={{ background: s.hex }}
            >
              {active && <Check className={cn("h-4 w-4", luminance(s.hex) > 0.5 ? "text-black" : "text-white")} />}
            </button>
          );
        })}
        {allowCustom && (
          <label
            htmlFor={id}
            title="Custom colour"
            className="relative grid h-8 w-8 cursor-pointer place-items-center rounded-full border-2 border-dashed border-forge-500 text-forge-200 transition hover:border-neon-cyan hover:text-neon-cyan"
            style={current ? undefined : { background: value, borderStyle: "solid", borderColor: "#fff" }}
          >
            <Pipette className={cn("h-3.5 w-3.5", !current && (luminance(value) > 0.5 ? "text-black" : "text-white"))} />
            <input id={id} type="color" className="absolute inset-0 cursor-pointer opacity-0" value={value} onChange={(e) => onChange(e.target.value)} />
          </label>
        )}
      </div>
    </Field>
  );
}
