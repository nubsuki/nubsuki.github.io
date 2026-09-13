// Personal photo roll & lightbox
// Schema per snap:
// - title: string
// - date: string (e.g. "AUG 24, 2026")
// - url: string
// - capturedBy: string
// - capturedByUrl: string
// - location: string
// - mapUrl: string
const SNAPS_DATA = [
  {
    title: "Melon",
    date: "AUG 24, 2026",
    capturedBy: "nubsuki",
    capturedByUrl: "https://www.instagram.com/nubsuki",
    url: "https://drive.google.com/file/d/1oTgqhf1TcU9aN2tgPq2p7xTAMBkMLGko/view?usp=drive_link",
  },
  {
    title: "Rainy day",
    date: "JUN 23, 2024",
    capturedBy: "nubsuki",
    capturedByUrl: "https://www.instagram.com/nubsuki",
    url: "https://drive.google.com/file/d/1O5Yx-W9Cbu2VzZQAF7kbzmQA6_GODHGo/view?usp=drive_link",
  },
  {
    title: "Cat",
    date: "SEP 01, 2026",
    capturedBy: "Shou",
    capturedByUrl: "https://www.instagram.com/shou_chan002",
    url: "https://drive.google.com/file/d/13epl0xTIfD4h2Sb7Y9IIGraJb9ohplmG/view?usp=drive_link",
  },
  {
    title: "Lambargambar",
    date: "FEB 04, 2026",
    capturedBy: "nubsuki",
    capturedByUrl: "https://www.instagram.com/nubsuki",
    url: "https://drive.google.com/file/d/11Pv3Fe7R0N9Ubi1ynFVQ8gNZvyjpU1f4/view?usp=drive_link",
  },
  {
    title: "Cultural pageant",
    date: "SEP 12, 2026",
    capturedBy: "nubsuki",
    capturedByUrl: "https://www.instagram.com/nubsuki",
    url: "https://drive.google.com/file/d/14HVWE3uB7-ocZ6Zx298bB4cJyRjpw99S/view?usp=drive_link",
    location: "Kotte Raja Maha Vihara",
    mapUrl: "https://share.google/mhnesdQUBqKgmdokj",
  },
  {
    title: "Moon",
    date: "JUN 21, 2024",
    capturedBy: "nubsuki",
    capturedByUrl: "https://www.instagram.com/nubsuki",
    url: "https://drive.google.com/file/d/1ArnBo2pYdAEfOrUPK2k-lvXXxM0dFGbp/view?usp=drive_link",
  },
  {
    title: "who's there?",
    date: "FEB 05, 2025",
    capturedBy: "nubsuki",
    capturedByUrl: "https://www.instagram.com/nubsuki",
    url: "https://drive.google.com/file/d/1opl555-Q3nphsUp1dJaYEHFpK-58EBGB/view?usp=drive_link",
  },
  {
    title: "Dusk",
    date: "SEP 07, 2026",
    capturedBy: "Shou",
    capturedByUrl: "https://www.instagram.com/shou_chan002",
    url: "https://drive.google.com/file/d/1vNbVn6fypEv2Q2pP1xBnfAztzyDTCIb4/view?usp=drive_link",
  },
  {
    title: "",
    date: "MAY 12, 2026",
    capturedBy: "Shou",
    capturedByUrl: "https://www.instagram.com/shou_chan002",
    url: "https://drive.google.com/file/d/16Y_FjcPZepwWPxpIRZ7U5IJo-4cAr0zi/view?usp=drive_link",
    location: "Madiwela Jogging Track",
    mapUrl: "https://maps.app.goo.gl/7kpAr1ATmf6vdWrYA",
  },
  {
    title: "",
    date: "NOV 19, 2025",
    capturedBy: "nubsuki",
    capturedByUrl: "https://www.instagram.com/nubsuki",
    url: "https://drive.google.com/file/d/1XgZrtmzts2wOQ7Q4fc8N3pn2-DgWgrz8/view?usp=drive_link",
    location: "Marine Drive",
    mapUrl: "https://maps.app.goo.gl/4rd8WWtCgfFFwDDEA",
  },
  {
    title: "",
    date: "MAY 17, 2026",
    capturedBy: "nubsuki",
    capturedByUrl: "https://www.instagram.com/nubsuki",
    url: "https://drive.google.com/file/d/1P5cIk2kDMKaTvbnw0c1l8NEf1QyoP8Fk/view?usp=drive_link",
  },
];

let currentLightboxIndex = 0;
let sortOrder = "added";
let sortedSnaps = [];

// Sort snaps: preserves added order by default, or sorts by date when button clicked
function getSortedSnaps() {
  if (sortOrder === "added") {
    return [...SNAPS_DATA];
  }
  return [...SNAPS_DATA].sort((a, b) => {
    const timeA = new Date(a.date).getTime() || 0;
    const timeB = new Date(b.date).getTime() || 0;
    return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
  });
}

// Convert Google Drive links to direct high-speed image stream
function resolveSnapUrl(url) {
  if (!url) return "";
  const driveFileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const driveIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const fileId = driveFileMatch
    ? driveFileMatch[1]
    : driveIdMatch
      ? driveIdMatch[1]
      : null;

  if (
    fileId &&
    (url.includes("drive.google.com") || url.includes("docs.google.com"))
  ) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return url;
}

// Resolve Google Maps link from custom mapUrl or place name
function getMapUrl(snap) {
  if (snap.mapUrl) return snap.mapUrl;
  if (snap.locationUrl) return snap.locationUrl;
  const loc = snap.location || snap.loc;
  if (!loc) return null;
  if (
    snap.mapUrl === false ||
    loc.toLowerCase() === "home" ||
    loc.toLowerCase() === "desk"
  ) {
    return null;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`;
}

// Resolve photographer / author and optional Instagram or Facebook link
function getCapturedByInfo(snap) {
  const raw =
    snap.capturedBy || snap.captured_by || snap.by || snap.photographer;
  if (!raw) return null;

  let name = "";
  let url =
    snap.capturedByUrl ||
    snap.captured_by_url ||
    snap.byUrl ||
    snap.socialUrl ||
    "";

  if (typeof raw === "object") {
    name = raw.name || "";
    url = raw.url || raw.socialUrl || url;
  } else {
    name = String(raw).trim();
  }

  if (!name) return null;

  // Detect social icon: Instagram or Facebook
  let iconClass = "bi bi-person-fill";
  if (url) {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("instagram.com")) {
      iconClass = "bi bi-instagram";
    } else if (
      lowerUrl.includes("facebook.com") ||
      lowerUrl.includes("fb.com") ||
      lowerUrl.includes("fb.me")
    ) {
      iconClass = "bi bi-facebook";
    }
  }

  return { name, url, iconClass };
}

document.addEventListener("DOMContentLoaded", function () {
  renderSnaps();
  initSnapsEntrance();
  initSortControl();
  initLightbox();
});

// Controls Added / Newest / Oldest sorting
function initSortControl() {
  const sortBtn = document.getElementById("snaps-sort-btn");
  const sortIcon = document.getElementById("snaps-sort-icon");
  const sortLabel = document.getElementById("snaps-sort-label");

  if (!sortBtn) return;

  function updateSortUI() {
    if (sortOrder === "added") {
      if (sortIcon) sortIcon.className = "bi bi-arrow-down-up";
      if (sortLabel) sortLabel.textContent = "Added";
      sortBtn.title = "Current: Added order. Click to sort by Newest date.";
    } else if (sortOrder === "desc") {
      if (sortIcon) sortIcon.className = "bi bi-sort-down";
      if (sortLabel) sortLabel.textContent = "Newest";
      sortBtn.title = "Current: Newest first. Click to sort by Oldest date.";
    } else if (sortOrder === "asc") {
      if (sortIcon) sortIcon.className = "bi bi-sort-up";
      if (sortLabel) sortLabel.textContent = "Oldest";
      sortBtn.title = "Current: Oldest first. Click to return to Added order.";
    }
  }

  updateSortUI();

  sortBtn.addEventListener("click", function () {
    if (sortOrder === "added") {
      sortOrder = "desc";
    } else if (sortOrder === "desc") {
      sortOrder = "asc";
    } else {
      sortOrder = "added";
    }

    updateSortUI();
    renderSnaps();

    // Smooth staggered reveal
    const cards = document.querySelectorAll(".snap-card");
    cards.forEach((card, index) => {
      setTimeout(() => card.classList.add("card-visible"), index * 40);
    });
  });
}

// Render cards into grid
function renderSnaps() {
  const grid = document.getElementById("snaps-grid");
  const countBadge = document.getElementById("snaps-count-num");

  if (countBadge) {
    countBadge.textContent = SNAPS_DATA.length;
  }

  if (!grid) return;

  sortedSnaps = getSortedSnaps();

  if (sortedSnaps.length === 0) {
    grid.innerHTML = `
      <div class="snaps-empty-state">
        <i class="bi bi-camera"></i>
        <p>No snaps uploaded yet. Check back soon!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = sortedSnaps
    .map((snap, index) => {
      const location = snap.location || snap.loc;
      const author = getCapturedByInfo(snap);
      const mapUrl = getMapUrl(snap);
      const imgUrl = resolveSnapUrl(snap.url);
      const hasChips = Boolean(location || author);
      const title = (snap.title || "").trim();
      const ariaLabel = title
        ? `View photo: ${title}`
        : `View photo from ${snap.date}`;
      const imgAlt = title || "Snap photo";

      return `
    <article class="snap-card" data-index="${index}" tabindex="0" role="button" aria-label="${ariaLabel}">
      <div class="snap-img-wrap">
        <img src="${imgUrl}" alt="${imgAlt}" loading="lazy" class="snap-img" />
      </div>
      <div class="snap-meta-bar">
        <div class="snap-meta-top">
          ${title ? `<span class="snap-title">${title}</span>` : `<span class="snap-title-empty"></span>`}
          <span class="snap-date">${snap.date}</span>
        </div>
        ${
          hasChips
            ? `
          <div class="snap-meta-chips">
            ${
              location
                ? mapUrl
                  ? `<a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="snap-meta-chip snap-chip-link" title="Open ${location} in Google Maps" onclick="event.stopPropagation()"><i class="bi bi-geo-alt-fill"></i> ${location} <i class="bi bi-box-arrow-up-right chip-ext"></i></a>`
                  : `<span class="snap-meta-chip" title="Location: ${location}"><i class="bi bi-geo-alt-fill"></i> ${location}</span>`
                : ""
            }
            ${
              author
                ? author.url
                  ? `<a href="${author.url}" target="_blank" rel="noopener noreferrer" class="snap-meta-chip snap-chip-link captured" title="Captured by ${author.name}" onclick="event.stopPropagation()"><i class="${author.iconClass}"></i> ${author.name} <i class="bi bi-box-arrow-up-right chip-ext"></i></a>`
                  : `<span class="snap-meta-chip captured" title="Captured by: ${author.name}"><i class="${author.iconClass}"></i> ${author.name}</span>`
                : ""
            }
          </div>
        `
            : ""
        }
      </div>
    </article>
  `;
    })
    .join("");
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
  const titleEl =
    document.getElementById("lightbox-title") ||
    document.getElementById("lightbox-caption");
  const date = document.getElementById("lightbox-date");
  const locationEl = document.getElementById("lightbox-location");
  const capturedEl = document.getElementById("lightbox-captured");
  const rawLink = document.getElementById("lightbox-raw-link");

  if (!lightbox) return;

  function openLightbox(index) {
    currentLightboxIndex = index;
    const snap = sortedSnaps[currentLightboxIndex];
    if (!snap) return;

    const location = snap.location || snap.loc;
    const author = getCapturedByInfo(snap);
    const mapUrl = getMapUrl(snap);
    const imgUrl = resolveSnapUrl(snap.url);
    const title = (snap.title || "").trim();

    img.src = imgUrl;
    img.alt = title || "Snap photo";
    if (titleEl) {
      if (title) {
        titleEl.textContent = title;
        titleEl.style.display = "block";
      } else {
        titleEl.textContent = "";
        titleEl.style.display = "none";
      }
    }

    if (date) {
      date.innerHTML = `<i class="bi bi-calendar3"></i> ${snap.date}`;
      date.style.display = snap.date ? "inline-flex" : "none";
    }

    if (locationEl) {
      if (location) {
        if (mapUrl) {
          locationEl.href = mapUrl;
          locationEl.target = "_blank";
          locationEl.rel = "noopener noreferrer";
          locationEl.className = "lightbox-tag lightbox-tag-link";
          locationEl.innerHTML = `<i class="bi bi-geo-alt-fill"></i> <span>${location}</span> <i class="bi bi-box-arrow-up-right tag-ext-icon"></i>`;
          locationEl.title = `Open ${location} in Google Maps`;
        } else {
          locationEl.removeAttribute("href");
          locationEl.className = "lightbox-tag";
          locationEl.innerHTML = `<i class="bi bi-geo-alt-fill"></i> <span>${location}</span>`;
          locationEl.title = `Location: ${location}`;
        }
        locationEl.style.display = "inline-flex";
      } else {
        locationEl.style.display = "none";
      }
    }

    if (capturedEl) {
      if (author) {
        if (author.url) {
          capturedEl.href = author.url;
          capturedEl.target = "_blank";
          capturedEl.rel = "noopener noreferrer";
          capturedEl.className = "lightbox-tag lightbox-tag-link";
          capturedEl.innerHTML = `<i class="${author.iconClass}"></i> <span>${author.name}</span> <i class="bi bi-box-arrow-up-right tag-ext-icon"></i>`;
          capturedEl.title = `Captured by: ${author.name}`;
        } else {
          capturedEl.removeAttribute("href");
          capturedEl.className = "lightbox-tag";
          capturedEl.innerHTML = `<i class="${author.iconClass}"></i> <span>${author.name}</span>`;
          capturedEl.title = `Captured by: ${author.name}`;
        }
        capturedEl.style.display = "inline-flex";
      } else {
        capturedEl.style.display = "none";
      }
    }

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
    if (sortedSnaps.length <= 1) return;
    currentLightboxIndex =
      (currentLightboxIndex - 1 + sortedSnaps.length) % sortedSnaps.length;
    openLightbox(currentLightboxIndex);
  }

  function showNext() {
    if (sortedSnaps.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % sortedSnaps.length;
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
