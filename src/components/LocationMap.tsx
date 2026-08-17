import { ExternalLink, MapPin } from 'lucide-react'
import { STORE_ADDRESS } from '@/data/repairs'

// این کامپوننت آماده اتصال بعدی به Google Maps یا نقشه‌های ایرانی (مثل نشان یا بلد) است.
// در حال حاضر فقط یک نمایش بصری از آدرس ارائه می‌دهد و هیچ نقشه زنده‌ای بارگذاری نمی‌شود.
export default function LocationMap() {
  return (
    <div className="relative flex h-64 flex-col items-center justify-center overflow-hidden rounded-2xl glass p-6 text-center md:h-80">
      <div className="pointer-events-none absolute inset-0 grid-veil opacity-30" />
      <MapPin className="relative z-10 h-10 w-10 text-sky" />
      <p className="relative z-10 mt-4 max-w-xs text-sm leading-7 text-silver-dim">{STORE_ADDRESS}</p>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`}
        target="_blank"
        rel="noreferrer"
        className="focus-ring relative z-10 mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-3 py-2 text-[11px] text-silver-dim hover:border-sky/40 hover:text-sky"
      >
        باز کردن در نقشه
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}
