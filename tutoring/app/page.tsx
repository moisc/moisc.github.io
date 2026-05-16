import HeroSection from '@/components/HeroSection'
import SubjectsSection from '@/components/SubjectsSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import ContactForm from '@/components/ContactForm'
import { content } from '@/config/content'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SubjectsSection />
      <HowItWorksSection />
      <TestimonialsSection />

      {/* Contact section — scrolled to from hero CTA */}
      <section id="contact" className="py-20 px-6 border-t border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-4">
                Contact
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 mb-4">
                {content.contact.headline}
              </h2>
              <p className="text-base text-zinc-500 leading-relaxed mb-8">
                {content.contact.subheadline}
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <span className="w-5 h-5 text-zinc-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <a href={`mailto:${content.email}`} className="hover:text-zinc-950 transition-colors">
                    {content.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <span className="w-5 h-5 text-zinc-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </span>
                  <a href={`tel:${content.phone}`} className="hover:text-zinc-950 transition-colors">
                    {content.phone}
                  </a>
                </div>
              </div>
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
