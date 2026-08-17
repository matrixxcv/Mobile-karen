import { useEffect } from 'react'
import { Phone, Clock } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import LocationMap from '@/components/LocationMap'
import {
  STORE_NAME, STORE_ADDRESS, STORE_HOURS,
  STORE_OWNER_PHONE, STORE_OWNER_PHONE_TEL,
  REPAIR_PHONE, REPAIR_PHONE_TEL
} from '@/data/repairs'

export default function Contact() {
  useEffect(() => {
    document.title = 'تماس با ما | موبایل کارن'
  }, [])

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 md:px-8">
      <SectionHeading eyebrow="در دسترس شما" title="تماس با موبایل کارن" description={STORE_NAME} />

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl glass p-6">
            <p className="text-sm text-silver-dim">تماس با فروشگاه (استعلام قیمت و مشاوره خرید)</p>
            <p className="mt-1 font-display text-xl font-extrabold text-silver-bright" dir="ltr">{STORE_OWNER_PHONE}</p>
            <a
              href={`tel:${STORE_OWNER_PHONE_TEL}`}
              className="focus-ring mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue py-3.5 text-sm font-bold text-white shadow-glow-blue transition-transform hover:-translate-y-0.5"
            >
              <Phone className="h-4 w-4" />
              تماس با فروشگاه
            </a>
          </div>

          <div className="rounded-2xl glass p-6">
            <p className="text-sm text-silver-dim">تماس با بخش تعمیرات تخصصی</p>
            <p className="mt-1 font-display text-xl font-extrabold text-silver-bright" dir="ltr">{REPAIR_PHONE}</p>
            <a
              href={`tel:${REPAIR_PHONE_TEL}`}
              className="focus-ring mt-4 flex items-center justify-center gap-2 rounded-xl glass py-3.5 text-sm font-bold text-silver-bright transition-transform hover:-translate-y-0.5 hover:text-sky"
            >
              <Phone className="h-4 w-4 text-sky" />
              تماس با تعمیرات
            </a>
          </div>

          <div className="rounded-2xl glass p-6">
            <p className="flex items-center gap-2 text-sm font-bold text-silver-bright">
              <Clock className="h-4 w-4 text-sky" /> ساعات کاری
            </p>
            <p className="mt-2 text-sm leading-7 text-silver-dim">{STORE_HOURS}</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold text-silver-bright">آدرس فروشگاه</p>
          <LocationMap />
          <p className="mt-3 text-sm leading-7 text-silver-dim">{STORE_ADDRESS}</p>
        </div>
      </div>
    </section>
  )
}
