"use client";

import React, { useState, useEffect } from "react";
import { valveSettings } from "./valveSettings";
import { stations } from "./stations";
import { StationSelect } from "@/components/StationSelect";

export default function ValveTracker() {
  const [greenStation, setGreenStation] = useState("");
  const [pinkStation, setPinkStation] = useState("");
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(stations.map((s) => [s, 0]))
  );

  useEffect(() => {
    if (!greenStation || !pinkStation) return;

    const combo = valveSettings[greenStation]?.[pinkStation];
    const initial = Object.fromEntries(stations.map((s) => [s, 0]));
    if (combo) {
      setValues({ ...initial, ...combo });
    } else {
      setValues(initial);
    }
  }, [greenStation, pinkStation]);

  const handleReset = () => {
    setGreenStation("");
    setPinkStation("");
    setValues(Object.fromEntries(stations.map((s) => [s, 0])));
  };

  // Sort stations by value (ascending), keeping 0s/"--" at the bottom
  const sortedStations = [...stations].sort((a, b) => {
    const aVal = values[a];
    const bVal = values[b];
    if (aVal === 0 && bVal === 0) return 0;
    if (aVal === 0) return 1;
    if (bVal === 0) return -1;
    return aVal - bVal;
  });

  return (
    <div className="flex flex-col gap-4 w-full max-w-md text-gray-200">
      <h2 className="text-xl font-semibold">🔧 Valve Puzzle Tracker</h2>

      <p className="text-sm text-gray-400">
        Select the location of the{" "}
        <span className="font-semibold">Green Light</span> (start) and the{" "}
        <span className="font-semibold">Pink Cylinder</span> (end). This tool
        will calculate the correct pressure values for each station.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <StationSelect
          label="Green Light (Start)"
          selected={greenStation}
          onChange={setGreenStation}
          options={stations}
          color="green"
          hiddenOptions={[pinkStation]}
        />

        <StationSelect
          label="Pink Cylinder (End)"
          selected={pinkStation}
          onChange={setPinkStation}
          options={stations}
          color="pink"
          hiddenOptions={[greenStation]}
        />
      </div>

      <div className="grid gap-2">
        {sortedStations.map((station) => (
          <div
            key={station}
            className="flex justify-between items-center border p-3 rounded bg-gray-800 border-gray-700"
          >
            <span className="text-white">{station}</span>
            <span className="flex items-center justify-center font-mono text-blue-400 bg-gray-900 rounded-full w-8 h-8 text-lg">
              {values[station] > 0 ? values[station] : "--"}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleReset}
        className="p-2 bg-red-700 hover:bg-red-800 text-white rounded mt-4"
      >
        Reset Tracker
      </button>
    </div>
  );
}
