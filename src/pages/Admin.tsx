import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '@/lib/supabase'
import { Link } from 'react-router-dom'
import {
  Boxes,
  BriefcaseBusiness,
  PackageCheck,
  PencilLine,
  ShieldCheck,
  Sparkles,
  Wrench
} from 'lucide-react'

type Row = { id: string; name: string; price: number; stock: number; active: boolean }
type RepairRow = {
  id: string
  tracking_code: string
  customer_name: string
  phone: string
  device: string
  issue: string
  notes: string | null
  status: string
  created_at: string
}

export default function Admin() {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [stats, setStats] = useState({ products: 0, orders: 0, repairs: 0 })
  const [products, setProducts] = useState<Row[]>([])
  const [repairs, setRepairs] = useState<RepairRow[]>([])
  const [saving, setSaving] = useState(false)

  async function load() {
    if (!supabaseConfigured || !supabase) {
      setAllowed(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setAllowed(false)
        return
      }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      const isAdmin = profile?.role === 'admin'
      setAllowed(isAdmin)
      if (!isAdmin) return

      const [p, o, r] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('repairs').select('id', { count: 'exact', head: true }),
      ])

      setStats({ products: p.count || 0, orders: o.count || 0, repairs: r.count || 0 })

      const { data, error } = await supabase.from('products').select('id,name,price,stock,active').order('slug')
      if (!error) setProducts((data || []) as Row[])

      const { data: repairData, error: repairError } = await supabase
        .from('repairs')
        .select('id,tracking_code,customer_name,phone,device,issue,notes,status,created_at')
        .order('created_at', { ascending: false })

      if (!repairError) setRepairs((repairData || []) as RepairRow[])
    } catch {
      setAllowed(false)
    }
  }

  useEffect(() => { load() }, [])

  async function updateProduct(id: string, patch: Partial<Row>) {
    if (!supabaseConfigured || !supabase) {
      return
    }

    setSaving(true)
    try {
      await supabase.from('products').update(patch).eq('id', id)
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function updateRepairStatus(id: string, status: string) {
    if (!supabaseConfigured || !supabase) {
      return
    }

    setSaving(true)
    try {
      await supabase.from('repairs').update({ status }).eq('id', id)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const quickTasks = [
    { title: 'ثبت موجودی جدید', detail: 'افزودن محصول یا افزایش تعداد', icon: Boxes },
    { title: 'تغییر قیمت', detail: 'به‌روزرسانی قیمت و تخفیف‌ها', icon: PencilLine },
    { title: 'بررسی تعمیرات', detail: 'پیگیری درخواست‌های ورودی', icon: Wrench },
    { title: 'گزارش فروش', detail: 'نظارت و تحلیلی کوتاه روزانه', icon: BriefcaseBusiness }
  ]

  if (allowed === null) return <div className="mx-auto max-w-5xl px-4 py-20 text-center text-silver">در حال بررسی دسترسی...</div>
  if (!allowed) return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-2xl font-bold text-silver-bright">دسترسی محدود است</h1><p className="mt-3 text-silver-dim">{supabaseConfigured ? 'برای ورود به پنل مدیریت باید حساب شما نقش admin داشته باشد.' : 'Supabase فعال نیست؛ متغیرهای محیطی VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY را تنظیم کنید.'}</p><Link to="/auth" className="mt-6 inline-block rounded-xl bg-blue px-5 py-3 font-bold text-white">ورود</Link></div>

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-sky">داشبورد صاحب فروشگاه</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-silver-bright">پنل مدیریت موبایل کارن</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">
          <ShieldCheck className="h-4 w-4" />
          {saving ? 'در حال ذخیره تغییرات...' : 'وضعیت آنلاین'}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ['محصولات', stats.products, 'کل مدل‌های فعال'],
          ['سفارش‌ها', stats.orders, 'در انتظار بررسی'],
          ['تعمیرات', stats.repairs, 'درخواست‌های تازه']
        ].map(([label, value, hint]) => (
          <div key={String(label)} className="glass rounded-2xl p-6">
            <p className="text-sm text-silver-dim">{label}</p>
            <strong className="mt-2 block text-3xl font-extrabold text-silver-bright">{value}</strong>
            <p className="mt-2 text-xs text-silver-dim">{hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickTasks.map(({ title, detail, icon: Icon }) => (
          <div key={title} className="glass rounded-2xl p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky/10 text-sky">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-silver-bright">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-silver-dim">{detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 glass rounded-2xl p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold text-silver-bright">لیست موجودی و وضعیت محصولات</h2>
            <p className="mt-1 text-sm text-silver-dim">تغییر قیمت، موجودی و فعال/غیرفعال بودن هر محصول را از اینجا انجام دهید.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-silver-dim">
            <PackageCheck className="h-4 w-4 text-sky" />
            {products.length} محصول ثبت‌شده
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-line">
          <div className="hidden grid-cols-[1.5fr_0.8fr_0.8fr_0.6fr] gap-3 bg-white/5 px-4 py-3 text-xs font-medium text-silver-dim md:grid">
            <span>نام محصول</span>
            <span>قیمت</span>
            <span>موجودی</span>
            <span>وضعیت</span>
          </div>

          <div className="divide-y divide-line">
            {products.map((p) => (
              <div key={p.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1.5fr_0.8fr_0.8fr_0.6fr] md:items-center">
                <div>
                  <p className="font-bold text-silver-bright">{p.name}</p>
                  <p className="mt-1 text-xs text-silver-dim">{p.active ? 'فعال در فروشگاه' : 'غیرفعال'}</p>
                </div>

                <input
                  className="rounded-lg border border-line bg-white/5 px-3 py-2 text-sm text-silver-bright"
                  type="number"
                  defaultValue={p.price}
                  onBlur={(e) => updateProduct(p.id, { price: Math.max(0, Number(e.target.value) || 0) })}
                />

                <input
                  className="rounded-lg border border-line bg-white/5 px-3 py-2 text-sm text-silver-bright"
                  type="number"
                  defaultValue={p.stock}
                  onBlur={(e) => updateProduct(p.id, { stock: Math.max(0, Number(e.target.value) || 0) })}
                />

                <button
                  className="rounded-lg border border-line bg-white/5 px-3 py-2 text-xs font-bold text-silver-bright transition hover:border-sky/40 hover:text-sky"
                  onClick={() => updateProduct(p.id, { active: !p.active })}
                >
                  {p.active ? 'غیرفعال' : 'فعال'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-2xl p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-silver-bright">درخواست‌های تعمیر</h2>
            <p className="mt-1 text-sm text-silver-dim">پیگیری وضعیت، شماره پیگیری و وضعیت هر درخواست.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-silver-dim">
            <Wrench className="h-4 w-4 text-sky" />
            {repairs.length} درخواست
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {repairs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line p-5 text-center text-sm text-silver-dim">
              هنوز درخواست تعمیر ثبت نشده است.
            </div>
          ) : (
            repairs.map((repair) => (
              <div key={repair.id} className="grid gap-3 rounded-xl border border-line bg-white/5 p-4 md:grid-cols-[1.2fr_1fr_1fr_1.1fr] md:items-center">
                <div>
                  <p className="font-bold text-silver-bright">{repair.customer_name}</p>
                  <p className="mt-1 text-xs text-silver-dim">{repair.device}</p>
                </div>

                <div>
                  <p className="text-xs text-silver-dim">شماره پیگیری</p>
                  <p className="mt-1 font-medium text-silver-bright">{repair.tracking_code}</p>
                </div>

                <div>
                  <p className="text-xs text-silver-dim">مشکل</p>
                  <p className="mt-1 font-medium text-silver-bright">{repair.issue}</p>
                </div>

                <div className="flex flex-col gap-2 md:items-end">
                  <select
                    value={repair.status}
                    onChange={(e) => updateRepairStatus(repair.id, e.target.value)}
                    className="w-full rounded-lg border border-line bg-slate-950/40 px-3 py-2 text-sm text-silver-bright outline-none md:max-w-[180px]"
                  >
                    <option value="received">دریافت شد</option>
                    <option value="diagnosing">در حال بررسی</option>
                    <option value="waiting-parts">در انتظار قطعه</option>
                    <option value="repairing">در حال تعمیر</option>
                    <option value="completed">تکمیل شده</option>
                  </select>
                  <span className="text-[11px] text-silver-dim">{new Date(repair.created_at).toLocaleDateString('fa-IR')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-sky/20 bg-sky/5 p-6">
        <div className="flex items-center gap-3 text-sky">
          <Sparkles className="h-5 w-5" />
          <h3 className="font-bold text-silver-bright">کارهای پیشنهادی بعدی</h3>
        </div>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-silver-dim">
          <li>• ثبت مدل‌های جدید آیفون و به‌روزرسانی قیمت‌ها</li>
          <li>• پیگیری درخواست‌های تعمیر و هماهنگی با مشتری</li>
          <li>• اضافه کردن کد تخفیف، موجودی ویژه و گزارش فروش روزانه</li>
        </ul>
      </div>
    </section>
  )
}
