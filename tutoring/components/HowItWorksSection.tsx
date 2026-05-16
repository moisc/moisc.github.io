import { content } from '@/config/content'

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-6 border-t border-zinc-100">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-4">
          Process
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 mb-12">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.howItWorks.map((item, i) => (
            <div key={item.step} className="relative">
              {/* Connector line */}
              {i < content.howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-5 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-zinc-100" />
              )}
              <div className="flex flex-col gap-4">
                <span className="text-2xl font-semibold text-zinc-200 tracking-tight">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-zinc-950 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
