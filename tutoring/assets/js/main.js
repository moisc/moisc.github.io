/* ── Sticky header ──────────────────────────────────────────────────────── */
const header = document.getElementById('header');
function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 8);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* ── Mobile nav ─────────────────────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

/* ── Contact form (Formspree AJAX) ──────────────────────────────────────── */
const form       = document.getElementById('contact-form');
const success    = document.getElementById('form-success');
const errorBox   = document.getElementById('form-error');
const submitBtn  = document.getElementById('submit-btn');
const againBtn   = document.getElementById('form-again');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (success)  success.classList.remove('show');
    if (errorBox) errorBox.classList.remove('show');
    if (submitBtn) { submitBtn.textContent = 'Sending…'; submitBtn.disabled = true; }

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('https://formspree.io/f/mqaargaq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: `Tutoring inquiry — ${data.subject || 'General'}` }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submission failed.');

      form.style.display = 'none';
      if (success) success.classList.add('show');
    } catch (err) {
      if (errorBox) {
        errorBox.textContent = err.message || 'Something went wrong. Please try again.';
        errorBox.classList.add('show');
      }
      if (submitBtn) { submitBtn.textContent = 'Send message'; submitBtn.disabled = false; }
    }
  });
}

if (againBtn) {
  againBtn.addEventListener('click', () => {
    if (success) success.classList.remove('show');
    if (form)    { form.style.display = ''; form.reset(); }
  });
}
