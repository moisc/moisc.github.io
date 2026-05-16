import type { Metadata } from 'next'
import { content } from '@/config/content'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: `Contact · ${content.siteTitle}`,
}

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24">
          {/* Left: info */}
          <div>
            <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-4">
              Contact
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 mb-4">
              {content.contact.headline}
            </h1>
            <p className="text-base text-zinc-500 leading-relaxed mb-10">
              {content.contact.subheadline}
            </p>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${content.email}`}
                  className="text-sm text-zinc-700 hover:text-zinc-950 transition-colors"
                >
                  {content.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                  Phone
                </p>
                <a
                  href={`tel:${content.phone}`}
                  className="text-sm text-zinc-700 hover:text-zinc-950 transition-colors"
                >
                  {content.phone}
                </a>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                  Location
                </p>
                <p className="text-sm text-zinc-700">{content.location}</p>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-100">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
                Response time
              </p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-sm text-zinc-600">Usually within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
