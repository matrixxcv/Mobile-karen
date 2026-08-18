import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  PackageCheck,
  PencilLine,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Trash2,
  Users,
  Wrench,
  XCircle,
} from 'lucide-react'
import { products as localProducts } from '@/data/products'
import { supabase, supabaseConfigured } from '@/lib/supabase'

type ProductRow = {
  id: string
  slug?: string | null
  name: string
  category?: string
  price: number
  stock: number
  active: boolean
  description?: string | null
  image_url?: string | null
  specs?: Record<string, unknown> | null
  created_at?: string
}

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
  tracking_code: string
  customer_name: string
  phone: string
  device: string
  issue: string
  status: string
  notes?: string | null
  created_at: string
}

type UserRow = {
  id: string
  full_name?: string | null
  phone?: string | null
  role: 'customer' | 'admin'
  created_at?: string
}

type VpnServiceRow = {
  id: string
  name: string
  protocol: string
  duration_days: number
  price: number
  stock: number
  active: boolean
  connection_data?: string | null
}

type ToastState = {
  type: 'success' | 'error'
  message: string
} | null

const demoProducts: ProductRow[] = localProducts.slice(0, 8).map((product, index) => ({
  id: product.id,
  slug: product.id,
  name: product.name,
  category: 'iphone',
  price: 3200000 + index * 850000,
  stock: 12 + (index % 5) * 7,
  active: true,
  description: product.description,
  image_url: product.image,
  specs: product.specs as unknown as Record<string, unknown>,
}))

const demoOrders: OrderRow[] = [
  { id: 'demo-1', customer_name: 'مریم حسینی', phone: '09120001111', total_amount: 18000000, status: 'paid', created_at: new Date().toISOString() },
  { id: 'demo-2', customer_name: 'احسان رضایی', phone: '09123334444', total_amount: 24500000, status: 'processing', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'demo-3', customer_name: 'نرگس احمدی', phone: '09125556666', total_amount: 11200000, status: 'pending', created_at: new Date(Date.now() - 172800000).toISOString() },
]

const demoRepairs: RepairRow[] = [
  { id: 'demo-r1', tracking_code: 'MK-000001', customer_name: 'لیلا نجفی', phone: '09120002222', device: 'iPhone 15 Pro', issue: 'درگاه شارژ خراب است', status: 'received', notes: 'در انتظار بررسی', created_at: new Date().toISOString() },
  { id: 'demo-r2', tracking_code: 'MK-000002', customer_name: 'بهمن آذری', phone: '09121114444', device: 'iPhone 14 Pro', issue: 'دوربین جلو با مشکل مواجه شده', status: 'repairing', notes: 'قطعه در حال تعویض', created_at: new Date(Date.now() - 86400000).toISOString() },
]

const demoUsers: UserRow[] = [
  { id: 'user-1', full_name: 'مدیر اصلی', phone: '09120000001', role: 'admin', created_at: new Date().toISOString() },
  { id: 'user-2', full_name: 'مشتری نمونه', phone: '09120000002', role: 'customer', created_at: new Date(Date.now() - 86400000).toISOString() },
]

const demoVpnServices: VpnServiceRow[] = [
  { id: 'vpn-1', name: 'SSH یک ماهه', protocol: 'SSH', duration_days: 30, price: 0, stock: 12, active: true, connection_data: '{"host":"ssh.example.com","port":22}' },
  { id: 'vpn-2', name: 'NPV سه ماهه', protocol: 'NPV', duration_days: 90, price: 0, stock: 7, active: true, connection_data: '{"host":"npv.example.com","port":443}' },
]

const defaultProductForm = {
  name: '',
  category: 'iphone',
  slug: '',
  price: '0',
  stock: '0',
  active: true,
  description: '',
  image_url: '',
  specs: '{\n  "display": "6.1\" OLED",\n  "chip": "A17 Pro"\n}',
}

export default function Admin() {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [tab, setTab] = useState<'overview' | 'products' | 'orders' | 'repairs' | 'users' | 'vpn'>('overview')
  const [stats, setStats] = useState({ orders: 0, users: 0, repairs: 0, activeProducts: 0 })
  const [products, setProducts] = useState<ProductRow[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [repairs, setRepairs] = useState<RepairRow[]>([])
  const [users, setUsers] = useState<UserRow[]>([])
  const [vpnServices, setVpnServices] = useState<VpnServiceRow[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [orderFilter, setOrderFilter] = useState('all')
  const [repairFilter, setRepairFilter] = useState('all')
  const [productForm, setProductForm] = useState(defaultProductForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    window.setTimeout(() => setToast(null), 3000)
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [products, search, categoryFilter])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => orderFilter === 'all' || order.status === orderFilter)
  }, [orders, orderFilter])

  const filteredRepairs = useMemo(() => {
    return repairs.filter((repair) => repairFilter === 'all' || repair.status === repairFilter)
  }, [repairs, repairFilter])

  const productCategories = useMemo(() => {
    const categories = new Set(products.map((product) => product.category || 'other'))
    return Array.from(categories)
  }, [products])

  const loadAdminData = async () => {
    if (!supabaseConfigured || !supabase) {
      setProducts(demoProducts)
      setOrders(demoOrders)
      setRepairs(demoRepairs)
      setUsers(demoUsers)
      setVpnServices(demoVpnServices)
      setStats({
        orders: demoOrders.length,
        users: demoUsers.length,
        repairs: demoRepairs.length,
        activeProducts: demoProducts.filter((item) => item.active).length,
      })
      setAllowed(true)
      setLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setAllowed(false)
        setLoading(false)
        return
      }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      const isAdmin = profile?.role === 'admin'
      setAllowed(isAdmin)
      if (!isAdmin) {
        setLoading(false)
        return
      }

      const [productsResult, ordersResult, repairsResult, usersResult, vpnResult, activeProductsResult, ordersCountResult, repairsCountResult, usersCountResult] = await Promise.all([
        supabase.from('products').select('id,slug,name,category,price,stock,active,description,image_url,specs,created_at').order('created_at', { ascending: false }),
        supabase.from('orders').select('id,customer_name,phone,total_amount,status,created_at').order('created_at', { ascending: false }),
        supabase.from('repairs').select('id,tracking_code,customer_name,phone,device,issue,status,notes,created_at').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id,full_name,phone,role,created_at').order('created_at', { ascending: false }),
        supabase.from('vpn_services').select('id,name,protocol,duration_days,price,stock,active,connection_data').order('created_at', { ascending: false }),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('active', true),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('repairs').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ])

      setProducts((productsResult.data || demoProducts) as ProductRow[])
      setOrders((ordersResult.data || demoOrders) as OrderRow[])
      setRepairs((repairsResult.data || demoRepairs) as RepairRow[])
      setUsers((usersResult.data || demoUsers) as UserRow[])
      setVpnServices((vpnResult.data || demoVpnServices) as VpnServiceRow[])

      setStats({
        orders: ordersCountResult.count || (ordersResult.data?.length ?? 0),
        users: usersCountResult.count || (usersResult.data?.length ?? 0),
        repairs: repairsCountResult.count || (repairsResult.data?.length ?? 0),
        activeProducts: activeProductsResult.count || (productsResult.data?.filter((item) => item.active).length ?? 0),
      })
    } catch {
      setProducts(demoProducts)
      setOrders(demoOrders)
      setRepairs(demoRepairs)
      setUsers(demoUsers)
      setVpnServices(demoVpnServices)
      setStats({
        orders: demoOrders.length,
        users: demoUsers.length,
        repairs: demoRepairs.length,
        activeProducts: demoProducts.filter((item) => item.active).length,
      })
      setAllowed(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAdminData()
  }, [])

  const resetProductForm = () => {
    setProductForm(defaultProductForm)
    setEditingId(null)
  }

  const handleProductSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!supabaseConfigured || !supabase) {
      showToast('error', 'Supabase فعال نیست؛ ابتدا متغیرهای محیطی را تنظیم کنید.')
      return
    }

    const name = productForm.name.trim()
    const price = Number(productForm.price)
    const stock = Number(productForm.stock)

    if (!name || !productForm.description.trim() || Number.isNaN(price) || price < 0 || Number.isNaN(stock) || stock < 0) {
      showToast('error', 'نام، قیمت، موجودی و توضیحات برای ثبت محصول الزامی هستند.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name,
        slug: (productForm.slug || name).trim().toLowerCase().replace(/\s+/g, '-'),
        category: productForm.category,
        price,
        stock,
        active: productForm.active,
        description: productForm.description.trim(),
        image_url: productForm.image_url.trim(),
        specs: (() => {
          try {
            return JSON.parse(productForm.specs)
          } catch {
            return {}
          }
        })(),
      }

      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId)
        if (error) throw error
        showToast('success', 'محصول با موفقیت به‌روزرسانی شد.')
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
        showToast('success', 'محصول جدید با موفقیت ثبت شد.')
      }

      resetProductForm()
      await loadAdminData()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'عملیات محصول ناموفق بود.'
      showToast('error', message)
    } finally {
      setSaving(false)
    }
  }

  const handleEditProduct = (product: ProductRow) => {
    setEditingId(product.id)
    setProductForm({
      name: product.name,
      category: product.category || 'iphone',
      slug: product.slug || '',
      price: String(product.price),
      stock: String(product.stock),
      active: Boolean(product.active),
      description: product.description || '',
      image_url: product.image_url || '',
      specs: JSON.stringify(product.specs || {}, null, 2),
    })
  }

  const handleDeleteProduct = async (id: string) => {
    if (!supabaseConfigured || !supabase) {
      showToast('error', 'Supabase فعال نیست؛ حذف محصول محلی انجام نمی‌شود.')
      return
    }

    const confirmed = window.confirm('آیا از حذف این محصول مطمئن هستید؟')
    if (!confirmed) return

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      showToast('success', 'محصول حذف شد.')
      await loadAdminData()
      if (editingId === id) resetProductForm()
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'حذف ناموفق بود.')
    }
  }

  const toggleProductActive = async (product: ProductRow) => {
    if (!supabaseConfigured || !supabase) {
      showToast('error', 'Supabase فعال نیست؛ وضعیت محصول را نمی‌توان تغییر داد.')
      return
    }

    try {
      const { error } = await supabase.from('products').update({ active: !product.active }).eq('id', product.id)
      if (error) throw error
      showToast('success', `وضعیت «${product.name}» با موفقیت تغییر کرد.`)
      await loadAdminData()
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'تغییر وضعیت ناموفق بود.')
    }
  }

  const updateUserRole = async (userId: string, role: 'customer' | 'admin') => {
    if (!supabaseConfigured || !supabase) {
      showToast('error', 'Supabase فعال نیست؛ تغییر نقش در دسترس نیست.')
      return
    }

    try {
      const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
      if (error) throw error
      showToast('success', 'نقش کاربر با موفقیت تغییر کرد.')
      await loadAdminData()
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'تغییر نقش ناموفق بود.')
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (!supabaseConfigured || !supabase) {
      showToast('error', 'Supabase فعال نیست؛ تغییر وضعیت سفارش ممکن نیست.')
      return
    }

    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
      if (error) throw error
      showToast('success', 'وضعیت سفارش به‌روزرسانی شد.')
      await loadAdminData()
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'به‌روزرسانی سفارش ناموفق بود.')
    }
  }

  const updateRepairStatus = async (repairId: string, status: string) => {
    if (!supabaseConfigured || !supabase) {
      showToast('error', 'Supabase فعال نیست؛ تغییر وضعیت تعمیر ممکن نیست.')
      return
    }

    try {
      const { error } = await supabase.from('repairs').update({ status }).eq('id', repairId)
      if (error) throw error
      showToast('success', 'وضعیت تعمیر به‌روزرسانی شد.')
      await loadAdminData()
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'به‌روزرسانی تعمیر ناموفق بود.')
    }
  }

  const handleRepairNote = async (repairId: string, note: string) => {
    if (!supabaseConfigured || !supabase) {
      showToast('error', 'Supabase فعال نیست؛ ثبت یادداشت ممکن نیست.')
      return
    }

    try {
      const { error } = await supabase.from('repairs').update({ notes: note }).eq('id', repairId)
      if (error) throw error
      showToast('success', 'یادداشت ثبت شد.')
      await loadAdminData()
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'ثبت یادداشت ناموفق بود.')
    }
  }

  const saveVpnService = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!supabaseConfigured || !supabase) {
      showToast('error', 'Supabase فعال نیست؛ سرویس VPN به‌روزرسانی نمی‌شود.')
      return
    }

    const form = new FormData(event.target as HTMLFormElement)
    const name = String(form.get('vpn-name') || '').trim()
    const protocol = String(form.get('vpn-protocol') || 'SSH')
    const durationDays = Number(form.get('vpn-duration') || 30)
    const price = Number(form.get('vpn-price') || 0)
    const stock = Number(form.get('vpn-stock') || 0)
    const active = form.get('vpn-active') === 'on'

    if (!name) {
      showToast('error', 'نام سرویس VPN الزامی است.')
      return
    }

    try {
      const payload = { name, protocol, duration_days: durationDays, price, stock, active }
      const { error } = await supabase.from('vpn_services').insert(payload)
      if (error) throw error
      showToast('success', 'سرویس VPN اضافه شد.')
      await loadAdminData()
      ;(event.target as HTMLFormElement).reset()
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'ثبت سرویس VPN ناموفق بود.')
    }
  }

  if (allowed === null || loading) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-14 text-silver-dim">
        <div className="glass rounded-3xl px-8 py-6 text-center">
          <ShieldCheck className="mx-auto mb-4 h-8 w-8 text-sky" />
          در حال بررسی دسترسی و بارگذاری داشبورد...
        </div>
      </section>
    )
  }

  if (!allowed) {
    return (
      <section className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="glass rounded-3xl p-8">
          <h1 className="text-2xl font-black text-silver-bright">دسترسی محدود است</h1>
          <p className="mt-4 text-silver-dim">برای ورود به پنل مدیریت، حساب شما باید نقش admin داشته باشد.</p>
          <Link to="/auth" className="mt-6 inline-flex rounded-xl bg-blue px-5 py-3 font-bold text-white">ورود به حساب</Link>
        </div>
      </section>
    )
  }

  const summaryCards = [
    { label: 'تعداد سفارش‌ها', value: stats.orders, icon: ShoppingCart, hint: 'کل سفارش‌های ثبت‌شده' },
    { label: 'تعداد کاربران', value: stats.users, icon: Users, hint: 'کاربران ثبت‌نام‌شده' },
    { label: 'درخواست‌های تعمیر', value: stats.repairs, icon: Wrench, hint: 'در حال پیگیری' },
    { label: 'محصولات فعال', value: stats.activeProducts, icon: PackageCheck, hint: 'محصولات قابل فروش' },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-sky">داشبورد مدیریتی</p>
          <h1 className="mt-2 text-3xl font-black text-silver-bright">پنل مدیریت حرفه‌ای موبایل کارن</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">
          <ShieldCheck className="h-4 w-4" />
          {supabaseConfigured ? 'حالت آنلاین' : 'حالت پیش‌نمایش'}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { id: 'overview', label: 'داشبورد' },
          { id: 'products', label: 'محصولات' },
          { id: 'orders', label: 'سفارش‌ها' },
          { id: 'repairs', label: 'تعمیرات' },
          { id: 'users', label: 'کاربران' },
          { id: 'vpn', label: 'VPN' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id as typeof tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${tab === item.id ? 'bg-sky text-slate-950' : 'bg-white/5 text-silver-dim'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {toast && (
        <div className={`mb-6 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${toast.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-rose-500/30 bg-rose-500/10 text-rose-200'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {tab === 'overview' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(({ label, value, icon: Icon, hint }) => (
              <div key={label} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-silver-dim">{label}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/10 text-sky">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <strong className="mt-4 block text-3xl font-black text-silver-bright">{value}</strong>
                <p className="mt-2 text-xs text-silver-dim">{hint}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="glass rounded-2xl p-5 md:p-6">
              <div className="flex items-center gap-2 text-sky">
                <BarChart3 className="h-5 w-5" />
                <h2 className="text-xl font-black text-silver-bright">نمودار کلی فروش</h2>
              </div>
              <div className="mt-5 rounded-2xl border border-line bg-slate-950/30 p-4">
                <div className="h-48 rounded-xl bg-gradient-to-r from-sky-500/15 via-sky-500/5 to-transparent p-4">
                  <div className="flex h-full items-end gap-3">
                    {[42, 66, 58, 82, 75, 96, 88].map((value, index) => (
                      <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-sky-500 to-sky-300/80" style={{ height: `${value}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 md:p-6">
              <div className="flex items-center gap-2 text-sky">
                <Sparkles className="h-5 w-5" />
                <h2 className="text-xl font-black text-silver-bright">کارهای پیشنهادی</h2>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-silver-dim">
                <li>• بررسی سفارش‌های در انتظار پرداخت</li>
                <li>• بروزرسانی موجودی محصولات پرفروش</li>
                <li>• پیگیری تعمیرات با وضعیت در انتظار قطعه</li>
                <li>• بررسی نقش کاربران و مدیریت دسترسی‌ها</li>
              </ul>
            </div>
          </div>
        </>
      )}

      {tab === 'products' && (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-5 md:p-6">
            <div className="flex items-center gap-2 text-sky">
              <Plus className="h-5 w-5" />
              <h2 className="text-xl font-black text-silver-bright">{editingId ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h2>
            </div>

            <form onSubmit={handleProductSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                value={productForm.name}
                onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="نام محصول"
                className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright"
              />
              <input
                value={productForm.slug}
                onChange={(event) => setProductForm((prev) => ({ ...prev, slug: event.target.value }))}
                placeholder="اسلاگ محصول (اختیاری)"
                className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright"
              />
              <select
                value={productForm.category}
                onChange={(event) => setProductForm((prev) => ({ ...prev, category: event.target.value }))}
                className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright"
              >
                <option value="iphone">iPhone</option>
                <option value="accessory">Accessory</option>
                <option value="watch">Watch</option>
                <option value="other">Other</option>
              </select>
              <input
                type="number"
                min="0"
                value={productForm.price}
                onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))}
                placeholder="قیمت"
                className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright"
              />
              <input
                type="number"
                min="0"
                value={productForm.stock}
                onChange={(event) => setProductForm((prev) => ({ ...prev, stock: event.target.value }))}
                placeholder="موجودی"
                className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright"
              />
              <label className="flex items-center gap-3 rounded-xl border border-line bg-white/5 px-3 py-3 text-sm text-silver-bright">
                <input
                  type="checkbox"
                  checked={productForm.active}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, active: event.target.checked }))}
                />
                فعال در فروشگاه
              </label>
              <input
                value={productForm.image_url}
                onChange={(event) => setProductForm((prev) => ({ ...prev, image_url: event.target.value }))}
                placeholder="آدرس تصویر"
                className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright md:col-span-2"
              />
              <textarea
                value={productForm.description}
                onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="توضیحات محصول"
                className="min-h-[110px] rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright md:col-span-2"
              />
              <textarea
                value={productForm.specs}
                onChange={(event) => setProductForm((prev) => ({ ...prev, specs: event.target.value }))}
                placeholder="مشخصات فنی به‌صورت JSON"
                className="min-h-[120px] rounded-xl border border-line bg-white/5 px-3 py-3 font-mono text-sm text-silver-bright md:col-span-2"
              />

              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button type="submit" disabled={saving} className="rounded-xl bg-blue px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
                  {saving ? 'در حال ذخیره...' : editingId ? 'ذخیره تغییرات' : 'ثبت محصول'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetProductForm} className="rounded-xl border border-line bg-white/5 px-5 py-3 text-sm font-bold text-silver-bright">
                    انصراف
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="glass rounded-2xl p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-line bg-white/5 px-3 py-2">
                <Search className="h-4 w-4 text-silver-dim" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="جستجو در محصولات..."
                  className="w-full bg-transparent text-sm text-silver-bright outline-none placeholder:text-silver-dim"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-xl border border-line bg-white/5 px-3 py-2 text-sm text-silver-bright"
              >
                <option value="all">همه دسته‌ها</option>
                {productCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-line">
              <div className="hidden grid-cols-[1.4fr_0.7fr_0.7fr_0.6fr_0.7fr_0.6fr] gap-3 bg-white/5 px-4 py-3 text-xs font-medium text-silver-dim md:grid">
                <span>نام محصول</span>
                <span>دسته</span>
                <span>قیمت</span>
                <span>موجودی</span>
                <span>وضعیت</span>
                <span>عملیات</span>
              </div>

              <div className="divide-y divide-line">
                {filteredProducts.length === 0 ? (
                  <div className="p-6 text-center text-sm text-silver-dim">محصولی پیدا نشد.</div>
                ) : (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1.4fr_0.7fr_0.7fr_0.6fr_0.7fr_0.6fr] md:items-center">
                      <div>
                        <p className="font-bold text-silver-bright">{product.name}</p>
                        <p className="mt-1 text-[11px] text-silver-dim">{product.slug || 'بدون اسلاگ'}</p>
                      </div>
                      <span className="text-sm text-silver-dim">{product.category || 'other'}</span>
                      <span className="text-sm text-silver-bright">{Number(product.price).toLocaleString('fa-IR')} تومان</span>
                      <span className="text-sm text-silver-bright">{product.stock}</span>
                      <button type="button" onClick={() => void toggleProductActive(product)} className={`rounded-lg px-3 py-2 text-xs font-bold ${product.active ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/5 text-silver-dim'}`}>
                        {product.active ? 'فعال' : 'غیرفعال'}
                      </button>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleEditProduct(product)} className="rounded-lg border border-line bg-white/5 p-2 text-sky" aria-label="ویرایش محصول">
                          <PencilLine className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => void handleDeleteProduct(product.id)} className="rounded-lg border border-line bg-white/5 p-2 text-rose-300" aria-label="حذف محصول">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="glass rounded-2xl p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-black text-silver-bright">مدیریت سفارش‌ها</h2>
            <select value={orderFilter} onChange={(event) => setOrderFilter(event.target.value)} className="rounded-xl border border-line bg-white/5 px-3 py-2 text-sm text-silver-bright">
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="paid">پرداخت شده</option>
              <option value="processing">در حال آماده‌سازی</option>
              <option value="shipped">ارسال شده</option>
              <option value="completed">تکمیل شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
          </div>

          <div className="mt-5 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-line p-5 text-center text-sm text-silver-dim">سفارشی یافت نشد.</div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-line bg-white/5 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-bold text-silver-bright">{order.customer_name}</p>
                      <p className="text-xs text-silver-dim">{order.phone}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-silver-dim">مبلغ</p>
                      <p className="font-bold text-sky">{Number(order.total_amount).toLocaleString('fa-IR')} تومان</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <select value={order.status} onChange={(event) => void updateOrderStatus(order.id, event.target.value)} className="w-full rounded-lg border border-line bg-slate-950/40 px-3 py-2 text-sm text-silver-bright md:max-w-[220px]">
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
      )}

      {tab === 'repairs' && (
        <div className="glass rounded-2xl p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-black text-silver-bright">مدیریت درخواست‌های تعمیر</h2>
            <select value={repairFilter} onChange={(event) => setRepairFilter(event.target.value)} className="rounded-xl border border-line bg-white/5 px-3 py-2 text-sm text-silver-bright">
              <option value="all">همه وضعیت‌ها</option>
              <option value="received">دریافت شد</option>
              <option value="repairing">در حال تعمیر</option>
              <option value="waiting-parts">در انتظار قطعه</option>
              <option value="completed">تکمیل شده</option>
            </select>
          </div>

          <div className="mt-5 space-y-4">
            {filteredRepairs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-line p-5 text-center text-sm text-silver-dim">درخواستی یافت نشد.</div>
            ) : (
              filteredRepairs.map((repair) => (
                <div key={repair.id} className="rounded-2xl border border-line bg-white/5 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-bold text-silver-bright">{repair.customer_name}</p>
                      <p className="text-xs text-silver-dim">{repair.device} • {repair.phone}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-silver-dim">کد پیگیری</p>
                      <p className="font-bold text-sky">{repair.tracking_code}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-silver-bright">{repair.issue}</p>

                  <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                    <select value={repair.status} onChange={(event) => void updateRepairStatus(repair.id, event.target.value)} className="w-full rounded-lg border border-line bg-slate-950/40 px-3 py-2 text-sm text-silver-bright md:max-w-[220px]">
                      <option value="received">دریافت شد</option>
                      <option value="repairing">در حال تعمیر</option>
                      <option value="waiting-parts">در انتظار قطعه</option>
                      <option value="completed">تکمیل شده</option>
                    </select>
                    <input
                      defaultValue={repair.notes || ''}
                      onBlur={(event) => void handleRepairNote(repair.id, event.target.value)}
                      placeholder="یادداشت"
                      className="w-full rounded-lg border border-line bg-white/5 px-3 py-2 text-sm text-silver-bright"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="glass rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-2 text-sky">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-black text-silver-bright">مدیریت کاربران</h2>
          </div>

          <div className="mt-5 space-y-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-line bg-white/5 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-bold text-silver-bright">{user.full_name || 'بدون نام'}</p>
                    <p className="text-xs text-silver-dim">{user.phone || 'بدون شماره تماس'}</p>
                  </div>
                  <select value={user.role} onChange={(event) => void updateUserRole(user.id, event.target.value as 'customer' | 'admin')} className="rounded-lg border border-line bg-slate-950/40 px-3 py-2 text-sm text-silver-bright md:max-w-[180px]">
                    <option value="customer">customer</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'vpn' && (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-5 md:p-6">
            <div className="flex items-center gap-2 text-sky">
              <ShieldCheck className="h-5 w-5" />
              <h2 className="text-xl font-black text-silver-bright">مدیریت سرویس‌های VPN</h2>
            </div>

            <form onSubmit={saveVpnService} className="mt-5 grid gap-4 md:grid-cols-2">
              <input name="vpn-name" placeholder="نام سرویس" className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright" />
              <select name="vpn-protocol" className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright">
                <option value="SSH">SSH</option>
                <option value="NPV">NPV</option>
              </select>
              <input name="vpn-duration" type="number" min="1" defaultValue={30} placeholder="مدت زمان (روز)" className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright" />
              <input name="vpn-price" type="number" min="0" defaultValue={0} placeholder="قیمت" className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright" />
              <input name="vpn-stock" type="number" min="0" defaultValue={0} placeholder="تعداد موجودی" className="rounded-xl border border-line bg-white/5 px-3 py-3 text-silver-bright" />
              <label className="flex items-center gap-3 rounded-xl border border-line bg-white/5 px-3 py-3 text-sm text-silver-bright">
                <input name="vpn-active" type="checkbox" defaultChecked />
                فعال
              </label>
              <button type="submit" className="rounded-xl bg-blue px-5 py-3 text-sm font-bold text-white md:col-span-2">ثبت سرویس VPN</button>
            </form>
          </div>

          <div className="glass rounded-2xl p-5 md:p-6">
            <div className="space-y-3">
              {vpnServices.map((service) => (
                <div key={service.id} className="rounded-2xl border border-line bg-white/5 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-bold text-silver-bright">{service.name}</p>
                      <p className="text-xs text-silver-dim">{service.protocol} • {service.duration_days} روز</p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-silver-dim">قیمت</p>
                      <p className="font-bold text-sky">{Number(service.price).toLocaleString('fa-IR')} تومان</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
