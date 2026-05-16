import Link from 'next/link'
import { content } from '@/config/content'

function CheckIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="shrink-0 mt-0.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

export default function ServiceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {content.services.map((service) => (
        <div
          key={service.name}
          className={`rounded-xl p-8 flex flex-col gap-6 ${
            service.highlight
              ? 'bg-zinc-950 text-white'
              : 'bg-white border border-zinc-200'
          }`}
        >
          {/* Header */}
          <div>
            {service.highlight && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full mb-4 inline-block ${
                service.highlight ? 'bg-white/10 text-zinc-300' : 'bg-zinc-100 text-zinc-500'
              }`}>
                Most popular
              </span>
            )}
            <h3 className={`text-xl font-semibold tracking-tight ${service.highlight ? 'text-white' : 'text-zinc-950'}`}>
              {service.name}
            </h3>
            <p className={`text-sm mt-0.5 ${service.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {service.subtitle}
            </p>
          </div>

          {/* Rate */}
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-semibold tracking-tight ${service.highlight ? 'text-white' : 'text-zinc-950'}`}>
              ${service.rate}
            </span>
            <span className={`text-sm ${service.highlight ? 'text-zinc-400' : 'text-zinc-400'}`}>
              / {service.unit}
            </span>
          </div>

          {/* Description */}
          <p className={`text-sm leading-relaxed ${service.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {service.description}
          </p>

          {/* Features */}
          <ul className="flex flex-col gap-2.5">
            {service.features.map((f) => (
              <li key={f} className={`flex items-start gap-2.5 text-sm ${service.highlight ? 'text-zinc-300' : 'text-zinc-600'}`}>
                <span className={service.highlight ? 'text-zinc-400' : 'text-zinc-400'}>
                  <CheckIcon />
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-auto pt-2">
            <Link
              href="/contact"
              className={`block text-center text-sm font-medium px-5 py-3 rounded-lg transition-colors ${
                service.highlight
                  ? 'bg-white text-zinc-950 hover:bg-zinc-100'
                  : 'bg-zinc-950 text-white hover:bg-zinc-800'
              }`}
            >
              Book a session
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
