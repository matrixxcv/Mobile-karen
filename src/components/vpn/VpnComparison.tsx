import SectionHeading from '@/components/SectionHeading'
import { vpnServiceSamples } from '@/data/vpn'

function DotScale({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="text-sky" aria-label={`${value} از ${max}`}>
      {'●'.repeat(value)}
      <span className="text-line">{'●'.repeat(max - value)}</span>
    </span>
  )
}

export default function VpnComparison() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-8">
      <SectionHeading
        eyebrow="داده‌های نمونه — قابل ویرایش"
        title="مقایسه سرویس‌های VPN"
        description="این جدول با داده‌های نمونه ساخته شده و برای اتصال بعدی به اطلاعات واقعی سرویس‌ها طراحی شده است."
      />

      <div className="mt-10 overflow-x-auto rounded-2xl glass">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-right text-xs text-silver-dim">
              <th className="px-4 py-3.5">سرویس</th>
              <th className="px-4 py-3.5">سرعت</th>
              <th className="px-4 py-3.5">پایداری</th>
              <th className="px-4 py-3.5">تعداد دستگاه</th>
              <th className="px-4 py-3.5">سیستم‌عامل‌ها</th>
              <th className="px-4 py-3.5">پروتکل‌ها</th>
              <th className="px-4 py-3.5">موقعیت سرورها</th>
              <th className="px-4 py-3.5">مصرف منابع</th>
              <th className="px-4 py-3.5">سهولت استفاده</th>
            </tr>
          </thead>
          <tbody>
            {vpnServiceSamples.map((s, i) => (
              <tr key={s.id} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                <td className="whitespace-nowrap px-4 py-3.5 font-bold text-silver-bright">{s.name}</td>
                <td className="px-4 py-3.5"><DotScale value={s.speed} /></td>
                <td className="px-4 py-3.5"><DotScale value={s.stability} /></td>
                <td className="whitespace-nowrap px-4 py-3.5 text-silver-dim">{s.deviceCount}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-silver-dim" dir="ltr">{s.supportedOS.join(', ')}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-silver-dim" dir="ltr">{s.protocols.join(', ')}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-silver-dim">{s.serverLocations}</td>
                <td className="px-4 py-3.5 text-silver-dim">{s.resourceUsage}</td>
                <td className="px-4 py-3.5"><DotScale value={s.easeOfUse} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
