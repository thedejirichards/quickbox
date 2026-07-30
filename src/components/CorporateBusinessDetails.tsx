import { Fragment, useState } from 'react';
import CorpProgressBar from './CorpProgressBar';

interface CorporateBusinessDetailsProps {
  onBack: () => void;
  onNext: () => void;
}

interface DirectorEntry {
  name: string;
  bvn: string;
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

const businessTypeOptions = [
  'Small Business',
  'Medium Business',
  'Large Enterprise',
  'Startup',
  'Multinational Corporation',
  'Non-Profit Organization',
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

const employeeCountOptions = ['1-10', '11-50', '51-200', '201-500', '500+'];

const registrationTypeOptions = [
  'Business Name (BN)',
  'Limited Liability Company (RC)',
  'Public Limited Company (PLC)',
  'Incorporated Trustees (IT)',
  'Limited Partnership (LP)',
  'Limited Liability Partnership (LLP)',
];

export default function CorporateBusinessDetails({ onBack, onNext }: CorporateBusinessDetailsProps) {
  const [businessType, setBusinessType] = useState('');
  const [rcNumber, setRcNumber] = useState('');
  const [businessSector, setBusinessSector] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [numberOfLocations, setNumberOfLocations] = useState('');
  const [numberOfEmployees, setNumberOfEmployees] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [registrationType, setRegistrationType] = useState('');
  const [directors, setDirectors] = useState<DirectorEntry[]>([{ name: '', bvn: '' }]);

  const updateDirector = (index: number, field: keyof DirectorEntry, value: string) => {
    setDirectors((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  };

  const addDirector = () => {
    setDirectors((prev) => [...prev, { name: '', bvn: '' }]);
  };

  const removeDirector = (index: number) => {
    setDirectors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const fillDummyData = () => {
    setBusinessType('Medium Business');
    setRcNumber('RC1234567');
    setBusinessSector('Information Technology');
    setState('Lagos');
    setCity('Victoria Island');
    setNumberOfLocations('3');
    setNumberOfEmployees('11-50');
    setBusinessAddress('12 Ozumba Mbadiwe Avenue, Victoria Island, Lagos');
    setRegistrationType('Limited Liability Company (RC)');
    setDirectors([
      { name: 'Adaeze Okafor', bvn: '22345678901' },
    ]);
  };

  return (
    <div className="bvn-page corp-business-details-page">
      <div className="bvn-content">
        <CorpProgressBar totalSteps={5} currentStep={3} />

        <div className="bvn-header corp-business-details-header">
          <div>
            <h1>Business Details</h1>
            <p>Tell us more about your business.</p>
          </div>
          <button type="button" className="corp-dummy-fill-btn" onClick={fillDummyData}>
            Fill Dummy Data
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bvn-form corp-scroll-form">
          <div className="corp-fields-grid">
            <div className="form-group form-group-full">
              <label htmlFor="business-type">
                Type of Business <span className="doc-required">*</span>
              </label>
              <select
                id="business-type"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                required
              >
                <option value="" disabled>Pick an option</option>
                {businessTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="rc-number">
                Company RC No. <span className="doc-required">*</span>
              </label>
              <input
                id="rc-number"
                type="text"
                placeholder="Enter your registered company number"
                value={rcNumber}
                onChange={(e) => setRcNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="business-sector">
                Business Sector <span className="doc-required">*</span>
              </label>
              <select
                id="business-sector"
                value={businessSector}
                onChange={(e) => setBusinessSector(e.target.value)}
                required
              >
                <option value="" disabled>Pick an option</option>
                {businessSectorOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="state">
                Business Location (State) <span className="doc-required">*</span>
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              >
                <option value="" disabled>Pick an option</option>
                {nigerianStates.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="city">
                Business Location (City) <span className="doc-required">*</span>
              </label>
              <input
                id="city"
                type="text"
                placeholder="e.g., Victoria Island"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="number-of-locations">Number of locations</label>
              <input
                id="number-of-locations"
                type="number"
                min="0"
                value={numberOfLocations}
                onChange={(e) => setNumberOfLocations(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="number-of-employees">Number of employees</label>
              <select
                id="number-of-employees"
                value={numberOfEmployees}
                onChange={(e) => setNumberOfEmployees(e.target.value)}
              >
                <option value="" disabled>Pick an option</option>
                {employeeCountOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="business-address">
                Business address <span className="doc-required">*</span>
              </label>
              <input
                id="business-address"
                type="text"
                placeholder="Enter your full registered business address"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="registration-type">
                Company reg. type <span className="doc-required">*</span>
              </label>
              <select
                id="registration-type"
                value={registrationType}
                onChange={(e) => setRegistrationType(e.target.value)}
                required
              >
                <option value="" disabled>Pick an option</option>
                {registrationTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {directors.map((director, index) => {
              const n = index + 1;
              return (
                <Fragment key={index}>
                  <div className="form-group">
                    <label htmlFor={`director${n}-name`}>
                      {index === 0 ? 'Director 1' : `Name of director ${n}`}{' '}
                      <span className="doc-required">*</span>
                    </label>
                    <input
                      id={`director${n}-name`}
                      type="text"
                      placeholder="Enter full name of the director"
                      value={director.name}
                      onChange={(e) => updateDirector(index, 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`director${n}-bvn`}>
                      BVN of director {n} <span className="doc-required">*</span>
                    </label>
                    <input
                      id={`director${n}-bvn`}
                      type="text"
                      inputMode="numeric"
                      maxLength={11}
                      placeholder="Enter the 11-digit BVN"
                      value={director.bvn}
                      onChange={(e) => updateDirector(index, 'bvn', e.target.value)}
                      required
                    />
                  </div>

                  {index > 0 && (
                    <div className="form-group-full corp-director-remove">
                      <button type="button" className="corp-remove-director-btn" onClick={() => removeDirector(index)}>
                        Remove director {n}
                      </button>
                    </div>
                  )}
                </Fragment>
              );
            })}

            <div className="form-group-full">
              <button type="button" className="corp-add-director-btn" onClick={addDirector}>
                <PlusIcon />
                Add Director
              </button>
            </div>
          </div>

          <div className="otp-actions">
            <button type="button" className="back-button" onClick={onBack}>
              PREVIOUS
            </button>
            <button type="submit" className="continue-button">
              NEXT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
