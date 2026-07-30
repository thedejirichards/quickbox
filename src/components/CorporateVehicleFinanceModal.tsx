import { useEffect, useState } from 'react';
import './BnplModal.css';
import './CorporateVehicleFinanceModal.css';
import type { VendorCar } from './vendorCars';

interface CorporateVehicleFinanceModalProps {
  car: VendorCar;
  onClose: () => void;
  onComplete: (car: VendorCar, quantity: number) => void;
}

type Step = 'selection' | 'quotation-pending' | 'quotation' | 'submitted';

const QUOTATION_DELAY_MS = 1600;

function parsePrice(price: string) {
  return Number(price.replace(/[^\d]/g, '')) || 0;
}

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

export default function CorporateVehicleFinanceModal({ car, onClose, onComplete }: CorporateVehicleFinanceModalProps) {
  const [step, setStep] = useState<Step>('selection');
  const [rfqMode, setRfqMode] = useState<'unit' | 'fleet'>('unit');
  const [quantity, setQuantity] = useState(2);

  useEffect(() => {
    if (step !== 'quotation-pending') return;
    const timer = setTimeout(() => setStep('quotation'), QUOTATION_DELAY_MS);
    return () => clearTimeout(timer);
  }, [step]);

  const unitPrice = parsePrice(car.price);
  const effectiveQuantity = rfqMode === 'fleet' ? quantity : 1;
  const totalPrice = unitPrice * effectiveQuantity;

  const titles: Partial<Record<Step, string>> = {
    quotation: 'Vendor Quotation',
  };

  const backTargets: Partial<Record<Step, Step>> = {
    quotation: 'selection',
  };

  const showChrome = Boolean(titles[step]);

  return (
    <div className="bnpl-overlay" onClick={onClose}>
      <div className={`bnpl-card cvf-card ${step === 'selection' ? 'wide' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="bnpl-brand-row">
          <div className="bnpl-brand">
            <span className="bnpl-brand-mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
                <circle cx="6.5" cy="16.5" r="2.5" />
                <circle cx="16.5" cy="16.5" r="2.5" />
              </svg>
            </span>
            <div>
              <div className="bnpl-brand-name">Autochek</div>
              <div className="bnpl-brand-sub">Powered by QuickBox</div>
            </div>
          </div>
          <button className="bnpl-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {showChrome && (
          <div className="bnpl-title-bar">
            {backTargets[step] && (
              <button className="bnpl-back" onClick={() => setStep(backTargets[step]!)} aria-label="Back">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            <span>{titles[step]}</span>
          </div>
        )}

        <div className="bnpl-body">
          {step === 'selection' && (
            <div className="cvf-selection">
              <div className="cvf-car-summary">
                <img src={car.image} alt={`${car.make} ${car.model}`} />
                <div>
                  <div className="cvf-car-name">{car.make} {car.model} {car.year}</div>
                  <div className="cvf-car-price">{car.price}</div>
                </div>
              </div>

              <div className="cvf-rfq-toggle">
                <button
                  type="button"
                  className={`cvf-rfq-option ${rfqMode === 'unit' ? 'selected' : ''}`}
                  onClick={() => setRfqMode('unit')}
                >
                  Single Vehicle
                </button>
                <button
                  type="button"
                  className={`cvf-rfq-option ${rfqMode === 'fleet' ? 'selected' : ''}`}
                  onClick={() => setRfqMode('fleet')}
                >
                  Fleet RFQ
                </button>
              </div>

              {rfqMode === 'fleet' && (
                <label className="cvf-field">
                  Number of vehicles required
                  <input
                    type="number"
                    min={2}
                    max={50}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(2, Number(e.target.value) || 2))}
                  />
                  <span className="cvf-field-hint">
                    We'll request this vehicle model from the vendor for your fleet. Estimated total: {formatNaira(unitPrice * quantity)}
                  </span>
                </label>
              )}

              <button className="bnpl-primary" onClick={() => setStep('quotation-pending')}>
                {rfqMode === 'fleet' ? 'Submit Fleet RFQ' : 'Request Vehicle Finance'}
              </button>
            </div>
          )}

          {step === 'quotation-pending' && (
            <div className="bnpl-fetching">
              <div className="bnpl-spinner" />
              <h3>Vendor is preparing your quotation</h3>
            </div>
          )}

          {step === 'quotation' && (
            <div className="cvf-quotation">
              <div className="cvf-quotation-row">
                <span>Vehicle</span>
                <strong>{car.make} {car.model} {car.year}</strong>
              </div>
              {rfqMode === 'fleet' && (
                <div className="cvf-quotation-row">
                  <span>Quantity</span>
                  <strong>{quantity} units</strong>
                </div>
              )}
              <div className="cvf-quotation-row">
                <span>{rfqMode === 'fleet' ? 'Unit Price' : 'Price'}</span>
                <strong>{car.price}</strong>
              </div>
              {rfqMode === 'fleet' && (
                <div className="cvf-quotation-row">
                  <span>Total Price</span>
                  <strong>{formatNaira(totalPrice)}</strong>
                </div>
              )}
              <span className="cvf-availability-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Vendor confirmed availability
              </span>
              <button className="bnpl-primary" onClick={() => setStep('submitted')}>Continue</button>
            </div>
          )}

          {step === 'submitted' && (
            <div className="bnpl-success">
              <div className="bnpl-success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3>Request submitted</h3>
              <p>
                Your vehicle finance request for {car.make} {car.model} has been submitted to the vendor. You can track
                the inspection, offer letter and delivery steps from the Pending Request tab on Vehicle Finance.
              </p>
              <button className="bnpl-primary" onClick={() => onComplete(car, effectiveQuantity)}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
