import { useState } from 'react'
import SectionHeading from '@/components/SectionHeading'
import { vpnGuides } from '@/data/vpn'

export default function VpnGuides() {
  const [active, setActive] = useState(0)
  const guide = vpnGuides[active]

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 md:px-8">
      <SectionHeading eyebrow="مرحله‌به‌مرحله" title="آموزش اتصال" />

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {vpnGuides.map((g, i) => (
          <button
            key={g.platform}
            onClick={() => setActive(i)}
            className={`focus-ring rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active === i ? 'border-blue bg-blue/15 text-sky' : 'border-line text-silver-dim hover:text-silver-bright'
            }`}
          >
            {g.platform}
          </button>
        ))}
      </div>

      <ol className="mt-8 flex flex-col gap-4">
        {guide.steps.map((step, i) => (
          <li key={step.title} className="flex gap-4 rounded-2xl glass p-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue/20 text-sm font-bold text-sky">
              {i + 1}
            </span>
            <div>
              <p className="font-bold text-silver-bright">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-silver-dim">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
