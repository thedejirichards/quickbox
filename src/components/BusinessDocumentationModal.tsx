import { useState } from 'react';
import TransferOwnershipAttestation from './TransferOwnershipAttestation';
import DocumentAttestation from './DocumentAttestation';
import { idTypeLabels, lookupBusinessDirectorRecords } from './bankIdRecords';

export interface BusinessDocumentationData {
  attestations: Record<string, boolean>;
  businessRegistrationFileName: string;
  transferOwnershipAttested: boolean;
}

interface BusinessDocumentationModalProps {
  onClose: () => void;
  onSubmit: (data: BusinessDocumentationData) => void;
  displayName: string;
  initialData?: BusinessDocumentationData | null;
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

type Step = 'documents' | 'directors' | 'confirm' | 'submitting' | 'success';

interface BusinessDocument {
  key: string;
  title: string;
  attestationText: string;
  details: string[];
}

const businessDocuments: BusinessDocument[] = [
  {
    key: 'board-resolution',
    title: 'Simple Resolution/Board Resolution',
    attestationText: 'I attest that a duly executed Board Resolution for this facility is available',
    details: [
      'A resolution passed by the board of directors authorizing the company to obtain the facility and pledge the financed vehicle(s) as collateral.',
      'The resolution must be signed by all directors and the company secretary, and dated within the last 12 months.',
    ],
  },
  {
    key: 'personal-guarantee',
    title: 'Personal guarantee and notarized statement of net worth of a director',
    attestationText: 'I attest that a signed personal guarantee and notarized net worth statement is available',
    details: [
      'A signed personal guarantee from a director of the company, undertaking to personally guarantee repayment of the facility.',
      'Accompanied by a notarized statement of the net worth of that director.',
    ],
  },
  {
    key: 'domiciliation-letter',
    title: 'Letter of irrevocable domiciliation of sales proceeds',
    attestationText: 'I attest that the Letter of Irrevocable Domiciliation is available',
    details: [
      "A letter irrevocably instructing that proceeds from the company's sales be domiciled with Access Bank for the duration of the facility.",
      'Must be duly executed by an authorized signatory of the company.',
    ],
  },
];

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

export default function BusinessDocumentationModal({ onClose, onSubmit, displayName, initialData, readOnly = false }: BusinessDocumentationModalProps) {
  const [step, setStep] = useState<Step>('documents');
  const [attestations, setAttestations] = useState<Record<string, boolean>>(initialData?.attestations ?? {});
  const [businessRegistrationFileName, setBusinessRegistrationFileName] = useState(initialData?.businessRegistrationFileName ?? '');
  const [transferOwnershipAttested, setTransferOwnershipAttested] = useState(initialData?.transferOwnershipAttested ?? false);
  const [error, setError] = useState('');

  const directors = lookupBusinessDirectorRecords(displayName);

  const allDocsUploaded = businessDocuments.every((doc) => attestations[doc.key])
    && !!businessRegistrationFileName
    && transferOwnershipAttested;

  const handleDocumentsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allDocsUploaded) {
      setError('Please attach all required documents.');
      return;
    }
    setError('');
    setStep('directors');
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
            <div className="doc-upload-group">
              <label className="doc-field-label">
                Certificate of business registration <span className="doc-required">*</span>
              </label>
              <div className={`doc-upload-box readonly ${businessRegistrationFileName ? 'filled' : ''}`}>
                <span className="doc-upload-icon"><AttachIcon /></span>
                <span className="doc-upload-text">{businessRegistrationFileName}</span>
              </div>
            </div>

            {businessDocuments.map((doc) => (
              <DocumentAttestation
                key={doc.key}
                fieldLabel={doc.title}
                attestationText={doc.attestationText}
                accordionTitle={doc.title.toUpperCase()}
                checked={attestations[doc.key] ?? false}
                onChange={() => {}}
                readOnly
              >
                {doc.details.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </DocumentAttestation>
            ))}

            <TransferOwnershipAttestation checked={transferOwnershipAttested} onChange={() => {}} readOnly />

            <h4 className="doc-section-heading">Government issued ID for all directors</h4>

            {directors.map((director) => {
              const info = idTypeLabels[director.idType];
              return (
                <div key={director.name} className="doc-director-block">
                  <div className="doc-director-heading">{director.name}</div>
                  <div className="doc-field-group">
                    <label className="doc-field-label">Type of ID</label>
                    <input type="text" value={info?.label ?? director.idType} readOnly disabled />
                  </div>
                  <div className="doc-field-group">
                    <label className="doc-field-label">{info?.fieldLabel ?? 'ID Number'}</label>
                    <input type="text" value={director.idNumber} readOnly disabled />
                  </div>
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
            <div className="doc-upload-group">
              <label className="doc-field-label">
                Certificate of business registration <span className="doc-required">*</span>
              </label>
              <label className={`doc-upload-box ${businessRegistrationFileName ? 'filled' : ''}`}>
                <span className="doc-upload-icon"><AttachIcon /></span>
                <span className="doc-upload-text">{businessRegistrationFileName || 'Click to attach a file'}</span>
                {businessRegistrationFileName && (
                  <button
                    type="button"
                    className="doc-remove-btn"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBusinessRegistrationFileName(''); }}
                    aria-label="Remove file"
                  >
                    <TrashIcon />
                  </button>
                )}
                <input
                  type="file"
                  hidden
                  onChange={(e) => { setBusinessRegistrationFileName(e.target.files?.[0]?.name ?? ''); setError(''); }}
                />
              </label>
            </div>

            {businessDocuments.map((doc) => (
              <DocumentAttestation
                key={doc.key}
                fieldLabel={doc.title}
                attestationText={doc.attestationText}
                accordionTitle={doc.title.toUpperCase()}
                checked={attestations[doc.key] ?? false}
                onChange={(checked) => {
                  setAttestations((prev) => ({ ...prev, [doc.key]: checked }));
                  setError('');
                }}
              >
                {doc.details.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </DocumentAttestation>
            ))}

            <TransferOwnershipAttestation
              checked={transferOwnershipAttested}
              onChange={(checked) => { setTransferOwnershipAttested(checked); setError(''); }}
            />

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
          <h4 className="doc-section-heading">Government issued ID for all directors</h4>
          <p className="doc-field-hint">Retrieved from your records on file with the bank.</p>

          <div className="doc-modal-form">
            {directors.map((director) => {
              const info = idTypeLabels[director.idType];
              return (
                <div key={director.name} className="doc-director-block">
                  <div className="doc-director-heading">{director.name}</div>
                  <div className="doc-field-group">
                    <label className="doc-field-label">Type of ID</label>
                    <input type="text" value={info?.label ?? director.idType} readOnly disabled />
                  </div>
                  <div className="doc-field-group">
                    <label className="doc-field-label">{info?.fieldLabel ?? 'ID Number'}</label>
                    <input type="text" value={director.idNumber} readOnly disabled />
                  </div>
                </div>
              );
            })}

            <button type="button" className="doc-submit-btn" onClick={() => setStep('confirm')}>
              Save &amp; Proceed
            </button>
            <button type="button" className="doc-previous-btn" onClick={() => setStep('documents')}>
              Previous
            </button>
          </div>
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
        <button className="modal-button" onClick={() => onSubmit({ attestations, businessRegistrationFileName, transferOwnershipAttested })}>RETURN</button>
      </div>
    </div>
  );
}
