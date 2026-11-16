// src/lib/crm/schema.ts
import {sql} from '@vercel/postgres';

let schemaReady: Promise<void> | null = null;

/**
 * Memoized per server instance — CREATE TABLE IF NOT EXISTS is safe to call
 * repeatedly, but there's no reason to round-trip to Postgres on every CRM
 * call when a cold start only needs to do this once.
 */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = runMigrations();
  }
  return schemaReady;
}

async function runMigrations(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      name TEXT,
      phone TEXT,
      email TEXT,
      visit_type TEXT NOT NULL CHECK (visit_type IN ('studio', 'home', 'both', 'corporate')),
      status TEXT NOT NULL CHECK (status IN ('browsing', 'inquiry', 'booked', 'active', 'lapsed')),
      source TEXT NOT NULL,
      next_follow_up_at DATE,
      next_follow_up_note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS packages (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      total_sessions INTEGER NOT NULL,
      used_sessions INTEGER NOT NULL DEFAULT 0,
      price_paid NUMERIC(10, 2),
      payment_method TEXT CHECK (payment_method IN ('revolut', 'sumup', 'payment_link', 'other')),
      purchased_at DATE NOT NULL DEFAULT CURRENT_DATE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS activity_log (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      note TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}
