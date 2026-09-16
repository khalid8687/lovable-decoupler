import type { DeviceKnowledge } from "./data";

export type AgentTurn = {
  id: string;
  role: "agent" | "customer" | "system";
  text: string;
  snapshot?: string;
  at: number;
};

export type AgentPhase =
  | "greeting"
  | "identify"
  | "visual"
  | "guiding"
  | "resolution"
  | "booked";

export type AgentMemory = {
  phase: AgentPhase;
  deviceId?: string;
  symptomIndex?: number;
  stepIndex: number;
  snapshots: string[];
};

export const initialMemory: AgentMemory = { phase: "greeting", stepIndex: 0, snapshots: [] };

const norm = (t: string) => t.toLowerCase().trim();

function matchDevice(text: string, devices: DeviceKnowledge[]) {
  const t = norm(text);
  for (const d of devices) {
    const hay = `${d.brand} ${d.model} ${d.category}`.toLowerCase();
    if (hay.split(/\s+/).some((w) => w.length > 3 && t.includes(w))) return d;
    for (let i = 0; i < d.symptoms.length; i++) {
      if (d.symptoms[i]!.keywords.some((k) => t.includes(norm(k)))) return d;
    }
  }
  return undefined;
}

function matchSymptom(text: string, device: DeviceKnowledge) {
  const t = norm(text);
  const idx = device.symptoms.findIndex((s) =>
    s.keywords.some((k) => t.includes(norm(k))),
  );
  return idx >= 0 ? idx : 0;
}

export type AgentResult = {
  memory: AgentMemory;
  replies: string[];
  action?:
    | { type: "request-camera" }
    | { type: "book"; service: string; summary: string }
    | { type: "resolved"; summary: string };
};

/**
 * Deterministic on-device support agent. It reasons over the admin-managed
 * device knowledge base: identify the appliance, ask for a camera look,
 * walk the customer through safe steps, then either close the call or
 * escalate it into a dispatched job.
 */
export function agentRespond(
  input: string,
  memory: AgentMemory,
  devices: DeviceKnowledge[],
): AgentResult {
  const text = norm(input);
  const mem: AgentMemory = { ...memory };
  const replies: string[] = [];

  if (/^(no|nope|stop|that's all|thanks|thank you|شكرا|خلاص)/.test(text) && mem.phase === "resolution") {
    return {
      memory: { ...mem, phase: "booked" },
      replies: ["Happy to help. I have saved the report for our engineers. Call 3344 2272 anytime."],
      action: { type: "resolved", summary: "Customer confirmed the issue is solved on the call." },
    };
  }

  if (/(visit|technician|come|send someone|فني|زيارة)/.test(text)) {
    const device = devices.find((d) => d.id === mem.deviceId);
    const symptom = device?.symptoms?.[mem.symptomIndex ?? 0];
    const service = symptom?.escalateTo ?? device?.category ?? "24/7 Emergency";
    replies.push(
      `Understood. I am dispatching a ${service} specialist and attaching everything we reviewed on this call.`,
    );
    return {
      memory: { ...mem, phase: "booked" },
      replies,
      action: {
        type: "book",
        service,
        summary: `AI call: ${device ? `${device.brand} ${device.model}` : "General request"} — ${symptom?.label ?? input}. Customer requested a site visit.`,
      },
    };
  }

  if (!mem.deviceId) {
    const device = matchDevice(input, devices);
    if (!device) {
      replies.push(
        "I did not catch the appliance. Tell me which one it is — AC, fridge, washer, water heater or the electrical board?",
      );
      return { memory: { ...mem, phase: "identify" }, replies };
    }
    mem.deviceId = device.id;
    mem.symptomIndex = matchSymptom(input, device);
    mem.stepIndex = 0;
    mem.phase = "visual";
    const symptom = device.symptoms[mem.symptomIndex]!;
    replies.push(
      `Got it — ${device.brand} ${device.model}, and it sounds like "${symptom.label}".`,
      `Let me see it. ${symptom.visualCheck} Tap the camera button and hold the phone steady.`,
    );
    return { memory: mem, replies, action: { type: "request-camera" } };
  }

  const device = devices.find((d) => d.id === mem.deviceId)!;
  const symptom = device.symptoms[mem.symptomIndex ?? 0]!;

  if (mem.phase === "visual") {
    mem.phase = "guiding";
    mem.stepIndex = 0;
    replies.push(
      "Thanks, I can see it clearly. We will fix this together, one step at a time.",
      `Step 1 of ${symptom.steps.length}: ${symptom.steps[0]}`,
      "Tell me when it is done, or say 'stuck' if something looks different.",
    );
    return { memory: mem, replies };
  }

  if (mem.phase === "guiding") {
    if (/(stuck|can't|cannot|not working|same|still|مش عارف|نفس)/.test(text)) {
      replies.push(
        "No problem, do not force anything. This one needs our hands on it.",
      );
      return {
        memory: { ...mem, phase: "booked" },
        replies,
        action: {
          type: "book",
          service: symptom.escalateTo ?? device.category,
          summary: `AI call: ${device.brand} ${device.model} — ${symptom.label}. Guided steps 1-${mem.stepIndex + 1} attempted, issue persists. Snapshots attached.`,
        },
      };
    }
    const next = mem.stepIndex + 1;
    if (next < symptom.steps.length) {
      mem.stepIndex = next;
      replies.push(`Step ${next + 1} of ${symptom.steps.length}: ${symptom.steps[next]!}`);
      return { memory: mem, replies };
    }
    mem.phase = "resolution";
    replies.push(
      "That is the full safe checklist for this fault.",
      "Is it working now, or should I send a technician within 60 minutes?",
    );
    return { memory: mem, replies };
  }

  if (mem.phase === "resolution") {
    if (/(work|fixed|good|yes|fine|تم|شغال)/.test(text)) {
      return {
        memory: { ...mem, phase: "booked" },
        replies: [
          "Excellent. I logged a self-service report with the snapshots so your maintenance history stays complete.",
        ],
        action: {
          type: "resolved",
          summary: `AI call resolved on the line: ${device.brand} ${device.model} — ${symptom.label}.`,
        },
      };
    }
    return {
      memory: { ...mem, phase: "booked" },
      replies: ["Booking a specialist now with the full call report attached."],
      action: {
        type: "book",
        service: symptom.escalateTo ?? device.category,
        summary: `AI call: ${device.brand} ${device.model} — ${symptom.label}. Guided steps completed, fault remains.`,
      },
    };
  }

  replies.push("I am here. Describe what the appliance is doing right now.");
  return { memory: mem, replies };
}

export const OPENING_LINE =
  "Kangaroo support, this is Roo. Tell me what is happening at home and I will look at it with you.";
