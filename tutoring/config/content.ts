// ─── EDIT THIS FILE TO UPDATE ALL SITE CONTENT ───────────────────────────────
// Every piece of copy, pricing, and contact info lives here.
// Nothing is hardcoded into the JSX.

export const content = {
  // ── Site-wide ──────────────────────────────────────────────────────────────
  name: 'Mois Cohen',
  siteTitle: 'Mois Cohen · STEM Tutoring',
  email: 'mois.cohen787@gmail.com',
  phone: '(858) 668-9347',
  location: 'San Diego, CA',
  portfolioUrl: 'https://moiscohen.com',

  // The base path must match next.config.ts — used for the API fetch call
  basePath: '/tutoring',

  // ── Hero ───────────────────────────────────────────────────────────────────
  hero: {
    badge: 'Available for new students · San Diego & Zoom',
    headline: 'STEM Tutoring\nThat Actually Clicks.',
    subheadline:
      'One-on-one sessions in Math, Physics, Chemistry, Biology, and Computer Science — at your door or on Zoom, tailored to how you actually learn.',
    ctaPrimary: 'Book a Session',
    ctaSecondary: 'See pricing',
  },

  // ── About ──────────────────────────────────────────────────────────────────
  about: {
    photoAlt: 'Mois Cohen',
    headline: 'An engineer who teaches the way he wished he was taught.',
    bio: [
      "I'm a mechanical engineer — Cal Poly SLO class of 2025, currently working at Innoflight on satellite systems. I started tutoring in college, mostly helping other engineering students through their hardest courses, and kept going because I'm genuinely good at it.",
      "My approach is direct. If something isn't clicking, we rebuild it from the ground up until it does. I don't recite textbook definitions — I explain concepts the way an engineer actually thinks about them, with real intuition behind the math.",
      'I do evening house calls around San Diego and Zoom sessions for anyone, anywhere. First call is always free.',
    ],
    credentials: [
      { label: 'Degree', value: 'B.S. Mechanical Engineering, Cal Poly SLO' },
      { label: 'Certification', value: 'Engineer in Training (EIT) — NCEES' },
      { label: 'Currently', value: 'Mechanical Engineer I at Innoflight (Aerospace)' },
      { label: 'Location', value: 'San Diego, CA · Available on Zoom' },
    ],
  },

  // ── Subjects ───────────────────────────────────────────────────────────────
  subjects: [
    {
      name: 'Mathematics',
      description:
        'Algebra through Calculus III, Linear Algebra, and Differential Equations. Applied math with real engineering intuition behind every concept.',
      levels: ['High School', 'AP Calc', 'Undergraduate'],
    },
    {
      name: 'Physics',
      description:
        'Classical mechanics, thermodynamics, electromagnetism, and optics — the full engineering physics stack, taught with purpose.',
      levels: ['AP Physics', 'Undergraduate'],
    },
    {
      name: 'Chemistry',
      description:
        'General chemistry, stoichiometry, thermochemistry, and AP exam prep. Conceptual first, then the problem-solving.',
      levels: ['High School', 'AP Chem', 'Gen Chem I/II'],
    },
    {
      name: 'Biology',
      description:
        'Cell biology, genetics, and AP Biology prep. Clear conceptual frameworks so the details actually stick.',
      levels: ['High School', 'AP Biology'],
    },
    {
      name: 'Computer Science',
      description:
        'Python, data structures, algorithms, and getting comfortable with code from scratch. Practical and project-oriented.',
      levels: ['Beginner', 'Intermediate'],
    },
  ],

  // ── How It Works ───────────────────────────────────────────────────────────
  howItWorks: [
    {
      step: '01',
      title: 'Free intro call',
      description:
        "Fifteen minutes on the phone. Tell me what's not clicking — I'll tell you exactly how I can help.",
    },
    {
      step: '02',
      title: 'Pick your format',
      description:
        'In-person at your home (San Diego evenings) or Zoom from anywhere. You choose what works.',
    },
    {
      step: '03',
      title: 'Start learning',
      description:
        'Sessions are one-on-one, at your pace. Real explanations, not just worked examples — until it actually makes sense.',
    },
  ],

  // ── Services & Pricing ─────────────────────────────────────────────────────
  // Update `rate` to change pricing — it's pulled from here everywhere
  services: [
    {
      name: 'In-Person',
      subtitle: 'House Call',
      description: 'I come to you. Available evenings throughout the San Diego area.',
      rate: 80,
      unit: 'hr',
      features: [
        'I come to your home',
        'Evening availability',
        'San Diego & surrounding areas',
        'Whiteboard / notebook sessions',
        'Flexible scheduling',
      ],
      highlight: false,
    },
    {
      name: 'Online',
      subtitle: 'Zoom Session',
      description: 'Full sessions via Zoom. Works from anywhere, any time zone.',
      rate: 65,
      unit: 'hr',
      features: [
        'Zoom with screen sharing',
        'Shared digital whiteboard',
        'Session notes after each call',
        'Flexible scheduling',
        'Any time zone',
      ],
      highlight: true,
    },
  ],

  // ── Testimonials ───────────────────────────────────────────────────────────
  // Replace with real testimonials — these are placeholders
  testimonials: [
    {
      quote:
        'Mois has a way of making hard concepts feel obvious in hindsight. My calc grade went from a C to an A in one semester.',
      name: 'Alex R.',
      context: 'Calculus II · SDSU',
    },
    {
      quote:
        "I needed someone who understood physics from an engineering angle, not just the textbook. Mois was exactly that.",
      name: 'Jordan M.',
      context: 'Physics I · UC San Diego',
    },
    {
      quote:
        "My son went from dreading chemistry to actually enjoying it. I couldn't believe the turnaround.",
      name: 'Sarah T.',
      context: 'Parent · AP Chemistry',
    },
  ],

  // ── Contact ────────────────────────────────────────────────────────────────
  contact: {
    headline: 'Ready to get started?',
    subheadline:
      "Fill out the form and I'll get back to you within 24 hours to schedule a free intro call.",
    subjectOptions: [
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Computer Science',
      'Not sure yet',
    ],
  },
}
