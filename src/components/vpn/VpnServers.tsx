import SectionHeading from '@/components/SectionHeading'
import { vpnServerSamples } from '@/data/vpn'
import { Signal } from 'lucide-react'

export default function VpnServers() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-8">
      <SectionHeading
        eyebrow="نمونه / قابل ویرایش — غیر زنده"
        title="سرورها"
        description="کارت‌های زیر صرفاً ساختار نمایش سرور را نشان می‌دهند و به هیچ سرور واقعی متصل نیستند."
      />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vpnServerSamples.map((s) => (
          <div key={s.id} className="rounded-2xl glass p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-display text-sm font-bold text-silver-bright">
                <span className="text-xl">{s.flag}</span> {s.country}
              </span>
              <span className="rounded-full border border-line bg-white/5 px-2.5 py-1 text-[10px] text-silver-dim">
                {s.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-silver-dim">
                <Signal className="h-3.5 w-3.5 text-sky" /> پینگ: <span dir="ltr">{s.ping}</span>
              </div>
              <div className="text-silver-dim">سرعت: <span dir="ltr">{s.speed}</span></div>
              <div className="text-silver-dim">بار سرور: {s.load}</div>
              <div className="text-silver-dim" dir="ltr">{s.protocol}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
