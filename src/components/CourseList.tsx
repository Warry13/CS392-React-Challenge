import React from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../utilities/AuthProvider";

interface Course {
  term: string;
  number: string;
  meets: string;
  title: string;
}

export interface CourseCardsProps {
  courses: Record<string, Course>;
  selected: string[];
  conflicts: string[];
  onToggle: (id: string) => void;
}

const CourseList: React.FC<CourseCardsProps> = ({
  courses,
  selected,
  conflicts,
  onToggle,
}) => {
  const { user, isAuthenticated } = useAuth();
  const ALLOWED_UID = 'slZj4QdR68dBoybS1Szc0OC6AXH3'

  return (
  <section className="min-h-screen bg-slate-50 py-10">
    <div className="mx-auto max-w-7xl px-4">
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
        {Object.entries(courses).map(([id, course]) => {
          const isSelected = selected.includes(id);
          const isConflict = conflicts.includes(id);

          const base =
            "rounded-2xl border p-5 shadow-sm transition-all focus-within:shadow-md";
          const color = isSelected
            ? "border-green-500 bg-green-100"
            : isConflict
            ? "border-red-500 bg-red-100"
            : "border-slate-200 bg-white";
          const interactivity = isConflict
            ? "cursor-not-allowed opacity-75"
            : "cursor-pointer hover:shadow-md";

          return (
            <article
              key={id}
              className={`${base} ${color} ${interactivity}`}
              role={isConflict ? undefined : "button"}
              tabIndex={isConflict ? -1 : 0}
              onClick={() => !isConflict && onToggle(id)}
              onKeyDown={(e) => {
                if (!isConflict && (e.key === "Enter" || e.key === " "))
                  onToggle(id);
              }}
              aria-pressed={isSelected}
              aria-disabled={isConflict || undefined}
            >
              <header className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{course.meets}</p>
                </div>
                {isAuthenticated && user?.uid === ALLOWED_UID && (
                  <Link
                    to="/courses/$id/edit"
                    params={{ id }}
                    onClick={(e) => e.stopPropagation()} // Prevent toggling when clicking Edit
                    className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >Edit</Link>
                )}
              </header>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-700">{course.term}</span>
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 font-medium text-indigo-700">{course.number}</span>
                <span className="ml-auto inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">{id}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
  )
}

export default CourseList;