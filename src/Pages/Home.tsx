import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Hero from '@/components/Hero'
import SectionHeading from '@/components/SectionHeading'
import ProductCard from '@/components/ProductCard'
import { fetchProducts } from '@/lib/catalog'
import type { Product } from '@/types'
import { ArrowLeft } from 'lucide-react'

export default function Home() {
  useEffect(() => {
    document.title = 'موبایل کارن | فروش آیفون و تعمیرات تخصصی موبایل در ملایر'
  }, [])

  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => { fetchProducts().then(setProducts).catch(() => setProducts([])) }, [])
  const featured = products.filter((p) => p.tier === 'pro' || p.tier === 'promax').slice(0, 4)

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <SectionHeading
          eyebrow="محصولات پرطرفدار"
          title="مدل‌های پرفروش سری پرو"
          description="از آیفون ۱۳ تا جدیدترین آیفون ۱۷، تمام ۱۵ مدل در فروشگاه موبایل کارن موجود است."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            to="/iphones"
            className="focus-ring flex items-center gap-2 rounded-xl glass px-6 py-3 text-sm font-bold text-silver-bright hover:text-sky"
          >
            مشاهده همه ۱۵ مدل آیفون
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
