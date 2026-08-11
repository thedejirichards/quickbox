import { useEffect, useState } from 'react';
import './BnplModal.css';
import './CorporateVehicleFinanceModal.css';
import OfferLetterSection from './OfferLetterPage';
import { InspectionSection, PinSigningSection, ProcessingSection, CompletedSection } from './CorporateStageSections';
import type { CorporateFinanceStage, RequestedCar, VehicleFinanceRequest } from './vehicleFinanceRequests';

interface LoanRequestDetailProps {
  request: VehicleFinanceRequest;
  accountType: 'individual' | 'business';
  displayName: string;
  onBack: () => void;
  onUpdateRequest: (id: string, updates: Partial<VehicleFinanceRequest>) => void;
  onUpdateCar: (requestId: string, carId: string, updates: Partial<RequestedCar>) => void;
}

type ScheduleModalStep = 'form' | 'confirm' | 'success';

const TENOR_MONTHS = 36;
const INTEREST_RATE_PA = 0.18;
const INSURANCE_RATE = 0.03;
const PROCESSING_FEE = 50_000;
const INSPECTION_DELAY_MS = 1800;
const PROCESSING_DELAY_MS = 1600;

const CORPORATE_STAGE_ORDER: CorporateFinanceStage[] = [
  'inspection-schedule',
  'inspection-pending',
  'inspection-report',
  'offer-letter',
  'pin',
  'processing',
  'delivery-code',
  'completed',
];

const timeSlotLabels: Record<string, string> = {
  '9-11am': '9:00 AM - 11:00 AM',
  '12-2pm': '12:00 PM - 2:00 PM',
  '3-5pm': '3:00 PM - 5:00 PM',
};

const inspectionChecklist = [
  { id: 'engine', label: 'Engine & Transmission', result: 'Passed' },
  { id: 'body', label: 'Body & Paintwork', result: 'Passed' },
  { id: 'interior', label: 'Interior & Electricals', result: 'Passed' },
  { id: 'tyres', label: 'Tyres & Brakes', result: 'Passed with minor notes' },
  { id: 'documents', label: 'Vehicle Documents', result: 'Verified' },
];

function stageIndex(stage?: CorporateFinanceStage) {
  if (!stage) return -1;
  return CORPORATE_STAGE_ORDER.indexOf(stage);
}

interface JourneyStep {
  key: string;
  label: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  { key: 'requested', label: 'Requested' },
  { key: 'inspection', label: 'Inspection' },
  { key: 'offer', label: 'Offer & Signing' },
  { key: 'processing', label: 'Processing' },
  { key: 'completed', label: 'Completed' },
];

function journeyIndex(stage?: CorporateFinanceStage) {
  switch (stage) {
    case 'inspection-pending':
    case 'inspection-report':
    case 'inspection-rejected':
      return 1;
    case 'offer-letter':
    case 'pin':
      return 2;
    case 'processing':
    case 'delivery-code':
      return 3;
    case 'completed':
      return 4;
    default:
      return 0;
  }
}

interface JourneyProgressProps {
  steps: JourneyStep[];
  currentIndex: number;
  hasError: boolean;
}

function JourneyProgress({ steps, currentIndex, hasError }: JourneyProgressProps) {
  return (
    <div className="vf-req-progress">
      {steps.map((step, i) => {
        const isError = hasError && i === currentIndex;
        const state = isError ? 'error' : i < currentIndex ? 'completed' : i === currentIndex ? 'active' : '';
        return (
          <div className="vf-req-progress-item" key={step.key}>
            <div className={`vf-req-progress-step ${state}`}>
              <div className="vf-req-progress-circle">{isError ? '!' : i + 1}</div>
              <span className="vf-req-progress-label">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`vf-req-progress-line ${i < currentIndex ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function parsePrice(price: string) {
  return Number(price.replace(/[^\d]/g, '')) || 0;
}

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

function parseState(location: string) {
  const first = location.split(',')[0].trim();
  if (first.includes('(FCT)')) return 'Abuja/FCT';
  return first.replace(/\s*State$/i, '');
}

function gradeFor(mileage: number) {
  if (mileage < 100_000) return 'A';
  if (mileage < 200_000) return 'B';
  return 'C';
}

function vinFor(request: RequestedCar) {
  const prefix = `${request.make}${request.model}`.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase().padEnd(4, 'X');
  return `${prefix}${'*'.repeat(11)}`;
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}

function corporateStageMessage(request: RequestedCar) {
  switch (request.corporateStage) {
    case 'inspection-schedule':
      return 'Your vendor quotation has been confirmed. Please schedule a vehicle inspection to proceed.';
    case 'inspection-pending':
      return `Inspection scheduled for ${request.inspectionDate} (${request.inspectionTime}). Awaiting the vendor's report.`;
    case 'inspection-report':
      return 'The vendor has submitted the inspection report. Please review and confirm the outcome.';
    case 'inspection-rejected':
      return 'The inspection was not accepted. Please submit a new request for a different vehicle.';
    case 'offer-letter':
      return 'Your inspection was accepted. An Offer Letter has been generated for your review.';
    case 'pin':
      return 'Please confirm and digitally sign your Offer Letter with your PIN or token.';
    case 'processing':
      return 'Processing your equity contribution, insurance premium and applicable fees.';
    case 'delivery-code':
      return `Your delivery code ${request.deliveryCode} has been generated. Share it with the vendor to collect your vehicle.`;
    case 'completed':
      return 'Your financing process is complete. The insurance certificate has been sent to your email.';
    default:
      return '';
  }
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface VehicleInfoCardProps {
  title: string;
  carDetails: { label: string; value: string }[];
}

function VehicleInfoCard({ title, carDetails }: VehicleInfoCardProps) {
  return (
    <div className="vf-req-info-card">
      <h3 className="vf-req-info-title">{title}</h3>
      <div className="vf-req-details">
        {carDetails.map((row, i) => (
          <div key={row.label} className={`vf-req-detail-row ${i % 2 === 1 ? 'alt' : ''}`}>
            <span className="vf-req-detail-label">{row.label}</span>
            <span className="vf-req-detail-dash">-</span>
            <span className="vf-req-detail-value">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RepaymentCardProps {
  eligibleAmount: number;
  loanAmount: number;
  monthlyRepayment: number;
  insurancePremium: number;
}

function RepaymentCard({ eligibleAmount, loanAmount, monthlyRepayment, insurancePremium }: RepaymentCardProps) {
  return (
    <div className="vf-req-info-card">
      <h3 className="vf-req-info-title">Repayment Information</h3>
      <div className="vf-req-amounts">
        <div className="vf-req-amount-row">
          <span>Eligible Amount</span>
          <strong>{formatNaira(eligibleAmount)}</strong>
        </div>
        <div className="vf-req-amount-row">
          <span>Loan Amount</span>
          <strong>{formatNaira(loanAmount)}</strong>
        </div>
        <div className="vf-req-amount-row">
          <span>Tenor</span>
          <strong>{TENOR_MONTHS} months</strong>
        </div>
        <div className="vf-req-amount-row">
          <span>Estimated Monthly Repayment</span>
          <strong>{formatNaira(monthlyRepayment)}</strong>
        </div>
        <div className="vf-req-amount-row">
          <span>Insurance Premium</span>
          <strong>{formatNaira(insurancePremium)}</strong>
        </div>
        <div className="vf-req-amount-row">
          <span>Processing Fee</span>
          <strong>{formatNaira(PROCESSING_FEE)}</strong>
        </div>
      </div>
    </div>
  );
}

export default function LoanRequestDetail({ request, accountType, displayName, onBack, onUpdateRequest, onUpdateCar }: LoanRequestDetailProps) {
  const isFleetView = accountType === 'business';
  // Fall back to the request itself as a single car if it predates per-car tracking.
  const hasCars = Boolean(request.cars && request.cars.length > 0);
  const cars = hasCars ? request.cars! : [request];
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const selectedCar = cars.find((c) => c.id === selectedCarId) ?? null;
  const active: RequestedCar = isFleetView && selectedCar ? selectedCar : request;
  const showVehicleTable = isFleetView && !selectedCar;

  const updateActive = (updates: Partial<RequestedCar>) => {
    if (isFleetView && selectedCarId && hasCars) {
      onUpdateCar(request.id, selectedCarId, updates);
    } else {
      onUpdateRequest(request.id, updates);
    }
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const [inspectionDate, setInspectionDate] = useState(active.inspectionDate ?? '');
  const [inspectionTime, setInspectionTime] = useState(active.inspectionTime ?? '');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleModalStep, setScheduleModalStep] = useState<ScheduleModalStep>('form');

  useEffect(() => {
    setInspectionDate(active.inspectionDate ?? '');
    setInspectionTime(active.inspectionTime ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.id]);

  useEffect(() => {
    if (active.corporateStage !== 'inspection-pending') return;
    const timer = setTimeout(() => {
      updateActive({ corporateStage: 'inspection-report' });
    }, INSPECTION_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.corporateStage, active.id]);

  useEffect(() => {
    if (active.corporateStage !== 'processing') return;
    const timer = setTimeout(() => {
      const code = `DEL-${Math.floor(100000 + Math.random() * 900000)}`;
      updateActive({ corporateStage: 'delivery-code', deliveryCode: code });
    }, PROCESSING_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.corporateStage, active.id]);

  const priceValue = parsePrice(active.price);
  const eligibleAmount = Math.max(5_000_000, Math.ceil(priceValue / 500_000) * 500_000);
  const minEquity = Math.max(500_000, Math.round((priceValue * 0.1) / 50_000) * 50_000);
  const loanAmount = Math.max(priceValue - minEquity, 0);
  const totalInterest = Math.round(loanAmount * INTEREST_RATE_PA * (TENOR_MONTHS / 12));
  const monthlyRepayment = Math.round((loanAmount + totalInterest) / TENOR_MONTHS);
  const insurancePremium = Math.round(priceValue * INSURANCE_RATE);
  const totalPayable = loanAmount + totalInterest + insurancePremium + PROCESSING_FEE;

  const equityFunded = stageIndex(active.corporateStage) >= stageIndex('processing');

  const carDetails = [
    { label: 'Car Make', value: active.make },
    { label: 'Car Type', value: `${active.make} ${active.model}` },
    { label: 'Car Condition', value: 'Pre - owned' },
    { label: 'Year of Manufacture', value: `${active.year}` },
    { label: 'Car Color', value: active.color },
    { label: 'Car Rating/Grade', value: gradeFor(active.mileage) },
    { label: 'VIN /Chasis number', value: vinFor(active) },
    { label: 'Car location(State)', value: parseState(active.location) },
  ];

  const notifications = [
    {
      id: 'received',
      text: `Your vehicle finance request for ${active.make} ${active.model} has been received and is under review.`,
      date: new Date(active.dateRequested),
    },
    { id: 'stage', text: corporateStageMessage(active), date: addDays(active.dateRequested, 1) },
  ];

  const scheduleSummary = `${inspectionDate ? new Date(inspectionDate).toLocaleDateString() : ''} between ${timeSlotLabels[inspectionTime] ?? inspectionTime}`;

  return (
    <div className="vf-req">
      <button
        className="vf-req-back"
        onClick={isFleetView && selectedCarId ? () => setSelectedCarId(null) : onBack}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <div className="vf-req-title-row">
        <h1>{active.make} {active.model} - {active.year}</h1>
        <span className={`vf-status-badge ${active.status}`}>
          {active.status === 'approved' ? <CheckIcon /> : <ClockIcon />}
          {active.status === 'approved' ? 'Approved' : active.status === 'declined' ? 'Declined' : 'Pending'}
        </span>
        {!showVehicleTable && (
          <button className="vf-req-notif-btn" onClick={() => setShowNotifications(true)}>
            <BellIcon />
            Request Notification
          </button>
        )}
      </div>

      <p className="vf-req-greeting">Hello {displayName},</p>
      <p className="vf-req-subtitle">Your Car Details by {active.dealer}</p>

      {showVehicleTable ? (
        <div className="vf-req-info-card">
          <h3 className="vf-req-info-title">Requested Vehicles</h3>
          <div className="vf-requests-table-wrap">
            <table className="vf-requests-table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Car ID</th>
                  <th>Car model</th>
                  <th>Vendor</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car, i) => (
                  <tr key={car.id}>
                    <td>{i + 1}</td>
                    <td><span className="vf-request-id">{car.id}</span></td>
                    <td>{car.make} {car.model}</td>
                    <td>{car.dealer}</td>
                    <td>
                      <span className={`vf-status-badge ${car.corporateStage === 'completed' ? 'approved' : 'pending'}`}>
                        {JOURNEY_STEPS[journeyIndex(car.corporateStage)].label}
                      </span>
                    </td>
                    <td>
                      <button className="vf-car-view-btn" onClick={() => setSelectedCarId(car.id)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          <JourneyProgress
            steps={JOURNEY_STEPS}
            currentIndex={journeyIndex(active.corporateStage)}
            hasError={active.corporateStage === 'inspection-rejected'}
          />

          {!active.corporateStage || active.corporateStage === 'inspection-schedule' ? (
            <div className="vf-req-grid">
              <div className="vf-req-main">
                <VehicleInfoCard title="Vehicle Information" carDetails={carDetails} />
              </div>

              <div className="vf-req-side">
                <RepaymentCard
                  eligibleAmount={eligibleAmount}
                  loanAmount={loanAmount}
                  monthlyRepayment={monthlyRepayment}
                  insurancePremium={insurancePremium}
                />

                <div className="vf-req-info-card">
                  <h3 className="vf-req-info-title">Next Step</h3>
                  <p className="vf-req-hint">Schedule your vehicle inspection to move this request forward.</p>
                  <button
                    className="vf-req-btn-primary vf-req-btn-fit"
                    onClick={() => {
                      setScheduleModalStep('form');
                      setScheduleModalOpen(true);
                    }}
                  >
                    Schedule Inspection
                  </button>
                </div>
              </div>
            </div>
          ) : active.corporateStage === 'inspection-pending' || active.corporateStage === 'inspection-report' || active.corporateStage === 'inspection-rejected' ? (
            <InspectionSection
              subStage={active.corporateStage}
              dealer={active.dealer}
              fileName={`Vehicle_Inspection_Report_${vinFor(active)}.pdf`}
              dateLabel={addDays(active.dateRequested, 2).toLocaleDateString()}
              checklist={inspectionChecklist}
              onReject={() => updateActive({ corporateStage: 'inspection-rejected' })}
              onAccept={() => updateActive({ corporateStage: 'offer-letter' })}
              onBackToRequests={onBack}
            />
          ) : active.corporateStage === 'offer-letter' ? (
            <OfferLetterSection
              fileName={`Offer_Letter_${vinFor(active)}.pdf`}
              dealer={active.dealer}
              dateLabel={addDays(active.dateRequested, 3).toLocaleDateString()}
              totalPayableLabel={formatNaira(totalPayable)}
              onAccept={() => updateActive({ corporateStage: 'pin' })}
            />
          ) : active.corporateStage === 'pin' ? (
            <PinSigningSection
              minEquity={minEquity}
              equityFunded={equityFunded}
              onSubmit={() => updateActive({ corporateStage: 'processing' })}
            />
          ) : active.corporateStage === 'processing' || active.corporateStage === 'delivery-code' ? (
            <ProcessingSection
              subStage={active.corporateStage}
              deliveryCode={active.deliveryCode}
              onVehicleCollected={() => updateActive({ corporateStage: 'completed', status: 'approved' })}
            />
          ) : active.corporateStage === 'completed' ? (
            <CompletedSection />
          ) : null}
        </>
      )}

      {scheduleModalOpen && scheduleModalStep === 'form' && (
        <div className="modal-overlay" onClick={() => setScheduleModalOpen(false)}>
          <div className="doc-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="doc-modal-close" onClick={() => setScheduleModalOpen(false)} aria-label="Close">
              <CloseIcon />
            </button>
            <h3 className="doc-modal-title">Schedule Vehicle Inspection</h3>
            <p className="doc-modal-subtitle">
              Choose a convenient date and time for {active.dealer} to inspect your {active.make} {active.model}.
            </p>
            <form
              className="doc-modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                setScheduleModalStep('confirm');
              }}
            >
              <div className="doc-field-group">
                <label className="doc-field-label">
                  Preferred inspection date <span className="doc-required">*</span>
                </label>
                <input type="date" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} required />
              </div>
              <div className="doc-field-group">
                <label className="doc-field-label">
                  Preferred time slot <span className="doc-required">*</span>
                </label>
                <select value={inspectionTime} onChange={(e) => setInspectionTime(e.target.value)} required>
                  <option value="" disabled>Select a time slot</option>
                  <option value="9-11am">9:00 AM - 11:00 AM</option>
                  <option value="12-2pm">12:00 PM - 2:00 PM</option>
                  <option value="3-5pm">3:00 PM - 5:00 PM</option>
                </select>
              </div>
              <button type="submit" className="doc-submit-btn">Schedule Inspection</button>
            </form>
          </div>
        </div>
      )}

      {scheduleModalOpen && scheduleModalStep === 'confirm' && (
        <div className="modal-overlay" onClick={() => setScheduleModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon warning">
              <CalendarIcon />
            </div>
            <h3>Confirm Inspection Schedule</h3>
            <p>You're about to schedule your vehicle inspection for {scheduleSummary}. Do you want to proceed?</p>
            <button
              className="modal-button"
              onClick={() => {
                updateActive({
                  corporateStage: 'inspection-pending',
                  inspectionDate,
                  inspectionTime,
                });
                setScheduleModalStep('success');
              }}
            >
              Confirm Schedule
            </button>
            <button className="modal-button-outline" onClick={() => setScheduleModalStep('form')}>Back</button>
          </div>
        </div>
      )}

      {scheduleModalOpen && scheduleModalStep === 'success' && (
        <div className="modal-overlay" onClick={() => setScheduleModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon success">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Inspection Scheduled</h3>
            <p>You have successfully scheduled your inspection for {scheduleSummary}.</p>
            <button
              className="modal-button"
              onClick={() => setScheduleModalOpen(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="vf-notif-overlay" onClick={() => setShowNotifications(false)}>
          <div className="vf-notif-panel" onClick={(e) => e.stopPropagation()}>
            <div className="vf-notif-panel-header">
              <h3>Recent Notifications</h3>
              <button className="vf-notif-panel-close" onClick={() => setShowNotifications(false)} aria-label="Close">
                <CloseIcon />
              </button>
            </div>
            <ul className="vf-req-notif-list">
              {notifications.map((n) => (
                <li key={n.id} className="vf-req-notif-item">
                  <span className="vf-req-notif-dot" />
                  <div>
                    <p className="vf-req-notif-text">{n.text}</p>
                    <span className="vf-req-notif-time">{n.date.toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
