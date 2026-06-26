// terminal

(function () {
  const CLICK_THRESHOLD = 5;
  const CLICK_WINDOW = 2000;
  let clickTimestamps = [];
  let terminalActive = false;

  // Wait for navbar to load
  const observer = new MutationObserver(function () {
    const logo = document.getElementById("navbar-logo");
    if (logo) {
      observer.disconnect();
      logo.addEventListener("click", handleLogoClick);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  function handleLogoClick(e) {
    if (terminalActive) return;

    const now = Date.now();
    clickTimestamps.push(now);

    // Only keep clicks within the time window
    clickTimestamps = clickTimestamps.filter((t) => now - t < CLICK_WINDOW);

    if (clickTimestamps.length >= CLICK_THRESHOLD) {
      e.preventDefault();
      clickTimestamps = [];
      triggerTerminal();
    }
  }

  async function triggerTerminal() {
    terminalActive = true;

    // Glitch the body first
    document.body.classList.add("body-glitch");
    setTimeout(() => document.body.classList.remove("body-glitch"), 300);

    // Fetch user's real IP and location
    let userIP = "192.168.██.██";
    let userLocation = {
      country: "██████",
      city: "████████",
      region: "██████",
    };
    try {
      const res = await fetch(
        "http://ip-api.com/json/?fields=query,country,city,regionName",
      );
      const data = await res.json();
      userIP = data.query || userIP;
      if (data.country) {
        userLocation = {
          country: data.country,
          city: data.city || "████████",
          region: data.regionName || "██████",
        };
      }
    } catch (e) {
      // fallback values stay
    }

    // Create the overlay
    const overlay = document.createElement("div");
    overlay.className = "glitch-overlay";
    overlay.id = "glitch-overlay";

    const terminal = document.createElement("div");
    terminal.className = "glitch-terminal";
    terminal.id = "glitch-terminal";

    const header = document.createElement("div");
    header.className = "terminal-header";
    header.textContent = "═══ Rootkit System v6.69 ═══";
    terminal.appendChild(header);

    overlay.appendChild(terminal);

    const hint = document.createElement("div");
    hint.className = "dismiss-hint";
    hint.textContent = "[ CLICK TO EXIT ]";
    overlay.appendChild(hint);

    document.body.appendChild(overlay);

    let sequenceFinished = false;

    // Error messages
    const exitErrors = [
      "⚠ EXIT DENIED — process nubsuki.exe cannot be terminated",
      "✖ Permission denied. Nice try.",
      "⚠ kill -9 failed: process is immortal",
      "✖ Ctrl+C? That won't save you.",
      "⚠ Escape is not an option.",
      "✖ Task Manager has been disabled by nubsuki.exe",
      "⚠ You must watch till the end :)",
      "✖ Alt+F4 won't work here either lol",
    ];
    let errorIndex = 0;

    // shows error popup
    function blockExit(e) {
      if (sequenceFinished) return;
      e.preventDefault();
      e.stopPropagation();

      // Remove any existing popup
      const existing = document.querySelector(".error-popup");
      if (existing) existing.remove();

      const popup = document.createElement("div");
      popup.className = "error-popup";
      popup.innerHTML = `<span class="popup-icon">✖</span><span class="popup-text">${exitErrors[errorIndex % exitErrors.length]}</span>`;
      overlay.appendChild(popup);

      // Auto-remove after animation completes
      setTimeout(() => popup.remove(), 1600);
      errorIndex++;
    }

    // Dismiss handler
    function dismiss() {
      if (!sequenceFinished) return;
      overlay.classList.add("dismiss");
      document.body.classList.add("body-glitch");
      setTimeout(() => document.body.classList.remove("body-glitch"), 300);
      overlay.addEventListener("animationend", () => {
        overlay.remove();
        terminalActive = false;
      });
      overlay.removeEventListener("click", dismiss);
      overlay.removeEventListener("click", blockExit);
    }

    // Attach block-exit listener
    overlay.addEventListener("click", blockExit);

    // Terminal sequence
    const lines = buildTerminalSequence(userIP, userLocation);
    await runTerminalSequence(terminal, lines);

    // allow exit
    sequenceFinished = true;
    await new Promise((r) => setTimeout(r, 1000));

    // Swap to real dismiss listener
    overlay.removeEventListener("click", blockExit);
    overlay.addEventListener("click", dismiss);
  }

  function buildTerminalSequence(ip, location) {
    return [
      { type: "ascii", text: getAsciiArt(), delay: 0 },
      { type: "blank", delay: 300 },
      {
        type: "type",
        text: '<span class="prompt">root@nubsuki</span>:<span class="path">~</span>$ ./nubsuki.exe --init',
        speed: 40,
        delay: 200,
      },
      {
        type: "print",
        text: '<span class="success">[✓]</span> Executable loaded successfully',
        delay: 400,
      },
      {
        type: "print",
        text: '<span class="success">[✓]</span> Runtime environment: Browser v██.█',
        delay: 200,
      },
      { type: "blank", delay: 200 },
      {
        type: "type",
        text: '<span class="prompt">root@nubsuki</span>:<span class="path">~</span>$ nmap -sS --scan-target visitor',
        speed: 35,
        delay: 300,
      },
      {
        type: "print",
        text: '<span class="warning">[!]</span> Scanning network interfaces...',
        delay: 600,
      },
      { type: "progress", text: "SCANNING", duration: 1200, delay: 100 },
      {
        type: "print",
        text: '<span class="success">[✓]</span> Target acquired',
        delay: 300,
      },
      {
        type: "print",
        text: `<span class="error">[▸]</span> IPv4 Address: <span class="highlight">${ip}</span>`,
        delay: 150,
      },
      {
        type: "print",
        text: '<span class="error">[▸]</span> Status: <span class="highlight">EXPOSED</span>',
        delay: 150,
      },
      {
        type: "print",
        text: `<span class="error">[▸]</span> Location: <span class="highlight">${location.country}</span>, <span class="dim">${"█".repeat(location.city.length)}</span>, <span class="dim">${"█".repeat(location.region.length)}</span>`,
        delay: 150,
      },
      { type: "blank", delay: 300 },
      {
        type: "type",
        text: '<span class="prompt">root@nubsuki</span>:<span class="path">~</span>$ inject --payload nubsuki_malware.dll',
        speed: 30,
        delay: 300,
      },
      {
        type: "print",
        text: '<span class="warning">[!]</span> Initializing payload delivery...',
        delay: 500,
      },
      {
        type: "scramble",
        final: "DEPLOYING NUBSUKI_MALWARE.DLL",
        delay: 100,
        duration: 1500,
      },
      { type: "progress", text: "INJECTING", duration: 1500, delay: 100 },
      {
        type: "print",
        text: '<span class="success">[✓]</span> Payload delivered to target',
        delay: 300,
      },
      { type: "blank", delay: 200 },
      {
        type: "type",
        text: '<span class="prompt">root@nubsuki</span>:<span class="path">~</span>$ cat /etc/message.txt',
        speed: 40,
        delay: 400,
      },
      { type: "blank", delay: 300 },
      {
        type: "print",
        text: '<span class="dim">───────────────────────────────────</span>',
        delay: 100,
      },
      {
        type: "scramble",
        final: " Thanks for visiting my site :) ",
        delay: 100,
        duration: 2000,
      },
      {
        type: "scramble",
        final: "   - nubsuki                    ",
        delay: 100,
        duration: 1000,
      },
      {
        type: "print",
        text: '<span class="dim">───────────────────────────────────</span>',
        delay: 100,
      },
      { type: "blank", delay: 500 },
      {
        type: "print",
        text: '<span class="warning">[!]</span> Just kidding. No malware here. <span class="success">You\'re safe ♥</span>',
        delay: 100,
      },
      { type: "blank", delay: 200 },
      {
        type: "print",
        text: '<span class="dim">Connection closed.</span>',
        delay: 500,
      },
    ];
  }

  async function runTerminalSequence(terminal, lines) {
    for (const line of lines) {
      if (terminalActive === false) return;

      await sleep(line.delay || 0);

      if (line.type === "blank") {
        addLine(terminal, "&nbsp;");
      } else if (line.type === "print") {
        addLine(terminal, line.text);
      } else if (line.type === "ascii") {
        const pre = document.createElement("pre");
        pre.className = "ascii-art terminal-line typing";
        pre.textContent = line.text;
        terminal.appendChild(pre);
        scrollTerminal(terminal);
      } else if (line.type === "type") {
        await typewriterLine(terminal, line.text, line.speed || 40);
      } else if (line.type === "progress") {
        await showProgress(terminal, line.text, line.duration || 1000);
      } else if (line.type === "scramble") {
        await scrambleText(terminal, line.final, line.duration || 1500);
      }
    }
  }

  function addLine(terminal, html) {
    const div = document.createElement("div");
    div.className = "terminal-line typing";
    div.innerHTML = html;
    terminal.appendChild(div);
    scrollTerminal(terminal);
  }

  async function typewriterLine(terminal, html, speed) {
    const div = document.createElement("div");
    div.className = "terminal-line typing";
    terminal.appendChild(div);

    // Parse out HTML tags vs text
    const segments = parseHTML(html);
    let currentHTML = "";

    for (const seg of segments) {
      if (seg.isTag) {
        currentHTML += seg.text;
        div.innerHTML = currentHTML + '<span class="cursor"></span>';
      } else {
        for (const char of seg.text) {
          currentHTML += char;
          div.innerHTML = currentHTML + '<span class="cursor"></span>';
          scrollTerminal(terminal);
          await sleep(speed + Math.random() * 20);
        }
      }
    }

    div.innerHTML = currentHTML;
  }

  function parseHTML(html) {
    const segments = [];
    const regex = /(<[^>]+>)|([^<]+)/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (match[1]) {
        segments.push({ text: match[1], isTag: true });
      } else if (match[2]) {
        segments.push({ text: match[2], isTag: false });
      }
    }
    return segments;
  }

  async function showProgress(terminal, label, duration) {
    const div = document.createElement("div");
    div.className = "terminal-line typing";
    terminal.appendChild(div);

    const totalSteps = 30;
    const stepTime = duration / totalSteps;

    for (let i = 0; i <= totalSteps; i++) {
      const filled = "█".repeat(i);
      const empty = "░".repeat(totalSteps - i);
      const percent = Math.round((i / totalSteps) * 100);
      div.innerHTML = `<span class="dim">[</span><span class="success">${filled}</span><span class="dim">${empty}</span><span class="dim">]</span> <span class="warning">${percent}%</span> ${label}`;
      scrollTerminal(terminal);
      await sleep(stepTime);
    }
  }

  async function scrambleText(terminal, finalText, duration) {
    const div = document.createElement("div");
    div.className = "terminal-line typing";
    terminal.appendChild(div);

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]";
    const steps = 20;
    const stepTime = duration / steps;

    for (let step = 0; step < steps; step++) {
      let result = "";
      for (let i = 0; i < finalText.length; i++) {
        if (finalText[i] === " ") {
          result += " ";
        } else if (step > steps * (i / finalText.length)) {
          result += finalText[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      div.innerHTML = `<span class="highlight">${result}</span>`;
      scrollTerminal(terminal);
      await sleep(stepTime);
    }

    div.innerHTML = `<span class="highlight">${finalText}</span>`;
  }

  function scrollTerminal(terminal) {
    terminal.scrollTop = terminal.scrollHeight;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function getAsciiArt() {
    return [
      "  ███╗   ██╗██╗   ██╗██████╗ ███████╗██╗   ██╗██╗  ██╗██╗",
      "  ████╗  ██║██║   ██║██╔══██╗██╔════╝██║   ██║██║ ██╔╝██║",
      "  ██╔██╗ ██║██║   ██║██████╔╝███████╗██║   ██║█████╔╝ ██║",
      "  ██║╚██╗██║██║   ██║██╔══██╗╚════██║██║   ██║██╔═██╗ ██║",
      "  ██║ ╚████║╚██████╔╝██████╔╝███████║╚██████╔╝██║  ██╗██║",
      "  ╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝",
    ].join("\n");
  }
})();
