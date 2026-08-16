import type { Product, ProductSpecs, AccessoryProduct } from '@/types'
import { supabase } from '@/lib/supabase'

export type DbProduct = {
  id: string
  slug: string
  name: string
  category: string
  description: string | null
  price: number
  stock: number
  image_url: string | null
  specs: ProductSpecs & { features?: string[] }
  colors: string[]
  storage_options: string[]
  active: boolean
}

function seriesFromSlug(slug: string): Product['series'] {
  const n = Number(slug.match(/iphone-(13|14|15|16|17)/)?.[1] ?? 13)
  return n as Product['series']
}

function tierFromSlug(slug: string): Product['tier'] {
  if (slug.endsWith('-pro-max')) return 'promax'
  if (slug.endsWith('-pro')) return 'pro'
  return 'standard'
}

export function getSeriesLabel(series: Product['series']) {
  return `آیفون ${toPersianDigits(series)}`
}

export function getTierLabel(tier: Product['tier']) {
  if (tier === 'standard') return 'معمولی'
  if (tier === 'pro') return 'پرو'
  return 'پرو مکس'
}

export function toPersianDigits(input: number | string) {
  const map: Record<string, string> = {'0':'۰','1':'۱','2':'۲','3':'۳','4':'۴','5':'۵','6':'۶','7':'۷','8':'۸','9':'۹'}
  return String(input).replace(/[0-9]/g, d => map[d])
}

export function mapDbProduct(row: DbProduct): Product {
  const image = row.image_url || `/assets/products/${row.slug}/1.svg`
  return {
    id: row.slug,
    series: seriesFromSlug(row.slug),
    tier: tierFromSlug(row.slug),
    name: row.name,
    shortDescription: row.description || 'مشخصات و موجودی این محصول از دیتابیس فروشگاه دریافت می‌شود.',
    description: row.description || '',
    specs: {
      screen: row.specs?.screen || '—',
      chip: row.specs?.chip || '—',
      camera: row.specs?.camera || '—',
      battery: row.specs?.battery || '—',
      weight: row.specs?.weight || '—',
      storageOptions: row.storage_options || row.specs?.storageOptions || [],
      colors: row.colors || row.specs?.colors || [],
    },
    features: row.specs?.features || [],
    inStock: row.stock > 0,
    image,
    gallery: [1,2,3,4].map(i => i === 1 ? image : `/assets/products/${row.slug}/${i}.svg`),
    priceNote: row.price > 0 ? `${new Intl.NumberFormat('fa-IR').format(row.price)} تومان` : 'برای استعلام قیمت تماس بگیرید',
  }
}

export async function fetchProducts(): Promise<Product[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('products').select('*').eq('active', true).order('slug')
  if (error) throw error
  return (data as DbProduct[]).map(mapDbProduct)
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).eq('active', true).maybeSingle()
  if (error) throw error
  return data ? mapDbProduct(data as DbProduct) : null
}

export async function fetchAccessories(): Promise<AccessoryProduct[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('accessories').select('*').eq('active', true).order('name')
  if (error) throw error
  return (data || []).map((row: any) => ({
    id: row.slug,
    name: row.name,
    category: row.category,
    description: row.description || '',
    price: row.price,
    oldPrice: row.compare_at_price || undefined,
    inStock: row.stock > 0,
    image: row.image_url || '/favicon.svg',
    features: row.specs?.features || [],
  }))
}
