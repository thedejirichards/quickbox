import { useState } from 'react';

type Tab = 'bvn' | 'account';

interface BvnValidationProps {
  onSendOtp: (maskedPhone: string) => void;
}

export default function BvnValidation({ onSendOtp }: BvnValidationProps) {
  const [activeTab, setActiveTab] = useState<Tab>('bvn');
  const [bvn, setBvn] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);

  const getMaskedPhone = () => {
    return '+234 *** *** 7890';
  };

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpRequested) {
      setOtpRequested(true);
    } else {
      onSendOtp(getMaskedPhone());
    }
  };

  return (
    <div className="bvn-page">
      <div className="bvn-content">
        <div className="bvn-header">
          <h1>Validate Your Identity</h1>
          <p>Enter your BVN or Account Number to get started</p>
        </div>

        <div className="progress-bar">
          <div className="progress-step active">
            <div className="step-circle">1</div>
          </div>
          <div className="progress-line" />
          <div className="progress-step">
            <div className="step-circle">2</div>
          </div>
          <div className="progress-line" />
          <div className="progress-step">
            <div className="step-circle">3</div>
          </div>
          <div className="progress-line" />
          <div className="progress-step">
            <div className="step-circle">4</div>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'bvn' ? 'active' : ''}`}
            onClick={() => { setActiveTab('bvn'); setOtpRequested(false); }}
          >
            BVN
          </button>
          <button
            className={`tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => { setActiveTab('account'); setOtpRequested(false); }}
          >
            Account Number
          </button>
        </div>

        <form onSubmit={handleValidate} className="bvn-form">
          {activeTab === 'bvn' ? (
            <div className="form-group">
              <label htmlFor="bvn">Bank Verification Number (BVN)</label>
              <input
                id="bvn"
                type="text"
                placeholder="Enter your 11-digit BVN"
                value={bvn}
                onChange={(e) => setBvn(e.target.value)}
                maxLength={11}
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="account">Account Number</label>
              <input
                id="account"
                type="text"
                placeholder="Enter your 10-digit account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                maxLength={10}
                required
              />
            </div>
          )}

          {otpRequested && (
            <div className="otp-message">
              <p>
                An OTP will be sent to the phone number registered with your {activeTab === 'bvn' ? 'BVN' : 'Account Number'}:{' '}
                <strong>{getMaskedPhone()}</strong>
              </p>
            </div>
          )}

          <button type="submit" className="continue-button">
            {otpRequested ? 'SEND OTP' : `VALIDATE ${activeTab === 'bvn' ? 'BVN' : 'ACCOUNT NUMBER'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
