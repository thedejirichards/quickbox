export interface BankIdRecord {
  idType: string;
  idNumber: string;
}

export interface BankDirectorRecord extends BankIdRecord {
  name: string;
}

export const idTypeLabels: Record<string, { label: string; fieldLabel: string }> = {
  nin: { label: 'National Identity Number (NIN)', fieldLabel: 'NIN' },
  passport: { label: 'International Passport', fieldLabel: 'Passport Number' },
  'drivers-license': { label: "Driver's License", fieldLabel: "Driver's License Number" },
  'voters-card': { label: "Voter's Card", fieldLabel: "Voter's Card Number" },
};

const individualIdRecords: Record<string, BankIdRecord> = {
  Solomon: { idType: 'nin', idNumber: '10293847561' },
};

const businessDirectorRecords: Record<string, BankDirectorRecord[]> = {
  'Acme Ventures Ltd': [
    { name: 'Adaeze Okafor', idType: 'nin', idNumber: '23456789012' },
    { name: 'Chinedu Balogun', idType: 'drivers-license', idNumber: 'FKJ-882-1123' },
  ],
};

export interface BankCustomerProfile {
  fullName: string;
  email: string;
  phone: string;
}

const customerProfiles: Record<string, BankCustomerProfile> = {
  Solomon: { fullName: 'Solomon Adewale Johnson', email: 'solomon@gmail.com', phone: '08031234567' },
  'Acme Ventures Ltd': { fullName: 'Acme Ventures Ltd', email: 'corporate@gmail.com', phone: '08127654321' },
};

export function lookupIndividualIdRecord(displayName: string): BankIdRecord | undefined {
  return individualIdRecords[displayName];
}

export function lookupBusinessDirectorRecords(displayName: string): BankDirectorRecord[] {
  return businessDirectorRecords[displayName] ?? [];
}

export function lookupCustomerProfile(displayName: string): BankCustomerProfile | undefined {
  return customerProfiles[displayName];
}
