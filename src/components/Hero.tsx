import { Link } from 'react-router-dom'
import { ShieldCheck, Wrench, Smartphone, ArrowLeft } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
      <div className="pointer-events-none absolute inset-0 grid-veil" />
      <div className="pointer-events-none absolute right-1/2 top-0 h-[420px] w-[420px] translate-x-1/2 rounded-full bg-blue/25 blur-[110px] animate-pulseglow" />
      <div className="pointer-events-none absolute left-10 top-40 h-56 w-56 rounded-full bg-sky/20 blur-[90px]" />

      <div className="relative mx-auto max-w-5xl text-center">
        <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-4 py-1.5 text-xs font-medium text-sky">
          فروش تخصصی آیفون در ملایر
        </span>

        <h1 className="animate-rise mt-6 font-display text-4xl font-extrabold leading-[1.25] text-silver-bright md:text-6xl" style={{ animationDelay: '80ms' }}>
          <span className="text-gradient">دنیای آیفون</span> در موبایل کارن
        </h1>

        <p className="animate-rise mx-auto mt-5 max-w-2xl text-base leading-8 text-silver-dim md:text-lg" style={{ animationDelay: '160ms' }}>
          جدیدترین مدل‌های آیفون، مشاوره تخصصی و خدمات تعمیرات حرفه‌ای
        </p>

        <div className="animate-rise mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '240ms' }}>
          <Link
            to="/iphones"
            className="focus-ring flex items-center gap-2 rounded-xl bg-blue px-6 py-3.5 text-sm font-bold text-white shadow-glow-blue transition-transform hover:-translate-y-0.5"
          >
            <Smartphone className="h-4 w-4" />
            مشاهده آیفون‌ها
          </Link>
          <Link
            to="/contact"
            className="focus-ring rounded-xl glass px-6 py-3.5 text-sm font-bold text-silver-bright transition-transform hover:-translate-y-0.5"
          >
            استعلام قیمت
          </Link>
          <Link
            to="/repairs"
            className="focus-ring flex items-center gap-2 rounded-xl glass px-6 py-3.5 text-sm font-bold text-silver-bright transition-transform hover:-translate-y-0.5"
          >
            <Wrench className="h-4 w-4 text-sky" />
            خدمات تعمیرات
          </Link>
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-4xl animate-rise" style={{ animationDelay: '320ms' }}>
        <Link
          to="/vpn"
          className="focus-ring group flex flex-col items-center gap-6 overflow-hidden rounded-3xl glass-strong p-8 text-center transition-all hover:border-sky/40 hover:shadow-glow md:flex-row md:text-right"
        >
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky/20 to-blue/20 ring-1 ring-sky/30">
            <ShieldCheck className="h-8 w-8 text-sky" />
            <span className="absolute inset-0 rounded-2xl bg-sky/20 blur-lg animate-pulseglow" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-silver-bright">بخش VPN موبایل کارن</h2>
            <p className="mt-2 text-sm leading-7 text-silver-dim">
              راهنمای انتخاب، بررسی و مدیریت سرویس‌های VPN در یک محیط حرفه‌ای
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-xl border border-line bg-white/5 px-5 py-3 text-sm font-bold text-sky transition-transform group-hover:-translate-x-1">
            ورود به بخش VPN
            <ArrowLeft className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </section>
  )
}
