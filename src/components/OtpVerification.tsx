import { useState, useRef, useEffect } from 'react';

interface OtpVerificationProps {
  maskedPhone: string;
  onBack: () => void;
  onSuccess: () => void;
}

type Stage = 'otp' | 'details';

export default function OtpVerification({ maskedPhone, onBack, onSuccess }: OtpVerificationProps) {
  const [stage, setStage] = useState<Stage>('otp');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    setError('');

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((val) => !val);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (stage === 'otp') {
      const code = otp.join('');
      if (code === '000000') {
        setError('Invalid OTP. Please enter the correct code sent to your phone.');
        return;
      }
      setError('');
      setStage('details');
      return;
    }

    onSuccess();
  };

  return (
    <div className="bvn-page">
      <div className="bvn-content">
        <div className="bvn-header">
          <h1>OTP Verification</h1>
          <p>Enter the 6-digit code sent to {maskedPhone}</p>
        </div>

        <div className="progress-bar">
          <div className="progress-step completed">
            <div className="step-circle">1</div>
          </div>
          <div className="progress-line completed" />
          <div className="progress-step active">
            <div className="step-circle">2</div>
          </div>
          <div className="progress-line" />
          <div className="progress-step">
            <div className="step-circle">3</div>
          </div>
          <div className="progress-line" />
          <div className="progress-step">
            <div className="step-circle">4</div>
          </div>
          <div className="progress-line" />
          <div className="progress-step">
            <div className="step-circle">5</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-input-group">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="otp-input"
                disabled={stage === 'details'}
              />
            ))}
          </div>

          {stage === 'details' && (
            <>
              <div className="otp-message">
                <p><strong>Phone number verified.</strong> Please provide a few more details to continue.</p>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="home-address">Home Address</label>
                <input
                  id="home-address"
                  type="text"
                  placeholder="Enter your home address"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {error && <p className="otp-error">{error}</p>}

          <div className="otp-actions">
            <button type="button" className="back-button" onClick={onBack}>
              Back
            </button>
            <button type="submit" className="continue-button">
              {stage === 'otp' ? 'VERIFY OTP' : 'CONTINUE'}
            </button>
          </div>
        </form>

        {stage === 'otp' && (
          <p className="resend-link">
            Didn't receive the code? <button type="button" className="resend-button">Resend OTP</button>
          </p>
        )}
      </div>
    </div>
  );
}
