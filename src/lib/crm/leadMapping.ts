// src/lib/crm/leadMapping.ts
import type {VisitType, ClientStatus} from './types';

export type CreateClientInput = {
  name: string | null;
  phone?: string | null;
  email?: string | null;
  visitType: VisitType;
  status: ClientStatus;
  source: string;
};

export function buildWelcomePopupClientInput(email: string): CreateClientInput {
  return {
    name: null,
    email,
    phone: null,
    visitType: 'studio',
    status: 'browsing',
    source: 'Welcome popup',
  };
}

export type CorporateLeadFields = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  employees: number;
  minutes: number;
  frequency: string;
  commitment: string;
  total: number;
  perHead: number;
};

export function buildCorporateLeadClientInput(fields: CorporateLeadFields): CreateClientInput {
  return {
    name: fields.companyName || fields.contactName || null,
    email: fields.email,
    phone: fields.phone || null,
    visitType: 'corporate',
    status: 'inquiry',
    source: 'Corporate request',
  };
}

export function formatCorporateLeadNote(fields: CorporateLeadFields): string {
  return [
    `Company: ${fields.companyName || '-'}`,
    `Contact: ${fields.contactName || '-'}`,
    `Email: ${fields.email}`,
    fields.phone ? `Phone: ${fields.phone}` : null,
    `Employees: ${fields.employees}, Duration: ${fields.minutes} min, Rhythm: ${fields.frequency}, Commitment: ${fields.commitment}`,
    `Estimated: €${fields.total} per team day (€${fields.perHead} per person)`,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
}
