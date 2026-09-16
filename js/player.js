/**
 * Sinhala Dubbed Cartoons - Video Player Controller
 * Main: English | Sub: Sinhala
 */

class VideoPlayerController {
  constructor() {
    this.currentContent = null;
    this.currentEpisodeIndex = 0;
    this.currentServerIndex = 0;
    this.currentQuality = "1080p FHD";
    this.isTheaterMode = false;
    this.autoplayNext = true;
    this.saveInterval = null;

    this.initDOMElements();
    this.bindEvents();
  }

  initDOMElements() {
    this.playerModal = document.getElementById("playerModal");
    this.videoElement = document.getElementById("mainVideoPlayer");
    if (this.videoElement) {
      this.videoElement.setAttribute("controlsList", "nodownload");
      this.videoElement.oncontextmenu = (e) => e.preventDefault();
    }
    this.iframeElement = document.getElementById("mainIframePlayer");
    this.iframeShield = document.getElementById("mainIframeShield");
    if (this.iframeShield) {
      this.iframeShield.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); });
      this.iframeShield.addEventListener("contextmenu", (e) => e.preventDefault());
    }
    this.videoWrapper = document.getElementById("videoPlayerWrapper");
    this.videoControlsBar = document.getElementById("videoControlsBar");
    this.playerTitle = document.getElementById("playerContentTitle");
    this.playerSubTitle = document.getElementById("playerContentSubTitle");
    this.playerBadge = document.getElementById("playerAudioBadge");
    
    // Controls
    this.btnPlayPause = document.getElementById("btnPlayPause");
    this.playIcon = document.getElementById("playIcon");
    this.pauseIcon = document.getElementById("pauseIcon");
    this.btnRewind = document.getElementById("btnRewind");
    this.btnForward = document.getElementById("btnForward");
    this.btnMute = document.getElementById("btnMute");
    this.volumeSlider = document.getElementById("volumeSlider");
    this.timeDisplay = document.getElementById("playerTimeDisplay");
    this.progressBar = document.getElementById("playerProgressBar");
    this.progressBuffered = document.getElementById("playerProgressBuffered");
    this.progressCurrent = document.getElementById("playerProgressCurrent");
    this.progressHover = document.getElementById("playerProgressHover");
    this.hoverTimeDisplay = document.getElementById("playerHoverTime");
    
    // Menus & Toggles
    this.speedSelect = document.getElementById("playerSpeedSelect");
    this.qualitySelect = document.getElementById("playerQualitySelect");
    this.serverButtonsContainer = document.getElementById("playerServerButtons");
    this.btnTheater = document.getElementById("btnTheaterMode");
    this.btnPip = document.getElementById("btnPipMode");
    this.btnFullscreen = document.getElementById("btnFullscreen");
    this.btnClose = document.getElementById("btnClosePlayer");

    // Series Drawer / Playlist
    this.episodeSection = document.getElementById("playerEpisodeSection");
    this.episodeList = document.getElementById("playerEpisodeList");
    this.btnPrevEp = document.getElementById("btnPrevEpisode");
    this.btnNextEp = document.getElementById("btnNextEpisode");
    this.autoplayCheckbox = document.getElementById("toggleAutoplayNext");
  }

  bindEvents() {
    if (!this.videoElement) return;

    // Play / Pause toggle
    this.btnPlayPause?.addEventListener("click", () => this.togglePlay());
    this.videoElement.addEventListener("click", () => this.togglePlay());

    // Video status events
    this.videoElement.addEventListener("play", () => this.updatePlayState(true));
    this.videoElement.addEventListener("pause", () => this.updatePlayState(false));
    this.videoElement.addEventListener("timeupdate", () => this.handleTimeUpdate());
    this.videoElement.addEventListener("progress", () => this.handleBufferUpdate());
    this.videoElement.addEventListener("ended", () => this.handleEnded());
    this.videoElement.addEventListener("loadedmetadata", () => this.handleMetadataLoaded());

    // Timeline Scrubber
    this.progressBar?.addEventListener("click", (e) => this.seek(e));
    this.progressBar?.addEventListener("mousemove", (e) => this.handleProgressHover(e));
    this.progressBar?.addEventListener("mouseleave", () => {
      if (this.progressHover) this.progressHover.style.opacity = "0";
    });

    // Skip +/- 10s
    this.btnRewind?.addEventListener("click", () => this.skip(-10));
    this.btnForward?.addEventListener("click", () => this.skip(10));

    // Volume & Mute
    this.btnMute?.addEventListener("click", () => this.toggleMute());
    this.volumeSlider?.addEventListener("input", (e) => {
      this.videoElement.volume = parseFloat(e.target.value);
      this.videoElement.muted = false;
      this.updateVolumeIcon();
    });

    // Speed & Quality
    this.speedSelect?.addEventListener("change", (e) => {
      this.videoElement.playbackRate = parseFloat(e.target.value);
    });

    this.qualitySelect?.addEventListener("change", (e) => {
      this.currentQuality = e.target.value;
      App.showToast(`Stream quality set to ${this.currentQuality}`, "info");
    });

    // Theater & PiP & Fullscreen
    this.btnTheater?.addEventListener("click", () => this.toggleTheaterMode());
    this.btnPip?.addEventListener("click", () => this.togglePiP());
    this.btnFullscreen?.addEventListener("click", () => this.toggleFullscreen());
    this.btnClose?.addEventListener("click", () => this.closePlayer());

    // Prev / Next Episode
    this.btnPrevEp?.addEventListener("click", () => this.playPreviousEpisode());
    this.btnNextEp?.addEventListener("click", () => this.playNextEpisode());

    if (this.autoplayCheckbox) {
      this.autoplayCheckbox.addEventListener("change", (e) => {
        this.autoplayNext = e.target.checked;
      });
    }

    // Keyboard Shortcuts
    document.addEventListener("keydown", (e) => {
      if (!this.playerModal || !this.playerModal.classList.contains("active")) return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          this.togglePlay();
          break;
        case "f":
          e.preventDefault();
          this.toggleFullscreen();
          break;
        case "t":
          e.preventDefault();
          this.toggleTheaterMode();
          break;
        case "m":
          e.preventDefault();
          this.toggleMute();
          break;
        case "arrowleft":
          e.preventDefault();
          this.skip(-5);
          break;
        case "arrowright":
          e.preventDefault();
          this.skip(5);
          break;
        case "escape":
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            this.closePlayer();
          }
          break;
      }
    });
  }

  open(content, episodeIndex = 0) {
    this.currentContent = content;
    this.currentEpisodeIndex = episodeIndex;
    this.currentServerIndex = 0;

    if (!this.playerModal) return;

    this.playerModal.classList.add("active");
    document.body.style.overflow = "hidden";

    this.renderHeaderInfo();
    this.renderServers();
    this.renderEpisodeList();
    this.loadSource();

    // Start progress autosave
    if (this.saveInterval) clearInterval(this.saveInterval);
    this.saveInterval = setInterval(() => {
      if (this.videoElement && !this.videoElement.paused && this.videoElement.duration > 0) {
        const epNum = this.currentContent.type === "series" ? (this.currentEpisodeIndex + 1) : 1;
        StorageService.saveProgress(this.currentContent.id, epNum, this.videoElement.currentTime, this.videoElement.duration);
      }
    }, 4000);
  }

  closePlayer() {
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.src = "";
    }
    if (this.iframeElement) {
      this.iframeElement.src = "";
      this.iframeElement.style.display = "none";
    }
    if (this.iframeShield) {
      this.iframeShield.style.display = "none";
    }
    this.hideBuzzheavierCard();
    this.hideErrorOverlay();
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
    if (this.playerModal) {
      this.playerModal.classList.remove("active");
    }
    document.body.style.overflow = "";

    // Exit theater mode if active
    if (this.isTheaterMode) {
      this.toggleTheaterMode();
    }

    if (window.App && typeof window.App.renderContinueWatching === "function") {
      window.App.renderContinueWatching();
    }
  }

  renderHeaderInfo() {
    if (!this.currentContent) return;

    let title = this.currentContent.titleEnglish;
    let subtitle = `${this.currentContent.titleSinhala} (${this.currentContent.year})`;

    if (this.currentContent.type === "series" && this.currentContent.episodes && this.currentContent.episodes[this.currentEpisodeIndex]) {
      const ep = this.currentContent.episodes[this.currentEpisodeIndex];
      title = `${this.currentContent.titleEnglish} - ${ep.titleEnglish}`;
      subtitle = `${this.currentContent.titleSinhala} • ${ep.titleSinhala}`;
    }

    if (this.playerTitle) this.playerTitle.textContent = title;
    if (this.playerSubTitle) this.playerSubTitle.textContent = subtitle;
    if (this.playerBadge) this.playerBadge.textContent = this.currentContent.audio || "Sinhala Dubbed Audio";
  }

  renderServers() {
    if (!this.serverButtonsContainer) return;
    this.serverButtonsContainer.innerHTML = "";

    let rawSources = [];
    if (this.currentContent.type === "series" && this.currentContent.episodes && this.currentContent.episodes[this.currentEpisodeIndex]) {
      rawSources = this.currentContent.episodes[this.currentEpisodeIndex].streamSources || [];
    } else {
      rawSources = this.currentContent.streamSources || [];
    }

    // Filter out servers without URL ("don't show the server that are not added the link")
    let sources = (rawSources || []).filter(s => s && s.url && s.url.trim() !== "");

    if (!sources || sources.length === 0) {
      sources = [
        { server: "Server 1", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
      ];
    }

    this.activeStreamSources = sources;
    if (this.currentServerIndex >= sources.length) {
      this.currentServerIndex = 0;
    }

    this.serverButtonsContainer.style.display = sources.length > 1 ? "flex" : (sources.length === 1 ? "flex" : "none");

    sources.forEach((src, idx) => {
      const btn = document.createElement("button");
      btn.className = `server-btn ${idx === this.currentServerIndex ? "active" : ""}`;
      let serverLabel = `Server ${idx + 1}`;
      if (src && src.server) {
        const match = src.server.match(/Server\s*(\d+)/i);
        if (match) {
          serverLabel = `Server ${match[1]}`;
        } else {
          serverLabel = src.server;
        }
      }
      btn.innerHTML = `<span class="server-dot"></span> ${serverLabel}`;
      btn.addEventListener("click", () => {
        this.currentServerIndex = idx;
        this.serverButtonsContainer.querySelectorAll(".server-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.loadSource(true);
        if (window.App && typeof App.showToast === "function") {
          App.showToast(`Switched to ${serverLabel}`, "success");
        }
      });
      this.serverButtonsContainer.appendChild(btn);
    });
  }

  renderEpisodeList() {
    if (!this.episodeSection || !this.episodeList) return;

    if (this.currentContent.type !== "series" || !this.currentContent.episodes || this.currentContent.episodes.length === 0) {
      this.episodeSection.style.display = "none";
      return;
    }

    this.episodeSection.style.display = "block";
    this.episodeList.innerHTML = "";

    this.currentContent.episodes.forEach((ep, idx) => {
      const card = document.createElement("div");
      card.className = `player-ep-item ${idx === this.currentEpisodeIndex ? "active" : ""}`;
      const epImg = (this.currentContent.backdrop && this.currentContent.backdrop.trim()) ? this.currentContent.backdrop : (ep.thumbnail || this.currentContent.poster);
      card.innerHTML = `
        <div class="player-ep-thumb">
          <img src="${epImg}" alt="Episode ${ep.epNumber || idx + 1}" loading="lazy" />
          <span class="ep-badge">EP ${ep.epNumber || idx + 1}</span>
          <span class="ep-dur">${ep.duration || "22:00"}</span>
        </div>
        <div class="player-ep-details">
          <h4 class="player-ep-title">${ep.titleEnglish}</h4>
          <p class="player-ep-sub">${ep.titleSinhala}</p>
        </div>
      `;
      card.addEventListener("click", () => {
        this.currentEpisodeIndex = idx;
        this.currentServerIndex = 0;
        this.renderHeaderInfo();
        this.renderServers();
        this.renderEpisodeList();
        this.loadSource();
      });
      this.episodeList.appendChild(card);
    });

    if (this.btnPrevEp) this.btnPrevEp.disabled = this.currentEpisodeIndex === 0;
    if (this.btnNextEp) this.btnNextEp.disabled = this.currentEpisodeIndex >= this.currentContent.episodes.length - 1;
  }

  isBuzzheavierUrl(url) {
    return false;
  }

  parseGoogleDriveId(url) {
    if (!url || typeof url !== "string") return null;
    const trimmed = url.trim();
    if (!trimmed.includes("drive.google.com") && !trimmed.includes("docs.google.com")) return null;
    const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (dMatch && dMatch[1]) return dMatch[1];
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) return idMatch[1];
    return null;
  }

  getEmbedUrl(url) {
    if (!url || typeof url !== "string") return null;
    const clean = this.cleanSourceUrl(url);

    // Google Drive
    const driveId = this.parseGoogleDriveId(clean);
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

  cleanSourceUrl(url) {
    if (!url || typeof url !== "string") return "";
    let clean = url.trim();
    // If the user pasted an entire <iframe src="..."> embed snippet, extract the URL
    const iframeMatch = clean.match(/src\s*=\s*["']([^"']+)["']/i);
    if (iframeMatch && iframeMatch[1]) {
      clean = iframeMatch[1].trim();
    }
    return clean;
  }

  resolveDirectVideoUrl(url) {
    if (!url || typeof url !== "string") return "";
    let clean = this.cleanSourceUrl(url);

    // If it's a Buzzheavier web URL, check if a direct video stream URL exists in downloads.buzz
    if ((clean.includes("buzzheavier.com") || clean.includes("bzzhr.to")) && !clean.includes("ts.buzzheavier.com")) {
      const ep = this.currentContent && this.currentContent.type === "series" && this.currentContent.episodes ? this.currentContent.episodes[this.currentEpisodeIndex] : null;
      const dlBuzz = (ep && ep.downloads && ep.downloads.buzz) || (this.currentContent && this.currentContent.downloads && this.currentContent.downloads.buzz) || "";
      if (dlBuzz && (dlBuzz.includes("ts.buzzheavier.com") || dlBuzz.includes("/d/"))) {
        return dlBuzz.trim();
      }
    }

    return clean;
  }

  showErrorOverlay(url) {
    this.hideErrorOverlay();
    const wrap = this.videoPlayerWrapper;
    if (!wrap) return;

    const overlay = document.createElement("div");
    overlay.id = "mainPlayerErrorOverlay";
    overlay.className = "mp-player-error-overlay";

    const sources = this.activeStreamSources || [];
    let server1Idx = sources.findIndex(s => s && s.server && s.server.toLowerCase().includes("1") && s.url && s.url.trim() !== "");
    let server2Idx = sources.findIndex(s => s && s.server && s.server.toLowerCase().includes("2") && s.url && s.url.trim() !== "");

    if (server1Idx === -1 && sources.length > 0) server1Idx = 0;
    if (server2Idx === -1 && sources.length > 1) server2Idx = 1;

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
        <button type="button" class="btn-mp-switch" id="mainErrSwitchTargetBtn">▶ Switch to ${targetLabel}</button>
        <button type="button" class="btn-mp-ext" id="mainErrDownloadBtn">⬇️ Download Video</button>
        <button type="button" class="btn-mp-ext" id="mainErrRetryBtn">🔄 Retry</button>
      `
      : `
        <button type="button" class="btn-mp-switch" id="mainErrDownloadBtn">⬇️ Download Video</button>
        ${targetIdx > -1 ? `<button type="button" class="btn-mp-ext" id="mainErrSwitchTargetBtn">▶ Switch to ${targetLabel}</button>` : ""}
        <button type="button" class="btn-mp-ext" id="mainErrRetryBtn">🔄 Retry</button>
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

    const dlBtn = overlay.querySelector("#mainErrDownloadBtn");
    if (dlBtn) {
      dlBtn.addEventListener("click", () => {
        if (window.DownloadHub && this.currentContent) {
          window.DownloadHub.open(this.currentContent, this.currentEpisodeIndex || 0);
        } else if (this.currentContent?.id) {
          window.location.href = `download-wait.html?id=${this.currentContent.id}&ep=${this.currentEpisodeIndex || 0}`;
        }
      });
    }

    const switchTargetBtn = overlay.querySelector("#mainErrSwitchTargetBtn");
    if (switchTargetBtn && targetIdx > -1) {
      switchTargetBtn.addEventListener("click", () => {
        const btns = this.serverButtonsContainer ? this.serverButtonsContainer.querySelectorAll(".server-btn") : null;
        if (btns && btns[targetIdx]) {
          btns[targetIdx].click();
        } else {
          this.currentServerIndex = targetIdx;
          this.loadSource(true);
        }
      });
    }

    const retryBtn = overlay.querySelector("#mainErrRetryBtn");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        this.hideErrorOverlay();
        this.loadSource(true);
      });
    }
  }

  hideErrorOverlay() {
    const el = document.getElementById("mainPlayerErrorOverlay");
    if (el) el.remove();
  }

  showBuzzheavierCard(url) {
    this.hideBuzzheavierCard();
  }

  hideBuzzheavierCard() {
    if (this.buzzCard) {
      this.buzzCard.remove();
      this.buzzCard = null;
    }
    const existing = document.getElementById("mainPlayerBuzzCard");
    if (existing) existing.remove();
  }

  loadSource(preserveTime = false) {
    if (!this.videoElement || !this.currentContent) return;

    let sourceUrl = "";
    const active = this.activeStreamSources || [];
    if (active.length > 0) {
      sourceUrl = (active[this.currentServerIndex] && active[this.currentServerIndex].url) || (active[0] && active[0].url) || "";
    } else if (this.currentContent.type === "series" && this.currentContent.episodes && this.currentContent.episodes[this.currentEpisodeIndex]) {
      const ep = this.currentContent.episodes[this.currentEpisodeIndex];
      const sources = (ep.streamSources || []).filter(s => s && s.url && s.url.trim() !== "");
      sourceUrl = (sources[this.currentServerIndex] && sources[this.currentServerIndex].url) || (sources[0] && sources[0].url);
    } else if (this.currentContent.streamSources && this.currentContent.streamSources.length > 0) {
      const sources = (this.currentContent.streamSources || []).filter(s => s && s.url && s.url.trim() !== "");
      sourceUrl = (sources[this.currentServerIndex] && sources[this.currentServerIndex].url) || (sources[0] && sources[0].url);
    }

    sourceUrl = this.cleanSourceUrl(sourceUrl);

    if (!sourceUrl) {
      sourceUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    }

    this.hideBuzzheavierCard();
    this.hideErrorOverlay();

    const embedUrl = this.getEmbedUrl(sourceUrl);
    if (embedUrl) {
      this.videoElement.pause();
      this.videoElement.src = "";
      this.videoElement.style.display = "none";
      if (this.videoControlsBar) this.videoControlsBar.style.display = "none";
      if (this.iframeElement) {
        this.iframeElement.src = embedUrl;
        this.iframeElement.style.display = "block";
      }
      if (this.iframeShield) {
        this.iframeShield.style.display = "block";
      }
      return;
    }

    // Direct video stream
    const directUrl = this.resolveDirectVideoUrl(sourceUrl);
    if (this.iframeShield) {
      this.iframeShield.style.display = "none";
    }
    if (this.iframeElement) {
      this.iframeElement.src = "";
      this.iframeElement.style.display = "none";
    }
    this.videoElement.style.display = "block";
    if (this.videoControlsBar) this.videoControlsBar.style.display = "flex";

    const prevTime = preserveTime ? this.videoElement.currentTime : 0;

    const progress = StorageService.getProgress(this.currentContent.id);
    let resumeTime = 0;
    if (!preserveTime && progress) {
      const currentEpNum = this.currentContent.type === "series" ? (this.currentEpisodeIndex + 1) : 1;
      if (progress.episodeNumber === currentEpNum && progress.currentTime > 10 && progress.currentTime < progress.duration - 20) {
        resumeTime = progress.currentTime;
      }
    }

    this.videoElement.src = directUrl;
    this.videoElement.onerror = () => {
      if (this.videoElement.src && this.videoElement.style.display !== "none") {
        console.warn("Video failed to load:", this.videoElement.src);
        this.showErrorOverlay(sourceUrl);
        if (window.App && typeof App.showToast === "function") {
          const currentIdx = typeof this.currentServerIndex === "number" ? this.currentServerIndex : 0;
          const isServer2 = (currentIdx === 1);
          const msg = isServer2
            ? "⚠️ කිසිදු Server එකක් වැඩ නොකරන්නේ නම්, Video එක Download කර නරඹන්න (If none of the servers are working, Download the video and watch it)"
            : "⚠️ Server 1 වැඩ නොකරන්නේ නම් Server 2 වෙත මාරු වන්න (If Server 1 does not work, switch to Server 2)";
          App.showToast(msg, "warning");
        }
      }
    };
    this.videoElement.load();

    this.videoElement.onloadedmetadata = () => {
      if (resumeTime > 0) {
        this.videoElement.currentTime = resumeTime;
        App.showToast(`Resumed from ${this.formatTime(resumeTime)} (නතර කළ තැනින් නැවත ආරම්භ විය)`, "info");
      } else if (prevTime > 0) {
        this.videoElement.currentTime = prevTime;
      }
      this.videoElement.play().catch(e => {
        console.log("Autoplay prevented:", e);
      });
    };
  }

  togglePlay() {
    if (!this.videoElement) return;
    if (this.videoElement.paused || this.videoElement.ended) {
      this.videoElement.play().catch(err => console.log(err));
    } else {
      this.videoElement.pause();
    }
  }

  updatePlayState(isPlaying) {
    if (this.playIcon) this.playIcon.style.display = isPlaying ? "none" : "block";
    if (this.pauseIcon) this.pauseIcon.style.display = isPlaying ? "block" : "none";
  }

  skip(seconds) {
    if (!this.videoElement) return;
    this.videoElement.currentTime = Math.max(0, Math.min(this.videoElement.duration || 0, this.videoElement.currentTime + seconds));
  }

  seek(event) {
    if (!this.videoElement || !this.progressBar) return;
    const rect = this.progressBar.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    this.videoElement.currentTime = pos * this.videoElement.duration;
  }

  handleProgressHover(event) {
    if (!this.videoElement || !this.progressBar || !this.progressHover || !this.hoverTimeDisplay) return;
    const rect = this.progressBar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const hoverTime = pos * (this.videoElement.duration || 0);

    this.progressHover.style.opacity = "1";
    this.progressHover.style.left = `${pos * 100}%`;
    this.hoverTimeDisplay.textContent = this.formatTime(hoverTime);
  }

  handleTimeUpdate() {
    if (!this.videoElement || !this.progressCurrent || !this.timeDisplay) return;
    const cur = this.videoElement.currentTime;
    const dur = this.videoElement.duration || 0;
    const percent = dur > 0 ? (cur / dur) * 100 : 0;

    this.progressCurrent.style.width = `${percent}%`;
    this.timeDisplay.textContent = `${this.formatTime(cur)} / ${this.formatTime(dur)}`;
  }

  handleBufferUpdate() {
    if (!this.videoElement || !this.progressBuffered) return;
    if (this.videoElement.buffered.length > 0) {
      const bufferedEnd = this.videoElement.buffered.end(this.videoElement.buffered.length - 1);
      const duration = this.videoElement.duration || 0;
      if (duration > 0) {
        this.progressBuffered.style.width = `${(bufferedEnd / duration) * 100}%`;
      }
    }
  }

  handleEnded() {
    if (this.autoplayNext && this.currentContent && this.currentContent.type === "series") {
      if (this.currentEpisodeIndex < this.currentContent.episodes.length - 1) {
        App.showToast("Playing next episode...", "info");
        setTimeout(() => {
          this.playNextEpisode();
        }, 1500);
      }
    }
  }

  handleMetadataLoaded() {
    this.handleTimeUpdate();
  }

  playNextEpisode() {
    if (!this.currentContent || this.currentContent.type !== "series") return;
    if (this.currentEpisodeIndex < this.currentContent.episodes.length - 1) {
      this.currentEpisodeIndex++;
      this.currentServerIndex = 0;
      this.renderHeaderInfo();
      this.renderServers();
      this.renderEpisodeList();
      this.loadSource();
    }
  }

  playPreviousEpisode() {
    if (!this.currentContent || this.currentContent.type !== "series") return;
    if (this.currentEpisodeIndex > 0) {
      this.currentEpisodeIndex--;
      this.currentServerIndex = 0;
      this.renderHeaderInfo();
      this.renderServers();
      this.renderEpisodeList();
      this.loadSource();
    }
  }

  toggleMute() {
    if (!this.videoElement) return;
    this.videoElement.muted = !this.videoElement.muted;
    this.updateVolumeIcon();
  }

  updateVolumeIcon() {
    const icon = document.getElementById("volumeIcon");
    if (!icon) return;
    if (this.videoElement.muted || this.videoElement.volume === 0) {
      icon.innerHTML = `<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/>`;
    } else {
      icon.innerHTML = `<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>`;
    }
  }

  toggleTheaterMode() {
    this.isTheaterMode = !this.isTheaterMode;
    if (this.videoWrapper) {
      this.videoWrapper.classList.toggle("theater-active", this.isTheaterMode);
    }
    if (this.btnTheater) {
      this.btnTheater.classList.toggle("active", this.isTheaterMode);
    }
    App.showToast(this.isTheaterMode ? "Theater Mode Enabled (සිනමා මාදිලිය)" : "Standard Mode (සාමාන්‍ය මාදිලිය)", "info");
  }

  async togglePiP() {
    if (!this.videoElement) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await this.videoElement.requestPictureInPicture();
      }
    } catch (err) {
      console.warn("PiP error:", err);
      App.showToast("Picture-in-Picture not supported by browser", "error");
    }
  }

  toggleFullscreen() {
    if (!this.videoWrapper) return;
    if (!document.fullscreenElement) {
      if (this.videoWrapper.requestFullscreen) {
        this.videoWrapper.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;

    if (hrs > 0) {
      return `${hrs}:${remMins < 10 ? "0" : ""}${remMins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }
}
