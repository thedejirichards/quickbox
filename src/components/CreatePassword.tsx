import { useState } from 'react';

interface CreatePasswordProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function CreatePassword({ onBack, onComplete }: CreatePasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    onComplete();
  };

  return (
    <div className="bvn-page">
      <div className="bvn-content">
        <div className="bvn-header">
          <h1>Create Password</h1>
          <p>Set a secure password for your account</p>
        </div>

        <div className="progress-bar">
          <div className="progress-step completed">
            <div className="step-circle">1</div>
          </div>
          <div className="progress-line completed" />
          <div className="progress-step completed">
            <div className="step-circle">2</div>
          </div>
          <div className="progress-line completed" />
          <div className="progress-step completed">
            <div className="step-circle">3</div>
          </div>
          <div className="progress-line completed" />
          <div className="progress-step active">
            <div className="step-circle">4</div>
          </div>
          <div className="progress-line" />
          <div className="progress-step">
            <div className="step-circle">5</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bvn-form">
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <div className="password-wrapper">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
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

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="password-wrapper">
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? (
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

          {error && <p className="otp-error">{error}</p>}

          <div className="otp-actions">
            <button type="button" className="back-button" onClick={onBack}>
              Back
            </button>
            <button type="submit" className="continue-button">
              NEXT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
