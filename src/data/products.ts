import type { Product } from '@/types'

// نکته مهم: مشخصات زیر بر اساس اطلاعات عمومی و شناخته‌شده هر مدل تنظیم شده است.
// در صورت نیاز به دقت بیشتر یا به‌روزرسانی قیمت/موجودی، این فایل کاملاً قابل ویرایش است.
// تصاویر به‌صورت مسیر اختصاصی برای هر مدل تعریف شده‌اند تا بعداً با تصاویر واقعی جایگزین شوند.

const PRICE_NOTE = 'برای استعلام قیمت تماس بگیرید'

function img(id: string, index: number) {
  return `/assets/products/${id}/${index}.svg`
}

function gallery(id: string) {
  return [img(id, 1), img(id, 2), img(id, 3), img(id, 4)]
}

export const products: Product[] = [
  // ---------- سری ۱۳ ----------
  {
    id: 'iphone-13',
    series: 13,
    tier: 'standard',
    name: 'آیفون ۱۳',
    shortDescription: 'تعادل کامل بین قیمت و کارایی با طراحی فشرده',
    description:
      'آیفون ۱۳ با تراشه قدرتمند A15 Bionic، دوربین دوگانه پیشرفته و بدنه فشرده، انتخابی مطمئن برای استفاده روزمره است. این مدل نسبت به نسل‌های قدیمی‌تر عمر باتری بهتر و کیفیت تصویربرداری بالاتری ارائه می‌دهد.',
    specs: {
      screen: '۶.۱ اینچ Super Retina XDR OLED',
      chip: 'Apple A15 Bionic',
      camera: 'دوگانه ۱۲ مگاپیکسل (واید و اولترا واید)',
      battery: 'حدود یک روز کامل با یک بار شارژ',
      weight: 'حدود ۱۷۴ گرم',
      storageOptions: ['۱۲۸ گیگابایت', '۲۵۶ گیگابایت', '۵۱۲ گیگابایت'],
      colors: ['مشکی', 'صورتی', 'آبی', 'قرمز', 'سفید ستاره‌ای']
    },
    features: ['حالت سینمایی فیلم‌برداری', 'مقاوم در برابر آب و گردوغبار (IP68)', 'Face ID', 'شارژ MagSafe'],
    inStock: true,
    image: img('iphone-13', 1),
    gallery: gallery('iphone-13'),
    priceNote: PRICE_NOTE
  },
  {
    id: 'iphone-13-pro',
    series: 13,
    tier: 'pro',
    name: 'آیفون ۱۳ پرو',
    shortDescription: 'صفحه‌نمایش ProMotion و دوربین سه‌گانه حرفه‌ای',
    description:
      'آیفون ۱۳ پرو با نمایشگر ProMotion با نرخ نوسازی ۱۲۰ هرتز و سیستم دوربین سه‌گانه، تجربه‌ای روان‌تر و کیفیت عکاسی حرفه‌ای‌تری نسبت به مدل استاندارد ارائه می‌دهد.',
    specs: {
      screen: '۶.۱ اینچ Super Retina XDR با ProMotion ۱۲۰ هرتز',
      chip: 'Apple A15 Bionic (نسخه گرافیک قوی‌تر)',
      camera: 'سه‌گانه ۱۲ مگاپیکسل (واید، اولترا واید، تله‌فوتو) + LiDAR',
      battery: 'عمر باتری بهبودیافته نسبت به مدل استاندارد',
      weight: 'حدود ۲۰۴ گرم',
      storageOptions: ['۱۲۸ گیگابایت', '۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت'],
      colors: ['نقره‌ای', 'گرافیتی', 'طلایی', 'آبی اقیانوسی']
    },
    features: ['بدنه استیل ضدزنگ', 'حالت عکاسی ماکرو', 'ProRAW و ProRes', 'صفحه‌نمایش با روشنایی بالا'],
    inStock: true,
    image: img('iphone-13-pro', 1),
    gallery: gallery('iphone-13-pro'),
    priceNote: PRICE_NOTE
  },
  {
    id: 'iphone-13-pro-max',
    series: 13,
    tier: 'promax',
    name: 'آیفون ۱۳ پرو مکس',
    shortDescription: 'بزرگ‌ترین نمایشگر و طولانی‌ترین عمر باتری سری ۱۳',
    description:
      'آیفون ۱۳ پرو مکس تمام امکانات نسخه پرو را با نمایشگر بزرگ‌تر و باتری قوی‌تر ترکیب کرده و برای کاربرانی که به صفحه بزرگ و دوام بالا نیاز دارند مناسب است.',
    specs: {
      screen: '۶.۷ اینچ Super Retina XDR با ProMotion ۱۲۰ هرتز',
      chip: 'Apple A15 Bionic (نسخه گرافیک قوی‌تر)',
      camera: 'سه‌گانه ۱۲ مگاپیکسل + سنسور LiDAR',
      battery: 'طولانی‌ترین عمر باتری در میان آیفون‌های تا آن زمان',
      weight: 'حدود ۲۳۸ گرم',
      storageOptions: ['۱۲۸ گیگابایت', '۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت'],
      colors: ['نقره‌ای', 'گرافیتی', 'طلایی', 'آبی اقیانوسی']
    },
    features: ['بدنه استیل ضدزنگ', 'زوم اپتیکال بهبودیافته', 'ProRAW و ProRes', 'باتری بزرگ‌تر'],
    inStock: true,
    image: img('iphone-13-pro-max', 1),
    gallery: gallery('iphone-13-pro-max'),
    priceNote: PRICE_NOTE
  },

  // ---------- سری ۱۴ ----------
  {
    id: 'iphone-14',
    series: 14,
    tier: 'standard',
    name: 'آیفون ۱۴',
    shortDescription: 'ایمنی هوشمند و پایداری بالا در استفاده روزمره',
    description:
      'آیفون ۱۴ با تمرکز بر پایداری، امنیت و کیفیت دوربین بهبودیافته طراحی شده و ویژگی‌های ایمنی مانند تشخیص برخورد را به آیفون‌های استاندارد اضافه کرده است.',
    specs: {
      screen: '۶.۱ اینچ Super Retina XDR OLED',
      chip: 'Apple A15 Bionic (نسخه ۵ هسته گرافیکی)',
      camera: 'دوگانه ۱۲ مگاپیکسل با سنسور اصلی بهبودیافته',
      battery: 'بهبود قابل توجه نسبت به نسل قبل',
      weight: 'حدود ۱۷۲ گرم',
      storageOptions: ['۱۲۸ گیگابایت', '۲۵۶ گیگابایت', '۵۱۲ گیگابایت'],
      colors: ['مشکی', 'ستاره‌ای', 'آبی', 'بنفش', 'قرمز', 'زرد']
    },
    features: ['تشخیص برخورد (Crash Detection)', 'ارتباط ماهواره‌ای اضطراری', 'Face ID', 'شارژ MagSafe'],
    inStock: true,
    image: img('iphone-14', 1),
    gallery: gallery('iphone-14'),
    priceNote: PRICE_NOTE
  },
  {
    id: 'iphone-14-pro',
    series: 14,
    tier: 'pro',
    name: 'آیفون ۱۴ پرو',
    shortDescription: 'معرفی Dynamic Island و دوربین ۴۸ مگاپیکسلی',
    description:
      'آیفون ۱۴ پرو با معرفی Dynamic Island، نمایشگر Always-On و دوربین اصلی ۴۸ مگاپیکسلی، جهشی بزرگ در تجربه کاربری و کیفیت عکاسی سری پرو محسوب می‌شود.',
    specs: {
      screen: '۶.۱ اینچ Super Retina XDR با Always-On و Dynamic Island',
      chip: 'Apple A16 Bionic',
      camera: 'سه‌گانه با سنسور اصلی ۴۸ مگاپیکسل',
      battery: 'عمر باتری تا یک روز کامل',
      weight: 'حدود ۲۰۶ گرم',
      storageOptions: ['۱۲۸ گیگابایت', '۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت'],
      colors: ['بنفش تیره', 'طلایی', 'نقره‌ای', 'مشکی فضایی']
    },
    features: ['Dynamic Island', 'نمایشگر Always-On', 'دوربین ۴۸ مگاپیکسل با ProRAW', 'بدنه استیل ضدزنگ'],
    inStock: true,
    image: img('iphone-14-pro', 1),
    gallery: gallery('iphone-14-pro'),
    priceNote: PRICE_NOTE
  },
  {
    id: 'iphone-14-pro-max',
    series: 14,
    tier: 'promax',
    name: 'آیفون ۱۴ پرو مکس',
    shortDescription: 'تمام امکانات پرو در بزرگ‌ترین بدنه سری ۱۴',
    description:
      'آیفون ۱۴ پرو مکس با نمایشگر بزرگ‌تر و باتری قوی‌تر، انتخاب ایده‌آل برای کاربرانی است که علاوه بر امکانات پرو، به بیشترین دوام باتری نیاز دارند.',
    specs: {
      screen: '۶.۷ اینچ Super Retina XDR با Always-On و Dynamic Island',
      chip: 'Apple A16 Bionic',
      camera: 'سه‌گانه با سنسور اصلی ۴۸ مگاپیکسل',
      battery: 'طولانی‌ترین عمر باتری در میان آیفون‌های ۱۴',
      weight: 'حدود ۲۴۰ گرم',
      storageOptions: ['۱۲۸ گیگابایت', '۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت'],
      colors: ['بنفش تیره', 'طلایی', 'نقره‌ای', 'مشکی فضایی']
    },
    features: ['Dynamic Island', 'نمایشگر Always-On', 'زوم اپتیکال بهبودیافته', 'بدنه استیل ضدزنگ'],
    inStock: true,
    image: img('iphone-14-pro-max', 1),
    gallery: gallery('iphone-14-pro-max'),
    priceNote: PRICE_NOTE
  },

  // ---------- سری ۱۵ ----------
  {
    id: 'iphone-15',
    series: 15,
    tier: 'standard',
    name: 'آیفون ۱۵',
    shortDescription: 'پورت USB-C و Dynamic Island برای همه',
    description:
      'آیفون ۱۵ برای اولین بار Dynamic Island را به مدل استاندارد آورده و با پورت USB-C، بدنه با لبه‌های شیشه‌ای رنگی و دوربین ۴۸ مگاپیکسلی ارتقا یافته است.',
    specs: {
      screen: '۶.۱ اینچ Super Retina XDR با Dynamic Island',
      chip: 'Apple A16 Bionic',
      camera: 'دوگانه با سنسور اصلی ۴۸ مگاپیکسل',
      battery: 'عمر باتری تا یک روز کامل',
      weight: 'حدود ۱۷۱ گرم',
      storageOptions: ['۱۲۸ گیگابایت', '۲۵۶ گیگابایت', '۵۱۲ گیگابایت'],
      colors: ['صورتی', 'زرد', 'سبز', 'آبی', 'مشکی']
    },
    features: ['Dynamic Island', 'پورت USB-C', 'دوربین ۴۸ مگاپیکسل', 'شیشه پشتی رنگی دو لایه'],
    inStock: true,
    image: img('iphone-15', 1),
    gallery: gallery('iphone-15'),
    priceNote: PRICE_NOTE
  },
  {
    id: 'iphone-15-pro',
    series: 15,
    tier: 'pro',
    name: 'آیفون ۱۵ پرو',
    shortDescription: 'بدنه تیتانیومی و دکمه Action سفارشی‌شونده',
    description:
      'آیفون ۱۵ پرو با بدنه تیتانیومی سبک‌تر، تراشه A17 Pro و دکمه Action قابل تنظیم، سطح جدیدی از عملکرد و کیفیت ساخت را به سری پرو آورده است.',
    specs: {
      screen: '۶.۱ اینچ Super Retina XDR با ProMotion و Always-On',
      chip: 'Apple A17 Pro',
      camera: 'سه‌گانه ۴۸ مگاپیکسل با زوم اپتیکال بهبودیافته',
      battery: 'عمر باتری تا یک روز کامل',
      weight: 'حدود ۱۸۷ گرم (سبک‌تر با بدنه تیتانیوم)',
      storageOptions: ['۱۲۸ گیگابایت', '۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت'],
      colors: ['تیتانیوم طبیعی', 'تیتانیوم آبی', 'تیتانیوم سفید', 'تیتانیوم مشکی']
    },
    features: ['بدنه تیتانیومی', 'دکمه Action', 'پورت USB-C با سرعت بالا', 'پشتیبانی از ضبط ویدیوی ProRes'],
    inStock: true,
    image: img('iphone-15-pro', 1),
    gallery: gallery('iphone-15-pro'),
    priceNote: PRICE_NOTE
  },
  {
    id: 'iphone-15-pro-max',
    series: 15,
    tier: 'promax',
    name: 'آیفون ۱۵ پرو مکس',
    shortDescription: 'دوربین تله‌فوتو پریسکوپی با زوم اپتیکال بالا',
    description:
      'آیفون ۱۵ پرو مکس با دوربین تله‌فوتو پریسکوپی، بالاترین سطح زوم اپتیکال را در میان آیفون‌ها ارائه می‌دهد و برای کاربران حرفه‌ای عکاسی و فیلم‌برداری مناسب است.',
    specs: {
      screen: '۶.۷ اینچ Super Retina XDR با ProMotion و Always-On',
      chip: 'Apple A17 Pro',
      camera: 'سه‌گانه با دوربین تله‌فوتو پریسکوپی و زوم اپتیکال بالا',
      battery: 'طولانی‌ترین عمر باتری در میان آیفون‌های ۱۵',
      weight: 'حدود ۲۲۱ گرم',
      storageOptions: ['۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت'],
      colors: ['تیتانیوم طبیعی', 'تیتانیوم آبی', 'تیتانیوم سفید', 'تیتانیوم مشکی']
    },
    features: ['دوربین پریسکوپی', 'بدنه تیتانیومی', 'دکمه Action', 'ضبط ویدیوی ProRes روی حافظه خارجی'],
    inStock: true,
    image: img('iphone-15-pro-max', 1),
    gallery: gallery('iphone-15-pro-max'),
    priceNote: PRICE_NOTE
  },

  // ---------- سری ۱۶ ----------
  {
    id: 'iphone-16',
    series: 16,
    tier: 'standard',
    name: 'آیفون ۱۶',
    shortDescription: 'دکمه جدید Camera Control و هوش مصنوعی Apple Intelligence',
    description:
      'آیفون ۱۶ با دکمه اختصاصی Camera Control، تراشه جدید و پشتیبانی از قابلیت‌های هوش مصنوعی Apple Intelligence، تجربه‌ای هوشمندتر برای کاربران عادی فراهم می‌کند.',
    specs: {
      screen: '۶.۱ اینچ Super Retina XDR با Dynamic Island',
      chip: 'Apple A18',
      camera: 'دوگانه ۴۸ مگاپیکسل با کنترل جدید دوربین',
      battery: 'عمر باتری بهبودیافته نسبت به نسل قبل',
      weight: 'حدود ۱۷۰ گرم',
      storageOptions: ['۱۲۸ گیگابایت', '۲۵۶ گیگابایت', '۵۱۲ گیگابایت'],
      colors: ['مشکی', 'سفید', 'صورتی', 'آبی آسمانی', 'سبز اولیو']
    },
    features: ['دکمه Camera Control', 'Apple Intelligence', 'Dynamic Island', 'پورت USB-C'],
    inStock: true,
    image: img('iphone-16', 1),
    gallery: gallery('iphone-16'),
    priceNote: PRICE_NOTE
  },
  {
    id: 'iphone-16-pro',
    series: 16,
    tier: 'pro',
    name: 'آیفون ۱۶ پرو',
    shortDescription: 'نمایشگر بزرگ‌تر و تراشه A18 Pro برای عملکرد حرفه‌ای',
    description:
      'آیفون ۱۶ پرو با نمایشگر بزرگ‌تر نسبت به نسل قبل، تراشه A18 Pro و بهبودهای قابل توجه در دوربین‌ها، برای کاربران حرفه‌ای طراحی شده است.',
    specs: {
      screen: '۶.۳ اینچ Super Retina XDR با ProMotion و Always-On',
      chip: 'Apple A18 Pro',
      camera: 'سه‌گانه ۴۸ مگاپیکسل با کیفیت ویدیوی بهبودیافته',
      battery: 'عمر باتری تا یک روز کامل و بیشتر',
      weight: 'حدود ۱۹۹ گرم',
      storageOptions: ['۱۲۸ گیگابایت', '۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت'],
      colors: ['تیتانیوم مشکی', 'تیتانیوم صحرایی', 'تیتانیوم سفید', 'تیتانیوم طبیعی']
    },
    features: ['دکمه Camera Control', 'بدنه تیتانیومی', 'Apple Intelligence', 'ضبط ویدیوی حرفه‌ای'],
    inStock: true,
    image: img('iphone-16-pro', 1),
    gallery: gallery('iphone-16-pro'),
    priceNote: PRICE_NOTE
  },
  {
    id: 'iphone-16-pro-max',
    series: 16,
    tier: 'promax',
    name: 'آیفون ۱۶ پرو مکس',
    shortDescription: 'بزرگ‌ترین نمایشگر آیفون تا این سری با باتری قدرتمند',
    description:
      'آیفون ۱۶ پرو مکس با بزرگ‌ترین نمایشگر ارائه‌شده در آیفون تا این نسل و باتری با ظرفیت بالا، برای کاربرانی که بیشترین کارایی را می‌خواهند مناسب است.',
    specs: {
      screen: '۶.۹ اینچ Super Retina XDR با ProMotion و Always-On',
      chip: 'Apple A18 Pro',
      camera: 'سه‌گانه ۴۸ مگاپیکسل با دوربین تله‌فوتو پیشرفته',
      battery: 'طولانی‌ترین عمر باتری در میان آیفون‌های ۱۶',
      weight: 'حدود ۲۲۷ گرم',
      storageOptions: ['۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت'],
      colors: ['تیتانیوم مشکی', 'تیتانیوم صحرایی', 'تیتانیوم سفید', 'تیتانیوم طبیعی']
    },
    features: ['دکمه Camera Control', 'بدنه تیتانیومی', 'Apple Intelligence', 'باتری با ظرفیت بالا'],
    inStock: true,
    image: img('iphone-16-pro-max', 1),
    gallery: gallery('iphone-16-pro-max'),
    priceNote: PRICE_NOTE
  },

  // ---------- سری ۱۷ ----------
  {
    id: 'iphone-17',
    series: 17,
    tier: 'standard',
    name: 'آیفون ۱۷',
    shortDescription: 'جدیدترین نسل استاندارد با نمایشگر و تراشه ارتقایافته',
    description:
      'آیفون ۱۷ به‌عنوان جدیدترین مدل استاندارد اپل، با نمایشگر ارتقایافته، تراشه نسل جدید و بهبود در دوربین جلو و عقب عرضه شده است. مشخصات دقیق در صورت نیاز قابل ویرایش و به‌روزرسانی است.',
    specs: {
      screen: '۶.۳ اینچ Super Retina XDR با Dynamic Island',
      chip: 'Apple A19',
      camera: 'دوگانه با کیفیت تصویربرداری ارتقایافته',
      battery: 'عمر باتری بهبودیافته نسبت به سری ۱۶',
      weight: 'حدود ۱۷۷ گرم',
      storageOptions: ['۲۵۶ گیگابایت', '۵۱۲ گیگابایت'],
      colors: ['مشکی', 'سفید', 'آبی', 'بنفش کم‌رنگ', 'سبز کم‌رنگ']
    },
    features: ['Apple Intelligence', 'Dynamic Island', 'پورت USB-C', 'دوربین جلوی ارتقایافته'],
    inStock: true,
    image: img('iphone-17', 1),
    gallery: gallery('iphone-17'),
    priceNote: PRICE_NOTE
  },
  {
    id: 'iphone-17-pro',
    series: 17,
    tier: 'pro',
    name: 'آیفون ۱۷ پرو',
    shortDescription: 'طراحی جدید بدنه و سیستم خنک‌کنندگی پیشرفته‌تر',
    description:
      'آیفون ۱۷ پرو با طراحی به‌روزشده بدنه، تراشه Pro نسل جدید و سیستم مدیریت حرارتی پیشرفته‌تر، عملکرد پایدارتری در بارهای سنگین گرافیکی ارائه می‌دهد. مشخصات دقیق قابل ویرایش است.',
    specs: {
      screen: '۶.۳ اینچ Super Retina XDR با ProMotion و Always-On',
      chip: 'Apple A19 Pro',
      camera: 'سه‌گانه با کیفیت ویدیو و زوم بهبودیافته',
      battery: 'عمر باتری تا یک روز کامل و بیشتر',
      weight: 'حدود ۲۰۰ گرم (تقریبی)',
      storageOptions: ['۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت'],
      colors: ['تیتانیوم مشکی', 'تیتانیوم نارنجی', 'تیتانیوم نقره‌ای']
    },
    features: ['بدنه آلومینیومی-تیتانیومی جدید', 'سیستم خنک‌کنندگی پیشرفته', 'Apple Intelligence', 'دکمه Camera Control'],
    inStock: true,
    image: img('iphone-17-pro', 1),
    gallery: gallery('iphone-17-pro'),
    priceNote: PRICE_NOTE
  },
  {
    id: 'iphone-17-pro-max',
    series: 17,
    tier: 'promax',
    name: 'آیفون ۱۷ پرو مکس',
    shortDescription: 'پرچم‌دار مطلق اپل با بزرگ‌ترین باتری و بهترین دوربین',
    description:
      'آیفون ۱۷ پرو مکس در جایگاه پرچم‌دار خانواده آیفون ۱۷ قرار دارد و بالاترین ظرفیت باتری، پیشرفته‌ترین سیستم دوربین و قدرتمندترین پردازنده این نسل را در خود جای داده است. مشخصات دقیق قابل ویرایش است.',
    specs: {
      screen: '۶.۹ اینچ Super Retina XDR با ProMotion و Always-On',
      chip: 'Apple A19 Pro',
      camera: 'سه‌گانه پیشرفته با دوربین تله‌فوتو با زوم بالا',
      battery: 'بیشترین عمر باتری در میان آیفون‌های عرضه‌شده',
      weight: 'حدود ۲۳۰ گرم (تقریبی)',
      storageOptions: ['۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت', '۲ ترابایت'],
      colors: ['تیتانیوم مشکی', 'تیتانیوم نارنجی', 'تیتانیوم نقره‌ای']
    },
    features: ['بدنه جدید با مدیریت حرارتی بهتر', 'بزرگ‌ترین باتری آیفون', 'Apple Intelligence', 'دوربین تله‌فوتو با زوم بالا'],
    inStock: true,
    image: img('iphone-17-pro-max', 1),
    gallery: gallery('iphone-17-pro-max'),
    priceNote: PRICE_NOTE
  }
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getSeriesLabel(series: Product['series']): string {
  return `آیفون ${toPersianDigits(series)}`
}

export function getTierLabel(tier: Product['tier']): string {
  if (tier === 'standard') return 'معمولی'
  if (tier === 'pro') return 'پرو'
  return 'پرو مکس'
}

export function toPersianDigits(input: number | string): string {
  const map: Record<string, string> = {
    '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
    '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹'
  }
  return String(input).replace(/[0-9]/g, (d) => map[d])
}
