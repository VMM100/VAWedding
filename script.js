document.addEventListener('DOMContentLoaded', function () {

  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      offset: 60,
      once: true
    });
  }

  var lineEls = document.querySelectorAll('.line-draw');
  var lineIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        lineIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  lineEls.forEach(function (el) { lineIO.observe(el); });

  var wrapper = document.querySelector('.hero-pin-wrapper');
  var archEl = document.querySelector('.archway-frame');
  var cueEl = document.querySelector('.hero-pin .scroll-cue');

  function updateHeroZoom() {
    if (!wrapper) return;
    var rect = wrapper.getBoundingClientRect();
    var scrollableDistance = wrapper.offsetHeight - window.innerHeight;
    var progress = scrollableDistance > 0 ? -rect.top / scrollableDistance : 0;
    progress = Math.max(0, Math.min(1, progress));

    if (archEl) {
      archEl.style.opacity = String(1 - progress);
      archEl.style.transform = 'scale(' + (1 + progress * 0.35) + ')';
    }
    if (cueEl) { cueEl.style.opacity = String(Math.max(0, 1 - progress * 6)); }
  }

  var ticking = false;
  function onScrollThrottled() {
    if (!ticking) {
      window.requestAnimationFrame(function () { updateHeroZoom(); ticking = false; });
      ticking = true;
    }
  }

  if (wrapper) {
    window.addEventListener('scroll', onScrollThrottled, { passive: true });
    window.addEventListener('resize', updateHeroZoom);
    updateHeroZoom();
  }

  var bar = document.getElementById('progressBar');
  var onScroll = function () {
    var doc = document.documentElement;
    var scrolled = doc.scrollTop || document.body.scrollTop || 0;
    var height = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
    var pct = height > 0 ? (scrolled / height) * 100 : 0;
    if (bar) { bar.style.width = pct + '%'; }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var countEl = document.getElementById('countdownNumber');
  if (countEl) {
    var target = Math.max(0, Math.ceil((new Date(2027, 0, 19) - new Date()) / 86400000));
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var start = null;
          var duration = 1200;
          var step = function (ts) {
            if (!start) { start = ts; }
            var progress = Math.min((ts - start) / duration, 1);
            countEl.textContent = Math.floor(progress * target);
            if (progress < 1) { requestAnimationFrame(step); }
            else { countEl.textContent = String(target); }
          };
          requestAnimationFrame(step);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    countIO.observe(countEl);
  }

  var dialog = document.getElementById('eventDialog');
  if (dialog && dialog.showModal) {
    var dialogImg = document.getElementById('eventDialogImg');
    var missing = document.getElementById('eventDialogMissing');
    var opener = null;

    document.querySelectorAll('.event-open').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        missing.hidden = true;
        dialogImg.hidden = false;
        dialogImg.alt = btn.dataset.title + ' — theme and wardrobe';
        dialogImg.src = btn.dataset.img;
        dialog.showModal();
      });
    });
    dialogImg.addEventListener('error', function () {
      dialogImg.hidden = true;
      missing.hidden = false;
    });
    dialog.querySelector('.event-dialog-close').addEventListener('click', function () { dialog.close(); });
    // a click outside the image lands on the dialog element itself (its backdrop)
    dialog.addEventListener('click', function (e) { if (e.target === dialog) { dialog.close(); } });
    dialog.addEventListener('close', function () { if (opener) { opener.focus(); } });
  }

});
