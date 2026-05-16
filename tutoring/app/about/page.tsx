import type { Metadata } from 'next'
import { content } from '@/config/content'

export const metadata: Metadata = {
  title: `About · ${content.siteTitle}`,
}

export default function AboutPage() {
  const { about } = content

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-10">
          About
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
          {/* Photo column */}
          <div>
            {/* Photo — place your photo at tutoring/public/photo.jpg to display it */}
            <div className="w-full aspect-[3/4] rounded-2xl bg-zinc-100 overflow-hidden flex items-center justify-center">
              <img
                src="/photo.jpg"
                alt={about.photoAlt}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Credentials */}
            <div className="mt-8 flex flex-col gap-4">
              {about.credentials.map((c) => (
                <div key={c.label} className="flex flex-col gap-0.5">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    {c.label}
                  </p>
                  <p className="text-sm text-zinc-700">{c.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bio column */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 leading-tight mb-8">
              {about.headline}
            </h1>

            <div className="flex flex-col gap-5">
              {about.bio.map((paragraph, i) => (
                <p key={i} className="text-base text-zinc-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-100">
              <a
                href={`mailto:${content.email}`}
                className="inline-flex items-center gap-2 text-sm font-medium bg-zinc-950 text-white px-6 py-3.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Get in touch
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
