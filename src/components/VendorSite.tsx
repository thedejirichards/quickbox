import { useState } from 'react';
import './VendorSite.css';
import { vendorCars, type VendorCar } from './vendorCars';
import VendorCarDetail from './VendorCarDetail';

interface VendorSiteProps {
  accountType: 'individual' | 'business';
  onBack: () => void;
  onBnplComplete: (car: VendorCar) => void;
  onCorporateFinanceComplete: (car: VendorCar, quantity: number) => void;
}

const whyChooseUs = [
  {
    id: 1,
    title: 'No hidden surprises',
    description: 'We provide you with a detailed inspection report based on 200+ parameters, so you are sure that the car’s condition meets your expectations.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F5B400" strokeWidth="1.8">
        <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0012 3z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: '100% Safe transaction',
    description: 'We check and verify all the documents of the car, so you don’t face any challenges after the purchase.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.8">
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Support at every stage',
    description: 'Our professional Managers will be there for you to answer questions, verify the information and negotiate the price.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.8">
        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        <circle cx="9" cy="7" r="3" />
        <path d="M16 3.2a3 3 0 010 5.6M21 21v-2a3 3 0 00-2-2.8" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Flexible purchase',
    description: 'We offer car loans so that this huge purchase doesn’t stretch you financially.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="1.8">
        <circle cx="12" cy="8" r="5" />
        <path d="M8.5 12.5L6 21l6-3 6 3-2.5-8.5" />
      </svg>
    ),
  },
];

const cities = ['All', 'Lagos', 'Abuja', 'Ikeja', 'Amuwo-Odofin', 'Ibadan', 'Other'];
const priceRanges = ['+2M', '2-3M', '3-4M', '+4M'];
const brands = ['Toyota', 'Lexus', 'Honda', 'Mercedes-Benz', 'Nissan', 'Ford', 'Land Rover', 'Acura'];

const howItWorks = [
  { id: 1, title: 'Browse through thousands of inspected cars', description: 'Find the one that meets your expectations' },
  { id: 2, title: 'Check the inspection report', description: 'It helps you understand the true condition of a car' },
  { id: 3, title: 'Meet with our Manager', description: 'Check the car in real life and make a deal if you’re satisfied' },
];

const stats = [
  { id: 1, value: '26 000+', label: 'cars sold' },
  { id: 2, value: '1 500+', label: 'cars are inspected monthly' },
  { id: 3, value: '70+', label: 'centres pan Nigeria' },
];

const testimonials = [
  { id: 1, name: 'Adedayo Adewuyi', location: 'Lagos', quote: 'Been thinking of buying a car for a while but insufficient funds, I couldn’t. I was online on Instagram and got redirected to the Autochek partner scheme. The team reached out to me and the rest is history.' },
  { id: 2, name: 'Joy Idima', location: 'Abuja', quote: 'Impressed with their process! I recently bought a car through this partner scheme. First of all, the inspection report was comprehensive and the car condition was 100% in line with the report.' },
  { id: 3, name: 'Albert Ogedengbe', location: 'Rivers', quote: 'My experience was good. Initially I was scared but what interested me the most was a detailed inspection report. Their staff were professional and I got the car at a very good price.' },
];

const CarThumbIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.6">
    <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
    <circle cx="6.5" cy="16.5" r="2.5" />
    <circle cx="16.5" cy="16.5" r="2.5" />
  </svg>
);

export default function VendorSite({ accountType, onBack, onBnplComplete, onCorporateFinanceComplete }: VendorSiteProps) {
  const [selectedCar, setSelectedCar] = useState<VendorCar | null>(null);

  return (
    <div className="vs-page">
      <div className="vs-bridge">
        <span>You’ve left QuickBox — you’re now on Autochek, our vehicle finance partner site.</span>
        <button onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to QuickBox
        </button>
      </div>

      <div className="vs-site">
        <header className="vs-header">
          <div className="vs-logo">
            <span className="vs-logo-mark">
              <CarThumbIcon />
            </span>
            <div>
              <div className="vs-logo-text" onClick={() => setSelectedCar(null)}>Autochek</div>
              <div className="vs-logo-sub">Powered by QuickBox</div>
            </div>
          </div>
          <nav className="vs-nav">
            <span className="vs-nav-item active">Buy Car</span>
            <span className="vs-nav-item">Sell Car</span>
          </nav>
        </header>

        {selectedCar ? (
          <VendorCarDetail
            car={selectedCar}
            similarCars={vendorCars.filter((c) => c.id !== selectedCar.id)}
            accountType={accountType}
            onBackToListing={() => setSelectedCar(null)}
            onSelectCar={(car) => setSelectedCar(car)}
            onBnplComplete={onBnplComplete}
            onCorporateFinanceComplete={onCorporateFinanceComplete}
          />
        ) : (
          <>
        <div className="vs-hero">
          <img src="/Dealers-Partners-card-image1.png" alt="Buy your car safely — all cars are verified and inspected by professionals" className="vs-hero-image" />
          <button className="vs-hero-cta">Check available offers</button>
        </div>

        <section className="vs-section">
          <h2 className="vs-section-title">Why choose us?</h2>
          <div className="vs-why-grid">
            {whyChooseUs.map((item) => (
              <div key={item.id} className="vs-why-card">
                <div className="vs-why-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="vs-filters">
          <div className="vs-city-row">
            {cities.map((city) => (
              <span key={city} className={`vs-pill ${city === 'All' ? 'active' : ''}`}>{city}</span>
            ))}
          </div>
          <div className="vs-price-row">
            {priceRanges.map((range) => (
              <span key={range} className="vs-price-pill">{range}</span>
            ))}
          </div>
          <div className="vs-brand-grid">
            {brands.map((brand) => (
              <div key={brand} className="vs-brand">
                <span className="vs-brand-circle">{brand.charAt(0)}</span>
                <span>{brand}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="vs-listings">
          <div className="vs-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input readOnly placeholder="Find car by model, year..." />
          </div>
          <div className="vs-car-grid">
            {vendorCars.map((car) => (
              <button key={car.id} className="vs-car-card vs-car-card-link" onClick={() => setSelectedCar(car)}>
                <div className="vs-car-thumb">
                  <img src={car.image} alt={`${car.make} ${car.model}`} />
                </div>
                <div className="vs-car-body">
                  <div className="vs-car-price">{car.price}</div>
                  <div className="vs-car-name">{car.make} {car.model} {car.year} {car.color}</div>
                  <div className="vs-car-location">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {car.location}
                  </div>
                  <div className="vs-car-meta">
                    <span>{car.condition}</span>
                    <span>{car.mileage.toLocaleString()} km</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button className="vs-browse-more">Browse more cars</button>
        </section>

        <section className="vs-how-section">
          <h2 className="vs-section-title">How it works</h2>
          <div className="vs-how-grid">
            {howItWorks.map((step) => (
              <div key={step.id}>
                <div className="vs-how-bubble">
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
                <div className="vs-how-photo">
                  <CarThumbIcon />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="vs-section">
          <h2 className="vs-section-title">About us in numbers</h2>
          <div className="vs-stats-row">
            {stats.map((stat) => (
              <div key={stat.id}>
                <div className="vs-stat-value">{stat.value}</div>
                <div className="vs-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="vs-section">
          <h2 className="vs-section-title">What our clients say</h2>
          <div className="vs-testimonial-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="vs-testimonial-card">
                <div className="vs-testimonial-head">
                  <div className="vs-testimonial-who">
                    <span className="vs-avatar">{t.name.charAt(0)}</span>
                    <div>
                      <div className="vs-testimonial-name">{t.name}</div>
                      <div className="vs-testimonial-location">{t.location}</div>
                    </div>
                  </div>
                  <div className="vs-testimonial-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24">
                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="vs-testimonial-quote">{t.quote}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="vs-sell-divider">
          <span>👉</span>
          <div>
            <strong>Interested in selling a car instead?</strong>
            <span>Click to learn more about how we can help you</span>
          </div>
        </div>
          </>
        )}

        <footer className="vs-footer">
          <h3 className="vs-footer-title">Need help?</h3>
          <div className="vs-footer-grid">
            <div className="vs-footer-item">
              <div>Text us</div>
              <div>help@autochek.com</div>
            </div>
            <div className="vs-footer-item">
              <div>Call us</div>
              <div>070 80 609 609</div>
            </div>
            <div className="vs-footer-item">
              <div>Business hours</div>
              <div>Mon-Fri 8AM-5PM, Sat 10AM-3PM</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
