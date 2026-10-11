// Reference voice engine for Nexus Persona Forge (Supabase Edge Function, Deno).
//
// The forge POSTs multipart form data to `${VITE_VOICE_ENGINE_URL}/voices`:
//   name      — display name for the voice
//   settings  — JSON { similarity, stability, style, accent }
//   consent   — JSON { speaker: "self" | "permission", speakerName, confirmedAt }
//   samples   — one or more audio files
// and expects `{ voiceId }` back.
//
// This implementation creates an ElevenLabs Instant Voice Clone. The API key
// stays server-side:  supabase secrets set ELEVENLABS_API_KEY=...
// Add authentication and rate limiting before exposing it publicly — every
// call spends cloning credits.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const MAX_FILES = 10;
const MAX_BYTES = 25 * 1024 * 1024;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST" || !new URL(req.url).pathname.endsWith("/voices")) return json({ error: "Not found" }, 404);

  const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
  if (!apiKey) return json({ error: "Voice engine is not configured" }, 500);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ error: "Expected multipart form data" }, 400);
  }

  let consent: { speaker?: string; speakerName?: string; confirmedAt?: string } = {};
  try {
    consent = JSON.parse(String(form.get("consent") ?? "{}"));
  } catch {
    return json({ error: "Invalid consent record" }, 400);
  }
  const consented = consent.speaker === "self" || (consent.speaker === "permission" && (consent.speakerName ?? "").trim().length > 1);
  if (!consented || !consent.confirmedAt) return json({ error: "Speaker consent is required" }, 400);

  const samples = form.getAll("samples").filter((s): s is File => s instanceof File);
  if (!samples.length) return json({ error: "No audio samples received" }, 400);
  if (samples.length > MAX_FILES || samples.some((s) => s.size > MAX_BYTES)) return json({ error: "Too many or too large samples" }, 413);

  const out = new FormData();
  out.append("name", String(form.get("name") ?? "Nexus voice").slice(0, 100));
  out.append(
    "description",
    `Nexus companion voice. Consent: ${consent.speaker}${consent.speakerName ? ` (${consent.speakerName})` : ""} at ${consent.confirmedAt}.`.slice(0, 500),
  );
  for (const s of samples) out.append("files", s, s.name);

  const res = await fetch("https://api.elevenlabs.io/v1/voices/add", {
    method: "POST",
    headers: { "xi-api-key": apiKey },
    body: out,
  });
  if (!res.ok) return json({ error: `Cloning provider returned ${res.status}` }, 502);
  const body = (await res.json()) as { voice_id?: string };
  if (!body.voice_id) return json({ error: "Cloning provider returned no voice id" }, 502);
  return json({ voiceId: body.voice_id });
});
