// src/lib/crm/activityLog.ts
import {sql} from '@vercel/postgres';
import {ensureSchema} from './schema';
import type {ActivityLogEntry} from './types';

type ActivityLogRow = {
  id: number;
  client_id: number;
  note: string;
  created_at: string;
};

function mapRow(row: ActivityLogRow): ActivityLogEntry {
  return {id: row.id, clientId: row.client_id, note: row.note, createdAt: row.created_at};
}

export async function addActivityLogEntry(clientId: number, note: string): Promise<ActivityLogEntry> {
  await ensureSchema();
  const {rows} = await sql<ActivityLogRow>`
    INSERT INTO activity_log (client_id, note) VALUES (${clientId}, ${note}) RETURNING *
  `;
  return mapRow(rows[0]);
}

export async function listActivityLogForClient(clientId: number): Promise<ActivityLogEntry[]> {
  await ensureSchema();
  const {rows} = await sql<ActivityLogRow>`
    SELECT * FROM activity_log WHERE client_id = ${clientId} ORDER BY created_at DESC
  `;
  return rows.map(mapRow);
}
