// Renders a project write-up from Markdown. Any element with a
// data-md="./slug.md" attribute gets that file fetched and rendered into it
// with marked (vendored in assets/js/vendor/marked.min.js — no CDN dependency).
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-md]').forEach(async (el) => {
    try {
      const res = await fetch(el.getAttribute('data-md'));
      if (!res.ok) throw new Error(res.status);
      el.innerHTML = marked.parse(await res.text());
    } catch (err) {
      el.innerHTML = '<p>Could not load this write-up.</p>';
      console.error('md-page:', err);
    }
  });
});
