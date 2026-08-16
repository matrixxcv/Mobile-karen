import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '@/lib/supabase'
import { Link } from 'react-router-dom'

type Row = { id: string; name: string; price: number; stock: number; active: boolean }

export default function Admin() {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [stats, setStats] = useState({ products: 0, orders: 0, repairs: 0 })
  const [products, setProducts] = useState<Row[]>([])
  const [saving, setSaving] = useState(false)

  async function load() {
    if (!supabaseConfigured || !supabase) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setAllowed(false); return }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    const isAdmin = profile?.role === 'admin'
    setAllowed(isAdmin)
    if (!isAdmin) return
    const [p,o,r] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('repairs').select('id', { count: 'exact', head: true }),
    ])
    setStats({ products: p.count || 0, orders: o.count || 0, repairs: r.count || 0 })
    const { data } = await supabase.from('products').select('id,name,price,stock,active').order('slug')
    setProducts((data || []) as Row[])
  }

  useEffect(() => { load() }, [])

  async function updateProduct(id: string, patch: Partial<Row>) {
    if (!supabase) return
    setSaving(true)
    await supabase.from('products').update(patch).eq('id', id)
    await load()
    setSaving(false)
  }

  if (allowed === null) return <div className="mx-auto max-w-5xl px-4 py-20 text-center text-silver">در حال بررسی دسترسی...</div>
  if (!allowed) return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-2xl font-bold text-silver-bright">دسترسی محدود است</h1><p className="mt-3 text-silver-dim">برای ورود به پنل مدیریت باید حساب شما نقش admin داشته باشد.</p><Link to="/auth" className="mt-6 inline-block rounded-xl bg-blue px-5 py-3 font-bold text-white">ورود</Link></div>

  return <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
    <h1 className="font-display text-3xl font-extrabold text-silver-bright">پنل مدیریت موبایل کارن</h1>
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">{[['محصولات',stats.products],['سفارش‌ها',stats.orders],['تعمیرات',stats.repairs]].map(([x,n])=><div className="glass rounded-2xl p-6" key={String(x)}><p className="text-sm text-silver-dim">{x}</p><strong className="mt-2 block text-3xl text-silver-bright">{n}</strong></div>)}</div>
    <div className="mt-8 glass rounded-2xl p-5">
      <div className="flex items-center justify-between"><h2 className="font-bold text-silver-bright">مدیریت قیمت و موجودی محصولات</h2><span className="text-xs text-silver-dim">{saving ? 'در حال ذخیره...' : 'اتصال مستقیم به Supabase'}</span></div>
      <div className="mt-4 space-y-3">{products.map(p=><div key={p.id} className="grid grid-cols-1 gap-3 rounded-xl border border-line p-3 md:grid-cols-[1fr_160px_120px_100px] md:items-center"><div><p className="font-bold text-silver-bright">{p.name}</p><p className="text-xs text-silver-dim">{p.active ? 'فعال' : 'غیرفعال'}</p></div><input className="rounded-lg border border-line bg-white/5 px-3 py-2 text-sm text-silver-bright" type="number" defaultValue={p.price} onBlur={e=>updateProduct(p.id,{price:Math.max(0,Number(e.target.value)||0)})}/><input className="rounded-lg border border-line bg-white/5 px-3 py-2 text-sm text-silver-bright" type="number" defaultValue={p.stock} onBlur={e=>updateProduct(p.id,{stock:Math.max(0,Number(e.target.value)||0)})}/><button className="rounded-lg bg-white/5 px-3 py-2 text-xs text-silver-bright" onClick={()=>updateProduct(p.id,{active:!p.active})}>{p.active?'غیرفعال':'فعال'}</button></div>)}</div>
    </div>
  </section>
}
