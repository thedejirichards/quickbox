import { useEffect, useState } from 'react';
import './BnplModal.css';

interface BnplModalProps {
  amount: string;
  onClose: () => void;
  onComplete: () => void;
}

type Step = 'payment' | 'confirmation' | 'ineligible' | 'form' | 'fetching' | 'eligibility';

const FETCH_DELAY_MS = 1600;

function parseAmount(amount: string) {
  return Number(amount.replace(/[^\d]/g, '')) || 0;
}

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

const QuickBucksBadge = ({ size = 44 }: { size?: number }) => (
  <div className="bnpl-qb-badge" style={{ width: size, height: size }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 36 36" fill="none">
      <path d="M25.5 30.75H10.5C6 30.75 3 28.5 3 23.25V12.75C3 7.5 6 5.25 10.5 5.25H25.5C30 5.25 33 7.5 33 12.75V23.25C33 28.5 30 30.75 25.5 30.75Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 22.5C20.4853 22.5 22.5 20.4853 22.5 18C22.5 15.5147 20.4853 13.5 18 13.5C15.5147 13.5 13.5 15.5147 13.5 18C13.5 20.4853 15.5147 22.5 18 22.5Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.75 9H10.5C8.43 9 6.75 10.68 6.75 12.75V15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23.25 9H25.5C27.57 9 29.25 10.68 29.25 12.75V15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export default function BnplModal({ amount, onClose, onComplete }: BnplModalProps) {
  const [step, setStep] = useState<Step>('payment');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentSelected, setPaymentSelected] = useState(false);
  const [reference] = useState(() => `R${Math.floor(100000000 + Math.random() * 900000000)}`);

  useEffect(() => {
    if (step !== 'fetching') return;
    const timer = setTimeout(() => setStep('eligibility'), FETCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [step]);

  const priceValue = parseAmount(amount);
  const eligibleValue = Math.max(5_000_000, Math.ceil(priceValue / 500_000) * 500_000);

  const titles: Partial<Record<Step, string>> = {
    confirmation: 'Confirmation',
    ineligible: 'Confirmation',
    form: 'QuickBucks by Access',
  };

  const backTargets: Partial<Record<Step, Step>> = {
    confirmation: 'payment',
    ineligible: 'confirmation',
    form: 'confirmation',
  };

  const showChrome = step === 'confirmation' || step === 'ineligible' || step === 'form';

  return (
    <div className="bnpl-overlay" onClick={onClose}>
      <div className={`bnpl-card ${step === 'payment' ? 'wide' : ''}`} onClick={(e) => e.stopPropagation()}>
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
              <div className="bnpl-brand-name">Autocheck</div>
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
          {step === 'payment' && (
            <div className="bnpl-payment">
              <div className="bnpl-payment-head">
                <span className="bnpl-payment-ref">{reference}</span>
                <span className="bnpl-payment-amount">{amount}.00</span>
              </div>
              <div className="bnpl-payment-bar">Select BNPL payment method</div>
              <button
                type="button"
                className={`bnpl-payment-option ${paymentSelected ? 'selected' : ''}`}
                onClick={() => setPaymentSelected(true)}
              >
                <span className="bnpl-radio" />
                <span className="bnpl-payment-option-label">Pay with QuickBucks</span>
                <QuickBucksBadge size={40} />
              </button>
              {paymentSelected && (
                <button className="bnpl-primary bnpl-pay-btn" onClick={() => setStep('confirmation')}>
                  Continue
                </button>
              )}
              <p className="bnpl-disclaimer">This is an encrypted payment, your details are 100% secure and safe</p>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="bnpl-confirmation">
              <QuickBucksBadge size={56} />
              <p className="bnpl-confirmation-text">
                QuickBucks is only available to customers who have their salary accounts domiciled in Access Bank.
              </p>
              <p className="bnpl-confirmation-question">Do you have your salary account domiciled in Access Bank ?</p>
              <div className="bnpl-confirmation-actions">
                <button className="bnpl-secondary" onClick={() => setStep('ineligible')}>No, I don’t</button>
                <button className="bnpl-primary" onClick={() => setStep('form')}>Yes, I do</button>
              </div>
            </div>
          )}

          {step === 'ineligible' && (
            <div className="bnpl-confirmation">
              <QuickBucksBadge size={56} />
              <p className="bnpl-confirmation-text">
                Access QuickBucks is only available to customers with a salary account domiciled in Access Bank, so
                we’re unable to proceed with this request right now.
              </p>
              <button className="bnpl-primary" onClick={onClose}>Explore other payment options</button>
            </div>
          )}

          {step === 'form' && (
            <form
              className="bnpl-form"
              onSubmit={(e) => {
                e.preventDefault();
                setStep('fetching');
              }}
            >
              <label>
                Fullname
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Solomon Adebayo" />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. solomon@gmail.com" />
              </label>
              <label>
                Phone Number (Number attached to your BVN)
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g 08123456789" />
              </label>
              <button type="submit" className="bnpl-primary">Continue</button>
            </form>
          )}

          {step === 'fetching' && (
            <div className="bnpl-fetching">
              <div className="bnpl-spinner" />
              <h3>Fetching eligibility</h3>
            </div>
          )}

          {step === 'eligibility' && (
            <div className="bnpl-eligibility">
              <p>
                Congratulations, You are eligible for <strong>{formatNaira(eligibleValue)}</strong> you can proceed
                with your purchase and pay <strong>{amount}</strong> later.
              </p>
              <button className="bnpl-primary" onClick={onComplete}>Proceed to use Access QuickBucks</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
