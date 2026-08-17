// ساختار داده محصول (آیفون)
export interface ProductSpecs {
  screen: string          // صفحه‌نمایش
  chip: string             // پردازنده
  camera: string           // دوربین
  battery: string          // باتری
  weight: string           // وزن
  storageOptions: string[] // ظرفیت‌ها
  colors: string[]         // رنگ‌ها
}

export interface Product {
  id: string                 // اسلاگ یکتا برای مسیر صفحه، مثل iphone-15-pro
  series: 13 | 14 | 15 | 16 | 17
  tier: 'standard' | 'pro' | 'promax'
  name: string                // نام نمایشی فارسی
  shortDescription: string
  description: string
  specs: ProductSpecs
  features: string[]          // امکانات مهم
  inStock: boolean            // وضعیت موجودی
  image: string                // مسیر تصویر اصلی (placeholder قابل جایگزینی)
  gallery: string[]            // گالری اختصاصی
  priceNote: string            // برای استعلام قیمت تماس بگیرید
}

export interface RepairService {
  id: string
  title: string
  description: string
  icon: string
}

// ---------- بخش VPN ----------

export interface VpnPlatform {
  id: string
  title: string          // مثل «آیفون»، «اندروید»
  description: string
  icon: string
}

export interface VpnProtocol {
  id: string
  title: string           // WireGuard, OpenVPN, IKEv2 ...
  description: string
  speedLevel: 1 | 2 | 3   // برای نمایش نسبی، نمونه/قابل‌ویرایش
  securityLevel: 1 | 2 | 3
}

// داده‌های مقایسه/سرور به‌وضوح نمونه و قابل‌ویرایش هستند؛ اطلاعات زنده نیستند
export interface VpnServiceSample {
  id: string
  name: string
  speed: 1 | 2 | 3 | 4 | 5
  stability: 1 | 2 | 3 | 4 | 5
  deviceCount: string
  supportedOS: string[]
  protocols: string[]
  serverLocations: string
  features: string[]
  resourceUsage: 'کم' | 'متوسط' | 'زیاد'
  easeOfUse: 1 | 2 | 3 | 4 | 5
}

export interface VpnServerSample {
  id: string
  country: string
  flag: string
  status: 'نمونه'
  ping: string
  speed: string
  load: string
  protocol: string
}

export interface VpnGuideStep {
  title: string
  description: string
}

export interface VpnGuide {
  platform: string
  steps: VpnGuideStep[]
}


export type AccessoryCategory = 'charger' | 'cable' | 'handsfree' | 'adapter' | 'case'

export interface AccessoryProduct {
  id: string
  name: string
  category: AccessoryCategory
  description: string
  price: number
  oldPrice?: number
  inStock: boolean
  image: string
  features: string[]
}
