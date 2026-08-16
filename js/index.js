// Load navbar component
fetch("addons/navbar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("navbar-placeholder").innerHTML = html;
  })
  .catch((err) => console.error("Failed to load navbar:", err));

// Loading screen + hero animation
(function () {
  const loader = document.getElementById("loading-screen");

  function startHeroAnimation() {
    const text         = "Wellcome to nubsuki.exe";
    const textElement  = document.getElementById("typewriter-text");
    const subtext      = document.getElementById("hero-subtext");
    const gifElement   = document.getElementById("miyabi-gif");

    if (!textElement) return;

    textElement.innerHTML = "";
    if (gifElement) gifElement.style.opacity = "1";

    let i = 0;
    function typeWriter() {
      if (i < text.length) {
        textElement.innerHTML += text.charAt(i++);
        setTimeout(typeWriter, 120);
      } else {
        if (subtext) subtext.style.opacity = "1";
        // Hand off to miyabi.js once typing is done
        if (gifElement) initMiyabi(gifElement);
      }
    }
    setTimeout(typeWriter, 500);
  }

  // Skip loading screen if already shown this session
  if (sessionStorage.getItem("introShown")) {
    loader.remove();
    startHeroAnimation();
    return;
  }

  loader.classList.add("loading-overlay");

  fetch("addons/loading.html")
    .then((res) => res.text())
    .then((html) => {
      loader.innerHTML = html;

      function fadeOutAfterDelay() {
        setTimeout(function () {
          loader.classList.add("fade-out");
          loader.addEventListener("transitionend", function () {
            loader.remove();
            startHeroAnimation();
          });
          sessionStorage.setItem("introShown", "true");
        }, 2000);
      }

      if (document.readyState === "complete") {
        fadeOutAfterDelay();
      } else {
        window.addEventListener("load", fadeOutAfterDelay);
      }
    })
    .catch((err) => console.error("Failed to load loading screen:", err));
})();
