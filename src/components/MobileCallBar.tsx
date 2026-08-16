import { Phone, Wrench } from 'lucide-react'
import { STORE_OWNER_PHONE_TEL, REPAIR_PHONE_TEL } from '@/data/repairs'

export default function MobileCallBar() {
  return (
    <div className="glass-strong fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-px border-t border-white/10 lg:hidden">
      <a
        href={`tel:${STORE_OWNER_PHONE_TEL}`}
        className="focus-ring flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-bold text-silver-bright"
      >
        <Phone className="h-4 w-4 text-sky" />
        تماس با فروشگاه
      </a>
      <span className="my-2 w-px bg-white/10" />
      <a
        href={`tel:${REPAIR_PHONE_TEL}`}
        className="focus-ring flex flex-1 items-center justify-center gap-2 bg-blue py-3.5 text-sm font-bold text-white"
      >
        <Wrench className="h-4 w-4" />
        تماس با تعمیرات
      </a>
    </div>
  )
}
