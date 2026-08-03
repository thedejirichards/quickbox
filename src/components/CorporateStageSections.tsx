import { useState } from 'react';
import './BnplModal.css';
import './CorporateVehicleFinanceModal.css';
import './OfferLetterPage.css';

type InspectionSubStage = 'inspection-pending' | 'inspection-report' | 'inspection-rejected';

interface ChecklistItem {
  id: string;
  label: string;
  result: string;
}

interface InspectionSectionProps {
  subStage: InspectionSubStage;
  dealer: string;
  fileName: string;
  dateLabel: string;
  checklist: ChecklistItem[];
  onReject: () => void;
  onAccept: () => void;
  onBackToRequests: () => void;
}

function DocumentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CheckIconWhite() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}

export function InspectionSection({
  subStage,
  dealer,
  fileName,
  dateLabel,
  checklist,
  onReject,
  onAccept,
  onBackToRequests,
}: InspectionSectionProps) {
  const [showChecklist, setShowChecklist] = useState(false);

  return (
    <div className="vf-req-info-card ol-section">
      <h3 className="vf-req-info-title">Inspection</h3>

      {subStage === 'inspection-pending' && (
        <div className="bnpl-fetching">
          <div className="bnpl-spinner" />
          <h3>Vendor is conducting the inspection</h3>
        </div>
      )}

      {subStage === 'inspection-report' && (
        <div className="cvf-inspection">
          <div className="cvf-report-card">
            <span className="cvf-report-icon"><DocumentIcon /></span>
            <div className="cvf-report-file">
              <span className="cvf-report-name">{fileName}</span>
              <span className="cvf-report-file-meta">Submitted by {dealer} on {dateLabel}</span>
            </div>
            <span className="cvf-report-badge"><CheckIcon />Verified</span>
          </div>
          <button
            type="button"
            className={`cvf-report-toggle ${showChecklist ? 'open' : ''}`}
            onClick={() => setShowChecklist((v) => !v)}
          >
            {showChecklist ? 'Hide report summary' : 'View report summary'}
            <ChevronIcon />
          </button>
          {showChecklist && (
            <ul className="cvf-checklist">
              {checklist.map((item) => {
                const isMinor = item.result.toLowerCase().includes('minor');
                return (
                  <li key={item.id}>
                    <span className={`cvf-checklist-icon ${isMinor ? 'warn' : ''}`}>
                      {isMinor ? <AlertTriangleIcon /> : <CheckIcon />}
                    </span>
                    <span className="cvf-checklist-label">{item.label}</span>
                    <span className={`cvf-checklist-result ${isMinor ? 'warn' : ''}`}>{item.result}</span>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="vf-req-btn-row">
            <button className="vf-req-btn-secondary cvf-action-btn reject" onClick={onReject}>
              <XIcon />
              Reject
            </button>
            <button className="vf-req-btn-primary cvf-action-btn" onClick={onAccept}>
              <CheckIconWhite />
              Accept
            </button>
          </div>
        </div>
      )}

      {subStage === 'inspection-rejected' && (
        <div className="cvf-rejected">
          <p>
            Your vehicle inspection was not accepted, so this request cannot proceed. Please submit a new
            request for a different vehicle from the Vendor Marketplace.
          </p>
          <button className="vf-req-btn-primary" onClick={onBackToRequests}>
            Back to Requests
          </button>
        </div>
      )}
    </div>
  );
}

interface PinSigningSectionProps {
  onSubmit: (pin: string) => void;
}

export function PinSigningSection({ onSubmit }: PinSigningSectionProps) {
  const [pin, setPin] = useState('');

  return (
    <div className="vf-req-info-card ol-section">
      <h3 className="vf-req-info-title">Offer &amp; Signing</h3>
      <form
        className="cvf-pin-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(pin);
        }}
      >
        <p className="cvf-pin-text">Enter your 4-digit token to digitally sign the Offer Letter.</p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          className="cvf-pin-input"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
          required
        />
        <button type="submit" className="vf-req-btn-primary" disabled={pin.length !== 4}>Confirm &amp; Sign</button>
      </form>
    </div>
  );
}

interface ProcessingSectionProps {
  subStage: 'processing' | 'delivery-code';
  deliveryCode?: string;
  onVehicleCollected: () => void;
}

export function ProcessingSection({ subStage, deliveryCode, onVehicleCollected }: ProcessingSectionProps) {
  return (
    <div className="vf-req-info-card ol-section">
      <h3 className="vf-req-info-title">Processing</h3>

      {subStage === 'processing' && (
        <div className="bnpl-fetching">
          <div className="bnpl-spinner" />
          <h3>Processing equity, insurance &amp; fees</h3>
        </div>
      )}

      {subStage === 'delivery-code' && (
        <div className="cvf-delivery">
          <p className="cvf-delivery-label">Delivery Code</p>
          <div className="cvf-delivery-code">{deliveryCode}</div>
          <p className="cvf-delivery-hint">
            Share this code with the vendor when you collect the vehicle, or when it is delivered to you. The
            vendor will validate this code to release the vehicle.
          </p>
          <button className="vf-req-btn-primary" onClick={onVehicleCollected}>
            Vehicle Collected / Delivered
          </button>
        </div>
      )}
    </div>
  );
}

export function CompletedSection() {
  return (
    <div className="vf-req-info-card ol-section cvf-completed-card">
      <div className="cvf-completed-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3 className="vf-req-info-title">Financing Completed</h3>
      <p className="cvf-completed-text">
        The vendor has validated your delivery code and submitted the original vehicle documents to the Bank.
        Your insurance certificate has been sent to your registered email. This financing request is now
        complete.
      </p>
    </div>
  );
}
