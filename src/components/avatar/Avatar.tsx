import { useId } from "react";
import type { ChassisFinish, PersonaConfig, Realism } from "@/types/persona";
import { mix, shade } from "@/lib/color";
import { HairBack, HairFront, type HairPaint } from "./Hair";
import { Brows, Circuitry, Eye, FACE_PATHS, FacialHair, Freckles, Lips, Makeup, Nose, Seams, SkinFinish } from "./Face";
import { CoreLight, Hood, OutfitLayer, Shoulders, Tattoos } from "./Body";
import { Earrings, Ears, Halo, HeadAccessories, NeckAccessories } from "./Accessories";

const REALISM_GLOW: Record<Realism, number> = {
  "hyper-real": 0,
  "subtle-synthetic": 0.35,
  "stylised-android": 0.7,
  "full-cyborg": 1,
};

export const CHASSIS_HEX: Record<ChassisFinish, string> = {
  pearl: "#eceaf3",
  "porcelain-white": "#f7f7fa",
  chrome: "#c8ccd6",
  "rose-gold": "#e2a796",
  "matte-black": "#26242c",
  carbon: "#34353d",
};

/** Filters shared by every avatar on the page. Render once near the app root. */
export function AvatarDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <filter id="nx-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="nx-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
        <filter id="nx-holo">
          <feColorMatrix type="matrix" values="0.25 0.25 0.25 0 0.05  0.35 0.45 0.45 0 0.2  0.45 0.55 0.6 0 0.32  0 0 0 0.82 0" />
        </filter>
      </defs>
    </svg>
  );
}

function hairStops(mode: PersonaConfig["hair"]["colorMode"], base: string, second: string, part: "front" | "back") {
  switch (mode) {
    case "ombre":
      return { dir: "v", stops: [[0, base], [0.45, base], [1, second]] as [number, string][] };
    case "balayage":
      return { dir: "v", stops: [[0, shade(base, -0.1)], [0.35, base], [0.75, mix(base, second, 0.7)], [1, second]] as [number, string][] };
    case "highlights": {
      const stops: [number, string][] = [];
      for (let i = 0; i <= 16; i++) stops.push([i / 16, mix(base, second, 0.65 * Math.max(0, Math.sin(i * 1.9)) ** 2)]);
      return { dir: "h", stops };
    }
    case "split":
      return { dir: "h", stops: [[0, base], [0.5, base], [0.5, second], [1, second]] as [number, string][] };
    case "peekaboo":
      return part === "back"
        ? { dir: "v", stops: [[0, base], [0.4, base], [0.55, second], [1, second]] as [number, string][] }
        : { dir: "v", stops: [[0, shade(base, 0.15)], [0.5, base], [1, shade(base, -0.2)]] as [number, string][] };
    default:
      return { dir: "v", stops: [[0, shade(base, 0.15)], [0.5, base], [1, shade(base, -0.2)]] as [number, string][] };
  }
}

function HairGradient({ id, persona, part }: { id: string; persona: PersonaConfig; part: "front" | "back" }) {
  const { colorMode, color, secondaryColor } = persona.hair;
  const g = hairStops(colorMode, color, secondaryColor, part);
  const coords = g.dir === "v" ? { x1: 0, y1: 60, x2: 0, y2: 390 } : { x1: 70, y1: 0, x2: 250, y2: 0 };
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" {...coords}>
      {g.stops.map(([o, c], i) => (
        <stop key={i} offset={o} stopColor={c} />
      ))}
    </linearGradient>
  );
}

export function Avatar({
  persona,
  speaking = false,
  className,
  animate = true,
  title,
  crop = "bust",
}: {
  persona: PersonaConfig;
  speaking?: boolean;
  className?: string;
  animate?: boolean;
  title?: string;
  /** "head" zooms in for thumbnails. */
  crop?: "bust" | "head";
}) {
  const uid = useId().replace(/:/g, "");
  const ids = {
    hairFront: `${uid}-hf`,
    hairBack: `${uid}-hb`,
    strands: `${uid}-st`,
    curls: `${uid}-cu`,
    face: `${uid}-face`,
    body: `${uid}-body`,
    neck: `${uid}-neck`,
    bg: `${uid}-bg`,
    chassis: `${uid}-ch`,
    scan: `${uid}-scan`,
  };
  const { faceBody: f, hair, style, abilities, identity } = persona;
  const skin = f.skinTone;
  const accent = style.accentColor;
  const glow = (style.glowIntensity / 100) * REALISM_GLOW[style.realism];
  const chassis = CHASSIS_HEX[style.chassisFinish];
  const masculine = identity.presentation === "masculine";
  const blink = animate && abilities.senses.includes("blinking");
  const breathe = animate && abilities.senses.includes("breathing");
  const hologram = abilities.form === "hologram";
  const hairDark = shade(hair.color, -0.35);
  const paint: HairPaint = {
    front: `url(#${ids.hairFront})`,
    back: `url(#${ids.hairBack})`,
    strandTexture: `url(#${ids.strands})`,
    curlTexture: `url(#${ids.curls})`,
    dark: hairDark,
    shine: "#ffffff",
  };
  const liner = f.eyeShape === "cat-eye" || f.makeup === "editorial" || f.makeup === "cyber" ? (f.makeup === "cyber" || f.makeup === "editorial" ? accent : "#141018") : null;
  const sclera = style.realism === "full-cyborg" ? "#1c1a2e" : "#fbfbfd";
  const lipColor = masculine && f.makeup === "none" ? mix(f.lipColor, skin, 0.55) : f.lipColor;
  const browColor = f.browMatchHair ? shade(hair.color, -0.25) : f.browColor;

  return (
    <svg viewBox={crop === "head" ? "40 30 240 270" : "0 0 320 400"} className={className} role="img" aria-label={title ?? `${identity.name} avatar preview`}>
      <defs>
        <HairGradient id={ids.hairFront} persona={persona} part="front" />
        <HairGradient id={ids.hairBack} persona={persona} part="back" />
        <pattern id={ids.strands} width="7" height="60" patternUnits="userSpaceOnUse">
          <path d="M2,0 C3,20 1,40 2,60" stroke={hairDark} strokeWidth="0.9" fill="none" opacity="0.7" />
          <path d="M5.5,0 C6,24 5,36 5.5,60" stroke={shade(hair.color, 0.35)} strokeWidth="0.6" fill="none" opacity="0.5" />
        </pattern>
        <pattern id={ids.curls} width="18" height="16" patternUnits="userSpaceOnUse">
          <path d="M2,8 a4,4 0 1,1 8,0" stroke={hairDark} strokeWidth="1.3" fill="none" opacity="0.8" />
          <path d="M11,15 a3.5,3.5 0 1,1 6,-2" stroke={shade(hair.color, 0.3)} strokeWidth="1" fill="none" opacity="0.6" />
          <path d="M10,4 a3,3 0 1,0 5,2" stroke={hairDark} strokeWidth="1" fill="none" opacity="0.6" />
        </pattern>
        <radialGradient id={ids.face} cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor={shade(skin, f.skinFinish === "porcelain" ? 0.14 : 0.08)} />
          <stop offset="0.7" stopColor={skin} />
          <stop offset="1" stopColor={shade(skin, -0.14)} />
        </radialGradient>
        <linearGradient id={ids.body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(skin, -0.08)} />
          <stop offset="1" stopColor={shade(skin, -0.02)} />
        </linearGradient>
        <linearGradient id={ids.neck} gradientUnits="userSpaceOnUse" x1="0" y1="236" x2="0" y2="300">
          <stop offset="0" stopColor={shade(skin, -0.32)} />
          <stop offset="0.45" stopColor={shade(skin, -0.1)} />
          <stop offset="1" stopColor={shade(skin, -0.05)} />
        </linearGradient>
        <radialGradient id={ids.bg} cx="0.5" cy="0.45" r="0.55">
          <stop offset="0" stopColor={accent} stopOpacity="0.32" />
          <stop offset="0.6" stopColor={accent} stopOpacity="0.08" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.chassis} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={shade(chassis, 0.35)} />
          <stop offset="0.5" stopColor={chassis} />
          <stop offset="1" stopColor={shade(chassis, -0.3)} />
        </linearGradient>
        <pattern id={ids.scan} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="1.4" fill={accent} opacity="0.5" />
        </pattern>
      </defs>

      <circle cx="160" cy="190" r="170" fill={`url(#${ids.bg})`} />

      <g filter={hologram ? "url(#nx-holo)" : undefined} className={breathe ? "nx-breathe" : undefined}>
        <HairBack hair={hair} paint={paint} />
        <Hood outfit={style.outfit} color={style.outfitColor} />
        <Shoulders p={persona} skinFill={`url(#${ids.body})`} neckFill={`url(#${ids.neck})`} />
        <Tattoos tattoos={style.tattoos} accent={accent} />
        <OutfitLayer p={persona} />
        <NeckAccessories items={style.accessories} accent={accent} accessoryColor={hair.accessoryColor} />
        {style.coreLight && <CoreLight color={accent} intensity={style.glowIntensity / 100} />}

        <Ears type={style.earType} skin={skin} chassis={`url(#${ids.chassis})`} accent={accent} glow={glow} />
        <path d={FACE_PATHS[f.faceShape]} fill={`url(#${ids.face})`} />
        <SkinFinish finish={f.skinFinish} skin={skin} />
        <g fill="#ff6f91" opacity={(f.blush / 100) * 0.45} filter="url(#nx-soft)">
          <ellipse cx={122} cy={204} rx={16} ry={9} />
          <ellipse cx={198} cy={204} rx={16} ry={9} />
        </g>
        <Freckles amount={f.freckles} skin={skin} />
        <Makeup style={f.makeup} accent={accent} skin={skin} />
        <Seams realism={style.realism} skin={skin} chassis={`url(#${ids.chassis})`} accent={accent} glow={glow} />

        <Eye side="left" shape={f.eyeShape} iris={f.eyeColor} sclera={sclera} lashes={f.lashes} liner={liner} glow={glow} idPrefix={uid} skin={skin} blink={blink} />
        <Eye
          side="right"
          shape={f.eyeShape}
          iris={f.heterochromia ? f.eyeColor2 : f.eyeColor}
          sclera={sclera}
          lashes={f.lashes}
          liner={liner}
          glow={glow}
          idPrefix={uid}
          skin={skin}
          blink={blink}
        />
        <Brows style={f.brows} color={browColor} masculine={masculine} />
        <Nose shape={f.noseShape} skin={skin} />
        <FacialHair style={f.facialHair} color={shade(hair.color, -0.15)} />
        <Lips shape={f.lipShape} color={lipColor} talking={speaking} gloss={f.makeup === "glam" || f.skinFinish === "dewy"} />
        {f.beautyMark && <circle cx={185} cy={222} r={1.7} fill={shade(skin, -0.62)} />}
        {f.dimples && (
          <g stroke={shade(skin, -0.3)} strokeOpacity={0.5} strokeWidth={1.2} fill="none" strokeLinecap="round">
            <path d="M136,236 q-3,4 -1,8" />
            <path d="M184,236 q3,4 1,8" />
          </g>
        )}
        <Circuitry style={style.circuitry} color={accent} intensity={Math.max(glow, style.circuitry === "none" ? 0 : 0.35)} />
        <Earrings items={style.accessories} earType={style.earType} />

        <HairFront hair={hair} paint={paint} accessory={hair.accessoryColor} />
        <HeadAccessories items={style.accessories} accessoryColor={hair.accessoryColor} outfitColor={style.outfitColor} accent={accent} />
        {style.earType === "halo" && <Halo accent={accent} glow={Math.max(glow, 0.4)} />}
      </g>

      {hologram && <rect width="320" height="400" fill={`url(#${ids.scan})`} opacity="0.18" className="nx-scan" />}
    </svg>
  );
}
