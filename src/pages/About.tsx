import { useEffect } from 'react'
import SectionHeading from '@/components/SectionHeading'
import { ShieldCheck, Wrench, Smartphone } from 'lucide-react'

export default function About() {
  useEffect(() => {
    document.title = 'درباره ما | موبایل کارن'
  }, [])

  const points = [
    { icon: Smartphone, title: 'فروش تخصصی آیفون', text: 'عرضه ۱۵ مدل آیفون از سری ۱۳ تا ۱۷ با مشاوره تخصصی پیش از خرید.' },
    { icon: Wrench, title: 'تعمیرات حرفه‌ای', text: 'تعمیر تخصصی سخت‌افزار و نرم‌افزار آیفون توسط تکنسین مجرب.' },
    { icon: ShieldCheck, title: 'مرکز راهنمای VPN', text: 'راهنمای انتخاب و مدیریت سرویس‌های VPN در محیطی حرفه‌ای و شفاف.' }
  ]

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 md:px-8">
      <SectionHeading
        eyebrow="موبایل کارن"
        title="درباره ما"
        description="موبایل کارن در ملایر با تمرکز بر فروش تخصصی آیفون و ارائه خدمات تعمیرات حرفه‌ای، تجربه‌ای مطمئن برای مشتریان خود فراهم می‌کند."
      />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {points.map((p) => (
          <div key={p.title} className="rounded-2xl glass p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue/20 to-sky/20 ring-1 ring-white/10">
              <p.icon className="h-6 w-6 text-sky" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-silver-bright">{p.title}</h3>
            <p className="mt-2 text-sm leading-6 text-silver-dim">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
