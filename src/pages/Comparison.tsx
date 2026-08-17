import { useEffect, useMemo, useState } from 'react'
import SectionHeading from '@/components/SectionHeading'
import { fetchProducts, getSeriesLabel, getTierLabel } from '@/lib/catalog'
import type { Product } from '@/types'
import { X, Plus } from 'lucide-react'

const MAX_SLOTS = 3

export default function Comparison() {
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<string[]>(['iphone-15-pro', 'iphone-16-pro'])
  const [picking, setPicking] = useState<number | null>(null)

  useEffect(() => {
    document.title = 'مقایسه آیفون‌ها | موبایل کارن'
    fetchProducts().then(setProducts).catch(() => setProducts([]))
  }, [])

  const selectedProducts = useMemo(() => selected.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[], [selected, products])

  const rows: { label: string; get: (p: Product) => string }[] = [
    { label: 'سری', get: (p) => `${getSeriesLabel(p.series)} · ${getTierLabel(p.tier)}` },
    { label: 'صفحه‌نمایش', get: (p) => p.specs.screen },
    { label: 'پردازنده', get: (p) => p.specs.chip },
    { label: 'دوربین', get: (p) => p.specs.camera },
    { label: 'باتری', get: (p) => p.specs.battery },
    { label: 'وزن', get: (p) => p.specs.weight },
    { label: 'ظرفیت‌ها', get: (p) => p.specs.storageOptions.join('، ') },
    { label: 'رنگ‌ها', get: (p) => p.specs.colors.join('، ') },
    { label: 'وضعیت موجودی', get: (p) => (p.inStock ? 'موجود' : 'ناموجود') },
    { label: 'قیمت', get: (p) => p.priceNote }
  ]

  function setSlot(index: number, productId: string) {
    setSelected((prev) => {
      const next = [...prev]
      next[index] = productId
      return next
    })
    setPicking(null)
  }

  function removeSlot(index: number) {
    setSelected((prev) => prev.filter((_, i) => i !== index))
  }

  const slots = Array.from({ length: Math.max(selected.length + (selected.length < MAX_SLOTS ? 1 : 0), 2) })

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-8">
      <SectionHeading
        eyebrow="کنار هم ببینید"
        title="مقایسه آیفون‌ها"
        description="حداقل دو مدل را انتخاب کنید تا مشخصات آن‌ها به‌صورت کنار هم نمایش داده شود."
      />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((_, index) => {
          const productId = selected[index]
          const product = productId ? products.find((p) => p.id === productId) : undefined

          return (
            <div key={index} className="relative rounded-2xl glass p-4">
              {product ? (
                <>
                  <button
                    onClick={() => removeSlot(index)}
                    className="focus-ring absolute left-3 top-3 rounded-lg bg-white/5 p-1.5 text-silver-dim hover:text-silver-bright"
                    aria-label="حذف از مقایسه"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex h-32 items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-24 w-auto object-contain"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                  <p className="mt-2 text-center font-display text-sm font-bold text-silver-bright">{product.name}</p>
                </>
              ) : (
                <button
                  onClick={() => setPicking(index)}
                  className="focus-ring flex h-full min-h-[9.5rem] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line text-silver-dim hover:border-sky/40 hover:text-sky"
                >
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">افزودن مدل</span>
                </button>
              )}

              {picking === index && (
                <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-xl glass-strong p-2">
                  {products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSlot(index, p.id)}
                      className="focus-ring block w-full rounded-lg px-3 py-2 text-right text-sm text-silver-dim hover:bg-white/5 hover:text-silver-bright"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedProducts.length >= 2 ? (
        <div className="mt-10 overflow-x-auto rounded-2xl glass">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                  <th className="whitespace-nowrap border-l border-line px-4 py-3.5 text-right text-xs font-bold text-silver-dim">
                    {row.label}
                  </th>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="px-4 py-3.5 text-silver-bright">
                      {row.get(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-silver-dim">برای مشاهده جدول مقایسه، حداقل دو مدل انتخاب کنید.</p>
      )}
    </section>
  )
}
