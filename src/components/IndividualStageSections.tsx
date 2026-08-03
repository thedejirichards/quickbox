import { useState } from 'react';
import './BnplModal.css';
import './CorporateVehicleFinanceModal.css';
import './OfferLetterPage.css';

interface ChecklistItem {
  id: string;
  label: string;
  result: string;
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

interface IndividualInspectionSectionProps {
  reportReady: boolean;
  dealer: string;
  fileName: string;
  dateLabel: string;
  checklist: ChecklistItem[];
  onAcknowledge: () => void;
}

export function IndividualInspectionSection({
  reportReady,
  dealer,
  fileName,
  dateLabel,
  checklist,
  onAcknowledge,
}: IndividualInspectionSectionProps) {
  const [showChecklist, setShowChecklist] = useState(false);

  return (
    <div className="vf-req-info-card ol-section">
      <h3 className="vf-req-info-title">Inspection</h3>

      {!reportReady ? (
        <div className="bnpl-fetching">
          <div className="bnpl-spinner" />
          <h3>Awaiting your inspection report</h3>
        </div>
      ) : (
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
          <button className="vf-req-btn-primary cvf-action-btn" onClick={onAcknowledge}>
            <CheckIconWhite />
            Acknowledge Inspection Report
          </button>
        </div>
      )}
    </div>
  );
}

interface DecisionSectionProps {
  status: 'pending' | 'approved' | 'declined';
  make: string;
  model: string;
  decisionRequested: boolean;
  decisionReady: boolean;
  onViewDecision: () => void;
}

export function DecisionSection({ status, make, model, decisionRequested, decisionReady, onViewDecision }: DecisionSectionProps) {
  const revealed = status !== 'pending' || (decisionRequested && decisionReady);
  const approved = status === 'approved' || (status === 'pending' && decisionRequested && decisionReady);

  return (
    <div className="vf-req-info-card ol-section cvf-completed-card">
      {!decisionRequested && status === 'pending' && (
        <>
          <h3 className="vf-req-info-title">Review</h3>
          <p className="cvf-completed-text">
            Your inspection report has been reviewed. Continue to see Access Bank&apos;s decision on your request.
          </p>
          <button className="vf-req-btn-primary vf-req-btn-inline" onClick={onViewDecision}>
            View Decision
          </button>
        </>
      )}

      {decisionRequested && !decisionReady && (
        <div className="bnpl-fetching">
          <div className="bnpl-spinner" />
          <h3>Reviewing your request</h3>
        </div>
      )}

      {revealed && (
        <>
          <div className="cvf-completed-icon">
            {approved ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
          </div>
          <h3 className="vf-req-info-title">{approved ? 'Request Approved' : 'Request Not Approved'}</h3>
          <p className="cvf-completed-text">
            {approved
              ? `Congratulations! Your vehicle finance request for the ${make} ${model} has been approved. You can now proceed to schedule your vehicle collection.`
              : 'Your request was not approved. Please contact support for more information.'}
          </p>
        </>
      )}
    </div>
  );
}
