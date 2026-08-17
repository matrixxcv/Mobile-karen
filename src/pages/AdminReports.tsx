import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BarChart3, CalendarRange, CircleDollarSign, ClipboardList, ShieldCheck, TrendingUp } from 'lucide-react'
import { supabase, supabaseConfigured } from '@/lib/supabase'
import { products as localProducts } from '@/data/products'

type Scope = 'daily' | 'weekly' | 'monthly'
type OrderRow = {
  id: string
  customer_name: string
  phone: string
  total_amount: number
  status: string
  created_at: string
}

type RepairRow = {
  id: string
  customer_name: string
  phone: string
  device: string
  issue: string
  status: string
  created_at: string
}

type ReportPoint = {
  label: string
  revenue: number
  orders: number
  repairs: number
}

function formatCurrency(value: number) {
  return `${Number(value).toLocaleString('fa-IR')} تومان`
}

function LineChart({ data }: { data: ReportPoint[] }) {
  const width = 640
  const height = 220
  const max = Math.max(...data.map((item) => item.revenue), 1)
  const min = Math.min(...data.map((item) => item.revenue), 0)

  const points = data.map((item, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * width
    const y = height - ((item.revenue - min) / Math.max(max - min, 1)) * (height - 28) - 14
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-52 w-full">
      {[0, 1, 2, 3].map((line) => (
        <line
          key={line}
          x1="0"
          x2={width}
          y1={16 + line * 50}
          y2={16 + line * 50}
          stroke="rgba(255,255,255,0.08)"
          strokeDasharray="6 8"
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

      {data.map((item, index) => {
        const x = (index / Math.max(data.length - 1, 1)) * width
        const y = height - ((item.revenue - min) / Math.max(max - min, 1)) * (height - 28) - 14
        return (
          <g key={item.label}>
            <circle cx={x} cy={y} r="4" fill="#f8fafc" stroke="#38bdf8" strokeWidth="2" />
            <text x={x} y={height - 6} textAnchor="middle" fill="#94a3b8" fontSize="11">{item.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function buildDemoOrders(): OrderRow[] {
  const base = [
    { total_amount: 15000000, status: 'paid', customer_name: 'مریم حسینی', phone: '09120001111', daysAgo: 0 },
    { total_amount: 22500000, status: 'processing', customer_name: 'سارا کیانی', phone: '09123334444', daysAgo: 1 },
    { total_amount: 8900000, status: 'pending', customer_name: 'احمد نوری', phone: '09125556666', daysAgo: 2 },
    { total_amount: 18200000, status: 'shipped', customer_name: 'پریسا جوادی', phone: '09127778888', daysAgo: 4 },
    { total_amount: 11900000, status: 'paid', customer_name: 'رضا قلی‌پور', phone: '09129990000', daysAgo: 6 },
    { total_amount: 24800000, status: 'completed', customer_name: 'علی اکبری', phone: '09121112222', daysAgo: 8 }
  ]

  return base.map((item, index) => {
    const date = new Date()
    date.setDate(date.getDate() - item.daysAgo)
    return {
      id: `demo-order-${index + 1}`,
      customer_name: item.customer_name,
      phone: item.phone,
      total_amount: item.total_amount,
      status: item.status,
      created_at: date.toISOString()
    }
  })
}

function buildDemoRepairs(): RepairRow[] {
  const base = [
    { customer_name: 'لیلا نجفی', phone: '09120002222', device: 'iPhone 15 Pro', issue: 'درباره شارژ', status: 'received', daysAgo: 0 },
    { customer_name: 'بهمن آذری', phone: '09121114444', device: 'iPhone 14 Pro', issue: 'دوربین جلو', status: 'in_progress', daysAgo: 2 },
    { customer_name: 'فاطمه سلیمانی', phone: '09123335555', device: 'iPhone 13', issue: 'باتری', status: 'completed', daysAgo: 4 },
    { customer_name: 'آرمان طیبی', phone: '09124446666', device: 'iPhone 15', issue: 'نمایشگر', status: 'waiting_parts', daysAgo: 7 }
  ]

  return base.map((item, index) => ({
    id: `demo-repair-${index + 1}`,
    customer_name: item.customer_name,
    phone: item.phone,
    device: item.device,
    issue: item.issue,
    status: item.status,
    created_at: new Date(Date.now() - item.daysAgo * 86400000).toISOString()
  }))
}

function buildDemoProducts(): Array<{ name: string; price: number; stock: number }> {
  return localProducts.slice(0, 8).map((product, index) => ({
    name: product.name,
    price: 3200000 + index * 850000,
    stock: 14 + (index % 4) * 9
  }))
}

function buildRangeData(orders: OrderRow[], repairs: RepairRow[], scope: Scope): ReportPoint[] {
  const now = new Date()

  const ranges = (() => {
    if (scope === 'daily') {
      return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(now)
        date.setDate(now.getDate() - (6 - index))
        return { label: new Intl.DateTimeFormat('fa-IR', { day: 'numeric' }).format(date), value: new Date(date).toISOString().slice(0, 10) }
      })
    }

    if (scope === 'weekly') {
      return Array.from({ length: 6 }, (_, index) => {
        const date = new Date(now)
        date.setDate(now.getDate() - (5 - index) * 7)
        return { label: `ه${index + 1}`, value: new Date(date).toISOString().slice(0, 10) }
      })
    }

    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now)
      date.setMonth(now.getMonth() - (5 - index))
      return { label: new Intl.DateTimeFormat('fa-IR', { month: 'short' }).format(date), value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` }
    })
  })()

  return ranges.map((range) => {
    const matchingOrders = orders.filter((order) => {
      if (!order.created_at) return false
      const date = new Date(order.created_at)
      const iso = date.toISOString().slice(0, 10)
      if (scope === 'daily') return iso === range.value
      if (scope === 'weekly') {
        const start = new Date(now)
        start.setDate(now.getDate() - 6 * 7)
        return date >= start && date <= now
      }
      return date.toISOString().slice(0, 7) === range.value
    })

    const matchingRepairs = repairs.filter((repair) => {
      if (!repair.created_at) return false
      const date = new Date(repair.created_at)
      const iso = date.toISOString().slice(0, 10)
      if (scope === 'daily') return iso === range.value
      if (scope === 'weekly') {
        const start = new Date(now)
        start.setDate(now.getDate() - 6 * 7)
        return date >= start && date <= now
      }
      return date.toISOString().slice(0, 7) === range.value
    })

    return {
      label: range.label,
      revenue: matchingOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
      orders: matchingOrders.length,
      repairs: matchingRepairs.length
    }
  })
}

export default function AdminReports() {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [scope, setScope] = useState<Scope>('daily')
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [repairs, setRepairs] = useState<RepairRow[]>([])
  const [products, setProducts] = useState<Array<{ name: string; price: number; stock: number }>>([])

  async function load() {
    const demoOrders = buildDemoOrders()
    const demoRepairs = buildDemoRepairs()
    const demoProducts = buildDemoProducts()

    if (!supabaseConfigured || !supabase) {
      const revenue = demoOrders.reduce((sum, item) => sum + Number(item.total_amount || 0), 0)
      setAllowed(true)
      setOrders(demoOrders)
      setRepairs(demoRepairs)
      setProducts(demoProducts)
      setScope('daily')
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

      const [ordersResult, repairsResult, productsResult] = await Promise.all([
        supabase.from('orders').select('id,customer_name,phone,total_amount,status,created_at').order('created_at', { ascending: false }),
        supabase.from('repairs').select('id,customer_name,phone,device,issue,status,created_at').order('created_at', { ascending: false }),
        supabase.from('products').select('name,price,stock').order('created_at', { ascending: false })
      ])

      setOrders((ordersResult.data && ordersResult.data.length > 0 ? ordersResult.data : demoOrders) as OrderRow[])
      setRepairs((repairsResult.data && repairsResult.data.length > 0 ? repairsResult.data : demoRepairs) as RepairRow[])
      setProducts((productsResult.data && productsResult.data.length > 0 ? productsResult.data : demoProducts) as Array<{ name: string; price: number; stock: number }>)
    } catch {
      setAllowed(true)
      setOrders(demoOrders)
      setRepairs(demoRepairs)
      setProducts(demoProducts)
    }
  }

  useEffect(() => { load() }, [])

  const reportData = useMemo(() => buildRangeData(orders, repairs, scope), [orders, repairs, scope])

  const totals = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0)
    const avgBasket = orders.length ? revenue / orders.length : 0
    const openRepairs = repairs.filter((item) => item.status !== 'completed').length
    return {
      revenue,
      orders: orders.length,
      avgBasket,
      openRepairs,
      products: products.length,
    }
  }, [orders, repairs, products])

  const statusBreakdown = useMemo(() => {
    const total = Math.max(orders.length, 1)
    return [
      { label: 'در انتظار', value: Math.round((orders.filter((item) => item.status === 'pending').length / total) * 100), color: '#f59e0b' },
      { label: 'پرداخت شده', value: Math.round((orders.filter((item) => item.status === 'paid').length / total) * 100), color: '#38bdf8' },
      { label: 'ارسال شده', value: Math.round((orders.filter((item) => item.status === 'shipped' || item.status === 'processing').length / total) * 100), color: '#34d399' },
      { label: 'لغو شده', value: Math.round((orders.filter((item) => item.status === 'cancelled').length / total) * 100), color: '#f87171' }
    ]
  }, [orders])

  const topInventory = useMemo(() => [...products].sort((a, b) => b.stock - a.stock).slice(0, 5), [products])

  if (allowed === null) return <div className="mx-auto max-w-5xl px-4 py-20 text-center text-silver">در حال بررسی دسترسی...</div>
  if (!allowed) return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-2xl font-bold text-silver-bright">دسترسی محدود است</h1><p className="mt-3 text-silver-dim">برای ورود به گزارش‌گیری باید نقش admin داشته باشید.</p><Link to="/auth" className="mt-6 inline-block rounded-xl bg-blue px-5 py-3 font-bold text-white">ورود</Link></div>

  const demoMode = !supabaseConfigured || !supabase

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-sky">گزارش‌گیری مدیریتی</p>
          <h1 className="mt-2 text-3xl font-black text-silver-bright">داشبورد ERP و گزارش خرید و فروش</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin" className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-4 py-2 text-sm text-silver-bright">
            <ArrowLeft className="h-4 w-4" />
            بازگشت به داشبورد
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            {demoMode ? 'پیش‌نمایش محلی' : 'آنلاین'}
          </div>
        </div>
      </div>

      {demoMode && (
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          دیتای گزارش‌ها در حالت پیش‌نمایش از مجموعه داده‌های محلی استفاده می‌شود و پس از فعال‌سازی Supabase به‌صورت زنده جایگزین می‌شود.
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {(['daily', 'weekly', 'monthly'] as Scope[]).map((item) => (
          <button
            key={item}
            onClick={() => setScope(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${scope === item ? 'bg-sky text-slate-950' : 'bg-white/5 text-silver-dim'}`}
          >
            {item === 'daily' ? 'روزانه' : item === 'weekly' ? 'هفتگی' : 'ماهانه'}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'درآمد کل', value: formatCurrency(totals.revenue), hint: 'جمع فروش', Icon: CircleDollarSign },
          { label: 'تعداد سفارش', value: String(totals.orders), hint: 'کل سفارش‌ها', Icon: ClipboardList },
          { label: 'میانگین سبد', value: formatCurrency(totals.avgBasket), hint: 'درآمد هر سفارش', Icon: TrendingUp },
          { label: 'درخواست‌های تعمیر', value: String(totals.openRepairs), hint: 'در حال پیگیری', Icon: CalendarRange }
        ].map(({ label, value, hint, Icon }) => (
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

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="glass rounded-2xl p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-sky">روند فروش</p>
              <h3 className="mt-2 text-xl font-black text-silver-bright">نمودار درآمد و سفارش‌ها</h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky/20 bg-sky/5 px-3 py-1.5 text-xs text-sky">
              <BarChart3 className="h-4 w-4" />
              ERP Live
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-slate-950/30 p-3">
            <LineChart data={reportData} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {reportData.map((item) => (
              <div key={item.label} className="rounded-xl border border-line bg-white/5 p-3 text-center">
                <p className="text-[11px] text-silver-dim">{item.label}</p>
                <p className="mt-2 text-sm font-bold text-silver-bright">{formatCurrency(item.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 md:p-6">
          <p className="text-xs font-medium text-sky">توزیع وضعیت سفارش‌ها</p>
          <div className="mt-5 space-y-4">
            {statusBreakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-xs text-silver-dim">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-white/5 p-4">
            <p className="text-xs text-silver-dim">موجودی محصولات</p>
            <div className="mt-3 space-y-3">
              {topInventory.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-silver-bright">{item.name}</p>
                    <p className="text-[11px] text-silver-dim">{item.stock} عدد در انبار</p>
                  </div>
                  <span className="text-xs font-bold text-sky">{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="glass rounded-2xl p-5 md:p-6">
          <h3 className="text-xl font-black text-silver-bright">آخرین سفارش‌ها</h3>
          <div className="mt-5 space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white/5 p-3">
                <div>
                  <p className="font-medium text-silver-bright">{order.customer_name}</p>
                  <p className="text-[11px] text-silver-dim">{order.phone}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sky">{formatCurrency(order.total_amount)}</p>
                  <p className="text-[11px] text-silver-dim">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 md:p-6">
          <h3 className="text-xl font-black text-silver-bright">آخرین درخواست‌های تعمیر</h3>
          <div className="mt-5 space-y-3">
            {repairs.slice(0, 5).map((repair) => (
              <div key={repair.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white/5 p-3">
                <div>
                  <p className="font-medium text-silver-bright">{repair.customer_name}</p>
                  <p className="text-[11px] text-silver-dim">{repair.device}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sky">{repair.status}</p>
                  <p className="text-[11px] text-silver-dim">{repair.issue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
