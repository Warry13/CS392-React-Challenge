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

export const Route = createFileRoute('/courses/$id/edit')({
  component: EditCoursePage,
})

function EditCoursePage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [json, isLoading, error] = useJsonQuery('https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php')
  const schedule = (json as Schedule) ?? null
  const course = schedule?.courses?.[id]
  const [title, setTitle] = React.useState<string>('')
  const [meets, setMeets] = React.useState<string>('')

  React.useEffect(() => {
    if (course) {
      setTitle(course.title ?? '')
      setMeets(course.meets ?? '')
    }
  }, [course])

  function onSubmit() {
    // empty
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit()
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
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter Class Name"
          />
        </div>
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-slate-700">Meets (days + time range)</label>
          <input
            type="text"
            value={meets}
            onChange={(e) => setMeets(e.currentTarget.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., MWF 11:00-11:50 or TuTh 15:30-16:50"
          />
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