import { Link } from 'react-router-dom'
import { Phone, MapPin } from 'lucide-react'
import { STORE_NAME, STORE_ADDRESS, STORE_OWNER_PHONE, REPAIR_PHONE, STORE_OWNER_PHONE_TEL, REPAIR_PHONE_TEL } from '@/data/repairs'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line pb-24 pt-14 lg:pb-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:grid-cols-3 md:px-8">
        <div>
          <h3 className="font-display text-lg font-bold text-silver-bright">{STORE_NAME}</h3>
          <p className="mt-3 flex items-start gap-2 text-sm leading-7 text-silver-dim">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
            {STORE_ADDRESS}
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-silver-bright">تماس سریع</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <a href={`tel:${STORE_OWNER_PHONE_TEL}`} className="focus-ring flex items-center gap-2 text-silver-dim hover:text-sky">
              <Phone className="h-4 w-4 text-blue" /> فروشگاه: {STORE_OWNER_PHONE}
            </a>
            <a href={`tel:${REPAIR_PHONE_TEL}`} className="focus-ring flex items-center gap-2 text-silver-dim hover:text-sky">
              <Phone className="h-4 w-4 text-blue" /> تعمیرات: {REPAIR_PHONE}
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-silver-bright">دسترسی سریع</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/accessories" className="focus-ring text-silver-dim hover:text-sky">لوازم جانبی موبایل</Link>
            <Link to="/iphones" className="focus-ring text-silver-dim hover:text-sky">فروشگاه آیفون</Link>
            <Link to="/repairs" className="focus-ring text-silver-dim hover:text-sky">تعمیرات تخصصی</Link>
            <Link to="/vpn" className="focus-ring text-silver-dim hover:text-sky">مرکز VPN</Link>
            <Link to="/contact" className="focus-ring text-silver-dim hover:text-sky">تماس با ما</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-4 text-xs text-silver-dim/70 md:px-8">
        © {new Date().getFullYear()} موبایل کارن — تمام حقوق محفوظ است.
      </div>
    </footer>
  )
}
