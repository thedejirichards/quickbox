import { useEffect, useState } from 'react';
import PersonalDocumentationModal, { type DocumentationData } from './PersonalDocumentationModal';
import BusinessDocumentationModal, { type BusinessDocumentationData } from './BusinessDocumentationModal';
import type { VehicleFinanceRequest } from './vehicleFinanceRequests';
import LoanRequestDetail from './LoanRequestDetail';

interface VehicleFinanceProps {
  accountType: 'individual' | 'business';
  displayName: string;
  onInitiateRequest: () => void;
  requests: VehicleFinanceRequest[];
  initialTab?: 'new' | 'pending' | 'approved';
  onUpdateRequest: (id: string, updates: Partial<VehicleFinanceRequest>) => void;
}

type DocStatus = 'not-submitted' | 'pending' | 'approved';
type Tab = 'new' | 'pending' | 'approved';

const PENDING_TO_APPROVED_DELAY_MS = 5000;

const howItWorks = [
  { id: 1, title: 'Eligibility', description: "Vehicle Finance on QuickBox is available for salary earners and business owners with verifiable income who meet the Bank's Risk Acceptance Criteria (RAC)." },
  { id: 2, title: 'Application Process', description: "Visit the Access Bank website or QuickBox platform and select 'Vehicle Finance' to get started. Choose from a variety of pre-owned and new vehicles available under the scheme." },
  { id: 3, title: 'Loan Details', description: 'Loan tenors range from 24 to 48 months, with a maximum loan amount of ₦50 million. Comprehensive insurance is included in the loan package.' },
  { id: 4, title: 'Vehicle Collection', description: 'Vehicles are ready for pick-up 72 hours after the digital loan is booked. You can collect your vehicle from any participating dealership/vendor, as selected during the request process.' },
];

const dealers = [
  { id: 1, name: 'Autochek', image: '/Dealers-Partners-card-image1.png' },
  { id: 2, name: 'Autochek', image: '/Dealers-Partners-card-image2.png' },
];

function StatusBadge({ status }: { status: VehicleFinanceRequest['status'] }) {
  if (status === 'approved') {
    return (
      <span className="vf-status-badge approved">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
        Approved
      </span>
    );
  }
  if (status === 'declined') {
    return (
      <span className="vf-status-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Declined
      </span>
    );
  }
  return (
    <span className="vf-status-badge pending">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      Pending
    </span>
  );
}

interface RequestsTableProps {
  title: string;
  requests: VehicleFinanceRequest[];
  emptyMessage: string;
  onView: (request: VehicleFinanceRequest) => void;
}

function RequestsTable({ title, requests, emptyMessage, onView }: RequestsTableProps) {
  return (
    <div className="vf-section">
      <h3 className="vf-section-title">{title}</h3>
      {requests.length === 0 ? (
        <div className="vf-empty-state">{emptyMessage}</div>
      ) : (
        <div className="vf-requests-table-wrap">
          <table className="vf-requests-table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Request ID</th>
                <th>Dealer</th>
                <th>Amount</th>
                <th>Date requested</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>
                    <span className="vf-request-id">{r.id}</span>
                  </td>
                  <td>{r.dealer}</td>
                  <td>{r.price}</td>
                  <td>{new Date(r.dateRequested).toLocaleDateString()}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td>
                    <button className="vf-request-view-btn" onClick={() => onView(r)}>
                      View Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function VehicleFinance({ accountType, displayName, onInitiateRequest, requests, initialTab = 'new', onUpdateRequest }: VehicleFinanceProps) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [viewingRequestId, setViewingRequestId] = useState<string | null>(null);
  const viewingRequest = requests.find((r) => r.id === viewingRequestId) ?? null;
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [docStatus, setDocStatus] = useState<DocStatus>('not-submitted');
  const [submittedDocs, setSubmittedDocs] = useState<DocumentationData | null>(null);
  const [submittedBusinessDocs, setSubmittedBusinessDocs] = useState<BusinessDocumentationData | null>(null);

  useEffect(() => {
    if (docStatus !== 'pending') return;
    const timer = setTimeout(() => setDocStatus('approved'), PENDING_TO_APPROVED_DELAY_MS);
    return () => clearTimeout(timer);
  }, [docStatus]);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const approvedRequests = requests.filter((r) => r.status === 'approved');

  if (viewingRequest) {
    return (
      <div className="vf-page">
        <LoanRequestDetail
          request={viewingRequest}
          displayName={displayName}
          onBack={() => setViewingRequestId(null)}
          onUpdateRequest={onUpdateRequest}
        />
      </div>
    );
  }

  return (
    <div className="vf-page">
      {!alertDismissed && (
        <div className="vf-alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="vf-alert-icon">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p>
            You are required to submit prequalification documents before you can be eligible to take Vehicle Finance loans.
            You will be notified once they have been approved and then you can proceed to request for Vehicle Finance.
          </p>
          <button className="vf-alert-close" onClick={() => setAlertDismissed(true)} aria-label="Dismiss">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <div className="vf-hero">
        <img
          src="/vehiclefinanceIndividual- MainPicture.png"
          alt="Get a vehicle and pay later — get a pre-owned or brand new vehicle in under 5 days"
          className="vf-hero-image"
        />
        <div className="vf-hero-dots">
          <span className="vf-dot active" />
          <span className="vf-dot" />
          <span className="vf-dot" />
        </div>
      </div>

      <div className="vf-tabs">
        <button className={`vf-tab ${tab === 'new' ? 'active' : ''}`} onClick={() => setTab('new')}>
          New Request
        </button>
        <button className={`vf-tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>
          Pending Request{pendingRequests.length > 0 ? ` (${pendingRequests.length})` : ''}
        </button>
        <button className={`vf-tab ${tab === 'approved' ? 'active' : ''}`} onClick={() => setTab('approved')}>
          Approved Request{approvedRequests.length > 0 ? ` (${approvedRequests.length})` : ''}
        </button>
      </div>

      {tab === 'pending' && (
        <RequestsTable
          title="Pending Requests"
          requests={pendingRequests}
          emptyMessage="You have no pending vehicle finance requests yet."
          onView={(r) => setViewingRequestId(r.id)}
        />
      )}

      {tab === 'approved' && (
        <RequestsTable
          title="Approved Requests"
          requests={approvedRequests}
          emptyMessage="You have no approved vehicle finance requests yet."
          onView={(r) => setViewingRequestId(r.id)}
        />
      )}

      {tab === 'new' && (
        <>
      <div className="vf-eligibility">
        <div className="vf-eligibility-amount">
          <span className="vf-eligibility-label">You are eligible for</span>
          <span className="vf-eligibility-value">₦7,000,000</span>
        </div>
        <div className="vf-eligibility-status">
          <span className="vf-status-label">Prequalification status</span>
          {docStatus === 'approved' ? (
            <span className="vf-status-badge approved">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              Approved
            </span>
          ) : docStatus === 'pending' ? (
            <span className="vf-status-badge pending">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Pending
            </span>
          ) : (
            <span className="vf-status-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Documentation required
            </span>
          )}
        </div>
        <button className="vf-submit-btn" onClick={() => setShowDocModal(true)}>
          {docStatus === 'not-submitted' ? 'Submit' : 'View Submission'}
        </button>
      </div>

      <div className="vf-section">
        <h3 className="vf-section-title">How it works</h3>
        <div className="vf-steps-grid">
          {howItWorks.map((step, i) => (
            <div key={step.id} className="vf-step-card">
              <div className="vf-step-number">{String(i + 1).padStart(2, '0')}</div>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="vf-section">
        <h3 className="vf-section-title">Dealers/Partners</h3>
        <div className="vf-dealers-grid">
          {dealers.map((dealer) => (
            <div key={dealer.id} className="vf-dealer-card">
              <img src={dealer.image} alt="" className="vf-dealer-banner-image" />
              <div className="vf-dealer-footer">
                <div className="vf-dealer-identity">
                  <span className="vf-dealer-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="2">
                      <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
                      <circle cx="6.5" cy="16.5" r="2.5" />
                      <circle cx="16.5" cy="16.5" r="2.5" />
                    </svg>
                  </span>
                  <span className="vf-dealer-name">{dealer.name}</span>
                </div>
                <button
                  className="vf-dealer-btn"
                  disabled={docStatus !== 'approved'}
                  onClick={onInitiateRequest}
                >
                  Initiate Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
        </>
      )}

      {showDocModal && accountType === 'business' && (
        <BusinessDocumentationModal
          onClose={() => setShowDocModal(false)}
          initialData={submittedBusinessDocs}
          readOnly={docStatus !== 'not-submitted'}
          onSubmit={(data) => {
            setSubmittedBusinessDocs(data);
            setDocStatus('pending');
            setShowDocModal(false);
          }}
        />
      )}

      {showDocModal && accountType === 'individual' && (
        <PersonalDocumentationModal
          onClose={() => setShowDocModal(false)}
          initialData={submittedDocs}
          readOnly={docStatus !== 'not-submitted'}
          onSubmit={(data) => {
            setSubmittedDocs(data);
            setDocStatus('pending');
          }}
        />
      )}
    </div>
  );
}
