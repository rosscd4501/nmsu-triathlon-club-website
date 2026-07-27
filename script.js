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
  const slides = wrap.querySelectorAll(".slide");
  const thumbs = wrap.querySelectorAll(".thumb-strip button");
  let current = 0;

  function show(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;
    slides.forEach((s, i) => s.classList.toggle("active", i === current));
    thumbs.forEach((t, i) => t.classList.toggle("active", i === current));
  }

  const prevBtn = wrap.querySelector(".slide-arrow.prev");
  const nextBtn = wrap.querySelector(".slide-arrow.next");
  if (prevBtn) prevBtn.addEventListener("click", () => show(current - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => show(current + 1));

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener("click", () => show(i));
  });

  show(0);
}
