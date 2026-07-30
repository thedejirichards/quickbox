import { useState, useRef, useEffect } from 'react';
import CorpProgressBar from './CorpProgressBar';

interface CorporateOtpVerificationProps {
  maskedPhone: string;
  onBack: () => void;
  onNext: () => void;
}

const OTP_VALIDITY_SECONDS = 5 * 60;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function CorporateOtpVerification({ maskedPhone, onBack, onNext }: CorporateOtpVerificationProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(OTP_VALIDITY_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isExpired = secondsLeft <= 0;
  const otpComplete = otp.every((digit) => digit !== '');

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
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

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setSecondsLeft(OTP_VALIDITY_SECONDS);
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code === '000000') {
      setError('Invalid OTP. Please enter the correct code sent to your phone.');
      return;
    }
    onNext();
  };

  return (
    <div className="bvn-page">
      <div className="bvn-content">
        <CorpProgressBar totalSteps={4} currentStep={2} />

        <div className="bvn-header">
          <h1>OTP verification</h1>
          <p>
            A One Time Password (OTP) has been sent to your corporate phone number{' '}
            <span className="corp-otp-phone">{maskedPhone}</span>
          </p>
        </div>

        <div className="corp-otp-timer">
          <span>OTP expires after 5 minutes</span>
          <span className="corp-otp-countdown">{formatTime(secondsLeft)}</span>
        </div>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="form-group">
            <label htmlFor="corp-otp-0">OTP</label>
            <div className="otp-input-group">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={index === 0 ? 'corp-otp-0' : undefined}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="otp-input"
                  disabled={isExpired}
                />
              ))}
            </div>
            <p className="corp-otp-hint">Enter the 6 digit OTP above</p>
          </div>

          {error && <p className="otp-error">{error}</p>}
          {isExpired && !error && (
            <p className="otp-error">Your OTP has expired. Please resend to continue.</p>
          )}

          <div className="otp-actions">
            <button type="button" className="back-button" onClick={onBack}>
              PREVIOUS
            </button>
            <button type="submit" className="continue-button" disabled={!otpComplete || isExpired}>
              NEXT
            </button>
          </div>
        </form>

        <div className="corp-resend-block">
          <p>Didn&apos;t get an OTP?</p>
          <button type="button" className="corp-resend-btn" onClick={handleResend}>
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}
