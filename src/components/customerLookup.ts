export interface CustomerRecord {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  gender: string;
  nin: string;
}

const defaultRecord: CustomerRecord = {
  firstName: 'Solomon',
  middleName: 'Adewale',
  lastName: 'Johnson',
  phone: '08031234567',
  gender: 'Male',
  nin: '10293847561',
};

const bvnRecords: Record<string, CustomerRecord> = {
  '12345678901': { firstName: 'Solomon', middleName: 'Adewale', lastName: 'Johnson', phone: '08031234567', gender: 'Male', nin: '10293847561' },
  '22345678901': { firstName: 'Amaka', middleName: 'Ngozi', lastName: 'Chukwu', phone: '08059876543', gender: 'Female', nin: '29384756102' },
};

const accountRecords: Record<string, CustomerRecord> = {
  '1234567890': { firstName: 'James', middleName: 'Chidi', lastName: 'Okafor', phone: '08127654321', gender: 'Male', nin: '38475610293' },
  '2234567890': { firstName: 'Amaka', middleName: 'Ngozi', lastName: 'Chukwu', phone: '08059876543', gender: 'Female', nin: '29384756102' },
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
