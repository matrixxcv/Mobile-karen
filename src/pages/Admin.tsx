import { useEffect, useMemo, useState } from 'react'
import { supabase, supabaseConfigured } from '@/lib/supabase'
import { products as localProducts } from '@/data/products'
import { Link } from 'react-router-dom'
import {
  Boxes,
  BriefcaseBusiness,
  PackageCheck,
  PencilLine,
  ShieldCheck,
  Sparkles,
  Wrench,
  ArrowUpRight,
  CircleDollarSign,
  ShoppingCart
} from 'lucide-react'

type Row = { id: string; name: string; price: number; stock: number; active: boolean }
type RepairRow = {
  id: string
  tracking_code: string
  customer_name: string
  phone: string
  device: string
  issue: string
  notes: string | null
  status: string
  created_at: string
}
type OrderRow = {
  id: string
  customer_name: string
  phone: string
  total_amount: number
  status: string
  created_at: string
  payment_status?: string
}

type TrendPoint = {
  day: string
  revenue: number
  orders: number
}

function getDayLabel(date: string) {
  const parsed = new Date(date)
  const formatter = new Intl.DateTimeFormat('fa-IR', { weekday: 'short' })
  return formatter.format(parsed)
}

function TrendSparkline({ data }: { data: TrendPoint[] }) {
  const width = 520
  const height = 180
  const max = Math.max(...data.map((point) => point.revenue), 1)
  const min = Math.min(...data.map((point) => point.revenue), 0)

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((point.revenue - min) / Math.max(max - min, 1)) * (height - 24) - 12
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full">
      <defs>
        <linearGradient id="sales-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {[0, 1, 2, 3].map((line) => (
        <line
          key={line}
          x1="0"
          x2={width}
          y1={14 + line * 38}
          y2={14 + line * 38}
          stroke="rgba(255,255,255,0.08)"
          strokeDasharray="5 8"
        />
      ))}

      <polyline
        fill="none"
        stroke="#38bdf8"
        strokeWidth="3"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {data.map((point, index) => {
        const x = (index / (data.length - 1)) * width
        const y = height - ((point.revenue - min) / Math.max(max - min, 1)) * (height - 24) - 12
        return (
          <g key={point.day}>
            <circle cx={x} cy={y} r="4" fill="#f8fafc" stroke="#38bdf8" strokeWidth="2" />
            <text x={x} y={height - 2} textAnchor="middle" fill="#94a3b8" fontSize="11">{point.day}</text>
          </g>
        )
      })}
    </svg>
  )
}

function StatusBars({ data }: { data: Array<{ label: string; value: number; color: string }> }) {
  const max = Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between text-xs text-silver-dim">
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/5">
            <div
              className="h-full rounded-full"
              style={{ width: `${(item.value / max) * 100}%`, background: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function buildDemoProducts(): Row[] {
  return localProducts.slice(0, 8).map((product, index) => ({
    id: product.id,
    name: product.name,
    price: 3200000 + index * 850000,
    stock: 12 + (index % 5) * 7,
    active: true
  }))
}

function buildDemoOrders(): OrderRow[] {
  const base = [
    { customer_name: 'مریم حسینی', phone: '09120001111', total_amount: 18000000, status: 'paid', payment_status: 'paid', daysAgo: 0 },
    { customer_name: 'احسان رضایی', phone: '09123334444', total_amount: 24500000, status: 'processing', payment_status: 'paid', daysAgo: 1 },
    { customer_name: 'نرگس احمدی', phone: '09125556666', total_amount: 11200000, status: 'pending', payment_status: 'unpaid', daysAgo: 2 },
    { customer_name: 'سامان قاسمی', phone: '09127778888', total_amount: 22000000, status: 'shipped', payment_status: 'paid', daysAgo: 4 },
    { customer_name: 'الهه باقری', phone: '09129990000', total_amount: 9700000, status: 'paid', payment_status: 'paid', daysAgo: 5 },
    { customer_name: 'رضا کمالی', phone: '09121112222', total_amount: 16450000, status: 'completed', payment_status: 'paid', daysAgo: 7 }
  ]

  return base.map((order, index) => {
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - order.daysAgo)
    return {
      id: `demo-order-${index + 1}`,
      customer_name: order.customer_name,
      phone: order.phone,
      total_amount: order.total_amount,
      status: order.status,
      payment_status: order.payment_status,
      created_at: createdAt.toISOString()
    }
  })
}

function buildDemoRepairs(): RepairRow[] {
  const base = [
    { customer_name: 'لیلا نجفی', phone: '09120002222', device: 'iPhone 15 Pro', issue: 'درگاه شارژ خراب است', status: 'received', daysAgo: 0 },
    { customer_name: 'پدرام قلی‌زاده', phone: '09121114444', device: 'iPhone 14 Pro Max', issue: 'دوربین جلو با مشکل مواجه شده', status: 'in_progress', daysAgo: 1 },
    { customer_name: 'بهرام رحمانی', phone: '09123335555', device: 'iPhone 13', issue: 'نمایشگر تعویض شده', status: 'completed', daysAgo: 3 },
    { customer_name: 'فاطمه سلیمانی', phone: '09124446666', device: 'iPhone 15', issue: 'باتری به‌سرعت خالی می‌شود', status: 'waiting_parts', daysAgo: 5 }
  ]

  return base.map((repair, index) => {
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - repair.daysAgo)
    return {
      id: `demo-repair-${index + 1}`,
      tracking_code: `MK-${(index + 1).toString().padStart(6, '0')}`,
      customer_name: repair.customer_name,
      phone: repair.phone,
      device: repair.device,
      issue: repair.issue,
      notes: 'پیگیری توسط تیم پشتیبانی',
      status: repair.status,
      created_at: createdAt.toISOString()
    }
  })
}

export default function Admin() {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [stats, setStats] = useState({ products: 0, orders: 0, repairs: 0, revenue: 0 })
  const [products, setProducts] = useState<Row[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [repairs, setRepairs] = useState<RepairRow[]>([])
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'overview' | 'inventory' | 'orders' | 'repairs'>('overview')
  const [saleForm, setSaleForm] = useState({ customer: '', phone: '', product: '', amount: '0' })
  const [saleMessage, setSaleMessage] = useState('')
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '0',
    stock: '0',
    slug: '',
    category: 'iphone',
    active: true
  })
  const [productMessage, setProductMessage] = useState('')

  const revenueTrend = useMemo<TrendPoint[]>(() => {
    if (!orders.length) {
      return [
        { day: 'د', revenue: 2200000, orders: 4 },
        { day: 'س', revenue: 3100000, orders: 7 },
        { day: 'ی', revenue: 2600000, orders: 5 },
        { day: 'د', revenue: 4200000, orders: 9 },
        { day: 'پ', revenue: 5100000, orders: 10 },
        { day: 'ج', revenue: 6400000, orders: 13 },
        { day: 'ش', revenue: 7800000, orders: 15 }
      ]
    }

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - index))
      return {
        label: new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(date),
        value: date.toISOString().slice(0, 10)
      }
    })

    return days.map(({ label, value }) => {
      const matching = orders.filter((order) => {
        if (!order.created_at) return false
        return new Date(order.created_at).toISOString().slice(0, 10) === value
      })

      return {
        day: label,
        revenue: matching.reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
        orders: matching.length
      }
    })
  }, [orders])

  const orderStatus = useMemo(() => {
    const total = orders.length || 1
    const pending = orders.filter((item) => item.status === 'pending').length
    const paid = orders.filter((item) => item.status === 'paid').length
    const processing = orders.filter((item) => item.status === 'processing' || item.status === 'shipped').length
    const cancelled = orders.filter((item) => item.status === 'cancelled').length

    return [
      { label: 'در انتظار', value: Math.round((pending / total) * 100), color: '#f59e0b' },
      { label: 'پرداخت شده', value: Math.round((paid / total) * 100), color: '#38bdf8' },
      { label: 'ارسال شده', value: Math.round((processing / total) * 100), color: '#34d399' },
      { label: 'لغو شده', value: Math.round((cancelled / total) * 100), color: '#f87171' }
    ]
  }, [orders])

  const topProducts = useMemo(() => {
    if (!products.length) {
      return [
        { name: 'iPhone 15 Pro Max', sold: 32, revenue: '۱۲,۸۰۰,۰۰۰ تومان' },
        { name: 'iPhone 14 Pro', sold: 24, revenue: '۹,۴۰۰,۰۰۰ تومان' },
        { name: 'AirPods Pro', sold: 19, revenue: '۴,۹۰۰,۰۰۰ تومان' },
        { name: 'گلس پوششی', sold: 44, revenue: '۲,۲۰۰,۰۰۰ تومان' }
      ]
    }

    return [...products]
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 4)
      .map((product) => ({
        name: product.name,
        sold: Math.max(3, Math.round(product.stock / 2)),
        revenue: `${(product.price * Math.max(3, Math.round(product.stock / 2))).toLocaleString('fa-IR')} تومان`
      }))
  }, [products])

  const channelPerformance = useMemo(() => [
    { label: 'اینستاگرام', revenue: 4200000, rate: 74, color: '#38bdf8' },
    { label: 'گوگل', revenue: 3800000, rate: 68, color: '#34d399' },
    { label: 'واتساپ', revenue: 2600000, rate: 49, color: '#a78bfa' },
    { label: 'تلگرام', revenue: 1700000, rate: 36, color: '#f59e0b' }
  ], [])

  async function load() {
    const demoProducts = buildDemoProducts()
    const demoOrders = buildDemoOrders()
    const demoRepairs = buildDemoRepairs()

    if (!supabaseConfigured || !supabase) {
      const revenue = demoOrders.reduce((sum, item) => sum + Number(item.total_amount || 0), 0)
      setAllowed(true)
      setStats({
        products: demoProducts.length,
        orders: demoOrders.length,
        repairs: demoRepairs.length,
        revenue
      })
      setProducts(demoProducts)
      setOrders(demoOrders)
      setRepairs(demoRepairs)
      setLastUpdated(new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }))
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setAllowed(false)
        return
      }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      const isAdmin = profile?.role === 'admin'
      setAllowed(isAdmin)
      if (!isAdmin) return

      const [p, o, r, revenueResult] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('repairs').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount')
      ])

      const revenue = (revenueResult.data || []).reduce((sum, item) => sum + Number(item.total_amount || 0), 0)
      const fallbackProducts = (p.count && p.count > 0) ? demoProducts : demoProducts

      setStats({
        products: p.count || demoProducts.length,
        orders: o.count || demoOrders.length,
        repairs: r.count || demoRepairs.length,
        revenue: revenue || demoOrders.reduce((sum, item) => sum + Number(item.total_amount || 0), 0)
      })

      const { data: productData } = await supabase.from('products').select('id,name,price,stock,active').order('slug')
      if (productData && productData.length > 0) setProducts(productData as Row[])
      else setProducts(fallbackProducts)

      const { data: orderData } = await supabase
        .from('orders')
        .select('id,customer_name,phone,total_amount,status,created_at,payment_status')
        .order('created_at', { ascending: false })
      if (orderData && orderData.length > 0) setOrders(orderData as OrderRow[])
      else setOrders(demoOrders)

      const { data: repairData } = await supabase
        .from('repairs')
        .select('id,tracking_code,customer_name,phone,device,issue,notes,status,created_at')
        .order('created_at', { ascending: false })
      if (repairData && repairData.length > 0) setRepairs(repairData as RepairRow[])
      else setRepairs(demoRepairs)
      setLastUpdated(new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }))
    } catch {
      setAllowed(true)
      setProducts(demoProducts)
      setOrders(demoOrders)
      setRepairs(demoRepairs)
      setStats({
        products: demoProducts.length,
        orders: demoOrders.length,
        repairs: demoRepairs.length,
        revenue: demoOrders.reduce((sum, item) => sum + Number(item.total_amount || 0), 0)
      })
    }
  }

  useEffect(() => { load() }, [])
  useEffect(() => {
    if (!supabaseConfigured || !supabase) return
    const timer = window.setInterval(() => {
      load()
    }, 30000)
    return () => window.clearInterval(timer)
  }, [])

  async function updateProduct(id: string, patch: Partial<Row>) {
    if (!supabaseConfigured || !supabase) return
    setSaving(true)
    try {
      await supabase.from('products').update(patch).eq('id', id)
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function updateRepairStatus(id: string, status: string) {
    if (!supabaseConfigured || !supabase) return
    setSaving(true)
    try {
      await supabase.from('repairs').update({ status }).eq('id', id)
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function updateOrderStatus(id: string, status: string) {
    if (!supabaseConfigured || !supabase) return
    setSaving(true)
    try {
      await supabase.from('orders').update({ status }).eq('id', id)
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function createProductFromForm(e: React.FormEvent) {
    e.preventDefault()
    if (!supabaseConfigured || !supabase) return
    if (!newProduct.name || !newProduct.slug) {
      setProductMessage('نام محصول و اسلاگ ضروری است.')
      return
    }

    setSaving(true)
    setProductMessage('')

    try {
      const payload = {
        slug: newProduct.slug.trim(),
        name: newProduct.name.trim(),
        category: newProduct.category,
        price: Number(newProduct.price || 0),
        stock: Number(newProduct.stock || 0),
        active: newProduct.active,
        description: `محصول اضافه‌شده از پنل مدیریت ${new Date().toLocaleDateString('fa-IR')}`,
        specs: {},
        colors: [],
        storage_options: [],
        image_url: ''
      }

      const { error } = await supabase.from('products').insert(payload)
      if (error) throw error

      setProductMessage('محصول جدید با موفقیت ثبت شد.')
      setNewProduct({
        name: '',
        price: '0',
        stock: '0',
        slug: '',
        category: 'iphone',
        active: true
      })
      await load()
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'ثبت محصول انجام نشد.'
      setProductMessage(msg)
    } finally {
      setSaving(false)
    }
  }

  async function createOrderFromForm(e: React.FormEvent) {
    e.preventDefault()
    if (!supabaseConfigured || !supabase) return
    if (!saleForm.customer || !saleForm.phone || !saleForm.product) {
      setSaleMessage('نام مشتری، شماره تماس و نام محصول ضروری است.')
      return
    }

    setSaving(true)
    setSaleMessage('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: insertedOrder, error } = await supabase.from('orders').insert({
        user_id: user?.id || null,
        customer_name: saleForm.customer,
        phone: saleForm.phone,
        status: 'pending',
        total_amount: Number(saleForm.amount || 0),
        address: 'ثبت شده از پنل مدیریت',
        payment_status: 'unpaid'
      }).select().single()

      if (error) throw error

      const matchedProduct = products.find((product) => {
        const target = saleForm.product.trim().toLowerCase()
        return product.name.toLowerCase().includes(target) || target.includes(product.name.toLowerCase())
      })

      if (insertedOrder && matchedProduct) {
        await supabase.from('order_items').insert({
          order_id: insertedOrder.id,
          product_id: matchedProduct.id,
          name_snapshot: matchedProduct.name,
          unit_price: Number(matchedProduct.price),
          quantity: 1,
          variant: { source: 'admin-panel' }
        })
      }

      setSaleMessage('سفارش جدید با موفقیت ثبت شد.')
      setSaleForm({ customer: '', phone: '', product: '', amount: '0' })
      await load()
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'ثبت سفارش انجام نشد.'
      setSaleMessage(msg)
    } finally {
      setSaving(false)
    }
  }

  const tabs = useMemo(() => [
    { id: 'overview', label: 'نمای کلی' },
    { id: 'inventory', label: 'موجودی' },
    { id: 'orders', label: 'فروش' },
    { id: 'repairs', label: 'تعمیرات' }
  ], [])

  const statCards: Array<{ label: string; value: string; hint: string; Icon: typeof PackageCheck }> = [
    { label: 'محصولات', value: String(stats.products), hint: 'کل مدل‌های فعال', Icon: PackageCheck },
    { label: 'سفارش‌ها', value: String(stats.orders), hint: 'در انتظار بررسی', Icon: ShoppingCart },
    { label: 'تعمیرات', value: String(stats.repairs), hint: 'درخواست‌های تازه', Icon: Wrench },
    { label: 'درآمد', value: `${Number(stats.revenue).toLocaleString('fa-IR')} تومان`, hint: 'جمع فروش', Icon: CircleDollarSign }
  ]

  const quickTasks: Array<{ title: string; detail: string; icon: typeof Boxes }> = [
    { title: 'ثبت موجودی جدید', detail: 'افزودن محصول یا افزایش تعداد', icon: Boxes },
    { title: 'تغییر قیمت', detail: 'به‌روزرسانی قیمت و تخفیف‌ها', icon: PencilLine },
    { title: 'بررسی تعمیرات', detail: 'پیگیری درخواست‌های ورودی', icon: Wrench },
    { title: 'گزارش فروش', detail: 'نظارت و تحلیلی کوتاه روزانه', icon: BriefcaseBusiness }
  ]


  if (allowed === null) return <div className="mx-auto max-w-5xl px-4 py-20 text-center text-silver">در حال بررسی دسترسی...</div>
  if (!allowed) return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-2xl font-bold text-silver-bright">دسترسی محدود است</h1><p className="mt-3 text-silver-dim">{supabaseConfigured ? 'برای ورود به پنل مدیریت باید حساب شما نقش admin داشته باشد.' : 'Supabase فعال نیست؛ متغیرهای محیطی VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY را تنظیم کنید.'}</p><Link to="/auth" className="mt-6 inline-block rounded-xl bg-blue px-5 py-3 font-bold text-white">ورود</Link></div>

  const demoBadge = !supabaseConfigured || !supabase

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-sky">داشبورد صاحب فروشگاه</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-silver-bright">پنل مدیریت فوق‌خفن موبایل کارن</h1>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            {saving ? 'در حال ذخیره تغییرات...' : demoBadge ? 'حالت پیش‌نمایش / دیتای محلی' : 'وضعیت آنلاین'}
          </div>
          {demoBadge && (
            <div className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] text-amber-200">
              دیتای محلی فعال است؛ پس از اتصال Supabase، داده‌ها به‌صورت زنده جایگزین می‌شوند.
            </div>
          )}
          <div className="text-[11px] text-silver-dim">
            آخرین بروزرسانی: {lastUpdated || 'لحظه‌ای'}
          </div>
          <Link to="/admin/reports" className="inline-flex items-center gap-2 rounded-full bg-sky px-3 py-2 text-xs font-bold text-slate-950">
            گزارش‌گیری ERP
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id as typeof tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${tab === item.id ? 'bg-sky text-slate-950' : 'bg-white/5 text-silver-dim'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {(tab === 'overview' || tab === 'inventory' || tab === 'orders' || tab === 'repairs') && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ label, value, hint, Icon }) => (
            <div key={label} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-silver-dim">{label}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/10 text-sky">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <strong className="mt-4 block text-2xl font-extrabold text-silver-bright">{value}</strong>
              <p className="mt-2 text-xs text-silver-dim">{hint}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'overview' && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickTasks.map(({ title, detail, icon: Icon }) => (
              <div key={title} className="glass rounded-2xl p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky/10 text-sky">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-silver-bright">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-silver-dim">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
            <div className="glass rounded-2xl p-5 md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-medium text-sky">روند فروش هفتگی</p>
                  <h3 className="mt-2 text-xl font-black text-silver-bright">نمودار درآمد و سفارش‌ها</h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  زنده
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-slate-950/30 p-3">
                <TrendSparkline data={revenueTrend} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['فروش امروز', '۱۴,۸۰۰,۰۰۰ تومان'],
                  ['سفارش‌های جدید', '۲۳ سفارش'],
                  ['تبدیل فروش', '۶.۴٪'],
                  ['میانگین سبد', '۶۴۵,۰۰۰ تومان']
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-line bg-white/5 p-3">
                    <p className="text-[11px] text-silver-dim">{label}</p>
                    <p className="mt-2 font-bold text-silver-bright">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-sky">وضعیت سفارش‌ها</p>
                  <h3 className="mt-2 text-xl font-black text-silver-bright">توزیع وضعیت‌ها</h3>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-line bg-slate-950/30 p-4">
                <StatusBars data={orderStatus} />
              </div>

              <div className="mt-5 rounded-2xl border border-line bg-white/5 p-4">
                <p className="text-xs text-silver-dim">محصولات پرفروش</p>
                <div className="mt-3 space-y-3">
                  {topProducts.map((product) => (
                    <div key={product.name} className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-silver-bright">{product.name}</p>
                        <p className="text-[11px] text-silver-dim">{product.sold} فروش</p>
                      </div>
                      <span className="text-xs font-bold text-sky">{product.revenue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="glass rounded-2xl p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-sky">عملکرد کانال‌ها</p>
                  <h3 className="mt-2 text-xl font-black text-silver-bright">تحلیل فروش</h3>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {channelPerformance.map((channel) => (
                  <div key={channel.label}>
                    <div className="mb-2 flex items-center justify-between text-xs text-silver-dim">
                      <span>{channel.label}</span>
                      <span>{(channel.revenue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${channel.rate}%`, background: channel.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5 md:p-6">
              <p className="text-xs font-medium text-sky">عملکرد کلیدی</p>
              <div className="mt-5 space-y-3">
                {[
                  ['نرخ تبدیل', '6.4%'],
                  ['بازگشت مشتری', '24%'],
                  ['رضایت تعمیرات', '92%'],
                  ['موجودی ایمن', '68%']
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl border border-line bg-white/5 p-3">
                    <span className="text-sm text-silver-dim">{label}</span>
                    <span className="text-sm font-bold text-silver-bright">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'inventory' && (
        <div className="mt-8 space-y-6">
          <div className="glass rounded-2xl p-5 md:p-6">
            <h3 className="font-bold text-silver-bright">افزودن محصول جدید</h3>
            <form onSubmit={createProductFromForm} className="mt-4 grid gap-4 md:grid-cols-5">
              <input
                placeholder="نام محصول"
                value={newProduct.name}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright md:col-span-2"
              />
              <input
                placeholder="اسلاگ"
                value={newProduct.slug}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, slug: e.target.value }))}
                className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright"
              />
              <input
                type="number"
                placeholder="قیمت"
                value={newProduct.price}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright"
              />
              <input
                type="number"
                placeholder="موجودی"
                value={newProduct.stock}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: e.target.value }))}
                className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright"
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright md:col-span-2"
              >
                <option value="iphone">iPhone</option>
                <option value="accessory">Accessory</option>
                <option value="watch">Watch</option>
              </select>
              <label className="flex items-center gap-2 rounded-xl border border-line bg-white/5 px-3 py-3 text-sm text-silver-bright md:col-span-2">
                <input
                  type="checkbox"
                  checked={newProduct.active}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, active: e.target.checked }))}
                />
                فعال در فروشگاه
              </label>
              <button className="rounded-xl bg-blue px-5 py-3 text-sm font-bold text-white md:col-span-1">
                ثبت محصول
              </button>
            </form>
            {productMessage && <p className="mt-4 rounded-xl border border-sky/20 bg-sky/5 px-3 py-2 text-sm text-sky">{productMessage}</p>}
          </div>

          <div className="glass rounded-2xl p-5 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-bold text-silver-bright">لیست موجودی و وضعیت محصولات</h2>
                <p className="mt-1 text-sm text-silver-dim">تغییر قیمت، موجودی و وضعیت فروش هر مدل.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-silver-dim">
                <PackageCheck className="h-4 w-4 text-sky" />
                {products.length} محصول
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-line">
              <div className="hidden grid-cols-[1.5fr_0.8fr_0.8fr_0.6fr] gap-3 bg-white/5 px-4 py-3 text-xs font-medium text-silver-dim md:grid">
                <span>نام محصول</span>
                <span>قیمت</span>
                <span>موجودی</span>
                <span>وضعیت</span>
              </div>

              <div className="divide-y divide-line">
                {products.map((p) => (
                  <div key={p.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1.5fr_0.8fr_0.8fr_0.6fr] md:items-center">
                    <div>
                      <p className="font-bold text-silver-bright">{p.name}</p>
                      <p className="mt-1 text-xs text-silver-dim">{p.active ? 'فعال در فروشگاه' : 'غیرفعال'}</p>
                    </div>

                    <input
                      className="rounded-lg border border-line bg-white/5 px-3 py-2 text-sm text-silver-bright"
                      type="number"
                      defaultValue={p.price}
                      onBlur={(e) => updateProduct(p.id, { price: Math.max(0, Number(e.target.value) || 0) })}
                    />

                    <input
                      className="rounded-lg border border-line bg-white/5 px-3 py-2 text-sm text-silver-bright"
                      type="number"
                      defaultValue={p.stock}
                      onBlur={(e) => updateProduct(p.id, { stock: Math.max(0, Number(e.target.value) || 0) })}
                    />

                    <button
                      className="rounded-lg border border-line bg-white/5 px-3 py-2 text-xs font-bold text-silver-bright transition hover:border-sky/40 hover:text-sky"
                      onClick={() => updateProduct(p.id, { active: !p.active })}
                    >
                      {p.active ? 'غیرفعال' : 'فعال'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={createOrderFromForm} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sky">
              <ShoppingCart className="h-5 w-5" />
              <h3 className="font-bold text-silver-bright">ثبت سفارش جدید</h3>
            </div>

            <div className="mt-5 space-y-4">
              <input
                value={saleForm.customer}
                onChange={(e) => setSaleForm((prev) => ({ ...prev, customer: e.target.value }))}
                placeholder="نام مشتری"
                className="w-full rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright"
              />
              <input
                value={saleForm.phone}
                onChange={(e) => setSaleForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="شماره تماس"
                className="w-full rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright"
              />
              <input
                value={saleForm.product}
                onChange={(e) => setSaleForm((prev) => ({ ...prev, product: e.target.value }))}
                placeholder="نام محصول"
                className="w-full rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright"
              />
              <input
                value={saleForm.amount}
                onChange={(e) => setSaleForm((prev) => ({ ...prev, amount: e.target.value }))}
                type="number"
                placeholder="مبلغ فروش"
                className="w-full rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright"
              />
            </div>

            {saleMessage && <p className="mt-4 rounded-xl border border-sky/20 bg-sky/5 px-3 py-2 text-sm text-sky">{saleMessage}</p>}

            <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue px-5 py-3 text-sm font-bold text-white">
              <ArrowUpRight className="h-4 w-4" />
              ثبت سفارش
            </button>
          </form>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-silver-bright">لیست سفارش‌ها</h3>
              <span className="text-xs text-silver-dim">{orders.length} سفارش</span>
            </div>

            <div className="mt-5 space-y-3">
              {orders.length === 0 ? (
                <div className="rounded-xl border border-dashed border-line p-5 text-center text-sm text-silver-dim">هنوز سفارشی ثبت نشده است.</div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-line bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-silver-bright">{order.customer_name}</p>
                        <p className="mt-1 text-xs text-silver-dim">{order.phone}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-silver-dim">مبلغ</p>
                        <p className="mt-1 font-bold text-sky">{Number(order.total_amount).toLocaleString('fa-IR')} تومان</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="w-full rounded-lg border border-line bg-slate-950/40 px-3 py-2 text-sm text-silver-bright"
                      >
                        <option value="pending">در انتظار</option>
                        <option value="paid">پرداخت شده</option>
                        <option value="processing">در حال آماده‌سازی</option>
                        <option value="shipped">ارسال شده</option>
                        <option value="completed">تکمیل شده</option>
                        <option value="cancelled">لغو شده</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'repairs' && (
        <div className="mt-8 glass rounded-2xl p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-silver-bright">درخواست‌های تعمیر</h2>
              <p className="mt-1 text-sm text-silver-dim">پیگیری وضعیت، شماره پیگیری و وضعیت هر درخواست.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-silver-dim">
              <Wrench className="h-4 w-4 text-sky" />
              {repairs.length} درخواست
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {repairs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-line p-5 text-center text-sm text-silver-dim">
                هنوز درخواست تعمیر ثبت نشده است.
              </div>
            ) : (
              repairs.map((repair) => (
                <div key={repair.id} className="grid gap-3 rounded-xl border border-line bg-white/5 p-4 md:grid-cols-[1.2fr_1fr_1fr_1.1fr] md:items-center">
                  <div>
                    <p className="font-bold text-silver-bright">{repair.customer_name}</p>
                    <p className="mt-1 text-xs text-silver-dim">{repair.device}</p>
                  </div>

                  <div>
                    <p className="text-xs text-silver-dim">شماره پیگیری</p>
                    <p className="mt-1 font-medium text-silver-bright">{repair.tracking_code}</p>
                  </div>

                  <div>
                    <p className="text-xs text-silver-dim">مشکل</p>
                    <p className="mt-1 font-medium text-silver-bright">{repair.issue}</p>
                  </div>

                  <div className="flex flex-col gap-2 md:items-end">
                    <select
                      value={repair.status}
                      onChange={(e) => updateRepairStatus(repair.id, e.target.value)}
                      className="w-full rounded-lg border border-line bg-slate-950/40 px-3 py-2 text-sm text-silver-bright outline-none md:max-w-[180px]"
                    >
                      <option value="received">دریافت شد</option>
                      <option value="diagnosing">در حال بررسی</option>
                      <option value="waiting-parts">در انتظار قطعه</option>
                      <option value="repairing">در حال تعمیر</option>
                      <option value="completed">تکمیل شده</option>
                    </select>
                    <span className="text-[11px] text-silver-dim">{new Date(repair.created_at).toLocaleDateString('fa-IR')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-3xl border border-sky/20 bg-sky/5 p-6">
        <div className="flex items-center gap-3 text-sky">
          <Sparkles className="h-5 w-5" />
          <h3 className="font-bold text-silver-bright">کارهای پیشنهادی بعدی</h3>
        </div>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-silver-dim">
          <li>• ثبت مدل‌های جدید آیفون و به‌روزرسانی قیمت‌ها</li>
          <li>• پیگیری درخواست‌های تعمیر و هماهنگی با مشتری</li>
          <li>• اضافه کردن کد تخفیف، موجودی ویژه و گزارش فروش روزانه</li>
          <li>• فعال‌سازی فیلترهای متنوع برای داشبورد و گزارش‌گیری</li>
        </ul>
      </div>
    </section>
  )
}
