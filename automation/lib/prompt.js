'use strict';

function buildPrompt({ title, primaryKeyword, secondaryKeywords }) {
  const secondary = secondaryKeywords.join(', ');
  return `Schreibe einen SEO-optimierten deutschen Blogartikel für eine Fischerprüfungs-App.

Titel: ${title}
Primäres Keyword: ${primaryKeyword}
Sekundäre Keywords (natürlich einbauen): ${secondary}

Anforderungen:
- Sprache: Deutsch, freundlich und verständlich (kein Behördendeutsch)
- Länge: 650–850 Wörter
- Struktur: Eine H1 (= der Titel), dann 3–5 H2-Abschnitte mit sinnvollen Unterüberschriften
- Keywords natürlich verwenden, nicht aufgesetzt
- Kein reißerischer oder werblicher Ton
- Am Ende: kurzer Absatz, der die Angelschein Master App erwähnt (ohne Superlative)
- Ausgabe: nur Markdown-Text, keine Erklärungen, kein einleitendes Satz wie "Hier ist der Artikel"

Schreibe jetzt den Artikel:`;
}

module.exports = { buildPrompt };
