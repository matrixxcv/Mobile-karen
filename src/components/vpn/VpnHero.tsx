import { ShieldCheck, Network } from 'lucide-react'

export default function VpnHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-12 md:px-8 md:pb-20 md:pt-16">
      <div className="pointer-events-none absolute inset-0 grid-veil" />
      <div className="pointer-events-none absolute right-1/2 top-0 h-[380px] w-[380px] translate-x-1/2 rounded-full bg-sky/25 blur-[110px] animate-pulseglow" />

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-4 py-1.5 text-xs font-medium text-sky">
          <Network className="h-3.5 w-3.5" />
          امنیت و اتصال شبکه
        </span>
        <h1 className="animate-rise mt-6 font-display text-3xl font-extrabold text-silver-bright md:text-5xl" style={{ animationDelay: '80ms' }}>
          <span className="text-gradient">مرکز VPN</span> موبایل کارن
        </h1>
        <p className="animate-rise mx-auto mt-4 max-w-xl text-sm leading-8 text-silver-dim md:text-base" style={{ animationDelay: '160ms' }}>
          راهنمای انتخاب، بررسی و مدیریت سرویس‌های VPN
        </p>
        <div className="animate-rise mt-6 flex items-center justify-center gap-2 text-xs text-silver-dim" style={{ animationDelay: '240ms' }}>
          <ShieldCheck className="h-4 w-4 text-sky" />
          تمام اطلاعات این بخش آموزشی و ساختاری است و به زیرساخت زنده متصل نیست.
        </div>
      </div>
    </section>
  )
}
