# SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add structured data + FAQ to the landing page, set up a Jekyll blog, and build a Claude+Cron pipeline that auto-publishes SEO-optimized German blog posts weekly.

**Architecture:** Three independent layers — (1) static landing page improvements (schema + FAQ injected into `index.html`), (2) Jekyll blog on the same GitHub Pages repo with shared nav/footer, (3) Node.js automation script triggered weekly by GitHub Actions that calls Claude API + Unsplash API and commits a Markdown post.

**Tech Stack:** Jekyll (GitHub Pages native), Node.js 20, `@anthropic-ai/sdk`, Unsplash API, GitHub Actions

---

## File Map

**Modified:**
- `index.html` — add two JSON-LD `<script>` blocks in `<head>`, add FAQ `<section>` + CSS before `<!-- FOOTER -->`

**Created:**
- `_config.yml` — Jekyll site config
- `_layouts/default.html` — shared nav + footer layout for blog pages
- `_layouts/post.html` — blog post layout (extends default)
- `blog/index.html` — blog listing page at `/blog`
- `_data/post-queue.json` — topic queue for automation
- `automation/package.json`
- `automation/generate-post.js` — main automation entry point
- `automation/lib/queue.js` — queue read/write helpers
- `automation/lib/formatter.js` — Markdown frontmatter builder
- `automation/lib/prompt.js` — Claude prompt builder
- `automation/lib/unsplash.js` — Unsplash API fetch
- `automation/__tests__/queue.test.js`
- `automation/__tests__/formatter.test.js`
- `automation/__tests__/prompt.test.js`
- `.github/workflows/weekly-post.yml` — GitHub Actions cron

---

## Task 1: Add JSON-LD Schema to index.html

**Files:**
- Modify: `index.html` (inside `<head>`, after `<link rel="icon">` on line 22)

- [ ] **Step 1: Insert SoftwareApplication + FAQPage JSON-LD blocks**

Add immediately before `</head>` (line 346 in current file, after the closing `</style>` tag):

```html
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Angelschein Master",
    "operatingSystem": "iOS",
    "applicationCategory": "EducationApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "description": "Bereite dich mit über 2.800 offiziellen Prüfungsfragen auf die Fischerprüfung vor. Bayern, Baden-Württemberg, Hamburg und Thüringen.",
    "url": "https://angel-schein.online"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Was ist der Angelschein?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Der Angelschein (offiziell: Fischereierlaubnisschein oder Fischereischein) berechtigt in Deutschland zum Angeln in öffentlichen Gewässern. Er wird nach bestandener Fischerprüfung ausgestellt und gilt in dem jeweiligen Bundesland."
        }
      },
      {
        "@type": "Question",
        "name": "Wie schwer ist die Fischerprüfung?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die Fischerprüfung gilt als moderat schwer. Mit gezielter Vorbereitung über 2–4 Wochen bestehen die meisten Kandidaten beim ersten Versuch. Die Durchfallquote liegt je nach Bundesland bei etwa 20–30%."
        }
      },
      {
        "@type": "Question",
        "name": "Wie lange lernt man für den Angelschein?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die meisten Kandidaten bereiten sich 2–6 Wochen vor. Mit einer guten App oder Lernkarten und täglichem Üben von 30–60 Minuten ist die Prüfung gut zu schaffen."
        }
      },
      {
        "@type": "Question",
        "name": "Wie viele Fragen kommen in der Prüfung?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die Anzahl der Prüfungsfragen variiert je nach Bundesland. In Bayern sind es 30 Fragen, in Hamburg 60. Üblicherweise dürfen maximal 20–33% der Fragen falsch beantwortet werden."
        }
      },
      {
        "@type": "Question",
        "name": "Was kostet der Angelschein in Deutschland?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die Prüfungsgebühr liegt je nach Bundesland zwischen 20 und 80 Euro. Hinzu kommt der Jahresfischereischein, der weitere 10–50 Euro kostet."
        }
      },
      {
        "@type": "Question",
        "name": "Welche Themen kommen in der Prüfung vor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die Fischerprüfung deckt fünf Hauptbereiche ab: Fischkunde, Gewässerkunde, Gerätekunde, Natur- und Umweltschutz sowie gesetzliche Grundlagen."
        }
      },
      {
        "@type": "Question",
        "name": "Kann ich die Prüfung auf Englisch ablegen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In den meisten Bundesländern wird die Prüfung nur auf Deutsch angeboten. Einige Bundesländer erlauben jedoch einen Dolmetscher. Die Angelschein Master App bietet englische Übersetzungen zum Lernen."
        }
      },
      {
        "@type": "Question",
        "name": "Wie oft kann man die Prüfung wiederholen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die Fischerprüfung kann beliebig oft wiederholt werden. Es gibt keine Beschränkung bei der Anzahl der Versuche. Zwischen den Versuchen liegt je nach Bundesland eine Wartezeit von einigen Wochen."
        }
      }
    ]
  }
  </script>
```

- [ ] **Step 2: Validate schema with Google's Rich Results Test**

Open https://search.google.com/test/rich-results in a browser, paste the full `index.html` content, and confirm both `SoftwareApplication` and `FAQPage` are detected without errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website
git add index.html
git commit -m "feat: add SoftwareApplication and FAQPage JSON-LD schema"
```

---

## Task 2: Add FAQ Section to index.html

**Files:**
- Modify: `index.html` — add CSS in `<style>` block, add `<section>` before `<!-- FOOTER -->`

- [ ] **Step 1: Add FAQ CSS**

Inside the `<style>` block, add before the closing `</style>` tag (after the `@media` block at line ~344):

```css
    /* ── FAQ ── */
    .faq-section {
      background: var(--white);
      padding: 72px 24px;
    }
    .faq-inner {
      max-width: 760px;
      margin: 0 auto;
    }
    .faq-section h2 {
      font-size: 28px;
      font-weight: 800;
      color: var(--primary);
      text-align: center;
      margin-bottom: 40px;
    }
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .faq-item {
      border: 1.5px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    .faq-item summary {
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
      padding: 18px 20px;
      cursor: pointer;
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }
    .faq-item summary::-webkit-details-marker { display: none; }
    .faq-item summary::after {
      content: '+';
      font-size: 22px;
      color: var(--primary);
      font-weight: 300;
      flex-shrink: 0;
      margin-left: 12px;
    }
    .faq-item[open] summary::after { content: '−'; }
    .faq-item p {
      font-size: 15px;
      color: var(--muted);
      line-height: 1.7;
      padding: 0 20px 18px;
      margin: 0;
    }
```

- [ ] **Step 2: Add FAQ HTML section**

Add the following block between `<!-- CTA -->` section (ends at line 477) and `<!-- FOOTER -->` (line 479):

```html
<!-- FAQ -->
<section class="faq-section">
  <div class="faq-inner">
    <h2>Häufige Fragen zum Angelschein</h2>
    <div class="faq-list">

      <details class="faq-item">
        <summary>Was ist der Angelschein?</summary>
        <p>Der Angelschein (offiziell: Fischereierlaubnisschein oder Fischereischein) berechtigt in Deutschland zum Angeln in öffentlichen Gewässern. Er wird nach bestandener Fischerprüfung ausgestellt und gilt in dem jeweiligen Bundesland.</p>
      </details>

      <details class="faq-item">
        <summary>Wie schwer ist die Fischerprüfung?</summary>
        <p>Die Fischerprüfung gilt als moderat schwer. Mit gezielter Vorbereitung über 2–4 Wochen bestehen die meisten Kandidaten beim ersten Versuch. Die Durchfallquote liegt je nach Bundesland bei etwa 20–30%.</p>
      </details>

      <details class="faq-item">
        <summary>Wie lange lernt man für den Angelschein?</summary>
        <p>Die meisten Kandidaten bereiten sich 2–6 Wochen vor. Mit einer guten App oder Lernkarten und täglichem Üben von 30–60 Minuten ist die Prüfung gut zu schaffen.</p>
      </details>

      <details class="faq-item">
        <summary>Wie viele Fragen kommen in der Prüfung?</summary>
        <p>Die Anzahl der Prüfungsfragen variiert je nach Bundesland. In Bayern sind es 30 Fragen, in Hamburg 60. Üblicherweise dürfen maximal 20–33% der Fragen falsch beantwortet werden.</p>
      </details>

      <details class="faq-item">
        <summary>Was kostet der Angelschein in Deutschland?</summary>
        <p>Die Prüfungsgebühr liegt je nach Bundesland zwischen 20 und 80 Euro. Hinzu kommt der Jahresfischereischein, der weitere 10–50 Euro kostet.</p>
      </details>

      <details class="faq-item">
        <summary>Welche Themen kommen in der Prüfung vor?</summary>
        <p>Die Fischerprüfung deckt fünf Hauptbereiche ab: Fischkunde, Gewässerkunde, Gerätekunde, Natur- und Umweltschutz sowie gesetzliche Grundlagen.</p>
      </details>

      <details class="faq-item">
        <summary>Kann ich die Prüfung auf Englisch ablegen?</summary>
        <p>In den meisten Bundesländern wird die Prüfung nur auf Deutsch angeboten. Einige Bundesländer erlauben jedoch einen Dolmetscher. Die Angelschein Master App bietet englische Übersetzungen zum Lernen.</p>
      </details>

      <details class="faq-item">
        <summary>Wie oft kann man die Prüfung wiederholen?</summary>
        <p>Die Fischerprüfung kann beliebig oft wiederholt werden. Es gibt keine Beschränkung bei der Anzahl der Versuche. Zwischen den Versuchen liegt je nach Bundesland eine Wartezeit von einigen Wochen.</p>
      </details>

    </div>
  </div>
</section>
```

- [ ] **Step 3: Open index.html in a browser and verify**

Open `index.html` locally. Confirm:
- FAQ section appears after the CTA section
- Each item expands/collapses on click
- `+` changes to `−` when open

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add FAQ section with accordion UI"
```

---

## Task 3: Set Up Jekyll

**Files:**
- Create: `_config.yml`
- Create: `_layouts/default.html`
- Create: `_layouts/post.html`
- Create: `blog/index.html`

- [ ] **Step 1: Create `_config.yml`**

```yaml
title: Angelschein Master
description: Bereite dich mit über 2.800 offiziellen Prüfungsfragen auf die Fischerprüfung vor.
url: "https://angel-schein.online"
baseurl: ""
permalink: /blog/:year/:month/:slug/
plugins:
  - jekyll-sitemap
markdown: kramdown
kramdown:
  input: GFM
exclude:
  - automation/
  - node_modules/
  - docs/
  - package.json
  - package-lock.json
```

- [ ] **Step 2: Create `_layouts/default.html`**

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{ page.title }} | Angelschein Master</title>
  <meta name="description" content="{{ page.description }}" />
  <link rel="canonical" href="{{ page.url | prepend: site.url }}" />
  <link rel="icon" type="image/png" href="/icon.png" />
  <style>
    :root {
      --primary: #1a5276;
      --accent: #27ae60;
      --bg: #f0f4f8;
      --white: #ffffff;
      --text: #2c3e50;
      --muted: #7f8c8d;
      --border: #dce8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    a { color: var(--primary); text-decoration: none; }
    a:hover { text-decoration: underline; }
    nav { background: var(--primary); padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; }
    nav .logo { display: flex; align-items: center; gap: 10px; color: white; font-size: 18px; font-weight: 700; text-decoration: none; }
    nav .logo img { width: 36px; height: 36px; border-radius: 8px; }
    nav a.cta-nav { background: white; color: var(--primary); padding: 8px 18px; border-radius: 20px; font-size: 14px; font-weight: 700; }
    nav a.cta-nav:hover { text-decoration: none; opacity: 0.9; }
    footer { background: #0d2c3e; color: rgba(255,255,255,0.5); padding: 32px 24px; text-align: center; font-size: 13px; }
    footer .footer-links { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
    footer a { color: rgba(255,255,255,0.6); }
    footer a:hover { color: white; }
  </style>
</head>
<body>
<nav>
  <a href="/" class="logo">
    <img src="/icon.png" alt="Angelschein Master" />
    Angelschein Master
  </a>
  <a href="/#download" class="cta-nav">Kostenlos laden</a>
</nav>
{{ content }}
<footer>
  <div class="footer-links">
    <a href="/datenschutz.html">Datenschutzerklärung</a>
    <a href="/nutzungsbedingungen.html">Nutzungsbedingungen</a>
    <a href="/support.html">Support</a>
  </div>
  <p>© 2026 YCApps UG (haftungsbeschränkt). Alle Rechte vorbehalten.</p>
</footer>
</body>
</html>
```

- [ ] **Step 3: Create `_layouts/post.html`**

```html
---
layout: default
---
<style>
  .post-hero { width: 100%; max-height: 420px; object-fit: cover; display: block; }
  .post-content { max-width: 760px; margin: 0 auto; padding: 48px 24px 80px; }
  .post-content h1 { font-size: clamp(24px, 4vw, 36px); font-weight: 800; color: var(--primary); margin-bottom: 8px; line-height: 1.2; }
  .post-meta { font-size: 13px; color: var(--muted); margin-bottom: 32px; display: block; }
  .post-content h2 { font-size: 22px; font-weight: 700; color: var(--primary); margin: 36px 0 12px; }
  .post-content p { font-size: 16px; color: var(--text); line-height: 1.8; margin-bottom: 16px; }
  .post-content ul, .post-content ol { padding-left: 20px; margin-bottom: 16px; }
  .post-content li { font-size: 16px; color: var(--text); line-height: 1.8; margin-bottom: 6px; }
  .post-cta { background: var(--primary); border-radius: 16px; padding: 32px 24px; text-align: center; margin-top: 48px; }
  .post-cta p { color: rgba(255,255,255,0.8); margin-bottom: 16px; font-size: 15px; }
  .post-cta a { display: inline-block; background: white; color: var(--primary); font-weight: 800; font-size: 16px; padding: 14px 28px; border-radius: 12px; }
  .post-cta a:hover { text-decoration: none; opacity: 0.9; }
</style>

{% if page.image %}
<img src="{{ page.image }}" alt="{{ page.title }}" class="post-hero" />
{% endif %}
<div class="post-content">
  <h1>{{ page.title }}</h1>
  <time class="post-meta">{{ page.date | date: "%d. %B %Y" }}</time>
  {{ content }}
  <div class="post-cta">
    <p>Jetzt mit der Angelschein Master App für die Prüfung lernen – kostenlos und ohne Anmeldung.</p>
    <a href="/#download">Im App Store laden →</a>
  </div>
</div>
```

- [ ] **Step 4: Create `blog/index.html`**

```html
---
layout: default
title: Blog – Tipps rund um den Angelschein
description: Guides, Tipps und Prüfungswissen rund um den Angelschein und die Fischerprüfung in Deutschland.
---
<style>
  .blog-header { background: var(--primary); color: white; padding: 48px 24px; text-align: center; }
  .blog-header h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
  .blog-header p { opacity: 0.8; font-size: 16px; }
  .blog-list { max-width: 760px; margin: 0 auto; padding: 48px 24px; display: flex; flex-direction: column; gap: 24px; }
  .blog-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1.5px solid var(--border); }
  .blog-card img { width: 100%; height: 200px; object-fit: cover; display: block; }
  .blog-card-body { padding: 20px 24px 24px; }
  .blog-card h2 { font-size: 18px; font-weight: 700; color: var(--primary); margin-bottom: 6px; }
  .blog-card h2 a { color: inherit; }
  .blog-card h2 a:hover { text-decoration: underline; }
  .blog-card time { font-size: 12px; color: var(--muted); display: block; margin-bottom: 8px; }
  .blog-card p { font-size: 14px; color: var(--muted); line-height: 1.6; }
  .blog-empty { text-align: center; color: var(--muted); padding: 48px 0; font-size: 16px; }
</style>

<div class="blog-header">
  <h1>Angelschein Blog</h1>
  <p>Tipps, Guides und Wissen rund um die Fischerprüfung in Deutschland</p>
</div>
<div class="blog-list">
  {% if site.posts.size == 0 %}
  <p class="blog-empty">Bald verfügbar – schau bald wieder vorbei!</p>
  {% endif %}
  {% for post in site.posts %}
  <article class="blog-card">
    {% if post.image %}
    <img src="{{ post.image }}" alt="{{ post.title }}" loading="lazy" />
    {% endif %}
    <div class="blog-card-body">
      <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
      <time>{{ post.date | date: "%d. %B %Y" }}</time>
      {% if post.description %}<p>{{ post.description }}</p>{% endif %}
    </div>
  </article>
  {% endfor %}
</div>
```

- [ ] **Step 5: Create `_posts/` directory with a `.gitkeep`**

```bash
mkdir -p /Users/ku3ub/Documents/GitHub/angelschein-website/_posts
touch /Users/ku3ub/Documents/GitHub/angelschein-website/_posts/.gitkeep
```

- [ ] **Step 6: Commit Jekyll setup**

```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website
git add _config.yml _layouts/ blog/ _posts/
git commit -m "feat: set up Jekyll blog with shared layout"
```

- [ ] **Step 7: Verify GitHub Pages builds successfully**

Push and wait ~60 seconds:
```bash
git push origin main
```
Then open https://angel-schein.online/blog — confirm the blog index page loads with the correct nav and footer. If GitHub Pages shows a build error, check the Actions tab in the GitHub repo.

---

## Task 4: Create Post Queue

**Files:**
- Create: `_data/post-queue.json`

- [ ] **Step 1: Create `_data/` directory and queue file**

```bash
mkdir -p /Users/ku3ub/Documents/GitHub/angelschein-website/_data
```

Create `_data/post-queue.json`:

```json
[
  {
    "status": "pending",
    "title": "Angelschein Bayern: Alles was du wissen musst",
    "slug": "angelschein-bayern-guide",
    "primaryKeyword": "Angelschein Bayern",
    "secondaryKeywords": ["Fischerprüfung Bayern", "Angelschein Bayern bestehen", "Fischerprüfung Bayern Fragen"],
    "unsplashQuery": "fishing bavaria germany lake",
    "description": "Alles Wichtige zum Angelschein in Bayern: Prüfungsablauf, Kosten, Themen und Tipps."
  },
  {
    "status": "pending",
    "title": "Fischerprüfung Hamburg bestehen – Tipps und Ablauf",
    "slug": "fischerprufung-hamburg",
    "primaryKeyword": "Fischerprüfung Hamburg",
    "secondaryKeywords": ["Angelschein Hamburg", "Fischerprüfung Hamburg Fragen", "Angelschein Hamburg kosten"],
    "unsplashQuery": "fishing harbor germany water",
    "description": "So läuft die Fischerprüfung in Hamburg ab: Anmeldung, Kosten, Themen und die häufigsten Fehler."
  },
  {
    "status": "pending",
    "title": "Angelschein Baden-Württemberg: So bereitest du dich vor",
    "slug": "angelschein-baden-wurttemberg",
    "primaryKeyword": "Angelschein Baden-Württemberg",
    "secondaryKeywords": ["Fischerprüfung Baden-Württemberg", "Angelschein BW bestehen", "Angelprüfung Baden-Württemberg"],
    "unsplashQuery": "fishing black forest germany river",
    "description": "Der komplette Guide zur Fischerprüfung in Baden-Württemberg: Ablauf, Prüfungsthemen und Lerntipps."
  },
  {
    "status": "pending",
    "title": "Fischerprüfung Thüringen – Was du wissen musst",
    "slug": "fischerprufung-thuringen",
    "primaryKeyword": "Fischerprüfung Thüringen",
    "secondaryKeywords": ["Angelschein Thüringen", "Angelschein Thüringen bestehen", "Fischerprüfung Thüringen Fragen"],
    "unsplashQuery": "fishing thuringia germany forest river",
    "description": "Alles zur Fischerprüfung in Thüringen: Anmeldeablauf, Lernthemen, Kosten und praktische Tipps."
  },
  {
    "status": "pending",
    "title": "Fischkunde für die Angelprüfung: Die wichtigsten Fischarten",
    "slug": "fischkunde-angelprufung-fischarten",
    "primaryKeyword": "Fischkunde Angelprüfung",
    "secondaryKeywords": ["Fischarten Fischerprüfung", "Fischkunde lernen Angelschein", "Prüfungsfragen Fischkunde"],
    "unsplashQuery": "freshwater fish germany river",
    "description": "Welche Fischarten musst du für die Angelprüfung kennen? Die wichtigsten Arten kompakt erklärt."
  },
  {
    "status": "pending",
    "title": "Die häufigsten Fehler bei der Fischerprüfung – und wie du sie vermeidest",
    "slug": "haufigste-fehler-fischerprufung",
    "primaryKeyword": "Fischerprüfung Fehler",
    "secondaryKeywords": ["Fischerprüfung nicht bestanden", "Fischerprüfung Tipps", "Angelschein Prüfung vorbereiten"],
    "unsplashQuery": "study learning preparation exam",
    "description": "Das sind die typischen Fehler, die beim Angelschein zum Durchfallen führen – und wie du sie von Anfang an vermeidest."
  },
  {
    "status": "pending",
    "title": "Gewässerkunde für den Angelschein: Was du wissen musst",
    "slug": "gewasserkunde-angelschein",
    "primaryKeyword": "Gewässerkunde Angelschein",
    "secondaryKeywords": ["Gewässerkunde Fischerprüfung", "Gewässer Prüfungsfragen", "Ökologie Angelschein"],
    "unsplashQuery": "german river lake ecology water",
    "description": "Gewässerkunde ist ein zentrales Thema der Fischerprüfung. Hier erfährst du, was du dazu wissen musst."
  },
  {
    "status": "pending",
    "title": "Angelschein mit Kind: Ab welchem Alter ist Angeln erlaubt?",
    "slug": "angelschein-mit-kind-alter",
    "primaryKeyword": "Angelschein Kind",
    "secondaryKeywords": ["Angelschein Mindestalter", "Kind angeln Deutschland", "Jugendlicher Angelschein"],
    "unsplashQuery": "child fishing river family",
    "description": "Ab welchem Alter darf man in Deutschland angeln? Was gilt für Kinder und Jugendliche beim Angelschein?"
  }
]
```

- [ ] **Step 2: Commit**

```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website
git add _data/post-queue.json
git commit -m "feat: add blog post queue with 8 topics"
```

---

## Task 5: Set Up Automation Package

**Files:**
- Create: `automation/package.json`

- [ ] **Step 1: Create `automation/package.json`**

```json
{
  "name": "angelschein-blog-automation",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "generate": "node generate-post.js",
    "test": "jest --testEnvironment node"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website/automation
npm install
```

Expected: `node_modules/` created, `package-lock.json` generated.

- [ ] **Step 3: Commit**

```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website
git add automation/package.json automation/package-lock.json
git commit -m "feat: add automation package with Anthropic SDK and Jest"
```

---

## Task 6: Build and Test `queue.js`

**Files:**
- Create: `automation/lib/queue.js`
- Create: `automation/__tests__/queue.test.js`

- [ ] **Step 1: Write the failing tests**

Create `automation/__tests__/queue.test.js`:

```javascript
const { getNextPending, markPublished } = require('../lib/queue');

describe('getNextPending', () => {
  it('returns null for empty queue', () => {
    expect(getNextPending([])).toBeNull();
  });

  it('returns null when all items are published', () => {
    expect(getNextPending([{ status: 'published', slug: 'a' }])).toBeNull();
  });

  it('returns first pending item', () => {
    const queue = [
      { status: 'published', slug: 'a' },
      { status: 'pending', slug: 'b', title: 'B' },
      { status: 'pending', slug: 'c', title: 'C' },
    ];
    expect(getNextPending(queue)).toEqual({ status: 'pending', slug: 'b', title: 'B' });
  });
});

describe('markPublished', () => {
  it('sets status, publishedDate, and filename on matching item', () => {
    const queue = [{ status: 'pending', slug: 'test-post' }];
    markPublished(queue, 'test-post', '2026-04-09', '2026-04-09-test-post.md');
    expect(queue[0].status).toBe('published');
    expect(queue[0].publishedDate).toBe('2026-04-09');
    expect(queue[0].filename).toBe('2026-04-09-test-post.md');
  });

  it('throws if slug is not found in queue', () => {
    expect(() => markPublished([], 'missing', '2026-04-09', 'f.md')).toThrow('Slug not found in queue: missing');
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website/automation
npm test -- --testPathPattern=queue
```

Expected output: `Cannot find module '../lib/queue'`

- [ ] **Step 3: Implement `automation/lib/queue.js`**

```javascript
'use strict';

function getNextPending(queue) {
  return queue.find(item => item.status === 'pending') ?? null;
}

function markPublished(queue, slug, publishedDate, filename) {
  const item = queue.find(i => i.slug === slug);
  if (!item) throw new Error(`Slug not found in queue: ${slug}`);
  item.status = 'published';
  item.publishedDate = publishedDate;
  item.filename = filename;
}

module.exports = { getNextPending, markPublished };
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm test -- --testPathPattern=queue
```

Expected: `Tests: 5 passed, 5 total`

- [ ] **Step 5: Commit**

```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website
git add automation/lib/queue.js automation/__tests__/queue.test.js
git commit -m "feat: add queue helpers with tests"
```

---

## Task 7: Build and Test `formatter.js`

**Files:**
- Create: `automation/lib/formatter.js`
- Create: `automation/__tests__/formatter.test.js`

- [ ] **Step 1: Write the failing tests**

Create `automation/__tests__/formatter.test.js`:

```javascript
const { buildFrontmatter, wrapPost } = require('../lib/formatter');

const sample = {
  title: 'Angelschein Bayern Guide',
  date: '2026-04-09',
  description: 'Alles zum Angelschein Bayern.',
  slug: 'angelschein-bayern-guide',
  image: 'https://images.unsplash.com/photo-abc123',
};

describe('buildFrontmatter', () => {
  it('starts and ends with ---', () => {
    const lines = buildFrontmatter(sample).split('\n');
    expect(lines[0]).toBe('---');
    expect(lines[lines.length - 1]).toBe('---');
  });

  it('includes all required fields', () => {
    const result = buildFrontmatter(sample);
    expect(result).toContain('title: "Angelschein Bayern Guide"');
    expect(result).toContain('date: 2026-04-09');
    expect(result).toContain('slug: angelschein-bayern-guide');
    expect(result).toContain('image: https://images.unsplash.com/photo-abc123');
  });

  it('escapes double quotes in title', () => {
    const result = buildFrontmatter({ ...sample, title: 'Guide: "Bayern"' });
    expect(result).toContain('\\"Bayern\\"');
  });
});

describe('wrapPost', () => {
  it('joins frontmatter and body with a blank line', () => {
    const fm = '---\ntitle: test\n---';
    const body = '# Hello\n\nContent.';
    const result = wrapPost(fm, body);
    expect(result).toBe(fm + '\n\n# Hello\n\nContent.\n');
  });

  it('trims leading/trailing whitespace from body', () => {
    const result = wrapPost('---\n---', '  content   ');
    expect(result.endsWith('content\n')).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm test -- --testPathPattern=formatter
```

Expected: `Cannot find module '../lib/formatter'`

- [ ] **Step 3: Implement `automation/lib/formatter.js`**

```javascript
'use strict';

function buildFrontmatter({ title, date, description, slug, image }) {
  return [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `date: ${date}`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    `slug: ${slug}`,
    `image: ${image}`,
    '---',
  ].join('\n');
}

function wrapPost(frontmatter, body) {
  return `${frontmatter}\n\n${body.trim()}\n`;
}

module.exports = { buildFrontmatter, wrapPost };
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm test -- --testPathPattern=formatter
```

Expected: `Tests: 5 passed, 5 total`

- [ ] **Step 5: Commit**

```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website
git add automation/lib/formatter.js automation/__tests__/formatter.test.js
git commit -m "feat: add Markdown formatter with tests"
```

---

## Task 8: Build and Test `prompt.js`

**Files:**
- Create: `automation/lib/prompt.js`
- Create: `automation/__tests__/prompt.test.js`

- [ ] **Step 1: Write the failing tests**

Create `automation/__tests__/prompt.test.js`:

```javascript
const { buildPrompt } = require('../lib/prompt');

const input = {
  title: 'Angelschein Bayern Guide',
  primaryKeyword: 'Angelschein Bayern',
  secondaryKeywords: ['Fischerprüfung Bayern', 'Angelschein Bayern bestehen'],
};

describe('buildPrompt', () => {
  it('includes the post title', () => {
    expect(buildPrompt(input)).toContain('Angelschein Bayern Guide');
  });

  it('includes the primary keyword', () => {
    expect(buildPrompt(input)).toContain('Angelschein Bayern');
  });

  it('includes all secondary keywords', () => {
    const result = buildPrompt(input);
    expect(result).toContain('Fischerprüfung Bayern');
    expect(result).toContain('Angelschein Bayern bestehen');
  });

  it('specifies the word count range', () => {
    expect(buildPrompt(input)).toContain('650–850');
  });

  it('instructs markdown-only output', () => {
    expect(buildPrompt(input)).toContain('nur Markdown-Text');
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm test -- --testPathPattern=prompt
```

Expected: `Cannot find module '../lib/prompt'`

- [ ] **Step 3: Implement `automation/lib/prompt.js`**

```javascript
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
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm test -- --testPathPattern=prompt
```

Expected: `Tests: 5 passed, 5 total`

- [ ] **Step 5: Commit**

```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website
git add automation/lib/prompt.js automation/__tests__/prompt.test.js
git commit -m "feat: add Claude prompt builder with tests"
```

---

## Task 9: Build `unsplash.js`

**Files:**
- Create: `automation/lib/unsplash.js`

No unit test for this module — it wraps a network call. It will be exercised in the manual smoke test in Task 11.

- [ ] **Step 1: Create `automation/lib/unsplash.js`**

```javascript
'use strict';

/**
 * Fetches a random landscape image URL from Unsplash matching the query.
 * @param {string} query - e.g. "fishing germany lake"
 * @param {string} accessKey - Unsplash API access key
 * @returns {Promise<string>} - Regular-size image URL
 */
async function fetchImage(query, accessKey) {
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });
  if (!res.ok) {
    throw new Error(`Unsplash API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.urls.regular;
}

module.exports = { fetchImage };
```

- [ ] **Step 2: Commit**

```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website
git add automation/lib/unsplash.js
git commit -m "feat: add Unsplash image fetcher"
```

---

## Task 10: Build Main Automation Script

**Files:**
- Create: `automation/generate-post.js`

- [ ] **Step 1: Run all existing tests to confirm clean baseline**

```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website/automation
npm test
```

Expected: all queue, formatter, and prompt tests pass.

- [ ] **Step 2: Create `automation/generate-post.js`**

```javascript
'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const { getNextPending, markPublished } = require('./lib/queue');
const { buildFrontmatter, wrapPost } = require('./lib/formatter');
const { buildPrompt } = require('./lib/prompt');
const { fetchImage } = require('./lib/unsplash');

const QUEUE_PATH = path.join(__dirname, '../_data/post-queue.json');
const POSTS_DIR = path.join(__dirname, '../_posts');

async function main() {
  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const topic = getNextPending(queue);
  if (!topic) {
    console.log('No pending posts in queue. Exiting.');
    return;
  }
  console.log(`Generating: "${topic.title}"`);

  const imageUrl = await fetchImage(topic.unsplashQuery, process.env.UNSPLASH_ACCESS_KEY);
  console.log(`Image URL: ${imageUrl}`);

  const client = new Anthropic();
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{ role: 'user', content: buildPrompt(topic) }],
  });
  const body = message.content[0].text;

  const date = new Date().toISOString().split('T')[0];
  const frontmatter = buildFrontmatter({
    title: topic.title,
    date,
    description: topic.description,
    slug: topic.slug,
    image: imageUrl,
  });
  const postContent = wrapPost(frontmatter, body);

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  const filename = `${date}-${topic.slug}.md`;
  fs.writeFileSync(path.join(POSTS_DIR, filename), postContent);
  console.log(`Written: _posts/${filename}`);

  markPublished(queue, topic.slug, date, filename);
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
  console.log('Queue updated. Done.');
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
```

- [ ] **Step 3: Smoke test with real API keys**

Set environment variables (replace with real values):
```bash
export ANTHROPIC_API_KEY=sk-ant-...
export UNSPLASH_ACCESS_KEY=your-unsplash-key
```

Run the script:
```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website/automation
node generate-post.js
```

Expected output:
```
Generating: "Angelschein Bayern: Alles was du wissen musst"
Image URL: https://images.unsplash.com/photo-...
Written: _posts/2026-04-09-angelschein-bayern-guide.md
Queue updated. Done.
```

Open `_posts/2026-04-09-angelschein-bayern-guide.md` and verify:
- Valid YAML frontmatter (starts and ends with `---`)
- German blog post content with H1 + at least 3 H2 sections
- First item in `_data/post-queue.json` now has `"status": "published"`

- [ ] **Step 4: Commit**

```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website
git add automation/generate-post.js _posts/ _data/post-queue.json
git commit -m "feat: add main blog post generator script"
```

---

## Task 11: Set Up GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/weekly-post.yml`

**Prerequisite:** Add two secrets in the GitHub repo settings (Settings → Secrets → Actions):
- `ANTHROPIC_API_KEY` — your Anthropic API key
- `UNSPLASH_ACCESS_KEY` — your Unsplash API access key

- [ ] **Step 1: Create `.github/workflows/weekly-post.yml`**

```yaml
name: Weekly Blog Post

on:
  schedule:
    - cron: '0 8 * * 1'   # Every Monday at 08:00 UTC
  workflow_dispatch:        # Allow manual trigger from GitHub Actions UI

jobs:
  generate-post:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: automation/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: automation

      - name: Generate blog post
        run: node generate-post.js
        working-directory: automation
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          UNSPLASH_ACCESS_KEY: ${{ secrets.UNSPLASH_ACCESS_KEY }}

      - name: Commit and push new post
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add _posts/ _data/post-queue.json
          git diff --staged --quiet && echo "Nothing to commit." || git commit -m "chore: auto-publish weekly blog post"
          git push
```

- [ ] **Step 2: Commit the workflow**

```bash
cd /Users/ku3ub/Documents/GitHub/angelschein-website
git add .github/workflows/weekly-post.yml
git commit -m "feat: add GitHub Actions workflow for weekly blog post"
git push origin main
```

- [ ] **Step 3: Trigger a manual run to verify end-to-end**

1. Go to the GitHub repo → Actions tab
2. Select "Weekly Blog Post" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait for it to complete (~2 minutes)
5. Confirm: green checkmark, new file in `_posts/`, `_data/post-queue.json` updated, blog post live at `angel-schein.online/blog`

---

## Task 12: Submit Sitemap to Google Search Console

- [ ] **Step 1: Verify sitemap is live**

Open https://angel-schein.online/sitemap.xml — confirm it lists the landing page and blog posts.

- [ ] **Step 2: Submit to Google Search Console**

1. Open https://search.google.com/search-console
2. Select the `angel-schein.online` property (or add it if not yet verified)
3. Go to Sitemaps → Add sitemap
4. Enter: `sitemap.xml`
5. Click Submit

Expected: Google accepts the sitemap and shows "Success".
