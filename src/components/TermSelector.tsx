import React from "react";

export type Term = "Fall" | "Winter" | "Spring";

interface TermSelectorProps {
  selected: Term;
  onSelect: (t: Term) => void;
}

const terms: Term[] = ["Fall", "Winter", "Spring"];

const TermSelector: React.FC<TermSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {terms.map((t) => {
        const isActive = selected === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onSelect(t)}
            className={["px-4 py-2 text-sm font-medium rounded-lg transition", isActive ? "bg-indigo-600 text-white shadow" : "text-slate-700 hover:bg-slate-100"].join(" ")}aria-pressed={isActive}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
};

export default TermSelector;