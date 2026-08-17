import type { RepairService } from '@/types'

export const repairServices: RepairService[] = [
  { id: 'repair-general', title: 'تعمیر تخصصی آیفون', description: 'عیب‌یابی و تعمیر تمام مدل‌های آیفون توسط تکنسین مجرب.', icon: 'wrench' },
  { id: 'battery', title: 'تعویض باتری', description: 'تعویض باتری با قطعات باکیفیت و تست دقیق سلامت باتری.', icon: 'battery' },
  { id: 'screen', title: 'تعویض صفحه‌نمایش', description: 'تعویض تخصصی صفحه‌نمایش شکسته یا آسیب‌دیده.', icon: 'screen' },
  { id: 'board', title: 'تعمیر برد', description: 'تعمیرات تخصصی سطح برد برای مشکلات پیچیده سخت‌افزاری.', icon: 'chip' },
  { id: 'camera', title: 'تعمیر دوربین', description: 'رفع مشکلات فوکوس، لرزش تصویر و خرابی ماژول دوربین.', icon: 'camera' },
  { id: 'charging-port', title: 'تعمیر سوکت شارژ', description: 'رفع مشکل شارژ نشدن و تعویض سوکت شارژ.', icon: 'plug' },
  { id: 'speaker', title: 'تعمیر اسپیکر', description: 'رفع مشکلات صدای ضعیف، خش‌دار یا قطع‌وصل اسپیکر.', icon: 'speaker' },
  { id: 'microphone', title: 'تعمیر میکروفون', description: 'رفع مشکل شنیده نشدن صدا در تماس یا ضبط.', icon: 'mic' },
  { id: 'software', title: 'مشکلات نرم‌افزاری', description: 'رفع مشکلات نرم‌افزاری، هنگ کردن و به‌روزرسانی سیستم.', icon: 'software' },
  { id: 'diagnostics', title: 'عیب‌یابی تخصصی', description: 'تشخیص دقیق مشکل دستگاه پیش از هرگونه تعمیر.', icon: 'search' }
]

export const REPAIR_PHONE = '۰۹۹۱۳۲۱۳۶۹۹'
export const REPAIR_PHONE_TEL = '+989913213699'
export const STORE_OWNER_PHONE = '۰۹۳۳۱۲۵۴۵۲۶'
export const STORE_OWNER_PHONE_TEL = '+989331254526'
export const STORE_NAME = 'موبایل فروشی کارن'
export const STORE_ADDRESS = 'ملایر، چهارراه چمران، نبش پاساژ میلاد نور'
export const STORE_HOURS = 'ساعات کاری (قابل ویرایش): شنبه تا پنجشنبه — ساعت دقیق پس از تأیید فروشگاه درج می‌شود'
