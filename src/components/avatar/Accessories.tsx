import type { EarType } from "@/types/persona";
import { shade } from "@/lib/color";

export function Ears({ type, skin, chassis, accent, glow }: { type: EarType; skin: string; chassis: string; accent: string; glow: number }) {
  if (type === "human" || type === "halo") {
    const ear = "M95,164 C82,158 79,186 88,200 C92,206 99,202 99,196";
    return (
      <g fill={skin} stroke={shade(skin, -0.25)} strokeWidth={1}>
        <path d={ear} />
        <path d={ear} transform="translate(320,0) scale(-1,1)" />
      </g>
    );
  }
  const cap = (cx: number) => (
    <g key={cx}>
      <circle cx={cx} cy={182} r={12} fill={chassis} stroke={shade(chassis, -0.3)} strokeWidth={1} />
      <circle cx={cx} cy={182} r={7.5} stroke={accent} strokeWidth={2} fill="none" opacity={0.5 + glow * 0.5} filter="url(#nx-glow)" />
      <circle cx={cx} cy={182} r={7.5} stroke={accent} strokeWidth={1.4} fill="none" />
      <circle cx={cx} cy={182} r={2.4} fill={accent} />
    </g>
  );
  return (
    <g>
      {type === "antenna" && (
        <g stroke={shade(chassis, -0.2)} strokeWidth={2} strokeLinecap="round">
          <path d="M86,174 L74,124" />
          <path d="M234,174 L246,124" />
          <circle cx={74} cy={122} r={3.5} fill={accent} stroke="none" filter="url(#nx-glow)" />
          <circle cx={246} cy={122} r={3.5} fill={accent} stroke="none" filter="url(#nx-glow)" />
        </g>
      )}
      {cap(90)}
      {cap(230)}
    </g>
  );
}

export function Halo({ accent, glow }: { accent: string; glow: number }) {
  return (
    <g className="nx-float">
      <ellipse cx={160} cy={50} rx={60} ry={11} stroke={accent} strokeWidth={4} fill="none" opacity={0.4 + glow * 0.6} filter="url(#nx-glow)" />
      <ellipse cx={160} cy={50} rx={60} ry={11} stroke={shade(accent, 0.5)} strokeWidth={1.6} fill="none" />
    </g>
  );
}

const GOLD = "#e6c36a";

/** Accessories that sit behind the hair front (earrings hang under locks). */
export function Earrings({ items, earType }: { items: string[]; earType: EarType }) {
  if (earType === "sensor-caps" || earType === "antenna") return null;
  return (
    <g>
      {items.includes("hoops") && (
        <g stroke={GOLD} strokeWidth={2.2} fill="none">
          <circle cx={91} cy={210} r={9} />
          <circle cx={229} cy={210} r={9} />
        </g>
      )}
      {items.includes("studs") && (
        <g fill="#f5f5ff">
          <circle cx={92} cy={200} r={2.6} />
          <circle cx={228} cy={200} r={2.6} />
          <circle cx={91.2} cy={199.2} r={0.9} fill="#fff" />
          <circle cx={227.2} cy={199.2} r={0.9} fill="#fff" />
        </g>
      )}
    </g>
  );
}

export function NeckAccessories({ items, accent, accessoryColor }: { items: string[]; accent: string; accessoryColor: string }) {
  return (
    <g>
      {items.includes("choker") && (
        <g>
          <path d="M140,266 Q160,274 180,266 L180,273 Q160,281 140,273 Z" fill="#141218" />
          <circle cx={160} cy={281} r={2.6} stroke={GOLD} strokeWidth={1.2} fill="none" />
        </g>
      )}
      {items.includes("necklace") && (
        <g>
          <path d="M134,298 Q160,338 186,298" stroke={GOLD} strokeWidth={1.3} fill="none" />
          <path d="M160,320 l5,6 l-5,8 l-5,-8 Z" fill={accent} stroke={GOLD} strokeWidth={0.8} />
        </g>
      )}
      {items.includes("scarf") && (
        <g fill={accessoryColor}>
          <path d="M126,286 Q160,312 194,286 L198,304 Q160,332 122,304 Z" />
          <path d="M168,304 L180,364 L194,360 L186,302 Z" fill={shade(accessoryColor, -0.15)} />
        </g>
      )}
    </g>
  );
}

/** Accessories drawn on top of everything. */
export function HeadAccessories({ items, accessoryColor, outfitColor, accent }: { items: string[]; accessoryColor: string; outfitColor: string; accent: string }) {
  return (
    <g>
      {items.includes("glasses") && (
        <g stroke="#1b1b22" strokeWidth={2.4} fill="#ffffff" fillOpacity={0.06}>
          <rect x={112} y={159} width={42} height={27} rx={10} />
          <rect x={166} y={159} width={42} height={27} rx={10} />
          <path d="M154,170 Q160,165 166,170" fill="none" />
          <path d="M112,168 L96,164 M208,168 L224,164" fill="none" />
        </g>
      )}
      {items.includes("sunglasses") && (
        <g transform="translate(0,-62)">
          <rect x={114} y={150} width={40} height={20} rx={9} fill="#121117" stroke="#2c2a33" strokeWidth={2} />
          <rect x={166} y={150} width={40} height={20} rx={9} fill="#121117" stroke="#2c2a33" strokeWidth={2} />
          <path d="M154,158 Q160,154 166,158" stroke="#2c2a33" strokeWidth={2} fill="none" />
          <path d="M120,154 L132,154" stroke={accent} strokeWidth={1.5} opacity={0.7} />
          <path d="M172,154 L184,154" stroke={accent} strokeWidth={1.5} opacity={0.7} />
        </g>
      )}
      {items.includes("headband") && (
        <path d="M92,142 C94,90 126,72 160,72 C194,72 226,90 228,142" stroke={accessoryColor} strokeWidth={7} strokeLinecap="round" fill="none" />
      )}
      {items.includes("hair-clip") && (
        <rect x={108} y={116} width={22} height={6} rx={3} transform="rotate(-32 119 119)" fill={accessoryColor} stroke={shade(accessoryColor, -0.3)} strokeWidth={0.8} />
      )}
      {items.includes("flower") && (
        <g>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const a = Math.PI + (i / 6) * Math.PI;
            const cx = 160 + Math.cos(a) * 70;
            const cy = 118 + Math.sin(a) * 50;
            const petal = i % 2 ? "#ffd1e3" : "#fff4f8";
            return (
              <g key={i}>
                <circle cx={cx - 4} cy={cy} r={4} fill={petal} />
                <circle cx={cx + 4} cy={cy} r={4} fill={petal} />
                <circle cx={cx} cy={cy - 4} r={4} fill={petal} />
                <circle cx={cx} cy={cy + 4} r={4} fill={petal} />
                <circle cx={cx} cy={cy} r={2.4} fill="#ffc94a" />
              </g>
            );
          })}
        </g>
      )}
      {items.includes("beanie") && (
        <g>
          <path d="M84,130 C82,70 118,44 160,44 C202,44 238,70 236,130 Z" fill={shade(outfitColor, -0.05)} />
          <path d="M82,118 L238,118 L240,140 L80,140 Z" fill={shade(outfitColor, -0.2)} />
          <g stroke={shade(outfitColor, -0.35)} strokeOpacity={0.5} strokeWidth={1}>
            {[96, 112, 128, 144, 160, 176, 192, 208, 224].map((x) => (
              <path key={x} d={`M${x},120 L${x},138`} />
            ))}
          </g>
        </g>
      )}
      {items.includes("headphones") && (
        <g>
          <path d="M86,172 C80,70 240,70 234,172" stroke="#2a2833" strokeWidth={8} fill="none" strokeLinecap="round" />
          <rect x={72} y={156} width={20} height={42} rx={9} fill="#2a2833" />
          <rect x={228} y={156} width={20} height={42} rx={9} fill="#2a2833" />
          <rect x={76} y={168} width={4} height={18} rx={2} fill={accent} />
          <rect x={240} y={168} width={4} height={18} rx={2} fill={accent} />
        </g>
      )}
    </g>
  );
}
