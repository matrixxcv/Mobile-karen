import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Smartphone } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'خانه' },
  { to: '/iphones', label: 'آیفون‌ها' },
  { to: '/accessories', label: 'لوازم جانبی' },
  { to: '/comparison', label: 'مقایسه' },
  { to: '/repairs', label: 'تعمیرات' },
  { to: '/vpn', label: 'VPN' },
  { to: '/about', label: 'درباره ما' },
  { to: '/contact', label: 'تماس با ما' }
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? 'glass-strong shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <NavLink to="/" className="flex items-center gap-2 focus-ring">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue to-sky shadow-glow-blue">
            <Smartphone className="h-5 w-5 text-void" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-silver-bright">
            موبایل کارن
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `focus-ring rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/5 text-sky'
                    : 'text-silver hover:text-silver-bright'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg text-silver-bright lg:hidden"
          aria-label={open ? 'بستن منو' : 'باز کردن منو'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="glass-strong border-t border-white/5 px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `focus-ring rounded-lg px-3.5 py-3 text-base font-medium transition-colors ${
                    isActive ? 'bg-white/5 text-sky' : 'text-silver hover:text-silver-bright'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
