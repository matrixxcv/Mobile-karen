import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeItem, clearCart } = useCart()

  if (!items.length) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="glass rounded-3xl p-8">
          <ShoppingCart className="mx-auto h-12 w-12 text-sky" />
          <h1 className="mt-5 font-display text-3xl font-extrabold text-silver-bright">سبد خرید خالی است</h1>
          <p className="mt-3 text-silver-dim">محصولی به سبد شما اضافه نشده است.</p>
          <Link to="/iphones" className="mt-6 inline-block rounded-xl bg-blue px-5 py-3 font-bold text-white">
            ادامه خرید
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-sky">سبد خرید</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-silver-bright">محصولات انتخابی</h1>
        </div>
        <button onClick={clearCart} className="rounded-xl border border-line bg-white/5 px-4 py-2 text-sm text-silver-dim">
          خالی کردن سبد
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="glass flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center">
              <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />

              <div className="flex-1">
                <h2 className="font-bold text-silver-bright">{item.name}</h2>
                <p className="mt-1 text-sm text-sky">{new Intl.NumberFormat('fa-IR').format(item.price)} تومان</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-silver-bright"
                  aria-label="کاهش تعداد"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center font-bold text-silver-bright">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-silver-bright"
                  aria-label="افزایش تعداد"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="flex items-center gap-2 rounded-xl border border-line bg-white/5 px-3 py-2 text-sm text-silver-dim"
              >
                <Trash2 className="h-4 w-4" /> حذف
              </button>
            </div>
          ))}
        </div>

        <aside className="glass h-fit rounded-2xl p-5">
          <h2 className="font-display text-xl font-bold text-silver-bright">جمع سفارش</h2>
          <div className="mt-4 space-y-3 text-sm text-silver-dim">
            <div className="flex justify-between">
              <span>تعداد کالا</span>
              <span>{itemCount}</span>
            </div>
            <div className="flex justify-between">
              <span>جمع کل</span>
              <span className="font-bold text-sky">{new Intl.NumberFormat('fa-IR').format(subtotal)} تومان</span>
            </div>
          </div>
          <button className="mt-5 w-full rounded-xl bg-blue py-3 font-bold text-white">
            تکمیل خرید
          </button>
        </aside>
      </div>
    </section>
  )
}
