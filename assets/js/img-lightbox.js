// Click any write-up image (.prose img) to view it full-resolution in a
// lightbox. Reuses the .lightbox/.lb-* styles already defined for the
// certifications page, but builds the overlay in JS and binds via event
// delegation since these images come from markdown rendered at runtime
// (see md-page.js) rather than being present in the HTML up front.
document.addEventListener('DOMContentLoaded', () => {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.id = 'img-lightbox';
  lb.innerHTML = `
    <a class="lb-backdrop" href="#" aria-label="Close"></a>
    <div class="lb-inner">
      <div class="lb-frame">
        <img alt="" />
        <span class="lb-zoom-hint">🔍 Click to zoom in</span>
      </div>
      <div class="lb-bar">
        <p class="lb-cap"></p>
        <a class="btn" href="#" target="_blank" rel="noopener">Open image</a>
        <a class="btn primary" href="#">Close ✕</a>
      </div>
    </div>`;
  document.body.appendChild(lb);

  const lbFrame = lb.querySelector('.lb-frame');
  const lbImg = lb.querySelector('img');
  const lbHint = lb.querySelector('.lb-zoom-hint');
  const lbCap = lb.querySelector('.lb-cap');
  const lbOpen = lb.querySelector('.btn:not(.primary)');

  document.addEventListener('click', (e) => {
    const clicked = e.target.closest('.prose img');
    if (!clicked) return;
    lbImg.src = clicked.currentSrc || clicked.src;
    lbImg.alt = clicked.alt || '';
    lbImg.classList.remove('zoomed');
    lbHint.textContent = '🔍 Click to zoom in';
    lbFrame.scrollTop = 0;
    lbFrame.scrollLeft = 0;
    lbCap.textContent = clicked.alt || '';
    lbOpen.href = clicked.currentSrc || clicked.src;
    location.hash = 'img-lightbox';
  });

  // clicking the image toggles between "fit to screen" and full native
  // resolution (scrollable) so detail that's downscaled at fit-size is
  // still inspectable
  lbImg.addEventListener('click', (e) => {
    e.preventDefault();
    const zoomed = lbImg.classList.toggle('zoomed');
    lbHint.textContent = zoomed ? '🔍 Click to zoom out' : '🔍 Click to zoom in';
  });
});
