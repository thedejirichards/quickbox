import { useState } from 'react';

interface KybInformationProps {
  onBack: () => void;
  onContinue: () => void;
}

const businessTypeOptions = [
  'Small Business',
  'Medium Business',
  'Large Enterprise',
  'Startup',
  'Multinational Corporation',
  'Non-Profit Organization',
];

const registrationTypeOptions = [
  'Business Name (BN)',
  'Limited Liability Company (RC)',
  'Public Limited Company (PLC)',
  'Incorporated Trustees (IT)',
  'Limited Partnership (LP)',
  'Limited Liability Partnership (LLP)',
];

const businessSectorOptions = [
  'Agriculture',
  'Construction',
  'Education',
  'Financial Services',
  'Healthcare',
  'Hospitality',
  'Information Technology',
  'Logistics & Transportation',
  'Manufacturing',
  'Oil & Gas',
  'Real Estate',
  'Retail & Trade',
  'Telecommunications',
  'Other',
];

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
  'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe',
  'Zamfara', 'Federal Capital Territory (Abuja)',
];

const employeeCountOptions = ['0', '1-10', '11-50', '51-200', '201-500', '500+'];

const directorCountOptions = ['1', '2', '3', '4', '5', '6+'];

export default function KybInformation({ onBack, onContinue }: KybInformationProps) {
  const [businessType, setBusinessType] = useState('');
  const [rcNumber, setRcNumber] = useState('');
  const [businessSector, setBusinessSector] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [numberOfLocations, setNumberOfLocations] = useState('');
  const [numberOfEmployees, setNumberOfEmployees] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [registrationType, setRegistrationType] = useState('');
  const [numberOfDirectors, setNumberOfDirectors] = useState('');
  const [director1Name, setDirector1Name] = useState('');
  const [director1Bvn, setDirector1Bvn] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !businessType ||
      !rcNumber ||
      !businessSector ||
      !state ||
      !city ||
      !numberOfLocations ||
      !numberOfEmployees ||
      !businessAddress ||
      !registrationType ||
      !numberOfDirectors ||
      !director1Name ||
      !director1Bvn
    ) {
      setError('Please fill in all fields.');
      return;
    }

    onContinue();
  };

  return (
    <div className="kyc-info-page">
      <div className="bvn-content">
        <div className="bvn-header">
          <h1>KYB Information</h1>
          <p>Business Information</p>
        </div>

        <div className="progress-bar">
          <div className="progress-step active">
            <div className="step-circle">1</div>
          </div>
          <div className="progress-line" />
          <div className="progress-step">
            <div className="step-circle">2</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="kyc-info-form">
          <div className="kyc-info-fields">
          <div className="form-group">
            <label htmlFor="business-type">Type of Business</label>
            <select
              id="business-type"
              value={businessType}
              onChange={(e) => { setBusinessType(e.target.value); setError(''); }}
              required
            >
              <option value="">Select type of business</option>
              {businessTypeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="registration-type">Company Registration Type</label>
            <select
              id="registration-type"
              value={registrationType}
              onChange={(e) => { setRegistrationType(e.target.value); setError(''); }}
              required
            >
              <option value="">Select registration type</option>
              {registrationTypeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rc-number">Company RC Number</label>
            <input
              id="rc-number"
              type="text"
              placeholder="Enter your registered company number"
              value={rcNumber}
              onChange={(e) => { setRcNumber(e.target.value); setError(''); }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="business-sector">Business Sector</label>
            <input
              id="business-sector"
              type="text"
              list="business-sector-options"
              placeholder="Search and select business sector"
              value={businessSector}
              onChange={(e) => { setBusinessSector(e.target.value); setError(''); }}
              required
            />
            <datalist id="business-sector-options">
              {businessSectorOptions.map((opt) => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="state">Business Location (State)</label>
            <select
              id="state"
              value={state}
              onChange={(e) => { setState(e.target.value); setError(''); }}
              required
            >
              <option value="">Select state</option>
              {nigerianStates.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="city">Business Location (City)</label>
            <input
              id="city"
              type="text"
              placeholder="e.g., Lagos"
              value={city}
              onChange={(e) => { setCity(e.target.value); setError(''); }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="number-of-locations">Number of Locations</label>
            <input
              id="number-of-locations"
              type="number"
              min="1"
              placeholder="Total number of business locations/branches"
              value={numberOfLocations}
              onChange={(e) => { setNumberOfLocations(e.target.value); setError(''); }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="number-of-employees">Number of Employees</label>
            <select
              id="number-of-employees"
              value={numberOfEmployees}
              onChange={(e) => { setNumberOfEmployees(e.target.value); setError(''); }}
              required
            >
              <option value="">Select employee count</option>
              {employeeCountOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="business-address">Business Address</label>
            <input
              id="business-address"
              type="text"
              placeholder="Enter your full registered business address"
              value={businessAddress}
              onChange={(e) => { setBusinessAddress(e.target.value); setError(''); }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="number-of-directors">Number of Directors/Promoters</label>
            <select
              id="number-of-directors"
              value={numberOfDirectors}
              onChange={(e) => { setNumberOfDirectors(e.target.value); setError(''); }}
              required
            >
              <option value="">Select number of directors/promoters</option>
              {directorCountOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="director1-name">Name of Director 1 (Prime Mover/Key Director)</label>
            <input
              id="director1-name"
              type="text"
              placeholder="Enter full name of the primary director"
              value={director1Name}
              onChange={(e) => { setDirector1Name(e.target.value); setError(''); }}
              required
            />
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="director1-bvn">BVN of Director 1</label>
            <input
              id="director1-bvn"
              type="text"
              inputMode="numeric"
              maxLength={11}
              placeholder="Enter the 11-digit BVN of the primary director"
              value={director1Bvn}
              onChange={(e) => { setDirector1Bvn(e.target.value); setError(''); }}
              required
            />
          </div>
          </div>

          {error && <p className="otp-error">{error}</p>}

          <div className="otp-actions">
            <button type="button" className="back-button" onClick={onBack}>
              Back
            </button>
            <button type="submit" className="continue-button">
              CONTINUE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
