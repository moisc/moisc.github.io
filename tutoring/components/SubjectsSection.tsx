import { content } from '@/config/content'

export default function SubjectsSection() {
  return (
    <section className="py-20 px-6 border-t border-zinc-100">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-4">
          Subjects
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 mb-12">
          Everything STEM, one tutor.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.subjects.map((subject) => (
            <div
              key={subject.name}
              className="group p-6 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all duration-200 bg-white"
            >
              <h3 className="text-base font-semibold text-zinc-950 mb-2">
                {subject.name}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                {subject.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
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
    </section>
  )
}
