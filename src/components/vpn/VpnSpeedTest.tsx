import { useState } from 'react'
import { Gauge, Info } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'

export default function VpnSpeedTest() {
  const [testing, setTesting] = useState(false)

  function runTest() {
    setTesting(true)
    setTimeout(() => setTesting(false), 1600)
  }

  const metrics = [
    { label: 'پینگ', value: '—', unit: 'ms' },
    { label: 'دانلود', value: '—', unit: 'Mbps' },
    { label: 'آپلود', value: '—', unit: 'Mbps' }
  ]

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 md:px-8">
      <SectionHeading eyebrow="نمایشی — Demo UI" title="تست سرعت اتصال" />

      <div className="mt-10 rounded-3xl glass-strong p-8 text-center">
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-line bg-white/5 py-5">
              <p className="text-[11px] text-silver-dim">{m.label}</p>
              <p className={`mt-2 font-display text-2xl font-extrabold text-silver-bright ${testing ? 'animate-pulse' : ''}`}>
                {m.value}
              </p>
              <p className="text-[10px] text-silver-dim" dir="ltr">{m.unit}</p>
            </div>
          ))}
        </div>

        <button
          onClick={runTest}
          disabled={testing}
          className="focus-ring mt-8 flex items-center gap-2 rounded-xl bg-blue px-6 py-3 text-sm font-bold text-white shadow-glow-blue transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Gauge className={`h-4 w-4 ${testing ? 'animate-spin' : ''}`} />
          {testing ? 'در حال تست…' : 'شروع تست سرعت'}
        </button>

        <p className="mx-auto mt-6 flex max-w-lg items-start gap-2 text-right text-xs leading-6 text-silver-dim">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
          این بخش صرفاً یک رابط نمایشی است و آماده اتصال به API واقعی تست سرعت در آینده می‌باشد.
        </p>
      </div>
    </section>
  )
}
