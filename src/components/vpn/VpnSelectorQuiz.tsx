import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { vpnServiceSamples } from '@/data/vpn'

const OS_OPTIONS = ['iOS', 'Android', 'Windows', 'macOS', 'روتر']
const GOAL_OPTIONS = ['استفاده روزمره و سبک', 'پایداری بالا برای کار', 'پوشش چند دستگاه هم‌زمان']
const DEVICE_OPTIONS = ['۱ تا ۲ دستگاه', '۳ تا ۵ دستگاه', 'بیش از ۵ دستگاه']

export default function VpnSelectorQuiz() {
  const [os, setOs] = useState<string | null>(null)
  const [goal, setGoal] = useState<string | null>(null)
  const [deviceCount, setDeviceCount] = useState<string | null>(null)

  const done = os && goal && deviceCount

  function recommend() {
    if (!done) return null
    // منطق ساده و کاملاً Frontend برای پیشنهاد از میان داده‌های موجود
    const wantsManyDevices = deviceCount === 'بیش از ۵ دستگاه'
    const wantsStability = goal === 'پایداری بالا برای کار'
    const candidate = vpnServiceSamples.find((s) =>
      wantsManyDevices || wantsStability ? s.id === 'sample-b' : s.id === 'sample-a'
    )
    return candidate ?? vpnServiceSamples[0]
  }

  const result = recommend()

  function OptionGroup({
    title, options, value, onChange
  }: { title: string; options: string[]; value: string | null; onChange: (v: string) => void }) {
    return (
      <div>
        <p className="text-sm font-bold text-silver-bright">{title}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`focus-ring rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                value === opt ? 'border-sky bg-sky/10 text-sky' : 'border-line text-silver-dim hover:text-silver-bright'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 md:px-8">
      <SectionHeading eyebrow="راهنمای انتخاب" title="کدام VPN مناسب شماست؟" />

      <div className="mt-10 flex flex-col gap-6 rounded-3xl glass-strong p-8">
        <OptionGroup title="سیستم‌عامل شما" options={OS_OPTIONS} value={os} onChange={setOs} />
        <OptionGroup title="هدف اصلی استفاده" options={GOAL_OPTIONS} value={goal} onChange={setGoal} />
        <OptionGroup title="تعداد دستگاه‌ها" options={DEVICE_OPTIONS} value={deviceCount} onChange={setDeviceCount} />

        {done && result && (
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-sky/30 bg-sky/10 px-5 py-4">
            <Sparkles className="h-5 w-5 shrink-0 text-sky" />
            <p className="text-sm text-silver-bright">
              بر اساس گزینه‌های شما، <span className="font-bold text-sky">{result.name}</span> از بین داده‌های نمونه، گزینه نزدیک‌تر است.
              این پیشنهاد صرفاً بر اساس منطق نمایشی صفحه است.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
