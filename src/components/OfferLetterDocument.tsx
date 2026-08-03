import { OFFER_LETTER_TEXT } from './offerLetterContent';

function isHeadingLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 65) return false;
  const letters = trimmed.replace(/[^A-Za-z]/g, '');
  if (letters.length < 3) return false;
  return letters === letters.toUpperCase();
}

export default function OfferLetterDocument() {
  const lines = OFFER_LETTER_TEXT.split('\n');

  return (
    <div className="ol-doc">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="ol-doc-gap" />;
        if (isHeadingLine(line)) {
          return <p key={i} className="ol-doc-heading">{line.trim()}</p>;
        }
        return <p key={i} className="ol-doc-line">{line}</p>;
      })}
    </div>
  );
}
