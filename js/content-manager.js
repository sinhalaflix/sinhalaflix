/**
 * SinhalaFlix Hub — Content Manager Module
 * Handles the "Add New Content" modal form.
 * - No audio spec field
 * - Channel only for teledramas / kdramas
 * - Image file-upload (base64) for poster & backdrop
 * - 2 stream mirrors + 2 download mirrors per episode
 * - Monetag ad links stored & triggered on watch/download
 */

/* ─── Categories that DO show the TV-channel field ─── */
const CHANNEL_CATEGORIES = new Set(["teledramas", "kdramas"]);

class ContentManager {
  constructor() {
    this.modal              = document.getElementById("addContentModal");
    this.form               = document.getElementById("addContentForm");
    this.episodesContainer  = document.getElementById("customEpisodesList");
    this.btnAddEpisode      = document.getElementById("btnAddEpisodeRow");
    this.btnClose           = document.getElementById("btnCloseAddContentModal");
    this.typeSelect         = document.getElementById("addContentType");
    this.categorySelect     = document.getElementById("addCategory");
    this.seriesFields       = document.getElementById("seriesExtraFields");
    this.movieFields        = document.getElementById("movieExtraFields");
    this.channelWrapper     = document.getElementById("channelFieldWrapper");

    this._bindEvents();
    this._initImageUploads();
  }

  /* ─────────────────────────────────────────
     EVENTS
     ───────────────────────────────────────── */
  _bindEvents() {
    this.btnClose?.addEventListener("click", () => this.close());
    this.btnAddEpisode?.addEventListener("click", () => this.addEpisodeRow());

    // Type change → show/hide series or movie fields
    this.typeSelect?.addEventListener("change", () => this._updateTypeVisibility());

    // Category change → show/hide channel field
    this.categorySelect?.addEventListener("change", () => this._updateChannelVisibility());

    this.form?.addEventListener("submit", (e) => this._handleSubmit(e));

    // Initial state
    this._updateTypeVisibility();
    this._updateChannelVisibility();
  }

  _updateTypeVisibility() {
    const isSeries = this.typeSelect?.value === "series";
    if (this.seriesFields) this.seriesFields.style.display = isSeries ? "block" : "none";
    if (this.movieFields)  this.movieFields.style.display  = isSeries ? "none"  : "block";
  }

  _updateChannelVisibility() {
    const cat = this.categorySelect?.value || "";
    const show = CHANNEL_CATEGORIES.has(cat);
    if (this.channelWrapper) this.channelWrapper.style.display = show ? "" : "none";
  }

  /* ─────────────────────────────────────────
     IMAGE UPLOAD → base64 hidden fields
     ───────────────────────────────────────── */
  _initImageUploads() {
    this._bindFileInput("addPosterFile",   "addPoster");
    this._bindFileInput("addBackdropFile", "addBackdrop");
  }

  _bindFileInput(fileInputId, hiddenId) {
    const fileInput   = document.getElementById(fileInputId);
    const hiddenInput = document.getElementById(hiddenId);
    if (!fileInput || !hiddenInput) return;

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      if (!file.type || !file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => { hiddenInput.value = e.target.result; };
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let w = img.naturalWidth || img.width;
          let h = img.naturalHeight || img.height;
          const limit = 640;
          if (w > limit || h > limit) {
            if (w > h) {
              h = Math.round((h * limit) / w);
              w = limit;
            } else {
              w = Math.round((w * limit) / h);
              h = limit;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          try {
            hiddenInput.value = canvas.toDataURL("image/jpeg", 0.75);
          } catch (err) {
            hiddenInput.value = e.target.result;
          }
        };
        img.onerror = () => { hiddenInput.value = e.target.result; };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ─────────────────────────────────────────
     OPEN / CLOSE
     ───────────────────────────────────────── */
  open() {
    if (!this.modal) return;
    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";
    if (this.episodesContainer && this.episodesContainer.children.length === 0) {
      this.addEpisodeRow();
    }
    this._updateTypeVisibility();
    this._updateChannelVisibility();
  }

  close() {
    this.modal?.classList.remove("active");
    document.body.style.overflow = "";
  }

  /* ─────────────────────────────────────────
     EPISODE ROW  (2 stream + 2 download)
     ───────────────────────────────────────── */
  addEpisodeRow() {
    if (!this.episodesContainer) return;
    const count = this.episodesContainer.children.length + 1;
    const row = document.createElement("div");
    row.className = "custom-ep-row";
    row.innerHTML = `
      <div class="ep-row-header">
        <strong class="ep-header-title">Episode ${count}  (${count} වන කොටස)</strong>
        <button type="button" class="btn-remove-ep" onclick="this.parentElement.parentElement.remove()">✕ Remove</button>
      </div>

      <div class="form-row" style="display:grid;grid-template-columns:110px 1fr 1fr;gap:0.75rem;">
        <div class="form-group">
          <label>Episode #</label>
          <input type="number" class="input-ep-num" value="${count}" min="1" oninput="var h=this.closest('.custom-ep-row').querySelector('.ep-header-title');if(h)h.textContent='Episode '+this.value+' ('+this.value+' වන කොටස)';" />
        </div>
        <div class="form-group">
          <label>Title — English</label>
          <input type="text" class="input-ep-title-en" placeholder="Episode ${count} Title" value="Episode ${count}" required />
        </div>
        <div class="form-group">
          <label>Title — Sinhala</label>
          <input type="text" class="input-ep-title-si" placeholder="${count} වන කොටස" value="${count} වන කොටස" />
        </div>
      </div>

      <div style="font-size:0.8rem;font-weight:700;color:var(--accent-gold);margin:0.5rem 0 0.25rem;">
        ▶ Watch Online Mirrors
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Watch — Server 1 (Google Drive)</label>
          <input type="url" class="input-ep-stream-gdrive" placeholder="https://drive.google.com/..." />
        </div>
        <div class="form-group">
          <label>Watch — Server 2 (Stream / Embed)</label>
          <input type="url" class="input-ep-stream-buzz" placeholder="https://... (Direct Stream / Embed URL)" />
        </div>
      </div>

      <div style="font-size:0.8rem;font-weight:700;color:var(--accent-emerald);margin:0.5rem 0 0.25rem;">
        ⬇ Download Mirrors
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Download — Server 1 (Google Drive)</label>
          <input type="url" class="input-ep-dl-gdrive" placeholder="https://drive.google.com/..." />
        </div>
        <div class="form-group">
          <label>Download — Server 2 (Cloud Mirror)</label>
          <input type="url" class="input-ep-dl-buzz" placeholder="https://... (Direct / Mirror Download URL)" />
        </div>
      </div>
    `;
    this.episodesContainer.appendChild(row);
  }

  /* ─────────────────────────────────────────
     FORM SUBMIT
     ───────────────────────────────────────── */

  _handleSubmit(e) {
    e.preventDefault();

    const titleEn   = document.getElementById("addTitleEn")?.value.trim()  || "";
    const titleSi   = document.getElementById("addTitleSi")?.value.trim()  || titleEn;
    const type      = this.typeSelect?.value         || "series";
    const category  = this.categorySelect?.value     || "cartoons";
    const year      = parseInt(document.getElementById("addYear")?.value,   10) || new Date().getFullYear();
    const rating    = parseFloat(document.getElementById("addRating")?.value)   || 9.5;
    const poster    = document.getElementById("addPoster")?.value    || "assets/images/banner1.jpg";
    const backdrop  = document.getElementById("addBackdrop")?.value  || poster;
    const synopsisEn = document.getElementById("addSynopsisEn")?.value.trim() || "";

    // Channel — only meaningful for teledramas / kdramas
    const channel = CHANNEL_CATEGORIES.has(category)
      ? (document.getElementById("addChannel")?.value || "")
      : "";

    const id = "custom-" + Date.now();

    const newItem = {
      id,
      titleEnglish:     titleEn,
      titleSinhala:     titleSi,
      singlishKeywords: [titleEn.toLowerCase(), titleSi.toLowerCase()],
      type,
      category,
      channel,
      year,
      rating,
      audio:            "Sinhala Dubbed",
      poster,
      backdrop,
      badge:            "User Added",
      badgeColor:       "cyan",
      director:         "—",
      dubTeam:          channel || "Sinhala Dubbed",
      synopsisEnglish:  synopsisEn,
      synopsisSinhala:  synopsisEn,
      tags:             [category, "Sinhala Dubbed"],
      isFeatured:       false,
      trending:         true,
      createdAt:        Date.now(),
      isNew:            true
    };

    if (type === "series") {
      const epRows   = this.episodesContainer.querySelectorAll(".custom-ep-row");
      const episodes = [];

      epRows.forEach((row, idx) => {
        const epTitleEn   = row.querySelector(".input-ep-title-en")?.value    || `Episode ${idx + 1}`;
        const epTitleSi   = row.querySelector(".input-ep-title-si")?.value    || `${idx + 1} වන කොටස`;
        const streamGd    = row.querySelector(".input-ep-stream-gdrive")?.value.trim() || "";
        const streamBuzz  = row.querySelector(".input-ep-stream-buzz")?.value.trim()   || "";
        const dlGdrive    = row.querySelector(".input-ep-dl-gdrive")?.value.trim()     || "";
        const dlBuzz      = row.querySelector(".input-ep-dl-buzz")?.value.trim()       || "";

        // Build stream sources (only include non-empty)
        let sBuzzFinal = streamBuzz;
        if (sBuzzFinal && (sBuzzFinal.includes("buzzheavier.com") || sBuzzFinal.includes("bzzhr.to")) && !sBuzzFinal.includes("ts.buzzheavier.com")) {
          if (dlBuzz && (dlBuzz.includes("ts.buzzheavier.com") || dlBuzz.includes("/d/"))) {
            sBuzzFinal = dlBuzz;
          }
        }

        const streamSources = [];
        if (streamGd)    streamSources.push({ server: "Server 1", url: streamGd });
        if (sBuzzFinal)  streamSources.push({ server: "Server 2", url: sBuzzFinal });
        if (!streamSources.length) streamSources.push({ server: "Server 1", url: "" });

        const epNumIn = row.querySelector(".input-ep-num");
        let epNumVal = epNumIn ? parseInt(epNumIn.value, 10) : (idx + 1);
        if (isNaN(epNumVal) || epNumVal <= 0) epNumVal = idx + 1;

        episodes.push({
          epNumber:    epNumVal,
          titleEnglish: epTitleEn || `Episode ${epNumVal}`,
          titleSinhala: epTitleSi || `${epNumVal} වන කොටස`,
          duration:    "",
          thumbnail:   backdrop || poster,
          streamSources,
          downloads: {
            gdrive:  dlGdrive,
            buzz:    dlBuzz,
          },
        });
      });

      // If series has no episode rows, supply default Episode 1
      if (episodes.length === 0) {
        episodes.push({
          epNumber: 1,
          titleEnglish: "Episode 1",
          titleSinhala: "01 වන කොටස",
          duration: "",
          thumbnail: backdrop || poster,
          streamSources: [{ server: "Server 1", url: "" }],
          downloads: { gdrive: "", buzz: "" }
        });
      }

      newItem.episodes      = episodes;
      newItem.episodesCount = episodes.length;

    } else {
      // Movie
      const streamGd    = document.getElementById("addMovieStreamGdrive")?.value.trim() || "";
      const streamBuzz  = document.getElementById("addMovieStreamBuzz")?.value.trim()   || "";
      const dlGdrive    = document.getElementById("addMovieDlGdrive")?.value.trim()     || "";
      const dlBuzz      = document.getElementById("addMovieDlBuzz")?.value.trim()       || "";

      let sBuzzFinal = streamBuzz;
      if (sBuzzFinal && (sBuzzFinal.includes("buzzheavier.com") || sBuzzFinal.includes("bzzhr.to")) && !sBuzzFinal.includes("ts.buzzheavier.com")) {
        if (dlBuzz && (dlBuzz.includes("ts.buzzheavier.com") || dlBuzz.includes("/d/"))) {
          sBuzzFinal = dlBuzz;
        }
      }

      const streamSources = [];
      if (streamGd)    streamSources.push({ server: "Server 1", url: streamGd });
      if (sBuzzFinal)  streamSources.push({ server: "Server 2", url: sBuzzFinal });
      if (!streamSources.length) streamSources.push({ server: "Server 1", url: "" });

      newItem.duration      = "";
      newItem.streamSources = streamSources;
      newItem.downloads     = { gdrive: dlGdrive, buzz: dlBuzz };

      // Single-movie wrapped in episodes array for movie.html compatibility
      newItem.episodes = [{
        epNumber:     1,
        titleEnglish: titleEn,
        titleSinhala: titleSi,
        thumbnail:    backdrop || poster,
        streamSources,
        downloads:    { gdrive: dlGdrive, buzz: dlBuzz },
      }];
    }

    const saved = StorageService.saveCustomContent(newItem);

    if (!saved) {
      if (window.App?.showToast) {
        App.showToast("Storage quota exceeded! Try using smaller images.", "error");
      }
      return;
    }

    if (window.App?.showToast) {
      App.showToast(`"${titleEn}" saved successfully! ✅`, "success");
    }

    this.close();
    this.form.reset();
    // Reset hidden image fields to default
    document.getElementById("addPoster").value   = "assets/images/banner1.jpg";
    document.getElementById("addBackdrop").value = "assets/images/banner1.jpg";

    if (window.App) {
      if (typeof window.App.refreshCatalog === "function") window.App.refreshCatalog();
      if (typeof window.App.renderCatalog  === "function") window.App.renderCatalog();
    }
  }
}
