
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
    <div>
        <header className="bg-[#282c34] min-h-screen flex flex-col items-center justify-center text-[calc(10px_+_2vmin)] text-white">
            <ul>
                {
                    Object.entries(courses).map(([id, course]) => (
                        <li key={id}>
                            {course.title} |
                            | {course.term} |
                            | {course.number} |
                            | {course.meets}
                        </li>
                    ))
                }
            </ul>
        </header>
    </div>
);

export default CourseList;