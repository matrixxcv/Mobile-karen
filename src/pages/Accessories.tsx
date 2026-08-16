import { useEffect, useState } from 'react'
import { fetchAccessories } from '@/lib/catalog'
import type { AccessoryProduct } from '@/types'
import SectionHeading from '@/components/SectionHeading'

const labels:Record<string,string>={charger:'شارژر',cable:'کابل',handsfree:'هندزفری',adapter:'تبدیل',case:'قاب'}
export default function Accessories(){
 const [items,setItems]=useState<AccessoryProduct[]>([]); const [loading,setLoading]=useState(true)
 useEffect(()=>{fetchAccessories().then(setItems).catch(()=>setItems([])).finally(()=>setLoading(false))},[])
 return <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
  <SectionHeading eyebrow="اکسسوری موبایل" title="لوازم جانبی موبایل کارن" description="قیمت و موجودی لوازم جانبی از Supabase دریافت می‌شود و از پنل مدیریت قابل کنترل است."/>
  {loading?<div className="mt-12 text-center text-silver-dim">در حال دریافت لوازم جانبی...</div>:<div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
   {items.map(a=><article key={a.id} className="glass overflow-hidden rounded-2xl"><img src={a.image} alt={a.name} className="aspect-square w-full object-cover"/><div className="p-4"><span className="text-xs text-sky">{labels[a.category] || a.category}</span><h2 className="mt-1 font-bold text-silver-bright">{a.name}</h2><p className="mt-2 text-xs leading-6 text-silver-dim">{a.description}</p><p className="mt-3 font-bold text-sky">{a.price>0?`${new Intl.NumberFormat('fa-IR').format(a.price)} تومان`:'برای استعلام قیمت'}</p><button className="mt-4 w-full rounded-xl bg-white/5 py-2 text-sm font-bold text-silver-bright">افزودن به سبد</button></div></article>)}
   {!items.length&&!loading&&<p className="col-span-full text-center text-silver-dim">هنوز لوازم جانبی در دیتابیس ثبت نشده است.</p>}
  </div>}
 </section>
}
