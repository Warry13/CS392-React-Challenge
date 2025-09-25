import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

const App = () => {
  const [count, setCount] = useState(0)
  const schedule = {
    title: "CS Courses for for 2024-2025"
  }

  return (
    <div className="text-center">
      <header className="bg-[#282c34] min-h-screen flex flex-col items-center justify-center text-[calc(10px_+_2vmin)] text-white">
        <p className="m-4">Class Schedules!</p>
        <p>{schedule['title']}</p>
        <p>
          <button className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded " onClick={() => setCount(count => count + 1)}>
            count is: {count}
          </button>
        </p>
      </header>
    </div>
  )
}

export default App
