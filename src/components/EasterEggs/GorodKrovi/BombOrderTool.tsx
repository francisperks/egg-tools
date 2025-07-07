"use client";

import React, { useState, useRef } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FaInfoCircle } from "react-icons/fa";
import { stations } from "./stations";

const voiceMap: Record<string, string> = {
  supply: "Supply Depot",
  depot: "Supply Depot",
  supplied: "Supply Depot",
  infirmary: "Infirmary",
  infirm: "Infirmary",
  dragon: "Dragon Command",
  command: "Dragon Command",
  armory: "Armory",
  armoury: "Armory",
  tank: "Tank Factory",
  tanked: "Tank Factory",
  factory: "Tank Factory",
  department: "Department Store",
  store: "Department Store",
  top: "Dragon Command",
  bottom: "Department Store",
  left: "Tank Factory",
  right: "Supply Depot",
  beds: "Infirmary",
  guns: "Armory",
};

const highlightColors = [
  "text-red-400",
  "text-green-400",
  "text-blue-400",
  "text-yellow-400",
  "text-pink-400",
  "text-purple-400",
  "text-teal-400",
  "text-orange-400",
  "text-lime-400",
  "text-emerald-400",
];

// Dynamically group keywords by station
const groupedKeywords: Record<string, string[]> = {};
Object.entries(voiceMap).forEach(([keyword, station]) => {
  if (!groupedKeywords[station]) groupedKeywords[station] = [];
  groupedKeywords[station].push(keyword);
});
Object.values(groupedKeywords).forEach((arr) => arr.sort());

export default function BombOrderTool() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [showWordsHelp, setShowWordsHelp] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isIOS =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const isSpeechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) &&
    !isIOS;

  const handleVoiceStart = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-GB";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setSpokenText("");

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setSpokenText(transcript);

      const words = transcript.split(/[\s,]+/).filter(Boolean);
      const ordered: string[] = [];

      for (const word of words) {
        const clean = word.replace(/[^a-z]/gi, "");
        const mapped = voiceMap[clean];
        if (mapped && !ordered.includes(mapped)) {
          ordered.push(mapped);
        }
      }

      setSelected(ordered);
      setIsListening(false);
    };

    recognition.onerror = (e: any) => {
      console.error("Speech recognition error", e);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleSelect = (station: string) => {
    setSelected((prev) =>
      prev.includes(station)
        ? prev.filter((s) => s !== station)
        : [...prev, station]
    );
  };

  const handleReset = () => setSelected([]);
  const allSelected = selected.length === stations.length;
  const displayList = allSelected ? selected : stations;

  return (
    <div className="flex flex-col gap-4 w-full max-w-md text-gray-200">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">💣 Bomb Order Tool</h2>
        <button
          onClick={() => setShowInfo(true)}
          className="text-blue-400 hover:text-blue-300"
          aria-label="Voice recognition info"
        >
          <FaInfoCircle />
        </button>
      </div>

      <p className="text-sm text-gray-400">
        You can either{" "}
        <span className="font-semibold">click the stations in order</span>{" "}
        manually or use <span className="font-semibold">Speak Order</span> to
        say them aloud (e.g.: "Supply, Infirmary, Dragon..."). We'll parse the
        voice input and match it to station names.
        <br />
        <button
          onClick={() => setShowWordsHelp(true)}
          className="text-blue-400 text-sm mt-1 text-left cursor-pointer underline"
          style={{
            textDecorationStyle: "dashed",
            textDecorationLine: "underline",
            textDecorationColor: "transparent",
            transition: "text-decoration-color 0.2s",
            color: "#60a5fa", // Tailwind blue-400
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecorationColor = "currentColor";
            e.currentTarget.style.color = "oklch(60.6% .25 292.717)"; // Tailwind purple-500
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecorationColor = "transparent";
            e.currentTarget.style.color = "#60a5fa"; // Tailwind blue-400
          }}
        >
          What words can I say?
        </button>
      </p>

      {isSpeechSupported ? (
        <button
          onClick={handleVoiceStart}
          className={`p-3 rounded text-white cursor-pointer transition-colors ${
            isListening
              ? "bg-yellow-500 animate-pulse"
              : "bg-green-900 hover:bg-green-700"
          }`}
        >
          {isListening ? <>🎧 Listening...</> : <>🎤 Speak Order</>}
        </button>
      ) : (
        <p className="text-red-500 text-sm italic">
          Speech recognition not supported on this device/browser.
        </p>
      )}

      {spokenText && (
        <div className="relative flex flex-col gap-1 text-sm text-gray-400 italic bg-gray-800 p-3 pr-10 rounded">
          <button
            onClick={() => setSpokenText("")}
            className="absolute top-2 right-4 text-red-400 hover:text-red-600 text-base rounded-full p-1 transition-colors cursor-pointer"
            aria-label="Clear heard text"
          >
            ✕
          </button>

          <div className="flex flex-wrap gap-x-1 select-none">
            Heard:
            {spokenText.split(/\s+/).map((word, idx) => {
              const clean = word.toLowerCase().replace(/[^a-z]/g, "");
              const isMatched = !!voiceMap[clean];
              const matchIndex = Object.keys(voiceMap).indexOf(clean);
              const colorClass =
                isMatched && matchIndex >= 0
                  ? highlightColors[matchIndex % highlightColors.length]
                  : "text-gray-500";

              return (
                <span key={idx} className={`font-mono ${colorClass}`}>
                  {word}
                </span>
              );
            })}
          </div>

          <button
            onClick={() => setShowInfo(true)}
            className="cursor-pointer text-blue-400 hover:underline text-xs mt-1 text-left flex items-center gap-1"
          >
            <FaInfoCircle />
            How we handle your voice input
          </button>
        </div>
      )}

      <div className="grid gap-2">
        {displayList.map((station) => {
          const isSelected = selected.includes(station);
          const index = selected.indexOf(station);
          return (
            <button
              key={station}
              onClick={() => handleSelect(station)}
              className={`p-3 rounded border text-left transition-colors cursor-pointer ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-400"
                  : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
              }`}
            >
              {isSelected ? `${index + 1}. ${station}` : station}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <button
          onClick={handleReset}
          className="mt-4 p-2 bg-red-700 hover:bg-red-800 text-white rounded"
        >
          Reset Order
        </button>
      )}

      {/* Voice Recognition Privacy Modal */}
      <Dialog
        open={showInfo}
        onClose={() => setShowInfo(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-md w-full bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl text-white">
            <DialogTitle className="text-lg font-semibold mb-2">
              🛡️ Voice Recognition Privacy
            </DialogTitle>
            <Description className="text-sm text-gray-300 space-y-2">
              <p>
                When you click <strong>Speak Order</strong>, your browser uses
                built-in speech recognition to convert your voice into text.
              </p>
              <p>
                <strong>
                  No audio is ever recorded, sent to a server, or stored
                </strong>
                . The recognition and processing happen entirely on your device.
              </p>
              <p className="italic text-xs text-gray-500">
                Voice recognition only works in supported browsers (e.g. Chrome
                on desktop) and is typically not available on iOS.
              </p>
            </Description>
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowInfo(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm rounded cursor-pointer text-white transition-colors"
              >
                Got it
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* What Words Can I Say Modal */}
      <Dialog
        open={showWordsHelp}
        onClose={() => setShowWordsHelp(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-md w-full bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl text-white">
            <DialogTitle className="text-lg font-semibold mb-2">
              🗣️ What Words Can I Say?
            </DialogTitle>

            <Description className="text-sm text-gray-300 space-y-4">
              <p>
                When using <strong>Speak Order</strong>, shorter keywords work
                best. Say one word per location rather than full phrases.
              </p>
              <button
                onClick={() => setShowInfo(true)}
                className="text-blue-400 hover:underline text-xs pt-0 mt-0 cursor-pointer"
                aria-label="Voice recognition info"
              >
                How we handle your voice input
              </button>

              <div className="space-y-3 max-h-100 overflow-y-auto pr-2">
                {Object.entries(groupedKeywords).map(([station, keywords]) => (
                  <div key={station}>
                    <div className="font-medium text-white">{station}</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {keywords.map((word) => (
                        <span
                          key={word}
                          className="px-2 py-1 text-sm rounded-full bg-zinc-800 border border-zinc-600 text-white font-mono"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs italic text-gray-500">
                <span className="mr-1">⚠️</span> Full names may get
                misinterpreted.
              </p>
            </Description>

            <div className="mt-4 text-right">
              <button
                onClick={() => setShowWordsHelp(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm rounded cursor-pointer text-white transition-colors"
              >
                Got it
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
