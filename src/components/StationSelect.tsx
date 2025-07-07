import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface StationSelectProps {
  label: string;
  selected: string;
  onChange: (value: string) => void;
  options: string[];
  color: "green" | "pink";
  hiddenOptions?: string[]; // Optional prop to hide a specific value
}

export function StationSelect({
  label,
  selected,
  onChange,
  options,
  color,
  hiddenOptions,
}: StationSelectProps) {
  const colorStyles =
    color === "green"
      ? "bg-green-800 text-white border-green-600 hover:bg-green-700"
      : "bg-pink-800  text-white border-pink-400 hover:bg-pink-500";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <Listbox value={selected} onChange={onChange}>
        <div className="relative">
          <ListboxButton
            className={`relative w-full cursor-pointer rounded border p-2 pr-10 text-left ${colorStyles}`}
          >
            <span>{selected || "--"}</span>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <ChevronUpDownIcon className="h-4 w-4" />
            </span>
          </ListboxButton>

          <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded bg-gray-900 py-1 text-white shadow-lg ring-1 ring-black/50 focus:outline-none z-10">
            {/* <ListboxOption
              value=""
              className={({ active, selected }) =>
                `cursor-pointer select-none px-4 py-2 ${
                  active ? "bg-gray-700" : ""
                } ${selected ? "font-semibold text-blue-400" : ""}`
              }
            >
              {({ selected }) => (
                <div className="flex justify-between">
                  <span>--</span>
                  {selected && <CheckIcon className="h-4 w-4 text-blue-400" />}
                </div>
              )}
            </ListboxOption>
            <div className="border-t border-gray-700 mx-2" /> */}
            {options
              .filter(
                (option) => !hiddenOptions || !hiddenOptions.includes(option)
              )
              .map((option, idx) => (
                <div key={option}>
                  <ListboxOption
                    value={option}
                    className={({ active, selected }) =>
                      `cursor-pointer select-none px-4 py-2 ${
                        active ? "bg-gray-700" : ""
                      } ${selected ? "font-semibold text-blue-400" : ""}`
                    }
                  >
                    {({ selected }) => (
                      <div className="flex justify-between">
                        <span>{option}</span>
                        {selected && (
                          <CheckIcon className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                    )}
                  </ListboxOption>
                  {idx < options.length - 1 && (
                    <div className="border-t border-gray-700 mx-2" />
                  )}
                </div>
              ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
