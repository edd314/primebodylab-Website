import {NextResponse} from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

/**
 * Adds a welcome-popup signup to the Mailchimp audience with status
 * "pending" — Mailchimp sends its own confirmation email, satisfying the
 * German double opt-in requirement for marketing email. The discount code
 * itself is still shown immediately client-side; only the ongoing email
 * subscription is gated on that confirmation click.
 */
export async function POST(request: Request) {
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_SERVER_PREFIX || !audienceId) {
    return NextResponse.json({error: 'Mailing list is not configured'}, {status: 500});
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim() : '';

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({error: 'Invalid email'}, {status: 422});
  }

  try {
    await mailchimp.lists.addListMember(audienceId, {
      email_address: email,
      status: 'pending',
      tags: ['welcome-15'],
    });
    return NextResponse.json({ok: true});
  } catch (error) {
    // Already on the list — don't error, and don't force their status back
    // to subscribed without a fresh confirmation (they may have unsubscribed
    // deliberately). Treat as a successful, idempotent submission either way.
    const status = (error as {status?: number}).status;
    if (status === 409) {
      return NextResponse.json({ok: true});
    }
    if (status === 400) {
      return NextResponse.json({error: 'Invalid email'}, {status: 422});
    }

    console.error('Mailchimp subscribe error', error);
    return NextResponse.json({error: 'Could not subscribe right now'}, {status: 502});
  }
}
