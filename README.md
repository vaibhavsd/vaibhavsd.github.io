# vaibhavsd.github.io

Personal website of **Vaibhav Deshmukh** — controls engineer working on motion control,
vehicle state estimation and automated driving algorithms.

Live at **https://vaibhavsd.github.io**

## Structure

```
index.html                          home page (experience, projects, skills, education,
                                    publications, contact)
projects/<slug>/index.html          minimal shell page — title, meta line, loads write-up.md
projects/<slug>/write-up.md         the actual write-up, in Markdown
projects/<slug>/*.webp,*.png,*.slx  that project's images and downloadable model files —
                                    everything for one project lives in its own folder
assets/js/md-page.js                fetches a project's write-up.md and renders it into the page
assets/js/vendor/marked.min.js      vendored Markdown parser (no CDN dependency)
assets/css/style.css                stylesheet, shared by the home page and project pages
assets/img/certificates/            certificate screenshots (see certifications.html)
assets/Vaibhav_Deshmukh_Resume.pdf  downloadable résumé
.nojekyll                           served as plain static files, no Jekyll build
```

### How navigation works

The header links on the home page (Experience, Projects, Skills, …) are **in-page
anchors** — they scroll, they never leave the page. Projects are the exception: each
project is a **separate page** under `projects/<slug>/`, so the cards say
"Open project page →" and every project page carries a
"← All projects" link in its nav and at the bottom of the page.

Project pages live two directories down (`projects/<slug>/index.html`), so all their
links back to the home page are `../../index.html#section`, not `#section`, and links to
shared assets are `../../assets/...`. Anything specific to that one project (its images,
its `.slx` model) is a plain `./` sibling in the same folder instead.

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Adding a project

Project pages are deliberately minimal: a tiny HTML shell (title + one meta line) that
fetches a sibling `write-up.md` in the browser and renders it — so the write-up itself is
just Markdown, no HTML tags to hand-write. Everything for one project — the shell, the
write-up, its images, its downloadable model file — lives together in one folder.

1. `cp -r projects/cruise-control-pid projects/my-project` to copy a whole project folder
   as a starting point.
2. In `projects/my-project/index.html`, edit the `<title>`/meta tags, breadcrumb label,
   `<h1>` and the `doc-meta` line (date · tools). The `data-md="./write-up.md"` path and
   the `../../` links back to the home page don't need to change.
3. Rewrite `projects/my-project/write-up.md` — headings, lists, images, links all work as
   normal Markdown. Drop any new images or a `.slx`/model file straight into
   `projects/my-project/` alongside it and reference them as plain siblings
   (`./diagram.webp`, `./model.slx`).
4. In `index.html`, inside the `<div class="project-grid">` of the Projects section, copy
   one `<a class="project-card">` block, paste it at the top of the grid (newest first)
   and point its `href` at `./projects/my-project/`.

That's it — still no build step (Markdown is rendered client-side by
`assets/js/md-page.js`) and no second index to keep in sync.

## Updating the résumé

Replace `assets/Vaibhav_Deshmukh_Resume.pdf` (keep the filename) and update the matching
sections in `index.html` so the page and the PDF stay in sync.
