import { useEffect } from 'react'
import SectionHeading from '@/components/SectionHeading'
import ProductGrid from '@/components/ProductGrid'

export default function Products() {
  useEffect(() => {
    document.title = 'فروشگاه آیفون | موبایل کارن'
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <SectionHeading
        eyebrow="۱۵ مدل، پنج نسل"
        title="فروشگاه آیفون موبایل کارن"
        description="از سری ۱۳ تا سری ۱۷؛ با فیلتر و جستجوی زنده، مدل مورد نظر خود را پیدا کنید."
      />
      <div className="mt-10">
        <ProductGrid />
      </div>
    </section>
  )
}
