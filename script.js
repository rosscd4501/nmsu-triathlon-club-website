// ============================================
// NMSU Triathlon Club — Shared Script
// Handles: mobile nav toggle, image slideshows
// ============================================

// ---- Mobile nav toggle ----
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("nav ul");
  if (toggle && menu) {
    toggle.addEventListener("click", () => menu.classList.toggle("open"));
  }

  // ---- Slideshows ----
  // Any element with class "slideshow" is auto-wired up.
  // Structure expected inside:
  //   .slide (one per image, first has class "active")
  //   .slide-arrow.prev / .slide-arrow.next
  //   .thumb-strip button (optional, one per slide)
  document.querySelectorAll(".slideshow-wrap").forEach(setupSlideshow);
});

function setupSlideshow(wrap) {
  const slides = Array.from(wrap.querySelectorAll(".slide"));
  const thumbStrip = wrap.querySelector(".thumb-strip");
  let thumbs = thumbStrip ? Array.from(thumbStrip.querySelectorAll("button")) : [];
  let current = 0;
  let autoAdvanceTimer = null;
  let isPaused = false;

  if (thumbStrip && thumbs.length === 0) {
    slides.forEach((slide, index) => {
      const slideImg = slide.querySelector("img");
      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.setAttribute("aria-label", `Photo ${index + 1}`);

      const thumbImg = document.createElement("img");
      thumbImg.src = slideImg ? slideImg.getAttribute("src") : "";
      thumbImg.alt = "";

      thumb.appendChild(thumbImg);
      thumb.addEventListener("click", () => show(index));
      thumbStrip.appendChild(thumb);
    });

    thumbs = Array.from(thumbStrip.querySelectorAll("button"));
  } else {
    thumbs.forEach((thumb, i) => {
      thumb.addEventListener("click", () => show(i));
    });
  }

  function startAutoAdvance() {
    if (isPaused) return;
    if (autoAdvanceTimer) window.clearInterval(autoAdvanceTimer);
    autoAdvanceTimer = window.setInterval(() => {
      show(current + 1);
    }, 7000);
  }

  function show(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;
    slides.forEach((s, i) => s.classList.toggle("active", i === current));
    thumbs.forEach((t, i) => t.classList.toggle("active", i === current));
    startAutoAdvance();
  }

  const prevBtn = wrap.querySelector(".slide-arrow.prev");
  const nextBtn = wrap.querySelector(".slide-arrow.next");
  if (prevBtn) prevBtn.addEventListener("click", () => show(current - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => show(current + 1));

  wrap.addEventListener("mouseenter", () => {
    isPaused = true;
    if (autoAdvanceTimer) window.clearInterval(autoAdvanceTimer);
  });

  wrap.addEventListener("mouseleave", () => {
    isPaused = false;
    startAutoAdvance();
  });

  show(0);
}
