interface MyAccountProps {
  accountType: 'individual' | 'business';
  displayName: string;
  verificationComplete: boolean;
  onManageVerification: () => void;
}

export default function MyAccount({ accountType, displayName, verificationComplete, onManageVerification }: MyAccountProps) {
  return (
    <div className="my-account-page">
      <div className="dashboard-greeting">
        <h1>My Account</h1>
      </div>

      <div className="account-info-card">
        <div className="account-info-row">
          <span className="account-info-label">Name</span>
          <span className="account-info-value">{displayName}</span>
        </div>
        <div className="account-info-row">
          <span className="account-info-label">Account Type</span>
          <span className="account-info-value">{accountType === 'business' ? 'Business' : 'Individual'}</span>
        </div>
      </div>

      {accountType === 'individual' && (
        <div className="active-loans-section">
          <div className="section-header">
            <h3>Employment Details</h3>
          </div>
          <div className="employment-notice">
            <div className="employment-notice-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="employment-notice-text">
              <strong>{verificationComplete ? 'Employment details on file' : 'Employment details not provided'}</strong>
              <p>
                {verificationComplete
                  ? 'You can update your employment information at any time.'
                  : 'Add your employment information to unlock all features and increase your loan eligibility.'}
              </p>
            </div>
            <button className="employment-notice-button" onClick={onManageVerification}>
              {verificationComplete ? 'Update Employment Details' : 'Add Employment Details'}
            </button>
          </div>
        </div>
      )}

      {accountType === 'business' && (
        <div className="active-loans-section">
          <div className="section-header">
            <h3>Business Details</h3>
          </div>
          <div className="employment-notice">
            <div className="employment-notice-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="employment-notice-text">
              <strong>{verificationComplete ? 'Business details on file' : 'Business details not provided'}</strong>
              <p>
                {verificationComplete
                  ? 'You can update your business information at any time.'
                  : 'Add your business information to unlock all features and increase your loan eligibility.'}
              </p>
            </div>
            <button className="employment-notice-button" onClick={onManageVerification}>
              {verificationComplete ? 'Update Business Details' : 'Add Business Details'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
