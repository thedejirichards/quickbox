import { useState } from 'react';

export interface DocumentationData {
  transferFileName: string;
  staffIdFileName: string;
  idType: string;
  idNumber: string;
}

interface PersonalDocumentationModalProps {
  onClose: () => void;
  onSubmit: (data: DocumentationData) => void;
  initialData?: DocumentationData | null;
  readOnly?: boolean;
}

const idTypeOptions = [
  { value: 'nin', label: 'National Identity Number (NIN)', fieldLabel: 'NIN', placeholder: 'Enter your NIN' },
  { value: 'passport', label: 'International Passport', fieldLabel: 'Passport Number', placeholder: 'Enter your passport number' },
  { value: 'drivers-license', label: "Driver's License", fieldLabel: "Driver's License Number", placeholder: "Enter your driver's license number" },
  { value: 'voters-card', label: "Voter's Card", fieldLabel: "Voter's Card Number", placeholder: "Enter your voter's card number" },
];

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

export default function PersonalDocumentationModal({ onClose, onSubmit, initialData, readOnly = false }: PersonalDocumentationModalProps) {
  const [transferFileName, setTransferFileName] = useState(initialData?.transferFileName ?? '');
  const [staffIdFileName, setStaffIdFileName] = useState(initialData?.staffIdFileName ?? '');
  const [idType, setIdType] = useState(initialData?.idType ?? '');
  const [idNumber, setIdNumber] = useState(initialData?.idNumber ?? '');
  const [error, setError] = useState('');

  const selectedIdType = idTypeOptions.find((opt) => opt.value === idType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    setError('');

    if (!transferFileName || !staffIdFileName || !idType || !idNumber) {
      setError('Please complete all required fields.');
      return;
    }

    onSubmit({ transferFileName, staffIdFileName, idType, idNumber });
  };

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
          <div className="doc-upload-group">
            <label className="doc-field-label">
              Blank transfer of ownership <span className="doc-required">*</span>
              <span className="doc-info-icon" title="A signed blank transfer of ownership form is required">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="11" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </span>
            </label>
            {readOnly ? (
              <div className={`doc-upload-box readonly ${transferFileName ? 'filled' : ''}`}>
                <span className="doc-upload-icon"><AttachIcon /></span>
                <span className="doc-upload-text">{transferFileName}</span>
              </div>
            ) : (
              <label className={`doc-upload-box ${transferFileName ? 'filled' : ''}`}>
                <span className="doc-upload-icon"><AttachIcon /></span>
                <span className="doc-upload-text">{transferFileName || 'Click to attach a file'}</span>
                {transferFileName && (
                  <button
                    type="button"
                    className="doc-remove-btn"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTransferFileName(''); }}
                    aria-label="Remove file"
                  >
                    <TrashIcon />
                  </button>
                )}
                <input
                  type="file"
                  hidden
                  onChange={(e) => { setTransferFileName(e.target.files?.[0]?.name ?? ''); setError(''); }}
                />
              </label>
            )}
            {!readOnly && (
              <a href="#" className="doc-template-link" onClick={(e) => e.preventDefault()}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5" />
                  <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                </svg>
                Download Template
              </a>
            )}
          </div>

          <div className="doc-upload-group">
            <label className="doc-field-label">
              Staff ID / Confirmation or Promotion Letter <span className="doc-required">*</span>
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

          <div className="doc-field-group">
            <label className="doc-field-label" htmlFor="doc-id-type">
              Type of ID <span className="doc-required">*</span>
            </label>
            <select
              id="doc-id-type"
              value={idType}
              disabled={readOnly}
              onChange={(e) => { setIdType(e.target.value); setIdNumber(''); setError(''); }}
              required
            >
              <option value="">Select ID type</option>
              {idTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {selectedIdType && (
            <div className="doc-field-group">
              <label className="doc-field-label" htmlFor="doc-id-number">
                {selectedIdType.fieldLabel} <span className="doc-required">*</span>
              </label>
              <input
                id="doc-id-number"
                type="text"
                placeholder={selectedIdType.placeholder}
                value={idNumber}
                readOnly={readOnly}
                disabled={readOnly}
                onChange={(e) => { setIdNumber(e.target.value); setError(''); }}
                required
              />
            </div>
          )}

          {error && <p className="otp-error">{error}</p>}

          {!readOnly && <button type="submit" className="doc-submit-btn">Save &amp; Proceed</button>}
        </form>
      </div>
    </div>
  );
}
