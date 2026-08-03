// Renders a project write-up from Markdown. Any element with a
// data-md="./slug.md" attribute gets that file fetched and rendered into it
// with marked (vendored in assets/js/vendor/marked.min.js — no CDN dependency).
//
// $...$ and $$...$$ math is pulled out before marked ever sees it and put
// back afterwards, so underscores/asterisks inside LaTeX (e.g. \delta_{cmd})
// don't get mangled as markdown emphasis. Pages that also load KaTeX's
// auto-render (vendored in assets/js/vendor/) then typeset it; pages that
// don't just show the raw $...$ text unchanged.
function extractMath(src) {
  const store = [];
  const stash = (expr, display) => {
    store.push({ expr, display });
    return `MATH${store.length - 1}`;
  };
  return {
    text: src
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => stash(expr, true))
      .replace(/\$([^\n$]+?)\$/g, (_, expr) => stash(expr, false)),
    store,
  };
}

function restoreMath(html, store) {
  return html.replace(/MATH(\d+)/g, (_, i) => {
    const { expr, display } = store[i];
    return display ? `$$${expr}$$` : `$${expr}$`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-md]').forEach(async (el) => {
    try {
      const res = await fetch(el.getAttribute('data-md'));
      if (!res.ok) throw new Error(res.status);
      const { text, store } = extractMath(await res.text());
      el.innerHTML = restoreMath(marked.parse(text), store);
      if (store.length && window.renderMathInElement) {
        renderMathInElement(el, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ],
          throwOnError: false,
        });
      }
    } catch (err) {
      el.innerHTML = '<p>Could not load this write-up.</p>';
      console.error('md-page:', err);
    }
  });
});
