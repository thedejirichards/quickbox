import { useState } from 'react';

type Status = 'employed' | 'self-employed' | 'unemployed' | '';

interface EmploymentStatusProps {
  onBack: () => void;
  onSubmit: () => void;
}

const nigerianBanks = [
  'Access Bank',
  'Citibank Nigeria',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank (FCMB)',
  'Globus Bank',
  'Guaranty Trust Bank (GTBank)',
  'Heritage Bank',
  'Keystone Bank',
  'Polaris Bank',
  'Providus Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'Suntrust Bank',
  'Titan Trust Bank',
  'Union Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
  'Other',
];

const occupationOptions = [
  'Accounting / Finance',
  'Administration',
  'Agriculture',
  'Banking',
  'Civil Service',
  'Education / Teaching',
  'Engineering',
  'Healthcare / Medical',
  'Information Technology',
  'Legal',
  'Marketing / Sales',
  'Media / Communications',
  'Oil & Gas',
  'Real Estate',
  'Transportation / Logistics',
  'Other',
];

export default function EmploymentStatus({ onBack, onSubmit }: EmploymentStatusProps) {
  const [status, setStatus] = useState<Status>('');
  const [hasAccessAccount, setHasAccessAccount] = useState('');
  const [error, setError] = useState('');

  // Employed fields
  const [placeOfEmployment, setPlaceOfEmployment] = useState('');
  const [occupation, setOccupation] = useState('');
  const [typeOfEmployment, setTypeOfEmployment] = useState('');
  const [employmentDate, setEmploymentDate] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [salaryPaymentDay, setSalaryPaymentDay] = useState('');
  const [salaryBankName, setSalaryBankName] = useState('');
  const [salaryAccountNumber, setSalaryAccountNumber] = useState('');
  const [employmentConsent, setEmploymentConsent] = useState(false);

  // Self-employed fields
  const [workCategory, setWorkCategory] = useState('');
  const [averageMonthlyIncome, setAverageMonthlyIncome] = useState('');

  const handleStatusChange = (value: string) => {
    setStatus(value as Status);
    setError('');
    // Changing employment status clears any previously entered data for the prior selection
    setPlaceOfEmployment('');
    setOccupation('');
    setTypeOfEmployment('');
    setEmploymentDate('');
    setMonthlySalary('');
    setSalaryPaymentDay('');
    setSalaryBankName('');
    setSalaryAccountNumber('');
    setEmploymentConsent(false);
    setWorkCategory('');
    setAverageMonthlyIncome('');
    setHasAccessAccount('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!status) {
      setError('Please select your employment status.');
      return;
    }

    if (!hasAccessAccount) {
      setError('Please let us know if you have an Access Bank account.');
      return;
    }

    if (status === 'employed') {
      if (
        !placeOfEmployment ||
        !occupation ||
        !typeOfEmployment ||
        !employmentDate ||
        !monthlySalary ||
        !salaryPaymentDay ||
        !salaryBankName ||
        !salaryAccountNumber
      ) {
        setError('Please fill in all employment details.');
        return;
      }
      if (!employmentConsent) {
        setError('Please consent to Access Bank obtaining your employment records to continue.');
        return;
      }
    }

    if (status === 'self-employed') {
      if (!workCategory || !averageMonthlyIncome) {
        setError('Please fill in all fields.');
        return;
      }
    }

    onSubmit();
  };

  return (
    <div className="kyc-info-page">
      <div className="bvn-content">
        <div className="bvn-header">
          <h1>Employment Details</h1>
          <p>Tell us about your employment information</p>
        </div>

        <form onSubmit={handleSubmit} className="kyc-info-form">
          <div className="kyc-info-fields">
          <div className="form-group form-group-full">
            <label htmlFor="employment-status">Employment Status</label>
            <select
              id="employment-status"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              required
            >
              <option value="">Select employment status</option>
              <option value="employed">Employed</option>
              <option value="self-employed">Self-Employed</option>
              <option value="unemployed">Unemployed</option>
            </select>
          </div>

          {status === 'employed' && (
            <>
              <div className="form-group">
                <label htmlFor="place-of-employment">Place of Employment</label>
                <input
                  id="place-of-employment"
                  type="text"
                  placeholder="Enter your employer's name"
                  value={placeOfEmployment}
                  onChange={(e) => { setPlaceOfEmployment(e.target.value); setError(''); }}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="occupation">Occupation</label>
                <select
                  id="occupation"
                  value={occupation}
                  onChange={(e) => { setOccupation(e.target.value); setError(''); }}
                  required
                >
                  <option value="">Select occupation</option>
                  {occupationOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="type-of-employment">Type of Employment</label>
                <select
                  id="type-of-employment"
                  value={typeOfEmployment}
                  onChange={(e) => { setTypeOfEmployment(e.target.value); setError(''); }}
                  required
                >
                  <option value="">Select type of employment</option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="employment-date">Employment Date</label>
                <input
                  id="employment-date"
                  type="date"
                  value={employmentDate}
                  onChange={(e) => { setEmploymentDate(e.target.value); setError(''); }}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="monthly-salary">Monthly Salary</label>
                <input
                  id="monthly-salary"
                  type="number"
                  min="0"
                  placeholder="Enter your monthly salary"
                  value={monthlySalary}
                  onChange={(e) => { setMonthlySalary(e.target.value); setError(''); }}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="salary-payment-day">Salary Payment Day</label>
                <select
                  id="salary-payment-day"
                  value={salaryPaymentDay}
                  onChange={(e) => { setSalaryPaymentDay(e.target.value); setError(''); }}
                  required
                >
                  <option value="">Select day of the month</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                  <option value="last">Last working day of the month</option>
                </select>
              </div>

              <div className="info-note">
                <p>
                  <strong>Salary Domiciliation:</strong> Your monthly salary will be domiciled with
                  Access Bank as a condition of this loan facility.
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="salary-bank-name">Salary Bank Name</label>
                <select
                  id="salary-bank-name"
                  value={salaryBankName}
                  onChange={(e) => { setSalaryBankName(e.target.value); setError(''); }}
                  required
                >
                  <option value="">Select the bank your salary is paid into</option>
                  {nigerianBanks.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="salary-account-number">Salary Account Number</label>
                <input
                  id="salary-account-number"
                  type="text"
                  placeholder="Enter your 10-digit account number"
                  maxLength={10}
                  value={salaryAccountNumber}
                  onChange={(e) => { setSalaryAccountNumber(e.target.value); setError(''); }}
                  required
                />
              </div>
            </>
          )}

          {status === 'self-employed' && (
            <>
              <div className="form-group">
                <label htmlFor="work-category">Work Category</label>
                <select
                  id="work-category"
                  value={workCategory}
                  onChange={(e) => { setWorkCategory(e.target.value); setError(''); }}
                  required
                >
                  <option value="">Select work category</option>
                  <option value="artisan">Artisan</option>
                  <option value="business-owner">Business Owner</option>
                  <option value="contractor-freelancer">Contractor/Freelancer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="average-monthly-income">Average Monthly Income</label>
                <input
                  id="average-monthly-income"
                  type="number"
                  min="0"
                  placeholder="Enter your average monthly income"
                  value={averageMonthlyIncome}
                  onChange={(e) => { setAverageMonthlyIncome(e.target.value); setError(''); }}
                  required
                />
              </div>
            </>
          )}

          {status && (
            <div className="form-group form-group-full">
              <label htmlFor="has-access-account">Do you have an Access Bank account?</label>
              <select
                id="has-access-account"
                value={hasAccessAccount}
                onChange={(e) => { setHasAccessAccount(e.target.value); setError(''); }}
                required
              >
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          )}

          {status === 'employed' && (
            <label className="terms-checkbox">
              <input
                type="checkbox"
                checked={employmentConsent}
                onChange={(e) => { setEmploymentConsent(e.target.checked); setError(''); }}
              />
              <span>I consent to Access Bank obtaining my employment records from a third party for verification purposes.</span>
            </label>
          )}
          </div>

          {error && <p className="otp-error">{error}</p>}

          <div className="otp-actions">
            <button type="button" className="back-button" onClick={onBack}>
              Back
            </button>
            <button type="submit" className="continue-button">
              SUBMIT EMPLOYMENT DETAILS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
