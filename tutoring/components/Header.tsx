'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { content } from '@/config/content'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
]

function MenuIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled || menuOpen
          ? 'bg-white/95 backdrop-blur-sm border-b border-zinc-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-zinc-950 tracking-tight hover:opacity-70 transition-opacity"
        >
          {content.name}
          <span className="text-zinc-400 font-normal"> · Tutoring</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                pathname === link.href
                  ? 'text-zinc-950 font-medium'
                  : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-4 bg-zinc-200 mx-2" />
          <Link
            href="/contact"
            className="text-sm font-medium bg-zinc-950 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Book a Session
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-zinc-700 hover:text-zinc-950 transition-colors p-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white px-6 py-5 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2.5 text-sm rounded-md transition-colors ${
                pathname === link.href
                  ? 'text-zinc-950 font-medium bg-zinc-50'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 mt-1 border-t border-zinc-100">
            <Link
              href="/contact"
              className="block text-sm font-medium bg-zinc-950 text-white px-4 py-3 rounded-lg text-center hover:bg-zinc-800 transition-colors"
            >
              Book a Session
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
