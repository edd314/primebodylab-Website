import {createHash} from 'crypto';
import {NextResponse} from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

/**
 * Backup record for a /companies request — the visitor's actual request
 * already went out over WhatsApp before this fires, so this route only
 * needs to not lose anything if that WhatsApp message never lands.
 *
 * Status is "transactional", never "subscribed": this is a corporate lead
 * following up on a quote, not someone who opted into marketing email, and
 * this business already treats Acuity/Mailchimp consent carefully — adding
 * leads as subscribed here would be exactly the kind of unconsented
 * marketing enrolment that's been deliberately avoided elsewhere.
 */
export async function POST(request: Request) {
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_SERVER_PREFIX || !audienceId) {
    // No Mailchimp configured — the WhatsApp message is the real request and
    // already went out client-side, so this is not an error worth surfacing.
    return NextResponse.json({ok: true});
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({error: 'Invalid email'}, {status: 422});
  }

  const companyName = typeof body?.companyName === 'string' ? body.companyName.trim() : '';
  const contactName = typeof body?.contactName === 'string' ? body.contactName.trim() : '';
  const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
  const employees = Number(body?.employees) || 0;
  const minutes = Number(body?.minutes) || 0;
  const frequency = typeof body?.frequency === 'string' ? body.frequency : '';
  const commitment = typeof body?.commitment === 'string' ? body.commitment : '';
  const total = Number(body?.total) || 0;
  const perHead = Number(body?.perHead) || 0;

  const subscriberHash = createHash('md5').update(email.toLowerCase()).digest('hex');
  const note = [
    `Firma: ${companyName || '-'}`,
    `Ansprechpartner: ${contactName || '-'}`,
    phone ? `Telefon: ${phone}` : null,
    `Mitarbeitende: ${employees}, Dauer: ${minutes} Min, Rhythmus: ${frequency}, Festlegung: ${commitment}`,
    `Geschätzt: ${total} € pro Team-Tag (${perHead} € pro Person)`,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');

  try {
    await mailchimp.lists.setListMember(audienceId, subscriberHash, {
      email_address: email,
      status_if_new: 'transactional',
      status: 'transactional',
    });
    await mailchimp.lists.updateListMemberTags(audienceId, subscriberHash, {
      tags: [{name: 'corporate-lead', status: 'active'}],
    });
    // @types/mailchimp__mailchimp_marketing doesn't declare this endpoint
    // (its own file says the definitions are incomplete) even though the
    // underlying SDK implements it — cast around the gap rather than hand-
    // rolling the HTTP call.
    await (mailchimp.lists as unknown as {createListMemberNote: (listId: string, hash: string, body: {note: string}) => Promise<unknown>}).createListMemberNote(audienceId, subscriberHash, {note});

    return NextResponse.json({ok: true});
  } catch (error) {
    console.error('Corporate lead logging error', error);
    // Still ok: the visitor's WhatsApp message already carries the full
    // request, so a failed backup record shouldn't surface as an error.
    return NextResponse.json({ok: true});
  }
}
