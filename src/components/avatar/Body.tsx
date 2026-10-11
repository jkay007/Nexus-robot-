import type { Build, Outfit, PersonaConfig } from "@/types/persona";
import { mix, shade } from "@/lib/color";

const BUILD_WIDTH: Record<Build, number> = {
  slender: -8,
  athletic: 0,
  average: 3,
  curvy: 6,
  muscular: 12,
  "full-figured": 12,
};

export function bodyWidth(p: PersonaConfig): { w: number; nw: number } {
  const masculine = p.identity.presentation === "masculine";
  return { w: BUILD_WIDTH[p.faceBody.build] + (masculine ? 6 : 0), nw: masculine ? 4 : 0 };
}

/** Hood sits behind the neck, so it renders before it. */
export function Hood({ outfit, color }: { outfit: Outfit; color: string }) {
  if (outfit !== "streetwear") return null;
  return <path d="M116,304 C112,276 128,258 140,258 L180,258 C192,258 208,276 204,304 Q160,322 116,304 Z" fill={shade(color, -0.18)} />;
}

export function Shoulders({ p, skinFill, neckFill }: { p: PersonaConfig; skinFill: string; neckFill: string }) {
  const { w, nw } = bodyWidth(p);
  return (
    <g>
      <path d={`M${52 - w},400 C${54 - w},336 ${92 - w},302 ${138 - nw},292 L${182 + nw},292 C${228 + w},302 ${266 + w},336 ${268 + w},400 Z`} fill={skinFill} />
      <path d={`M${140 - nw},236 L${140 - nw},298 Q160,308 ${180 + nw},298 L${180 + nw},236 Z`} fill={neckFill} />
      <path d="M128,312 Q142,318 152,314 M168,314 Q178,318 192,312" stroke={shade(p.faceBody.skinTone, -0.25)} strokeOpacity={0.35} strokeWidth={1.4} fill="none" />
    </g>
  );
}

export function Tattoos({ tattoos, accent }: { tattoos: string[]; accent: string }) {
  return (
    <g>
      {tattoos.includes("neck") && (
        <g stroke="#1f2430" strokeOpacity={0.55} strokeWidth={1} fill="none">
          <path d="M172,262 q6,-6 4,-14 q-2,6 -8,8" />
          <circle cx={174} cy={270} r={2.2} />
        </g>
      )}
      {tattoos.includes("collarbone") && (
        <g stroke="#2d3a3a" strokeOpacity={0.6} strokeWidth={1.1} fill="none">
          <path d="M188,306 C202,300 216,306 228,318" />
          <path d="M198,303 q2,-6 7,-6 M210,305 q3,-5 8,-4 M220,311 q4,-4 9,-2" />
        </g>
      )}
      {tattoos.includes("sleeve") && (
        <g stroke="#1f2430" strokeOpacity={0.45} strokeWidth={1.2} fill="none">
          <path d="M70,360 q10,-14 24,-10 q-12,6 -6,18 q8,-10 20,-4" />
          <path d="M64,384 q14,-10 30,-2" />
        </g>
      )}
      {tattoos.includes("glow-ink") && (
        <g stroke={accent} strokeWidth={1.1} fill={accent} opacity={0.85} filter="url(#nx-glow)">
          <path d="M150,272 l-6,10 l8,6" fill="none" />
          <circle cx={150} cy={272} r={1.3} />
          <circle cx={144} cy={282} r={1.3} />
          <circle cx={152} cy={288} r={1.3} />
        </g>
      )}
    </g>
  );
}

export function OutfitLayer({ p }: { p: PersonaConfig }) {
  const { w } = bodyWidth(p);
  const c = p.style.outfitColor;
  const dark = shade(c, -0.22);
  const light = shade(c, 0.18);
  const accent = p.style.accentColor;
  const L = 52 - w;
  const R = 268 + w;

  switch (p.style.outfit) {
    case "casual":
      return (
        <g>
          <path d={`M${L},400 C${L + 2},338 ${92 - w},306 132,296 Q160,316 188,296 C${228 + w},306 ${R - 2},338 ${R},400 Z`} fill={c} />
          <path d="M132,296 Q160,316 188,296" stroke={dark} strokeWidth={3} fill="none" />
        </g>
      );
    case "smart-casual":
      return (
        <g>
          <path d={`M${L},400 C${L + 2},338 ${92 - w},304 130,294 L160,346 L190,294 C${228 + w},304 ${R - 2},338 ${R},400 Z`} fill={c} />
          <path d="M130,294 L160,346 L146,304 L122,300 Z" fill={light} stroke={dark} strokeWidth={0.8} />
          <path d="M190,294 L160,346 L174,304 L198,300 Z" fill={light} stroke={dark} strokeWidth={0.8} />
          <circle cx={160} cy={360} r={2.2} fill={dark} />
          <circle cx={160} cy={382} r={2.2} fill={dark} />
        </g>
      );
    case "business":
      return (
        <g>
          <path d="M126,296 Q160,322 194,296 L198,400 L122,400 Z" fill="#f4f1ea" />
          <path d={`M${L},400 C${L + 2},338 ${92 - w},304 130,292 L156,374 L150,400 Z`} fill={c} />
          <path d={`M${R},400 C${R - 2},338 ${228 + w},304 190,292 L164,374 L170,400 Z`} fill={c} />
          <path d="M130,292 L156,374 L140,330 L118,318 Z" fill={dark} />
          <path d="M190,292 L164,374 L180,330 L202,318 Z" fill={dark} />
          <circle cx={160} cy={388} r={2.4} fill={dark} />
        </g>
      );
    case "evening":
      return (
        <g>
          <path
            d={`M${66 - w},400 C${70 - w},362 ${90 - w},346 112,342 Q136,352 160,344 Q184,352 208,342 C${230 + w},346 ${250 + w},362 ${254 + w},400 Z`}
            fill={c}
          />
          <path d="M116,344 L132,296 M204,344 L188,296" stroke={c} strokeWidth={3.5} strokeLinecap="round" />
          <path d="M112,342 Q136,352 160,344 Q184,352 208,342" stroke={light} strokeWidth={1.2} fill="none" opacity={0.7} />
          <g fill="#fff" opacity={0.7}>
            <circle cx={130} cy={366} r={1} />
            <circle cx={176} cy={372} r={1.2} />
            <circle cx={198} cy={386} r={0.9} />
            <circle cx={146} cy={390} r={1} />
          </g>
        </g>
      );
    case "athleisure":
      return (
        <g>
          <path d={`M${L},400 C${L + 2},336 ${92 - w},302 134,292 Q160,302 186,292 C${228 + w},302 ${R - 2},336 ${R},400 Z`} fill={c} />
          <path d="M134,292 L134,278 Q160,288 186,278 L186,292 Q160,302 134,292 Z" fill={dark} />
          <path d="M160,296 L160,400" stroke={shade(c, -0.4)} strokeWidth={2} />
          <path d={`M${92 - w},318 C${74 - w},336 ${64 - w},362 ${60 - w},400`} stroke={accent} strokeWidth={3} fill="none" opacity={0.8} />
          <path d={`M${228 + w},318 C${246 + w},336 ${256 + w},362 ${260 + w},400`} stroke={accent} strokeWidth={3} fill="none" opacity={0.8} />
        </g>
      );
    case "streetwear":
      return (
        <g>
          <path d={`M${L},400 C${L + 2},338 ${92 - w},306 128,298 Q160,322 192,298 C${228 + w},306 ${R - 2},338 ${R},400 Z`} fill={c} />
          <path d="M128,298 Q160,322 192,298" stroke={dark} strokeWidth={4} fill="none" />
          <path d="M150,316 L147,352 M170,316 L173,352" stroke={light} strokeWidth={1.8} strokeLinecap="round" />
          <rect x={144} y={350} width={6} height={8} rx={2} fill={accent} />
          <rect x={170} y={350} width={6} height={8} rx={2} fill={accent} />
          <path d="M126,372 L194,372 L190,400 L130,400 Z" fill={dark} opacity={0.4} />
        </g>
      );
    case "cyberpunk":
      return (
        <g>
          <path
            d={`M${L},400 C${L + 2},336 ${92 - w},302 128,290 L134,266 L146,296 L160,334 L174,296 L186,266 L192,290 C${228 + w},302 ${R - 2},336 ${R},400 Z`}
            fill={c}
          />
          <g stroke={accent} strokeWidth={1.6} fill="none" filter="url(#nx-glow)">
            <path d="M134,266 L146,296 L160,334 L174,296 L186,266" />
            <path d={`M${92 - w},312 L${108 - w},330 L${108 - w},400`} />
            <path d={`M${228 + w},312 L${212 + w},330 L${212 + w},400`} />
          </g>
          <path d="M134,266 L146,296 L160,334 L174,296 L186,266" stroke={accent} strokeWidth={1.6} fill="none" />
        </g>
      );
    case "bohemian":
      return (
        <g>
          <path d={`M${L},400 C${L + 2},340 ${92 - w},308 124,302 Q160,346 196,302 C${228 + w},308 ${R - 2},340 ${R},400 Z`} fill={c} />
          <g fill={mix(c, "#ffffff", 0.6)}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
              const t = i / 8;
              const x = 124 + t * 72;
              const y = 302 + Math.sin(t * Math.PI) * 44 + 6;
              return <circle key={i} cx={x} cy={y} r={1.8} />;
            })}
          </g>
          <path d="M124,302 Q160,346 196,302" stroke={mix(c, accent, 0.4)} strokeWidth={1.4} fill="none" />
        </g>
      );
    case "loungewear":
      return (
        <g>
          <path d={`M${L},400 C${L + 2},338 ${92 - w},306 136,296 Q160,300 184,296 C${228 + w},306 ${R - 2},338 ${R},400 Z`} fill={c} />
          <path d="M138,262 L138,298 Q160,306 182,298 L182,262 Q160,270 138,262 Z" fill={light} />
          <g stroke={dark} strokeOpacity={0.35} strokeWidth={1}>
            {[144, 150, 156, 162, 168, 174].map((x) => (
              <path key={x} d={`M${x},266 L${x},300`} />
            ))}
          </g>
        </g>
      );
    case "gothic":
      return (
        <g>
          <path d={`M${L},400 C${L + 2},338 ${92 - w},304 132,294 Q160,312 188,294 C${228 + w},304 ${R - 2},338 ${R},400 Z`} fill={c} />
          <g fill={dark}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const x = 134 + i * 9;
              const y = 296 + Math.sin((i / 6) * Math.PI) * 14;
              return <circle key={i} cx={x} cy={y} r={5} />;
            })}
          </g>
          <path d="M152,322 l8,10 l8,-10" stroke={accent} strokeWidth={1.2} fill="none" opacity={0.7} />
        </g>
      );
  }
}

export function CoreLight({ color, intensity }: { color: string; intensity: number }) {
  return (
    <g>
      <circle cx={160} cy={364} r={16} fill={color} opacity={0.25 + intensity * 0.4} filter="url(#nx-glow)" className="nx-pulse" />
      <circle cx={160} cy={364} r={8} fill={shade(color, 0.5)} />
      <circle cx={160} cy={364} r={11} stroke={color} strokeWidth={1.5} fill="none" />
    </g>
  );
}
