import { useRef, useState } from 'react';
import CorpProgressBar from './CorpProgressBar';

interface PinCreationProps {
  totalSteps: number;
  currentStep: number;
  onBack: () => void;
  onSignIn: () => void;
  onSubmit: () => void;
}

function WarningIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

const PIN_LENGTH = 4;
const emptyPin = () => Array(PIN_LENGTH).fill('');

export default function PinCreation({ totalSteps, currentStep, onBack, onSignIn, onSubmit }: PinCreationProps) {
  const [pin, setPin] = useState<string[]>(emptyPin());
  const [confirmPin, setConfirmPin] = useState<string[]>(emptyPin());
  const [mismatch, setMismatch] = useState(false);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);

  const pinComplete = pin.every((digit) => digit !== '');
  const confirmComplete = confirmPin.every((digit) => digit !== '');

  const handleDigitChange = (
    values: string[],
    setValues: (v: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    index: number,
    value: string
  ) => {
    if (!/^\d*$/.test(value)) return;
    setMismatch(false);
    const next = [...values];
    next[index] = value.slice(-1);
    setValues(next);
    if (value && index < PIN_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (
    values: string[],
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    index: number,
    e: React.KeyboardEvent
  ) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.join('') !== confirmPin.join('')) {
      setMismatch(true);
      return;
    }
    onSubmit();
  };

  return (
    <div className="bvn-page">
      <div className="bvn-content">
        <CorpProgressBar totalSteps={totalSteps} currentStep={currentStep} />

        <div className="bvn-header">
          <h1>PIN Creation</h1>
          <p>Create a 4-digit PIN for authorising your transaction each time you make a loan request or make a transaction</p>
        </div>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="form-group">
            <label htmlFor="pin-0">PIN</label>
            <div className="otp-input-group">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={index === 0 ? 'pin-0' : undefined}
                  ref={(el) => { pinRefs.current[index] = el; }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(pin, setPin, pinRefs, index, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(pin, pinRefs, index, e)}
                  className="otp-input"
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-pin-0">Retype PIN</label>
            <div className="otp-input-group">
              {confirmPin.map((digit, index) => (
                <input
                  key={index}
                  id={index === 0 ? 'confirm-pin-0' : undefined}
                  ref={(el) => { confirmRefs.current[index] = el; }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(confirmPin, setConfirmPin, confirmRefs, index, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(confirmPin, confirmRefs, index, e)}
                  className={`otp-input ${mismatch ? 'otp-input-error' : ''}`}
                />
              ))}
            </div>
            {mismatch && (
              <p className="corp-field-hint corp-field-hint-error">
                <WarningIcon />
                PINs do not match
              </p>
            )}
          </div>

          <div className="otp-actions">
            <button type="button" className="back-button" onClick={onBack}>
              PREVIOUS
            </button>
            <button type="submit" className="continue-button" disabled={!pinComplete || !confirmComplete}>
              SUBMIT
            </button>
          </div>
        </form>

        <p className="corp-footer-link">
          Already a user? <a href="#" onClick={(e) => { e.preventDefault(); onSignIn(); }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}
