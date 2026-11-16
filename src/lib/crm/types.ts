// src/lib/crm/types.ts
export type VisitType = 'studio' | 'home' | 'both' | 'corporate';
export type ClientStatus = 'browsing' | 'inquiry' | 'booked' | 'active' | 'lapsed';
export type PaymentMethod = 'revolut' | 'sumup' | 'payment_link' | 'other';

export type Client = {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  visitType: VisitType;
  status: ClientStatus;
  source: string;
  nextFollowUpAt: string | null;
  nextFollowUpNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Package = {
  id: number;
  clientId: number;
  label: string;
  totalSessions: number;
  usedSessions: number;
  pricePaid: number | null;
  paymentMethod: PaymentMethod | null;
  purchasedAt: string;
};

export type ActivityLogEntry = {
  id: number;
  clientId: number;
  note: string;
  createdAt: string;
};

export function remainingSessions(pkg: {totalSessions: number; usedSessions: number}): number {
  return pkg.totalSessions - pkg.usedSessions;
}
