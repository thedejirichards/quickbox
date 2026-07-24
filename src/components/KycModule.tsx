import { useState } from 'react';

interface KycModuleProps {
  onBack: () => void;
  onSubmit: () => void;
}

export default function KycModule({ onBack, onSubmit }: KycModuleProps) {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [nextOfKin, setNextOfKin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !dob || !address || !occupation || !idType || !idNumber || !nextOfKin) {
      setError('Please fill in all fields.');
      return;
    }
    onSubmit();
  };

  return (
    <div className="login-form-wrapper">
      <div className="login-header">
        <h1>Complete Your KYC</h1>
        <p>Provide your details to unlock all features</p>
      </div>

      <form onSubmit={handleSubmit} className="bvn-form kyc-form">
        <div className="form-group">
          <label htmlFor="kyc-fullname">Full Name</label>
          <input
            id="kyc-fullname"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); setError(''); }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="kyc-dob">Date of Birth</label>
          <input
            id="kyc-dob"
            type="date"
            value={dob}
            onChange={(e) => { setDob(e.target.value); setError(''); }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="kyc-address">Address</label>
          <input
            id="kyc-address"
            type="text"
            placeholder="Enter your residential address"
            value={address}
            onChange={(e) => { setAddress(e.target.value); setError(''); }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="kyc-occupation">Occupation</label>
          <input
            id="kyc-occupation"
            type="text"
            placeholder="Enter your occupation"
            value={occupation}
            onChange={(e) => { setOccupation(e.target.value); setError(''); }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="kyc-idtype">ID Type</label>
          <select
            id="kyc-idtype"
            value={idType}
            onChange={(e) => { setIdType(e.target.value); setError(''); }}
            required
          >
            <option value="">Select ID type</option>
            <option value="nin">National ID (NIN)</option>
            <option value="drivers">Driver's License</option>
            <option value="passport">International Passport</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="kyc-idnumber">ID Number</label>
          <input
            id="kyc-idnumber"
            type="text"
            placeholder="Enter your ID number"
            value={idNumber}
            onChange={(e) => { setIdNumber(e.target.value); setError(''); }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="kyc-nok">Next of Kin</label>
          <input
            id="kyc-nok"
            type="text"
            placeholder="Enter next of kin name"
            value={nextOfKin}
            onChange={(e) => { setNextOfKin(e.target.value); setError(''); }}
            required
          />
        </div>

        {error && <p className="otp-error">{error}</p>}

        <div className="otp-actions">
          <button type="button" className="back-button" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="continue-button">
            SUBMIT KYC
          </button>
        </div>
      </form>
    </div>
  );
}
