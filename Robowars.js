/* ===============================
   ROBOWARS.JS — Raudra Page
   ===============================
   Sections:
   1. Page Initialization   — boots all modules on DOMContentLoaded
   2. Navigation System     — hamburger, sidebar, scroll-spy
   3. Ambient Ember Particles — blue sparks across the hero canvas
   4. Counter Animation     — animates stat numbers when in view
   5. Scroll Animations     — staggered fade-in on scroll
   6. Aceternity Spotlight  — cursor spotlight effect on cards
   7. Gallery Filter        — category filter + reveal animation
   8. Year Accordion        — collapsible journey timeline
   9. Lightbox              — full-screen gallery viewer
   =============================== */

/* ── 1. BOOT — run everything after the DOM is ready ── */
document.addEventListener('DOMContentLoaded', function () {
  initializeLoader();
  initializeNavigation();
  initializeFireCanvas();
  initializeCounters();
  initializeScrollAnimations();
  initializeSpotlight();
  initializeGallery();
  initializeLightbox();
  initializeAccordion();
  initializeCursor();
  initializeBackToTop();
  initializeTypewriter();
  initializeShowcase();
});

/* ===============================
   2. NAVIGATION SYSTEM
   Handles: hamburger toggle, dropdown menu, smooth scroll,
   sidebar auto-show/hide on scroll, scroll-spy for active link
   =============================== */
function initializeNavigation() {
  const header       = document.getElementById('main-header');
  const sidebar      = document.getElementById('sidebar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu      = document.getElementById('nav-menu');
  const mainContent  = document.getElementById('main-content');
  const navLinks     = document.querySelectorAll('.nav-link');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sections     = document.querySelectorAll('section[id]');

  let isMenuOpen    = false;
  let lastScrollTop = 0;
  let sidebarActive = false;

  /* Show sidebar (desktop ≥900px only) — offsets main content by 80px */
  function activateSidebar() {
    if (window.innerWidth < 900 || sidebarActive) return;
    sidebarActive = true;
    document.body.classList.add('sidebar-active');
    sidebar.classList.add('active');
    mainContent.style.marginLeft = '80px';
  }

  /* Hide sidebar and reset main content margin */
  function deactivateSidebar() {
    if (!sidebarActive) return;
    sidebarActive = false;
    document.body.classList.remove('sidebar-active');
    sidebar.classList.remove('active');
    mainContent.style.marginLeft = '0';
  }

  /* Hamburger click — toggle dropdown nav with staggered link animation */
  hamburgerBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    isMenuOpen = !isMenuOpen;
    hamburgerBtn.classList.toggle('active', isMenuOpen);
    navMenu.classList.toggle('active', isMenuOpen);

    if (isMenuOpen) {
      navLinks.forEach(function (link, i) {
        link.style.transitionDelay = (i * 0.05) + 's';
        link.style.transform = 'translateY(0)';
        link.style.opacity   = '1';
      });
    }
  });

  /* Click outside nav → close the dropdown */
  document.addEventListener('click', function (e) {
    if (isMenuOpen && !header.contains(e.target)) {
      isMenuOpen = false;
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
      navLinks.forEach(function (link) {
        link.style.transform       = 'translateY(-20px)';
        link.style.opacity         = '0';
        link.style.transitionDelay = '0s';
      });
    }
  });

  /* Smooth scroll for all same-page # anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href   = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      /* Close mobile menu after nav click */
      isMenuOpen = false;
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  const heroSection = document.getElementById('hero');

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;

    /* Auto-show sidebar once past the hero section bottom */
    if (window.innerWidth >= 900) {
      const heroBottom = heroSection
        ? heroSection.offsetTop + heroSection.offsetHeight
        : 500;
      if (scrollY >= heroBottom - 200) {
        activateSidebar();
      } else {
        deactivateSidebar();
      }
    }

    /* Scroll-spy — mark the sidebar link that matches the visible section */
    sections.forEach(function (section) {
      const top    = section.offsetTop - 150;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < bottom) {
        sidebarLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) link.classList.add('active');
        });
      }
    });

    lastScrollTop = scrollY;
  });

  /* Hide sidebar when viewport shrinks to mobile width */
  window.addEventListener('resize', function () {
    if (window.innerWidth < 900) deactivateSidebar();
  });
}

/* ===============================
   3. AMBIENT EMBER PARTICLES
   110 tiny glowing dots fill the entire hero canvas.
   Each spawns at a random position, drifts gently in a random
   direction with a slight upward bias, wobbles sideways, then
   fades and respawns — creating an atmospheric blue-fire ambience.
   =============================== */
function initializeFireCanvas() {
  const canvas = document.getElementById('raudraFireCanvas');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  const hero = document.querySelector('.rw-hero');

  /* Match canvas size to hero section; re-sync on window resize */
  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Ember constructor ── */
  function Ember() { this.spawn(); }

  /* Place ember at a fresh random position across the full canvas */
  Ember.prototype.spawn = function () {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    /* Velocity: random direction, slight upward bias */
    var angle = Math.random() * Math.PI * 2;
    var speed = Math.random() * 0.55 + 0.12;
    this.vx   = Math.cos(angle) * speed;
    this.vy   = Math.sin(angle) * speed - 0.3;  // -0.3 tilts upward

    this.wobble     = (Math.random() - 0.5) * 0.035; // side-to-side drift per frame
    this.size       = Math.random() * 2.0 + 0.5;     // 0.5–2.5 px radius
    this.maxOpacity = Math.random() * 0.55 + 0.25;   // individual peak brightness
    this.life       = Math.random();                  // stagger initial life
    this.decay      = Math.random() * 0.005 + 0.002; // slow fade rate

    /* Colour — blue fire palette: electric blue → cyan → white-blue */
    var roll = Math.random();
    if (roll < 0.40) {
      // deep electric blue (inner core feel)
      this.r = 20  + Math.floor(Math.random() * 35);
      this.g = 90  + Math.floor(Math.random() * 75);
      this.b = 225 + Math.floor(Math.random() * 30);
    } else if (roll < 0.72) {
      // bright cyan (mid-flame)
      this.r = 0;
      this.g = 185 + Math.floor(Math.random() * 55);
      this.b = 245 + Math.floor(Math.random() * 10);
    } else if (roll < 0.90) {
      // pale blue-white (outer edge)
      this.r = 155 + Math.floor(Math.random() * 70);
      this.g = 215 + Math.floor(Math.random() * 40);
      this.b = 255;
    } else {
      // near-white hot tip (rare brightest sparks)
      this.r = 210 + Math.floor(Math.random() * 45);
      this.g = 235 + Math.floor(Math.random() * 20);
      this.b = 255;
    }
  };

  /* Move ember one frame, respawn if off-screen or fully faded */
  Ember.prototype.update = function () {
    this.vx  += this.wobble;   // apply side drift
    this.vy  -= 0.002;         // gentle upward pull each frame
    this.x   += this.vx;
    this.y   += this.vy;
    this.life -= this.decay;
    this.size  = Math.max(0, this.size - 0.006);

    if (this.life <= 0 || this.size <= 0 ||
        this.x < -10 || this.x > canvas.width  + 10 ||
        this.y < -10 || this.y > canvas.height + 10) {
      this.spawn(); // recycle
    }
  };

  /* Draw ember as a soft glowing circle */
  Ember.prototype.draw = function () {
    var alpha = Math.max(0, Math.min(1, this.life) * this.maxOpacity);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle   = 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
    ctx.shadowBlur  = 7 + this.size * 3;  // glow radius scales with size
    ctx.shadowColor = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',0.75)';
    ctx.fill();
    ctx.restore();
  };

  /* Create 110 embers with staggered initial life so they don't all sync */
  var MAX    = 110;
  var embers = [];
  for (var i = 0; i < MAX; i++) { embers.push(new Ember()); }

  /* Animation loop — only runs while hero is in the viewport */
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var heroRect = hero.getBoundingClientRect();
    var inView   = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

    if (inView) {
      for (var j = 0; j < embers.length; j++) {
        embers[j].update();
        embers[j].draw();
      }
    }

    requestAnimationFrame(loop);
  }

  loop();
}

/* ===============================
   4. COUNTER ANIMATION
   Counts up from 0 to data-count when the element enters view.
   Uses IntersectionObserver so it only triggers once per element.
   =============================== */
function initializeCounters() {
  const counters = document.querySelectorAll('.rw-stat-num[data-count]');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // fire once only
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { observer.observe(c); });
}

/* Increments el's text from 0 → target over ~1800ms */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1800;
  const step     = duration / target;
  let   current  = 0;
  const timer = setInterval(function () {
    current++;
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, step);
}

/* ===============================
   5. SCROLL ANIMATIONS  (staggered reveal)
   Elements with .animate-on-scroll fade up when scrolled into view.
   Card-type children stagger in one-by-one (75ms apart).
   =============================== */
function initializeScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  /* Pre-hide all card children so they can animate in */
  const staggerSel = '.rw-spec-card,.rw-timeline-item,.rw-gallery-item,.rw-bts-card,.rw-video-card,.rw-highlight';
  document.querySelectorAll(staggerSel).forEach(function (el) {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      /* Stagger-reveal card children if present */
      const children = entry.target.querySelectorAll(staggerSel);
      if (children.length > 0) {
        children.forEach(function (child, i) {
          setTimeout(function () {
            child.style.opacity   = '1';
            child.style.transform = 'translateY(0)';
          }, i * 75);
        });
      }

      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(function (el) { observer.observe(el); });
}

/* ===============================
   6. ACETERNITY SPOTLIGHT ON CARDS
   Tracks mouse position per card via CSS custom properties
   (--mouse-x / --mouse-y). CSS ::before uses those to paint
   a radial gradient highlight that follows the cursor.
   =============================== */
function initializeSpotlight() {
  const sel   = '.rw-spec-card, .rw-timeline-card, .rw-gallery-item, .rw-video-card, .rw-highlight';
  const cards = document.querySelectorAll(sel);

  cards.forEach(function (card) {
    /* Update spotlight position on mouse move */
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });

    /* Reset spotlight to card centre on mouse leave */
    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
}

/* ===============================
   7. GALLERY FILTER & REVEAL
   Filter buttons show/hide gallery items by category class.
   Visible items get a quick scale-in animation on filter change.
   =============================== */
function initializeGallery() {
  const filterBtns = document.querySelectorAll('.rw-filter-btn');
  const items      = document.querySelectorAll('.rw-gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      /* Mark clicked button as active */
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      /* Show/hide items based on category, animate shown ones */
      items.forEach(function (item) {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.classList.remove('hidden');
          item.style.animation = 'galleryReveal 0.38s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* Inject the reveal keyframe once if not already present */
  if (!document.getElementById('galleryRevealStyle')) {
    const style = document.createElement('style');
    style.id          = 'galleryRevealStyle';
    style.textContent = '@keyframes galleryReveal { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }';
    document.head.appendChild(style);
  }
}

/* ===============================
   8. YEAR ACCORDION (Journey section)
   Each year block toggles open/closed on header click.
   Only one year can be open at a time — clicking a new one
   collapses all others first.
   =============================== */
function initializeAccordion() {
  const headers = document.querySelectorAll('.rw-year-header');

  headers.forEach(function (header) {
    header.addEventListener('click', function () {
      const block  = header.closest('.rw-year-block');
      const body   = block.querySelector('.rw-year-body');
      const isOpen = header.getAttribute('aria-expanded') === 'true';

      /* Close any currently open year */
      document.querySelectorAll('.rw-year-header[aria-expanded="true"]').forEach(function (h) {
        if (h !== header) {
          h.setAttribute('aria-expanded', 'false');
          h.closest('.rw-year-block').querySelector('.rw-year-body').classList.remove('open');
        }
      });

      /* Toggle this year open or closed */
      if (isOpen) {
        header.setAttribute('aria-expanded', 'false');
        body.classList.remove('open');
      } else {
        header.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
      }
    });
  });
}

/* ===============================
   9. LIGHTBOX
   Clicking a gallery item opens a full-screen overlay.
   Supports both images and videos (detected via data-src extension).
   Keyboard (Esc/arrows) and touch swipe navigation preserved.
   =============================== */
function initializeLightbox() {
  var lightbox    = document.getElementById('lightbox');
  var mediaContainer = document.getElementById('lightboxMediaContainer');
  var lbCap       = document.getElementById('lightboxCaption');
  var lbClose     = document.getElementById('lightboxClose');
  var lbPrev      = document.getElementById('lightboxPrev');
  var lbNext      = document.getElementById('lightboxNext');

  /* Bail out gracefully if lightbox HTML is missing */
  if (!lightbox || !mediaContainer) return;

  var galleryItems = [];
  var currentIndex = 0;

  /* ── Helpers ── */

  /* Returns 'video' for .mp4/.webm/.ogg, 'image' for everything else */
  function getMediaType(src) {
    if (!src) return 'image';
    var ext = src.split('.').pop().toLowerCase().split('?')[0];
    return (ext === 'mp4' || ext === 'webm' || ext === 'ogg') ? 'video' : 'image';
  }

  /* Stops and removes any active video to prevent background audio */
  function clearMedia() {
    var existing = mediaContainer.querySelector('video');
    if (existing) {
      existing.pause();
      existing.src = '';
      existing.load();
    }
    mediaContainer.innerHTML = '';
  }

  /* Injects the correct media element and updates the caption */
  function showMedia(idx) {
    var item = galleryItems[idx];
    if (!item) return;

    var src     = item.getAttribute('data-src') || '';
    var caption = item.getAttribute('data-caption') || '';
    var alt     = (item.querySelector('img') || {}).alt || 'Gallery image';

    /* Determine the media type from the file extension */
    var type = getMediaType(src);

    clearMedia(); /* always wipe previous media first */

    if (type === 'video' && src) {
      /* Build a <video> element for mp4/webm/ogg sources */
      var video = document.createElement('video');
      video.controls    = true;
      video.autoplay    = true;
      video.loop        = true;
      video.playsInline = true;
      var source = document.createElement('source');
      source.src  = src;
      source.type = 'video/' + src.split('.').pop().toLowerCase();
      video.appendChild(source);
      mediaContainer.appendChild(video);
    } else if (src) {
      /* Build an <img> element for all other sources */
      var img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      mediaContainer.appendChild(img);
    }
    /* Update caption text */
    lbCap.textContent = caption;
  }

  /* Opens the lightbox at the given index */
  function openLightbox(idx) {
    /* Re-query visible items each open (filter may have changed) */
    galleryItems = Array.from(document.querySelectorAll('.rw-gallery-item:not(.hidden)'));
    currentIndex = idx;
    showMedia(currentIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; /* prevent background scroll */
  }

  function closeLightbox() {
    clearMedia(); /* stop any playing video before hiding */
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ── Event bindings ── */

  /* Click any gallery item to open lightbox */
  document.querySelectorAll('.rw-gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var visible = Array.from(document.querySelectorAll('.rw-gallery-item:not(.hidden)'));
      var idx     = visible.indexOf(item);
      openLightbox(idx >= 0 ? idx : 0);
    });
  });

  /* Close button and clicking the backdrop */
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* Prev / Next navigation */
  lbPrev.addEventListener('click', function () {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    showMedia(currentIndex);
  });
  lbNext.addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    showMedia(currentIndex);
  });

  /* Keyboard — Esc closes, arrow keys navigate */
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     { closeLightbox(); }
    if (e.key === 'ArrowLeft')  { currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length; showMedia(currentIndex); }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % galleryItems.length; showMedia(currentIndex); }
  });

  /* Touch swipe — >50px horizontal swipe navigates */
  var touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  });
  lightbox.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) {
      currentIndex = dx > 0
        ? (currentIndex - 1 + galleryItems.length) % galleryItems.length
        : (currentIndex + 1) % galleryItems.length;
      showMedia(currentIndex);
    }
  });
}

/* ===============================
   10. CUSTOM CURSOR
   A two-part cursor: a sharp dot that follows instantly,
   and a larger ring that lags behind for a trailing effect.
   Changes size/colour on hover over interactive elements.
   =============================== */
function initializeCursor() {
  var dot  = document.getElementById('rw-cursor-dot');
  var ring = document.getElementById('rw-cursor-ring');

  if (!dot || !ring) return;

  /* Touch devices — bail out, native cursor is better */
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  var dotX  = 0, dotY  = 0; /* dot tracks mouse exactly */
  var ringX = 0, ringY = 0; /* ring lags with lerp */

  /* Lerp factor — lower = more lag (0.08–0.15 is a nice feel) */
  var LERP = 0.12;

  /* Move dot instantly to cursor position */
  document.addEventListener('mousemove', function (e) {
    dotX = e.clientX;
    dotY = e.clientY;
    dot.style.left = dotX + 'px';
    dot.style.top  = dotY + 'px';
  });

  /* Animate ring with lag via requestAnimationFrame */
  function animateRing() {
    /* Linear interpolation: ring creeps toward dot each frame */
    ringX += (dotX - ringX) * LERP;
    ringY += (dotY - ringY) * LERP;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  /* Hover state — expand ring on links, buttons, cards */
  var hoverSel = 'a, button, .rw-gallery-item, .rw-spec-card, .rw-video-card, .rw-je-photo-card, .rw-je-video-card, .rw-filter-btn, .rw-btn, .sidebar-link, .nav-link, .rw-highlight';

  document.querySelectorAll(hoverSel).forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', function () {
      document.body.classList.remove('cursor-hover');
    });
  });

  /* Hide ring when cursor leaves the window */
  document.addEventListener('mouseleave', function () {
    ring.style.opacity = '0';
    dot.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', function () {
    ring.style.opacity = '1';
    dot.style.opacity  = '1';
  });

  /* Click flash — dot pulses on click */
  document.addEventListener('mousedown', function () {
    dot.style.transform = 'translate(-50%, -50%) scale(0.6)';
  });
  document.addEventListener('mouseup', function () {
    dot.style.transform = 'translate(-50%, -50%) scale(1)';
  });
}

/* ===============================
   11. BACK TO TOP BUTTON
   Appears once the user scrolls past the hero section.
   Smooth-scrolls to the top on click.
   =============================== */
function initializeBackToTop() {
  var btn    = document.getElementById('rw-back-top');
  var hero   = document.getElementById('hero');
  if (!btn) return;

  var ticking = false;

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var threshold = hero
        ? hero.offsetTop + hero.offsetHeight * 0.6
        : 500;
      if (window.scrollY > threshold) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
      ticking = false;
    });
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===============================
   12. PAGE LOADING SCREEN
   Plays a ~2s cinematic intro on first load.
   Locks body scroll during the intro, then fades out
   and unlocks scroll when done.
   =============================== */
function initializeLoader() {
  var loader = document.getElementById('rw-loader');
  if (!loader) return;

  /* Lock scroll while intro plays */
  document.body.style.overflow = 'hidden';

  /* Canvas fire burst — blue sparks explode from centre at the slam moment */
  var canvas = document.getElementById('rw-loader-canvas');
  var ctx    = canvas ? canvas.getContext('2d') : null;
  var particles = [];

  if (canvas && ctx) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', function () {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    /* Spawn a burst of 120 sparks from the centre */
    function spawnBurst() {
      var cx = canvas.width  / 2;
      var cy = canvas.height / 2;
      for (var i = 0; i < 120; i++) {
        var angle = Math.random() * Math.PI * 2;
        var speed = Math.random() * 9 + 2;
        var roll  = Math.random();
        var r, g, b;
        if (roll < 0.45) { r = 20;  g = 120; b = 255; }
        else if (roll < 0.75) { r = 0; g = 191; b = 255; }
        else if (roll < 0.92) { r = 126; g = 200; b = 255; }
        else { r = 220; g = 240; b = 255; }

        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1,
          life: 1,
          decay: Math.random() * 0.018 + 0.012,
          r: r, g: g, b: b
        });
      }
    }

    /* Trigger burst at the same time the title slams in */
    setTimeout(spawnBurst, 450);

    /* Particle loop */
    function particleLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vy += 0.08; /* slight gravity */
        p.life -= p.decay;
        p.size = Math.max(0, p.size - 0.03);
        if (p.life <= 0 || p.size <= 0) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(' + p.r + ',' + p.g + ',' + p.b + ')';
        ctx.shadowBlur  = 10 + p.size * 4;
        ctx.shadowColor = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',0.8)';
        ctx.fill();
        ctx.restore();
      }
      if (particles.length > 0) requestAnimationFrame(particleLoop);
    }
    particleLoop();
  }

  /* After 2.3s — fade out loader and unlock scroll */
  setTimeout(function () {
    loader.classList.add('fade-out');
    document.body.style.overflow = '';

    /* Remove from DOM entirely after fade completes */
    setTimeout(function () {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    }, 750);
  }, 2300);
}

/* ===============================
   14. TYPEWRITER EFFECT — Hero Description
   Waits for the loading screen to finish, then types
   the hero description character by character.
   Speed and delay are tunable via the config at the top.
   =============================== */
function initializeTypewriter() {
  var el     = document.getElementById('rw-typewriter');
  var cursor = document.querySelector('.rw-typewriter-cursor');
  if (!el || !cursor) return;

  var text    = el.getAttribute('data-text') || '';
  var index   = 0;

  /* Config */
  var CHAR_SPEED  = 32;   /* ms per character — lower = faster typing */
  var START_DELAY = 2500; /* ms — starts just after the loader fades out (loader exits at 2300ms) */

  /* Start typing after loader is gone */
  setTimeout(function () {
    var timer = setInterval(function () {

      /* Type next character */
      el.textContent = text.slice(0, index + 1);
      index++;

      /* Typing done — mark cursor for fade-out */
      if (index >= text.length) {
        clearInterval(timer);
        cursor.classList.add('done');
      }

    }, CHAR_SPEED);
  }, START_DELAY);
}

/* ===============================
   15. AUTO-ROTATING BOT SHOWCASE
   Crossfades through slides in the About section image card.
   Pauses on hover. Dots are clickable to jump to any slide.
   A thin progress bar at the bottom shows time until next slide.
   =============================== */
function initializeShowcase() {
  var wrap    = document.getElementById('rwShowcase');
  var caption = document.getElementById('rwShowcaseCaption');
  var dotsEl  = document.getElementById('rwShowcaseDots');
  if (!wrap) return;

  var slides  = wrap.querySelectorAll('.rw-showcase-slide');
  var dots    = wrap.querySelectorAll('.rw-showcase-dot');
  if (!slides.length) return;

  /* Caption text per slide — order must match the HTML slide order */
  var captions = [
    'Competition Ready',
    'Blueprint & Design',
    'Chassis Prototype',
    'Bot with Bolts',
    'Podium Finish 🏆'
  ];

  var DURATION = 3000;  /* ms between slides — change this to adjust speed */
  var current  = 0;
  var timer    = null;
  var paused   = false;

  /* Switch to a specific slide index */
  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = (idx + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current].classList.add('active');

    if (caption) {
      caption.style.opacity = '0';
      setTimeout(function () {
        caption.textContent  = captions[current] || '';
        caption.style.opacity = '1';
      }, 200);
    }

    /* Restart progress bar animation */
    wrap.classList.remove('ticking');
    wrap.style.setProperty('--slide-duration', DURATION + 'ms');
    void wrap.offsetWidth; /* force reflow so animation restarts cleanly */
    if (!paused) wrap.classList.add('ticking');
  }

  /* Auto-advance timer */
  function startTimer() {
    clearInterval(timer);
    timer = setInterval(function () {
      if (!paused) goTo(current + 1);
    }, DURATION);
  }

  /* Pause on hover */
  wrap.addEventListener('mouseenter', function () {
    paused = true;
    wrap.classList.remove('ticking');
  });

  wrap.addEventListener('mouseleave', function () {
    paused = false;
    goTo(current); /* restart progress bar from current slide */
    startTimer();
  });

  /* Dot clicks */
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var idx = parseInt(this.getAttribute('data-index'), 10);
      goTo(idx);
      startTimer();
    });
  });

  /* Kick everything off */
  wrap.style.setProperty('--slide-duration', DURATION + 'ms');
  wrap.classList.add('ticking');
  startTimer();
}