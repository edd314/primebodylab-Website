// src/lib/crm/__tests__/leadMapping.test.ts
import {describe, expect, it} from 'vitest';
import {buildCorporateLeadClientInput, buildWelcomePopupClientInput, formatCorporateLeadNote} from '../leadMapping';

const fields = {
  companyName: 'Acme GmbH',
  contactName: 'Jane Doe',
  email: 'jane@acme.test',
  phone: '0176 1234567',
  employees: 10,
  minutes: 20,
  frequency: 'Monatlich',
  commitment: 'Keine',
  total: 240,
  perHead: 24,
};

describe('buildWelcomePopupClientInput', () => {
  it('maps an email into a browsing lead with no name', () => {
    expect(buildWelcomePopupClientInput('test@example.com')).toEqual({
      name: null,
      email: 'test@example.com',
      phone: null,
      visitType: 'studio',
      status: 'browsing',
      source: 'Welcome popup',
    });
  });
});

describe('buildCorporateLeadClientInput', () => {
  it('maps company fields into an inquiry-stage corporate lead', () => {
    expect(buildCorporateLeadClientInput(fields)).toEqual({
      name: 'Acme GmbH',
      email: 'jane@acme.test',
      phone: '0176 1234567',
      visitType: 'corporate',
      status: 'inquiry',
      source: 'Corporate request',
    });
  });

  it('falls back to the contact name when the company name is blank', () => {
    expect(buildCorporateLeadClientInput({...fields, companyName: ''}).name).toBe('Jane Doe');
  });

  it('falls back to null when both company and contact name are blank', () => {
    expect(buildCorporateLeadClientInput({...fields, companyName: '', contactName: ''}).name).toBeNull();
  });
});

describe('formatCorporateLeadNote', () => {
  it('formats the quote details as a readable note', () => {
    const note = formatCorporateLeadNote(fields);
    expect(note).toContain('Company: Acme GmbH');
    expect(note).toContain('Contact: Jane Doe');
    expect(note).toContain('Employees: 10, Duration: 20 min, Rhythm: Monatlich, Commitment: Keine');
    expect(note).toContain('Estimated: €240 per team day (€24 per person)');
  });

  it('omits the phone line when phone is blank', () => {
    expect(formatCorporateLeadNote({...fields, phone: ''})).not.toContain('Phone:');
  });
});
