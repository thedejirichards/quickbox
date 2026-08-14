import { useState } from 'react';
import './CorporateVehicleFinanceModal.css';
import './OfferLetterPage.css';
import OfferLetterDocument from './OfferLetterDocument';
import { OFFER_LETTER_TEXT } from './offerLetterContent';

interface OfferLetterSectionProps {
  fileName: string;
  dealer: string;
  dateLabel: string;
  totalPayableLabel: string;
  onAccept: () => void;
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

function EyeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function downloadOfferLetter(fileName: string) {
  const blob = new Blob([OFFER_LETTER_TEXT], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.replace(/\.pdf$/i, '.txt');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function OfferLetterSection({ fileName, dealer, dateLabel, totalPayableLabel, onAccept }: OfferLetterSectionProps) {
  const [showViewer, setShowViewer] = useState(false);

  return (
    <div className="vf-req-info-card ol-section">
      <div className="vf-req-info-title-row">
        <h3 className="vf-req-info-title">Offer Letter</h3>
        <span className="vf-status-badge pending">Pending Acceptance</span>
      </div>

      <div className="ol-doc-card">
        <span className="cvf-report-icon"><DocumentIcon /></span>
        <div className="cvf-report-file">
          <span className="cvf-report-name">{fileName}</span>
          <span className="cvf-report-file-meta">Issued by {dealer} on {dateLabel}</span>
        </div>
        <span className="cvf-report-badge"><CheckIcon />Ready</span>
        <div className="ol-doc-actions">
          <button type="button" className="ol-icon-btn" onClick={() => setShowViewer(true)} aria-label="View document">
            <EyeIcon />
          </button>
          <button type="button" className="ol-icon-btn" onClick={() => downloadOfferLetter(fileName)} aria-label="Download document">
            <DownloadIcon />
          </button>
        </div>
      </div>

      <div className="cvf-quotation-row cvf-quotation-total">
        <span>Total Payable</span>
        <strong>{totalPayableLabel}</strong>
      </div>
      <p className="vf-req-hint">
        Review the Repayment Information above alongside the insurance premium and processing fee before accepting.
      </p>

      <button className="vf-req-btn-primary cvf-action-btn vf-req-btn-fit vf-req-btn-end" onClick={onAccept}>
        <CheckIconWhite />
        Accept Offer Letter
      </button>

      {showViewer && (
        <div className="ol-viewer-overlay" onClick={() => setShowViewer(false)}>
          <div className="ol-viewer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="ol-viewer-header">
              <span className="ol-viewer-title">{fileName}</span>
              <div className="ol-viewer-header-actions">
                <button type="button" className="ol-icon-btn" onClick={() => downloadOfferLetter(fileName)} aria-label="Download document">
                  <DownloadIcon />
                </button>
                <button type="button" className="ol-icon-btn" onClick={() => setShowViewer(false)} aria-label="Close">
                  <CloseIcon />
                </button>
              </div>
            </div>
            <div className="ol-viewer-body">
              <OfferLetterDocument />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
