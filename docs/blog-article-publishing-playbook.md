# Blog Article Publishing Playbook

Use this file when adding new Magerly blog articles. It is meant to be passed to Codex with a short request such as:

```text
Using docs/blog-article-publishing-playbook.md, add N new blog posts.
Topics: ...
Date range: ...
Generate images: yes.
```

## Goal

Add complete English and Russian blog article pairs, with localized images, index cards, sitemap entries, and SEO metadata. A post is not complete until every existing blog page is represented consistently in:

- `src/blog/*.html`
- `src/ru/blog/*.html`
- `src/assets/images/blog/*`
- `src/blog/index.html`
- `src/ru/blog/index.html`
- `public/sitemap.xml`

Do not commit changes unless explicitly asked.

## Current Conventions

- English articles live at `src/blog/<slug>.html`.
- Russian articles live at `src/ru/blog/<slug>.html`.
- Localized cover images live at:
  - `src/assets/images/blog/<slug>-en.jpg`
  - `src/assets/images/blog/<slug>-ru.jpg`
- Public article URLs are:
  - `https://magerly.com/blog/<slug>.html`
  - `https://magerly.com/ru/blog/<slug>.html`
- Blog indexes are:
  - `https://magerly.com/blog/`
  - `https://magerly.com/ru/blog/`
- The sitemap source is `public/sitemap.xml`.
- `public/robots.txt` already points to `https://magerly.com/sitemap.xml`; normally it should not need changes.
- English and Russian pages should share the same slug and publish date.
- Index cards should be sorted newest first.
- Use the latest existing article pages as structural templates.

## Required Inputs

Before writing articles, determine or infer:

- Number of new article pairs to add.
- Topic, target keyword, and search intent for each article.
- Slug for each article, using lowercase hyphenated English words.
- Publish date for each pair. If the user gives a range, distribute dates inside that range. If not, continue after the latest existing blog date.
- Whether the user wants generated images. If unspecified, generate images.

If topics are not supplied, propose a coherent set of parenting, baby development, baby care, or app-usage topics that do not duplicate existing slugs.

## Article Requirements

Each new article page must include:

- Complete HTML page, not a fragment.
- Localized `<html lang="en">` or `<html lang="ru">`.
- Unique `<title>` and meta description.
- Canonical URL for the current locale.
- `hreflang` alternates for `en`, `ru`, and `x-default`.
- Open Graph tags, including `og:image`, `og:image:alt`, `og:image:width`, and `og:image:height`.
- Twitter card tags, including localized image and image alt text.
- `Article` JSON-LD with headline, description, image, author, publisher, datePublished, dateModified, mainEntityOfPage, and inLanguage.
- Breadcrumb JSON-LD if the neighboring article template uses it.
- A visible hero image using `/assets/images/blog/<slug>-en.jpg` or `/assets/images/blog/<slug>-ru.jpg`.
- Descriptive image alt text in the page body.
- Internal links to relevant existing blog posts and core product pages.
- A localized link to the paired article in the language switcher/navigation.
- Human-readable article content with useful headings, scannable sections, and no visible placeholder or prompt text.

Keep medical, child development, nutrition, and safety claims careful. Prefer practical, non-alarming guidance, and include a reminder to consult a pediatrician or qualified clinician where appropriate.

## Image Requirements

Generate one English and one Russian image per new slug unless the user says otherwise.

- Save final images in `src/assets/images/blog/`.
- Use file names `<slug>-en.jpg` and `<slug>-ru.jpg`.
- Match the existing Magerly blog-cover style: warm, calm, family-friendly, polished, soft light, clean editorial composition, readable but minimal text if any.
- Keep images consistent across languages while localizing any visible text.
- Avoid stock-photo clutter, harsh colors, tiny unreadable UI text, watermarks, logos from other brands, and medical-looking imagery unless the article clearly requires it.
- Prefer a 16:9 cover image. If the generated output is larger, crop or resize consistently before saving.
- Ensure page metadata points to `https://magerly.com/assets/images/blog/<file>.jpg`, while body images use `/assets/images/blog/<file>.jpg`.
- Do not leave image references pointing to temporary generated-image folders.

## Index Updates

Update both `src/blog/index.html` and `src/ru/blog/index.html`.

For every new article:

- Add a localized card with title, excerpt, date, category, image, image alt, and link.
- Keep cards in newest-first order.
- Keep the English and Russian indexes aligned: same article set, same slugs, same dates, localized title/excerpt/category.
- Add or update the `Blog` JSON-LD `blogPost` array so every article page appears there.
- Verify every existing article file, not just the new ones, is represented in the correct locale index.

## Sitemap Updates

Update `public/sitemap.xml` for every new article pair.

For each slug, add two `<url>` entries:

```xml
<url>
  <loc>https://magerly.com/blog/<slug>.html</loc>
  <lastmod>YYYY-MM-DD</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
  <xhtml:link rel="alternate" hreflang="en" href="https://magerly.com/blog/<slug>.html" />
  <xhtml:link rel="alternate" hreflang="ru" href="https://magerly.com/ru/blog/<slug>.html" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://magerly.com/blog/<slug>.html" />
</url>
<url>
  <loc>https://magerly.com/ru/blog/<slug>.html</loc>
  <lastmod>YYYY-MM-DD</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
  <xhtml:link rel="alternate" hreflang="en" href="https://magerly.com/blog/<slug>.html" />
  <xhtml:link rel="alternate" hreflang="ru" href="https://magerly.com/ru/blog/<slug>.html" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://magerly.com/blog/<slug>.html" />
</url>
```

Also update the blog index `<lastmod>` values if the newest article date is newer than the current blog index `lastmod`.

## SEO Checklist

For each new page:

- Title is specific and fits search intent.
- Meta description is unique and compelling.
- One clear H1.
- Logical H2/H3 structure.
- Canonical URL matches the locale URL.
- `hreflang` pairs are reciprocal across English and Russian.
- Open Graph and Twitter images exist.
- Article JSON-LD is valid JSON and matches visible content.
- Dates are consistent across page body, meta tags, JSON-LD, indexes, and sitemap.
- Images have useful alt text.
- Internal links point to existing pages.
- External claims are conservative and avoid unsupported certainty.
- No duplicate slug, duplicate title, empty content, or visible placeholder text.

## Verification Commands

Run checks before saying the work is complete. Prefer `rg` for searching.

List current article files:

```powershell
Get-ChildItem -Path src\blog -Filter *.html | Select-Object -ExpandProperty Name
Get-ChildItem -Path src\ru\blog -Filter *.html | Select-Object -ExpandProperty Name
```

Check for missing image files referenced by article pages:

```powershell
$refs = rg -o "/assets/images/blog/[^`"') ]+" src\blog src\ru\blog | ForEach-Object {
  ($_ -split ':')[-1]
} | Sort-Object -Unique

$refs | ForEach-Object {
  $path = Join-Path "src" ($_.TrimStart('/') -replace '/', '\')
  if (-not (Test-Path $path)) { "MISSING $path" }
}
```

Check that every English article is linked from the English index:

```powershell
$enIndex = Get-Content src\blog\index.html -Raw
Get-ChildItem src\blog -Filter *.html |
  Where-Object Name -ne "index.html" |
  ForEach-Object {
    if ($enIndex -notmatch [regex]::Escape($_.Name)) { "MISSING EN INDEX $($_.Name)" }
  }
```

Check that every Russian article is linked from the Russian index:

```powershell
$ruIndex = Get-Content src\ru\blog\index.html -Raw
Get-ChildItem src\ru\blog -Filter *.html |
  Where-Object Name -ne "index.html" |
  ForEach-Object {
    if ($ruIndex -notmatch [regex]::Escape($_.Name)) { "MISSING RU INDEX $($_.Name)" }
  }
```

Check that every article URL is present in the sitemap:

```powershell
$sitemap = Get-Content public\sitemap.xml -Raw
Get-ChildItem src\blog -Filter *.html |
  Where-Object Name -ne "index.html" |
  ForEach-Object {
    $enUrl = "https://magerly.com/blog/$($_.Name)"
    $ruUrl = "https://magerly.com/ru/blog/$($_.Name)"
    if ($sitemap -notmatch [regex]::Escape($enUrl)) { "MISSING SITEMAP $enUrl" }
    if ($sitemap -notmatch [regex]::Escape($ruUrl)) { "MISSING SITEMAP $ruUrl" }
  }
```

Check for visible leftover prompt notes:

```powershell
rg -n "placeholder|TODO|style=`"color: red|image prompt|generated image prompt" src\blog src\ru\blog
```

Check JSON-LD script blocks for obvious syntax errors by parsing each block when practical. If a dev server or build command exists, run the normal project verification too.

## Final Response Template

When finished, report:

- New article slugs and dates.
- Files changed.
- Image files created.
- Indexes and sitemap updated.
- Verification checks run and whether they passed.
- Anything not verified.
