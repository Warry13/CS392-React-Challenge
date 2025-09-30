
interface Course {
    term: string;
    number: string;
    meets: string;
    title: string;
}

interface CourseListProps {
    courses: Record<string, Course>
}

const CourseList = ({courses}: CourseListProps) => (
    <section className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
                {Object.entries(courses).map(([id, course]) => (
                    <article
                    key={id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-within:shadow-md">
                        <header className="mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {course.title}
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">{course.meets}</p>
                        </header>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-700">
                                {course.term}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 font-medium text-indigo-700">
                                {course.number}
                            </span>
                            <span className="ml-auto inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">
                                {id}
                            </span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    </section>
);

export default CourseList;