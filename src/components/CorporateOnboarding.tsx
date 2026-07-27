interface CorporateOnboardingProps {
  onBack: () => void;
}

const steps = [
  'Log in to PrimusPlus using your corporate credentials.',
  'Initiate and submit a Vehicle Finance Request.',
  "Your request will go through your organization's approval workflow.",
  'Once approved, your QuickBucks profile will be created or activated.',
  'You will receive an email containing your QuickBucks login credentials and a link to create your password.',
  'After creating your password and accepting the Terms & Conditions, you can log in to QuickBucks and start using the platform.',
];

const PRIMUS_PLUS_URL = 'https://www.accessbankplc.com/primus/';

export default function CorporateOnboarding({ onBack }: CorporateOnboardingProps) {
  return (
    <div className="bvn-page corporate-page">
      <div className="bvn-content">
        <div className="bvn-header">
          <h1>Corporate Customer Onboarding</h1>
          <p>Complete Your Onboarding on PrimusPlus</p>
        </div>

        <p className="corporate-intro">
          Corporate (B2B/B2G) customers are onboarded through <strong>PrimusPlus</strong>,
          Access Bank's corporate banking platform.
        </p>

        <div className="corporate-steps-card">
          <h3>Here's how the process works</h3>
          <ol className="corporate-steps">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="corporate-cta">
          <p className="corporate-ready">Ready to continue?</p>
          <a
            href={PRIMUS_PLUS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="continue-button corporate-proceed-btn"
          >
            Proceed to PrimusPlus
          </a>
        </div>

        <button type="button" className="back-button" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
