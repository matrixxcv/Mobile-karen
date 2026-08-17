import type { AccessoryProduct } from '@/types'

const A = '/assets/accessories'
export const accessories: AccessoryProduct[] = [
  { id:'charger', name:'شارژر دیواری', category:'charger', description:'شارژر سریع برای گوشی‌های موبایل', price:0, inStock:true, image:`${A}/charger.svg`, features:['شارژ سریع','مناسب انواع گوشی'] },
  { id:'cable', name:'کابل شارژ', category:'cable', description:'کابل شارژ و انتقال داده باکیفیت', price:0, inStock:true, image:`${A}/cable.svg`, features:['شارژ و دیتا','مقاوم و بادوام'] },
  { id:'handsfree', name:'هندزفری', category:'handsfree', description:'هندزفری سیمی و بلوتوثی برای استفاده روزمره', price:0, inStock:true, image:`${A}/handsfree.svg`, features:['صدای شفاف','مناسب تماس و موسیقی'] },
  { id:'adapter', name:'تبدیل و مبدل', category:'adapter', description:'انواع تبدیل شارژ و اتصال برای گوشی', price:0, inStock:true, image:`${A}/adapter.svg`, features:['سازگار با موبایل','جمع‌وجور'] },
  { id:'case', name:'قاب موبایل', category:'case', description:'قاب‌های متنوع و محافظ برای مدل‌های مختلف', price:0, inStock:true, image:`${A}/case.svg`, features:['محافظت در برابر ضربه','مدل‌های متنوع'] }
]
