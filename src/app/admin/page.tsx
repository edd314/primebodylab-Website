// src/app/admin/page.tsx
import Link from 'next/link';
import {listClients, listFollowUpsDue} from '@/lib/crm/clients';
import {requireAdminSession} from '@/lib/crm/adminAuth';
import {todayInGermany} from '@/lib/crm/dates';
import type {ClientStatus, VisitType} from '@/lib/crm/types';

export const dynamic = 'force-dynamic';

const STATUS_OPTIONS: ClientStatus[] = ['browsing', 'inquiry', 'booked', 'active', 'lapsed'];
const VISIT_TYPE_OPTIONS: VisitType[] = ['studio', 'home', 'both', 'corporate'];

function isClientStatus(value: string | undefined): value is ClientStatus {
  return !!value && (STATUS_OPTIONS as string[]).includes(value);
}

function isVisitType(value: string | undefined): value is VisitType {
  return !!value && (VISIT_TYPE_OPTIONS as string[]).includes(value);
}

type Props = {
  searchParams: Promise<{status?: string; visitType?: string; q?: string}>;
};

export default async function AdminDashboardPage({searchParams}: Props) {
  await requireAdminSession();

  const params = await searchParams;
  const today = todayInGermany();

  const [followUpsDue, clients] = await Promise.all([
    listFollowUpsDue(today),
    listClients({
      status: isClientStatus(params.status) ? params.status : undefined,
      visitType: isVisitType(params.visitType) ? params.visitType : undefined,
      search: params.q || undefined,
    }),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="font-display text-2xl">Follow-ups due</h1>
        {followUpsDue.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Nothing due — you&apos;re caught up.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {followUpsDue.map((client) => (
              <li key={client.id}>
                <Link href={`/admin/clients/${client.id}`} className="text-sm text-sage underline">
                  {client.name || client.email || `Client #${client.id}`}
                </Link>
                {client.nextFollowUpNote && (
                  <span className="ml-2 text-sm text-muted">{client.nextFollowUpNote}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl">Clients</h2>
          <Link href="/admin/clients/new" className="rounded-full bg-forest px-5 py-2 text-sm text-bone">
            + Add client
          </Link>
        </div>

        <form className="mt-4 flex flex-wrap gap-3">
          <input
            type="text"
            name="q"
            defaultValue={params.q ?? ''}
            placeholder="Search name/phone/email"
            className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
          />
          <select
            name="status"
            defaultValue={params.status ?? ''}
            className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            name="visitType"
            defaultValue={params.visitType ?? ''}
            className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
          >
            <option value="">All visit types</option>
            {VISIT_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-full border border-line px-4 py-2 text-sm">
            Filter
          </button>
        </form>

        <ul className="mt-4 flex flex-col gap-2">
          {clients.map((client) => (
            <li key={client.id} className="rounded-lg border border-line p-3">
              <Link href={`/admin/clients/${client.id}`} className="font-medium">
                {client.name || client.email || `Client #${client.id}`}
              </Link>
              <span className="ml-2 text-xs text-muted">
                {client.status} · {client.visitType} · {client.source}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
