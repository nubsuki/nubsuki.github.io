// miyabi.js — Interactive GIF companion with stamina system
// Called by index.js after the typewriter animation finishes.

function initMiyabi(gifElement) {
  gifElement.style.cursor = "pointer";

  let isFollowing     = false;
  let isResting       = false;
  let isReturning     = false;
  let stamina         = 100;
  let currentX        = 0;
  let originX         = 0;
  let originY         = 0;
  let mouseMoveListener = null;
  let lastMouseX      = null;
  let lastMouseY      = null;
  let lastMouseMoveTime = 0;

  // ── Stamina bar UI ──────────────────────────────────────────────────────────
  const staminaContainer = document.createElement("div");
  Object.assign(staminaContainer.style, {
    position: "fixed", pointerEvents: "none", zIndex: "10000",
    display: "none", flexDirection: "column", alignItems: "center", gap: "4px",
    transition: "left 0.1s ease-out, top 0.1s ease-out",
  });

  const staminaText = document.createElement("div");
  Object.assign(staminaText.style, {
    color: "white", fontSize: "10px",
    fontFamily: "'Fira Code', monospace", whiteSpace: "nowrap",
  });

  const staminaBarBg = document.createElement("div");
  Object.assign(staminaBarBg.style, {
    width: "50px", height: "6px",
    background: "rgba(255,255,255,0.2)", borderRadius: "3px", overflow: "hidden",
  });

  const staminaBarFill = document.createElement("div");
  Object.assign(staminaBarFill.style, {
    width: "100%", height: "100%",
    background: "#ff7b00", transition: "width 0.1s linear, background 0.2s",
  });

  staminaBarBg.appendChild(staminaBarFill);
  staminaContainer.appendChild(staminaText);
  staminaContainer.appendChild(staminaBarBg);
  document.body.appendChild(staminaContainer);

  // ── Thought bubble UI ───────────────────────────────────────────────────────
  const bubble = document.createElement("div");
  Object.assign(bubble.style, {
    position: "fixed", background: "white", color: "black",
    padding: "4px 8px", borderRadius: "10px", fontSize: "12px",
    fontFamily: "'Fira Code', monospace", display: "none",
    zIndex: "10001", pointerEvents: "none",
  });
  document.body.appendChild(bubble);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function setStaminaBarPos(x, y) {
    staminaContainer.style.left = x + "px";
    staminaContainer.style.top  = y + "px";
  }

  function showBubbleOver(gif, text) {
    const r = gif.getBoundingClientRect();
    bubble.innerText    = text;
    bubble.style.left   = r.left + r.width / 2 - 45 + "px";
    bubble.style.top    = r.top - 30 + "px";
    bubble.style.display = "block";
  }

  // ── Get tired ───────────────────────────────────────────────────────────────
  function getTired() {
    isFollowing = false;
    isResting   = true;
    document.removeEventListener("mousemove", mouseMoveListener);

    // Freeze her in place immediately (prevents bubble appearing at wrong spot)
    const r = gifElement.getBoundingClientRect();
    gifElement.style.transition = "none";
    gifElement.style.left = r.left + "px";
    gifElement.style.top  = r.top  + "px";

    gifElement.src = "assets/miyabi.gif";
    gifElement.style.transform = "scaleX(1)";
    staminaContainer.style.display = "none";

    showBubbleOver(gifElement, "[miyabi] >: tired");

    // After 2s → "rest" message
    setTimeout(() => {
      showBubbleOver(gifElement, "[miyabi] >: rest");

      // After 2 more s → run back home
      setTimeout(() => {
        bubble.style.display = "none";
        isReturning = true;
        gifElement.src = "assets/miyabi run.gif";

        const cur = gifElement.getBoundingClientRect();
        gifElement.style.transform = originX < cur.left ? "scaleX(-1)" : "scaleX(1)";
        gifElement.style.transition = "left 1.5s linear, top 1.5s linear, transform 0.1s ease-out";
        gifElement.style.left = originX + "px";
        gifElement.style.top  = originY + "px";

        // After animation finishes → reset fully
        setTimeout(() => {
          Object.assign(gifElement.style, {
            position: "", left: "", top: "", margin: "",
            pointerEvents: "", zIndex: "", cursor: "pointer", transition: "",
          });
          gifElement.src = "assets/miyabi.gif";
          gifElement.style.transform = "scaleX(1)";
          stamina     = 100;
          isResting   = false;
          isReturning = false;
        }, 1500);
      }, 2000);
    }, 2000);
  }

  // ── Idle stamina recovery loop ───────────────────────────────────────────────
  setInterval(() => {
    if (!isFollowing || isResting || isReturning) return;
    if (Date.now() - lastMouseMoveTime <= 300) return;

    // Switch to idle GIF
    if (gifElement.src.includes("miyabi%20run.gif") || gifElement.src.includes("miyabi run.gif")) {
      gifElement.src = "assets/miyabi.gif";
    }

    if (stamina < 100) {
      stamina = Math.min(100, stamina + 5);
      staminaBarFill.style.width      = stamina + "%";
      staminaBarFill.style.background = "#44ff44";
      staminaText.innerText           = "resting...";
    }
  }, 100);

  // ── Click to activate ───────────────────────────────────────────────────────
  gifElement.addEventListener("click", () => {
    if (isFollowing || isResting || isReturning) return;
    isFollowing       = true;
    stamina           = 100;
    lastMouseX        = null;
    lastMouseY        = null;
    lastMouseMoveTime = Date.now();

    // Reset stamina bar appearance
    staminaText.innerText           = "running!";
    staminaText.style.color         = "white";
    staminaBarFill.style.background = "#ff7b00";
    staminaBarFill.style.width      = "100%";

    gifElement.src = "assets/miyabi run.gif";

    // Capture position before going fixed
    const rect = gifElement.getBoundingClientRect();
    originX = rect.left;
    originY = rect.top;

    Object.assign(gifElement.style, {
      position: "fixed", left: originX + "px", top: originY + "px",
      margin: "0", pointerEvents: "none", zIndex: "9999", cursor: "default",
    });
    currentX = originX;

    // Snap stamina bar into place before revealing it
    staminaContainer.style.transition = "none";
    setStaminaBarPos(originX + rect.width / 2 - 25, originY - 25);
    staminaContainer.style.display = "flex";
    void staminaContainer.offsetWidth; // force reflow
    staminaContainer.style.transition = "left 0.1s ease-out, top 0.1s ease-out";

    setTimeout(() => {
      gifElement.style.transition = "left 0.15s ease-out, top 0.15s ease-out, transform 0.1s ease-out";

      mouseMoveListener = (e) => {
        if (!isFollowing) return;
        lastMouseMoveTime = Date.now();

        // If she was idle-resting, restart running GIF
        if (gifElement.src.includes("miyabi.gif") && !gifElement.src.includes("run")) {
          gifElement.src        = "assets/miyabi run.gif";
          staminaText.innerText = "running!";
          staminaBarFill.style.background = "#ff7b00";
        }

        if (lastMouseX === null) {
          lastMouseX = e.clientX;
          lastMouseY = e.clientY;
          return;
        }

        // Distance moved → drain stamina
        const dx   = e.clientX - lastMouseX;
        const dy   = e.clientY - lastMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        stamina = Math.max(0, stamina - dist * 0.05);
        staminaBarFill.style.width      = stamina + "%";
        staminaBarFill.style.background = stamina <= 30 ? "#ff4444" : "#ff7b00";

        const targetX = e.clientX + 15;
        const targetY = e.clientY + 15;

        // Flip to face running direction
        if      (targetX < currentX) gifElement.style.transform = "scaleX(-1)";
        else if (targetX > currentX) gifElement.style.transform = "scaleX(1)";
        currentX = targetX;

        gifElement.style.left = targetX + "px";
        gifElement.style.top  = targetY + "px";
        setStaminaBarPos(targetX - 5, targetY - 25);

        if (stamina <= 0) getTired();
      };

      document.addEventListener("mousemove", mouseMoveListener);
    }, 50);
  });
}
