import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const missingSupabaseEnv = [
  !url ? 'VITE_SUPABASE_URL' : null,
  !anonKey ? 'VITE_SUPABASE_ANON_KEY' : null,
].filter(Boolean) as string[]

export const supabaseConfigured = Boolean(url && anonKey)
export const supabase = supabaseConfigured ? createClient(url!, anonKey!) : null

export function getSupabaseSetupMessage() {
  if (supabaseConfigured) return ''
  if (missingSupabaseEnv.length === 0) return 'Supabase فعال نیست؛ متغیرهای محیطی را بررسی کنید.'
  return `Supabase فعال نیست؛ متغیرهای ${missingSupabaseEnv.join(' و ')} را در .env یا Cloudflare vars تنظیم کنید.`
}
