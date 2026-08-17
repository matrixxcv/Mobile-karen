import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Phone, CheckCircle2, Smartphone, Cpu, Camera, BatteryFull, Weight, MonitorSmartphone } from 'lucide-react'
import { fetchProductBySlug, getSeriesLabel, getTierLabel } from '@/lib/catalog'
import type { Product } from '@/types'
import { STORE_OWNER_PHONE, STORE_OWNER_PHONE_TEL } from '@/data/repairs'

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchProductBySlug(id).then(setProduct).finally(() => setLoading(false))
    setActiveImage(0)
  }, [id])

  useEffect(() => { if (product) document.title = `${product.name} | موبایل کارن` }, [product])

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-20 text-center text-silver-dim">در حال دریافت محصول...</div>
  if (!product) return <Navigate to="/iphones" replace />

  const specRows = [
    { icon: MonitorSmartphone, label: 'صفحه‌نمایش', value: product.specs.screen },
    { icon: Cpu, label: 'پردازنده', value: product.specs.chip },
    { icon: Camera, label: 'دوربین', value: product.specs.camera },
    { icon: BatteryFull, label: 'باتری', value: product.specs.battery },
    { icon: Weight, label: 'وزن', value: product.specs.weight }
  ]

  return <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
    <nav className="mb-6 text-xs text-silver-dim"><Link to="/iphones" className="focus-ring hover:text-sky">آیفون‌ها</Link><span className="mx-2">/</span><span className="text-silver-bright">{product.name}</span></nav>
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div>
        <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-3xl glass-strong md:h-[420px]"><div className="pointer-events-none absolute inset-0 grid-veil opacity-40"/><div className="absolute h-40 w-40 rounded-full bg-sky/20 blur-3xl"/><img src={product.gallery[activeImage]} alt={product.name} className="relative z-10 h-64 w-auto object-contain drop-shadow-[0_20px_40px_rgba(37,99,255,0.35)] md:h-80" onError={e=>{e.currentTarget.style.display='none';e.currentTarget.nextElementSibling?.classList.remove('hidden')}}/><Smartphone className="relative z-10 hidden h-28 w-28 text-sky/50" strokeWidth={1}/></div>
        <div className="mt-4 grid grid-cols-4 gap-3">{product.gallery.map((src,i)=><button key={src} onClick={()=>setActiveImage(i)} className={`focus-ring flex h-20 items-center justify-center overflow-hidden rounded-xl glass ${activeImage===i?'border-sky/60':'border-line'}`}><img src={src} alt="" className="h-14 w-auto object-contain"/></button>)}</div>
      </div>
      <div>
        <span className="rounded-full border border-line bg-white/5 px-3 py-1 text-xs font-medium text-silver-dim">{getSeriesLabel(product.series)} · {getTierLabel(product.tier)}</span>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-silver-bright md:text-4xl">{product.name}</h1>
        <p className="mt-4 text-sm leading-8 text-silver-dim">{product.description}</p>
        <div className="mt-6">{product.inStock?<span className="flex w-fit items-center gap-1.5 rounded-full border border-sky/30 bg-sky/10 px-3 py-1.5 text-xs font-bold text-sky"><CheckCircle2 className="h-3.5 w-3.5"/> موجود در فروشگاه</span>:<span className="rounded-full border border-line bg-white/5 px-3 py-1.5 text-xs font-bold text-silver-dim">ناموجود</span>}</div>
        <div className="mt-6 rounded-2xl glass p-5"><p className="text-lg font-extrabold text-sky">{product.priceNote}</p><a href={`tel:${STORE_OWNER_PHONE_TEL}`} className="focus-ring mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue py-3.5 text-sm font-bold text-white shadow-glow-blue"><Phone className="h-4 w-4"/> تماس برای استعلام قیمت — {STORE_OWNER_PHONE}</a></div>
        <div className="mt-8"><h2 className="font-display text-lg font-bold text-silver-bright">مشخصات فنی</h2><div className="mt-3 divide-y divide-line rounded-2xl glass">{specRows.map(row=><div key={row.label} className="flex items-center gap-3 px-4 py-3.5"><row.icon className="h-4 w-4 shrink-0 text-sky"/><span className="w-24 shrink-0 text-xs text-silver-dim">{row.label}</span><span className="text-sm text-silver-bright">{row.value}</span></div>)}</div></div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2"><div><h3 className="text-sm font-bold text-silver-bright">ظرفیت‌ها</h3><div className="mt-2 flex flex-wrap gap-2">{product.specs.storageOptions.map(s=><span key={s} className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-xs text-silver-dim">{s}</span>)}</div></div><div><h3 className="text-sm font-bold text-silver-bright">رنگ‌ها</h3><div className="mt-2 flex flex-wrap gap-2">{product.specs.colors.map(c=><span key={c} className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-xs text-silver-dim">{c}</span>)}</div></div></div>
        {product.features.length>0 && <div className="mt-6"><h3 className="text-sm font-bold text-silver-bright">امکانات مهم</h3><ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">{product.features.map(f=><li key={f} className="flex items-center gap-2 text-sm text-silver-dim"><CheckCircle2 className="h-4 w-4 shrink-0 text-blue"/>{f}</li>)}</ul></div>}
      </div>
    </div>
  </section>
}
