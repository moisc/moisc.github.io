import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const body = await req.json().catch(() => null)

  if (!body) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, email, phone, subject, message } = body as Record<string, string>

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const recipient = process.env.RECIPIENT_EMAIL
  if (!recipient) {
    console.error('RECIPIENT_EMAIL is not set')
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 })
  }

  try {
    await resend.emails.send({
      // Use your verified Resend sending domain in production.
      // For testing, "onboarding@resend.dev" only delivers to the account's verified email.
      from: 'Tutoring Inquiry <onboarding@resend.dev>',
      to: recipient,
      replyTo: email,
      subject: `New tutoring inquiry — ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; color: #18181b;">
          <h2 style="font-size: 18px; margin-bottom: 24px; font-weight: 600;">New tutoring inquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #71717a; font-size: 13px; width: 100px; vertical-align: top;">Name</td>
              <td style="padding: 8px 0; font-size: 14px;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717a; font-size: 13px; vertical-align: top;">Email</td>
              <td style="padding: 8px 0; font-size: 14px;">${escapeHtml(email)}</td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; color: #71717a; font-size: 13px; vertical-align: top;">Phone</td>
              <td style="padding: 8px 0; font-size: 14px;">${escapeHtml(phone)}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 8px 0; color: #71717a; font-size: 13px; vertical-align: top;">Subject</td>
              <td style="padding: 8px 0; font-size: 14px;">${escapeHtml(subject)}</td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f4f4f5; border-radius: 8px;">
            <p style="font-size: 13px; color: #71717a; margin: 0 0 8px;">Message</p>
            <p style="font-size: 14px; margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json(
      { error: 'Failed to send message. Please try emailing directly.' },
      { status: 500 }
    )
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
