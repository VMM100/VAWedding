document.addEventListener('DOMContentLoaded', function () {

  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      offset: 60,
      once: true
    });
  }

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

  // Hero: the two arch halves slide inward to meet in the middle
  var heroEl = document.querySelector('.hero');
  if (heroEl) {
    var heroIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          document.querySelectorAll('.arch-half').forEach(function (el) { el.classList.add('in-view'); });
          heroIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    heroIO.observe(heroEl);
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

});
