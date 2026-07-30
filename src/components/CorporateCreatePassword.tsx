import { useState } from 'react';
import CorpProgressBar from './CorpProgressBar';

interface CorporateCreatePasswordProps {
  onBack: () => void;
  onSignIn: () => void;
  onNext: () => void;
}

function RequirementIcon({ met }: { met: boolean }) {
  return met ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const passwordRequirements = [
  { label: 'Must be at least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Must contain at least one uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Must have at least one special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  { label: 'Must contain at least one number', test: (p: string) => /\d/.test(p) },
  { label: 'Must contain at least one lowercase letter', test: (p: string) => /[a-z]/.test(p) },
];

export default function CorporateCreatePassword({ onBack, onSignIn, onNext }: CorporateCreatePasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordRequirements.every((req) => req.test(password))) {
      setError('Password does not meet all requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    onNext();
  };

  return (
    <div className="bvn-page">
      <div className="bvn-content">
        <CorpProgressBar totalSteps={5} currentStep={4} />

        <div className="bvn-header">
          <h1>Create password</h1>
          <p>Create a strong password for logging into QuickBucks</p>
        </div>

        <form onSubmit={handleSubmit} className="bvn-form">
          <div className="doc-field-group">
            <label className="doc-field-label" htmlFor="corp-password">
              Password <span className="doc-required">*</span>
            </label>
            <div className="password-wrapper">
              <input
                id="corp-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
            <ul className="corp-password-requirements">
              {passwordRequirements.map((req) => {
                const met = req.test(password);
                return (
                  <li key={req.label} className={met ? 'met' : ''}>
                    <RequirementIcon met={met} />
                    {req.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="doc-field-group">
            <label className="doc-field-label" htmlFor="corp-confirm-password">
              Retype password <span className="doc-required">*</span>
            </label>
            <div className="password-wrapper">
              <input
                id="corp-confirm-password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                <EyeIcon visible={showConfirm} />
              </button>
            </div>
          </div>

          {error && <p className="otp-error">{error}</p>}

          <div className="otp-actions">
            <button type="button" className="back-button" onClick={onBack}>
              PREVIOUS
            </button>
            <button type="submit" className="continue-button">
              NEXT
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
