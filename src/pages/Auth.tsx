import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured } from '@/lib/supabase'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [name,setName]=useState('')
  const [message,setMessage]=useState('')

  async function submit(e:FormEvent){
    e.preventDefault(); setMessage('')
    if(!supabaseConfigured || !supabase){ setMessage('ابتدا Supabase را در فایل .env تنظیم کنید.'); return }
    const result = mode==='login'
      ? await supabase.auth.signInWithPassword({email,password})
      : await supabase.auth.signUp({email,password,options:{data:{full_name:name}}})
    if(result.error) return setMessage(result.error.message)
    setMessage(mode==='login' ? 'ورود موفق بود.' : 'حساب ساخته شد؛ در صورت فعال بودن تأیید ایمیل، ایمیل خود را تأیید کنید.')
    if(mode==='login') navigate('/')
  }
  return <section className="mx-auto max-w-md px-4 py-16">
    <div className="glass rounded-3xl p-7">
      <p className="text-sm text-sky">موبایل کارن</p>
      <h1 className="mt-2 font-display text-2xl font-extrabold text-silver-bright">{mode==='login'?'ورود به حساب':'ساخت حساب کاربری'}</h1>
      <form onSubmit={submit} className="mt-7 space-y-4">
        {mode==='signup' && <input className="w-full rounded-xl bg-white/5 p-3 text-silver-bright" placeholder="نام و نام خانوادگی" value={name} onChange={e=>setName(e.target.value)}/>}
        <input required type="email" className="w-full rounded-xl bg-white/5 p-3 text-silver-bright" placeholder="ایمیل" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input required minLength={6} type="password" className="w-full rounded-xl bg-white/5 p-3 text-silver-bright" placeholder="رمز عبور" value={password} onChange={e=>setPassword(e.target.value)}/>
        {message && <p className="rounded-xl bg-white/5 p-3 text-sm text-silver-dim">{message}</p>}
        <button className="w-full rounded-xl bg-blue py-3 font-bold text-white">{mode==='login'?'ورود':'ثبت‌نام'}</button>
      </form>
      <button onClick={()=>setMode(mode==='login'?'signup':'login')} className="mt-5 text-sm text-sky">{mode==='login'?'حساب ندارم؛ ثبت‌نام کنم':'قبلاً حساب دارم؛ وارد شوم'}</button>
      <Link to="/" className="mt-5 block text-sm text-silver-dim">بازگشت به فروشگاه</Link>
    </div>
  </section>
}
