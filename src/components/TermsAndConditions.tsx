import { useState } from 'react';

interface TermsAndConditionsProps {
  onBack: () => void;
  onAccept: () => void;
}

export default function TermsAndConditions({ onBack, onAccept }: TermsAndConditionsProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="bvn-page">
      <div className="bvn-content">
        <div className="bvn-header">
          <h1>Terms & Conditions</h1>
          <p>Please read and accept the terms to continue</p>
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
          <div className="progress-step active">
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

        <div className="terms-container">
          <div className="terms-content">
            <h3>We Value Your Privacy</h3>
            <p>
              At Access Bank Plc (hereinafter called "Access Bank"), we treat your personal
              information as private and confidential. We are dedicated to protecting your
              privacy and providing you with the highest level of security at any point of
              interaction with us. This Privacy Policy describes what personal information we
              collect, what we do with it and how we protect it.
            </p>
            <p>
              This policy (together with our Terms and Conditions) sets out the basis on which
              any personal data we collect from you, or that you provide to us, will be
              processed by us. Please read the following carefully to understand our views and
              practices regarding your personal data and how we will treat it.
            </p>
            <p>
              By continuing to visit our website https://quickbucks.accessbankplc.com/ and
              using our mobile application (QuickBucks) (together the Platforms) as well as
              other sites we own and operate, you accept and consent to the practices
              described in this policy.
            </p>

            <h4>Information We Collect and Use</h4>
            <p>
              We only ask for personal information when we truly need it to provide a service
              to you. We collect it by fair and lawful means, with your knowledge and consent.
              We also let you know why we're collecting it and how it will be used.
            </p>
            <p>
              We collect information about you from a variety of sources, such as: website
              visits, applications, identification documents, personal financial statements,
              interactions with relationship managers, and other third parties and other
              written or electronic communication reflecting information such as your name,
              address, passport details, identification numbers, telephone number, occupation,
              assets, income and any other we deem necessary.
            </p>
            <p>
              We only retain collected information for as long as necessary to provide you with
              your requested service. What data we store, we'll protect within commercially
              acceptable means to prevent loss and theft, as well as unauthorised access,
              disclosure, copying, use or modification.
            </p>

            <h4>Non-Personal Information Collected by Us</h4>
            <p>
              In order to achieve our goal of providing you with the best service, we sometimes
              collect certain information during your visits to perform certain tasks such as
              grant you access to some parts of our web site or conduct research on your
              behaviour on our site in order to improve our services.
            </p>

            <h4>Cookies</h4>
            <p>
              Cookies are small text files stored on your computer or mobile devices whenever
              you visit a website. Access Bank uses cookies to improve your experience while
              on the Platforms. Some cookies are essential to access certain areas of the
              Platforms. We use analytics cookies to help us understand how you use our site.
            </p>

            <h4>Consent for Collection, Use and Disclosure</h4>
            <p>
              Your use of the Platforms and/or registration for the Services constitutes your
              consent to the terms of this Privacy Policy. If you do not agree, you can
              withdraw your consent at any time but please note that we will not be able to
              provide you with our Services.
            </p>

            <h4>Use of Your Personal Information</h4>
            <p>
              The collection and use of Personal Data by Access Bank is guided by certain
              principles and any personal information provided by you to Access Bank will be
              used with your consent, or under the following instances: cases where processing
              of personal data is required for the fulfilment of a contractual obligation;
              compliance with legal and/or regulatory requirements; to protect your vital
              interest; for an activity carried in significant public interest; or for
              legitimate interests of Access Bank or a third party.
            </p>
            <p>
              With your consent, your personal information is used in: updating and enhancing
              Access Bank's records; executing your instructions; establishing your identity
              and assessing applications; pricing and designing products and services;
              administering products and services; managing our relationship with you; managing
              our risks; identifying and investigating illegal activity such as fraud;
              contacting you where we suspect fraud; conducting and improving our businesses;
              preventing money laundering or terrorism financing; complying with legal
              obligations; identifying and informing you about other products or services; and
              processing your job application if you apply for a job with us.
            </p>

            <h4>Automated Processing</h4>
            <p>
              We sometimes use automated systems and software to help us reach decisions about
              you, for example, to carry out security, fraud and money laundering checks, or to
              process your data when you apply for some of our products and services. You can
              contact us to request that automated processing be reviewed by a human being if
              you detect any inaccuracies in your personal data.
            </p>

            <h4>Information We Share</h4>
            <p>
              We may share the information about you and your dealings with us, to the extent
              permitted by law and in accordance with our legal obligations under the Nigerian
              Data Protection Regulation (NDPR), with: employees, independent contractors,
              subsidiaries, affiliates, consultants, business associates, service providers,
              suppliers and agents; regulators/supervisors, government agencies/courts;
              external auditors; and Access Bank's strategic partners/service providers for the
              purpose of improving and providing our products and services to you.
            </p>

            <h4>How We Protect Your Information</h4>
            <p>
              We take appropriate technical and organizational measures to prevent loss,
              unauthorized access, misuse, modification or disclosure of information under our
              control. This may include the use of encryption, access controls and other forms
              of security to ensure that your data is protected. Our security controls and
              processes are also regularly updated to meet and exceed industry standards.
            </p>

            <h4>Where We Store Your Information</h4>
            <p>
              All Personal Information you provide to us is stored on our secure servers as
              well as secure physical locations and cloud infrastructure. We may also
              subcontract processing or storage of information to third parties and the data
              that we collect from you may be transferred to and stored at a destination
              outside Nigeria or the European Economic Area. Whenever your information is
              transferred to another location, we will take all necessary steps to ensure that
              your data is handled securely.
            </p>

            <h4>How Long We Store Your Information</h4>
            <p>
              We retain your data for as long as is necessary for the business and/or legal
              purposes that it was collected. We only retain information that allows us to
              comply with legal and regulatory requests, meet business and audit requirements,
              respond to complaints and queries, or address disputes or claims.
            </p>

            <h4>Your Rights</h4>
            <p>
              You have certain rights available to you, including: the right to access your
              personal information held by us (by emailing compliance@accessbankplc.com); the
              right to rectify inaccurate or incomplete information; withdraw consent for
              processing; restrict or object to processing of your personal data; lodge a
              formal complaint with the appropriate supervisory authority; request that your
              personal data be made available in a common electronic format; and request that
              your information be erased.
            </p>

            <h4>Third-Party Sites and Services</h4>
            <p>
              Access Bank's websites, products, applications, and services may contain links
              to third-party websites, products and services. Information collected by third
              parties is governed by their privacy practices and Access Bank will not be
              liable for any breach of confidentiality or privacy of your information on such
              sites.
            </p>

            <h4>Privacy of Children</h4>
            <p>
              Access Bank respects the privacy of children. We do not knowingly collect names,
              email addresses or any other personally identifiable information from children.
              We do not knowingly market to children nor do we allow children under 18 to open
              online accounts.
            </p>

            <h4>Contact</h4>
            <p>
              Questions, comments, and requests regarding this privacy policy are welcomed and
              should be addressed to compliance@AccessBank.ng
            </p>
          </div>

          <label className="terms-checkbox">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>I have read and agree to the Terms and Conditions</span>
          </label>
        </div>

        <div className="otp-actions">
          <button type="button" className="back-button" onClick={onBack}>
            Back
          </button>
          <button
            type="button"
            className="continue-button"
            disabled={!accepted}
            onClick={onAccept}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
