// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import React, { useMemo, useState } from "react";
import Banner from "./components/Banner";
import CourseList from "./components/CourseList";
import TermSelector from "./components/TermSelector";
import type { Term } from "./components/TermSelector";
import { useJsonQuery } from "./utilities/fetch";

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
    setSelectedCourses(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Banner title={schedule.title}/>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <TermSelector selected={selectedTerm} onSelect={setSelectedTerm}/>
      </div>
      <CourseList courses={filteredCourses} selected={selectedCourses} onToggle={toggleSelected}/>
    </div>
  );
};

export default App;