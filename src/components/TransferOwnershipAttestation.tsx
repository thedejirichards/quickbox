import DocumentAttestation from './DocumentAttestation';

interface TransferOwnershipAttestationProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  readOnly?: boolean;
}

export default function TransferOwnershipAttestation({ checked, onChange, readOnly = false }: TransferOwnershipAttestationProps) {
  return (
    <DocumentAttestation
      fieldLabel="Blank transfer of ownership"
      attestationText="I attest to the Deed of Transfer of Ownership below"
      accordionTitle="TRANSFER OF OWNERSHIP"
      checked={checked}
      onChange={onChange}
      readOnly={readOnly}
    >
      <p>
        THIS DEED OF TRANSFER OF OWNERSHIP is made this <em>__________</em> day of{' '}
        <em>________</em> 2024 between ACCESS BANK PLC a company incorporated in Nigeria and
        having its registered office at 14/15 Prince Alaba Abiodun Oniru Rd, Victoria Island,
        Lagos State of Nigeria (hereinafter referred to as &ldquo;the transferee&rdquo; which
        expression shall where the context so admits include its successors-in-title and
        assigns) of the one part and ______________________________ of
        __________________________ (hereinafter referred to as &ldquo;the transferor&rdquo;
        which expression shall where the context so admits include his successors-in-title and
        assigns) of the other part.
      </p>

      <p className="toa-clause-label">WHEREAS:</p>
      <ol>
        <li>
          The Transferee approved that ACCESS BANK PLC (Hereinafter called the
          &ldquo;Company&rdquo;) be availed a =N= xxxxxx (Insert Amount in words) Facility
          (hereinafter referred to as &ldquo;The Facility&rdquo;);
        </li>
        <li>
          The Transferor has agreed to transfer his interest and ownership of the following
          assets as collateral for the facility availed the Company:
        </li>
      </ol>

      <p>
        THIS DEED THEREFORE WITNESSETH that in consideration of the agreement between the
        parties for the transfer of ownership of the above recited assets, the Transferor on
        behalf of the Company hereby transfers ownership to the Transferee and irrevocably
        authorizes the Transferee to deal with the assets as the Transferee may from time to
        time deem fit, including but not limited to, the sale of the assets by the Transferee.
      </p>

      <p>
        IN ADDITION, HERETO The Transferor undertakes to obtain all necessary approvals from
        relevant authorities to implement the transfer herein provided to the Transferee.
      </p>

      <p className="toa-signature-block">
        Dated this _______ Day of ________ 2024
        <br />
        <br />
        Signed, Sealed and Delivered by the within-named &ldquo;Transferor&rdquo;
        <br />
        __________________________________
        <br />
        <br />
        In the presence of;
        <br />
        Name: _____________________
        <br />
        Address: _______________________
        <br />
        Occupation: ______________
        <br />
        Signature: _____________________
      </p>
    </DocumentAttestation>
  );
}
