import { useState } from 'react';
import KybInformation from './KybInformation';
import KybDocumentUpload from './KybDocumentUpload';

interface KybFlowProps {
  onBack: () => void;
  onSubmit: () => void;
}

export default function KybFlow({ onBack, onSubmit }: KybFlowProps) {
  const [step, setStep] = useState<'info' | 'documents'>('info');

  return (
    <>
      <div style={{ display: step === 'info' ? 'contents' : 'none' }}>
        <KybInformation onBack={onBack} onContinue={() => setStep('documents')} />
      </div>
      <div style={{ display: step === 'documents' ? 'contents' : 'none' }}>
        <KybDocumentUpload onBack={() => setStep('info')} onSubmit={onSubmit} />
      </div>
    </>
  );
}
