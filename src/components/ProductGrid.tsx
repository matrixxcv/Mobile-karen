import { useEffect, useMemo, useState } from 'react'
import { fetchProducts, getSeriesLabel, getTierLabel } from '@/lib/catalog'
import type { Product } from '@/types'
import ProductCard from './ProductCard'
import ProductFilters, { type SeriesFilter, type TierFilter } from './ProductFilters'
import SearchBar from './SearchBar'
import { SearchX } from 'lucide-react'

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [series, setSeries] = useState<SeriesFilter>('all')
  const [tier, setTier] = useState<TierFilter>('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setError('دریافت محصولات از Supabase انجام نشد.')).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (series !== 'all' && p.series !== series) return false
      if (tier !== 'all' && p.tier !== tier) return false
      if (q) {
        const haystack = `${p.name} ${getSeriesLabel(p.series)} ${getTierLabel(p.tier)} ${p.shortDescription}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [products, series, tier, query])

  return <div>
    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
      <ProductFilters series={series} tier={tier} onSeriesChange={setSeries} onTierChange={setTier} />
      <div className="w-full md:w-80"><SearchBar value={query} onChange={setQuery} /></div>
    </div>
    {loading ? <div className="mt-16 text-center text-silver-dim">در حال دریافت محصولات از Supabase...</div> :
      error ? <div className="mt-16 text-center text-red-300">{error}</div> :
      filtered.length > 0 ? <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div> :
      <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center"><SearchX className="h-10 w-10 text-silver-dim"/><p className="text-silver-dim">محصولی در دیتابیس پیدا نشد. ابتدا Seed محصولات را اجرا کنید.</p></div>}
  </div>
}
