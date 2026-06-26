// Load navbar component
fetch("addons/navbar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("navbar-placeholder").innerHTML = html;
  })
  .catch((err) => console.error("Failed to load navbar:", err));

// Loading screen intro
(function () {
  const loader = document.getElementById("loading-screen");

  // If intro was already shown this session, skip it entirely
  if (sessionStorage.getItem("introShown")) {
    loader.remove();
    return;
  }

  // First visit — add overlay class and fetch the loading animation
  loader.classList.add("loading-overlay");

  fetch("addons/loading.html")
    .then((res) => res.text())
    .then((html) => {
      loader.innerHTML = html;

      // Fade out after few seconds
      setTimeout(function () {
        loader.classList.add("fade-out");
        loader.addEventListener("transitionend", function () {
          loader.remove();
        });
        sessionStorage.setItem("introShown", "true");
      }, 3000);
    })
    .catch((err) => console.error("Failed to load loading screen:", err));
})();
