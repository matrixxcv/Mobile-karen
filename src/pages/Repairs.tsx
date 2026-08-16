import { useEffect } from 'react'
import {
  Wrench, BatteryFull, MonitorSmartphone, Cpu, Camera, Plug, Volume2, Mic, Code2, Search, Phone
} from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { repairServices, REPAIR_PHONE, REPAIR_PHONE_TEL } from '@/data/repairs'

const ICONS: Record<string, typeof Wrench> = {
  wrench: Wrench,
  battery: BatteryFull,
  screen: MonitorSmartphone,
  chip: Cpu,
  camera: Camera,
  plug: Plug,
  speaker: Volume2,
  mic: Mic,
  software: Code2,
  search: Search
}

export default function Repairs() {
  useEffect(() => {
    document.title = 'تعمیرات تخصصی موبایل | موبایل کارن'
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-8">
      <SectionHeading
        eyebrow="با تضمین کیفیت"
        title="تعمیرات تخصصی موبایل کارن"
        description="تیم فنی موبایل کارن، تمام مشکلات سخت‌افزاری و نرم‌افزاری آیفون شما را با دقت بررسی و رفع می‌کند."
      />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repairServices.map((s) => {
          const Icon = ICONS[s.icon] ?? Wrench
          return (
            <div key={s.id} className="group rounded-2xl glass p-5 transition-colors hover:border-sky/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue/20 to-sky/20 ring-1 ring-white/10">
                <Icon className="h-5 w-5 text-sky" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-silver-bright">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-silver-dim">{s.description}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl glass-strong p-8 text-center">
        <p className="text-sm text-silver-dim">شماره تماس مستقیم بخش تعمیرات</p>
        <p className="font-display text-2xl font-extrabold text-silver-bright" dir="ltr">{REPAIR_PHONE}</p>
        <a
          href={`tel:${REPAIR_PHONE_TEL}`}
          className="focus-ring flex items-center gap-2 rounded-xl bg-blue px-8 py-4 text-base font-bold text-white shadow-glow-blue transition-transform hover:-translate-y-0.5"
        >
          <Phone className="h-5 w-5" />
          تماس با بخش تعمیرات
        </a>
      </div>
    </section>
  )
}
