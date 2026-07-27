import { useState } from 'react';

interface KybDocumentUploadProps {
  onBack: () => void;
  onSubmit: () => void;
}

interface DocumentSpec {
  key: string;
  title: string;
  description: string;
}

const requiredDocuments: DocumentSpec[] = [
  { key: 'certificate', title: 'Certificate of Incorporation', description: 'CAC certificate of incorporation for the business.' },
  { key: 'memart', title: 'Memorandum & Articles of Association', description: 'CAC status report or MEMART document.' },
  { key: 'director-id', title: "Director 1's Valid ID", description: 'National ID, international passport, or driver\'s license.' },
  { key: 'address-proof', title: 'Proof of Business Address', description: 'Utility bill dated within the last 3 months.' },
  { key: 'tin-certificate', title: 'Tax Identification Number (TIN) Certificate', description: 'Certificate issued by FIRS.' },
];

export default function KybDocumentUpload({ onBack, onSubmit }: KybDocumentUploadProps) {
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [error, setError] = useState('');

  const handleFileChange = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const missing = requiredDocuments.some((doc) => !files[doc.key]);
    if (missing) {
      setError('Please upload all required documents.');
      return;
    }

    onSubmit();
  };

  return (
    <div className="kyc-info-page">
      <div className="bvn-content">
        <div className="bvn-header">
          <h1>KYB Information</h1>
          <p>Document Upload</p>
        </div>

        <div className="progress-bar">
          <div className="progress-step completed">
            <div className="step-circle">1</div>
          </div>
          <div className="progress-line completed" />
          <div className="progress-step active">
            <div className="step-circle">2</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="kyb-documents-form">
          <div className="kyb-documents-list">
            {requiredDocuments.map((doc) => {
              const file = files[doc.key];
              return (
                <div key={doc.key} className="kyb-document-row">
                  <div className="kyb-document-info">
                    <span className="kyb-document-title">{doc.title}</span>
                    <p className="kyb-document-description">{doc.description}</p>
                    {file && <span className="kyb-document-filename">{file.name}</span>}
                  </div>
                  <label className="upload-button">
                    {file ? 'Change File' : 'Choose File'}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(doc.key, e.target.files?.[0] ?? null)}
                      hidden
                    />
                  </label>
                </div>
              );
            })}
          </div>

          {error && <p className="otp-error">{error}</p>}

          <div className="otp-actions">
            <button type="button" className="back-button" onClick={onBack}>
              Back
            </button>
            <button type="submit" className="continue-button">
              SUBMIT KYB
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
