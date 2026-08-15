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

  function startHeroAnimation() {
    const text = "Hi, I'm Nubsuki (aka SK)";
    const textElement = document.getElementById("typewriter-text");
    const subtextElement = document.getElementById("hero-subtext");
    const gifElement = document.getElementById("miyabi-gif");

    if (!textElement) return;

    textElement.innerHTML = "";
    if (gifElement) {
      gifElement.style.opacity = "1";
    }

    let i = 0;
    function typeWriter() {
      if (i < text.length) {
        textElement.innerHTML += text.charAt(i);
        i++;
        // Adjust typing speed here!
        setTimeout(typeWriter, 120);
      } else {
        // Typing finished! Fade in the subtext
        if (subtextElement) {
          subtextElement.style.opacity = "1";
        }

        // Make Miyabi interactive: follow the cursor only when clicked!
        if (gifElement) {
          gifElement.style.cursor = "pointer";
          let isFollowing = false;
          let isResting = false;
          let isReturning = false;
          let stamina = 100;
          let currentX = 0;
          let originX = 0;
          let originY = 0;
          let mouseMoveListener = null;
          let lastMouseX = null;
          let lastMouseY = null;
          let lastMouseMoveTime = 0;

          // --- Stamina UI Setup ---
          const staminaContainer = document.createElement("div");
          staminaContainer.style.position = "fixed";
          staminaContainer.style.pointerEvents = "none";
          staminaContainer.style.zIndex = "10000";
          staminaContainer.style.display = "none";
          staminaContainer.style.flexDirection = "column";
          staminaContainer.style.alignItems = "center";
          staminaContainer.style.gap = "4px";
          staminaContainer.style.transition =
            "left 0.1s ease-out, top 0.1s ease-out";

          const staminaText = document.createElement("div");
          staminaText.style.color = "white";
          staminaText.style.fontSize = "10px";
          staminaText.style.fontFamily = "'Fira Code', monospace";
          staminaText.style.whiteSpace = "nowrap";

          const staminaBarBg = document.createElement("div");
          staminaBarBg.style.width = "50px";
          staminaBarBg.style.height = "6px";
          staminaBarBg.style.background = "rgba(255,255,255,0.2)";
          staminaBarBg.style.borderRadius = "3px";
          staminaBarBg.style.overflow = "hidden";

          const staminaBarFill = document.createElement("div");
          staminaBarFill.style.width = "100%";
          staminaBarFill.style.height = "100%";
          staminaBarFill.style.background = "#ff7b00";
          staminaBarFill.style.transition =
            "width 0.1s linear, background 0.2s";

          staminaBarBg.appendChild(staminaBarFill);
          staminaContainer.appendChild(staminaText);
          staminaContainer.appendChild(staminaBarBg);
          document.body.appendChild(staminaContainer);

          // --- Bubble UI Setup ---
          const bubble = document.createElement("div");
          bubble.style.position = "fixed";
          bubble.style.background = "white";
          bubble.style.color = "black";
          bubble.style.padding = "4px 8px";
          bubble.style.borderRadius = "10px";
          bubble.style.fontSize = "12px";
          bubble.style.fontFamily = "'Fira Code', monospace";
          bubble.style.display = "none";
          bubble.style.zIndex = "10001";
          bubble.style.pointerEvents = "none";
          document.body.appendChild(bubble);

          function getTired() {
            isFollowing = false;
            isResting = true;
            document.removeEventListener("mousemove", mouseMoveListener);

            // Stop her instantly so the bubble doesn't appear in the wrong spot if you were moving fast
            const r = gifElement.getBoundingClientRect();
            gifElement.style.transition = "none";
            gifElement.style.left = r.left + "px";
            gifElement.style.top = r.top + "px";

            gifElement.src = "assets/miyabi.gif";
            gifElement.style.transform = "scaleX(1)";

            staminaContainer.style.display = "none";

            bubble.style.display = "block";
            bubble.innerText = "miyabi tired";

            const newR = gifElement.getBoundingClientRect();
            bubble.style.left = newR.left + newR.width / 2 - 45 + "px";
            bubble.style.top = newR.top - 30 + "px";

            setTimeout(() => {
              bubble.innerText = "miyabi rest";

              setTimeout(() => {
                bubble.style.display = "none";

                // Run back to original state!
                isReturning = true;
                gifElement.src = "assets/miyabi run.gif";

                const currentR = gifElement.getBoundingClientRect();
                if (originX < currentR.left) {
                  gifElement.style.transform = "scaleX(-1)";
                } else {
                  gifElement.style.transform = "scaleX(1)";
                }

                // Slower transition for running back
                gifElement.style.transition =
                  "left 1.5s linear, top 1.5s linear, transform 0.1s ease-out";
                gifElement.style.left = originX + "px";
                gifElement.style.top = originY + "px";

                setTimeout(() => {
                  // Snapped back
                  gifElement.style.position = "";
                  gifElement.style.left = "";
                  gifElement.style.top = "";
                  gifElement.style.margin = "";
                  gifElement.style.pointerEvents = "";
                  gifElement.style.zIndex = "";
                  gifElement.style.cursor = "pointer";
                  gifElement.style.transition = "";

                  gifElement.src = "assets/miyabi.gif";
                  gifElement.style.transform = "scaleX(1)";

                  stamina = 100;
                  isResting = false;
                  isReturning = false;
                }, 1500); // Wait for transition to finish
              }, 2000); // Show "miyabi rest" for 2 seconds
            }, 2000); // Show "miyabi tired" for 2 seconds
          }

          // Idle recover loop
          setInterval(() => {
            if (isFollowing && !isResting && !isReturning) {
              // If mouse hasn't moved in 300ms
              if (Date.now() - lastMouseMoveTime > 300) {
                if (stamina < 100) {
                  stamina += 5; // recover 5% per tick
                  if (stamina > 100) stamina = 100;
                  staminaBarFill.style.width = stamina + "%";
                  staminaBarFill.style.background = "#44ff44";
                  staminaText.innerText = "resting...";
                }
                // Switch to idle gif if not already
                if (
                  gifElement.src.indexOf("miyabi%20run.gif") !== -1 ||
                  gifElement.src.indexOf("miyabi run.gif") !== -1
                ) {
                  gifElement.src = "assets/miyabi.gif";
                }
              }
            }
          }, 100);

          gifElement.addEventListener("click", () => {
            if (isFollowing || isResting || isReturning) return;
            isFollowing = true;
            stamina = 100;
            lastMouseX = null;
            lastMouseY = null;
            lastMouseMoveTime = Date.now();

            staminaText.innerText = "running!";
            staminaText.style.color = "white";
            staminaBarFill.style.background = "#ff7b00";
            staminaBarFill.style.width = "100%";

            // Change to the running animation!
            gifElement.src = "assets/miyabi run.gif";

            // Get current exact position so she doesn't jump
            const rect = gifElement.getBoundingClientRect();
            // Record original spot to return to
            originX = rect.left;
            originY = rect.top;

            gifElement.style.position = "fixed";
            gifElement.style.left = originX + "px";
            gifElement.style.top = originY + "px";
            gifElement.style.margin = "0"; // remove margin
            gifElement.style.pointerEvents = "none"; // prevent her from blocking clicks!
            gifElement.style.zIndex = "9999";
            gifElement.style.cursor = "default";

            currentX = originX;

            // Instantly snap the stamina bar to her starting position before making it visible
            staminaContainer.style.transition = "none";
            staminaContainer.style.left = originX + rect.width / 2 - 25 + "px";
            staminaContainer.style.top = originY - 25 + "px";
            staminaContainer.style.display = "flex";

            // Force browser to apply the new position immediately
            void staminaContainer.offsetWidth;

            // Restore smooth movement transition
            staminaContainer.style.transition =
              "left 0.1s ease-out, top 0.1s ease-out";

            // Wait a tiny bit, then add smooth transition and start following
            setTimeout(() => {
              gifElement.style.transition =
                "left 0.15s ease-out, top 0.15s ease-out, transform 0.1s ease-out";

              mouseMoveListener = (e) => {
                if (!isFollowing) return;
                lastMouseMoveTime = Date.now();

                // If she was resting, switch back to running
                if (
                  gifElement.src.indexOf("miyabi.gif") !== -1 &&
                  gifElement.src.indexOf("run") === -1
                ) {
                  gifElement.src = "assets/miyabi run.gif";
                  staminaText.innerText = "running!";
                }

                if (lastMouseX === null) {
                  lastMouseX = e.clientX;
                  lastMouseY = e.clientY;
                  return;
                }

                // Calculate distance moved
                const dx = e.clientX - lastMouseX;
                const dy = e.clientY - lastMouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;

                // Drain stamina (0.05% per pixel)
                stamina -= dist * 0.05;
                if (stamina < 0) stamina = 0;
                staminaBarFill.style.width = stamina + "%";

                if (stamina <= 30) {
                  staminaBarFill.style.background = "#ff4444"; // turn red
                } else {
                  staminaBarFill.style.background = "#ff7b00";
                }

                const targetX = e.clientX + 15;
                const targetY = e.clientY + 15;

                // Flip her to face the direction she's running
                if (targetX < currentX) {
                  gifElement.style.transform = "scaleX(-1)"; // face left
                } else if (targetX > currentX) {
                  gifElement.style.transform = "scaleX(1)"; // face right
                }
                currentX = targetX;

                // Update position
                gifElement.style.left = targetX + "px";
                gifElement.style.top = targetY + "px";

                // Update stamina bar above her
                staminaContainer.style.left = targetX - 5 + "px";
                staminaContainer.style.top = targetY - 25 + "px";

                // Get tired!
                if (stamina <= 0) {
                  getTired();
                }
              };

              document.addEventListener("mousemove", mouseMoveListener);
            }, 50);
          });
        }
      }
    }

    // Slight delay before typing begins
    setTimeout(typeWriter, 500);
  }

  // If intro was already shown this session, skip it entirely
  if (sessionStorage.getItem("introShown")) {
    loader.remove();
    startHeroAnimation();
    return;
  }

  // First visit — add overlay class and fetch the loading animation
  loader.classList.add("loading-overlay");

  fetch("addons/loading.html")
    .then((res) => res.text())
    .then((html) => {
      loader.innerHTML = html;

      // Wait for page to fully load, then fade out after 2 seconds
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
