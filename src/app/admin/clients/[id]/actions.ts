'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {clearFollowUp, deleteClient, setFollowUp, updateClientDetails, updateClientStatus} from '@/lib/crm/clients';
import {addPackage, incrementUsedSessions} from '@/lib/crm/packages';
import {addActivityLogEntry} from '@/lib/crm/activityLog';
import {requireAdminSession} from '@/lib/crm/adminAuth';
import type {ClientStatus, PaymentMethod, VisitType} from '@/lib/crm/types';

const CLIENT_STATUSES: readonly ClientStatus[] = ['browsing', 'inquiry', 'booked', 'active', 'lapsed'];
const VISIT_TYPES: readonly VisitType[] = ['studio', 'home', 'both', 'corporate'];
const PAYMENT_METHODS: readonly PaymentMethod[] = ['revolut', 'sumup', 'payment_link', 'other'];

function pick<T extends string>(allowed: readonly T[], value: FormDataEntryValue | null): T | null {
  const raw = String(value ?? '');
  return (allowed as readonly string[]).includes(raw) ? (raw as T) : null;
}

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? '').trim();
  return text || null;
}

export async function updateStatusAction(clientId: number, formData: FormData): Promise<void> {
  await requireAdminSession();
  const status = pick(CLIENT_STATUSES, formData.get('status'));
  if (status) {
    await updateClientStatus(clientId, status);
  }
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath('/admin');
}

export async function updateClientDetailsAction(clientId: number, formData: FormData): Promise<void> {
  await requireAdminSession();
  const visitType = pick(VISIT_TYPES, formData.get('visitType'));
  if (visitType) {
    await updateClientDetails(clientId, {
      name: optionalText(formData.get('name')),
      phone: optionalText(formData.get('phone')),
      email: optionalText(formData.get('email')),
      visitType,
    });
  }
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath('/admin');
}

export async function setFollowUpAction(clientId: number, formData: FormData): Promise<void> {
  await requireAdminSession();
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
  await requireAdminSession();
  const note = String(formData.get('note') ?? '').trim();
  if (note) {
    await addActivityLogEntry(clientId, note);
  }
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function addPackageAction(clientId: number, formData: FormData): Promise<void> {
  await requireAdminSession();
  const label = String(formData.get('label') ?? '').trim();
  const totalSessions = Number(formData.get('totalSessions'));
  const pricePaidRaw = formData.get('pricePaid');
  const pricePaid = pricePaidRaw ? Number(pricePaidRaw) : null;
  const paymentMethod = pick(PAYMENT_METHODS, formData.get('paymentMethod'));

  if (label && Number.isFinite(totalSessions) && totalSessions > 0) {
    await addPackage(clientId, {label, totalSessions, pricePaid, paymentMethod});
  }

  revalidatePath(`/admin/clients/${clientId}`);
}

export async function incrementSessionAction(packageId: number, clientId: number): Promise<void> {
  await requireAdminSession();
  await incrementUsedSessions(packageId, 1);
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function deleteClientAction(clientId: number): Promise<void> {
  await requireAdminSession();
  await deleteClient(clientId);
  revalidatePath('/admin');
  redirect('/admin');
}
