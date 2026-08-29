(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var accentMap = { lapis: "var(--lapis)", madder: "var(--madder)", saffron: "var(--saffron)", emerald: "var(--emerald)" };
  var blobIndex = { lapis: 0, madder: 1, saffron: 2, emerald: 3 };
  var blobs = document.querySelectorAll(".aurora__blob");

  var nav = document.querySelector(".site-nav");
  var navLinks = document.querySelectorAll(".site-nav a[data-section]");
  var trackedSections = document.querySelectorAll("[data-nav-track]");
  var weekBlocks = document.querySelectorAll(".week[data-accent]");

  function setNavAccent(key) { if (nav && accentMap[key]) nav.style.setProperty("--nav-accent", accentMap[key]); }
  function focusAurora(key) {
    var idx = blobIndex[key];
    if (idx === undefined) return;
    blobs.forEach(function (b, i) { b.style.opacity = (i === idx) ? "0.13" : "0.045"; });
  }
  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var match = link.getAttribute("data-section") === id;
      link.classList.toggle("is-active", match);
      if (match) link.setAttribute("aria-current", "true"); else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    if (trackedSections.length && navLinks.length) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
            var accent = entry.target.getAttribute("data-accent");
            if (accent) { setNavAccent(accent); focusAurora(accent); }
          }
        });
      }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
      trackedSections.forEach(function (s) { sectionObserver.observe(s); });
    }
    if (weekBlocks.length) {
      var weekObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { var a = entry.target.getAttribute("data-accent"); setNavAccent(a); focusAurora(a); }
        });
      }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });
      weekBlocks.forEach(function (w) { weekObserver.observe(w); });
    }
    var revealTargets = document.querySelectorAll(".reveal");
    if (revealTargets.length) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); }
        });
      }, { threshold: 0.15 });
      revealTargets.forEach(function (el) { revealObserver.observe(el); });
    }
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---------- Letter-wave (hero title + subtitle only) ----------
  // Splits text into per-letter spans (preserving nested markup like <em>),
  // each animated with a phase-offset vertical oscillation — a continuous
  // wave travelling across the sequence of letters, like a plucked string
  // settling into a standing vibration, rather than a one-shot reveal.
  function wrapLettersDeep(root) {
    var li = 0;
    function wrapWord(word) {
      var wordSpan = document.createElement("span");
      wordSpan.className = "wave-word";
      for (var i = 0; i < word.length; i++) {
        var letterSpan = document.createElement("span");
        letterSpan.className = "wave-letter";
        letterSpan.style.setProperty("--li", li++);
        letterSpan.textContent = word[i];
        wordSpan.appendChild(letterSpan);
      }
      return wordSpan;
    }
    function walk(node) {
      if (node.nodeType === 3) {
        var text = node.textContent;
        var tokens = text.split(/( +)/);
        var frag = document.createDocumentFragment();
        tokens.forEach(function (token) {
          if (token === "") return;
          if (/^ +$/.test(token)) frag.appendChild(document.createTextNode(token));
          else frag.appendChild(wrapWord(token));
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        Array.prototype.slice.call(node.childNodes).forEach(walk);
      }
    }
    Array.prototype.slice.call(root.childNodes).forEach(walk);
  }
  if (!reduceMotion) {
    var heroTitleEl = document.getElementById("hero-title");
    var heroSubEl = document.getElementById("hero-sub");
    if (heroTitleEl) wrapLettersDeep(heroTitleEl);
    if (heroSubEl) wrapLettersDeep(heroSubEl);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (heroTitleEl) heroTitleEl.classList.add("wave-ready");
        if (heroSubEl) heroSubEl.classList.add("wave-ready");
      });
    });
  }

  var heroFade = document.querySelector(".hero-fade");
  if (heroFade) window.setTimeout(function () { heroFade.classList.add("is-visible"); }, 500);

  // ---------- Contact form ----------
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var success = document.getElementById("form-success");
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      window.setTimeout(function () { form.hidden = true; if (success) success.hidden = false; }, 500);
    });
  }

  // ---------- FAQ accordion ----------
  document.querySelectorAll(".faq-item__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // ---------- Faculty carousel arrows ----------
  var facTrack = document.getElementById("faculty-track");
  var facPrev = document.getElementById("faculty-prev");
  var facNext = document.getElementById("faculty-next");
  function facStep() {
    var card = facTrack && facTrack.querySelector(".faculty-card");
    if (!card) return 320;
    var style = getComputedStyle(facTrack);
    var gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    return card.getBoundingClientRect().width + gap;
  }
  if (facTrack && facPrev) facPrev.addEventListener("click", function () { facTrack.scrollBy({ left: -facStep(), behavior: "smooth" }); });
  if (facTrack && facNext) facNext.addEventListener("click", function () { facTrack.scrollBy({ left: facStep(), behavior: "smooth" }); });

  // ---------- Faculty modal ----------
  var cards = document.querySelectorAll(".faculty-card");
  var modalOverlay = document.getElementById("faculty-modal");
  var modalName = document.getElementById("modal-name");
  var modalRole = document.getElementById("modal-role");
  var modalGloss = document.getElementById("modal-gloss");
  var modalBio = document.getElementById("modal-bio");
  var modalClose = document.getElementById("modal-close");
  var lastFocused = null;
  function openModal(card) {
    lastFocused = document.activeElement;
    modalName.textContent = card.getAttribute("data-name");
    modalRole.textContent = card.getAttribute("data-role");
    modalGloss.textContent = card.getAttribute("data-gloss") || "";
    modalBio.textContent = card.getAttribute("data-bio");
    modalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    modalClose.focus();
    document.addEventListener("keydown", onKeydown);
  }
  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }
  function onKeydown(e) { if (e.key === "Escape") closeModal(); }
  cards.forEach(function (card) { card.addEventListener("click", function () { openModal(card); }); });
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalOverlay) modalOverlay.addEventListener("click", function (e) { if (e.target === modalOverlay) closeModal(); });

  // ---------- Footer year ----------
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ================= Hero string field =================
  // A hanging mobile of Persian (and a few English) words, each on its
  // own thread, swinging on a damped spring when the cursor comes near,
  // and sounding a soft plucked chime on hover/click. Purely decorative
  // and additive: the words themselves are real text, not required to
  // read the page, so the whole layer is aria-hidden.
  (function heroStringField() {
    var reduceMotionSF = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var field = document.getElementById("hero-strings");
    var heroEl = document.querySelector(".hero");
    if (!field || !heroEl || reduceMotionSF) return;

    var accentVars = ["--lapis", "--madder", "--saffron", "--emerald"];
    var accentColors = accentVars.map(function (v) {
      return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    });

    // Persian words (with a couple of English ones) drawn from the same
    // vocabulary already glossed elsewhere on the page.
    var WORDS = [
      { text: "فارسی", script: true },
      { text: "زبان", script: true },
      { text: "ادبیات", script: true },
      { text: "جهان", script: true },
      { text: "گلستان", script: true },
      { text: "مثنوی", script: true },
      { text: "رباعیات", script: true },
      { text: "غزل", script: true },
      { text: "حافظ", script: true },
      { text: "سعدی", script: true },
      { text: "خیام", script: true },
      { text: "ایران", script: true },
      { text: "Language", script: false },
      { text: "Literature", script: false },
      { text: "World", script: false }
    ];

    // A soft pentatonic-ish scale for the hover chime — not a claim to any
    // specific traditional tuning, just a pleasant set of plucked notes.
    var SCALE = [196.0, 220.0, 246.94, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88];

    var items = [];
    var heroRect = heroEl.getBoundingClientRect();
    var textZone = null;
    var innerEl = document.querySelector(".hero__inner");
    if (innerEl) {
      var ir = innerEl.getBoundingClientRect();
      textZone = { left: ir.left - heroRect.left, right: ir.right - heroRect.left };
    }

    function build() {
      field.innerHTML = "";
      items = [];
      heroRect = heroEl.getBoundingClientRect();
      if (innerEl) {
        var ir2 = innerEl.getBoundingClientRect();
        textZone = { left: ir2.left - heroRect.left, right: ir2.right - heroRect.left };
      }
      var W = heroRect.width, H = heroRect.height;
      var n = W < 640 ? 7 : (W < 1000 ? 11 : 15);

      for (var i = 0; i < n; i++) {
        var x = (W / n) * (i + 0.5) + (Math.random() - 0.5) * (W / n) * 0.6;
        var inText = textZone && x > textZone.left - 20 && x < textZone.right + 20;
        var len = inText
          ? H * (0.14 + Math.random() * 0.12)
          : H * (0.28 + Math.random() * 0.4);
        var word = WORDS[Math.floor(Math.random() * WORDS.length)];
        var color = accentColors[i % accentColors.length];

        var itemEl = document.createElement("div");
        itemEl.className = "string-item";
        itemEl.style.left = x + "px";

        var rotor = document.createElement("div");
        rotor.className = "string-rotor";
        rotor.style.height = len + "px";

        var wordEl = document.createElement("span");
        wordEl.className = "string-word";
        wordEl.textContent = word.text;
        wordEl.style.color = color;
        wordEl.style.fontFamily = word.script ? "var(--script-font)" : "var(--display-font)";
        wordEl.style.fontStyle = word.script ? "normal" : "italic";
        wordEl.style.fontSize = word.script
          ? (inText ? "1.3rem" : "1.7rem")
          : (inText ? "1.1rem" : "1.4rem");
        wordEl.style.opacity = inText ? "0.5" : "0.72";
        if (word.script) { wordEl.setAttribute("lang", "fa"); wordEl.setAttribute("dir", "rtl"); }

        rotor.appendChild(wordEl);
        itemEl.appendChild(rotor);
        field.appendChild(itemEl);

        items.push({
          x: x, rotor: rotor, word: wordEl,
          angle: (Math.random() - 0.5) * 6,
          velocity: 0,
          freq: SCALE[Math.floor(Math.random() * SCALE.length)]
        });
      }
    }
    build();

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 250);
    });

    // ---------- Sound: a soft synthesized pluck, not a sampled instrument ----------
    var audioCtx = null;
    function ensureAudio() {
      if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtx = null; }
      } else if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
    }
    function pluck(freq) {
      if (!audioCtx) return;
      try {
        var t = audioCtx.currentTime;
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.15, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.9);
      } catch (e) { /* audio not available — silently skip */ }
    }

    field.addEventListener("mouseenter", ensureAudio, true);
    field.addEventListener("click", function (e) {
      ensureAudio();
      var el = e.target.closest && e.target.closest(".string-word");
      if (!el) return;
      var item = items.filter(function (it) { return it.word === el; })[0];
      if (item) { pluck(item.freq); item.velocity += (Math.random() - 0.5) * 10; }
    });
    field.addEventListener("mouseover", function (e) {
      var el = e.target.closest && e.target.closest(".string-word");
      if (!el || el.dataset.chimed === "1") return;
      el.dataset.chimed = "1";
      window.setTimeout(function () { el.dataset.chimed = ""; }, 260);
      var item = items.filter(function (it) { return it.word === el; })[0];
      if (item) pluck(item.freq);
    });

    // ---------- Physics: damped spring per string, nudged by mouse proximity ----------
    var mouseX = null, mouseY = null;
    heroEl.addEventListener("mousemove", function (e) {
      var r = heroEl.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    });
    heroEl.addEventListener("mouseleave", function () { mouseX = null; mouseY = null; });

    var STIFFNESS = 0.012, DAMPING = 0.055, RADIUS = 110;
    function tick() {
      items.forEach(function (item) {
        var force = 0;
        if (mouseX !== null) {
          var dx = mouseX - item.x;
          var dist = Math.abs(dx);
          if (dist < RADIUS && mouseY !== null && mouseY < (item.rotor.offsetHeight || 200) + 60) {
            var push = (1 - dist / RADIUS) * 2.2;
            force = dx > 0 ? -push : push;
          }
        }
        item.velocity += (-STIFFNESS * item.angle - DAMPING * item.velocity) * 16 + force * 0.06;
        item.angle += item.velocity;
        item.rotor.style.transform = "rotate(" + item.angle.toFixed(2) + "deg)";
        item.word.style.transform = "translate(-50%, 55%) rotate(" + (-item.angle).toFixed(2) + "deg)";
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();
})();
