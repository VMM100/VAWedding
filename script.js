document.addEventListener('DOMContentLoaded', function () {

  // AOS handles the simple reveal-on-scroll animations declared with
  // data-aos="..." attributes in index.html (fade-up, zoom-in, etc).
  // Add more anywhere by adding a data-aos attribute — no JS needed.
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      offset: 60,
      once: true
    });
  }

  // Draw-in gold lines: AOS doesn't have this effect, so it's hand-rolled
  // with the same reveal-on-scroll technique.
  var lineEls = document.querySelectorAll('.line-draw, .timeline-line');
  var lineIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        lineIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  lineEls.forEach(function (el) { lineIO.observe(el); });

  // Scroll progress bar + hero parallax
  var bar = document.getElementById('progressBar');
  var onScroll = function () {
    var doc = document.documentElement;
    var scrolled = doc.scrollTop || document.body.scrollTop || 0;
    var height = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
    var pct = height > 0 ? (scrolled / height) * 100 : 0;
    if (bar) { bar.style.width = pct + '%'; }

    var parallaxEls = document.querySelectorAll('.parallax');
    parallaxEls.forEach(function (el) {
      el.style.transform = 'translateY(' + (scrolled * 0.12) + 'px)';
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Live count-up to the wedding date, animated the first time it scrolls into view
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

});
