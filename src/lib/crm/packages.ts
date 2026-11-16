// src/lib/crm/packages.ts
import {sql} from '@vercel/postgres';
import {ensureSchema} from './schema';
import {toDateOnlyString, todayInGermany} from './dates';
import type {Package, PaymentMethod} from './types';

type PackageRow = {
  id: number;
  client_id: number;
  label: string;
  total_sessions: number;
  used_sessions: number;
  price_paid: string | null;
  payment_method: PaymentMethod | null;
  // DATE arrives as a Date object from the driver at runtime.
  purchased_at: string | Date;
};

function mapRow(row: PackageRow): Package {
  return {
    id: row.id,
    clientId: row.client_id,
    label: row.label,
    totalSessions: row.total_sessions,
    usedSessions: row.used_sessions,
    pricePaid: row.price_paid === null ? null : Number(row.price_paid),
    paymentMethod: row.payment_method,
    purchasedAt: toDateOnlyString(row.purchased_at),
  };
}

export type AddPackageInput = {
  label: string;
  totalSessions: number;
  pricePaid?: number | null;
  paymentMethod?: PaymentMethod | null;
  purchasedAt?: string;
};

export async function addPackage(clientId: number, input: AddPackageInput): Promise<Package> {
  await ensureSchema();
  const {rows} = await sql<PackageRow>`
    INSERT INTO packages (client_id, label, total_sessions, price_paid, payment_method, purchased_at)
    VALUES (
      ${clientId},
      ${input.label},
      ${input.totalSessions},
      ${input.pricePaid ?? null},
      ${input.paymentMethod ?? null},
      ${input.purchasedAt ?? todayInGermany()}
    )
    RETURNING *
  `;
  return mapRow(rows[0]);
}

export async function listPackagesForClient(clientId: number): Promise<Package[]> {
  await ensureSchema();
  const {rows} = await sql<PackageRow>`
    SELECT * FROM packages WHERE client_id = ${clientId} ORDER BY purchased_at DESC
  `;
  return rows.map(mapRow);
}

export async function incrementUsedSessions(packageId: number, by: number = 1): Promise<void> {
  await ensureSchema();
  await sql`UPDATE packages SET used_sessions = used_sessions + ${by} WHERE id = ${packageId}`;
}
