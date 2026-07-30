import { useState } from 'react';
import { lookupByBvn, lookupByAccountNumber, maskPhone, type CustomerRecord } from './customerLookup';

type Tab = 'bvn' | 'account';
type Stage = 'input' | 'confirm';

interface BvnValidationProps {
  onSendOtp: (maskedPhone: string) => void;
}

export default function BvnValidation({ onSendOtp }: BvnValidationProps) {
  const [activeTab, setActiveTab] = useState<Tab>('bvn');
  const [bvn, setBvn] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [stage, setStage] = useState<Stage>('input');
  const [customer, setCustomer] = useState<CustomerRecord | null>(null);

  const resetTab = (tab: Tab) => {
    setActiveTab(tab);
    setStage('input');
    setCustomer(null);
  };

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (stage === 'input') {
      const record = activeTab === 'bvn' ? lookupByBvn(bvn) : lookupByAccountNumber(accountNumber);
      setCustomer(record);
      setStage('confirm');
    } else if (customer) {
      onSendOtp(maskPhone(customer.phone));
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
          <div className="progress-line" />
          <div className="progress-step">
            <div className="step-circle">5</div>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'bvn' ? 'active' : ''}`}
            onClick={() => resetTab('bvn')}
          >
            BVN
          </button>
          <button
            className={`tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => resetTab('account')}
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

          {stage === 'confirm' && customer && (
            <div className="customer-info-card">
              <div className="customer-info-row">
                <span className="customer-info-label">First Name</span>
                <span className="customer-info-value">{customer.firstName}</span>
              </div>
              <div className="customer-info-row">
                <span className="customer-info-label">Middle Name</span>
                <span className="customer-info-value">{customer.middleName}</span>
              </div>
              <div className="customer-info-row">
                <span className="customer-info-label">Last Name</span>
                <span className="customer-info-value">{customer.lastName}</span>
              </div>
              <div className="customer-info-row">
                <span className="customer-info-label">Phone Number</span>
                <span className="customer-info-value">{maskPhone(customer.phone)}</span>
              </div>
              <div className="customer-info-row">
                <span className="customer-info-label">Gender</span>
                <span className="customer-info-value">{customer.gender}</span>
              </div>
            </div>
          )}

          {stage === 'confirm' && customer && (
            <div className="otp-message">
              <p>
                An OTP will be sent to the phone number registered with your {activeTab === 'bvn' ? 'BVN' : 'Account Number'}:{' '}
                <strong>{maskPhone(customer.phone)}</strong>
              </p>
            </div>
          )}

          <button type="submit" className="continue-button">
            {stage === 'confirm' ? 'SEND OTP' : `VALIDATE ${activeTab === 'bvn' ? 'BVN' : 'ACCOUNT NUMBER'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
