import { useState } from 'react'
import { Power, Info } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'

type Status = 'disconnected' | 'connecting' | 'connected'

export default function VpnConnectionStatus() {
  const [status, setStatus] = useState<Status>('disconnected')

  function toggle() {
    if (status === 'disconnected') {
      setStatus('connecting')
      setTimeout(() => setStatus('connected'), 1400)
    } else {
      setStatus('disconnected')
    }
  }

  const statusLabel: Record<Status, string> = {
    disconnected: 'قطع',
    connecting: 'در حال اتصال…',
    connected: 'متصل'
  }
  const statusColor: Record<Status, string> = {
    disconnected: 'text-silver-dim',
    connecting: 'text-sky animate-pulse',
    connected: 'text-sky'
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 md:px-8">
      <SectionHeading eyebrow="نمایشی — Demo UI" title="وضعیت اتصال" />

      <div className="mt-10 rounded-3xl glass-strong p-8 text-center">
        <button
          onClick={toggle}
          className={`focus-ring mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 transition-all ${
            status === 'connected'
              ? 'border-sky bg-sky/10 shadow-glow'
              : status === 'connecting'
                ? 'border-sky/50 bg-sky/5'
                : 'border-line bg-white/5'
          }`}
          aria-pressed={status === 'connected'}
        >
          <Power className={`h-9 w-9 ${statusColor[status]}`} />
        </button>
        <p className={`mt-4 font-display text-lg font-bold ${statusColor[status]}`}>{statusLabel[status]}</p>

        <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-4 text-right">
          <div className="rounded-xl border border-line bg-white/5 px-4 py-3">
            <p className="text-[11px] text-silver-dim">آدرس IP</p>
            <p className="mt-1 text-sm text-silver-bright" dir="ltr">—</p>
          </div>
          <div className="rounded-xl border border-line bg-white/5 px-4 py-3">
            <p className="text-[11px] text-silver-dim">کشور سرور</p>
            <p className="mt-1 text-sm text-silver-bright">—</p>
          </div>
          <div className="rounded-xl border border-line bg-white/5 px-4 py-3">
            <p className="text-[11px] text-silver-dim">مدت اتصال</p>
            <p className="mt-1 text-sm text-silver-bright" dir="ltr">—</p>
          </div>
          <div className="rounded-xl border border-line bg-white/5 px-4 py-3">
            <p className="text-[11px] text-silver-dim">پینگ</p>
            <p className="mt-1 text-sm text-silver-bright" dir="ltr">—</p>
          </div>
        </div>

        <p className="mx-auto mt-8 flex max-w-lg items-start gap-2 text-right text-xs leading-6 text-silver-dim">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
          برای نمایش اطلاعات واقعی اتصال، سرویس VPN باید به API یا زیرساخت مربوطه متصل شود.
        </p>
      </div>
    </section>
  )
}
