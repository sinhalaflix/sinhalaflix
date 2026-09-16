/**
 * SinhalaFlix Hub — Movie / Content Detail Page Controller
 * Reads ?id= from URL, populates movie.html dynamically.
 * No comments/reviews section.
 */

class MoviePageController {
  constructor() {
    this.item              = null;
    this.catalog           = [];
    this.currentEpIndex    = 0;
    this.selectedQualIdx   = 0;
    this.selectedDlEpIdx   = 0;
  }

  /* ─────────────────────────────────────────────
     INIT
     ───────────────────────────────────────────── */
  init() {
    const params   = new URLSearchParams(window.location.search);
    const id       = params.get("id") || window.PRELOADED_MEDIA_ID;
    const autoplay = params.get("autoplay") === "true";
    const epIdx    = parseInt(params.get("ep") || "0", 10);

    if (!id) { window.location.href = "index.html"; return; }

    this.catalog = StorageService.getFullCatalog();
    this.item    = this.catalog.find(c => c.id === id);

    if (!this.item) { window.location.href = "index.html"; return; }

    this.currentEpIndex = epIdx;

    this._renderPage();
    this._bindEvents();
    this._initScrollHeader();

    // Note: autoplay is intentionally disabled — user must click Watch Online

    if (window.location.hash === "#download") {
      setTimeout(() => {
        document.getElementById("downloadSection")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }

  /* ─────────────────────────────────────────────
     SCROLL – sticky header
     ───────────────────────────────────────────── */
  _initScrollHeader() {
    const header = document.getElementById("mpHeader");
    if (!header) return;
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 55);
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────
     RENDER PAGE
     ───────────────────────────────────────────── */
  _renderPage() {
    const item = this.item;

    // Document title & meta
    document.title = `${item.titleEnglish} | SinhalaFlix Hub`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = (item.synopsisEnglish || item.synopsisSinhala || "").slice(0, 155);

    // Sticky title
    this._setText("mpStickyTitle", item.titleEnglish);

    // Backdrop
    const backdrop = document.getElementById("heroBackdrop");
    if (backdrop) backdrop.style.backgroundImage = `url('${item.backdrop || item.poster}')`;

    // Poster
    const poster = document.getElementById("heroPoster");
    if (poster) { poster.src = item.poster; poster.alt = item.titleEnglish; }

    // Hero badge
    const badgeEl = document.getElementById("itemBadge");
    if (badgeEl) {
      if (item.badge) {
        badgeEl.textContent = item.badge;
        badgeEl.style.display = "inline-flex";
        const colorMap = {
          amber:   "background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;",
          rose:    "background:linear-gradient(135deg,#f43f5e,#e11d48);color:#fff;",
          cyan:    "background:linear-gradient(135deg,#06b6d4,#0891b2);color:#000;",
          emerald: "background:linear-gradient(135deg,#10b981,#059669);color:#000;",
          purple:  "background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;",
        };
        badgeEl.style.cssText += (colorMap[item.badgeColor] || colorMap.amber);
      } else {
        badgeEl.style.display = "none";
      }
    }

    // Channel / audio badges
    this._setText("itemChannel", item.channel);
    this._setText("itemAudio",   item.audio);

    // Titles
    this._setText("itemTitleEn", item.titleEnglish);
    this._setText("itemTitleSi", item.titleSinhala);

    // Meta
    this._setText("itemYear",   `📅 ${item.year}`);
    this._setText("itemType",   item.type === "series"
      ? `📺 ${item.episodesCount || item.episodes?.length || 0} Episodes`
      : "🎬 Full Movie");

    // Tags
    const tagsEl = document.getElementById("itemTags");
    if (tagsEl) {
      tagsEl.innerHTML = "";
      (item.tags || []).forEach(tag => {
        const s = document.createElement("span");
        s.className = "mp-tag";
        s.textContent = tag;
        tagsEl.appendChild(s);
      });
    }

    // Synopsis + read-more
    const synEl = document.getElementById("itemSynopsis");
    if (synEl) synEl.textContent = item.synopsisEnglish || item.synopsisSinhala || "";

    const rmBtn = document.getElementById("btnReadMore");
    if (rmBtn && synEl) {
      rmBtn.style.display = "inline-block";
      rmBtn.addEventListener("click", () => {
        synEl.classList.toggle("expanded");
        rmBtn.textContent = synEl.classList.contains("expanded") ? "Read less ▲" : "Read more ▼";
      });
    }


    // Watchlist button state
    this._updateWatchlistBtns();

    // Sections
    this._renderEpisodes();
    this._renderDownloads();
    this._renderRelated();
  }

  /* ─────────────────────────────────────────────
     BIND EVENTS
     ───────────────────────────────────────────── */
  _bindEvents() {
    // Watch Now — fire ads then show player
    document.getElementById("btnWatchNow")?.addEventListener("click", () => {
      this._fireAds();
      this._showPlayer(this.currentEpIndex);
    });

    // Scroll to download
    document.getElementById("btnGoDownload")?.addEventListener("click", () => {
      this._fireAds();
      this._goDownload(this.currentEpIndex);
    });

    // Close player
    document.getElementById("btnClosePlayer")?.addEventListener("click", () =>
      this._hidePlayer());

    // Shield to block Google Drive pop-out button clicks
    const shield = document.getElementById("mpIframeShield");
    shield?.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); });
    shield?.addEventListener("contextmenu", (e) => e.preventDefault());

    // Watchlist (all .mp-watchlist-btn)
    document.querySelectorAll(".mp-watchlist-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const added = StorageService.toggleWatchlist(this.item.id);
        this._updateWatchlistBtns();
        this._showToast(added ? "❤️ Added to Watchlist!" : "Removed from Watchlist", "info");
      });
    });


    // Share (all .mp-share-btn)
    document.querySelectorAll(".mp-share-btn").forEach(btn => {
      btn.addEventListener("click", () => this._share());
    });

    // Download episode dropdown
    document.getElementById("mpDlEpSelect")?.addEventListener("change", e => {
      this.selectedDlEpIdx = parseInt(e.target.value, 10);
      this._renderDownloadLinks();
    });
  }


  /* ─────────────────────────────────────────────
     WATCHLIST
     ───────────────────────────────────────────── */
  _updateWatchlistBtns() {
    const isWL = StorageService.isInWatchlist(this.item.id);
    document.querySelectorAll(".mp-watchlist-btn").forEach(btn => {
      btn.textContent = isWL ? "❤️ In Watchlist" : "🤍 Watchlist";
      btn.classList.toggle("active-watchlist", isWL);
    });
  }

  /* ─────────────────────────────────────────────
     SHARE
     ───────────────────────────────────────────── */
  /* ─────────────────────────────────────────────
     ADS — fire Monetag scripts on click
     ───────────────────────────────────────────── */
  _fireAds() {
    try {
      const settings = JSON.parse(localStorage.getItem("sinhalaflix_settings_v1") || "{}");
      const adLinks  = [settings.monetagAd1, settings.monetagAd2].filter(Boolean);
      adLinks.forEach(src => {
        const s = document.createElement("script");
        s.src   = src;
        s.async = true;
        document.head.appendChild(s);
      });
    } catch (_) {}
  }

  /* ─────────────────────────────────────────────
     DOWNLOAD — go to countdown page
     ───────────────────────────────────────────── */
  _goDownload(epIdx = 0) {
    this._fireAds();
    window.location.href = `download-wait.html?id=${this.item.id}&ep=${epIdx}`;
  }

  _share() {
    const url   = window.location.href;
    const title = this.item.titleEnglish;
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => this._showToast("🔗 Link copied to clipboard!", "success"))
        .catch(() => {});
    }
  }

  /* ─────────────────────────────────────────────
     PLAYER — show / hide
     ───────────────────────────────────────────── */
  _showPlayer(epIdx = 0) {
    const item = this.item;
    const ep   = item.episodes?.[epIdx];
    if (!ep) return;

    this.currentEpIndex = epIdx;

    const section = document.getElementById("playerSection");
    if (section) {
      section.style.display = "block";
      section.classList.remove("mp-player-section-anim");
      void section.offsetWidth; // reflow to restart animation
      section.classList.add("mp-player-section-anim");
      setTimeout(() => section.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }

    // Update now-playing title
    this._setText("playerSectionTitle", ep.titleEnglish || item.titleEnglish);

    // Load video
    this._loadVideo(ep, 0);

    // Render server buttons
    this._renderServerBtns(ep);

    // Episode quick-selector (series only)
    const epSel = document.getElementById("mpEpSelectorInPlayer");
    if (item.type === "series" && item.episodes?.length > 1 && epSel) {
      epSel.style.display = "block";
      this._renderPlayerEpBtns();
    }

    // Save history
    if (typeof StorageService.updateHistory === "function") {
      StorageService.updateHistory(item.id, epIdx + 1, 0);
    }
  }

  _isBuzzheavierUrl(url) {
    return false;
  }

  _parseGoogleDriveId(url) {
    if (!url || typeof url !== "string") return null;
    const trimmed = url.trim();
    if (!trimmed.includes("drive.google.com") && !trimmed.includes("docs.google.com")) {
      return null;
    }
    const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (dMatch && dMatch[1]) return dMatch[1];
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) return idMatch[1];
    return null;
  }

  _getEmbedUrl(url) {
    if (!url || typeof url !== "string") return null;
    const clean = this._cleanSourceUrl(url);

    // Google Drive
    const driveId = this._parseGoogleDriveId(clean);
    if (driveId) {
      return `https://drive.google.com/file/d/${driveId}/preview`;
    }
    if (clean.includes("drive.google.com") && clean.includes("/preview")) {
      return clean;
    }

    // YouTube
    const ytMatch = clean.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    }

    // Filemoon
    const fmMatch = clean.match(/filemoon\.(?:sx|to|in|nl|top)\/(?:e|d)\/([a-zA-Z0-9_-]+)/i);
    if (fmMatch && fmMatch[1]) {
      return `https://filemoon.sx/e/${fmMatch[1]}`;
    }

    // Streamtape
    const stMatch = clean.match(/streamtape\.(?:com|to|net)\/(?:e|v)\/([a-zA-Z0-9_-]+)/i);
    if (stMatch && stMatch[1]) {
      return `https://streamtape.com/e/${stMatch[1]}`;
    }

    // Doodstream
    const doodMatch = clean.match(/dood(?:stream)?\.(?:to|so|ws|pm|wf|la|cx|sh)\/(?:e|d)\/([a-zA-Z0-9_-]+)/i);
    if (doodMatch && doodMatch[1]) {
      return `https://dood.to/e/${doodMatch[1]}`;
    }

    // VidHide / VidSrc
    const vhMatch = clean.match(/vidhide(?:pro|vip)?\.(?:com|to|org)\/(?:v|e)\/([a-zA-Z0-9_-]+)/i);
    if (vhMatch && vhMatch[1]) {
      return `https://vidhidepro.com/v/${vhMatch[1]}`;
    }

    // Voe
    const voeMatch = clean.match(/voe\.(?:sx|to)\/(?:e\/)?([a-zA-Z0-9_-]+)/i);
    if (voeMatch && voeMatch[1]) {
      return `https://voe.sx/e/${voeMatch[1]}`;
    }

    // Mega
    const megaMatch = clean.match(/mega\.nz\/(?:file|embed)\/([a-zA-Z0-9_-]+#[a-zA-Z0-9_-]+)/i);
    if (megaMatch && megaMatch[1]) {
      return `https://mega.nz/embed/${megaMatch[1]}`;
    }

    // Dailymotion
    const dmMatch = clean.match(/(?:dailymotion\.com\/(?:video|embed\/video)\/|dai\.ly\/)([a-zA-Z0-9]+)/i);
    if (dmMatch && dmMatch[1]) {
      return `https://www.dailymotion.com/embed/video/${dmMatch[1]}?autoplay=1`;
    }

    // Explicit embed URLs or URLs extracted from <iframe>
    if (clean.includes("/embed/") || clean.includes("/e/")) {
      return clean;
    }

    return null;
  }

  _cleanSourceUrl(url) {
    if (!url || typeof url !== "string") return "";
    let clean = url.trim();
    // If the user pasted an entire <iframe src="..."> embed snippet, extract the URL
    const iframeMatch = clean.match(/src\s*=\s*["']([^"']+)["']/i);
    if (iframeMatch && iframeMatch[1]) {
      clean = iframeMatch[1].trim();
    }
    return clean;
  }

  _resolveDirectVideoUrl(url, ep) {
    if (!url || typeof url !== "string") return "";
    let clean = this._cleanSourceUrl(url);

    // If it's a Buzzheavier web URL, check if a direct video stream URL exists in downloads.buzz
    if ((clean.includes("buzzheavier.com") || clean.includes("bzzhr.to")) && !clean.includes("ts.buzzheavier.com")) {
      const dlBuzz = (ep && ep.downloads && ep.downloads.buzz) || (this.item && this.item.downloads && this.item.downloads.buzz) || "";
      if (dlBuzz && (dlBuzz.includes("ts.buzzheavier.com") || dlBuzz.includes("/d/"))) {
        return dlBuzz.trim();
      }
    }

    return clean;
  }

  _showErrorOverlay(url, ep) {
    this._hideErrorOverlay();
    const wrap = document.getElementById("mpPlayerWrap");
    if (!wrap) return;
    wrap.classList.add("has-error");

    const overlay = document.createElement("div");
    overlay.id = "mpPlayerErrorOverlay";
    overlay.className = "mp-player-error-overlay";

    const sources = (ep && ep.streamSources) || (this.item && this.item.streamSources) || [];
    const validSources = sources.filter(s => s && s.url && s.url.trim() !== "");

    let server1Idx = validSources.findIndex(s => s && s.server && s.server.toLowerCase().includes("1"));
    let server2Idx = validSources.findIndex(s => s && s.server && s.server.toLowerCase().includes("2"));

    if (server1Idx === -1 && validSources.length > 0) server1Idx = 0;
    if (server2Idx === -1 && validSources.length > 1) server2Idx = 1;

    const currentIdx = typeof this.currentServerIndex === "number" ? this.currentServerIndex : 0;
    const isServer1Current = (currentIdx === server1Idx);
    const isServer2Current = (currentIdx === server2Idx);

    // Target server: If server 1 not work switch server 2, if server 2 not work switch to 1
    let targetIdx = -1;
    let targetLabel = "";
    if (isServer1Current && server2Idx > -1) {
      targetIdx = server2Idx;
      targetLabel = "Server 2";
    } else if (isServer2Current && server1Idx > -1) {
      targetIdx = server1Idx;
      targetLabel = "Server 1";
    } else if (server2Idx > -1 && server2Idx !== currentIdx) {
      targetIdx = server2Idx;
      targetLabel = "Server 2";
    } else if (server1Idx > -1 && server1Idx !== currentIdx) {
      targetIdx = server1Idx;
      targetLabel = "Server 1";
    }

    const isServer2 = isServer2Current;
    const errTitle = isServer2
      ? "කිසිදු Server එකක් වැඩ නොකරන්නේ නම්, Video එක Download කර නරඹන්න."
      : "Server 1 වැඩ නොකරන්නේ නම් Server 2 වෙත මාරු වන්න.";
    const errDesc = isServer2
      ? "If none of the servers are working, Download the video and watch it."
      : "If Server 1 does not work, switch to Server 2.";

    const actionBtnsHtml = !isServer2 && targetIdx > -1
      ? `
        <button type="button" class="btn-mp-switch" id="mpErrSwitchTargetBtn">▶ Switch to ${targetLabel}</button>
        <button type="button" class="btn-mp-ext" id="mpErrDownloadBtn">⬇️ Download Video</button>
        <button type="button" class="btn-mp-ext" id="mpErrRetryBtn">🔄 Retry</button>
      `
      : `
        <button type="button" class="btn-mp-switch" id="mpErrDownloadBtn">⬇️ Download Video</button>
        ${targetIdx > -1 ? `<button type="button" class="btn-mp-ext" id="mpErrSwitchTargetBtn">▶ Switch to ${targetLabel}</button>` : ""}
        <button type="button" class="btn-mp-ext" id="mpErrRetryBtn">🔄 Retry</button>
      `;

    overlay.innerHTML = `
      <div class="mp-err-icon">⚠️</div>
      <h4 class="mp-err-title">${errTitle}</h4>
      <p class="mp-err-desc">${errDesc}</p>
      <div class="mp-err-actions">
        ${actionBtnsHtml}
      </div>
    `;

    wrap.appendChild(overlay);

    const dlBtn = overlay.querySelector("#mpErrDownloadBtn");
    if (dlBtn) {
      dlBtn.addEventListener("click", () => {
        this._goDownload(this.currentEpIndex || 0);
      });
    }

    const switchTargetBtn = overlay.querySelector("#mpErrSwitchTargetBtn");
    if (switchTargetBtn && targetIdx > -1) {
      switchTargetBtn.addEventListener("click", () => {
        const btns = document.querySelectorAll("#mpServerBtns .mp-server-btn");
        if (btns && btns[targetIdx]) {
          btns[targetIdx].click();
        } else {
          this.currentServerIndex = targetIdx;
          this._loadVideo(ep, targetIdx);
        }
      });
    }

    const retryBtn = overlay.querySelector("#mpErrRetryBtn");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        this._hideErrorOverlay();
        this._loadVideo(ep, this.currentServerIndex || 0);
      });
    }
  }

  _hideErrorOverlay() {
    const el = document.getElementById("mpPlayerErrorOverlay");
    if (el) el.remove();
    const wrap = document.getElementById("mpPlayerWrap");
    if (wrap) wrap.classList.remove("has-error");
  }

  _showBuzzheavierCard(url, ep) {
    this._hideBuzzheavierCard();
  }

  _hideBuzzheavierCard() {
    const buzzCard = document.getElementById("mpBuzzCard");
    if (buzzCard) {
      buzzCard.remove();
    }
  }

  _hidePlayer() {
    const section = document.getElementById("playerSection");
    if (section) section.style.display = "none";
    this._hideBuzzheavierCard();
    this._hideErrorOverlay();
    const video = document.getElementById("mpVideoPlayer");
    if (video) { video.pause(); video.src = ""; }
    const iframe = document.getElementById("mpIframePlayer");
    if (iframe) { iframe.src = ""; iframe.style.display = "none"; }
    const shield = document.getElementById("mpIframeShield");
    if (shield) shield.style.display = "none";
  }

  _loadVideo(ep, target = 0) {
    const video = document.getElementById("mpVideoPlayer");
    const iframe = document.getElementById("mpIframePlayer");
    const shield = document.getElementById("mpIframeShield");
    if (!video && !iframe) return;

    this.currentServerIndex = typeof target === "number" ? target : 0;

    let url = "";
    if (typeof target === "string") {
      url = target.trim();
    } else if (typeof target === "number") {
      const validSources = (ep.streamSources || []).filter(s => s && s.url && s.url.trim() !== "");
      url = (validSources[target] && validSources[target].url) || (validSources[0] && validSources[0].url) || (ep.streamSources?.[target]?.url) || "";
    } else if (target && target.url) {
      url = target.url.trim();
    }

    url = this._cleanSourceUrl(url);

    this._hideBuzzheavierCard();
    this._hideErrorOverlay();

    const embedUrl = this._getEmbedUrl(url);

    if (embedUrl) {
      if (video) {
        video.pause();
        video.src = "";
        video.style.display = "none";
      }
      if (iframe) {
        iframe.src = embedUrl;
        iframe.style.display = "block";
      }
      if (shield) {
        shield.style.display = "block";
      }
    } else {
      if (shield) {
        shield.style.display = "none";
      }
      if (iframe) {
        iframe.src = "";
        iframe.style.display = "none";
      }
      if (video) {
        const directUrl = this._resolveDirectVideoUrl(url, ep);
        video.style.display = "block";
        video.src = directUrl;
        video.setAttribute("controlsList", "nodownload");
        video.oncontextmenu = (e) => e.preventDefault();
        video.onloadeddata = () => {
          this._hideErrorOverlay();
        };
        video.onerror = () => {
          if (video.src && video.style.display !== "none") {
            console.warn("Video failed to load:", video.src);
            this._showErrorOverlay(url, ep);
            if (typeof this._showToast === "function") {
              const currentIdx = typeof this.currentServerIndex === "number" ? this.currentServerIndex : 0;
              const isServer2 = (currentIdx === 1 || (ep && ep.streamSources && ep.streamSources[currentIdx] && ep.streamSources[currentIdx].server && ep.streamSources[currentIdx].server.toLowerCase().includes("2")));
              const msg = isServer2
                ? "⚠️ කිසිදු Server එකක් වැඩ නොකරන්නේ නම්, Video එක Download කර නරඹන්න (If none of the servers are working, Download the video and watch it)"
                : "⚠️ Server 1 වැඩ නොකරන්නේ නම් Server 2 වෙත මාරු වන්න (If Server 1 does not work, switch to Server 2)";
              this._showToast(msg, "warning");
            }
          }
        };
        if (directUrl) {
          video.load();
          video.play().catch(() => {});
        }
      }
    }
  }

  _updateServerNotice(serverIdx, validSources) {
    const serverNotice = document.getElementById("mpServerNotice");
    if (!serverNotice) return;
    if (!validSources || validSources.length <= 1) {
      serverNotice.style.display = "none";
      return;
    }
    serverNotice.style.display = "flex";

    const isServer2 = (serverIdx === 1 || (validSources[serverIdx] && validSources[serverIdx].server && validSources[serverIdx].server.toLowerCase().includes("2")));

    if (isServer2) {
      serverNotice.innerHTML = `
        <span>⚠️</span>
        <div>
          <strong>කිසිදු Server එකක් වැඩ නොකරන්නේ නම්, Video එක Download කර නරඹන්න.</strong><br />
          If none of the servers are working, Download the video and watch it.
        </div>
      `;
    } else {
      serverNotice.innerHTML = `
        <span>⚠️</span>
        <div>
          <strong>Server 1 වැඩ නොකරන්නේ නම් Server 2 වෙත මාරු වන්න.</strong><br />
          If Server 1 does not work, switch to Server 2.
        </div>
      `;
    }
  }

  _renderServerBtns(ep) {
    const container = document.getElementById("mpServerBtns");
    const serverRow = document.getElementById("mpServerRow");
    const serverNotice = document.getElementById("mpServerNotice");
    if (!container) return;
    container.innerHTML = "";

    // Filter out servers without URL ("don't show the server that are not added the link")
    const validSources = (ep.streamSources || []).filter(s => s && s.url && s.url.trim() !== "");

    if (validSources.length === 0) {
      if (serverRow) serverRow.style.display = "none";
      if (serverNotice) serverNotice.style.display = "none";
      container.style.display = "none";
      return;
    }

    if (serverRow) serverRow.style.display = "flex";
    container.style.display = "flex";
    this._updateServerNotice(this.currentServerIndex || 0, validSources);

    validSources.forEach((src, idx) => {
      const btn = document.createElement("button");
      btn.className = `mp-server-btn${idx === (this.currentServerIndex || 0) ? " active" : ""}`;
      let serverLabel = `Server ${idx + 1}`;
      if (src && src.server) {
        const match = src.server.match(/Server\s*(\d+)/i);
        if (match) {
          serverLabel = `Server ${match[1]}`;
        } else {
          serverLabel = src.server;
        }
      }
      btn.textContent = serverLabel;
      btn.addEventListener("click", () => {
        container.querySelectorAll(".mp-server-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentServerIndex = idx;
        this._loadVideo(ep, idx);
        this._updateServerNotice(idx, validSources);
      });
      container.appendChild(btn);
    });
  }

  _renderPlayerEpBtns() {
    const container = document.getElementById("mpEpNumBtns");
    if (!container) return;
    container.innerHTML = "";
    (this.item.episodes || []).forEach((ep, idx) => {
      const btn = document.createElement("button");
      btn.className = `mp-ep-num-btn${idx === this.currentEpIndex ? " active" : ""}`;
      btn.textContent = `EP ${ep.epNumber || idx + 1}`;
      btn.title = ep.titleEnglish;
      btn.addEventListener("click", () => {
        container.querySelectorAll(".mp-ep-num-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentEpIndex = idx;
        const ep2 = this.item.episodes[idx];
        this._setText("playerSectionTitle", ep2.titleEnglish);
        this._loadVideo(ep2, 0);
        this._renderServerBtns(ep2);
        if (typeof StorageService.updateHistory === "function") {
          StorageService.updateHistory(this.item.id, idx + 1, 0);
        }
      });
      container.appendChild(btn);
    });
  }

  /* ─────────────────────────────────────────────
     EPISODES SECTION
     ───────────────────────────────────────────── */
  _renderEpisodes() {
    const item    = this.item;
    const section = document.getElementById("episodesSection");
    const grid    = document.getElementById("mpEpGrid");
    if (!section || !grid) return;

    if (item.type !== "series" || !item.episodes?.length) {
      section.style.display = "none";
      return;
    }

    section.style.display = "block";
    this._setText("epCountBadge", `${item.episodes.length} Episodes`);
    grid.innerHTML = "";

    item.episodes.forEach((ep, idx) => {
      const card = document.createElement("div");
      card.className = "mp-ep-card";
      const epThumb = (item.backdrop && item.backdrop.trim()) ? item.backdrop.trim() : (ep.thumbnail || item.poster);
      card.innerHTML = `
        <div class="mp-ep-thumb">
          <img src="${epThumb}" alt="Episode ${ep.epNumber || idx + 1}" loading="lazy" />
          <div class="mp-ep-thumb-overlay">
            <button class="mp-ep-play-circle" data-idx="${idx}" title="Watch Episode ${ep.epNumber || idx + 1}">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
          <span class="mp-ep-badge">EP ${ep.epNumber || idx + 1}</span>
          ${ep.duration ? `<span class="mp-ep-duration">${ep.duration}</span>` : ""}
        </div>
        <div class="mp-ep-info">
          <h4>${ep.titleEnglish || ""}</h4>
          <p>${ep.titleSinhala || ""}</p>
          <div class="mp-ep-actions">
            <button class="btn btn-primary btn-xs" data-action="watch" data-idx="${idx}">▶ Watch</button>
            <button class="btn btn-secondary btn-xs" data-action="dl" data-idx="${idx}">⬇ Download</button>
          </div>
        </div>
      `;

      // Play button
      card.querySelector(".mp-ep-play-circle").addEventListener("click", () => {
        this._fireAds();
        this._showPlayer(idx);
      });

      // Watch btn
      card.querySelector('[data-action="watch"]').addEventListener("click", () => {
        this._fireAds();
        this._showPlayer(idx);
      });

      // Download btn — go to countdown page
      card.querySelector('[data-action="dl"]').addEventListener("click", () => {
        this._goDownload(idx);
      });

      grid.appendChild(card);
    });
  }

  /* ─────────────────────────────────────────────
     DOWNLOAD SECTION  (no quality cards)
     ───────────────────────────────────────────── */
  _renderDownloads() {
    const item = this.item;

    // Hide quality grid (not shown per requirements)
    const qualGrid = document.getElementById("mpQualityGrid");
    if (qualGrid) qualGrid.style.display = "none";

    // Episode selector (series)
    const dlEpSel  = document.getElementById("mpDlEpSelector");
    const dlSelect = document.getElementById("mpDlEpSelect");
    if (item.type === "series" && item.episodes?.length > 1) {
      if (dlEpSel)  dlEpSel.style.display  = "block";
      if (dlSelect) {
        dlSelect.innerHTML = "";
        item.episodes.forEach((ep, idx) => {
          const opt = document.createElement("option");
          opt.value       = idx;
          opt.textContent = `Episode ${ep.epNumber || idx + 1}: ${ep.titleEnglish}`;
          dlSelect.appendChild(opt);
        });
        dlSelect.addEventListener("change", e => {
          this.selectedDlEpIdx = parseInt(e.target.value, 10);
          this._renderDownloadLinks();
        });
      }
    }

    this.selectedDlEpIdx = 0;
    this._renderDownloadLinks();
  }

  _renderDownloadLinks() {
    const item      = this.item;
    const container = document.getElementById("mpDlLinks");
    if (!container) return;

    const epIdx = this.selectedDlEpIdx || 0;
    const ep    = item.episodes?.[epIdx];
    const dl    = ep?.downloads || item?.downloads || {};

    const links = [];
    if (dl.gdrive && dl.gdrive.trim()) {
      links.push({ icon: "☁️", name: "Google Drive", meta: "Stable Mirror" });
    }
    if (dl.buzz && dl.buzz.trim()) {
      links.push({ icon: "⚡", name: "Server 2", meta: "Direct High Speed Mirror" });
    }
    // Fallback for legacy data structure
    if (!links.length && (dl.hd || dl.fhd)) {
      links.push({ icon: "☁️", name: "Google Drive", meta: "Stable Mirror" });
    }

    if (!links.length) {
      container.innerHTML = `<p style="color:var(--text-muted);font-size:0.88rem;">No download links available for this content.</p>`;
      return;
    }

    container.innerHTML = links.map((l, i) => `
      <div class="mp-dl-link-row">
        <div class="mp-dl-link-info">
          <span class="mp-dl-link-icon">${l.icon}</span>
          <div>
            <div class="mp-dl-link-name">${l.name}</div>
            <div class="mp-dl-link-meta">${l.meta}</div>
          </div>
        </div>
        <button class="btn btn-primary btn-sm" data-ep-idx="${epIdx}">
          ⬇ Download
        </button>
      </div>
    `).join("");

    // Wire download buttons → fire ads + go to countdown page
    container.querySelectorAll("button[data-ep-idx]").forEach(btn => {
      btn.addEventListener("click", () => {
        const ep2 = parseInt(btn.dataset.epIdx, 10);
        this._goDownload(ep2);
      });
    });
  }

  /* ─────────────────────────────────────────────
     RELATED SECTION
     ───────────────────────────────────────────── */
  _renderRelated() {
    const item    = this.item;
    const grid    = document.getElementById("mpRelatedGrid");
    const section = document.getElementById("relatedSection");
    if (!grid) return;

    const related = this.catalog
      .filter(c => c.id !== item.id && (c.category === item.category || c.channel === item.channel))
      .slice(0, 10);

    if (!related.length) {
      if (section) section.style.display = "none";
      return;
    }

    grid.innerHTML = "";
    related.forEach(rel => {
      const a = document.createElement("a");
      a.className = "mp-related-card";
      a.href      = `movie.html?id=${rel.id}`;
      a.innerHTML = `
        <div class="mp-related-thumb">
          <img src="${rel.poster}" alt="${rel.titleEnglish}" loading="lazy" />
          <div class="mp-related-overlay"></div>
        </div>
        <div class="mp-related-info">
          <h4>${rel.titleEnglish}</h4>
          <p>📅 ${rel.year}</p>
        </div>
      `;
      grid.appendChild(a);
    });
  }

  /* ─────────────────────────────────────────────
     HELPERS
     ───────────────────────────────────────────── */
  _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  _showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast-message toast-${type}`;
    const icon = type === "success" ? "✅" : type === "error" ? "⚠️" : "ℹ️";
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
}

/* ─── Boot ─────────────────────────────────────── */
window.MoviePageCtrl = new MoviePageController();
document.addEventListener("DOMContentLoaded", () => MoviePageCtrl.init());
