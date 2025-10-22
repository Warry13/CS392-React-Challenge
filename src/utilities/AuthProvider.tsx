import React from 'react'
import { useAuthState } from './firebase'

export interface AuthContextValue {
  user: any | null
  isAuthenticated: boolean
  isInitialLoading: boolean
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthState()
  return (
    <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
