import { Link } from 'react-router-dom'
import { CheckCircle2, ShoppingCart, Smartphone } from 'lucide-react'
import type { Product } from '@/types'
import { getSeriesLabel, getTierLabel } from '@/lib/catalog'
import { useCart } from '@/contexts/CartContext'

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart()

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.priceNote.replace(/[^\d]/g, '')) || 0,
      image: product.image,
      slug: product.id,
      category: 'iphone',
      quantity: 1,
    })
  }

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      className="focus-ring group animate-rise relative flex flex-col overflow-hidden rounded-2xl glass p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky/40 hover:shadow-glow"
    >
      <Link to={`/iphones/${product.id}`} className="flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full border border-line bg-white/5 px-2.5 py-1 text-[11px] font-medium text-silver-dim">
            {getSeriesLabel(product.series)} · {getTierLabel(product.tier)}
          </span>
          {product.inStock && (
            <span className="flex items-center gap-1 text-[11px] text-sky">
              <CheckCircle2 className="h-3.5 w-3.5" /> موجود
            </span>
          )}
        </div>

        <div className="relative mx-auto flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-blue-deep/30 to-transparent">
          <div className="pointer-events-none absolute inset-0 grid-veil opacity-40" />
          <div className="absolute h-24 w-24 rounded-full bg-sky/20 blur-3xl transition-opacity group-hover:opacity-80" />
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="relative z-10 h-36 w-auto object-contain drop-shadow-[0_12px_24px_rgba(37,99,255,0.35)] transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <Smartphone className="relative z-10 hidden h-16 w-16 text-sky/50" strokeWidth={1} />
        </div>

        <h3 className="mt-4 font-display text-base font-bold text-silver-bright">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-silver-dim">{product.shortDescription}</p>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <span className="text-sm font-bold text-sky">{product.priceNote}</span>
          <span className="text-xs text-silver-dim transition-transform group-hover:-translate-x-1">مشاهده جزئیات ←</span>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-blue px-3 py-2.5 text-sm font-bold text-white"
      >
        <ShoppingCart className="h-4 w-4" /> افزودن به سبد خرید
      </button>
    </div>
  )
}
