import type { Metadata } from 'next'
import { content } from '@/config/content'
import ServiceCards from '@/components/ServiceCards'

export const metadata: Metadata = {
  title: `Services & Pricing · ${content.siteTitle}`,
}

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-4">
          Services & Pricing
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-950 mb-4">
          Straightforward pricing.
        </h1>
        <p className="text-lg text-zinc-500 max-w-xl leading-relaxed mb-14">
          No packages, no subscriptions. Pay per session — in-person or on Zoom.
          First intro call is always free.
        </p>

        <ServiceCards />

        {/* Subjects & FAQ */}
        <div className="mt-20 pt-16 border-t border-zinc-100">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 mb-8">
            Subjects covered
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.subjects.map((subject) => (
              <div key={subject.name} className="p-5 rounded-xl border border-zinc-200 bg-white">
                <h3 className="text-sm font-semibold text-zinc-950 mb-1">{subject.name}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {subject.levels.map((level) => (
                    <span
                      key={level}
                      className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 pt-16 border-t border-zinc-100">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 mb-8">
            Common questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: 'How long are sessions?',
                a: 'Most sessions run 60–90 minutes. We can do shorter check-ins or longer deep-dives depending on what you need.',
              },
              {
                q: 'How far do you travel for in-person?',
                a: 'I cover most of San Diego County — La Jolla, Mission Valley, Chula Vista, El Cajon, and surrounding areas. Ask if you\'re unsure.',
              },
              {
                q: 'How do I pay?',
                a: 'Venmo, Zelle, or cash — whatever\'s easiest. Payment after each session.',
              },
              {
                q: 'Can I get a free intro call first?',
                a: 'Yes, always. We\'ll spend 15 minutes on the phone before booking anything. No pressure, no commitment.',
              },
              {
                q: 'Do you work with adults?',
                a: 'Absolutely. Whether you\'re brushing up for a career change, tackling a continuing-ed course, or just curious — I work with adults as much as students.',
              },
              {
                q: 'How much notice do you need to book?',
                a: 'A day or two is usually fine. Reach out and we\'ll find something that works.',
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <p className="text-sm font-semibold text-zinc-950 mb-2">{q}</p>
                <p className="text-sm text-zinc-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
