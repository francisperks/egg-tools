"use client";

import { JSX, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export interface ChecklistItem {
  id: string;
  label: string;
  children?: ChecklistItem[];
}

interface ChecklistProps {
  items: ChecklistItem[];
}

export default function Checklist({ items }: ChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [hide, setHide] = useState<boolean>(true); // This state is not used in the current implementation, but can be used to hide items if needed.

  const toggle = (id: string, value: boolean, children?: ChecklistItem[]) => {
    const updates: Record<string, boolean> = { [id]: value };
    if (children?.length) {
      children.forEach((child) => {
        Object.assign(updates, toggle(child.id, value, child.children));
      });
    }
    return updates;
  };

  const handleChange = (
    item: ChecklistItem,
    value: boolean,
    parent?: ChecklistItem
  ) => {
    const updates = toggle(item.id, value, item.children);

    setChecked((prev) => {
      const merged = { ...prev, ...updates };
      if (parent) {
        const allChecked = parent.children?.every((c) => merged[c.id]);
        if (typeof allChecked === "boolean") {
          merged[parent.id] = allChecked;
        }
      }
      return merged;
    });
  };

  const clearAll = () => {
    const allUnchecked: Record<string, boolean> = {};
    const markAllUnchecked = (items: ChecklistItem[]) => {
      items.forEach((item) => {
        allUnchecked[item.id] = false;
        if (item.children) markAllUnchecked(item.children);
      });
    };
    markAllUnchecked(items);
    setChecked(allUnchecked);
  };

  const toggleAllExpansion = () => {
    const allIds: string[] = [];
    const collectExpandableIds = (items: ChecklistItem[]) => {
      items.forEach((item) => {
        if (item.children?.length) {
          allIds.push(item.id);
          collectExpandableIds(item.children);
        }
      });
    };
    collectExpandableIds(items);
    const anyCollapsed = allIds.some(
      (id) => expanded[id] === false || expanded[id] === undefined
    );
    const newExpansion: Record<string, boolean> = {};
    allIds.forEach((id) => {
      newExpansion[id] = anyCollapsed;
    });
    setExpanded(newExpansion);
  };

  const renderItems = (
    list: ChecklistItem[],
    level = 0,
    parent?: ChecklistItem
  ): JSX.Element => (
    <ul className="space-y-2">
      {list.map((item) => {
        const isExpanded = expanded[item.id] ?? true;
        const hasChildren = item.children && item.children.length > 0;
        const depthClass =
          ["bg-zinc-800", "bg-zinc-700", "bg-zinc-600", "bg-zinc-500"][level] ||
          "bg-zinc-600";

        return (
          <li key={item.id}>
            <div
              className={`group ${depthClass} px-4 py-2 rounded flex items-center justify-between transition hover:bg-zinc-600`}
            >
              <label
                className={`flex items-center gap-2 flex-1 cursor-pointer ${
                  level === 0
                    ? "text-lg font-bold"
                    : level === 1
                    ? "text-base font-semibold"
                    : "text-sm"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!checked[item.id]}
                  onChange={(e) => handleChange(item, e.target.checked, parent)}
                  className="accent-green-500 h-5 w-5 rounded border-gray-400"
                />
                <span>{item.label}</span>
              </label>

              {hasChildren && (
                <button
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [item.id]: !isExpanded,
                    }))
                  }
                  className="ml-2 p-1 rounded hover:bg-zinc-700 transition-colors cursor-pointer text-white opacity-80 hover:opacity-100"
                  title="Toggle child steps"
                >
                  {isExpanded ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <FaChevronRight size={14} />
                  )}
                </button>
              )}
            </div>

            {hasChildren && isExpanded && (
              <div className="ml-4 mt-1">
                {renderItems(item.children!, level + 1, item)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="flex flex-col gap-4 w-full max-w-md text-gray-200">
      {/* <h2 className="text-xl font-semibold">✅ Easter Egg Checklist</h2> */}

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setHide((prev) => !prev)}
          className="text-sm text-gray-400 hover:text-white transition cursor-pointer flex items-center gap-1 border border-gray-600 px-3 py-1 rounded hover:bg-zinc-700"
        >
          {hide ? "Show" : "Hide"}
        </button>
      </div>

      {!hide && (
        <>
          {/* <p className="text-sm text-gray-400">
            Track your progress through each step. You can nest steps inside
            steps, and checking a parent will mark all children.
          </p> */}
          <div className="flex justify-start gap-3 text-sm flex-col">
            <button
              onClick={clearAll}
              className="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 transition cursor-pointer"
            >
              Clear All
            </button>
            <button
              onClick={toggleAllExpansion}
              className="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 transition cursor-pointer"
            >
              {Object.values(expanded).some((v) => v === false)
                ? "Expand All"
                : "Collapse All"}
            </button>
          </div>
          {renderItems(items)}
        </>
      )}
    </div>
  );
}
