import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Mic,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles,
  ScanLine,
} from "lucide-react";
import { toast } from "sonner";
import { Badge, Button } from "@/components/kit";
import { useStore } from "@/lib/store";
import { agentRespond, initialMemory, OPENING_LINE, type AgentMemory, type AgentTurn } from "@/lib/agent";
import logo from "@/assets/kangaroo-logo.png";

export const Route = createFileRoute("/call")({
  head: () => ({
    meta: [
      { title: "Call Roo — AI Video Support | Kangaroo Home Care" },
      {
        name: "description",
        content:
          "Talk to Roo, the Kangaroo AI support agent. Show your appliance on camera, follow guided fixes and dispatch a technician in 60 minutes.",
      },
      { property: "og:title", content: "Call Roo — AI Video Support | Kangaroo Home Care" },
      { property: "og:description", content: "Live AI call with camera diagnosis and instant technician dispatch in Qatar." },
    ],
  }),
  component: CallPage,
});

const QUICK = [
  "My split AC blows warm air",
  "Washer is not draining",
  "No hot water from the heater",
  "The breaker keeps tripping",
  "Fridge is not cooling",
];

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: any) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function CallPage() {
  const { devices, addReport, addOrder, services, me } = useStore();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const [turns, setTurns] = useState<AgentTurn[]>([
    { id: "t0", role: "agent", text: OPENING_LINE, at: Date.now() },
  ]);
  const [memory, setMemory] = useState<AgentMemory>(initialMemory);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [speak, setSpeak] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [ended, setEnded] = useState(false);


  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, thinking]);

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  const say = useCallback(
    (text: string) => {
      if (!speak || typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.02;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    },
    [speak],
  );

  const push = (turn: Omit<AgentTurn, "id" | "at">) =>
    setTurns((prev) => [...prev, { ...turn, id: `t${prev.length}-${Date.now()}`, at: Date.now() }]);

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraOn(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setCameraOn(true);
      push({ role: "system", text: "Camera opened — Roo can see the device." });
    } catch {
      toast.error("Camera permission denied. You can still describe the problem.");
    }
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video || !cameraOn) {
      toast.error("Open the camera first");
      return;
    }
    const canvas = document.createElement("canvas");
    const w = 320;
    const ratio = video.videoHeight / (video.videoWidth || 1);
    canvas.width = w;
    canvas.height = Math.round(w * (ratio || 0.75));
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg", 0.6);
    setSnapshots((s) => [...s.slice(-3), data]);
    push({ role: "customer", text: "Sent a live snapshot", snapshot: data });
    handleSend("snapshot sent", data);
  };

  const finishCall = (
    resolution: "self-fixed" | "needs-visit" | "info-only",
    summary: string,
    service?: string,
  ) => {
    const device = devices.find((d) => d.id === memory.deviceId);
    const property = me.properties.find((p) => p.id === me.defaultPropertyId) ?? me.properties[0];
    let orderId: string | undefined;
    if (service) {
      const sv = services.find((s) => s.name === service);
      const order = addOrder({
        kind: "service",
        title: `${service} — AI dispatch`,
        customerId: me.id,
        customer: me.name,
        phone: me.phone,
        address: property ? `${property.label} · ${property.address}` : "Location shared in app",
        zone: property?.zone ?? "Doha",
        status: "new",
        priority: "urgent",
        amount: sv?.fromPrice ?? 250,
        source: "ai-agent",
        aiSummary: summary,
        attachments: snapshots,
        timeline: [{ at: new Date().toISOString(), label: "Created from AI call", by: "Roo AI" }],
      });
      orderId = order.id;
    }
    addReport({
      orderId,
      customerId: me.id,
      customer: me.name,
      device: device ? `${device.brand} ${device.model}` : "General enquiry",
      symptom: device?.symptoms[memory.symptomIndex ?? 0]?.label ?? "Unclassified",
      resolution,
      transcript: turns
        .filter((t) => t.role !== "system")
        .map((t) => ({ role: t.role === "agent" ? "agent" : "customer", text: t.text }) as const),
      snapshots,
    });
    setEnded(true);
    recognitionRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    toast.success(orderId ? `Job ${orderId} dispatched with the call report` : "Call report sent to the admin");
    if (orderId) navigate({ to: "/orders/$orderId", params: { orderId } });
  };

  const handleSend = (raw: string, snapshot?: string) => {
    const text = raw.trim();
    if (!text || ended) return;
    if (!snapshot) push({ role: "customer", text });
    setHeard("");
    setThinking(true);
    window.setTimeout(() => {
      const result = agentRespond(text, memory, devices);
      setMemory(result.memory);
      result.replies.forEach((reply, i) =>
        window.setTimeout(() => {
          push({ role: "agent", text: reply });
          if (i === 0) say(reply);
        }, i * 700),
      );
      setThinking(false);
      if (result.action?.type === "request-camera" && !cameraOn) {
        window.setTimeout(() => void toggleCamera(), result.replies.length * 700);
      }
      if (result.action?.type === "book") {
        const { service, summary } = result.action;
        window.setTimeout(() => finishCall("needs-visit", summary, service), result.replies.length * 700 + 500);
      }
      if (result.action?.type === "resolved") {
        const { summary } = result.action;
        window.setTimeout(() => finishCall("self-fixed", summary), result.replies.length * 700 + 500);
      }
    }, 550);
  };

  const startListening = () => {
    if (ended) return;
    const w = window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      toast.error("Voice is not supported in this browser — use the quick topics below.");
      return;
    }
    const rec: SpeechRecognitionLike = new Ctor();
    rec.lang = me.language === "ar" ? "ar-QA" : "en-US";
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let finalText = "";
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setHeard(interim || finalText);
      if (finalText.trim()) {
        handleSend(finalText);
      }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    try {
      rec.start();
      setListening(true);
      window.speechSynthesis?.cancel();
    } catch {
      setListening(false);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };


  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-primary text-primary-foreground">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 pt-5">
        <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-foreground/10">
          <img src={logo} alt="Roo" className="h-9 w-9 object-contain" width={36} height={36} />
          {!ended && <span className="pulse-ring absolute inset-0 rounded-2xl border-2 border-secondary" />}
        </span>
        <div className="min-w-0">
          <p className="truncate font-bold">Roo · Kangaroo AI support</p>
          <p className="text-xs text-primary-foreground/70">
            {ended ? "Call ended · report saved" : `Live · ${mmss}`}
          </p>
        </div>
        <Badge tone="brand" className="shrink-0 bg-primary-foreground/15 text-primary-foreground">
          <Sparkles className="h-3 w-3" /> {memory.phase}
        </Badge>
      </header>

      <div className="relative mx-4 mt-4 overflow-hidden rounded-3xl border border-primary-foreground/15 bg-foreground/40">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`h-56 w-full object-cover transition-opacity ${cameraOn ? "opacity-100" : "opacity-0"}`}
        />
        {!cameraOn && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <div>
              <CameraOff className="mx-auto h-7 w-7 text-primary-foreground/60" />
              <p className="mt-2 text-sm text-primary-foreground/70">
                Camera is off. Open it so Roo can inspect the device — الكاميرا تساعد الوكيل يشوف المشكلة.
              </p>
            </div>
          </div>
        )}
        {cameraOn && (
          <>
            <span className="absolute left-3 top-3 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold">
              ● LIVE
            </span>
            <button
              onClick={capture}
              className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-primary-foreground/90 px-4 py-2 text-xs font-bold text-primary"
            >
              <ScanLine className="h-4 w-4" /> Analyse frame
            </button>
          </>
        )}
      </div>

      {snapshots.length > 0 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4">
          {snapshots.map((s, i) => (
            <img
              key={i}
              src={s}
              alt={`Snapshot ${i + 1}`}
              className="h-16 w-20 shrink-0 rounded-xl border border-primary-foreground/20 object-cover"
            />
          ))}
        </div>
      )}

      <div ref={scrollRef} className="no-scrollbar mt-4 flex-1 space-y-3 overflow-y-auto px-4 pb-4">
        {turns.map((turn) =>
          turn.role === "system" ? (
            <p key={turn.id} className="text-center text-[11px] uppercase tracking-wide text-primary-foreground/50">
              {turn.text}
            </p>
          ) : (
            <div key={turn.id} className={turn.role === "agent" ? "flex" : "flex justify-end"}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  turn.role === "agent"
                    ? "bg-primary-foreground/10 text-primary-foreground"
                    : "amber-gradient text-secondary-foreground"
                }`}
              >
                {turn.snapshot ? (
                  <img src={turn.snapshot} alt="Shared frame" className="mb-2 w-40 rounded-xl" />
                ) : null}
                {turn.text}
              </div>
            </div>
          ),
        )}
        {thinking && (
          <div className="flex">
            <div className="rounded-2xl bg-primary-foreground/10 px-4 py-2.5 text-sm text-primary-foreground/70">
              Roo is looking…
            </div>
          </div>
        )}
      </div>

      {!ended ? (
        <>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap rounded-full border border-primary-foreground/25 px-3 py-1.5 text-xs font-semibold text-primary-foreground/90"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="sticky bottom-0 space-y-3 border-t border-primary-foreground/15 bg-primary/95 px-4 py-4 backdrop-blur">
            <p className="min-h-5 text-center text-xs text-primary-foreground/70">
              {listening ? heard || "Listening… تكلم الآن" : "Hold the mic and speak to Roo — كلمه بصوتك"}
            </p>
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
                onClick={() => void toggleCamera()}
                aria-label="Toggle camera"
              >
                {cameraOn ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
              </Button>
              <button
                type="button"
                onPointerDown={startListening}
                onPointerUp={stopListening}
                onPointerLeave={stopListening}
                aria-label="Hold to talk"
                className={`relative mx-auto grid h-20 w-20 place-items-center rounded-full transition-transform ${
                  listening ? "scale-105 bg-destructive" : "amber-gradient"
                }`}
              >
                {listening ? (
                  <span className="pulse-ring absolute inset-0 rounded-full border-2 border-primary-foreground/70" />
                ) : null}
                <Mic className={`h-8 w-8 ${listening ? "text-destructive-foreground" : "text-secondary-foreground"}`} />
              </button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
                onClick={() => {
                  setSpeak((s) => !s);
                  window.speechSynthesis?.cancel();
                }}
                aria-label="Toggle Roo voice"
              >
                {speak ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
            </div>
            <Button
              variant="danger"
              className="w-full"
              onClick={() => finishCall("info-only", "Customer ended the call early.")}
            >
              <PhoneOff className="h-4 w-4" /> End call
            </Button>
          </div>
        </>
      ) : (

        <div className="space-y-3 border-t border-primary-foreground/15 px-4 py-5">
          <p className="text-sm text-primary-foreground/80">
            Report, snapshots and transcript were sent to the admin console.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/orders">
              <Button variant="amber" className="w-full">
                My orders
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground">
                Home
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
