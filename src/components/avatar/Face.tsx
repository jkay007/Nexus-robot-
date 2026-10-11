import type { ReactNode } from "react";
import type { BrowStyle, EyeShape, FaceBodyConfig, FaceShape, LipShape, NoseShape, StyleConfig } from "@/types/persona";
import { mix, shade } from "@/lib/color";
import { seeded } from "./geometry";

export const FACE_PATHS: Record<FaceShape, string> = {
  oval: "M160,88 C203,88 228,120 228,165 C228,215 200,252 160,258 C120,252 92,215 92,165 C92,120 117,88 160,88 Z",
  heart: "M160,88 C208,88 230,118 230,160 C230,205 195,248 160,260 C125,248 90,205 90,160 C90,118 112,88 160,88 Z",
  round: "M160,90 C208,90 230,125 230,170 C230,220 200,252 160,254 C120,252 90,220 90,170 C90,125 112,90 160,90 Z",
  square: "M160,88 C205,88 228,115 228,160 C228,205 222,238 195,252 C180,258 140,258 125,252 C98,238 92,205 92,160 C92,115 115,88 160,88 Z",
  diamond: "M160,88 C195,88 215,115 230,165 C222,210 195,250 160,258 C125,250 98,210 90,165 C105,115 125,88 160,88 Z",
  long: "M160,82 C200,82 224,112 224,165 C224,220 198,258 160,264 C122,258 96,220 96,165 C96,112 120,82 160,82 Z",
};

export const EYE_Y = 172;
export const EYE_LEFT_X = 133;
export const EYE_RIGHT_X = 187;

interface EyeGeometry {
  fill: string;
  top: string;
  crease?: string;
}

// Left-eye shapes centred on (0,0) with the outer corner on the left.
const EYES: Record<EyeShape, EyeGeometry> = {
  almond: {
    fill: "M-18,1 C-11,-9 9,-10 17,-1 C10,6 -9,7 -18,1 Z",
    top: "M-18,1 C-11,-9 9,-10 17,-1",
    crease: "M-16,-6 C-8,-14 10,-14 16,-6",
  },
  round: {
    fill: "M-16,0 C-14,-11 14,-11 16,0 C14,9 -14,9 -16,0 Z",
    top: "M-16,0 C-14,-11 14,-11 16,0",
    crease: "M-15,-6 C-10,-16 12,-16 15,-6",
  },
  hooded: {
    fill: "M-18,1 C-10,-6 10,-7 17,0 C10,6 -9,7 -18,1 Z",
    top: "M-18,1 C-10,-6 10,-7 17,0",
    crease: "M-18,-2 C-9,-11 10,-11 18,-2",
  },
  upturned: {
    fill: "M-18,-3 C-11,-10 9,-9 17,0 C10,6 -9,6 -18,-3 Z",
    top: "M-18,-3 C-11,-10 9,-9 17,0",
    crease: "M-16,-8 C-8,-15 10,-14 16,-6",
  },
  monolid: {
    fill: "M-18,0 C-10,-6 10,-7 17,0 C10,5 -9,6 -18,0 Z",
    top: "M-18,0 C-10,-6 10,-7 17,0",
  },
  "cat-eye": {
    fill: "M-18,-3 C-11,-10 9,-9 17,0 C10,6 -9,6 -18,-3 Z",
    top: "M-19,-3 C-11,-10 9,-9 17,0",
    crease: "M-16,-8 C-8,-15 10,-14 16,-6",
  },
};

const BROWS: Record<BrowStyle, { d: string; width: number; opacity: number }> = {
  "soft-arch": { d: "M-19,-14 Q-6,-24 16,-18", width: 3.2, opacity: 0.95 },
  straight: { d: "M-19,-16 Q-2,-19 16,-18", width: 3.4, opacity: 0.95 },
  bold: { d: "M-20,-15 Q-6,-24 17,-18", width: 5, opacity: 1 },
  thin: { d: "M-18,-15 Q-6,-24 16,-19", width: 1.8, opacity: 0.9 },
  feathered: { d: "M-19,-14 Q-6,-23 16,-18", width: 4, opacity: 0.8 },
};

export function Eye({
  side,
  shape,
  iris,
  sclera,
  lashes,
  liner,
  glow,
  idPrefix,
  skin,
  blink,
}: {
  side: "left" | "right";
  shape: EyeShape;
  iris: string;
  sclera: string;
  lashes: FaceBodyConfig["lashes"];
  liner: string | null;
  glow: number;
  idPrefix: string;
  skin: string;
  blink: boolean;
}) {
  const g = EYES[shape];
  const cx = side === "left" ? EYE_LEFT_X : EYE_RIGHT_X;
  const clipId = `${idPrefix}-clip-${side}`;
  const irisId = `${idPrefix}-iris-${side}`;
  const lashWidth = lashes === "natural" ? 1.6 : lashes === "full" ? 2.4 : 3.2;
  return (
    <g transform={`translate(${cx},${EYE_Y}) scale(${side === "left" ? 1 : -1},1)`}>
      <defs>
        <clipPath id={clipId}>
          <path d={g.fill} />
        </clipPath>
        <radialGradient id={irisId}>
          <stop offset="0" stopColor={shade(iris, 0.35)} />
          <stop offset="0.6" stopColor={iris} />
          <stop offset="1" stopColor={shade(iris, -0.45)} />
        </radialGradient>
      </defs>
      {g.crease && <path d={g.crease} stroke={shade(skin, -0.3)} strokeOpacity={0.45} strokeWidth={1.1} fill="none" />}
      <g className={blink ? "nx-blink" : undefined}>
        <path d={g.fill} fill={sclera} />
        <g clipPath={`url(#${clipId})`}>
          {glow > 0 && <circle cx={side === "left" ? 1 : -1} cy={0} r={12} fill={iris} opacity={glow * 0.6} filter="url(#nx-glow)" />}
          <circle cx={side === "left" ? 1 : -1} cy={-0.5} r={7.6} fill={`url(#${irisId})`} />
          <circle cx={side === "left" ? 1 : -1} cy={-0.5} r={3.4} fill="#0b0a10" />
          <circle cx={side === "left" ? 3.6 : 1.6} cy={-3} r={1.7} fill="#fff" opacity={0.9} />
          <circle cx={side === "left" ? -1.5 : -3.5} cy={2} r={0.8} fill="#fff" opacity={0.7} />
          <path d={g.top} stroke="#000" strokeOpacity={0.18} strokeWidth={5} fill="none" />
        </g>
        <path d={g.top} stroke="#141018" strokeWidth={lashWidth} strokeLinecap="round" fill="none" />
        {lashes === "dramatic" && (
          <path d="M-14,-6 l-5,-4 M-10,-8 l-3,-5 M-17,-3 l-6,-2" stroke="#141018" strokeWidth={1.4} strokeLinecap="round" />
        )}
        {liner && <path d="M-18,-3 L-27,-9" stroke={liner} strokeWidth={2.2} strokeLinecap="round" />}
      </g>
    </g>
  );
}

export function Brows({ style, color, masculine }: { style: BrowStyle; color: string; masculine: boolean }) {
  const b = BROWS[style];
  const width = b.width + (masculine ? 1.4 : 0);
  // Masculine brows sit lower with a flatter arch.
  const sy = masculine ? 0.85 : 1;
  return (
    <g stroke={color} strokeWidth={width} strokeLinecap="round" fill="none" opacity={b.opacity}>
      <path d={b.d} transform={`translate(${EYE_LEFT_X},${EYE_Y}) scale(1,${sy})`} />
      <path d={b.d} transform={`translate(${EYE_RIGHT_X},${EYE_Y}) scale(-1,${sy})`} />
    </g>
  );
}

const NOSES: Record<NoseShape, string> = {
  button: "M156,199 Q151,206 155,209 Q160,212 165,209 Q169,206 164,199",
  straight: "M157,176 L155,203 Q152,208 156,210 Q160,212 164,210 Q168,208 165,203",
  aquiline: "M158,176 Q165,192 157,205 Q154,210 160,211 Q166,210 167,205",
  wide: "M155,199 Q146,207 152,211 Q160,214 168,211 Q174,207 165,199",
  upturned: "M157,182 Q154,198 153,204 Q156,210 160,208 Q165,210 167,204",
};

export function Nose({ shape, skin }: { shape: NoseShape; skin: string }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d="M163,176 Q166,192 164,200" stroke={shade(skin, -0.25)} strokeOpacity={0.25} strokeWidth={2} />
      <path d={NOSES[shape]} stroke={shade(skin, -0.32)} strokeOpacity={0.75} strokeWidth={1.6} />
      <ellipse cx={160} cy={203} rx={4} ry={2.4} fill="#fff" opacity={0.18} />
    </g>
  );
}

const LIPS: Record<LipShape, { upper: string; lower: string; line: string }> = {
  full: {
    upper: "M139,231 Q148,222 155,224 Q160,226 165,224 Q172,222 181,231 Q160,234 139,231 Z",
    lower: "M139,231 Q160,234 181,231 Q174,244 160,245 Q146,244 139,231 Z",
    line: "M140,231 Q160,234 180,231",
  },
  thin: {
    upper: "M141,231 Q150,226 156,227 Q160,228 164,227 Q170,226 179,231 Q160,233 141,231 Z",
    lower: "M141,231 Q160,233 179,231 Q172,238 160,239 Q148,238 141,231 Z",
    line: "M142,231 Q160,233 178,231",
  },
  heart: {
    upper: "M141,231 Q147,220 155,222 Q160,227 165,222 Q173,220 179,231 Q160,234 141,231 Z",
    lower: "M141,231 Q160,234 179,231 Q171,245 160,246 Q149,245 141,231 Z",
    line: "M142,231 Q160,234 178,231",
  },
  wide: {
    upper: "M134,231 Q145,223 154,225 Q160,227 166,225 Q175,223 186,231 Q160,234 134,231 Z",
    lower: "M134,231 Q160,234 186,231 Q176,242 160,243 Q144,242 134,231 Z",
    line: "M135,231 Q160,234 185,231",
  },
};

export function Lips({ shape, color, talking, gloss }: { shape: LipShape; color: string; talking: boolean; gloss: boolean }) {
  const l = LIPS[shape];
  return (
    <g>
      <path d={l.upper} fill={shade(color, -0.12)} />
      <g className={talking ? "nx-talk" : undefined}>
        <path d={l.lower} fill={color} />
        {gloss && <ellipse cx={164} cy={238} rx={6} ry={2} fill="#fff" opacity={0.35} />}
      </g>
      <path d={l.line} stroke={shade(color, -0.45)} strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </g>
  );
}

export function Freckles({ amount, skin }: { amount: number; skin: string }) {
  if (amount <= 0) return null;
  const rand = seeded(42);
  const count = Math.round((amount / 100) * 46);
  const dots: ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const side = i % 3;
    const cx = side === 0 ? 116 + rand() * 30 : side === 1 ? 174 + rand() * 30 : 150 + rand() * 20;
    const cy = side === 2 ? 186 + rand() * 14 : 190 + rand() * 22;
    dots.push(<circle key={i} cx={cx} cy={cy} r={0.7 + rand() * 0.9} />);
  }
  return (
    <g fill={shade(skin, -0.38)} opacity={0.55}>
      {dots}
    </g>
  );
}

export function SkinFinish({ finish, skin }: { finish: FaceBodyConfig["skinFinish"]; skin: string }) {
  const highlight = (opacity: number) => (
    <g fill="#fff" opacity={opacity} filter="url(#nx-soft)">
      <ellipse cx={122} cy={192} rx={11} ry={5} transform="rotate(-20 122 192)" />
      <ellipse cx={198} cy={192} rx={11} ry={5} transform="rotate(20 198 192)" />
      <ellipse cx={160} cy={128} rx={18} ry={6} />
      <ellipse cx={160} cy={200} rx={3} ry={6} />
    </g>
  );
  switch (finish) {
    case "dewy":
      return highlight(0.32);
    case "natural":
      return highlight(0.14);
    case "porcelain":
      return highlight(0.2);
    case "synthetic-sheen":
      return (
        <g>
          {highlight(0.4)}
          <path d="M196,120 C214,140 220,170 214,200" stroke="#fff" strokeWidth={4} opacity={0.35} fill="none" filter="url(#nx-soft)" />
        </g>
      );
    case "sun-kissed":
      return (
        <g fill={mix(skin, "#ff7a3d", 0.5)} opacity={0.22} filter="url(#nx-soft)">
          <ellipse cx={160} cy={194} rx={40} ry={9} />
        </g>
      );
    default:
      return null;
  }
}

export function Makeup({ style, accent, skin }: { style: FaceBodyConfig["makeup"]; accent: string; skin: string }) {
  const shadow: Record<FaceBodyConfig["makeup"], { color: string; opacity: number; ry: number } | null> = {
    none: null,
    natural: { color: shade(skin, -0.2), opacity: 0.35, ry: 7 },
    glam: { color: "#b76e79", opacity: 0.55, ry: 8 },
    smoky: { color: "#2b2530", opacity: 0.55, ry: 10 },
    editorial: { color: accent, opacity: 0.5, ry: 9 },
    cyber: { color: accent, opacity: 0.4, ry: 8 },
  };
  const s = shadow[style];
  if (!s) return null;
  return (
    <g fill={s.color} opacity={s.opacity} filter="url(#nx-soft)">
      <ellipse cx={133} cy={164} rx={20} ry={s.ry} />
      <ellipse cx={187} cy={164} rx={20} ry={s.ry} />
    </g>
  );
}

export function FacialHair({ style, color }: { style: FaceBodyConfig["facialHair"]; color: string }) {
  if (style === "none") return null;
  const jaw = "M98,196 C102,240 128,264 160,266 C192,264 218,240 222,196 C212,226 192,244 160,248 C128,244 108,226 98,196 Z";
  const fullJaw = "M96,190 C98,250 128,284 160,286 C192,284 222,250 224,190 C212,226 194,238 160,240 C126,238 108,226 96,190 Z";
  const tache = "M138,225 Q150,215 160,220 Q170,215 182,225 Q170,222 160,226 Q150,222 138,225 Z";
  switch (style) {
    case "stubble":
      return (
        <g fill={color} opacity={0.22}>
          <path d={jaw} />
          <path d={tache} />
        </g>
      );
    case "short-beard":
      return (
        <g fill={color} opacity={0.75}>
          <path d={jaw} />
          <path d={tache} />
        </g>
      );
    case "full-beard":
      return (
        <g fill={color} opacity={0.92}>
          <path d={fullJaw} />
          <path d={tache} />
        </g>
      );
    case "moustache":
      return <path d={tache} fill={color} opacity={0.92} />;
  }
}

/* ---------- Synthetic details ---------- */

export function Circuitry({ style, color, intensity }: { style: StyleConfig["circuitry"]; color: string; intensity: number }) {
  if (style === "none" || intensity <= 0) return null;
  const temple = (
    <g key="t">
      <path d="M214,124 l7,8 l0,16 M221,136 l6,0 M216,152 l-6,6" />
      <circle cx={227} cy={136} r={1.6} />
      <circle cx={210} cy={158} r={1.6} />
    </g>
  );
  const cheek = (
    <g key="c">
      <path d="M194,198 l12,0 l6,6 M200,208 l10,0" />
      <circle cx={212} cy={204} r={1.6} />
      <circle cx={210} cy={208} r={1.4} />
    </g>
  );
  const neck = (
    <g key="n">
      <path d="M168,262 l0,20 l6,6 M152,262 l0,14 l-6,6" />
      <circle cx={174} cy={288} r={1.6} />
      <circle cx={146} cy={282} r={1.6} />
    </g>
  );
  const pieces = style === "full" ? [temple, cheek, neck] : style === "temple" ? [temple] : style === "cheek" ? [cheek] : [neck];
  return (
    <g stroke={color} fill={color} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" opacity={0.35 + intensity * 0.65}>
      <g filter="url(#nx-glow)" opacity={0.8}>
        {pieces}
      </g>
      {pieces}
    </g>
  );
}

export function Seams({ realism, skin, chassis, accent, glow }: { realism: StyleConfig["realism"]; skin: string; chassis: string; accent: string; glow: number }) {
  if (realism === "hyper-real") return null;
  const seamColor = shade(skin, -0.28);
  if (realism === "subtle-synthetic") {
    return <path d="M222,182 C220,214 206,240 186,252" stroke={seamColor} strokeOpacity={0.35} strokeWidth={0.8} fill="none" />;
  }
  return (
    <g>
      <g stroke={seamColor} strokeOpacity={0.55} strokeWidth={0.9} fill="none">
        <path d="M98,182 C100,214 114,240 134,252" />
        <path d="M222,182 C220,214 206,240 186,252" />
        <path d="M112,124 C130,112 190,112 208,124" />
      </g>
      {realism === "full-cyborg" && (
        <g>
          <path d="M213,118 C232,148 232,204 212,236 L198,228 C210,200 210,158 198,130 Z" fill={chassis} />
          <path d="M213,118 C232,148 232,204 212,236" stroke={accent} strokeWidth={1.4} fill="none" opacity={0.5 + glow * 0.5} filter="url(#nx-glow)" />
          <path d="M198,130 C210,158 210,200 198,228" stroke={shade(chassis, -0.35)} strokeWidth={1} fill="none" />
          <circle cx={214} cy={178} r={2.4} fill={accent} filter="url(#nx-glow)" />
        </g>
      )}
    </g>
  );
}
