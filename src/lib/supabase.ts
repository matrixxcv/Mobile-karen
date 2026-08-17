import { createClient } from '@supabase/supabase-js'
import { products as localProducts } from '@/data/products'
import { accessories as localAccessories } from '@/data/accessories'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const hasSupabaseEnv = Boolean(url && anonKey)

export const missingSupabaseEnv = [
  !url ? 'VITE_SUPABASE_URL' : null,
  !anonKey ? 'VITE_SUPABASE_ANON_KEY' : null,
].filter(Boolean) as string[]

export const demoMode = !hasSupabaseEnv
export const supabaseConfigured = true

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    return safeJsonParse<T>(window.localStorage.getItem(key), fallback)
  } catch {
    return fallback
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore storage errors in demo mode
  }
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`
}

function getProfiles() {
  const defaultProfiles = [
    { id: 'demo-admin-id', full_name: 'مدیر پیش‌فرض', email: 'admin@mobilekaren.ir', role: 'admin' },
    { id: 'demo-user-id', full_name: 'کاربر پیش‌فرض', email: 'user@mobilekaren.ir', role: 'customer' },
  ]
  return readStorage<any[]>('mobile-karen-demo-profiles', defaultProfiles)
}

function writeProfiles(value: any[]) {
  writeStorage('mobile-karen-demo-profiles', value)
}

function getCurrentSession() {
  const fallback = {
    user: { id: 'demo-admin-id', email: 'admin@mobilekaren.ir', full_name: 'مدیر پیش‌فرض' }
  }
  return readStorage<{ user: { id: string; email: string; full_name?: string } | null } | null>('mobile-karen-demo-session', fallback)
}

function setCurrentSession(session: { user: { id: string; email: string; full_name?: string } | null } | null) {
  if (!session) {
    window.localStorage.removeItem('mobile-karen-demo-session')
    return
  }
  writeStorage('mobile-karen-demo-session', session)
}

function getRowsForTable(table: string) {
  if (table === 'profiles') return getProfiles()
  if (table === 'repairs') return readStorage<any[]>('mobile-karen-demo-repairs', [])
  if (table === 'orders') return readStorage<any[]>('mobile-karen-demo-orders', [])
  if (table === 'products') {
    return localProducts.map((item) => ({
      id: item.id,
      slug: item.id,
      name: item.name,
      category: 'iphone',
      description: item.description,
      price: 0,
      stock: 10,
      image_url: item.image,
      specs: item.specs,
      colors: item.specs?.colors ?? [],
      storage_options: item.specs?.storageOptions ?? [],
      active: true,
    }))
  }
  if (table === 'accessories') {
    return localAccessories.map((item) => ({
      id: item.id,
      slug: item.id,
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      stock: 10,
      image_url: item.image,
      specs: { features: item.features ?? [] },
      active: true,
    }))
  }
  return []
}

function saveRowsForTable(table: string, rows: any[]) {
  if (table === 'profiles') return writeProfiles(rows)
  if (table === 'repairs') return writeStorage('mobile-karen-demo-repairs', rows)
  if (table === 'orders') return writeStorage('mobile-karen-demo-orders', rows)
  return undefined
}

function applyFilters(rows: any[], filters: Array<[string, any]>) {
  return rows.filter((row) => filters.every(([field, value]) => row?.[field] === value))
}

function applySort(rows: any[], field?: string, ascending = true) {
  if (!field) return rows
  return [...rows].sort((a, b) => {
    const left = a?.[field]
    const right = b?.[field]
    if (left === right) return 0
    return ascending ? (left > right ? 1 : -1) : (left < right ? 1 : -1)
  })
}

function makeDemoQuery(table: string) {
  const state: {
    filters: Array<[string, any]>
    orderBy?: { field: string; ascending: boolean }
    selected?: string
    options?: any
  } = { filters: [] }

  const query: any = {
    select: (selected = '*', options?: any) => {
      state.selected = selected
      state.options = options
      return query
    },
    eq: (field: string, value: any) => {
      state.filters.push([field, value])
      return query
    },
    order: (field: string, options?: { ascending?: boolean }) => {
      state.orderBy = { field, ascending: options?.ascending ?? true }
      return query
    },
    maybeSingle: async () => ({ data: query.data[0] ?? null, error: null }),
  }

  Object.defineProperty(query, 'data', {
    get: () => {
      let rows = applyFilters(getRowsForTable(table), state.filters)
      rows = applySort(rows, state.orderBy?.field, state.orderBy?.ascending ?? true)
      return rows
    },
  })

  Object.defineProperty(query, 'count', {
    get: () => query.data.length,
  })

  Object.defineProperty(query, 'error', {
    get: () => null,
  })

  query.insert = async (payload: any) => {
    const rows = getRowsForTable(table)
    const record = { ...payload, id: payload.id ?? uid(table), created_at: new Date().toISOString() }
    rows.push(record)
    saveRowsForTable(table, rows)
    return { data: [record], error: null }
  }

  query.update = async (patch: any) => ({
    eq: async (field: string, value: any) => {
      const rows = getRowsForTable(table)
      const next = rows.map((row) => row?.[field] === value ? { ...row, ...patch } : row)
      saveRowsForTable(table, next)
      return { data: next, error: null }
    },
  })

  query.upsert = async (payload: any, options?: { onConflict?: string }) => {
    const rows = getRowsForTable(table)
    const key = options?.onConflict ?? 'id'
    const existingIndex = rows.findIndex((row) => row?.[key] === payload?.[key])

    if (existingIndex >= 0) {
      rows[existingIndex] = { ...rows[existingIndex], ...payload }
      saveRowsForTable(table, rows)
      return { data: rows[existingIndex], error: null }
    }

    const row = { ...payload, id: payload.id ?? uid(table), created_at: new Date().toISOString() }
    rows.push(row)
    saveRowsForTable(table, rows)
    return { data: row, error: null }
  }

  query.single = async () => ({ data: query.data[0] ?? null, error: null })
  return query
}

function ensureDemoAuth() {
  const profiles = getProfiles()
  if (!profiles.some((profile) => profile.email === 'admin@mobilekaren.ir')) {
    profiles.push({ id: 'demo-admin-id', full_name: 'مدیر پیش‌فرض', email: 'admin@mobilekaren.ir', role: 'admin' })
    writeProfiles(profiles)
  }
  const current = getCurrentSession()
  if (!current?.user) {
    setCurrentSession({ user: { id: 'demo-admin-id', email: 'admin@mobilekaren.ir', full_name: 'مدیر پیش‌فرض' } })
  }
}

function makeDemoAuth() {
  ensureDemoAuth()

  const getSession = async () => ({ data: { session: getCurrentSession() } })
  const getUser = async () => ({ data: { user: getCurrentSession()?.user ?? null } })

  const signInWithPassword = async ({ email, password }: { email: string; password: string }) => {
    const profiles = getProfiles()
    const match = profiles.find((profile) => profile.email === email && password === 'demo123')
    if (!match) {
      return { data: { user: null }, error: { message: 'ایمیل یا رمز عبور اشتباه است.' } }
    }
    const user = { id: match.id, email: match.email, full_name: match.full_name }
    setCurrentSession({ user })
    return { data: { user }, error: null }
  }

  const signUp = async ({ email, options }: { email: string; password: string; options?: { data?: { full_name?: string } } }) => {
    const profiles = getProfiles()
    const existing = profiles.find((profile) => profile.email === email)
    if (existing) {
      const user = { id: existing.id, email: existing.email, full_name: existing.full_name }
      setCurrentSession({ user })
      return { data: { user }, error: null }
    }
    const user = { id: uid('demo-user'), email, full_name: options?.data?.full_name || email }
    profiles.push({ id: user.id, email, full_name: user.full_name, role: 'customer' })
    writeProfiles(profiles)
    setCurrentSession({ user })
    return { data: { user }, error: null }
  }

  const signOut = async () => {
    setCurrentSession(null)
    return { error: null }
  }

  const onAuthStateChange = (callback: (event: string, session: any) => void | Promise<void>) => {
    const session = getCurrentSession()
    void callback('INITIAL_SESSION', session)
    return { data: { subscription: { unsubscribe: () => undefined } } }
  }

  return { getSession, getUser, onAuthStateChange, signInWithPassword, signUp, signOut }
}

export const demoSupabase = {
  auth: makeDemoAuth(),
  from: (table: string) => makeDemoQuery(table),
} as any

export const supabase = hasSupabaseEnv ? createClient(url!, anonKey!) : demoSupabase

export function getSupabaseSetupMessage() {
  if (!demoMode) return ''
  return 'حالت پیش‌نمایش فعال است؛ Supabase فیک شده و داده‌ها روی دستگاه شما ذخیره می‌شوند.'
}
