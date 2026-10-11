import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderState = "idle" | "requesting" | "recording" | "denied" | "unsupported";

/** Microphone recorder with a live input level, for voice-clone samples. */
export function useRecorder(maxSeconds = 300) {
  const [state, setState] = useState<RecorderState>(
    typeof navigator !== "undefined" && navigator.mediaDevices && typeof MediaRecorder !== "undefined" ? "idle" : "unsupported",
  );
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const raf = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const resolveStop = useRef<((b: Blob | null) => void) | null>(null);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (timer.current) clearInterval(timer.current);
    stream.current?.getTracks().forEach((t) => t.stop());
    void audioCtx.current?.close();
    audioCtx.current = null;
    stream.current = null;
    setLevel(0);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const stop = useCallback((): Promise<Blob | null> => {
    const rec = recorder.current;
    if (!rec || rec.state === "inactive") return Promise.resolve(null);
    return new Promise((resolve) => {
      resolveStop.current = resolve;
      rec.stop();
    });
  }, []);

  const start = useCallback(async () => {
    if (state === "unsupported") return;
    setState("requesting");
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false },
      });
      stream.current = media;
      const ctx = new AudioContext();
      audioCtx.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(media).connect(analyser);
      const buf = new Uint8Array(analyser.fftSize);
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let peak = 0;
        for (const v of buf) peak = Math.max(peak, Math.abs(v - 128) / 128);
        setLevel(peak);
        raf.current = requestAnimationFrame(tick);
      };
      tick();

      chunks.current = [];
      const rec = new MediaRecorder(media);
      recorder.current = rec;
      rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      rec.onstop = () => {
        const blob = chunks.current.length ? new Blob(chunks.current, { type: rec.mimeType || "audio/webm" }) : null;
        cleanup();
        setState("idle");
        resolveStop.current?.(blob);
        resolveStop.current = null;
      };
      rec.start(250);
      setSeconds(0);
      const started = Date.now();
      timer.current = setInterval(() => {
        const s = Math.floor((Date.now() - started) / 1000);
        setSeconds(s);
        if (s >= maxSeconds) void stop();
      }, 250);
      setState("recording");
    } catch {
      cleanup();
      setState("denied");
    }
  }, [cleanup, maxSeconds, state, stop]);

  return { state, seconds, level, start, stop };
}
