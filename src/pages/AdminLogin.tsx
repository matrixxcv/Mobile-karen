import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { user, profile, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user && profile?.role === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [loading, user, profile, navigate])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setMessage('')

    if (!supabaseConfigured || !supabase) {
      setMessage('Supabase فعال نیست؛ متغیرهای محیطی را تنظیم کنید.')
      return
    }

    try {
      setSubmitting(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
        return
      }

      const { data: profileRow, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle()

      if (profileError || profileRow?.role !== 'admin') {
        await supabase.auth.signOut()
        setMessage('این حساب دسترسی مدیر ندارد.')
        return
      }

      navigate('/admin', { replace: true })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'ورود مدیر انجام نشد.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="glass rounded-3xl p-7">
        <p className="text-sm text-sky">پنل مدیریت</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-silver-bright">ورود مدیر</h1>
        <p className="mt-2 text-sm text-silver-dim">برای ورود به بخش مدیریت باید حساب شما نقش admin داشته باشد.</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl bg-white/5 p-3 text-silver-bright"
            placeholder="ایمیل مدیر"
          />
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl bg-white/5 p-3 text-silver-bright"
            placeholder="رمز عبور"
          />
          {message && <p className="rounded-xl bg-white/5 p-3 text-sm text-silver-dim">{message}</p>}
          <button disabled={submitting} className="w-full rounded-xl bg-blue py-3 font-bold text-white disabled:opacity-70">
            {submitting ? 'در حال ورود...' : 'ورود به پنل'}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link to="/auth" className="text-sky">ورود کاربر معمولی</Link>
          <Link to="/" className="text-silver-dim">بازگشت به فروشگاه</Link>
        </div>
      </div>
    </section>
  )
}
