import Link from 'next/link'
import { content } from '@/config/content'

function ArrowRight() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )
}

export default function HeroSection() {
  const { hero } = content
  const lines = hero.headline.split('\n')

  return (
    <section className="pt-36 pb-28 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 text-xs font-medium text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          {hero.badge}
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-zinc-950 leading-[1.05] mb-6">
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-zinc-500 max-w-2xl leading-relaxed mb-10">
          {hero.subheadline}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 bg-zinc-950 text-white text-sm font-medium px-6 py-3.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            {hero.ctaPrimary}
            <ArrowRight />
          </a>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-zinc-700 px-6 py-3.5 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
          >
            {hero.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  )
}
