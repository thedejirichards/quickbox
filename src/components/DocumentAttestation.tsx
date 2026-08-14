import { useState, type ReactNode } from 'react';

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`toa-chevron ${open ? 'open' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

interface DocumentAttestationProps {
  fieldLabel: string;
  attestationText: string;
  accordionTitle: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  readOnly?: boolean;
  children: ReactNode;
}

export default function DocumentAttestation({
  fieldLabel,
  attestationText,
  accordionTitle,
  checked,
  onChange,
  readOnly = false,
  children,
}: DocumentAttestationProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="doc-upload-group">
      <label className="doc-field-label">
        {fieldLabel} <span className="doc-required">*</span>
      </label>

      <div className="toa-box">
        <div className="toa-row">
          <label className="toa-checkbox-label">
            <input
              type="checkbox"
              checked={checked}
              disabled={readOnly}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span>{attestationText}</span>
          </label>
          <button
            type="button"
            className="toa-toggle-btn"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            {open ? 'Hide' : 'View'}
            <ChevronIcon open={open} />
          </button>
        </div>

        {open && (
          <div className="toa-accordion-panel">
            <h5 className="toa-title">{accordionTitle}</h5>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
