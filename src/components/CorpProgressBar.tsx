interface CorpProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function CorpProgressBar({ totalSteps, currentStep }: CorpProgressBarProps) {
  return (
    <div className="corp-progress-bar">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, i) => {
        const completed = step < currentStep;
        const active = step === currentStep;
        return (
          <div className="corp-progress-item" key={step}>
            <div className={`corp-step-circle ${completed ? 'completed' : active ? 'active' : ''}`}>
              {completed ? <CheckIcon /> : step}
            </div>
            {i < totalSteps - 1 && (
              <div className={`corp-progress-line ${completed ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
