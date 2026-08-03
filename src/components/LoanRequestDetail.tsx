import { useEffect, useState } from 'react';
import './BnplModal.css';
import './CorporateVehicleFinanceModal.css';
import OfferLetterSection from './OfferLetterPage';
import { InspectionSection, PinSigningSection, ProcessingSection, CompletedSection } from './CorporateStageSections';
import { IndividualInspectionSection, DecisionSection } from './IndividualStageSections';
import type { CorporateFinanceStage, VehicleFinanceRequest } from './vehicleFinanceRequests';

interface LoanRequestDetailProps {
  request: VehicleFinanceRequest;
  accountType: 'individual' | 'business';
  displayName: string;
  onBack: () => void;
  onUpdateRequest: (id: string, updates: Partial<VehicleFinanceRequest>) => void;
}

type ScheduleModalStep = 'form' | 'confirm' | 'success';

const TENOR_MONTHS = 36;
const INTEREST_RATE_PA = 0.18;
const INSURANCE_RATE = 0.03;
const PROCESSING_FEE = 50_000;
const INSPECTION_DELAY_MS = 1800;
const PROCESSING_DELAY_MS = 1600;
const REPORT_READY_DELAY_MS = 7000;
const DECISION_DELAY_MS = 1800;

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

const BUSINESS_JOURNEY_STEPS: JourneyStep[] = [
  { key: 'requested', label: 'Requested' },
  { key: 'inspection', label: 'Inspection' },
  { key: 'offer', label: 'Offer & Signing' },
  { key: 'processing', label: 'Processing' },
  { key: 'completed', label: 'Completed' },
];

const INDIVIDUAL_JOURNEY_STEPS: JourneyStep[] = [
  { key: 'requested', label: 'Requested' },
  { key: 'inspection', label: 'Inspection' },
  { key: 'review', label: 'Review' },
  { key: 'decision', label: 'Decision' },
];

function businessJourneyIndex(stage?: CorporateFinanceStage) {
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

function individualJourneyIndex(request: VehicleFinanceRequest) {
  if (request.status !== 'pending') return 3;
  if (request.inspectionReviewed) return 2;
  if (request.inspectionDate) return 1;
  return 0;
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

function vinFor(request: VehicleFinanceRequest) {
  const prefix = `${request.make}${request.model}`.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase().padEnd(4, 'X');
  return `${prefix}${'*'.repeat(11)}`;
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}

function corporateStageMessage(request: VehicleFinanceRequest) {
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
  isBusinessFlow: boolean;
  insurancePremium: number;
}

function RepaymentCard({ eligibleAmount, loanAmount, monthlyRepayment, isBusinessFlow, insurancePremium }: RepaymentCardProps) {
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
        {isBusinessFlow && (
          <>
            <div className="vf-req-amount-row">
              <span>Insurance Premium</span>
              <strong>{formatNaira(insurancePremium)}</strong>
            </div>
            <div className="vf-req-amount-row">
              <span>Processing Fee</span>
              <strong>{formatNaira(PROCESSING_FEE)}</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface EquityCardProps {
  minEquity: number;
  equityFunded: boolean;
  isBusinessFlow: boolean;
}

function EquityCard({ minEquity, equityFunded, isBusinessFlow }: EquityCardProps) {
  return (
    <div className="vf-req-info-card">
      <div className="vf-req-info-title-row">
        <h3 className="vf-req-info-title">Equity Contribution</h3>
        <span className={`vf-status-badge ${equityFunded ? 'approved' : 'pending'}`}>
          {equityFunded ? <CheckIcon /> : <ClockIcon />}
          {equityFunded ? 'Funded' : 'Awaiting Funding'}
        </span>
      </div>
      <div className="vf-req-amount-row">
        <span>Required Contribution</span>
        <strong>{formatNaira(minEquity)}</strong>
      </div>
      <p className="vf-req-hint">
        {equityFunded
          ? 'Your equity contribution has been received.'
          : isBusinessFlow
            ? 'This will be processed automatically once you accept the Offer Letter and confirm with your PIN.'
            : 'Fund your account with this amount to keep your request moving.'}
      </p>
    </div>
  );
}

export default function LoanRequestDetail({ request, accountType, displayName, onBack, onUpdateRequest }: LoanRequestDetailProps) {
  const isBusinessFlow = accountType === 'business' && Boolean(request.corporateStage);

  const [showNotifications, setShowNotifications] = useState(false);
  const [inspectionDate, setInspectionDate] = useState(request.inspectionDate ?? '');
  const [inspectionTime, setInspectionTime] = useState(request.inspectionTime ?? '');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleModalStep, setScheduleModalStep] = useState<ScheduleModalStep>('form');
  const [reportReady, setReportReady] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionReady, setDecisionReady] = useState(false);

  const inspectionScheduled = Boolean(request.inspectionDate);
  const inspectionReviewed = Boolean(request.inspectionReviewed);

  useEffect(() => {
    if (isBusinessFlow || !inspectionScheduled || inspectionReviewed) return;
    setReportReady(false);
    const timer = setTimeout(() => setReportReady(true), REPORT_READY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isBusinessFlow, inspectionScheduled, inspectionReviewed]);

  useEffect(() => {
    if (!showDecisionModal || decisionReady) return;
    const timer = setTimeout(() => {
      onUpdateRequest(request.id, { status: 'approved' });
      setDecisionReady(true);
    }, DECISION_DELAY_MS);
    return () => clearTimeout(timer);
  }, [showDecisionModal, decisionReady, request.id, onUpdateRequest]);

  useEffect(() => {
    if (request.corporateStage !== 'inspection-pending') return;
    const timer = setTimeout(() => {
      onUpdateRequest(request.id, { corporateStage: 'inspection-report' });
    }, INSPECTION_DELAY_MS);
    return () => clearTimeout(timer);
  }, [request.corporateStage, request.id, onUpdateRequest]);

  useEffect(() => {
    if (request.corporateStage !== 'processing') return;
    const timer = setTimeout(() => {
      const code = `DEL-${Math.floor(100000 + Math.random() * 900000)}`;
      onUpdateRequest(request.id, { corporateStage: 'delivery-code', deliveryCode: code });
    }, PROCESSING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [request.corporateStage, request.id, onUpdateRequest]);

  const priceValue = parsePrice(request.price);
  const eligibleAmount = Math.max(5_000_000, Math.ceil(priceValue / 500_000) * 500_000);
  const minEquity = Math.max(500_000, Math.round((priceValue * 0.1) / 50_000) * 50_000);
  const loanAmount = Math.max(priceValue - minEquity, 0);
  const totalInterest = Math.round(loanAmount * INTEREST_RATE_PA * (TENOR_MONTHS / 12));
  const monthlyRepayment = Math.round((loanAmount + totalInterest) / TENOR_MONTHS);
  const insurancePremium = Math.round(priceValue * INSURANCE_RATE);
  const totalPayable = loanAmount + totalInterest + insurancePremium + PROCESSING_FEE;

  const equityFunded = isBusinessFlow
    ? stageIndex(request.corporateStage) >= stageIndex('processing')
    : request.status === 'approved';
  const inspectionDone = isBusinessFlow
    ? stageIndex(request.corporateStage) >= stageIndex('offer-letter')
    : inspectionReviewed || request.status === 'approved';
  const reviewComplete = isBusinessFlow
    ? request.corporateStage === 'completed'
    : request.status !== 'pending';

  const carDetails = [
    { label: 'Car Make', value: request.make },
    { label: 'Car Type', value: `${request.make} ${request.model}` },
    { label: 'Car Condition', value: 'Pre - owned' },
    { label: 'Year of Manufacture', value: `${request.year}` },
    { label: 'Car Color', value: request.color },
    { label: 'Car Rating/Grade', value: gradeFor(request.mileage) },
    { label: 'VIN /Chasis number', value: vinFor(request) },
    { label: 'Car location(State)', value: parseState(request.location) },
  ];

  const vehicleCount = request.quantity && request.quantity > 1 ? request.quantity : 1;

  const customerActions = [
    { id: 'equity', label: `Fund your account with the equity contribution of ${formatNaira(minEquity)}`, done: equityFunded },
    {
      id: 'inspection',
      label: inspectionReviewed
        ? 'Vehicle inspection report reviewed'
        : inspectionScheduled
          ? `Review your inspection report (scheduled for ${new Date(request.inspectionDate!).toLocaleDateString()}, ${timeSlotLabels[request.inspectionTime!] ?? request.inspectionTime})`
          : 'Complete the mandatory vehicle inspection',
      done: inspectionDone,
    },
    { id: 'review', label: 'Awaiting final review and approval from Access Bank', done: reviewComplete },
  ];

  const notifications = [
    {
      id: 'received',
      text: `Your vehicle finance request for ${request.make} ${request.model} has been received and is under review.`,
      date: new Date(request.dateRequested),
    },
    isBusinessFlow
      ? { id: 'stage', text: corporateStageMessage(request), date: addDays(request.dateRequested, 1) }
      : request.status === 'pending'
        ? {
            id: 'in-review',
            text: 'Your documents are being reviewed by our credit team. This typically takes 2-3 business days.',
            date: addDays(request.dateRequested, 1),
          }
        : {
            id: 'decision',
            text: request.status === 'approved'
              ? 'Your request has been approved. You can now proceed to schedule your vehicle collection.'
              : 'Your request was not approved. Please contact support for more information.',
            date: addDays(request.dateRequested, 2),
          },
  ];

  const scheduleSummary = `${inspectionDate ? new Date(inspectionDate).toLocaleDateString() : ''} between ${timeSlotLabels[inspectionTime] ?? inspectionTime}`;

  return (
    <div className="vf-req">
      <button className="vf-req-back" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <div className="vf-req-title-row">
        <h1>{request.make} {request.model} - {request.year}</h1>
        <span className={`vf-status-badge ${request.status}`}>
          {request.status === 'approved' ? <CheckIcon /> : <ClockIcon />}
          {request.status === 'approved' ? 'Approved' : request.status === 'declined' ? 'Declined' : 'Pending'}
        </span>
        <button className="vf-req-notif-btn" onClick={() => setShowNotifications(true)}>
          <BellIcon />
          Request Notification
        </button>
      </div>

      <p className="vf-req-greeting">Hello {displayName},</p>
      <p className="vf-req-subtitle">Your Car Details by {request.dealer}</p>

      <JourneyProgress
        steps={isBusinessFlow ? BUSINESS_JOURNEY_STEPS : INDIVIDUAL_JOURNEY_STEPS}
        currentIndex={isBusinessFlow ? businessJourneyIndex(request.corporateStage) : individualJourneyIndex(request)}
        hasError={isBusinessFlow ? request.corporateStage === 'inspection-rejected' : request.status === 'declined'}
      />

      {(isBusinessFlow ? request.corporateStage === 'inspection-schedule' : request.status === 'pending' && !inspectionScheduled) ? (
        <div className="vf-req-grid">
          <div className="vf-req-main">
            {Array.from({ length: vehicleCount }, (_, i) => (
              <VehicleInfoCard
                key={i}
                title={vehicleCount > 1 ? `Vehicle ${i + 1} Information` : 'Vehicle Information'}
                carDetails={carDetails}
              />
            ))}
          </div>

          <div className="vf-req-side">
            <RepaymentCard
              eligibleAmount={eligibleAmount}
              loanAmount={loanAmount}
              monthlyRepayment={monthlyRepayment}
              isBusinessFlow={isBusinessFlow}
              insurancePremium={insurancePremium}
            />
            <EquityCard minEquity={minEquity} equityFunded={equityFunded} isBusinessFlow={isBusinessFlow} />

            <div className="vf-req-info-card">
              <h3 className="vf-req-info-title">Next Step</h3>
              <p className="vf-req-hint">Schedule your vehicle inspection to move this request forward.</p>
              <button
                className="vf-req-btn-primary"
                onClick={() => {
                  setScheduleModalStep('form');
                  setScheduleModalOpen(true);
                }}
              >
                Schedule Inspection
              </button>
            </div>

            {!isBusinessFlow && (
              <div className="vf-req-info-card">
                <h3 className="vf-req-info-title">Pending Customer Actions</h3>
                <ul className="vf-req-actions-list">
                  {customerActions.map((action) => (
                    <li key={action.id} className={`vf-req-action-item ${action.done ? 'done' : ''}`}>
                      <span className="vf-req-action-icon">{action.done ? <CheckIcon /> : <ClockIcon />}</span>
                      {action.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : isBusinessFlow && (request.corporateStage === 'inspection-pending' || request.corporateStage === 'inspection-report' || request.corporateStage === 'inspection-rejected') ? (
        <InspectionSection
          subStage={request.corporateStage}
          dealer={request.dealer}
          fileName={`Vehicle_Inspection_Report_${vinFor(request)}.pdf`}
          dateLabel={addDays(request.dateRequested, 2).toLocaleDateString()}
          checklist={inspectionChecklist}
          onReject={() => onUpdateRequest(request.id, { corporateStage: 'inspection-rejected' })}
          onAccept={() => onUpdateRequest(request.id, { corporateStage: 'offer-letter' })}
          onBackToRequests={onBack}
        />
      ) : isBusinessFlow && request.corporateStage === 'offer-letter' ? (
        <OfferLetterSection
          fileName={`Offer_Letter_${vinFor(request)}.pdf`}
          dealer={request.dealer}
          dateLabel={addDays(request.dateRequested, 3).toLocaleDateString()}
          totalPayableLabel={formatNaira(totalPayable)}
          onAccept={() => onUpdateRequest(request.id, { corporateStage: 'pin' })}
        />
      ) : isBusinessFlow && request.corporateStage === 'pin' ? (
        <PinSigningSection onSubmit={() => onUpdateRequest(request.id, { corporateStage: 'processing' })} />
      ) : isBusinessFlow && (request.corporateStage === 'processing' || request.corporateStage === 'delivery-code') ? (
        <ProcessingSection
          subStage={request.corporateStage}
          deliveryCode={request.deliveryCode}
          onVehicleCollected={() => onUpdateRequest(request.id, { corporateStage: 'completed', status: 'approved' })}
        />
      ) : isBusinessFlow && request.corporateStage === 'completed' ? (
        <CompletedSection />
      ) : !isBusinessFlow && inspectionScheduled && !inspectionReviewed ? (
        <IndividualInspectionSection
          reportReady={reportReady}
          dealer={request.dealer}
          fileName={`Vehicle_Inspection_Report_${vinFor(request)}.pdf`}
          dateLabel={inspectionDate ? new Date(inspectionDate).toLocaleDateString() : addDays(request.dateRequested, 2).toLocaleDateString()}
          checklist={inspectionChecklist}
          onAcknowledge={() => onUpdateRequest(request.id, { inspectionReviewed: true })}
        />
      ) : !isBusinessFlow ? (
        <DecisionSection
          status={request.status}
          make={request.make}
          model={request.model}
          decisionRequested={showDecisionModal}
          decisionReady={decisionReady}
          onViewDecision={() => {
            setDecisionReady(false);
            setShowDecisionModal(true);
          }}
        />
      ) : null}

      {scheduleModalOpen && scheduleModalStep === 'form' && (
        <div className="modal-overlay" onClick={() => setScheduleModalOpen(false)}>
          <div className="doc-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="doc-modal-close" onClick={() => setScheduleModalOpen(false)} aria-label="Close">
              <CloseIcon />
            </button>
            <h3 className="doc-modal-title">Schedule Vehicle Inspection</h3>
            <p className="doc-modal-subtitle">
              Choose a convenient date and time for {request.dealer} to inspect your {request.make} {request.model}.
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
                onUpdateRequest(request.id, {
                  ...(isBusinessFlow ? { corporateStage: 'inspection-pending' as const } : {}),
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
