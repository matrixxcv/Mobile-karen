import { FormEvent, useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Phone, Smartphone, Wrench } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { REPAIR_PHONE, REPAIR_PHONE_TEL } from '@/data/repairs'
import { getSupabaseSetupMessage, supabase, supabaseConfigured } from '@/lib/supabase'

type FormState = {
  name: string
  phone: string
  model: string
  issue: string
  description: string
}

const initialForm: FormState = {
  name: '',
  phone: '',
  model: '',
  issue: 'نمایشگر',
  description: ''
}

export default function RepairRequest() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    document.title = 'درخواست تعمیر | موبایل کارن'
  }, [])

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (!supabaseConfigured || !supabase) {
        setMessage(getSupabaseSetupMessage() || 'Supabase فعال نیست؛ برای ثبت واقعی درخواست، متغیرهای محیطی را مقداردهی کنید.')
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase.from('repairs').insert({
        user_id: user?.id ?? null,
        customer_name: form.name,
        phone: form.phone,
        device: form.model,
        issue: form.issue,
        notes: form.description,
        status: 'received'
      })

      if (error) throw error

      setSubmitted(true)
      setForm(initialForm)
      setMessage('درخواست شما با موفقیت ثبت شد. تیم فنی در کوتاه‌ترین زمان با شما تماس می‌گیرد.')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'ثبت درخواست انجام نشد.'
      setMessage(msg)
      setSubmitted(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-8">
      <SectionHeading
        eyebrow="درخواست تعمیر"
        title="ثبت درخواست تعمیر آیفون"
        description="برای بررسی سریع‌تر دستگاه، مدل، مشکل و اطلاعات تماس خود را وارد کنید تا تیم فنی موبایل کارن با شما هماهنگ شود."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl glass-strong p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-silver-dim">نام و نام خانوادگی</span>
              <input
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-silver-bright outline-none transition focus:border-sky/60"
                placeholder="مثال: علی رضایی"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-silver-dim">شماره تماس</span>
              <input
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
                dir="ltr"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-silver-bright outline-none transition focus:border-sky/60"
                placeholder="09xxxxxxxxx"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm text-silver-dim">مدل دستگاه</span>
              <input
                value={form.model}
                onChange={(e) => handleChange('model', e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-silver-bright outline-none transition focus:border-sky/60"
                placeholder="مثال: آیفون 15 Pro Max"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm text-silver-dim">نوع مشکل</span>
              <select
                value={form.issue}
                onChange={(e) => handleChange('issue', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-silver-bright outline-none transition focus:border-sky/60"
              >
                <option value="نمایشگر">نمایشگر</option>
                <option value="باتری">باتری</option>
                <option value="دوربین">دوربین</option>
                <option value="شارژ">شارژ</option>
                <option value="صدا">صدا</option>
                <option value="نرم‌افزاری">نرم‌افزاری</option>
                <option value="سایر">سایر</option>
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm text-silver-dim">توضیحات مشکل</span>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={5}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-silver-bright outline-none transition focus:border-sky/60"
                placeholder="مشکل دستگاه را به‌صورت دقیق توضیح دهید..."
              />
            </label>
          </div>

          {(submitted || message) && (
            <div className={`mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${submitted ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-200'}`}>
              {submitted && <CheckCircle2 className="h-4 w-4" />}
              {message || 'درخواست شما با موفقیت ثبت شد. تیم فنی در کوتاه‌ترین زمان با شما تماس می‌گیرد.'}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue px-6 py-3.5 text-sm font-bold text-white shadow-glow-blue transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wrench className="h-4 w-4" />}
            {loading ? 'در حال ثبت درخواست...' : 'ثبت درخواست تعمیر'}
          </button>
        </form>

        <aside className="space-y-5">
          <div className="rounded-3xl glass p-6">
            <div className="flex items-center gap-3 text-sky">
              <Phone className="h-5 w-5" />
              <span className="font-bold text-silver-bright">تماس مستقیم</span>
            </div>
            <p className="mt-4 font-display text-2xl font-extrabold text-silver-bright" dir="ltr">{REPAIR_PHONE}</p>
            <a
              href={`tel:${REPAIR_PHONE_TEL}`}
              className="focus-ring mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-silver-bright transition hover:text-sky"
            >
              <Phone className="h-4 w-4 text-sky" />
              تماس فوری
            </a>
          </div>

          <div className="rounded-3xl glass p-6">
            <div className="flex items-center gap-3 text-sky">
              <Smartphone className="h-5 w-5" />
              <span className="font-bold text-silver-bright">نکات مهم</span>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-silver-dim">
              <li>• مدل دقیق دستگاه را وارد کنید تا زمان بررسی دقیق‌تر شود.</li>
              <li>• اگر دستگاه در حال شارژ نیست یا صفحه‌نمایش شکستگی دارد، نوع مشکل را مشخص کنید.</li>
              <li>• برای تعمیرات تخصصی، قبل از ارسال دستگاه، هماهنگی تلفنی انجام می‌شود.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}
