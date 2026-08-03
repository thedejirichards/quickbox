import { useState } from 'react';
import Carousel from './Carousel';
import AccountTypeSelection from './AccountTypeSelection';
import CorporateAccountValidation from './CorporateAccountValidation';
import CorporateOtpVerification from './CorporateOtpVerification';
import CorporateCreatePassword from './CorporateCreatePassword';
import BvnValidation from './BvnValidation';
import OtpVerification from './OtpVerification';
import TermsAndConditions from './TermsAndConditions';
import CreatePassword from './CreatePassword';
import PinCreation from './PinCreation';
import Dashboard from './Dashboard';

type View = 'login' | 'account-type' | 'corporate-onboarding' | 'corporate-otp-verification' | 'corporate-create-password' | 'corporate-pin-creation' | 'bvn-validation' | 'otp-verification' | 'terms' | 'create-password' | 'pin-creation' | 'dashboard';
type AccountType = 'individual' | 'business';

// Demo data: the phone number linked to a corporate account, as it would be looked up server-side.
const DEMO_CORPORATE_PHONE = '8134567835';

function maskCorporatePhone(localDigits: string) {
  const first = localDigits.slice(0, 3);
  const last = localDigits.slice(-2);
  const masked = '*'.repeat(Math.max(localDigits.length - first.length - last.length, 0));
  return `+234${first}${masked}${last}`;
}

interface DemoAccount {
  email: string;
  password: string;
  displayName: string;
  accountType: AccountType;
  verificationComplete: boolean;
}

const DEMO_ACCOUNTS = {
  individualSuccess: { email: 'solomon@gmail.com', password: 'Password123', displayName: 'Solomon', accountType: 'individual', verificationComplete: true },
  businessSuccess: { email: 'corporate@gmail.com', password: 'Password123', displayName: 'Acme Ventures Ltd', accountType: 'business', verificationComplete: false },
} satisfies Record<string, DemoAccount>;

type DemoAccountKey = keyof typeof DEMO_ACCOUNTS;

const WRONG_PASSWORD = 'WrongPassword1';

export default function LoginPage() {
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState('');
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [signInTab, setSignInTab] = useState<AccountType>('individual');
  const [loggedInAccountType, setLoggedInAccountType] = useState<AccountType>('individual');
  const [displayName, setDisplayName] = useState('Solomon');
  const [loginError, setLoginError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = Object.values(DEMO_ACCOUNTS).find(
      (account) => account.accountType === signInTab && account.email === email && account.password === password
    );

    if (!match) {
      setLoginError(true);
      return;
    }

    setLoggedInAccountType(match.accountType);
    setDisplayName(match.displayName);
    setVerificationComplete(match.verificationComplete);
    setView('dashboard');
  };

  const fillDemoCredentials = (accountKey: DemoAccountKey, outcome: 'success' | 'failure' = 'success') => {
    const account = DEMO_ACCOUNTS[accountKey];
    setSignInTab(account.accountType);
    setEmail(account.email);
    setPassword(outcome === 'success' ? account.password : WRONG_PASSWORD);
    setLoginError(false);
  };

  const handleProceed = (type: string) => {
    if (type === 'individual') {
      setView('bvn-validation');
    } else if (type === 'b2b') {
      setView('corporate-onboarding');
    }
  };

  if (view === 'dashboard') {
    return (
      <Dashboard
        accountType={loggedInAccountType}
        displayName={displayName}
        verificationComplete={verificationComplete}
        onVerificationComplete={() => setVerificationComplete(true)}
        onLogout={() => {
          setVerificationComplete(false);
          setView('login');
        }}
      />
    );
  }

  return (
    <div className="login-page">
      <header className="topbar">
        <img src="/QuickBoxLogo.svg" alt="QuickBox" className="topbar-logo" />
        <div className="country-selector">
          <span className="flag">🇳🇬</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </header>

      <main className="login-main">
        <div className="login-left">
          <Carousel />
        </div>

        <div className="login-right">
          {view === 'login' && (
            <div className="login-form-wrapper">
              <div className="login-header">
                <h1>Sign In</h1>
                <p>
                  {signInTab === 'individual'
                    ? 'Sign in to continue meeting your urgent needs'
                    : 'Sign in to manage your corporate account'}
                </p>
              </div>

              <div className="tabs">
                <button
                  type="button"
                  className={`tab ${signInTab === 'individual' ? 'active' : ''}`}
                  onClick={() => setSignInTab('individual')}
                >
                  Individual
                </button>
                <button
                  type="button"
                  className={`tab ${signInTab === 'business' ? 'active' : ''}`}
                  onClick={() => setSignInTab('business')}
                >
                  Business
                </button>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Phone number or email</label>
                  <input
                    id="email"
                    type="text"
                    placeholder="Phone number or email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-wrapper">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                <button type="submit" className="login-button">
                  SIGN IN
                </button>
              </form>

              <div className="divider">
                <span>or</span>
              </div>

              <div className="social-logins">
                <button type="button" className="social-button">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                <button type="button" className="social-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Continue with Apple
                </button>
              </div>

              <div className="app-badges">
                <a href="#" className="app-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="badge-text">
                    <span className="badge-small">Download on the</span>
                    <span className="badge-large">App Store</span>
                  </div>
                </a>
                <a href="#" className="app-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.395 13l2.302-3.492zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z"/>
                  </svg>
                  <div className="badge-text">
                    <span className="badge-small">GET IT ON</span>
                    <span className="badge-large">Google Play</span>
                  </div>
                </a>
              </div>

              <p className="signup-link">
                {signInTab === 'individual' ? (
                  <>
                    New user? <a href="#" onClick={(e) => { e.preventDefault(); setView('account-type'); }}>Sign Up</a>
                  </>
                ) : (
                  <>
                    New to QuickBucks for Business?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); setView('corporate-onboarding'); }}>Get Started</a>
                  </>
                )}
              </p>

              <div className="demo-credentials">
                <span className="demo-credentials-label">Demo quick-fill &middot; Individual</span>
                <div className="demo-credentials-row">
                  <button type="button" className="demo-credentials-btn" onClick={() => fillDemoCredentials('individualSuccess', 'success')}>
                    Success
                  </button>
                  <button type="button" className="demo-credentials-btn" onClick={() => fillDemoCredentials('individualSuccess', 'failure')}>
                    Failure
                  </button>
                </div>

                <span className="demo-credentials-label">Demo quick-fill &middot; Business</span>
                <div className="demo-credentials-row">
                  <button type="button" className="demo-credentials-btn" onClick={() => fillDemoCredentials('businessSuccess', 'success')}>
                    Success
                  </button>
                  <button type="button" className="demo-credentials-btn" onClick={() => fillDemoCredentials('businessSuccess', 'failure')}>
                    Failure
                  </button>
                </div>
              </div>
            </div>
          )}

          {view === 'account-type' && (
            <AccountTypeSelection
              onBack={() => setView('login')}
              onProceed={handleProceed}
            />
          )}

          {view === 'corporate-onboarding' && (
            <CorporateAccountValidation
              onBack={() => setView('account-type')}
              onSignIn={() => setView('login')}
              onSendOtp={() => {
                setMaskedPhone(maskCorporatePhone(DEMO_CORPORATE_PHONE));
                setView('corporate-otp-verification');
              }}
            />
          )}

          {view === 'corporate-otp-verification' && (
            <CorporateOtpVerification
              maskedPhone={maskedPhone}
              onBack={() => setView('corporate-onboarding')}
              onNext={() => setView('corporate-create-password')}
            />
          )}

          {view === 'corporate-create-password' && (
            <CorporateCreatePassword
              onBack={() => setView('corporate-otp-verification')}
              onSignIn={() => setView('login')}
              onNext={() => setView('corporate-pin-creation')}
            />
          )}

          {view === 'corporate-pin-creation' && (
            <PinCreation
              totalSteps={4}
              currentStep={4}
              onBack={() => setView('corporate-create-password')}
              onSignIn={() => setView('login')}
              onSubmit={() => {
                setLoggedInAccountType('business');
                setDisplayName('Acme Ventures Ltd');
                setVerificationComplete(false);
                setView('dashboard');
              }}
            />
          )}

          {view === 'bvn-validation' && (
            <BvnValidation
              onSendOtp={(phone) => {
                setMaskedPhone(phone);
                setView('otp-verification');
              }}
            />
          )}

          {view === 'otp-verification' && (
            <OtpVerification
              maskedPhone={maskedPhone}
              onBack={() => setView('bvn-validation')}
              onSuccess={() => setView('terms')}
            />
          )}

          {view === 'terms' && (
            <TermsAndConditions
              onBack={() => setView('otp-verification')}
              onAccept={() => setView('create-password')}
            />
          )}

          {view === 'create-password' && (
            <CreatePassword
              onBack={() => setView('terms')}
              onComplete={() => setView('pin-creation')}
            />
          )}

          {view === 'pin-creation' && (
            <PinCreation
              totalSteps={5}
              currentStep={5}
              onBack={() => setView('create-password')}
              onSignIn={() => setView('login')}
              onSubmit={() => {
                setLoggedInAccountType('individual');
                setDisplayName('Solomon');
                setView('dashboard');
              }}
            />
          )}

        </div>
      </main>

      {loginError && (
        <div className="modal-overlay" onClick={() => setLoginError(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon error">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h3>Invalid credentials</h3>
            <p>Please check your email/phone number and password, then try again.</p>
            <button className="modal-button" onClick={() => setLoginError(false)}>Try Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
