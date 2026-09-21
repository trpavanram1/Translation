/** Browser speech & audio helpers for BhashaMitra Voice Assistant. */

export type SpeechOptions = {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
};

export type SequenceItem = {
  text: string;
  lang?: string;
  label?: string;
  rate?: number;
};

let currentUtterance: SpeechSynthesisUtterance | null = null;
let isSequenceActive = false;

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function findSpeechVoice(lang: string): SpeechSynthesisVoice | undefined {
  if (!isSpeechSynthesisSupported()) return undefined;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return undefined;

  const requestedLanguage = lang.toLowerCase();
  const requestedBaseLanguage = requestedLanguage.split("-")[0];
  return (
    voices.find((voice) => voice.lang.toLowerCase() === requestedLanguage) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(`${requestedBaseLanguage}-`)) ??
    voices.find((voice) => voice.lang.toLowerCase() === "en-in") ??
    voices[0]
  );
}

export function speak(text: string, lang = "hi-IN", options: SpeechOptions = {}) {
  if (!isSpeechSynthesisSupported() || !text) {
    options.onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    isSequenceActive = false;

    const utter = new SpeechSynthesisUtterance(text);
    const voice = findSpeechVoice(lang);
    utter.lang = voice?.lang ?? lang;
    utter.voice = voice ?? null;
    utter.rate = options.rate ?? 0.9;
    utter.pitch = options.pitch ?? 1.0;

    utter.onstart = () => {
      currentUtterance = utter;
      options.onStart?.();
    };

    utter.onend = () => {
      currentUtterance = null;
      options.onEnd?.();
    };

    utter.onerror = (e) => {
      currentUtterance = null;
      options.onError?.(e);
      options.onEnd?.();
    };

    window.speechSynthesis.speak(utter);
  } catch (err) {
    console.error("SpeechSynthesis error:", err);
    options.onEnd?.();
  }
}

/**
 * Sequentially reads out a list of sentences (e.g. Hindi -> Santali -> Ho -> Mundari)
 * with callbacks when each sentence starts and finishes.
 */
export function speakSequence(
  items: SequenceItem[],
  callbacks?: {
    onStartItem?: (index: number, item: SequenceItem) => void;
    onEndItem?: (index: number, item: SequenceItem) => void;
    onComplete?: () => void;
  },
) {
  if (!isSpeechSynthesisSupported() || !items || items.length === 0) {
    callbacks?.onComplete?.();
    return;
  }

  stopSpeaking();
  isSequenceActive = true;

  let currentIndex = 0;

  function playNext() {
    if (!isSequenceActive || currentIndex >= items.length) {
      isSequenceActive = false;
      callbacks?.onComplete?.();
      return;
    }

    const item = items[currentIndex];
    if (!item || !item.text.trim()) {
      currentIndex++;
      playNext();
      return;
    }

    const utter = new SpeechSynthesisUtterance(item.text);
    const requestedLanguage = item.lang ?? "hi-IN";
    const voice = findSpeechVoice(requestedLanguage);
    utter.lang = voice?.lang ?? requestedLanguage;
    utter.voice = voice ?? null;
    utter.rate = item.rate ?? 0.88;
    utter.pitch = 1.0;

    utter.onstart = () => {
      currentUtterance = utter;
      callbacks?.onStartItem?.(currentIndex, item);
    };

    utter.onend = () => {
      callbacks?.onEndItem?.(currentIndex, item);
      currentIndex++;
      // Brief pause between languages for natural cadence
      setTimeout(playNext, 400);
    };

    utter.onerror = () => {
      currentIndex++;
      playNext();
    };

    window.speechSynthesis.speak(utter);
  }

  playNext();
}

export function stopSpeaking() {
  if (!isSpeechSynthesisSupported()) return;
  isSequenceActive = false;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  if (!isSpeechSynthesisSupported()) return false;
  return window.speechSynthesis.speaking;
}

/**
 * Subtle pleasant audio chime using Web Audio API to indicate assistant listening / finished.
 */
export function playChime(type: "start" | "success" | "tap" = "tap") {
  if (typeof window === "undefined") return;
  try {
    const AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "start") {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "success") {
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch {
    // AudioContext blocked or not allowed until interaction
  }
}

/* ------------------------------------------------------------------
 * Speech Recognition Wrapper
 * ------------------------------------------------------------------ */

export type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort?: () => void;
  onresult: ((event: unknown) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
};

export async function requestMicrophonePermission(): Promise<boolean> {
  if (typeof navigator === "undefined") return false;

  const hasRecognition = Boolean(
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition,
  );

  if (!hasRecognition) {
    return false;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    return false;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}

export function createRecognition(lang = "hi-IN"): RecognitionLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => RecognitionLike;
    webkitSpeechRecognition?: new () => RecognitionLike;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = lang;
  rec.continuous = false;
  rec.interimResults = true;
  return rec;
}

export function getVoiceSupportStatus() {
  if (typeof window === "undefined") {
    return { supported: false, reason: "This browser cannot access microphone APIs yet." };
  }

  const hasRecognition = Boolean(
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition,
  );

  if (!hasRecognition) {
    return { supported: false, reason: "Speech recognition is not available in this browser." };
  }

  return { supported: true, reason: "Speech recognition is available." };
}

export function readTranscript(event: unknown): { text: string; final: boolean } {
  const e = event as {
    results?: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
  };
  if (!e.results) return { text: "", final: false };
  let text = "";
  let final = false;
  for (let i = 0; i < e.results.length; i++) {
    const r = e.results[i];
    if (!r) continue;
    text += r[0]?.transcript ?? "";
    if (r.isFinal) final = true;
  }
  return { text, final };
}

export function describeVoiceRecognitionError(error: unknown): string {
  const e = error as { error?: string; message?: string } | undefined;
  const code = e?.error ?? "";
  const message = e?.message ?? "";

  switch (code) {
    case "not-allowed":
      return "Microphone access was blocked. Please allow mic permission in this browser and refresh the page.";
    case "audio-capture":
      return "The browser could not access the microphone. Check that your mic is connected and not already in use.";
    case "no-speech":
      return "No speech was detected. Please speak clearly and try again.";
    case "network":
      return "The voice service is unavailable in this browser environment. This often happens in the embedded VS Code/Electron browser and requires using a regular Chrome/Edge browser.";
    case "service-not-allowed":
      return "Speech recognition is blocked by the current browser environment. Open the app in a standard browser with mic permission enabled.";
    default:
      return message || "Speech recognition failed. Please check microphone permission and try again.";
  }
}
