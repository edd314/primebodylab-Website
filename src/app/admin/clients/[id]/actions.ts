'use server';

import {revalidatePath} from 'next/cache';
import {clearFollowUp, setFollowUp, updateClientStatus} from '@/lib/crm/clients';
import {addPackage, incrementUsedSessions} from '@/lib/crm/packages';
import {addActivityLogEntry} from '@/lib/crm/activityLog';
import type {ClientStatus, PaymentMethod} from '@/lib/crm/types';

export async function updateStatusAction(clientId: number, formData: FormData): Promise<void> {
  const status = String(formData.get('status')) as ClientStatus;
  await updateClientStatus(clientId, status);
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function setFollowUpAction(clientId: number, formData: FormData): Promise<void> {
  const date = String(formData.get('date') ?? '');
  const note = String(formData.get('note') ?? '').trim();

  if (!date) {
    await clearFollowUp(clientId);
  } else {
    await setFollowUp(clientId, date, note || null);
  }

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath('/admin');
}

export async function addActivityLogAction(clientId: number, formData: FormData): Promise<void> {
  const note = String(formData.get('note') ?? '').trim();
  if (note) {
    await addActivityLogEntry(clientId, note);
  }
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function addPackageAction(clientId: number, formData: FormData): Promise<void> {
  const label = String(formData.get('label') ?? '').trim();
  const totalSessions = Number(formData.get('totalSessions'));
  const pricePaidRaw = formData.get('pricePaid');
  const pricePaid = pricePaidRaw ? Number(pricePaidRaw) : null;
  const paymentMethodRaw = String(formData.get('paymentMethod') ?? '');
  const paymentMethod = (paymentMethodRaw || null) as PaymentMethod | null;

  if (label && Number.isFinite(totalSessions) && totalSessions > 0) {
    await addPackage(clientId, {label, totalSessions, pricePaid, paymentMethod});
  }

  revalidatePath(`/admin/clients/${clientId}`);
}

export async function incrementSessionAction(packageId: number, clientId: number): Promise<void> {
  await incrementUsedSessions(packageId, 1);
  revalidatePath(`/admin/clients/${clientId}`);
}
