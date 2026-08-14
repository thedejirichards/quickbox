import { useState } from 'react';
import TransferOwnershipAttestation from './TransferOwnershipAttestation';
import { idTypeLabels, lookupIndividualIdRecord } from './bankIdRecords';

export interface DocumentationData {
  transferOwnershipAttested: boolean;
  staffIdFileName: string;
  idType: string;
  idNumber: string;
}

interface PersonalDocumentationModalProps {
  onClose: () => void;
  onSubmit: (data: DocumentationData) => void;
  displayName: string;
  initialData?: DocumentationData | null;
  readOnly?: boolean;
}

function AttachIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

type Step = 'form' | 'confirm' | 'success';

export default function PersonalDocumentationModal({ onClose, onSubmit, displayName, initialData, readOnly = false }: PersonalDocumentationModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [transferOwnershipAttested, setTransferOwnershipAttested] = useState(initialData?.transferOwnershipAttested ?? false);
  const [staffIdFileName, setStaffIdFileName] = useState(initialData?.staffIdFileName ?? '');
  const [error, setError] = useState('');

  const bankRecord = lookupIndividualIdRecord(displayName);
  const idType = initialData?.idType ?? bankRecord?.idType ?? '';
  const idNumber = initialData?.idNumber ?? bankRecord?.idNumber ?? '';
  const idTypeInfo = idTypeLabels[idType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    setError('');

    if (!transferOwnershipAttested || !staffIdFileName || !idType || !idNumber) {
      setError('Please complete all required fields.');
      return;
    }

    setStep('confirm');
  };

  if (step === 'confirm') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-icon warning">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
            </svg>
          </div>
          <h3>Confirm Submission</h3>
          <p>
            You're about to submit your blank transfer of ownership, staff ID, and {idTypeInfo?.fieldLabel ?? 'ID'} for review. Do you want to proceed?
          </p>
          <button
            className="modal-button"
            onClick={() => {
              onSubmit({ transferOwnershipAttested, staffIdFileName, idType, idNumber });
              setStep('success');
            }}
          >
            Confirm &amp; Submit
          </button>
          <button className="modal-button-outline" onClick={() => setStep('form')}>Back</button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-icon success">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3>Documentation Submitted</h3>
          <p>Your documents have been submitted for review. You'll be notified once they're approved.</p>
          <button className="modal-button" onClick={onClose}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="doc-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="doc-modal-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h3 className="doc-modal-title">Personal Documentation</h3>
        <p className="doc-modal-subtitle">
          {readOnly
            ? 'Here is a summary of the documents you submitted.'
            : 'Kindly ensure that all the provided information and documents are valid.'}
        </p>

        <form onSubmit={handleSubmit} className="doc-modal-form">
          <TransferOwnershipAttestation
            checked={transferOwnershipAttested}
            onChange={(checked) => { setTransferOwnershipAttested(checked); setError(''); }}
            readOnly={readOnly}
          />

          <div className="doc-upload-group">
            <label className="doc-field-label">
              Proof of employment <span className="doc-required">*</span>
            </label>
            {readOnly ? (
              <div className={`doc-upload-box readonly ${staffIdFileName ? 'filled' : ''}`}>
                <span className="doc-upload-icon"><AttachIcon /></span>
                <span className="doc-upload-text">{staffIdFileName}</span>
              </div>
            ) : (
              <label className={`doc-upload-box ${staffIdFileName ? 'filled' : ''}`}>
                <span className="doc-upload-icon"><AttachIcon /></span>
                <span className="doc-upload-text">{staffIdFileName || 'Click to attach a file'}</span>
                {staffIdFileName && (
                  <button
                    type="button"
                    className="doc-remove-btn"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStaffIdFileName(''); }}
                    aria-label="Remove file"
                  >
                    <TrashIcon />
                  </button>
                )}
                <input
                  type="file"
                  hidden
                  onChange={(e) => { setStaffIdFileName(e.target.files?.[0]?.name ?? ''); setError(''); }}
                />
              </label>
            )}
          </div>

          <h4 className="doc-section-heading">Government issued ID</h4>
          <p className="doc-field-hint">Retrieved from your records on file with the bank.</p>

          <div className="doc-field-group">
            <label className="doc-field-label" htmlFor="doc-id-type">Type of ID</label>
            <input id="doc-id-type" type="text" value={idTypeInfo?.label ?? 'Not on file'} readOnly disabled />
          </div>

          {idTypeInfo && (
            <div className="doc-field-group">
              <label className="doc-field-label" htmlFor="doc-id-number">{idTypeInfo.fieldLabel}</label>
              <input id="doc-id-number" type="text" value={idNumber} readOnly disabled />
            </div>
          )}

          {error && <p className="otp-error">{error}</p>}

          {!readOnly && <button type="submit" className="doc-submit-btn">Save &amp; Proceed</button>}
        </form>
      </div>
    </div>
  );
}
