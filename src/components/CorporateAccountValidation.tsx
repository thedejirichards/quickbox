import { useState } from 'react';
import CorpProgressBar from './CorpProgressBar';

interface CorporateAccountValidationProps {
  onBack: () => void;
  onSignIn: () => void;
  onSendOtp: (accountNumber: string, email: string, referralCode: string) => void;
}

function InfoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="11" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export default function CorporateAccountValidation({ onBack, onSignIn, onSendOtp }: CorporateAccountValidationProps) {
  const [accountNumber, setAccountNumber] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendOtp(accountNumber, email, referralCode);
  };

  return (
    <div className="bvn-page">
      <div className="bvn-content">
        <CorpProgressBar totalSteps={4} currentStep={1} />

        <div className="bvn-header">
          <h1>Welcome to QuickBucks!</h1>
          <p>Please enter the required information in the fields below.</p>
          <p className="corp-required-note">
            Fields marked with <span className="doc-required">&quot;*&quot;</span> must be filled.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bvn-form">
          <div className="doc-field-group">
            <label className="doc-field-label" htmlFor="corp-account-number">
              Access Bank corporate account number <span className="doc-required">*</span>
            </label>
            <input
              id="corp-account-number"
              type="text"
              placeholder="222555885544"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </div>

          <div className="doc-field-group">
            <label className="doc-field-label" htmlFor="corp-email">
              Email address <span className="doc-required">*</span>
            </label>
            <input
              id="corp-email"
              type="email"
              placeholder="name@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="corp-field-hint">
              <InfoIcon />
              Please enter your business email address e.g. name@business.com
            </p>
          </div>

          <div className="doc-field-group">
            <label className="doc-field-label" htmlFor="corp-referral">
              Referral code
            </label>
            <input
              id="corp-referral"
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>

          <div className="otp-actions">
            <button type="button" className="back-button" onClick={onBack}>
              PREVIOUS
            </button>
            <button type="submit" className="continue-button">
              SEND OTP
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
