import {notFound} from 'next/navigation';
import {getClientById} from '@/lib/crm/clients';
import {listPackagesForClient} from '@/lib/crm/packages';
import {listActivityLogForClient} from '@/lib/crm/activityLog';
import {requireAdminSession} from '@/lib/crm/adminAuth';
import {remainingSessions} from '@/lib/crm/types';
import {
  addActivityLogAction,
  addPackageAction,
  incrementSessionAction,
  setFollowUpAction,
  updateClientDetailsAction,
  updateStatusAction,
} from './actions';

export const dynamic = 'force-dynamic';

type Props = {params: Promise<{id: string}>};

export default async function ClientDetailPage({params}: Props) {
  await requireAdminSession();

  const {id: rawId} = await params;
  // Digits only — rejects "1.0", "1e0", " 1" etc. instead of coercing them.
  if (!/^\d+$/.test(rawId)) notFound();
  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) notFound();

  const client = await getClientById(id);
  if (!client) notFound();

  const [packages, activity] = await Promise.all([listPackagesForClient(id), listActivityLogForClient(id)]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl">{client.name || client.email || `Client #${client.id}`}</h1>
        <p className="mt-1 text-sm text-muted">
          {client.phone || 'no phone'} · {client.email || 'no email'} · {client.visitType} · source:{' '}
          {client.source}
        </p>
      </div>

      <section>
        <h2 className="font-display text-lg">Edit details</h2>
        <form action={updateClientDetailsAction.bind(null, client.id)} className="mt-2 flex flex-wrap gap-2">
          <input
            type="text"
            name="name"
            defaultValue={client.name ?? ''}
            placeholder="Name"
            className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
          />
          <input
            type="tel"
            name="phone"
            defaultValue={client.phone ?? ''}
            placeholder="Phone"
            className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
          />
          <input
            type="email"
            name="email"
            defaultValue={client.email ?? ''}
            placeholder="Email"
            className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
          />
          <select
            name="visitType"
            defaultValue={client.visitType}
            className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
          >
            <option value="studio">Studio</option>
            <option value="home">Home</option>
            <option value="both">Both</option>
            <option value="corporate">Corporate</option>
          </select>
          <button type="submit" className="rounded-full border border-line px-4 py-2 text-sm">
            Save details
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-lg">Status</h2>
        <form action={updateStatusAction.bind(null, client.id)} className="mt-2 flex gap-2">
          <select
            name="status"
            defaultValue={client.status}
            className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
          >
            {(['browsing', 'inquiry', 'booked', 'active', 'lapsed'] as const).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-full border border-line px-4 py-2 text-sm">
            Update
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-lg">Next follow-up</h2>
        <form action={setFollowUpAction.bind(null, client.id)} className="mt-2 flex flex-wrap gap-2">
          <input
            type="date"
            name="date"
            defaultValue={client.nextFollowUpAt ?? ''}
            className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
          />
          <input
            type="text"
            name="note"
            defaultValue={client.nextFollowUpNote ?? ''}
            placeholder="Note"
            className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
          />
          <button type="submit" className="rounded-full border border-line px-4 py-2 text-sm">
            Save (empty date clears it)
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-lg">Packages</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {packages.map((pkg) => (
            <li key={pkg.id} className="rounded-lg border border-line p-3">
              <p className="text-sm font-medium">{pkg.label}</p>
              <p className="text-xs text-muted">
                {remainingSessions(pkg)} of {pkg.totalSessions} left
                {pkg.pricePaid !== null && ` · €${pkg.pricePaid}`}
                {pkg.paymentMethod && ` · ${pkg.paymentMethod}`}
              </p>
              <form action={incrementSessionAction.bind(null, pkg.id, client.id)} className="mt-2">
                <button type="submit" className="rounded-full border border-line px-3 py-1 text-xs">
                  Mark one session used
                </button>
              </form>
            </li>
          ))}
        </ul>

        <form action={addPackageAction.bind(null, client.id)} className="mt-3 flex flex-wrap gap-2">
          <input
            type="text"
            name="label"
            placeholder="Package label"
            required
            className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
          />
          <input
            type="number"
            name="totalSessions"
            placeholder="Total sessions"
            required
            min={1}
            className="w-32 rounded-full border border-line bg-bone px-4 py-2 text-sm"
          />
          <input
            type="number"
            name="pricePaid"
            placeholder="Price (€)"
            step="0.01"
            className="w-28 rounded-full border border-line bg-bone px-4 py-2 text-sm"
          />
          <select
            name="paymentMethod"
            defaultValue=""
            className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
          >
            <option value="">Payment method</option>
            <option value="revolut">Revolut</option>
            <option value="sumup">SumUp</option>
            <option value="payment_link">Payment link</option>
            <option value="other">Other</option>
          </select>
          <button type="submit" className="rounded-full bg-forest px-5 py-2 text-sm text-bone">
            Add package
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-lg">Activity log</h2>
        <form action={addActivityLogAction.bind(null, client.id)} className="mt-2 flex gap-2">
          <input
            type="text"
            name="note"
            placeholder="What happened?"
            required
            className="flex-1 rounded-full border border-line bg-bone px-4 py-2 text-sm"
          />
          <button type="submit" className="rounded-full border border-line px-4 py-2 text-sm">
            Add
          </button>
        </form>
        <ul className="mt-3 flex flex-col gap-2">
          {activity.map((entry) => (
            <li key={entry.id} className="text-sm">
              <span className="text-muted">{new Date(entry.createdAt).toLocaleString('en-GB')}</span> —{' '}
              {entry.note}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
