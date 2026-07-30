export interface CustomerRecord {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  gender: string;
}

const defaultRecord: CustomerRecord = {
  firstName: 'Solomon',
  middleName: 'Adewale',
  lastName: 'Johnson',
  phone: '08031234567',
  gender: 'Male',
};

const bvnRecords: Record<string, CustomerRecord> = {
  '12345678901': { firstName: 'Solomon', middleName: 'Adewale', lastName: 'Johnson', phone: '08031234567', gender: 'Male' },
  '22345678901': { firstName: 'Amaka', middleName: 'Ngozi', lastName: 'Chukwu', phone: '08059876543', gender: 'Female' },
};

const accountRecords: Record<string, CustomerRecord> = {
  '1234567890': { firstName: 'James', middleName: 'Chidi', lastName: 'Okafor', phone: '08127654321', gender: 'Male' },
  '2234567890': { firstName: 'Amaka', middleName: 'Ngozi', lastName: 'Chukwu', phone: '08059876543', gender: 'Female' },
};

export function lookupByBvn(bvn: string): CustomerRecord {
  return bvnRecords[bvn] ?? defaultRecord;
}

export function lookupByAccountNumber(accountNumber: string): CustomerRecord {
  return accountRecords[accountNumber] ?? defaultRecord;
}

export function maskPhone(localPhone: string): string {
  const last4 = localPhone.slice(-4);
  return `+234 *** *** ${last4}`;
}
