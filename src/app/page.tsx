"use client";

import { useState, useEffect, JSX } from "react";
import BombOrderTool from "@/components/EasterEggs/GorodKrovi/BombOrderTool";
import ValveTracker from "@/components/EasterEggs/GorodKrovi/ValveTracker";
import ComingSoon from "@/components/ComingSoon/ComingSoon";
import ChecklistModal, { ChecklistItem } from "@/components/CheckList";
import { FaListCheck } from "react-icons/fa6";

type ToolKey = "bomb" | "valve" | "comingSoon" | "checklist";

type MapKey = "gorod-krovi" | "more-coming-soon";

type EasterEggMap = {
  name: string;
  tools: Partial<Record<ToolKey, JSX.Element>>;
  checklist: ChecklistItem[];
};

const maps: Record<MapKey, EasterEggMap> = {
  "gorod-krovi": {
    name: "Gorod Krovi",
    tools: {
      bomb: <BombOrderTool />,
      valve: <ValveTracker />,
    },
    checklist: [
      { id: "power", label: "Turn on Power" },
      {
        id: "egg",
        label: "Dragon Egg",
        children: [
          { id: "egg-get", label: "Retrieve Egg" },
          { id: "egg-fire", label: "Fire Damage" },
          { id: "egg-melee", label: "Melee Kills" },
          {
            id: "egg-napalm",
            label: "Napalm Kill",
            children: [{ id: "egg-napalm-get", label: "Retrieve Napalm" }],
          },
        ],
      },
    ],
  },
  "more-coming-soon": {
    name: "More Coming Soon",
    tools: { comingSoon: <ComingSoon /> },
    checklist: [
      {
        id: "coming-soon",
        label: "More tools and maps coming soon!",
        children: [
          { id: "stay-tuned", label: "Stay tuned for updates!" },
          { id: "feedback", label: "Send us your feedback!" },
        ],
      },
    ],
  },
};

const SHOW_CHECKLIST = false; // Set to false to hide the checklist

export default function Home() {
  const [selectedMap, setSelectedMap] = useState<MapKey>("gorod-krovi");
  const [selectedTool, setSelectedTool] = useState<ToolKey>("bomb");
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const currentMap = maps[selectedMap];
  const toolKeys = Object.keys(currentMap.tools) as ToolKey[];
  const mobileToolKeys: ToolKey[] = SHOW_CHECKLIST
    ? ["checklist", ...toolKeys]
    : toolKeys;

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-4 py-2 w-screen overflow-y-auto">
      <header className="mb-8 text-center">
        {/* <h1 className="text-4xl font-extrabold mb-2">
          🧩 Zombies Easter Egg Tools
        </h1> */}
        <h2 className="text-2xl font-bold text-gray-200">
          zombies easter egg helper
        </h2>
        <div className="flex flex-wrap justify-center gap-3 my-4">
          {Object.entries(maps).map(([key, map]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedMap(key as MapKey);
                const firstTool = Object.keys(
                  maps[key as MapKey].tools
                )[0] as ToolKey;
                setSelectedTool(firstTool);
              }}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                key === selectedMap
                  ? "bg-white text-black shadow-lg"
                  : "border border-gray-500 hover:border-white"
              }`}
            >
              {map.name}
            </button>
          ))}
        </div>
        {/* <h2 className="text-xl text-gray-300">{currentMap.name}</h2> */}
      </header>

      {/* Mobile Tool Selector */}
      {!isLargeScreen && (
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {mobileToolKeys.map((tool) => (
            <button
              key={tool}
              onClick={() => setSelectedTool(tool)}
              className={`px-4 py-2 rounded-md text-sm transition-all ${
                selectedTool === tool
                  ? "bg-white text-black font-bold shadow"
                  : "border border-gray-400 hover:border-white"
              }`}
            >
              {tool === "checklist"
                ? "Checklist"
                : tool.charAt(0).toUpperCase() +
                  tool.slice(1).replace(/([A-Z])/g, " $1")}
            </button>
          ))}
        </div>
      )}

      <div
        className={`grid gap-6 ${
          isLargeScreen && SHOW_CHECKLIST
            ? "grid-cols-[300px_1fr]"
            : "grid-cols-1"
        }`}
      >
        {/* Checklist Sidebar (Desktop) or Tab (Mobile) */}
        {SHOW_CHECKLIST &&
          (isLargeScreen || selectedTool === "checklist") &&
          currentMap.checklist.length > 0 && (
            <aside className="bg-zinc-800 rounded-xl p-4 h-fit sticky top-6">
              <div className="flex items-center gap-2 mb-2">
                <FaListCheck />
                <h3 className="text-lg font-semibold">Checklist</h3>
              </div>
              <ChecklistModal items={currentMap.checklist} />
            </aside>
          )}

        {/* Tools */}
        <main
          className={`grid gap-6 ${
            isLargeScreen
              ? "grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]"
              : ""
          }`}
        >
          {isLargeScreen
            ? toolKeys.map((tool) => (
                <section
                  key={tool}
                  className="p-6 m-2 bg-zinc-800 rounded-2xl shadow-md m-auto"
                >
                  {currentMap.tools[tool]}
                </section>
              ))
            : selectedTool !== "checklist" &&
              currentMap.tools[selectedTool] && (
                <section className="p-6 bg-zinc-800 rounded-2xl shadow-lg flex items-start justify-center">
                  {currentMap.tools[selectedTool]}
                </section>
              )}
        </main>
      </div>
    </div>
  );
}
