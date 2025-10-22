import { signInWithGoogle, signOut } from '../utilities/firebase'
import { useAuth } from '../utilities/AuthProvider'

interface BannerProps {
    title: string
}

const Banner: React.FC<BannerProps> = ({ title }) => {
  const { user } = useAuth()

  return (
    <div className="text-center">
      <header className="bg-[#282c34] text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 flex items-center gap-4">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-blue-200">{user ? `Welcome, ${user.displayName}` : 'Not signed in'}</span>
            {user ? (
              <button onClick={signOut} className="rounded-lg bg-white px-3 py-1 text-sm text-slate-800">Sign Out</button>
            ) : (
              <button onClick={signInWithGoogle} className="rounded-lg bg-white px-3 py-1 text-sm text-slate-800">Sign In</button>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}

export default Banner