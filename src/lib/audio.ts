// Decodes a voice sample and measures what the clone engine cares about:
// length, loudness, clipping, and a compact waveform for display.

export interface AudioAnalysis {
  durationSec: number;
  peak: number;
  rms: number;
  clippedRatio: number;
  silenceRatio: number;
  waveform: number[]; // 0..1, ~120 buckets
  sampleRate: number;
}

export async function analyseAudio(blob: Blob, buckets = 120): Promise<AudioAnalysis> {
  const Ctx: typeof AudioContext =
    window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctx();
  try {
    const buffer = await ctx.decodeAudioData(await blob.arrayBuffer());
    const data = buffer.getChannelData(0);
    const size = Math.max(1, Math.floor(data.length / buckets));
    const waveform: number[] = [];
    let peak = 0;
    let sumSquares = 0;
    let clipped = 0;
    let silent = 0;
    for (let i = 0; i < data.length; i++) {
      const v = Math.abs(data[i]);
      if (v > peak) peak = v;
      sumSquares += v * v;
      if (v >= 0.99) clipped++;
      if (v < 0.01) silent++;
    }
    for (let b = 0; b < buckets; b++) {
      let max = 0;
      const start = b * size;
      for (let i = start; i < Math.min(start + size, data.length); i++) {
        const v = Math.abs(data[i]);
        if (v > max) max = v;
      }
      waveform.push(max);
    }
    const norm = peak || 1;
    return {
      durationSec: buffer.duration,
      peak,
      rms: Math.sqrt(sumSquares / Math.max(1, data.length)),
      clippedRatio: clipped / Math.max(1, data.length),
      silenceRatio: silent / Math.max(1, data.length),
      waveform: waveform.map((w) => w / norm),
      sampleRate: buffer.sampleRate,
    };
  } finally {
    void ctx.close();
  }
}

export interface QualityCheck {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

export function sampleQuality(a: Pick<AudioAnalysis, "peak" | "rms" | "clippedRatio" | "silenceRatio">): QualityCheck[] {
  return [
    {
      label: "Loudness",
      status: a.rms < 0.02 ? "fail" : a.rms < 0.05 ? "warn" : "pass",
      detail: a.rms < 0.02 ? "Too quiet — move closer to the mic" : a.rms < 0.05 ? "A little quiet" : "Good level",
    },
    {
      label: "Clipping",
      status: a.clippedRatio > 0.01 ? "fail" : a.clippedRatio > 0.001 ? "warn" : "pass",
      detail: a.clippedRatio > 0.001 ? "Distortion detected — lower input gain" : "Clean signal",
    },
    {
      label: "Silence",
      status: a.silenceRatio > 0.6 ? "warn" : "pass",
      detail: a.silenceRatio > 0.6 ? "Lots of silence — trim the gaps" : "Good speech density",
    },
  ];
}
