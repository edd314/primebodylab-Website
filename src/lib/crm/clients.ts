// src/lib/crm/clients.ts
import {sql} from '@vercel/postgres';
import {ensureSchema} from './schema';
import {toDateOnlyString, toIsoTimestampString} from './dates';
import type {CreateClientInput} from './leadMapping';
import type {Client, ClientStatus, VisitType} from './types';

export type {CreateClientInput};

type ClientRow = {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  visit_type: VisitType;
  status: ClientStatus;
  source: string;
  // DATE / TIMESTAMPTZ arrive as Date objects from the driver at runtime.
  next_follow_up_at: string | Date | null;
  next_follow_up_note: string | null;
  created_at: string | Date;
  updated_at: string | Date;
};

function mapRow(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    visitType: row.visit_type,
    status: row.status,
    source: row.source,
    nextFollowUpAt: toDateOnlyString(row.next_follow_up_at),
    nextFollowUpNote: row.next_follow_up_note,
    createdAt: toIsoTimestampString(row.created_at),
    updatedAt: toIsoTimestampString(row.updated_at),
  };
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  await ensureSchema();
  const {rows} = await sql<ClientRow>`
    INSERT INTO clients (name, phone, email, visit_type, status, source)
    VALUES (
      ${input.name},
      ${input.phone ?? null},
      ${input.email ?? null},
      ${input.visitType},
      ${input.status},
      ${input.source}
    )
    RETURNING *
  `;
  return mapRow(rows[0]);
}

export async function getClientById(id: number): Promise<Client | null> {
  await ensureSchema();
  const {rows} = await sql<ClientRow>`SELECT * FROM clients WHERE id = ${id}`;
  return rows[0] ? mapRow(rows[0]) : null;
}

export type ListClientsFilters = {
  status?: ClientStatus;
  visitType?: VisitType;
  search?: string;
};

export async function listClients(filters: ListClientsFilters = {}): Promise<Client[]> {
  await ensureSchema();
  const status = filters.status ?? null;
  const visitType = filters.visitType ?? null;
  const search = filters.search ? `%${filters.search}%` : null;

  const {rows} = await sql<ClientRow>`
    SELECT * FROM clients
    WHERE (${status}::text IS NULL OR status = ${status})
      AND (${visitType}::text IS NULL OR visit_type = ${visitType})
      AND (${search}::text IS NULL OR name ILIKE ${search} OR phone ILIKE ${search} OR email ILIKE ${search})
    ORDER BY created_at DESC
  `;
  return rows.map(mapRow);
}

export async function listFollowUpsDue(today: string): Promise<Client[]> {
  await ensureSchema();
  const {rows} = await sql<ClientRow>`
    SELECT * FROM clients
    WHERE next_follow_up_at IS NOT NULL AND next_follow_up_at <= ${today}
    ORDER BY next_follow_up_at ASC
  `;
  return rows.map(mapRow);
}

export async function updateClientStatus(id: number, status: ClientStatus): Promise<void> {
  await ensureSchema();
  await sql`UPDATE clients SET status = ${status}, updated_at = now() WHERE id = ${id}`;
}

export type UpdateClientDetailsInput = {
  name: string | null;
  phone: string | null;
  email: string | null;
  visitType: VisitType;
};

export async function updateClientDetails(id: number, input: UpdateClientDetailsInput): Promise<void> {
  await ensureSchema();
  await sql`
    UPDATE clients
    SET name = ${input.name}, phone = ${input.phone}, email = ${input.email},
        visit_type = ${input.visitType}, updated_at = now()
    WHERE id = ${id}
  `;
}

export async function setFollowUp(id: number, date: string, note: string | null): Promise<void> {
  await ensureSchema();
  await sql`
    UPDATE clients
    SET next_follow_up_at = ${date}, next_follow_up_note = ${note}, updated_at = now()
    WHERE id = ${id}
  `;
}

export async function clearFollowUp(id: number): Promise<void> {
  await ensureSchema();
  await sql`
    UPDATE clients
    SET next_follow_up_at = NULL, next_follow_up_note = NULL, updated_at = now()
    WHERE id = ${id}
  `;
}
