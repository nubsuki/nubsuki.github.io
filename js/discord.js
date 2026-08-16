// discord.js — Live Discord status & activity via Lanyard API
// Reads your Discord presence and updates the status box every 15 seconds.

function initDiscordStatus() {
  const statusText = document.getElementById("discord-status-text");
  const activityEl = document.getElementById("discord-activity");
  const discordId  = "704302538970759319";

  if (!statusText || !activityEl) return;

  const STATUS_MAP = {
    online:  { label: "I'm ONLINE!",    color: "#43b581" },
    idle:    { label: "I'm IDLE",       color: "#faa61a" },
    dnd:     { label: "DO NOT DISTURB", color: "#f04747" },
    offline: { label: "I'm OFFLINE!",  color: "#888"    },
  };

  // Discord activity type IDs
  const ACTIVITY_TYPE = { GAME: 0, STREAMING: 1, LISTENING: 2, WATCHING: 3, CUSTOM: 4, COMPETING: 5 };

  const TYPE_LABEL = {
    0: { emoji: "🎮", verb: "Playing"      },
    1: { emoji: "📡", verb: "Streaming"    },
    2: { emoji: "🎵", verb: "Listening to" },
    3: { emoji: "📺", verb: "Watching"     },
    5: { emoji: "🏆", verb: "Competing in" },
  };

  // Resolve a Discord activity image to a usable URL
  function getActivityImage(act) {
    if (!act.assets) return null;
    const img = act.assets.large_image || act.assets.small_image;
    if (!img) return null;

    if (img.startsWith("mp:external/")) {
      return "https://media.discordapp.net/external/" + img.slice("mp:external/".length);
    }
    return `https://cdn.discordapp.com/app-assets/${act.application_id}/${img}.png`;
  }

  function renderActivity(d) {
    // Status heading
    const s = STATUS_MAP[d.discord_status] || STATUS_MAP.offline;
    statusText.innerText   = s.label;
    statusText.style.color = s.color;

    // Activity — priority: Spotify → any rich presence → nothing
    let html = "";

    if (d.listening_to_spotify && d.spotify) {
      const sp = d.spotify;
      html = `
        <div class="activity-row">
          <img class="activity-img" src="${sp.album_art_url}" alt="album art" />
          <div class="activity-detail">
            <span class="activity-label">Listening to</span>
            <span class="activity-name" style="color:#1db954">${sp.song}</span>
            <span class="activity-sub">by ${sp.artist}</span>
            <span class="activity-sub dim">on ${sp.album}</span>
          </div>
        </div>`;
    } else {
      const act = (d.activities || []).find(a => a.type !== ACTIVITY_TYPE.CUSTOM);
      if (act) {
        const t      = TYPE_LABEL[act.type] || { emoji: "▶", verb: "Doing" };
        const imgUrl = getActivityImage(act);
        const imgTag = imgUrl
          ? `<img class="activity-img" src="${imgUrl}" alt="${act.name}" onerror="this.style.display='none'" />`
          : `<span class="activity-icon">${t.emoji}</span>`;
        const detail = act.details ? `<span class="activity-sub">${act.details}</span>` : "";
        const state  = act.state   ? `<span class="activity-sub">${act.state}</span>`   : "";
        html = `
          <div class="activity-row">
            ${imgTag}
            <div class="activity-detail">
              <span class="activity-label">${t.verb}</span>
              <span class="activity-name">${act.name}</span>
              ${detail}${state}
            </div>
          </div>`;
      } else {
        html = `<p class="activity-empty">not doing anything right now</p>`;
      }
    }

    activityEl.innerHTML = html;
  }

  async function fetchStatus() {
    try {
      const res  = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
      const json = await res.json();
      if (json.success) renderActivity(json.data);
    } catch (e) {
      console.error("Lanyard fetch failed:", e);
    }
  }

  fetchStatus();
  setInterval(fetchStatus, 15000);
}

initDiscordStatus();
