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
    var card = document.getElementById('flipCard');
    var front = document.getElementById('flipFront');
    var dialogImg = document.getElementById('eventDialogImg');
    var missing = document.getElementById('eventDialogMissing');
    var closeBtn = dialog.querySelector('.event-dialog-close');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var OPEN_MS = 900, CLOSE_MS = 750, EASE = 'cubic-bezier(0.45, 0.05, 0.25, 1)';
    var current = null;   // { btn, win, busy }

    // Largest box with the design's proportions that fits 94% x 92% of the screen
    function finalSize(aspect) {
      var w = Math.min(window.innerWidth * 0.94, window.innerHeight * 0.92 * aspect);
      return { w: w, h: w / aspect };
    }
    function layoutCard(size) {
      card.style.width = size.w + 'px';
      card.style.height = size.h + 'px';
      card.style.marginLeft = (-size.w / 2) + 'px';
      card.style.marginTop = (-size.h / 2) + 'px';
      closeBtn.style.left = Math.min(window.innerWidth - 48, window.innerWidth / 2 + size.w / 2 - 22) + 'px';
      closeBtn.style.top = Math.max(8, window.innerHeight / 2 - size.h / 2 - 18) + 'px';
    }
    // Keyframes from the arch's spot on the page to the centre: the card turns
    // edge-on halfway (lifting slightly toward the viewer) and lands showing the design
    function flipFrames(win, size) {
      var r = win.querySelector('.event-arch').getBoundingClientRect();
      var s = r.height / size.h;
      var dx = r.left + r.width / 2 - window.innerWidth / 2;
      var dy = r.top + r.height / 2 - window.innerHeight / 2;
      var lift = ((s + 1) / 2) * 1.08;
      return [
        { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(' + s + ') rotateY(0deg)' },
        { transform: 'translate(' + dx / 2 + 'px, ' + dy / 2 + 'px) scale(' + lift + ') rotateY(90deg)', offset: 0.5 },
        { transform: CENTRE }
      ];
    }
    var CENTRE = 'translate(0px, 0px) scale(1) rotateY(180deg)';

    // run fn once when the animation ends, with a timer as a backstop
    function whenDone(anim, ms, fn) {
      var called = false;
      function once() { if (!called) { called = true; fn(); } }
      anim.onfinish = once;
      setTimeout(once, ms + 150);
    }

    function fadeBackdrop(from, to, ms) {
      try { dialog.animate([{ opacity: from }, { opacity: to }], { duration: ms, pseudoElement: '::backdrop', fill: 'forwards' }); } catch (e) {}
    }

    function loadDesign(src) {
      return new Promise(function (resolve) {
        var done = false;
        function finish(ok) { if (!done) { done = true; resolve(ok); } }
        dialogImg.onload = function () { finish(true); };
        dialogImg.onerror = function () { finish(false); };
        dialogImg.src = src;
        if (dialogImg.complete && dialogImg.naturalWidth) { finish(true); }
        setTimeout(function () { finish(dialogImg.naturalWidth > 0); }, 2500);
      });
    }

    function openEvent(btn) {
      if (current) { return; }
      var win = btn.closest('.event-window');
      current = { btn: btn, win: win, busy: true, size: null };
      dialogImg.alt = btn.dataset.title + ' — theme and wardrobe';

      loadDesign(btn.dataset.img).then(function (ok) {
        dialogImg.hidden = !ok;
        missing.hidden = ok;
        var aspect = ok ? dialogImg.naturalWidth / dialogImg.naturalHeight : 0.8;
        var size = finalSize(aspect);
        current.size = size;

        // front face = a copy of the tapped arch (without its button)
        front.innerHTML = '';
        var copy = win.cloneNode(true);
        copy.classList.remove('peek', 'aos-init', 'aos-animate');
        copy.removeAttribute('data-aos');
        copy.style.cssText = '';
        var b = copy.querySelector('.event-open'); if (b) { b.remove(); }
        front.appendChild(copy);

        layoutCard(size);
        dialog.classList.remove('is-open');
        dialog.showModal();
        closeBtn.focus({ preventScroll: true });

        if (reduceMotion) {
          card.style.transform = CENTRE;
          dialog.classList.add('is-open');
          current.busy = false;
          return;
        }
        var frames = flipFrames(win, size);
        card.style.transform = frames[0].transform;
        win.style.visibility = 'hidden';
        fadeBackdrop(0, 1, OPEN_MS);
        var anim = card.animate(frames, { duration: OPEN_MS, easing: EASE, fill: 'forwards' });
        whenDone(anim, OPEN_MS, function () {
          card.style.transform = CENTRE;
          anim.cancel();
          dialog.classList.add('is-open');
          if (current) { current.busy = false; }
        });
      });
    }

    function finishClose() {
      var c = current;
      current = null;
      if (dialog.open) { dialog.close(); }
      if (c) {
        c.win.style.visibility = '';
        c.btn.focus({ preventScroll: true });
      }
    }

    function closeEvent() {
      if (!current || current.busy) { return; }
      current.busy = true;
      dialog.classList.remove('is-open');
      if (reduceMotion) { finishClose(); return; }
      var frames = flipFrames(current.win, current.size).reverse();
      frames[1].offset = 0.5;
      fadeBackdrop(1, 0, CLOSE_MS);
      var anim = card.animate(frames, { duration: CLOSE_MS, easing: EASE, fill: 'forwards' });
      whenDone(anim, CLOSE_MS, finishClose);
    }

    document.querySelectorAll('.event-open').forEach(function (btn) {
      btn.addEventListener('click', function () { openEvent(btn); });
    });
    closeBtn.addEventListener('click', closeEvent);
    // a click outside the card lands on the dialog itself
    dialog.addEventListener('click', function (e) { if (e.target === dialog) { closeEvent(); } });
    // Esc: play the flip back instead of closing instantly. Handled on keydown
    // because browsers don't always let a page cancel the dialog's own Esc close.
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeEvent(); }
    });
    dialog.addEventListener('cancel', function (e) { e.preventDefault(); closeEvent(); });
    // Safety net: if the dialog closes by any other route, restore the page at once
    dialog.addEventListener('close', function () {
      if (current) {
        card.getAnimations().forEach(function (a) { a.cancel(); });
        finishClose();
      }
    });
    window.addEventListener('resize', function () {
      if (current && current.size && !current.busy) {
        var aspect = current.size.w / current.size.h;
        current.size = finalSize(aspect);
        layoutCard(current.size);
      }
    });
  }

  // One-off "peek" half-turn when each arch first scrolls into view
  var peekIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('peek');
        peekIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.event-window').forEach(function (w) { peekIO.observe(w); });

});
