import { useState } from 'react';
import type { VendorCar } from './vendorCars';
import BnplModal from './BnplModal';
import CorporateVehicleFinanceModal from './CorporateVehicleFinanceModal';

interface VendorCarDetailProps {
  car: VendorCar;
  similarCars: VendorCar[];
  accountType: 'individual' | 'business';
  displayName: string;
  onBackToListing: () => void;
  onSelectCar: (car: VendorCar) => void;
  onBnplComplete: (car: VendorCar) => void;
  onCorporateFinanceComplete: (car: VendorCar, quantity: number) => void;
}

const GALLERY_SLOTS = 5;
const TOTAL_PHOTOS = 20;

function formatMileage(mileage: number) {
  return `${mileage.toLocaleString()} km`;
}

export default function VendorCarDetail({ car, similarCars, accountType, displayName, onBackToListing, onSelectCar, onBnplComplete, onCorporateFinanceComplete }: VendorCarDetailProps) {
  const [activeSlot, setActiveSlot] = useState(0);
  const [showBnpl, setShowBnpl] = useState(false);
  const [showCorporateFinance, setShowCorporateFinance] = useState(false);
  const title = `${car.make} ${car.model} ${car.year}`;

  return (
    <div className="vs-detail">
      <div className="vs-breadcrumb">
        <button onClick={onBackToListing}>All cars</button>
        <span>/</span>
        <span>{car.make}</span>
        <span>/</span>
        <span>{car.make} {car.model}</span>
        <span>/</span>
        <span>{title}</span>
        <span>/</span>
        <span className="vs-breadcrumb-current">{title} {car.color}</span>
      </div>

      <div className="vs-detail-top">
        <div className="vs-gallery">
          <div className="vs-gallery-main">
            <button className="vs-gallery-arrow left" onClick={() => setActiveSlot((s) => (s - 1 + GALLERY_SLOTS) % GALLERY_SLOTS)} aria-label="Previous photo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <img src={car.image} alt={`${title} ${car.color}`} className={activeSlot === GALLERY_SLOTS - 1 ? 'dimmed' : ''} />
            <button className="vs-gallery-arrow right" onClick={() => setActiveSlot((s) => (s + 1) % GALLERY_SLOTS)} aria-label="Next photo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
            <span className="vs-gallery-counter">{activeSlot + 1}/{TOTAL_PHOTOS}</span>
          </div>
          <div className="vs-gallery-thumbs">
            {Array.from({ length: GALLERY_SLOTS }).map((_, i) => (
              <button
                key={i}
                className={`vs-gallery-thumb ${activeSlot === i ? 'active' : ''}`}
                onClick={() => setActiveSlot(i)}
              >
                <img src={car.image} alt="" />
                {i === GALLERY_SLOTS - 1 && (
                  <span className="vs-gallery-more">+{TOTAL_PHOTOS - GALLERY_SLOTS}<br />images</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="vs-detail-info">
          <div className="vs-detail-location">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {car.location}
          </div>
          <h1 className="vs-detail-title">{title}</h1>
          <div className="vs-detail-color">{car.color}</div>
          <div className="vs-detail-price">{car.price}</div>
          <div className="vs-detail-tags">
            <span className="vs-detail-tag">{car.condition}</span>
            <span className="vs-detail-tag">{car.transmission}</span>
            <span className="vs-detail-tag">{formatMileage(car.mileage)}</span>
          </div>

          <button className="vs-detail-whatsapp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#0EA8A0"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1120 12a8 8 0 01-8 8z" /></svg>
            WhatsApp
          </button>
          <button className="vs-detail-contact">Show contact</button>
          {accountType === 'business' ? (
            <button className="vs-detail-bnpl" onClick={() => setShowCorporateFinance(true)}>Initiate Vehicle Finance Request</button>
          ) : (
            <button className="vs-detail-bnpl" onClick={() => setShowBnpl(true)}>Buy Now Pay Later</button>
          )}
        </div>
      </div>

      {showBnpl && (
        <BnplModal
          amount={car.price}
          displayName={displayName}
          onClose={() => setShowBnpl(false)}
          onComplete={() => onBnplComplete(car)}
        />
      )}

      {showCorporateFinance && (
        <CorporateVehicleFinanceModal
          car={car}
          onClose={() => setShowCorporateFinance(false)}
          onComplete={(selectedCar, quantity) => onCorporateFinanceComplete(selectedCar, quantity)}
        />
      )}

      <div className="vs-detail-tab">Details</div>
      <div className="vs-detail-card">
        <h3>Overview</h3>
        <div className="vs-overview-row">
          <div className="vs-overview-item">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.6">
              <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
              <circle cx="6.5" cy="16.5" r="2.5" />
              <circle cx="16.5" cy="16.5" r="2.5" />
            </svg>
            <span>{car.bodyType}</span>
          </div>
          <div className="vs-overview-item">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.6">
              <path d="M5 21V6a2 2 0 012-2h6a2 2 0 012 2v15M5 21h10M5 11h8" />
              <path d="M15 8h1.5a2 2 0 012 2v3.5a1.5 1.5 0 003 0V9a2 2 0 00-.6-1.4L18 5" />
            </svg>
            <span>{car.fuel}</span>
          </div>
          <div className="vs-overview-item">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.6">
              <circle cx="12" cy="12" r="9" />
              <text x="12" y="15.5" textAnchor="middle" fontSize="8" fill="#374151" stroke="none">H</text>
            </svg>
            <span>{car.transmission}</span>
          </div>
        </div>

        <h3>General information</h3>
        <div className="vs-info-grid">
          <div className="vs-info-cell"><div className="vs-info-value">{car.make}</div><div className="vs-info-label">Make</div></div>
          <div className="vs-info-cell"><div className="vs-info-value">{car.model}</div><div className="vs-info-label">Model</div></div>
          <div className="vs-info-cell"><div className="vs-info-value">{car.year}</div><div className="vs-info-label">Year of manufacture</div></div>
          <div className="vs-info-cell"><div className="vs-info-value">{car.color}</div><div className="vs-info-label">Colour</div></div>
          <div className="vs-info-cell"><div className="vs-info-value">{car.condition}</div><div className="vs-info-label">Condition</div></div>
          <div className="vs-info-cell"><div className="vs-info-value">{car.mileage.toLocaleString()}</div><div className="vs-info-label">Mileage</div></div>
          <div className="vs-info-cell"><div className="vs-info-value">{car.engineSize}</div><div className="vs-info-label">Engine size</div></div>
          <div className="vs-info-cell"><div className="vs-info-value">{car.registeredCity}</div><div className="vs-info-label">Registered city</div></div>
          <div className="vs-info-cell"><div className="vs-info-value">{car.sellingCondition}</div><div className="vs-info-label">Selling condition</div></div>
          <div className="vs-info-cell"><div className="vs-info-value">{car.boughtCondition}</div><div className="vs-info-label">Bought condition</div></div>
        </div>
      </div>

      <section className="vs-section">
        <h2 className="vs-section-title">Similar cars</h2>
        <div className="vs-car-grid">
          {similarCars.map((c) => (
            <button key={c.id} className="vs-car-card vs-car-card-link" onClick={() => onSelectCar(c)}>
              <div className="vs-car-thumb">
                <img src={c.image} alt={`${c.make} ${c.model}`} />
              </div>
              <div className="vs-car-body">
                <div className="vs-car-price">{c.price}</div>
                <div className="vs-car-name">{c.make} {c.model} {c.year} {c.color}</div>
                <div className="vs-car-location">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {c.location}
                </div>
                <div className="vs-car-meta">
                  <span>{c.condition}</span>
                  <span>{formatMileage(c.mileage)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
