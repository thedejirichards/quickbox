export type CorporateFinanceStage =
  | 'inspection-schedule'
  | 'inspection-pending'
  | 'inspection-report'
  | 'inspection-rejected'
  | 'offer-letter'
  | 'pin'
  | 'processing'
  | 'delivery-code'
  | 'completed';

export interface VehicleFinanceRequest {
  id: string;
  vehicle: string;
  image: string;
  price: string;
  dealer: string;
  status: 'pending' | 'approved' | 'declined';
  dateRequested: string;
  make: string;
  model: string;
  year: number;
  color: string;
  location: string;
  mileage: number;
  quantity?: number;
  corporateStage?: CorporateFinanceStage;
  inspectionDate?: string;
  inspectionTime?: string;
  inspectionReviewed?: boolean;
  deliveryCode?: string;
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export const sampleVehicleFinanceRequests: VehicleFinanceRequest[] = [
  {
    id: 'sample-pending-1',
    vehicle: 'Toyota Land Cruiser 2010 Black',
    image: '/vendor-cars/land-cruiser.png',
    price: '₦15,120,000',
    dealer: 'Autochek',
    status: 'pending',
    dateRequested: daysAgo(3),
    make: 'Toyota',
    model: 'Land Cruiser',
    year: 2010,
    color: 'Black',
    location: 'Abuja (FCT), Jabi',
    mileage: 130858,
    corporateStage: 'inspection-schedule',
  },
  {
    id: 'sample-approved-1',
    vehicle: 'Mitsubishi Outlander 2010 Black',
    image: '/vendor-cars/mitsubishi-outlander.jpg',
    price: '₦3,150,000',
    dealer: 'Autochek',
    status: 'approved',
    dateRequested: daysAgo(20),
    make: 'Mitsubishi',
    model: 'Outlander',
    year: 2010,
    color: 'Black',
    location: 'Oyo State, Ibadan',
    mileage: 147766,
    corporateStage: 'completed',
  },
];
