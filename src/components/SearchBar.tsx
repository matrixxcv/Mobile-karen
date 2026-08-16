import { Search, X } from 'lucide-react'

export default function SearchBar({
  value,
  onChange,
  placeholder = 'جستجو، مثلاً «آیفون ۱۵ پرو»'
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-silver-dim" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-ring w-full rounded-xl glass py-3.5 pr-11 pl-11 text-sm text-silver-bright placeholder:text-silver-dim/70"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="پاک کردن جستجو"
          className="focus-ring absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-silver-dim hover:text-silver-bright"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
