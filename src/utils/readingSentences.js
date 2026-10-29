const abbreviation = /(?:\b(?:mr|mrs|ms|dr|prof|sr|jr|st|vs)|\b[A-Z])\.$/i;

// Keep sentence text, punctuation and whitespace intact. This is a presentation
// projection; canonical content and saved assignment/attempt snapshots never change.
export function buildReadingSentences(content, Segmenter = globalThis.Intl?.Segmenter) {
  const segmenter = Segmenter ? new Segmenter('en', { granularity: 'sentence' }) : null;
  let ordinal = 0;
  return String(content || '').split(/\r?\n(?:[ \t]*\r?\n)+/).map(text => text.trim()).filter(Boolean)
    .map((text, paragraphIndex) => {
      const parts = [];
      if (segmenter) parts.push(...Array.from(segmenter.segment(text), entry => entry.segment));
      else {
        let start = 0;
        for (const match of text.matchAll(/[.!?]+["'”’)\]]*(?:\s+|$)/g)) {
          const end = match.index + match[0].length;
          if (end < text.length && abbreviation.test(text.slice(start, end).trim())) continue;
          parts.push(text.slice(start, end)); start = end;
        }
        if (start < text.length) parts.push(text.slice(start));
      }
      const sentences = [];
      for (const part of parts) {
        if (!part.trim()) continue;
        const previous = sentences.at(-1);
        if (previous && abbreviation.test(previous.text.trim())) previous.text += part;
        else sentences.push({ id: `p${paragraphIndex}-s${sentences.length}`, ordinal: ++ordinal, text: part });
      }
      return { id: `p${paragraphIndex}`, text, sentences };
    });
}
