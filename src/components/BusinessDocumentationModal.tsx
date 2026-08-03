import { useState } from 'react';

export interface BusinessDocumentationData {
  files: Record<string, string>;
  directorIds: number[];
  directorIdTypes: Record<number, string>;
  directorIdNumbers: Record<number, string>;
}

interface BusinessDocumentationModalProps {
  onClose: () => void;
  onSubmit: (data: BusinessDocumentationData) => void;
  initialData?: BusinessDocumentationData | null;
  readOnly?: boolean;
}

type Step = 'documents' | 'directors' | 'confirm' | 'submitting' | 'success';

interface BusinessDocument {
  key: string;
  title: string;
}

const businessDocuments: BusinessDocument[] = [
  { key: 'board-resolution', title: 'Simple Resolution/Board Resolution' },
  { key: 'business-registration', title: 'Certificate of business registration' },
  { key: 'personal-guarantee', title: 'Personal guarantee and notarized statement of net worth of a director' },
  { key: 'domiciliation-letter', title: 'Letter of irrevocable domiciliation of sales proceeds' },
  { key: 'blank-transfer', title: 'Blank transfer of ownership' },
];

const idTypeOptions = [
  { value: 'nin', label: 'National Identity Number (NIN)', fieldLabel: 'NIN', placeholder: 'Enter NIN' },
  { value: 'passport', label: 'International Passport', fieldLabel: 'Passport Number', placeholder: 'Enter passport number' },
  { value: 'drivers-license', label: "Driver's License", fieldLabel: "Driver's License Number", placeholder: "Enter driver's license number" },
  { value: 'voters-card', label: "Voter's Card", fieldLabel: "Voter's Card Number", placeholder: "Enter voter's card number" },
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

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="11" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button type="button" className="doc-modal-close" onClick={onClose} aria-label="Close">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}

export default function BusinessDocumentationModal({ onClose, onSubmit, initialData, readOnly = false }: BusinessDocumentationModalProps) {
  const [step, setStep] = useState<Step>('documents');
  const [files, setFiles] = useState<Record<string, string>>(initialData?.files ?? {});
  const [directorIds, setDirectorIds] = useState<number[]>(initialData?.directorIds ?? [1]);
  const [directorIdTypes, setDirectorIdTypes] = useState<Record<number, string>>(initialData?.directorIdTypes ?? {});
  const [directorIdNumbers, setDirectorIdNumbers] = useState<Record<number, string>>(initialData?.directorIdNumbers ?? {});
  const [error, setError] = useState('');

  const allDocsUploaded = businessDocuments.every((doc) => files[doc.key]);
  const allDirectorIdsSet = directorIds.every((id) => directorIdTypes[id] && directorIdNumbers[id]);

  const handleFileChange = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file?.name ?? '' }));
    setError('');
  };

  const addDirector = () => {
    setDirectorIds((prev) => [...prev, (prev.length ? Math.max(...prev) : 0) + 1]);
  };

  const removeDirector = (id: number) => {
    setDirectorIds((prev) => prev.filter((d) => d !== id));
    setDirectorIdTypes((prev) => { const next = { ...prev }; delete next[id]; return next; });
    setDirectorIdNumbers((prev) => { const next = { ...prev }; delete next[id]; return next; });
  };

  const handleDocumentsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allDocsUploaded) {
      setError('Please attach all required documents.');
      return;
    }
    setError('');
    setStep('directors');
  };

  const handleDirectorsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allDirectorIdsSet) {
      setError('Please provide an ID type and number for each director.');
      return;
    }
    setError('');
    setStep('confirm');
  };

  const handleConfirmYes = () => {
    setStep('submitting');
    setTimeout(() => setStep('success'), 1800);
  };

  if (readOnly) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="doc-modal-card" onClick={(e) => e.stopPropagation()}>
          <CloseButton onClose={onClose} />
          <h3 className="doc-modal-title">Business Documentation</h3>
          <p className="doc-modal-subtitle">Here is a summary of the documents you submitted.</p>

          <div className="doc-modal-form">
            {businessDocuments.map((doc) => (
              <div key={doc.key} className="doc-upload-group">
                <label className="doc-field-label">{doc.title}</label>
                <div className="doc-upload-box readonly filled">
                  <span className="doc-upload-icon"><AttachIcon /></span>
                  <span className="doc-upload-text">{files[doc.key]}</span>
                </div>
              </div>
            ))}

            <h4 className="doc-section-heading">Copy of government issued ID for all directors</h4>

            {(initialData?.directorIds ?? []).map((id, i) => {
              const selectedType = idTypeOptions.find((opt) => opt.value === directorIdTypes[id]);
              return (
                <div key={id} className="doc-director-block">
                  <div className="doc-director-heading">Director {i + 1}</div>
                  <div className="doc-field-group">
                    <label className="doc-field-label">Type of ID</label>
                    <select value={directorIdTypes[id] ?? ''} disabled>
                      <option value="">&mdash;</option>
                      {idTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  {selectedType && (
                    <div className="doc-field-group">
                      <label className="doc-field-label">{selectedType.fieldLabel}</label>
                      <input type="text" value={directorIdNumbers[id] ?? ''} readOnly disabled />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'documents') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="doc-modal-card" onClick={(e) => e.stopPropagation()}>
          <CloseButton onClose={onClose} />
          <h3 className="doc-modal-title">Business Documentation</h3>
          <p className="doc-modal-subtitle">Please submit the following required documents for Vehicle Finance</p>

          <form onSubmit={handleDocumentsSubmit} className="doc-modal-form">
            {businessDocuments.map((doc) => (
              <div key={doc.key} className="doc-upload-group">
                <label className="doc-field-label">
                  {doc.title} <span className="doc-required">*</span>
                  <span className="doc-info-icon" title={doc.title}><InfoIcon /></span>
                </label>
                <label className={`doc-upload-box ${files[doc.key] ? 'filled' : ''}`}>
                  <span className="doc-upload-icon"><AttachIcon /></span>
                  <span className="doc-upload-text">{files[doc.key] || 'Click to attach a file'}</span>
                  {files[doc.key] && (
                    <button
                      type="button"
                      className="doc-remove-btn"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleFileChange(doc.key, null); }}
                      aria-label="Remove file"
                    >
                      <TrashIcon />
                    </button>
                  )}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleFileChange(doc.key, e.target.files?.[0] ?? null)}
                  />
                </label>
                <a href="#" className="doc-template-link" onClick={(e) => e.preventDefault()}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5" />
                    <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                  </svg>
                  Download Template
                </a>
              </div>
            ))}

            {error && <p className="otp-error">{error}</p>}

            <button type="submit" className="doc-submit-btn" disabled={!allDocsUploaded}>
              Save &amp; Proceed
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'directors') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="doc-modal-card" onClick={(e) => e.stopPropagation()}>
          <CloseButton onClose={onClose} />
          <h3 className="doc-modal-title">Business Documentation</h3>
          <p className="doc-modal-subtitle">Please submit the following required documents for Vehicle Finance</p>
          <h4 className="doc-section-heading">Copy of government issued ID for all directors</h4>

          <form onSubmit={handleDirectorsSubmit} className="doc-modal-form">
            {directorIds.map((id, i) => {
              const selectedType = idTypeOptions.find((opt) => opt.value === directorIdTypes[id]);
              return (
                <div key={id} className="doc-director-block">
                  <div className="doc-director-heading-row">
                    <div className="doc-director-heading">Director {i + 1}</div>
                    {directorIds.length > 1 && (
                      <button
                        type="button"
                        className="doc-remove-director-btn"
                        onClick={() => removeDirector(id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="doc-field-group">
                    <label className="doc-field-label" htmlFor={`director-id-type-${id}`}>
                      Type of ID <span className="doc-required">*</span>
                    </label>
                    <select
                      id={`director-id-type-${id}`}
                      value={directorIdTypes[id] ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDirectorIdTypes((prev) => ({ ...prev, [id]: value }));
                        setDirectorIdNumbers((prev) => ({ ...prev, [id]: '' }));
                        setError('');
                      }}
                      required
                    >
                      <option value="">Pick an option</option>
                      {idTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {selectedType && (
                    <div className="doc-field-group">
                      <label className="doc-field-label" htmlFor={`director-id-number-${id}`}>
                        {selectedType.fieldLabel} <span className="doc-required">*</span>
                      </label>
                      <input
                        id={`director-id-number-${id}`}
                        type="text"
                        placeholder={selectedType.placeholder}
                        value={directorIdNumbers[id] ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDirectorIdNumbers((prev) => ({ ...prev, [id]: value }));
                          setError('');
                        }}
                        required
                      />
                    </div>
                  )}
                </div>
              );
            })}

            <button type="button" className="doc-add-director-btn" onClick={addDirector}>
              <PlusIcon />
              Add Director
            </button>

            {error && <p className="otp-error">{error}</p>}

            <button type="submit" className="doc-submit-btn">Save &amp; Proceed</button>
            <button type="button" className="doc-previous-btn" onClick={() => setStep('documents')}>
              Previous
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <CloseButton onClose={onClose} />
          <div className="modal-icon success">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="11" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <h3>Are you sure you want to submit?</h3>
          <p>Kindly ensure that all the provided information and documents are valid.</p>
          <button className="modal-button" onClick={handleConfirmYes}>YES</button>
          <button className="modal-button-outline" onClick={() => setStep('directors')}>NO</button>
        </div>
      </div>
    );
  }

  if (step === 'submitting') {
    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <CloseButton onClose={onClose} />
          <div className="doc-spinner" />
          <h3>Submitting documents</h3>
          <p>Please wait while we submit your documents for processing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <CloseButton onClose={onClose} />
        <div className="modal-icon success">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3>Documents submitted successfully</h3>
        <p>
          Your prequalification documents are currently undergoing review. You will be notified once
          they have been approved and then you can proceed to request for Vehicle Finance
        </p>
        <button className="modal-button" onClick={() => onSubmit({ files, directorIds, directorIdTypes, directorIdNumbers })}>RETURN</button>
      </div>
    </div>
  );
}
