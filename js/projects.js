document.addEventListener("DOMContentLoaded", function () {
  initProjectFilters();
  initProjectSearch();
  initVideoEmbeds();
});

// Category filtering
function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  const emptyState = document.getElementById("projects-empty-state");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      let visibleCount = 0;

      cards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "flex";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? "block" : "none";
      }
    });
  });
}

// Live search filtering
function initProjectSearch() {
  const searchInput = document.getElementById("projects-search");
  const clearBtn = document.getElementById("projects-search-clear");
  const cards = document.querySelectorAll(".project-card");
  const emptyState = document.getElementById("projects-empty-state");

  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    if (clearBtn) {
      clearBtn.style.display = query.length > 0 ? "block" : "none";
    }

    let visibleCount = 0;
    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? "block" : "none";
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearBtn.style.display = "none";
      cards.forEach((card) => (card.style.display = "flex"));
      if (emptyState) emptyState.style.display = "none";
      searchInput.focus();
    });
  }
}

// In-card YouTube video player
function initVideoEmbeds() {
  const wrappers = document.querySelectorAll(".video-embed-wrapper");

  wrappers.forEach((wrapper) => {
    const poster = wrapper.querySelector(".video-poster");
    const videoId = wrapper.getAttribute("data-video-id");

    if (poster && videoId) {
      poster.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const iframe = document.createElement("iframe");
        iframe.setAttribute(
          "src",
          `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
        );
        iframe.setAttribute("title", "Project Demo Video");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute(
          "allow",
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        );
        iframe.setAttribute("allowfullscreen", "1");

        wrapper.innerHTML = "";
        wrapper.appendChild(iframe);
      });
    }
  });
}
