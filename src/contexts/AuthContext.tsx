import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type Profile = {
  role?: string | null
  full_name?: string | null
}

type AuthContextValue = {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (currentUser: User | null) => {
    if (!supabase || !currentUser) {
      setProfile(null)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', currentUser.id)
      .maybeSingle()

    if (!error) {
      setProfile(data ?? { role: 'customer', full_name: currentUser.email ?? null })
    } else {
      setProfile({ role: 'customer', full_name: currentUser.email ?? null })
    }
  }

  useEffect(() => {
    const client = supabase
    if (!client) {
      setLoading(false)
      return
    }

    const bootstrap = async () => {
      const { data: { session: currentSession } } = await client.auth.getSession()
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      await loadProfile(currentSession?.user ?? null)
      setLoading(false)
    }

    void bootstrap()

    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      await loadProfile(nextSession?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const refreshProfile = async () => {
    await loadProfile(user)
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setProfile(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({ session, user, profile, loading, refreshProfile, signOut }),
    [session, user, profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return ctx
}
