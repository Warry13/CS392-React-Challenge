import React, { useEffect, useRef } from "react";

interface Course {
  term: string;
  number: string;
  meets: string;
  title: string;
}

export interface SelectedItem {
  id: string;
  course: Course;
}

interface SelectedCoursesPopUp {
  items: SelectedItem[];
  onClose: () => void;
}

const SelectedCoursesModal: React.FC<SelectedCoursesPopUp> = ({ items, onClose }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <button
        aria-label="Close modal overlay"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 cursor-default"
        tabIndex={-1}
      />

      <div
        ref={cardRef}
        className="relative z-10 mx-4 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Selected Courses</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-slate-600">No courses selected.</p>
        ) : (
          <ul className="space-y-3 overflow-y-auto pr-1 max-h-[60vh]">
            {items.map(({ id, course }) => (
              <li
                key={id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 inline-flex min-w-[3.5rem] justify-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">{id}</div>
                  <div className="flex-1">
                    <div className="text-base font-medium text-slate-900">{course.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{course.term} • {course.number} • {course.meets}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SelectedCoursesModal;