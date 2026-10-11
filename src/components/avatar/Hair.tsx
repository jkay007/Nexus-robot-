import type { ReactNode } from "react";
import type { HairConfig, HairStyle } from "@/types/persona";
import { backHairPoints, bumpyCircle, mx, smoothPath, strandPoints, type Pt } from "./geometry";

export interface HairPaint {
  front: string;
  back: string;
  strandTexture: string;
  curlTexture: string;
  dark: string;
  shine: string;
}

const mirror = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [mx(x), y]);

/* ---------- Caps (the hair on top of the head) ---------- */

type CapKind = "full" | "sleek" | "short" | "crop" | "buzz";

function capPath(kind: CapKind, sp: number): string {
  switch (kind) {
    case "full":
      return `M${84 - sp},184 C${76 - sp},100 112,56 160,56 C208,56 ${244 + sp},100 ${236 + sp},184 C230,150 224,124 206,112 C186,100 134,100 114,112 C96,124 90,150 ${84 - sp},184 Z`;
    case "sleek":
      return "M90,172 C84,104 116,70 160,70 C204,70 236,104 230,172 C226,140 220,120 204,110 C184,100 136,100 116,110 C100,120 94,140 90,172 Z";
    case "short":
      return "M88,178 C80,100 114,62 160,62 C206,62 240,100 232,178 C228,156 226,140 218,128 C200,108 120,108 102,128 C94,140 92,156 88,178 Z";
    case "crop":
      return "M90,168 C84,100 116,62 160,60 C206,62 238,100 230,168 L224,168 C222,146 218,128 208,116 C192,104 128,104 112,116 C102,128 98,146 96,168 Z";
    case "buzz":
      return "M92,166 C88,104 118,80 160,80 C202,80 232,104 228,166 C224,140 216,122 200,114 C182,106 138,106 120,114 C104,122 96,140 92,166 Z";
  }
}

function capKind(style: HairStyle): CapKind {
  if (["ponytail", "high-bun", "braids", "space-buns", "slicked-back"].includes(style)) return "sleek";
  if (style === "short-crop") return "crop";
  if (["pixie", "side-shave"].includes(style)) return "short";
  if (style === "buzz") return "buzz";
  return "full";
}

const NO_FRINGE: HairStyle[] = ["afro", "buzz", "slicked-back", "short-crop"];

/* ---------- Fringes ---------- */

function Fringe({ hair, paint }: { hair: HairConfig; paint: HairPaint }) {
  if (NO_FRINGE.includes(hair.style)) return null;
  switch (hair.fringe) {
    case "curtain": {
      const left = "M160,100 C136,100 110,116 100,172 C108,170 112,140 126,126 C138,116 150,114 160,116 Z";
      const right = "M160,100 C184,100 210,116 220,172 C212,170 208,140 194,126 C182,116 170,114 160,116 Z";
      return (
        <g fill={paint.front}>
          <path d={left} />
          <path d={right} />
        </g>
      );
    }
    case "blunt":
      return (
        <path
          fill={paint.front}
          d="M94,118 C104,90 216,90 226,118 L228,146 Q220,140 212,146 Q200,140 190,146 Q178,140 166,146 Q154,140 142,146 Q130,140 118,146 Q104,140 92,146 Z"
        />
      );
    case "side-swept": {
      const d = "M136,96 C178,94 220,112 232,172 C220,148 200,134 172,128 C150,124 128,126 106,134 C110,112 120,98 136,96 Z";
      return <path fill={paint.front} d={d} transform={hair.part === "right" ? "translate(320,0) scale(-1,1)" : undefined} />;
    }
    case "wispy": {
      const strands: ReactNode[] = [];
      for (let i = 0, x = 100; x <= 212; i++, x += 12) {
        const len = 138 + (i % 3) * 4;
        strands.push(<path key={x} d={`M${x - 2},98 Q${x + 2},120 ${x + 3},${len} Q${x + 7},122 ${x + 12},98 Z`} />);
      }
      return (
        <g fill={paint.front}>
          <path d="M100,112 C112,92 208,92 222,112 L222,118 L100,118 Z" />
          {strands}
        </g>
      );
    }
    default:
      return null;
  }
}

/* ---------- Style pieces ---------- */

function braid(side: 1 | -1, bottom: number, paint: HairPaint, tie: string) {
  const plaits: ReactNode[] = [];
  const x0 = side === 1 ? 104 : mx(104);
  const count = Math.max(5, Math.round((bottom - 206) / 15));
  for (let i = 0; i < count; i++) {
    const y = 206 + i * 15;
    const w = 10 - i * 0.25;
    plaits.push(
      <ellipse
        key={i}
        cx={x0 - side * i * 0.6}
        cy={y}
        rx={w}
        ry={10}
        transform={`rotate(${(i % 2 ? 24 : -24) * side} ${x0 - side * i * 0.6} ${y})`}
        fill={paint.front}
        stroke={paint.dark}
        strokeOpacity={0.35}
        strokeWidth={1}
      />,
    );
  }
  const endY = 206 + count * 15 - 4;
  const endX = x0 - side * count * 0.6;
  return (
    <g key={side}>
      <path
        d={side === 1 ? "M88,168 C90,188 98,198 108,204 L100,212 C92,200 86,186 86,170 Z" : "M232,168 C230,188 222,198 212,204 L220,212 C228,200 234,186 234,170 Z"}
        fill={paint.front}
      />
      {plaits}
      <rect x={endX - 6} y={endY} width={12} height={5} rx={2} fill={tie} />
      <path d={`M${endX - 5},${endY + 5} Q${endX},${endY + 22} ${endX + 5},${endY + 5} Z`} fill={paint.front} />
    </g>
  );
}

function bun(cx: number, cy: number, r: number, paint: HairPaint) {
  return (
    <g>
      <path d={smoothPath(bumpyCircle(cx, cy, r, 9, 1.6))} fill={paint.back} />
      <path d={smoothPath(bumpyCircle(cx, cy, r, 9, 1.6))} fill={paint.curlTexture} opacity={0.25} />
      <path
        d={`M${cx - r * 0.55},${cy} C${cx - r * 0.5},${cy - r * 0.6} ${cx + r * 0.5},${cy - r * 0.6} ${cx + r * 0.45},${cy + r * 0.1}`}
        stroke={paint.dark}
        strokeOpacity={0.35}
        strokeWidth={1.5}
        fill="none"
      />
    </g>
  );
}

interface Geometry {
  bottom: number;
  spread: number;
  wave: number;
  waves: number;
}

function geometry(hair: HairConfig): Geometry {
  const spread = hair.volume * 0.2;
  const longBottom = 250 + hair.length * 1.4;
  switch (hair.style) {
    case "long-wavy":
      return { bottom: longBottom, spread, wave: 6, waves: 2.2 };
    case "curly":
      return { bottom: 236 + hair.length * 1.1, spread: spread + 10, wave: 5, waves: 5 };
    case "lob":
      return { bottom: 300, spread, wave: 1.5, waves: 1 };
    case "shag":
      return { bottom: 300, spread: spread + 4, wave: 4, waves: 4.5 };
    case "side-shave":
      return { bottom: 230 + hair.length * 0.9, spread, wave: 3, waves: 1.5 };
    default:
      return { bottom: longBottom, spread, wave: 0, waves: 1 };
  }
}

/* ---------- Public renderers ---------- */

/** Hair that sits behind the head and body. */
export function HairBack({ hair, paint }: { hair: HairConfig; paint: HairPaint }) {
  const g = geometry(hair);
  const textured = (d: string, curly = false) => (
    <>
      <path d={d} fill={paint.back} />
      <path d={d} fill={curly ? paint.curlTexture : paint.strandTexture} opacity={curly ? 0.35 : 0.22} />
    </>
  );
  switch (hair.style) {
    case "long-straight":
    case "long-wavy":
    case "lob":
    case "shag":
      return textured(smoothPath(backHairPoints(g.bottom, g.spread, g.wave, g.waves)));
    case "curly":
      return textured(smoothPath(backHairPoints(g.bottom, g.spread, g.wave, g.waves)), true);
    case "afro":
      return textured(smoothPath(bumpyCircle(160, 150, 100 + hair.volume * 0.3, 20, 4, 96)), true);
    case "bob":
      return textured(
        `M160,60 C${102 - g.spread},60 ${78 - g.spread},104 ${78 - g.spread},162 C${78 - g.spread},208 84,240 98,258 L222,258 C236,240 ${242 + g.spread},208 ${242 + g.spread},162 C${242 + g.spread},104 ${218 + g.spread},60 160,60 Z`,
      );
    case "ponytail":
      return (
        <g>
          {textured("M196,84 C248,90 270,160 260,236 C254,292 244,324 228,352 C234,302 236,248 228,198 C222,152 212,118 190,102 Z")}
        </g>
      );
    case "high-bun":
      return bun(160, 56, 27, paint);
    case "space-buns":
      return (
        <g>
          {bun(112, 74, 22, paint)}
          {bun(208, 74, 22, paint)}
        </g>
      );
    case "pixie":
      return <path d="M100,150 C100,190 112,206 126,212 L194,212 C208,206 220,190 220,150 Z" fill={paint.back} />;
    default:
      return null;
  }
}

/** Hair drawn over the face: cap, fringe, face-framing locks and braids. */
export function HairFront({ hair, paint, accessory }: { hair: HairConfig; paint: HairPaint; accessory: string }) {
  const g = geometry(hair);
  const kind = capKind(hair.style);
  const parts: ReactNode[] = [];
  const strandBase = { top: 118, outerTop: 88 - g.spread / 2, innerTop: 103, innerBottom: 118 };

  // Face-framing locks for long and medium styles.
  if (["long-straight", "long-wavy", "curly", "lob", "shag"].includes(hair.style)) {
    const left = strandPoints({
      ...strandBase,
      bottom: g.bottom,
      outerBottom: 76 - g.spread,
      wave: g.wave,
      waves: g.waves,
    });
    const curly = hair.style === "curly";
    for (const pts of [left, mirror(left)]) {
      const d = smoothPath(pts);
      parts.push(
        <g key={`lock-${pts[0][0]}`}>
          <path d={d} fill={paint.front} />
          <path d={d} fill={curly ? paint.curlTexture : paint.strandTexture} opacity={curly ? 0.35 : 0.25} />
        </g>,
      );
    }
  }

  if (hair.style === "bob") {
    const sp = g.spread;
    const left = `M${92 - sp / 2},118 C${80 - sp},160 ${82 - sp},222 ${94 - sp / 2},256 Q110,264 126,250 C114,222 108,170 114,124 Z`;
    parts.push(
      <g key="bob" fill={paint.front}>
        <path d={left} />
        <path d={left} transform="translate(320,0) scale(-1,1)" />
      </g>,
    );
  }

  if (hair.style === "side-shave") {
    const right = mirror(
      strandPoints({ ...strandBase, bottom: g.bottom, outerBottom: 80 - g.spread, wave: g.wave, waves: g.waves }),
    );
    parts.push(
      <g key="shave">
        <ellipse cx={96} cy={150} rx={12} ry={32} fill={paint.dark} opacity={0.35} />
        <path d={smoothPath(right)} fill={paint.front} />
        <path d={smoothPath(right)} fill={paint.strandTexture} opacity={0.25} />
      </g>,
    );
  }

  // The cap itself.
  const cap = hair.style === "afro" ? smoothPath(afroCap()) : capPath(kind, kind === "full" ? g.spread / 2 : 0);
  parts.push(
    <g key="cap" opacity={kind === "buzz" ? 0.82 : 1}>
      <path d={cap} fill={paint.front} />
      <path
        d={cap}
        fill={hair.style === "afro" || hair.style === "curly" ? paint.curlTexture : paint.strandTexture}
        opacity={kind === "buzz" ? 0.15 : 0.18}
      />
    </g>,
  );

  if (hair.style === "short-crop") {
    parts.push(
      <g key="crop">
        <path fill={paint.front} d="M108,120 C118,96 146,88 174,92 C198,95 214,106 218,122 C200,108 172,104 150,108 C132,111 118,116 108,120 Z" />
        <path d="M128,104 C140,96 156,94 170,96 M150,100 C162,94 178,94 190,100" stroke={paint.dark} strokeOpacity={0.4} strokeWidth={1.2} fill="none" />
      </g>,
    );
  }

  if (hair.style === "slicked-back") {
    parts.push(
      <g key="comb" stroke={paint.dark} strokeOpacity={0.35} strokeWidth={1.2} fill="none">
        <path d="M122,108 C126,92 140,80 160,76" />
        <path d="M140,104 C144,90 154,82 170,78" />
        <path d="M184,104 C186,90 194,82 206,84" />
      </g>,
    );
  }

  // Parting line for caps that have one.
  if ((kind === "full" || kind === "sleek") && hair.style !== "afro" && hair.style !== "slicked-back") {
    const px = hair.part === "left" ? 136 : hair.part === "right" ? 184 : 160;
    parts.push(
      <path key="part" d={`M${px},${kind === "full" ? 60 : 72} Q${px + (px - 160) * 0.1},86 ${px},102`} stroke={paint.dark} strokeOpacity={0.5} strokeWidth={1.6} fill="none" />,
    );
  }

  parts.push(<Fringe key="fringe" hair={hair} paint={paint} />);

  if (hair.style === "braids") {
    parts.push(braid(1, Math.max(280, g.bottom), paint, accessory), braid(-1, Math.max(280, g.bottom), paint, accessory));
  }

  if (hair.style === "ponytail") {
    parts.push(<ellipse key="tie" cx={206} cy={92} rx={6} ry={9} transform="rotate(-35 206 92)" fill={accessory} />);
  }
  if (hair.style === "high-bun") {
    parts.push(<ellipse key="band" cx={160} cy={78} rx={15} ry={4} fill={accessory} />);
  }

  // Shine.
  if (hair.style !== "buzz") {
    parts.push(
      <path
        key="shine"
        d="M120,86 C138,72 178,70 200,82"
        stroke={paint.shine}
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
        opacity={hair.shine / 260}
        filter="url(#nx-soft)"
      />,
    );
  }

  return <g>{parts}</g>;
}

function afroCap(): Pt[] {
  // Hairline sits low on the forehead with a soft curly edge.
  const pts: Pt[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = Math.PI + t * Math.PI;
    const r = 78 + Math.sin(t * Math.PI * 14) * 2.5;
    pts.push([160 + Math.cos(a) * r, 160 + Math.sin(a) * r * 0.86]);
  }
  for (let i = steps; i >= 0; i--) {
    const t = i / steps;
    const x = 86 + t * 148;
    const y = 150 - Math.sin(t * Math.PI) * 42 + Math.sin(t * Math.PI * 12) * 2;
    pts.push([x, y]);
  }
  return pts;
}
