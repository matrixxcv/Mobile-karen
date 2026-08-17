import type { VpnPlatform, VpnProtocol, VpnServiceSample, VpnServerSample, VpnGuide } from '@/types'

// تمام داده‌های این فایل ساختاری/نمونه هستند و برای اتصال بعدی به API واقعی طراحی شده‌اند.
// هیچ داده‌ای در این فایل نباید به‌عنوان اطلاعات زنده یا واقعی در نظر گرفته شود.

export const vpnPlatforms: VpnPlatform[] = [
  { id: 'mobile', title: 'موبایل', description: 'راهنمای عمومی استفاده از VPN روی گوشی‌های هوشمند.', icon: 'phone' },
  { id: 'ios', title: 'آیفون', description: 'تنظیم و مدیریت VPN روی iOS با پشتیبانی از پروفایل‌های امن.', icon: 'apple' },
  { id: 'android', title: 'اندروید', description: 'نصب و پیکربندی VPN روی دستگاه‌های اندرویدی.', icon: 'android' },
  { id: 'windows', title: 'ویندوز', description: 'راه‌اندازی VPN روی سیستم‌عامل ویندوز برای استفاده در کامپیوتر.', icon: 'windows' },
  { id: 'mac', title: 'مک', description: 'پیکربندی VPN روی macOS با تمرکز بر پایداری اتصال.', icon: 'mac' },
  { id: 'router', title: 'روتر', description: 'تنظیم VPN در سطح روتر برای پوشش تمام دستگاه‌های خانه یا محل کار.', icon: 'router' }
]

export const vpnProtocols: VpnProtocol[] = [
  {
    id: 'ssh',
    title: 'SSH',
    description: 'سرویس SSH موبایل کارن برای اتصال امن و پایدار؛ جزئیات سرویس پس از خرید در حساب کاربری نمایش داده می‌شود.',
    speedLevel: 3,
    securityLevel: 3
  },
  {
    id: 'npv',
    title: 'NPV',
    description: 'سرویس NPV موبایل کارن با پلن‌های قابل مدیریت و تحویل اطلاعات اتصال پس از خرید.',
    speedLevel: 3,
    securityLevel: 3
  }
]

export const vpnServiceSamples: VpnServiceSample[] = [
  {
    id: 'ssh-1m',
    name: 'SSH — یک ماهه',
    speed: 4,
    stability: 4,
    deviceCount: 'طبق پلن',
    supportedOS: ['iOS', 'Android', 'Windows', 'macOS'],
    protocols: ['SSH'],
    serverLocations: 'طبق موجودی پنل',
    features: ['تحویل پس از پرداخت', 'مدیریت از حساب کاربری'],
    resourceUsage: 'کم',
    easeOfUse: 4
  },
  {
    id: 'npv-1m',
    name: 'NPV — یک ماهه',
    speed: 4,
    stability: 4,
    deviceCount: 'طبق پلن',
    supportedOS: ['iOS', 'Android', 'Windows', 'macOS'],
    protocols: ['NPV'],
    serverLocations: 'طبق موجودی پنل',
    features: ['تحویل پس از پرداخت', 'مدیریت از حساب کاربری'],
    resourceUsage: 'کم',
    easeOfUse: 4
  }
]

export const vpnServerSamples: VpnServerSample[] = []

export const vpnGuides: VpnGuide[] = [
  {
    platform: 'آیفون (iOS)',
    steps: [
      { title: 'ورود به تنظیمات', description: 'به بخش «تنظیمات» و سپس «VPN» در گوشی خود بروید.' },
      { title: 'افزودن پیکربندی', description: 'گزینه «افزودن پیکربندی VPN» را انتخاب کرده و اطلاعات سرویس را وارد کنید.' },
      { title: 'فعال‌سازی اتصال', description: 'کلید VPN را روشن کنید تا اتصال برقرار شود.' },
      { title: 'بررسی وضعیت', description: 'از برقراری صحیح اتصال از طریق نماد VPN در نوار بالای صفحه مطمئن شوید.' }
    ]
  },
  {
    platform: 'اندروید',
    steps: [
      { title: 'ورود به تنظیمات شبکه', description: 'به «تنظیمات» > «شبکه و اینترنت» > «VPN» بروید.' },
      { title: 'افزودن پروفایل', description: 'یک پروفایل VPN جدید ایجاد کرده و اطلاعات لازم را وارد کنید.' },
      { title: 'اتصال', description: 'پروفایل ایجادشده را انتخاب و به آن متصل شوید.' },
      { title: 'تأیید اتصال', description: 'نماد کلید در نوار وضعیت، برقراری اتصال را نشان می‌دهد.' }
    ]
  },
  {
    platform: 'ویندوز',
    steps: [
      { title: 'ورود به تنظیمات', description: 'به «تنظیمات» > «شبکه و اینترنت» > «VPN» بروید.' },
      { title: 'افزودن اتصال VPN', description: 'گزینه «افزودن یک اتصال VPN» را انتخاب کرده و اطلاعات را تکمیل کنید.' },
      { title: 'اتصال', description: 'روی اتصال ایجادشده کلیک کرده و گزینه «Connect» را بزنید.' }
    ]
  },
  {
    platform: 'مک (macOS)',
    steps: [
      { title: 'ورود به تنظیمات سیستم', description: 'به «تنظیمات سیستم» > «شبکه» بروید.' },
      { title: 'افزودن سرویس VPN', description: 'با علامت «+» یک سرویس VPN جدید اضافه کرده و اطلاعات را وارد کنید.' },
      { title: 'اتصال', description: 'سرویس ایجادشده را انتخاب کرده و «Connect» را بزنید.' }
    ]
  }
]
