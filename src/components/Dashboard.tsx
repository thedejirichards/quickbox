import { useState, useRef, useEffect, useCallback } from 'react';
import EmploymentStatus from './EmploymentStatus';
import KybFlow from './KybFlow';
import MyAccount from './MyAccount';
import VehicleFinance from './VehicleFinance';
import VendorSite from './VendorSite';
import type { VendorCar } from './vendorCars';
import { buildRequestedCars, sampleVehicleFinanceRequests, type RequestedCar, type VehicleFinanceRequest } from './vehicleFinanceRequests';

interface DashboardProps {
  accountType: 'individual' | 'business';
  displayName: string;
  verificationComplete: boolean;
  onVerificationComplete: () => void;
  onLogout: () => void;
}

type DashboardStep = 'home' | 'verification' | 'partners';

interface LoanProduct {
  id: number;
  name: string;
  description: string;
  repay: string;
  icon: string;
  eligible: boolean;
}

const loanProducts: LoanProduct[] = [
  { id: 1, name: 'Salaried Loans', description: 'Get up to 400% of your monthly salary', repay: 'Repay over 1-12 months', icon: 'badge', eligible: false },
  { id: 2, name: 'Device Finance', description: 'Get up to 30% of your annual salary', repay: 'Repay over 1-12 months', icon: 'device', eligible: true },
  { id: 3, name: 'Vehicle Finance', description: 'Finance a new or pre-owned vehicle, up to ₦50 million', repay: 'Repay over 1-4 years', icon: 'vehicle', eligible: false },
  { id: 4, name: 'Lending Against Turnover', description: 'Get up to ₦1 million', repay: 'Repay over 14-days and 6-months', icon: 'vehicle', eligible: false },
  { id: 5, name: 'NYSC Loans', description: 'Get up to 50% of your monthly allowance', repay: 'Repay in 30 days', icon: 'vehicle', eligible: false },
  { id: 6, name: 'Pay with QuickBox', description: 'Get up to 400% of your monthly salary', repay: 'Repay over 1-12 months', icon: 'badge', eligible: false },
];

const comingSoonProducts = [
  { id: 1, name: 'Household Goods Finance', icon: 'badge' },
  { id: 2, name: 'Energy Financing', icon: 'vehicle' },
  { id: 3, name: 'Fly Now Pay Later', icon: 'vehicle' },
  { id: 4, name: 'Cashed Backed Loans', icon: 'vehicle' },
  { id: 5, name: 'Dividend Advance', icon: 'vehicle' },
  { id: 6, name: 'Evergreen Loan', icon: 'vehicle' },
  { id: 7, name: 'Mortgage Finance', icon: 'vehicle' },
];

const promoSlides = [
  { id: 1, image: '/promo-fund-your-next-move.png', alt: 'Fund your next move with QuickBox Loans' },
];

const bnplMerchants = [
  { id: 1, name: 'Jumia', color: '#F68B1E' },
  { id: 2, name: 'Konga', color: '#E91E63' },
  { id: 3, name: 'PayPorte', color: '#7c3aed' },
  { id: 4, name: 'Slot', color: '#dc2626' },
];

const activeLoans: never[] = [];

const sidebarNav = [
  { key: 'home', label: 'Home', icon: '/sidebarIcons/Home.svg' },
  { key: 'my-loans', label: 'My Loans', icon: '/sidebarIcons/myLoans.svg' },
  { key: 'device-finance', label: 'Device Finance', icon: '/sidebarIcons/deviceFinance.svg' },
  { key: 'vehicle-finance', label: 'Vehicle Finance', icon: '/sidebarIcons/vehicle.svg' },
  { key: 'pay', label: 'Pay with QuickBox', icon: '/sidebarIcons/payWithQuickbox.svg' },
  { key: 'support', label: 'Support', icon: '/sidebarIcons/support.svg' },
];

function ProductIcon({ type }: { type: string }) {
  const s = { width: 22, height: 22, viewBox: '0 0 24 24' as const, fill: 'none' as const, stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (type) {
    case 'badge': return <svg {...s}><rect x="4" y="6" width="16" height="13" rx="3" /><circle cx="12" cy="12.7" r="3.2" /><path d="M9 6l1.3-1.8h3.4L15 6" /></svg>;
    case 'device': return <svg {...s}><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>;
    case 'vehicle': return <svg {...s}><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" /><circle cx="6.5" cy="16.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" /></svg>;
    default: return null;
  }
}

function NoActiveLoansIllustration() {
  return (
    <svg width="110" height="92" viewBox="0 0 110 92" fill="none">
      <rect x="14" y="16" width="58" height="40" rx="3" stroke="#c7d2e8" strokeWidth="2" fill="#fff" />
      <line x1="14" y1="46" x2="72" y2="46" stroke="#e3e8f2" strokeWidth="2" />
      <rect x="8" y="56" width="70" height="7" rx="2.5" fill="#e3e8f2" />
      <circle cx="66" cy="42" r="15" fill="#FFD9C2" opacity="0.55" />
      <circle cx="66" cy="42" r="9" fill="none" stroke="#FF8200" strokeWidth="3" />
      <line x1="72.5" y1="48.5" x2="82" y2="58" stroke="#FF8200" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M4 62c4 5 11 5 15 0" stroke="#c7d2e8" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M0 55c3 5 10 6 14 2" stroke="#c7d2e8" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function SocialIcon({ type }: { type: string }) {
  const s = { width: 16, height: 16, viewBox: '0 0 24 24' as const };
  switch (type) {
    case 'twitter': return <svg {...s} fill="#1DA1F2"><path d="M23 4.9c-.8.4-1.7.6-2.6.8 1-.6 1.7-1.5 2-2.6-.9.5-1.9.9-3 1.1a4.6 4.6 0 00-7.9 4.2A13.1 13.1 0 011.6 3.6a4.6 4.6 0 001.4 6.2c-.7 0-1.4-.2-2-.6v.1c0 2.2 1.6 4.1 3.7 4.5-.7.2-1.4.2-2 .1.6 1.8 2.3 3.1 4.3 3.2A9.3 9.3 0 010 19a13.1 13.1 0 007.1 2.1c8.5 0 13.2-7.2 13.2-13.4v-.6c.9-.6 1.7-1.4 2.3-2.3z" /></svg>;
    case 'youtube': return <svg {...s} fill="#FF0000"><rect x="1" y="5" width="22" height="14" rx="4" /><path d="M10 8.5l6 3.5-6 3.5z" fill="#fff" /></svg>;
    case 'instagram': return <svg {...s} fill="#E1306C"><rect x="2" y="2" width="20" height="20" rx="6" /><circle cx="12" cy="12" r="5" fill="none" stroke="#fff" strokeWidth="2" /><circle cx="18" cy="6" r="1.4" fill="#fff" /></svg>;
    case 'facebook': return <svg {...s} fill="#1877F2"><rect x="2" y="2" width="20" height="20" rx="4" /><path d="M15.5 8.5h-1.8c-.5 0-.7.3-.7.8v1.7h2.4l-.3 2.4h-2.1V22h-2.6v-8.6H8.5v-2.4h1.9V9c0-2 1.2-3.5 3.3-3.5h1.8z" fill="#fff" /></svg>;
    default: return null;
  }
}

export default function Dashboard({ accountType, displayName, verificationComplete, onVerificationComplete, onLogout }: DashboardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const [dashboardStep, setDashboardStep] = useState<DashboardStep>('home');
  const [vehicleFinanceRequests, setVehicleFinanceRequests] = useState<VehicleFinanceRequest[]>(sampleVehicleFinanceRequests);
  const [vfInitialTab, setVfInitialTab] = useState<'new' | 'pending' | 'approved'>('new');
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

  const startVerificationFlow = () => {
    setDashboardStep('verification');
  };

  const handleBnplComplete = (car: VendorCar) => {
    const carBase = {
      id: `${Date.now()}`,
      vehicle: `${car.make} ${car.model} ${car.year} ${car.color}`,
      price: car.price,
      dealer: 'Autocheck',
      status: 'pending' as const,
      dateRequested: new Date().toISOString(),
      make: car.make,
      model: car.model,
      year: car.year,
      color: car.color,
      location: car.location,
      mileage: car.mileage,
      corporateStage: 'inspection-schedule' as const,
    };
    const request: VehicleFinanceRequest = {
      ...carBase,
      image: car.image,
      cars: buildRequestedCars(carBase, 1),
    };
    setVehicleFinanceRequests((prev) => [request, ...prev]);
    setVfInitialTab('pending');
    setActiveNav('vehicle-finance');
    setDashboardStep('home');
  };

  const handleCorporateFinanceComplete = (car: VendorCar, quantity: number) => {
    const unitPrice = Number(car.price.replace(/[^\d]/g, '')) || 0;
    const totalPrice = quantity > 1 ? unitPrice * quantity : unitPrice;
    const requestId = `${Date.now()}`;
    const carBase = {
      id: requestId,
      vehicle: `${car.make} ${car.model} ${car.year} ${car.color}`,
      price: car.price,
      dealer: 'Autocheck',
      status: 'pending' as const,
      dateRequested: new Date().toISOString(),
      make: car.make,
      model: car.model,
      year: car.year,
      color: car.color,
      location: car.location,
      mileage: car.mileage,
      corporateStage: 'inspection-schedule' as const,
    };
    const request: VehicleFinanceRequest = {
      ...carBase,
      image: car.image,
      price: quantity > 1 ? `₦${totalPrice.toLocaleString()}` : car.price,
      quantity: quantity > 1 ? quantity : undefined,
      cars: buildRequestedCars(carBase, quantity),
    };
    setVehicleFinanceRequests((prev) => [request, ...prev]);
    setVfInitialTab('pending');
    setActiveNav('vehicle-finance');
    setDashboardStep('home');
  };

  const updateVehicleFinanceRequest = useCallback((id: string, updates: Partial<VehicleFinanceRequest>) => {
    setVehicleFinanceRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const updateVehicleFinanceCar = useCallback((requestId: string, carId: string, updates: Partial<RequestedCar>) => {
    setVehicleFinanceRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, cars: r.cars?.map((c) => (c.id === carId ? { ...c, ...updates } : c)) }
          : r
      )
    );
  }, []);

  if (dashboardStep === 'partners') {
    return (
      <VendorSite
        accountType={accountType}
        displayName={displayName}
        onBack={() => setDashboardStep('home')}
        onBnplComplete={handleBnplComplete}
        onCorporateFinanceComplete={handleCorporateFinanceComplete}
      />
    );
  }

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
            <div className="topbar-user-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9aa3af" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <button className="topbar-user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span className="topbar-user-name">{displayName}</span>
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
                onClick={() => { setActiveNav(item.key); setDashboardStep('home'); setSidebarOpen(false); }}
              >
                <img src={item.icon} alt="" className="sidebar-nav-icon" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-account">
            <button
              className={`sidebar-nav-item ${activeNav === 'account' ? 'active' : ''}`}
              onClick={() => { setActiveNav('account'); setDashboardStep('home'); }}
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
          {dashboardStep === 'verification' && (
            accountType === 'business' ? (
              <KybFlow
                onBack={() => setDashboardStep('home')}
                onSubmit={() => {
                  onVerificationComplete();
                  setDashboardStep('home');
                }}
              />
            ) : (
              <EmploymentStatus
                onBack={() => setDashboardStep('home')}
                onSubmit={() => {
                  onVerificationComplete();
                  setDashboardStep('home');
                }}
              />
            )
          )}

          {dashboardStep === 'home' && activeNav === 'vehicle-finance' && (
            <VehicleFinance
              accountType={accountType}
              displayName={displayName}
              onInitiateRequest={() => setDashboardStep('partners')}
              onGoHome={() => setActiveNav('home')}
              requests={vehicleFinanceRequests}
              initialTab={vfInitialTab}
              onUpdateRequest={updateVehicleFinanceRequest}
              onUpdateCar={updateVehicleFinanceCar}
            />
          )}

          {dashboardStep === 'home' && activeNav === 'account' && (
            <MyAccount
              accountType={accountType}
              displayName={displayName}
              verificationComplete={verificationComplete}
              onManageVerification={startVerificationFlow}
            />
          )}

          {dashboardStep === 'home' && activeNav !== 'vehicle-finance' && activeNav !== 'account' && (
            <>
              {accountType === 'business' && !verificationComplete && (
                <div className="employment-notice business-details-alert">
                  <div className="employment-notice-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div className="employment-notice-text">
                    <strong>Enter your business details</strong>
                    <p>Add your business information to unlock all features and increase your loan eligibility.</p>
                  </div>
                  <button
                    type="button"
                    className="employment-notice-button"
                    onClick={() => { setActiveNav('account'); setDashboardStep('home'); }}
                  >
                    Add Business Details
                  </button>
                </div>
              )}

              <div className="dashboard-greeting">
                <h1>Hi, {displayName}</h1>
              </div>

          <div className="summary-cards">
            <div className="summary-card qualified">
              <span className="summary-card-label">You are qualified for</span>
              <span className="summary-card-value">₦0.00</span>
              <button className="summary-card-btn">Take A Loan</button>
            </div>

            <div className="summary-card outstanding">
              <span className="summary-card-label">Total outstanding loans</span>
              <span className="summary-card-value">₦0.00</span>
              <span className="summary-card-sub">Loans taken &nbsp; 0</span>
              <button className="summary-card-btn">Manage Loans</button>
            </div>

            <div className="summary-card overdue">
              <span className="summary-card-label">Overdue loans</span>
              <span className="summary-card-value">₦0.00</span>
              <span className="summary-card-sub success">Great job! Keep it up! 🤙</span>
            </div>
          </div>

          <div className="active-loans-section">
            <div className="section-header">
              <h3>Active Loans</h3>
            </div>
            {activeLoans.length === 0 ? (
              <div className="no-active-loans-card">
                <NoActiveLoansIllustration />
                <div className="no-active-loans-text">
                  <p>You have no active loans. Click the button below to start taking loans and enjoying QuickBox.</p>
                  <button className="summary-card-btn no-active-loans-btn">Take A Loan</button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="loan-products-section">
            <div className="section-header">
              <h3>Loan Products</h3>
              <button className="view-all-btn">View All &rsaquo;</button>
            </div>
            <div className="loan-products-grid">
              {loanProducts.map((product) => (
                <div key={product.id} className="loan-product-card">
                  <div className="loan-product-top">
                    <div className="loan-product-info">
                      <h4>{product.name}</h4>
                      <p>{product.description}</p>
                    </div>
                    <div className="loan-product-icon">
                      <ProductIcon type={product.icon} />
                    </div>
                  </div>
                  <div className="loan-product-bottom">
                    <span className="loan-product-repay">{product.repay}</span>
                    <button className={`loan-eligibility-badge ${product.eligible ? 'eligible' : ''}`} disabled={!product.eligible}>
                      {product.eligible ? 'Take Loan' : 'Not Eligible'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="promo-carousel">
            <div className="promo-carousel-track">
              <img src={promoSlides[promoIndex].image} alt={promoSlides[promoIndex].alt} className="promo-carousel-image" />
            </div>
            {promoSlides.length > 1 && (
              <div className="promo-carousel-dots">
                {promoSlides.map((slide, i) => (
                  <button
                    key={slide.id}
                    className={`promo-dot ${i === promoIndex ? 'active' : ''}`}
                    onClick={() => setPromoIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="bnpl-section">
            <div className="section-header">
              <h3>Buy Now Pay Later</h3>
            </div>
            <div className="bnpl-grid">
              <div className="bnpl-card">
                <div className="bnpl-card-top">
                  <div className="loan-product-info">
                    <h4>Pay with QuickBox</h4>
                    <p>Buy Now Pay Later</p>
                  </div>
                  <div className="loan-product-icon">
                    <ProductIcon type="vehicle" />
                  </div>
                </div>
                <div className="bnpl-merchants">
                  {bnplMerchants.map((m) => (
                    <span key={m.id} className="merchant-badge" style={{ color: m.color, borderColor: `${m.color}55` }}>{m.name}</span>
                  ))}
                </div>
                <button className="bnpl-btn">Learn More</button>
              </div>
              <div className="bnpl-promo">
                <svg className="bnpl-star bnpl-star-1" width="20" height="20" viewBox="0 0 24 24" fill="#FBBF24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z" /></svg>
                <svg className="bnpl-star bnpl-star-2" width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z" /></svg>
                <svg className="bnpl-star bnpl-star-3" width="16" height="16" viewBox="0 0 24 24" fill="#FBBF24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z" /></svg>
                <div className="bnpl-promo-text">
                  <span>Your favourite</span>
                  <em>ecommerce</em>
                  <span>stores are here</span>
                </div>
                <svg className="bnpl-cart" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
                  <circle cx="9" cy="20" r="1.4" fill="#fff" stroke="none" />
                  <circle cx="18" cy="20" r="1.4" fill="#fff" stroke="none" />
                  <path d="M2 3h2l2.6 12.6a2 2 0 002 1.6h8.8a2 2 0 002-1.6L21 7H6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="coming-soon-section">
            <div className="section-header">
              <h3>Coming Soon</h3>
            </div>
            <div className="coming-soon-grid">
              {comingSoonProducts.map((item) => (
                <div key={item.id} className="coming-soon-card">
                  <div className="coming-soon-top">
                    <h4>{item.name}</h4>
                    <div className="loan-product-icon small">
                      <ProductIcon type={item.icon} />
                    </div>
                  </div>
                  <span className="coming-soon-label">Coming Soon</span>
                </div>
              ))}
            </div>
          </div>
            </>
          )}
        </main>
      </div>

      <footer className="dashboard-footer">
        <div className="footer-brand">
          <img src="/fullAccessBankLogo.svg" alt="Access Bank" className="footer-logo" />
          <span className="footer-divider" />
          <span className="footer-copy">&copy; 2026 Access Bank Plc. (Licensed by The Central Bank of Nigeria)</span>
        </div>
        <div className="footer-socials">
          <SocialIcon type="twitter" />
          <SocialIcon type="youtube" />
          <SocialIcon type="instagram" />
          <SocialIcon type="facebook" />
        </div>
      </footer>
    </div>
  );
}
