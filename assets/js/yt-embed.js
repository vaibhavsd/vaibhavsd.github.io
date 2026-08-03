// Click-to-play YouTube thumbnails. Any <button class="yt-thumb" data-yt="VIDEO_ID">
// is swapped for a live embed on click, so nothing loads from youtube.com until asked.
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.yt-thumb');
  if (!btn) return;

  const id = btn.getAttribute('data-yt');
  const iframe = document.createElement('iframe');
  iframe.className = 'yt-frame';
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
  iframe.title = btn.getAttribute('aria-label') || 'YouTube video player';
  iframe.frameBorder = '0';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;

  btn.replaceWith(iframe);
});
