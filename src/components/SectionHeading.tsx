export default function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-3.5 py-1 text-xs font-medium text-sky">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-display text-3xl font-extrabold text-silver-bright md:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-sm leading-7 text-silver-dim md:text-base">{description}</p>}
    </div>
  )
}
