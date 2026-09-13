// Personal photo roll & lightbox
const SNAPS_DATA = [];

let currentLightboxIndex = 0;

document.addEventListener("DOMContentLoaded", function () {
  renderSnaps();
  initSnapsEntrance();
  initLightbox();
});

// Render cards into grid
function renderSnaps() {
  const grid = document.getElementById("snaps-grid");
  const countBadge = document.getElementById("snaps-count-num");

  if (countBadge) {
    countBadge.textContent = SNAPS_DATA.length;
  }

  if (!grid) return;

  if (SNAPS_DATA.length === 0) {
    grid.innerHTML = `
      <div class="snaps-empty-state">
        <i class="bi bi-camera"></i>
        <p>No snaps uploaded yet. Check back soon!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = SNAPS_DATA.map(
    (snap, index) => `
    <article class="snap-card" data-index="${index}" tabindex="0" role="button" aria-label="View photo: ${snap.title}">
      <div class="snap-img-wrap">
        <img src="${snap.url}" alt="${snap.title}" loading="lazy" class="snap-img" />
      </div>
      <div class="snap-meta-bar">
        <span class="snap-title">${snap.title}</span>
        <span class="snap-date">${snap.date}</span>
      </div>
    </article>
  `,
  ).join("");
}

// Staggered card entrance
function initSnapsEntrance() {
  const cards = document.querySelectorAll(".snap-card");
  const isIntroActive =
    !sessionStorage.getItem("introShown") &&
    document.getElementById("loading-screen");
  const baseDelay = isIntroActive ? 2200 : 200;

  setTimeout(() => {
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("card-visible");
      }, index * 75);
    });
  }, baseDelay);
}

// Fullscreen lightbox controller
function initLightbox() {
  const lightbox = document.getElementById("snaps-lightbox");
  const backdrop = document.getElementById("lightbox-backdrop");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  const date = document.getElementById("lightbox-date");
  const rawLink = document.getElementById("lightbox-raw-link");

  if (!lightbox) return;

  function openLightbox(index) {
    currentLightboxIndex = index;
    const snap = SNAPS_DATA[currentLightboxIndex];
    if (!snap) return;

    img.src = snap.url;
    img.alt = snap.title;
    caption.textContent = snap.caption || snap.title;
    date.textContent = snap.date;
    if (rawLink) rawLink.href = snap.url;

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showPrev() {
    if (SNAPS_DATA.length <= 1) return;
    currentLightboxIndex =
      (currentLightboxIndex - 1 + SNAPS_DATA.length) % SNAPS_DATA.length;
    openLightbox(currentLightboxIndex);
  }

  function showNext() {
    if (SNAPS_DATA.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % SNAPS_DATA.length;
    openLightbox(currentLightboxIndex);
  }

  // Card click & keyboard enter
  document.addEventListener("click", function (e) {
    const card = e.target.closest(".snap-card");
    if (card) {
      const idx = parseInt(card.getAttribute("data-index"), 10);
      if (!isNaN(idx)) openLightbox(idx);
    }
  });

  document.addEventListener("keydown", function (e) {
    const card = e.target.closest(".snap-card");
    if (card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      const idx = parseInt(card.getAttribute("data-index"), 10);
      if (!isNaN(idx)) openLightbox(idx);
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (backdrop) backdrop.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", showPrev);
  if (nextBtn) nextBtn.addEventListener("click", showNext);

  // Keyboard navigation inside lightbox
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") showPrev();
    else if (e.key === "ArrowRight") showNext();
  });
}
