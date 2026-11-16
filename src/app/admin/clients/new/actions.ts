// src/app/admin/clients/new/actions.ts
'use server';

import {redirect} from 'next/navigation';
import {createClient} from '@/lib/crm/clients';
import {requireAdminSession} from '@/lib/crm/adminAuth';
import type {VisitType} from '@/lib/crm/types';

const VISIT_TYPES: readonly VisitType[] = ['studio', 'home', 'both', 'corporate'];

function parseVisitType(value: FormDataEntryValue | null): VisitType {
  const raw = String(value ?? '');
  return (VISIT_TYPES as readonly string[]).includes(raw) ? (raw as VisitType) : 'studio';
}

export async function createClientAction(formData: FormData): Promise<void> {
  await requireAdminSession();

  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const visitType = parseVisitType(formData.get('visitType'));
  const source = String(formData.get('source') ?? '').trim() || 'Manual entry';

  const client = await createClient({
    name: name || null,
    phone: phone || null,
    visitType,
    status: 'inquiry',
    source,
  });

  redirect(`/admin/clients/${client.id}`);
}
