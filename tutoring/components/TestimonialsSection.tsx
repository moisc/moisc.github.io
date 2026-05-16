import { content } from '@/config/content'

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-6 border-t border-zinc-100">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-4">
          Testimonials
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 mb-12">
          What students say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.testimonials.map((t) => (
            <figure
              key={t.name}
              className="p-6 rounded-xl border border-zinc-200 bg-zinc-50 flex flex-col justify-between gap-6"
            >
              <blockquote>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption>
                <p className="text-sm font-medium text-zinc-950">{t.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{t.context}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="text-xs text-zinc-400 mt-6">
          * Placeholder testimonials — replace with real ones in{' '}
          <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">config/content.ts</code>
        </p>
      </div>
    </section>
  )
}
