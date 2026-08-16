import { toPersianDigits } from '@/lib/catalog'

export type SeriesFilter = 'all' | 13 | 14 | 15 | 16 | 17
export type TierFilter = 'all' | 'standard' | 'pro' | 'promax'

const SERIES: SeriesFilter[] = ['all', 13, 14, 15, 16, 17]
const TIERS: { value: TierFilter; label: string }[] = [
  { value: 'all', label: 'همه' },
  { value: 'standard', label: 'معمولی' },
  { value: 'pro', label: 'پرو' },
  { value: 'promax', label: 'پرو مکس' }
]

interface Props {
  series: SeriesFilter
  tier: TierFilter
  onSeriesChange: (s: SeriesFilter) => void
  onTierChange: (t: TierFilter) => void
}

export default function ProductFilters({ series, tier, onSeriesChange, onTierChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {SERIES.map((s) => (
          <button
            key={s}
            onClick={() => onSeriesChange(s)}
            className={`focus-ring rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              series === s
                ? 'border-blue bg-blue/15 text-sky'
                : 'border-line bg-white/5 text-silver-dim hover:text-silver-bright'
            }`}
          >
            {s === 'all' ? 'همه' : `آیفون ${toPersianDigits(s)}`}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {TIERS.map((t) => (
          <button
            key={t.value}
            onClick={() => onTierChange(t.value)}
            className={`focus-ring rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              tier === t.value
                ? 'border-sky bg-sky/10 text-sky'
                : 'border-line text-silver-dim hover:text-silver-bright'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
