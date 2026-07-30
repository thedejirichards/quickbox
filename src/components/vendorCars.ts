export interface VendorCar {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  price: string;
  location: string;
  condition: string;
  mileage: number;
  bodyType: string;
  fuel: string;
  transmission: string;
  engineSize: string;
  registeredCity: string;
  sellingCondition: string;
  boughtCondition: string;
  image: string;
}

export const vendorCars: VendorCar[] = [
  { id: 1, make: 'Toyota', model: 'Land Cruiser', year: 2010, color: 'Black', price: '₦15,120,000', location: 'Abuja (FCT), Jabi', condition: 'Nigerian Used', mileage: 130858, bodyType: 'SUV', fuel: 'Petrol', transmission: 'Automatic', engineSize: '4700', registeredCity: 'Abuja', sellingCondition: 'Registered', boughtCondition: 'Imported', image: '/vendor-cars/land-cruiser.png' },
  { id: 2, make: 'Ford', model: 'Explorer', year: 2019, color: 'White', price: '₦26,250,000', location: 'Lagos State, Ikeja', condition: 'Foreign Used', mileage: 4115, bodyType: 'SUV', fuel: 'Petrol', transmission: 'Automatic', engineSize: '2300', registeredCity: 'Lagos', sellingCondition: 'Registered', boughtCondition: 'Imported', image: '/vendor-cars/ford-explorer.jpg' },
  { id: 3, make: 'Toyota', model: 'Venza', year: 2013, color: 'Black', price: '₦11,025,000', location: 'Lagos State, Ikeja', condition: 'Nigerian Used', mileage: 162714, bodyType: 'SUV', fuel: 'Petrol', transmission: 'Automatic', engineSize: '2700', registeredCity: 'Lagos', sellingCondition: 'Registered', boughtCondition: 'Imported', image: '/vendor-cars/toyota-venza.jpg' },
  { id: 4, make: 'Toyota', model: 'Highlander', year: 2014, color: 'Blue', price: '₦11,025,000', location: 'Abuja (FCT), Gwarimpa', condition: 'Nigerian Used', mileage: 106581, bodyType: 'SUV', fuel: 'Petrol', transmission: 'Automatic', engineSize: '3500', registeredCity: 'Abuja', sellingCondition: 'Registered', boughtCondition: 'Imported', image: '/vendor-cars/toyota-highlander.jpg' },
  { id: 5, make: 'Genesis', model: 'G80', year: 2018, color: 'Blue', price: '₦27,300,000', location: 'Abuja (FCT), Garki 2', condition: 'Foreign Used', mileage: 64866, bodyType: 'Sedan', fuel: 'Petrol', transmission: 'Automatic', engineSize: '3800', registeredCity: 'Abuja', sellingCondition: 'Registered', boughtCondition: 'Imported', image: '/vendor-cars/genesis-g80.jpg' },
  { id: 6, make: 'Lincoln', model: 'Navigator', year: 2005, color: 'White', price: '₦3,255,000', location: 'Lagos State, Lekki', condition: 'Nigerian Used', mileage: 121222, bodyType: 'SUV', fuel: 'Petrol', transmission: 'Automatic', engineSize: '5400', registeredCity: 'Lagos', sellingCondition: 'Registered', boughtCondition: 'Imported', image: '/vendor-cars/lincoln-navigator.jpg' },
  { id: 7, make: 'Mercedes-Benz', model: 'GL-Class GL 450', year: 2007, color: 'Black', price: '₦4,239,375', location: 'Anambra State, Onitsha', condition: 'Nigerian Used', mileage: 280610, bodyType: 'SUV', fuel: 'Petrol', transmission: 'Automatic', engineSize: '4700', registeredCity: 'Anambra', sellingCondition: 'Registered', boughtCondition: 'Imported', image: '/vendor-cars/mercedes-gl.jpg' },
  { id: 8, make: 'Mitsubishi', model: 'Outlander', year: 2010, color: 'Black', price: '₦3,150,000', location: 'Oyo State, Ibadan', condition: 'Nigerian Used', mileage: 147766, bodyType: 'SUV', fuel: 'Petrol', transmission: 'Automatic', engineSize: '2400', registeredCity: 'Oyo', sellingCondition: 'Registered', boughtCondition: 'Imported', image: '/vendor-cars/mitsubishi-outlander.jpg' },
  { id: 9, make: 'Acura', model: 'MDX', year: 2008, color: 'Silver', price: '₦2,572,500', location: 'Oyo State, Ibadan', condition: 'Nigerian Used', mileage: 429742, bodyType: 'SUV', fuel: 'Petrol', transmission: 'Automatic', engineSize: '3700', registeredCity: 'Oyo', sellingCondition: 'Registered', boughtCondition: 'Imported', image: '/vendor-cars/acura-mdx.jpg' },
  { id: 10, make: 'Ford', model: 'Edge', year: 2011, color: 'Burgandy', price: '₦4,042,500', location: 'Abuja (FCT), Jabi', condition: 'Nigerian Used', mileage: 234862, bodyType: 'SUV', fuel: 'Petrol', transmission: 'Automatic', engineSize: '3500', registeredCity: 'Imo', sellingCondition: 'Registered', boughtCondition: 'Imported', image: '/vendor-cars/ford-edge.jpg' },
];
