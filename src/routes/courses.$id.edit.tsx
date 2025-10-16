// import * as React from 'react'
// import { createFileRoute, useNavigate } from '@tanstack/react-router'
// import { useJsonQuery } from '../utilities/fetch'

// interface Course {
//   term: string;
//   number: string;
//   meets: string;
//   title: string;
// }
// interface Schedule {
//   title: string;
//   courses: Record<string, Course>;
// }

// export const Route = createFileRoute('/courses/$id/edit')({
//   component: EditCoursePage,
// })

// function EditCoursePage() {
//   const { id } = Route.useParams()
//   const navigate = useNavigate()
//   const [json, isLoading, error] = useJsonQuery('https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php')
//   const schedule = (json as Schedule) ?? null
//   const course = schedule?.courses?.[id]
//   const [title, setTitle] = React.useState<string>('')
//   const [meets, setMeets] = React.useState<string>('')

//   React.useEffect(() => {
//     if (course) {
//       setTitle(course.title ?? '')
//       setMeets(course.meets ?? '')
//     }
//   }, [course])

//   function onSubmit() {
//     // empty
//   }

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     onSubmit()
//   }

//   if (error) return <main className="p-6">Error: {`${error}`}</main>
//   if (isLoading) return <main className="p-6">Loading…</main>
//   if (!schedule) return <main className="p-6">No data.</main>
//   if (!course) {
//     return (
//       <main className="mx-auto max-w-2xl p-6">
//         <h1 className="text-xl font-semibold">Course not found</h1>
//         <button
//           onClick={() => navigate({ to: '/' })}
//           className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-white"
//         >Back</button>
//       </main>
//     )
//   }

//   return (
//     <main className="mx-auto max-w-2xl p-6">
//       <h1 className="mb-6 text-2xl font-semibold">
//         Edit Course <span className="text-slate-500">({id})</span>
//       </h1>
//       <form
//         onSubmit={handleSubmit}
//         className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
//       >
//         <div className="mb-4">
//           <label className="mb-1 block text-sm font-medium text-slate-700">Course Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.currentTarget.value)}
//             className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
//             placeholder="Enter Class Name"
//           />
//         </div>
//         <div className="mb-6">
//           <label className="mb-1 block text-sm font-medium text-slate-700">Meets (days + time range)</label>
//           <input
//             type="text"
//             value={meets}
//             onChange={(e) => setMeets(e.currentTarget.value)}
//             className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
//             placeholder="e.g., MWF 11:00-11:50 or TuTh 15:30-16:50"
//           />
//         </div>
//         <div className="flex gap-3">
//           <button
//             type="button"
//             onClick={() => navigate({ to: '/' })}
//             className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >Cancel</button>

//           <button
//             type="submit"
//             className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
//           >Submit</button>
//         </div>
//       </form>
//     </main>
//   )
// }
import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useJsonQuery } from '../utilities/fetch'

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

export type Term = 'Fall' | 'Winter' | 'Spring' | 'Summer'
export interface CourseForm {
  title: string
  term: Term
  number: string
  meets: string
}

type ValidationErrors = Partial<Record<keyof CourseForm, string>>

const TWO_LETTER = new Set(['Tu', 'Th', 'Sa', 'Su'])
const TERM_SET = new Set<Term>(['Fall', 'Winter', 'Spring', 'Summer'])
const numberRe = /^\d{3}(?:-\d{1,2})?$/ // e.g., "213" or "213-2"

type Day = 'M'|'Tu'|'W'|'Th'|'F'|'Sa'|'Su'
interface ParsedMeets {
  days: Day[]
  startMin: number
  endMin: number
}

function parseMeets(meets: string): ParsedMeets | null {
  if (!meets) return null
  const parts = meets.trim().split(/\s+/, 2)
  if (parts.length < 2) return null
  const [daysStr, timeStr] = parts
  const days: Day[] = []
  for (let i = 0; i < daysStr.length; ) {
    const two = daysStr.slice(i, i + 2)
    if (TWO_LETTER.has(two)) {
      days.push(two as Day); i += 2
    } else {
      const one = daysStr[i]
      if (!'MWF'.includes(one)) return null
      days.push(one as Day); i += 1
    }
  }
  if (days.length === 0) return null

  const m = timeStr.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const toMin = (h: string, mm: string) => parseInt(h, 10) * 60 + parseInt(mm, 10)
  const startMin = toMin(m[1], m[2])
  const endMin = toMin(m[3], m[4])
  if (!(startMin < endMin)) return null
  return { days, startMin, endMin }
}

function validateCourse(data: CourseForm): { values: CourseForm | null; errors: ValidationErrors } {
  const errors: ValidationErrors = {}
  if (!data.title || data.title.trim().length < 2) {
    errors.title = 'Title must be at least 2 characters'
  }
  if (!TERM_SET.has(data.term)) {
    errors.term = 'Term must be Fall, Winter, Spring, or Summer'
  }
  if (!numberRe.test(data.number.trim())) {
    errors.number = 'Number must be like "213" or "213-2"'
  }
  const meetsStr = data.meets.trim()
  if (meetsStr.length > 0) {
    const parsed = parseMeets(meetsStr)
    if (!parsed) {
      errors.meets = 'Meets must be like "MWF 11:00-11:50" or "TuTh 15:30-16:50"'
    }
  }

  return {
    values: Object.keys(errors).length ? null : {
      title: data.title.trim(),
      term: data.term,
      number: data.number.trim(),
      meets: data.meets.trim(),
    },
    errors,
  }
}

export const Route = createFileRoute('/courses/$id/edit')({
  component: EditCoursePage,
})

function EditCoursePage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [json, isLoading, error] = useJsonQuery('https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php')
  const schedule = (json as Schedule) ?? null
  const course = schedule?.courses?.[id]
  const [title, setTitle]   = React.useState<string>('')
  const [term, setTerm]     = React.useState<Term>('Fall')
  const [number, setNumber] = React.useState<string>('')
  const [meets, setMeets]   = React.useState<string>('')
  const [errors, setErrors] = React.useState<ValidationErrors>({})

  React.useEffect(() => {
    if (course) {
      setTitle(course.title ?? '')
      const safeTerm = (['Fall','Winter','Spring','Summer'] as Term[]).includes(course.term as Term)
        ? (course.term as Term)
        : 'Fall'
      setTerm(safeTerm)
      setNumber(course.number ?? '')
      setMeets(course.meets ?? '')
    }
  }, [course])

  function onSubmit(_values: CourseForm) {
    // intentionally empty for now
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData: CourseForm = { title, term, number, meets }
    const result = validateCourse(formData)
    setErrors(result.errors)
    if (result.values) {
      onSubmit(result.values)
    }
  }

  if (error) return <main className="p-6">Error: {`${error}`}</main>
  if (isLoading) return <main className="p-6">Loading…</main>
  if (!schedule) return <main className="p-6">No data.</main>
  if (!course) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-xl font-semibold">Course not found</h1>
        <button
          onClick={() => navigate({ to: '/' })}
          className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-white"
        >Back</button>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">
        Edit Course <span className="text-slate-500">({id})</span>
      </h1>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            aria-invalid={!!errors.title}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
              errors.title
                ? 'border-red-400 focus:ring-red-500'
                : 'border-slate-300 focus:ring-indigo-500'
            }`}
            placeholder='e.g., "AI", "Tech & Human Interaction"'
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">Term</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.currentTarget.value as Term)}
            aria-invalid={!!errors.term}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
              errors.term
                ? 'border-red-400 focus:ring-red-500'
                : 'border-slate-300 focus:ring-indigo-500'
            }`}
          >
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
          </select>
          {errors.term && (
            <p className="mt-1 text-sm text-red-600">{errors.term}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">Course Number</label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.currentTarget.value)}
            aria-invalid={!!errors.number}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
              errors.number
                ? 'border-red-400 focus:ring-red-500'
                : 'border-slate-300 focus:ring-indigo-500'
            }`}
            placeholder='e.g., "213" or "213-2"'
          />
          {errors.number && (
            <p className="mt-1 text-sm text-red-600">{errors.number}</p>
          )}
        </div>
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-slate-700">Meets (days + time range)</label>
          <input
            type="text"
            value={meets}
            onChange={(e) => setMeets(e.currentTarget.value)}
            aria-invalid={!!errors.meets}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
              errors.meets
                ? 'border-red-400 focus:ring-red-500'
                : 'border-slate-300 focus:ring-indigo-500'
            }`}
            placeholder='e.g., "MWF 11:00-11:50" or "TuTh 15:30-16:50" (or leave blank)'
          />
          {errors.meets && (
            <p className="mt-1 text-sm text-red-600">{errors.meets}</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >Cancel</button>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >Submit</button>
        </div>
      </form>
    </main>
  )
}