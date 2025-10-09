// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import React, { useMemo, useState } from "react";
import Banner from "./components/Banner";
import CourseList from "./components/CourseList";
import TermSelector from "./components/TermSelector";
import type { Term } from "./components/TermSelector";
import { useJsonQuery } from "./utilities/fetch";
import SelectedCoursesModal from "./components/PopUp";

interface Course {
  term: string;
  number: string;
  meets: string;
  title: string;
}
interface Schedule {
  title: string;
  courses: Record<string, Course>;
}

const fix = (s: string) => s.trim().toLowerCase();

const App: React.FC = () => {
  const [json, isLoading, error] = useJsonQuery("https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php");

  const [selectedTerm, setSelectedTerm] = useState<Term>("Fall");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (error) return <h1>Error loading schedule: {`${error}`}</h1>;
  if (isLoading) return <h1>Loading schedule...</h1>;
  if (!json) return <h1>No schedule data found</h1>;

  const schedule = json as Schedule;

  const filteredCourses = useMemo(() => {
    const want = fix(selectedTerm);
    return Object.fromEntries(
      Object.entries(schedule.courses).filter(([, c]) => fix(c.term) === want)
    );
  }, [schedule.courses, selectedTerm]);

  const toggleSelected = (id: string) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedItems = useMemo(
    () =>
      selectedCourses
        .map((id) => ({ id, course: schedule.courses[id] }))
        .filter((x): x is { id: string; course: Course } => Boolean(x.course)),
    [selectedCourses, schedule.courses]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Banner title={schedule.title} />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <TermSelector selected={selectedTerm} onSelect={setSelectedTerm} />
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/50"
          >
            Show courses
          </button>
        </div>
      </div>

      <CourseList
        courses={filteredCourses}
        selected={selectedCourses}
        onToggle={toggleSelected}
      />

      {isModalOpen && (
        <SelectedCoursesModal
          items={selectedItems}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;