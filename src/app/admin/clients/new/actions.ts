// src/app/admin/clients/new/actions.ts
'use server';

import {redirect} from 'next/navigation';
import {createClient} from '@/lib/crm/clients';
import type {VisitType} from '@/lib/crm/types';

export async function createClientAction(formData: FormData): Promise<void> {
  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const visitType = String(formData.get('visitType') ?? 'studio') as VisitType;
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
