import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-32 text-center">
      <p className="font-display text-6xl font-extrabold text-gradient">۴۰۴</p>
      <h1 className="font-display text-xl font-bold text-silver-bright">صفحه مورد نظر یافت نشد</h1>
      <p className="text-sm text-silver-dim">ممکن است آدرس اشتباه باشد یا صفحه جابه‌جا شده باشد.</p>
      <Link to="/" className="focus-ring mt-2 rounded-xl bg-blue px-6 py-3 text-sm font-bold text-white">
        بازگشت به خانه
      </Link>
    </section>
  )
}
