/**
 * Sinhala Dubbed Cartoons - Download Center Module
 * Main: English | Sub: Sinhala (සිංහල)
 */

class DownloadHubController {
  constructor() {
    this.currentContent = null;
    this.selectedEpisodeIndex = 0;
    this.selectedQuality = "1080p FHD";

    this.initDOMElements();
    this.bindEvents();
  }

  initDOMElements() {
    this.modal = document.getElementById("downloadModal");
    this.title = document.getElementById("downloadModalTitle");
    this.subtitle = document.getElementById("downloadModalSubTitle");
    this.poster = document.getElementById("downloadPosterImg");
    this.audioBadge = document.getElementById("downloadAudioBadge");
    this.qualityBadge = document.getElementById("downloadQualityBadge");
    this.qualitySelectorContainer = document.getElementById("downloadQualityGrid");
    this.episodeSelectorContainer = document.getElementById("downloadEpisodeSelectorWrapper");
    this.episodeSelect = document.getElementById("downloadEpisodeSelect");
    this.mirrorsContainer = document.getElementById("downloadMirrorsList");
    this.btnClose = document.getElementById("btnCloseDownloadModal");
  }

  bindEvents() {
    this.btnClose?.addEventListener("click", () => this.close());
    this.episodeSelect?.addEventListener("change", (e) => {
      this.selectedEpisodeIndex = parseInt(e.target.value, 10);
      this.renderMirrors();
    });
  }

  open(content, episodeIndex = 0) {
    this.currentContent = content;
    this.selectedEpisodeIndex = episodeIndex;
    if (!this.modal) return;

    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";

    this.renderHeader();
    this.renderQualities();
    this.renderEpisodeSelector();
    this.renderMirrors();
  }

  close() {
    if (this.modal) this.modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  renderHeader() {
    if (!this.currentContent) return;

    if (this.title) this.title.textContent = `${this.currentContent.titleEnglish} - Download Center`;
    if (this.subtitle) this.subtitle.textContent = `${this.currentContent.titleSinhala} • Year ${this.currentContent.year}`;
    if (this.poster) this.poster.src = this.currentContent.poster || "assets/images/banner1.jpg";
    if (this.audioBadge) this.audioBadge.textContent = this.currentContent.audio || "Sinhala Dubbed Audio";
    if (this.qualityBadge) this.qualityBadge.textContent = "1080p FHD / 720p HD / 480p SD";
  }

  renderQualities() {
    if (!this.qualitySelectorContainer) return;
    this.qualitySelectorContainer.innerHTML = "";

    const qualities = this.currentContent.downloadQualities || [
      { quality: "1080p FHD", size: "1.2 GB", ext: "MP4", bitRate: "2800 kbps", speed: "Ultra HD" },
      { quality: "720p HD", size: "650 MB", ext: "MP4", bitRate: "1500 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "320 MB", ext: "MP4", bitRate: "800 kbps", speed: "Data Saver" }
    ];

    qualities.forEach((q, idx) => {
      const card = document.createElement("div");
      card.className = `quality-card ${idx === 0 ? "active" : ""}`;
      card.innerHTML = `
        <div class="quality-header">
          <span class="q-name">${q.quality}</span>
          <span class="q-badge">${q.speed}</span>
        </div>
        <div class="quality-meta">
          <span class="q-size">💾 ${q.size}</span>
          <span class="q-fmt">${q.ext}</span>
        </div>
      `;
      card.addEventListener("click", () => {
        document.querySelectorAll(".quality-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        this.selectedQuality = q.quality;
        this.renderMirrors();
        App.showToast(`Selected Quality: ${q.quality}`, "info");
      });
      this.qualitySelectorContainer.appendChild(card);
    });
  }

  renderEpisodeSelector() {
    if (!this.episodeSelectorContainer || !this.episodeSelect) return;

    if (this.currentContent.type === "series" && this.currentContent.episodes && this.currentContent.episodes.length > 0) {
      this.episodeSelectorContainer.style.display = "block";
      this.episodeSelect.innerHTML = "";

      this.currentContent.episodes.forEach((ep, idx) => {
        const option = document.createElement("option");
        option.value = idx;
        option.selected = idx === this.selectedEpisodeIndex;
        option.textContent = `Episode ${ep.epNumber}: ${ep.titleEnglish} (${ep.titleSinhala})`;
        this.episodeSelect.appendChild(option);
      });
    } else {
      this.episodeSelectorContainer.style.display = "none";
    }
  }

  renderMirrors() {
    if (!this.mirrorsContainer) return;
    this.mirrorsContainer.innerHTML = "";

    let downloadUrls = {};
    if (this.currentContent.type === "series" && this.currentContent.episodes && this.currentContent.episodes[this.selectedEpisodeIndex]) {
      downloadUrls = this.currentContent.episodes[this.selectedEpisodeIndex].downloads || {};
    } else {
      downloadUrls = this.currentContent.downloads || {};
    }

    const mirrors = [
      {
        id: "direct",
        name: "Direct High-Speed Server (Fast Direct Stream/MP4)",
        icon: "⚡",
        type: "Direct",
        speed: "100 MB/s Super Fast",
        action: () => this.triggerDirectDownload(downloadUrls.fhd || downloadUrls.hd || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
      },
      {
        id: "gdrive",
        name: "Google Drive Cloud Mirror (ගූගල් ඩ්‍රයිව් අධිවේගී සබැඳිය)",
        icon: "☁️",
        type: "G-Drive",
        speed: "Direct Cloud Link",
        action: () => window.open(downloadUrls.gdrive || "https://drive.google.com", "_blank")
      }
    ];

    mirrors.forEach(mirror => {
      const item = document.createElement("div");
      item.className = "mirror-item";
      item.innerHTML = `
        <div class="mirror-left">
          <span class="mirror-icon">${mirror.icon}</span>
          <div class="mirror-details">
            <h4 class="mirror-name">${mirror.name}</h4>
            <span class="mirror-speed">${mirror.speed}</span>
          </div>
        </div>
        <button class="btn btn-primary btn-sm mirror-btn">
          <span>Download Now <small style="font-weight:normal; opacity:0.85;">(බාගත)</small></span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
        </button>
      `;

      const btn = item.querySelector(".mirror-btn");
      btn.addEventListener("click", () => mirror.action());
      this.mirrorsContainer.appendChild(item);
    });
  }

  triggerDirectDownload(fileUrl) {
    App.showToast("Download started! (බාගත කිරීම ආරම්භ විය...)", "success");

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${(this.currentContent.titleEnglish || "sinhala_dub").replace(/[^a-zA-Z0-9]/g, "_")}_${this.selectedQuality}.mp4`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showDownloadProgressBar();
  }

  showDownloadProgressBar() {
    const notifyContainer = document.getElementById("toastContainer");
    if (!notifyContainer) return;

    const barEl = document.createElement("div");
    barEl.className = "download-progress-toast";
    barEl.innerHTML = `
      <div class="dl-toast-header">
        <span>⚡ Downloading: ${this.currentContent.titleEnglish}</span>
        <span class="dl-toast-percent">0%</span>
      </div>
      <div class="dl-toast-bar"><div class="dl-toast-fill" style="width: 0%"></div></div>
      <div class="dl-toast-footer">Speed: 14.8 MB/s • Remaining: 12s</div>
    `;
    notifyContainer.appendChild(barEl);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 12;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        barEl.querySelector(".dl-toast-percent").textContent = "100% (Complete)";
        barEl.querySelector(".dl-toast-fill").style.width = "100%";
        barEl.querySelector(".dl-toast-footer").textContent = "File downloaded successfully! ✅ (සාර්ථකව බාගත විය)";
        setTimeout(() => {
          barEl.classList.add("fade-out");
          setTimeout(() => barEl.remove(), 500);
        }, 3000);
      } else {
        barEl.querySelector(".dl-toast-percent").textContent = `${progress}%`;
        barEl.querySelector(".dl-toast-fill").style.width = `${progress}%`;
      }
    }, 280);
  }
}
