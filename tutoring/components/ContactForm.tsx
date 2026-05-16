'use client'

import { useState, FormEvent } from 'react'
import { content } from '@/config/content'

type FormState = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const empty: FormState = { name: '', email: '', phone: '', subject: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(empty)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(`${content.basePath}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setStatus('success')
      setForm(empty)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const inputClass =
    'w-full text-sm text-zinc-950 bg-white border border-zinc-200 rounded-lg px-4 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-400 transition-colors'

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-emerald-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-base font-semibold text-zinc-950 mb-1">Message sent</p>
        <p className="text-sm text-zinc-500">
          I&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-5 text-sm text-zinc-500 hover:text-zinc-950 transition-colors underline underline-offset-2"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-medium text-zinc-500">
            Name <span className="text-zinc-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={set('name')}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium text-zinc-500">
            Email <span className="text-zinc-400">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={set('email')}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      {/* Phone + Subject */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-xs font-medium text-zinc-500">
            Phone <span className="text-zinc-400">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder="(555) 000-0000"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="subject" className="text-xs font-medium text-zinc-500">
            Subject <span className="text-zinc-400">*</span>
          </label>
          <select
            id="subject"
            required
            value={form.subject}
            onChange={set('subject')}
            className={`${inputClass} appearance-none cursor-pointer`}
          >
            <option value="" disabled>
              Select a subject…
            </option>
            {content.contact.subjectOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-medium text-zinc-500">
          Message <span className="text-zinc-400">*</span>
        </label>
        <textarea
          id="message"
          required
          value={form.message}
          onChange={set('message')}
          rows={5}
          placeholder="Tell me what you're working on and where you're getting stuck…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Error */}
      {status === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="self-start text-sm font-medium bg-zinc-950 text-white px-6 py-3.5 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
