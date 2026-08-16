import {
  Smartphone, Apple, Bot, MonitorSmartphone as WinIcon, Laptop, Router, Gauge, ShieldHalf
} from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { vpnPlatforms, vpnProtocols } from '@/data/vpn'

const PLATFORM_ICONS: Record<string, typeof Smartphone> = {
  phone: Smartphone,
  apple: Apple,
  android: Bot,
  windows: WinIcon,
  mac: Laptop,
  router: Router
}

export default function VpnInfo() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-8">
      <SectionHeading eyebrow="آشنایی اولیه" title="انواع VPN و پروتکل‌ها" />

      <div className="mt-10">
        <h3 className="font-display text-base font-bold text-silver-bright">انواع VPN بر اساس دستگاه</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {vpnPlatforms.map((p) => {
            const Icon = PLATFORM_ICONS[p.icon] ?? Smartphone
            return (
              <div key={p.id} className="rounded-2xl glass p-4 text-center transition-colors hover:border-sky/40">
                <Icon className="mx-auto h-6 w-6 text-sky" />
                <p className="mt-3 text-sm font-bold text-silver-bright">{p.title}</p>
                <p className="mt-1.5 text-xs leading-5 text-silver-dim">{p.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-display text-base font-bold text-silver-bright">پروتکل‌های رایج</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {vpnProtocols.map((proto) => (
            <div key={proto.id} className="rounded-2xl glass p-5">
              <p className="font-display text-sm font-bold text-silver-bright" dir="ltr">{proto.title}</p>
              <p className="mt-2 text-xs leading-6 text-silver-dim">{proto.description}</p>
              <div className="mt-4 flex items-center gap-4 text-[11px] text-silver-dim">
                <span className="flex items-center gap-1">
                  <Gauge className="h-3.5 w-3.5 text-sky" /> سرعت: {'●'.repeat(proto.speedLevel)}{'○'.repeat(3 - proto.speedLevel)}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldHalf className="h-3.5 w-3.5 text-blue" /> امنیت: {'●'.repeat(proto.securityLevel)}{'○'.repeat(3 - proto.securityLevel)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
