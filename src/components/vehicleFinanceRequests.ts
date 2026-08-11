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
  cars?: RequestedCar[];
}

// A single vehicle within a request — a fleet (B2B) request can cover several of
// these, each progressing through inspection/offer/processing independently.
export type RequestedCar = Omit<VehicleFinanceRequest, 'image' | 'quantity' | 'cars'>;

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

// Splits a request into `count` independently-trackable cars, each starting from
// the same vehicle spec/vendor but with its own id and (by default) fresh stage.
export function buildRequestedCars(
  request: Omit<VehicleFinanceRequest, 'cars' | 'image' | 'quantity'>,
  count: number
): RequestedCar[] {
  return Array.from({ length: count }, (_, i) => ({
    ...request,
    id: `${request.id}-car-${i + 1}`,
  }));
}

const pendingRequestBase = {
  id: 'sample-pending-1',
  vehicle: 'Toyota Land Cruiser 2010 Black',
  price: '₦15,120,000',
  dealer: 'Autocheck',
  status: 'pending' as const,
  dateRequested: daysAgo(3),
  make: 'Toyota',
  model: 'Land Cruiser',
  year: 2010,
  color: 'Black',
  location: 'Abuja (FCT), Jabi',
  mileage: 130858,
  corporateStage: 'inspection-schedule' as const,
};

const approvedRequestBase = {
  id: 'sample-approved-1',
  vehicle: 'Mitsubishi Outlander 2010 Black',
  price: '₦3,150,000',
  dealer: 'Autocheck',
  status: 'approved' as const,
  dateRequested: daysAgo(20),
  make: 'Mitsubishi',
  model: 'Outlander',
  year: 2010,
  color: 'Black',
  location: 'Oyo State, Ibadan',
  mileage: 147766,
  corporateStage: 'completed' as const,
};

export const sampleVehicleFinanceRequests: VehicleFinanceRequest[] = [
  {
    ...pendingRequestBase,
    image: '/vendor-cars/land-cruiser.png',
    cars: buildRequestedCars(pendingRequestBase, 1),
  },
  {
    ...approvedRequestBase,
    image: '/vendor-cars/mitsubishi-outlander.jpg',
    cars: buildRequestedCars(approvedRequestBase, 1),
  },
];
