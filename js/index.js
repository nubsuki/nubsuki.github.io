// Load navbar component
fetch("addons/navbar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("navbar-placeholder").innerHTML = html;

    // Highlight active link
    const path = window.location.pathname.toLowerCase();
    if (path.includes("projects")) {
      const navProjects = document.getElementById("nav-projects");
      if (navProjects) navProjects.classList.add("active");
    } else {
      const navHome = document.getElementById("nav-home");
      if (navHome) navHome.classList.add("active");
    }

    // Attach email button handler here — scripts inside innerHTML never execute
    const emailBtn = document.getElementById("navbar-email-btn");
    if (emailBtn) {
      emailBtn.addEventListener("click", function () {
        const icon = document.getElementById("navbar-email-icon");

        // Open mail client
        const a = document.createElement("a");
        a.href = "mailto:nubsuki@proton.me";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Copy to clipboard + play animation
        navigator.clipboard.writeText("nubsuki@proton.me").catch(() => {});
        icon.className = "bi bi-envelope-check";
        emailBtn.classList.add("navbar-email-copied");

        setTimeout(() => {
          icon.className = "bi bi-envelope-at";
          emailBtn.classList.remove("navbar-email-copied");
        }, 2000);
      });
    }
  })
  .catch((err) => console.error("Failed to load navbar:", err));

// Loading screen + hero animation
(function () {
  const loader = document.getElementById("loading-screen");

  function startHeroAnimation() {
    const text = "Wellcome to nubsuki.exe";
    const textElement = document.getElementById("typewriter-text");
    const subtext = document.getElementById("hero-subtext");
    const gifElement = document.getElementById("miyabi-gif");

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

// --- Minecraft Server IP Copy Handlers ---
function initMinecraftCopy() {
  const btn = document.getElementById("mc-copy-btn");
  const icon = document.getElementById("mc-copy-icon");
  const text = document.getElementById("mc-copy-text");

  if (btn) {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText("bwu.nubsuki.xyz").catch(() => {});
      btn.classList.add("copied");
      if (icon) icon.className = "bi bi-check2";
      if (text) text.innerText = "Copied!";

      setTimeout(() => {
        btn.classList.remove("copied");
        if (icon) icon.className = "bi bi-copy";
        if (text) text.innerText = "Copy IP";
      }, 2000);
    });
  }

  const widgetBtn = document.getElementById("mc-widget-copy-btn");
  const widgetIcon = document.getElementById("mc-widget-copy-icon");
  if (widgetBtn) {
    widgetBtn.addEventListener("click", () => {
      navigator.clipboard.writeText("bwu.nubsuki.xyz").catch(() => {});
      widgetBtn.classList.add("copied");
      if (widgetIcon) widgetIcon.className = "bi bi-check2";

      setTimeout(() => {
        widgetBtn.classList.remove("copied");
        if (widgetIcon) widgetIcon.className = "bi bi-copy";
      }, 2000);
    });
  }
}

// --- Live Minecraft Server Status (via mcsrvstat.us API) ---
function initMinecraftStatus() {
  const statusBadge = document.getElementById("mc-status-badge");
  const statusText = document.getElementById("mc-status-text");
  const playersCount = document.getElementById("mc-players-count");
  const javaVer = document.getElementById("mc-java-ver");

  const widgetBadge = document.getElementById("mc-widget-status-badge");
  const widgetText = document.getElementById("mc-widget-status-text");

  async function fetchStatus() {
    try {
      const res = await fetch("https://api.mcsrvstat.us/2/bwu.nubsuki.xyz");
      const data = await res.json();

      if (data.online) {
        if (statusBadge) statusBadge.className = "mc-status-badge online";
        if (statusText) statusText.innerText = "Online";
        if (playersCount && data.players) {
          playersCount.innerText = `${data.players.online} / ${data.players.max || 20}`;
        }
        if (javaVer && data.version) {
          javaVer.innerText = data.version;
        }

        if (widgetBadge)
          widgetBadge.className = "mc-widget-status-badge online";
        if (widgetText) widgetText.innerText = "Online";
      } else {
        if (statusBadge) statusBadge.className = "mc-status-badge offline";
        if (statusText) statusText.innerText = "Offline";
        if (playersCount) playersCount.innerText = "0 / 20";

        if (widgetBadge)
          widgetBadge.className = "mc-widget-status-badge offline";
        if (widgetText) widgetText.innerText = "Offline";
      }
    } catch (e) {
      if (statusBadge) statusBadge.className = "mc-status-badge offline";
      if (statusText) statusText.innerText = "Offline";
      if (widgetBadge) widgetBadge.className = "mc-widget-status-badge offline";
      if (widgetText) widgetText.innerText = "Offline";
    }
  }

  fetchStatus();
  setInterval(fetchStatus, 30000); // Check every 30s
}

// --- Staggered Entrance Animation for index.html boxes ---
function initIndexEntrance() {
  const boxes = document.querySelectorAll(".main-container .content-box");
  if (boxes.length === 0) return;

  const isIntroActive =
    !sessionStorage.getItem("introShown") &&
    document.getElementById("loading-screen");
  const baseDelay = isIntroActive ? 2200 : 250;

  setTimeout(() => {
    boxes.forEach((box, index) => {
      setTimeout(() => {
        box.classList.add("box-visible");
      }, index * 80);
    });
  }, baseDelay);
}

initMinecraftCopy();
initMinecraftStatus();
initIndexEntrance();
