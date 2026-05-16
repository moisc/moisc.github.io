import Link from 'next/link'
import { content } from '@/config/content'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 mt-24">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-950">
            {content.name} · STEM Tutoring
          </p>
          <p className="text-sm text-zinc-400 mt-0.5">{content.location}</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <a
            href={`mailto:${content.email}`}
            className="text-sm text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            {content.email}
          </a>
          <span className="hidden sm:inline text-zinc-200">|</span>
          <Link
            href={content.portfolioUrl}
            className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            ← Back to portfolio
          </Link>
        </div>
      </div>
    </footer>
  )
}
