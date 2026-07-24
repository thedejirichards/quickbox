import { useState, useRef, useEffect } from 'react';

interface DashboardProps {
  kycComplete: boolean;
  onCompleteKyc: () => void;
  onLogout: () => void;
}

const loanProducts = [
  { id: 1, name: 'PayDay Loan', description: 'Get up to 100% of your monthly salary', maxAmount: '₦2,000,000', tenor: '30 days', rate: '11%', color: '#FF8200', icon: 'payday' },
  { id: 2, name: 'Salary Advance', description: 'Borrow up to 200% of your monthly salary', maxAmount: '₦5,000,000', tenor: '6 months', rate: '10%', color: '#2F57B3', icon: 'salary' },
  { id: 3, name: 'Device Finance', description: 'Get access to over 20,000 gadgets and devices', maxAmount: 'Varies', tenor: '3-12 months', rate: '30% p.a.', color: '#16a34a', icon: 'device' },
  { id: 4, name: 'Vehicle Finance', description: 'Finance your dream car today', maxAmount: 'Varies', tenor: 'Custom', rate: 'Competitive', color: '#7c3aed', icon: 'vehicle' },
  { id: 5, name: 'Instant Business Loan', description: 'Quick loans for your business needs', maxAmount: '₦10,000,000', tenor: '3-6 months', rate: '7.5%', color: '#dc2626', icon: 'business' },
  { id: 6, name: 'LATO Loan', description: 'Lending against your account turnover', maxAmount: '₦300,000', tenor: '3 months', rate: '13.99%', color: '#0891b2', icon: 'lato' },
];

const activeLoans = [
  { id: 1, product: 'Salary Advance', amount: '₦1,600,000', outstanding: '₦850,000', nextPayment: '₦150,000', dueDate: '31 Jul 2026', status: 'active', progress: 47 },
];

const recentTransactions = [
  { id: 1, name: 'Loan Disbursement', type: 'Credit', amount: '+ ₦1,600,000.00', date: '15 Jul 2026', status: 'Successful', icon: 'credit' },
  { id: 2, name: 'Loan Repayment', type: 'Debit', amount: '- ₦150,000.00', date: '14 Jul 2026', status: 'Successful', icon: 'debit' },
  { id: 3, name: 'Airtime Purchase', type: 'Debit', amount: '- ₦1,000.00', date: '12 Jul 2026', status: 'Successful', icon: 'debit' },
  { id: 4, name: 'Electricity Bill', type: 'Debit', amount: '- ₦12,500.00', date: '10 Jul 2026', status: 'Pending', icon: 'debit' },
];

const sidebarNav = [
  { key: 'home', label: 'Home', icon: '/sidebarIcons/Home.svg' },
  { key: 'my-loans', label: 'My Loans', icon: '/sidebarIcons/myLoans.svg' },
  { key: 'device-finance', label: 'Device Finance', icon: '/sidebarIcons/deviceFinance.svg' },
  { key: 'vehicle-finance', label: 'Vehicle Finance', icon: '/sidebarIcons/vehicle.svg' },
  { key: 'pay', label: 'Pay with Quick...', icon: '/sidebarIcons/payWithQuickbox.svg' },
  { key: 'support', label: 'Support', icon: '/sidebarIcons/support.svg' },
];

function ProductIcon({ type }: { type: string }) {
  const s = { width: 28, height: 28, viewBox: '0 0 24 24' as const, fill: 'none' as const, stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (type) {
    case 'payday': return <svg {...s}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
    case 'salary': return <svg {...s}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>;
    case 'device': return <svg {...s}><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>;
    case 'vehicle': return <svg {...s}><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" /><circle cx="6.5" cy="16.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" /></svg>;
    case 'business': return <svg {...s}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>;
    case 'lato': return <svg {...s}><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>;
    default: return null;
  }
}

export default function Dashboard({ kycComplete, onCompleteKyc, onLogout }: DashboardProps) {
  const [activeLoanTab, setActiveLoanTab] = useState<'active' | 'history'>('active');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <img src="/QuickBoxLogo.svg" alt="QuickBox" className="topbar-logo" />
        <div className="topbar-right">
          <button className="topbar-notif">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span className="notif-dot" />
          </button>
          <div className="topbar-user" ref={dropdownRef}>
            <button className="topbar-user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="topbar-user-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="topbar-user-name">John Doe</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`topbar-chevron ${dropdownOpen ? 'open' : ''}`}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="topbar-dropdown">
                <button className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 01-3.46 0" />
                  </svg>
                  Notifications
                </button>
                <button className="topbar-dropdown-item logout" onClick={onLogout}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <nav className="sidebar-nav">
            {sidebarNav.map((item) => (
              <button
                key={item.key}
                className={`sidebar-nav-item ${activeNav === item.key ? 'active' : ''}`}
                onClick={() => { setActiveNav(item.key); setSidebarOpen(false); }}
              >
                <img src={item.icon} alt="" className="sidebar-nav-icon" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-account">
            <button
              className={`sidebar-nav-item ${activeNav === 'account' ? 'active' : ''}`}
              onClick={() => setActiveNav('account')}
            >
              <img src="/sidebarIcons/user.svg" alt="" className="sidebar-nav-icon" />
              <span>My Account</span>
            </button>
            <button className="sidebar-nav-item logout-item" onClick={onLogout}>
              <img src="/sidebarIcons/Logout.svg" alt="" className="sidebar-nav-icon" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <div className={`dashboard-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

        <main className="dashboard-content">
          {!kycComplete && (
            <div className="kyc-banner">
              <div className="kyc-banner-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="kyc-banner-text">
                <strong>Complete your KYC</strong>
                <p>Verify your identity to unlock all features and increase your loan eligibility.</p>
              </div>
              <button className="kyc-banner-button" onClick={onCompleteKyc}>Complete KYC</button>
            </div>
          )}

          <div className="dashboard-greeting">
            <h1>Welcome, Solomon</h1>
          </div>

          <div className="summary-cards">
            <div className="summary-card qualified">
              <div className="summary-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <span className="summary-card-label">You are qualified for</span>
              <span className="summary-card-value">₦10,000,000</span>
              <button className="summary-card-btn">Take A Loan</button>
            </div>

            <div className="summary-card total-loans">
              <div className="summary-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F57B3" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
              </div>
              <span className="summary-card-label">Total Loans</span>
              <span className="summary-card-value">₦1,600,000</span>
              <span className="summary-card-sub">1 Active Loan</span>
              <button className="summary-card-btn secondary">Manage Loan</button>
            </div>

            <div className="summary-card outstanding">
              <div className="summary-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <span className="summary-card-label">Total Outstanding Amount</span>
              <span className="summary-card-value">₦850,000</span>
              <span className="summary-card-sub">1 Loan Taken</span>
              <button className="summary-card-btn secondary">Manage Loan</button>
            </div>

            <div className="summary-card overdue">
              <div className="summary-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </div>
              <span className="summary-card-label">Overdue Loans</span>
              <span className="summary-card-value">₦0</span>
              <span className="summary-card-sub success">Great Job keep it up</span>
              <button className="summary-card-btn">Repay Loan</button>
            </div>
          </div>

          <div className="promo-banner">
            <div className="promo-banner-content">
              <div className="promo-badge">NEW</div>
              <h3>Device Finance</h3>
              <p>Get access to over 20,000 new gadgets and devices. Finance your purchase with flexible repayment plans.</p>
              <button className="promo-btn">
                Explore Devices
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>
            <div className="promo-banner-illustration">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
                <rect x="9" y="8" width="6" height="6" rx="1" />
                <line x1="9" y1="17" x2="15" y2="17" />
              </svg>
            </div>
          </div>

          <div className="loan-products-section">
            <div className="section-header">
              <h3>Available Loan Products</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="loan-products-grid">
              {loanProducts.map((product) => (
                <div key={product.id} className="loan-product-card">
                  <div className="loan-product-icon" style={{ background: `${product.color}15`, color: product.color }}>
                    <ProductIcon type={product.icon} />
                  </div>
                  <div className="loan-product-info">
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                  </div>
                  <div className="loan-product-meta">
                    <div className="loan-meta-item">
                      <span className="meta-label">Max Amount</span>
                      <span className="meta-value">{product.maxAmount}</span>
                    </div>
                    <div className="loan-meta-item">
                      <span className="meta-label">Tenor</span>
                      <span className="meta-value">{product.tenor}</span>
                    </div>
                    <div className="loan-meta-item">
                      <span className="meta-label">Rate</span>
                      <span className="meta-value">{product.rate}</span>
                    </div>
                  </div>
                  <button className="loan-product-btn" style={{ background: product.color }}>Apply Now</button>
                </div>
              ))}
            </div>
          </div>

          {activeLoans.length > 0 && (
            <div className="active-loans-section">
              <div className="section-header">
                <h3>Active Loans</h3>
                <div className="loan-tabs">
                  <button className={`loan-tab ${activeLoanTab === 'active' ? 'active' : ''}`} onClick={() => setActiveLoanTab('active')}>Active</button>
                  <button className={`loan-tab ${activeLoanTab === 'history' ? 'active' : ''}`} onClick={() => setActiveLoanTab('history')}>History</button>
                </div>
              </div>
              <div className="active-loans-list">
                {activeLoans.map((loan) => (
                  <div key={loan.id} className="active-loan-card">
                    <div className="active-loan-header">
                      <div className="active-loan-product">
                        <div className="active-loan-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
                        </div>
                        <div>
                          <span className="active-loan-name">{loan.product}</span>
                          <span className="active-loan-amount">{loan.amount}</span>
                        </div>
                      </div>
                      <span className="active-loan-status"><span className="status-dot" />Active</span>
                    </div>
                    <div className="active-loan-progress">
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${loan.progress}%` }} />
                      </div>
                      <div className="progress-labels">
                        <span>{loan.progress}% repaid</span>
                        <span>Outstanding: {loan.outstanding}</span>
                      </div>
                    </div>
                    <div className="active-loan-footer">
                      <div className="active-loan-detail">
                        <span className="detail-label">Next Payment</span>
                        <span className="detail-value">{loan.nextPayment}</span>
                      </div>
                      <div className="active-loan-detail">
                        <span className="detail-label">Due Date</span>
                        <span className="detail-value">{loan.dueDate}</span>
                      </div>
                      <button className="repay-btn">Repay Now</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="recent-transactions">
            <div className="transactions-header">
              <h3>Recent Activity</h3>
              <button className="transactions-view-all">View All</button>
            </div>
            <div className="transactions-list">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="transaction-item">
                  <div className={`transaction-icon ${tx.icon}`}>
                    {tx.icon === 'credit' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="2">
                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                        <polyline points="17 18 23 18 23 12" />
                      </svg>
                    )}
                  </div>
                  <div className="transaction-details">
                    <span className="transaction-name">{tx.name}</span>
                    <span className="transaction-date">{tx.date}</span>
                  </div>
                  <div className="transaction-right">
                    <span className={`transaction-amount ${tx.icon === 'credit' ? 'credit' : 'debit'}`}>{tx.amount}</span>
                    <span className={`transaction-status ${tx.status.toLowerCase()}`}>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <footer className="dashboard-footer">
        <img src="/fullAccessBankLogo.svg" alt="Access Bank" className="footer-logo" />
        <span>&copy; 2026 QuickBox &middot; A product of Access Bank Plc. (Licensed by The Central Bank of Nigeria)</span>
      </footer>
    </div>
  );
}
