/**
 * SinhalaFlix - Admin Portal Controller
 * Full CRUD, Authentication, Viewer Requests, and Database Management
 */

class AdminController {
  constructor() {
    this.currentTab = "dashboard";
    this.catalog = [];
    this.searchQuery = "";
    this.categoryFilter = "all";
    this.editingItemId = null;

    this.initDOM();
    this.bindEvents();
    this.checkAuth();
  }

  initDOM() {
    this.loginWrapper = document.getElementById("adminLoginWrapper");
    this.dashboardWrapper = document.getElementById("adminDashboardWrapper");
    this.loginForm = document.getElementById("adminLoginForm");
    this.loginSubmitBtn = document.getElementById("btnAdminLoginSubmit");
    this.loginErrorMsg = document.getElementById("loginErrorMessage");
    this.navTabs = document.querySelectorAll(".admin-tab-btn");
    this.sections = document.querySelectorAll(".admin-section");

    // Catalog table elements
    this.catalogTableBody = document.getElementById("adminCatalogTableBody");
    this.catalogSearchInput = document.getElementById("tableSearchInput");
    this.catalogCategoryFilter = document.getElementById("tableCategoryFilter");

    // Add Content Form
    this.addForm = document.getElementById("adminAddMediaForm");
    this.addTypeSelect = document.getElementById("newMediaType");
    this.addSeriesFields = document.getElementById("adminSeriesFields");
    this.addEpisodesContainer = document.getElementById("adminEpisodesList");
    this.btnAddEpisode = document.getElementById("btnAdminAddEpisode");

    // Edit Modal
    this.editModal = document.getElementById("adminEditModal");
    this.editForm = document.getElementById("adminEditMediaForm");
    this.btnCloseEditModal = document.getElementById("btnCloseEditModal");

    // Requests Grid
    this.requestsGrid = document.getElementById("adminRequestsGrid");
  }

  bindEvents() {
    // Login submit
    this.loginForm?.addEventListener("submit", (e) => this.handleLogin(e));
    this.loginSubmitBtn?.addEventListener("click", (e) => {
      if (this.loginForm && !this.loginForm.checkValidity()) {
        this.loginForm.reportValidity();
      } else {
        this.handleLogin(e);
      }
    });

    // Logout
    document.getElementById("btnAdminLogout")?.addEventListener("click", () => this.handleLogout());

    // Tab switching
    this.navTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;
        this.switchTab(target);
      });
    });

    // Catalog filtering
    this.catalogSearchInput?.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.renderCatalogTable();
    });

    this.catalogCategoryFilter?.addEventListener("change", (e) => {
      this.categoryFilter = e.target.value;
      this.renderCatalogTable();
    });

    // Content Type change in Add Form
    this.addTypeSelect?.addEventListener("change", (e) => {
      if (this.addSeriesFields) {
        this.addSeriesFields.style.display = e.target.value === "series" ? "block" : "none";
      }
    });

    // Add Episode row
    this.btnAddEpisode?.addEventListener("click", () => this.addEpisodeRow(this.addEpisodesContainer));

    // Add Media submit
    this.addForm?.addEventListener("submit", (e) => this.handleAddMedia(e));

    // Edit Modal close
    this.btnCloseEditModal?.addEventListener("click", () => this.closeEditModal());
    this.editForm?.addEventListener("submit", (e) => this.handleSaveEdit(e));

    // Database Actions
    document.getElementById("btnExportJson")?.addEventListener("click", () => this.exportDatabaseJson());
    document.getElementById("btnImportJson")?.addEventListener("click", () => document.getElementById("importJsonInput")?.click());
    document.getElementById("importJsonInput")?.addEventListener("change", (e) => this.importDatabaseJson(e));
    document.getElementById("btnResetDefaults")?.addEventListener("click", () => this.resetDefaults());
  }

  checkAuth() {
    if (StorageService.isAdminLoggedIn()) {
      this.showDashboard();
    } else {
      this.showLogin();
    }
  }

  showLogin() {
    if (this.loginWrapper) this.loginWrapper.style.display = "flex";
    if (this.dashboardWrapper) this.dashboardWrapper.style.display = "none";
  }

  showDashboard() {
    if (this.loginWrapper) this.loginWrapper.style.display = "none";
    if (this.dashboardWrapper) this.dashboardWrapper.style.display = "flex";
    
    try {
      this.refreshCatalog();
      this.renderDashboardStats();
      this.renderCatalogTable();
      this.renderRequests();
    } catch (err) {
      console.error("Dashboard render error:", err);
    }
  }

  fillAndLogin(user, pass1, pass2) {
    const userIn = document.getElementById("adminUsername");
    const passIn = document.getElementById("adminPassword");
    const pass2In = document.getElementById("adminPassword2");
    if (userIn) userIn.value = user;
    if (passIn) passIn.value = pass1;
    if (pass2In && pass2) pass2In.value = pass2;
    this.handleLogin();
  }

  handleLogin(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const user = document.getElementById("adminUsername")?.value || "";
    const pass = document.getElementById("adminPassword")?.value || "";
    const pass2 = document.getElementById("adminPassword2")?.value || "";
    const remember = document.getElementById("rememberAdmin")?.checked || false;

    const result = StorageService.adminLogin(user, pass, pass2, remember);
    if (result.success) {
      if (this.loginErrorMsg) this.loginErrorMsg.style.display = "none";
      this.showDashboard();
      this.showToast("Welcome back, Administrator! 👑", "success");
    } else {
      if (this.loginErrorMsg) {
        this.loginErrorMsg.textContent = result.message;
        this.loginErrorMsg.style.display = "block";
      } else {
        alert(result.message);
      }
    }
  }

  handleLogout() {
    if (confirm("Are you sure you want to log out of the Admin Portal?")) {
      StorageService.adminLogout();
      this.showLogin();
      this.showToast("Logged out successfully.", "info");
    }
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    this.navTabs.forEach(t => t.classList.toggle("active", t.dataset.tab === tabId));
    this.sections.forEach(s => s.classList.toggle("active", s.id === `section-${tabId}`));

    if (tabId === "dashboard") {
      this.renderDashboardStats();
    } else if (tabId === "catalog") {
      this.renderCatalogTable();
    } else if (tabId === "requests") {
      this.renderRequests();
    }
  }

  refreshCatalog() {
    this.catalog = StorageService.getFullCatalog();
  }

  // =========================================================================
  // METRICS / STATS
  // =========================================================================
  renderDashboardStats() {
    this.refreshCatalog();
    const totalTitles = this.catalog.length;
    let totalEpisodes = 0;
    let cartoonsCount = 0;
    let moviesCount = 0;
    let teledramasCount = 0;
    let kdramasCount = 0;
    let seriesCount = 0;

    this.catalog.forEach(item => {
      if (item.type === "series") {
        totalEpisodes += (item.episodes?.length || item.episodesCount || 1);
      } else {
        totalEpisodes += 1;
      }

      if (item.category === "cartoons") cartoonsCount++;
      else if (item.category === "movies") moviesCount++;
      else if (item.category === "teledramas") teledramasCount++;
      else if (item.category === "kdramas") kdramasCount++;
      else if (item.category === "cartoon_series") seriesCount++;
    });

    const requests = StorageService.getRequests();
    const pendingReqCount = requests.filter(r => r.status === "pending").length;

    // Update DOM safely
    const el = (id) => document.getElementById(id);
    if (el("statTotalTitles")) el("statTotalTitles").textContent = totalTitles;
    if (el("statTotalEpisodes")) el("statTotalEpisodes").textContent = totalEpisodes;
    if (el("statCartoons")) el("statCartoons").textContent = cartoonsCount;
    if (el("statMovies")) el("statMovies").textContent = moviesCount;
    if (el("statTeledramas")) el("statTeledramas").textContent = teledramasCount;
    if (el("statKdramas")) el("statKdramas").textContent = kdramasCount;
    if (el("statSeries")) el("statSeries").textContent = seriesCount;
    if (el("statPendingRequests")) el("statPendingRequests").textContent = pendingReqCount;
  }

  // =========================================================================
  // CATALOG TABLE
  // =========================================================================
  renderCatalogTable() {
    this.refreshCatalog();
    if (!this.catalogTableBody) return;

    let list = [...this.catalog];

    // Filter by Category
    if (this.categoryFilter !== "all") {
      list = list.filter(item => item.category === this.categoryFilter);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      const q = this.searchQuery;
      list = list.filter(item => 
        (item.titleEnglish && item.titleEnglish.toLowerCase().includes(q)) ||
        (item.titleSinhala && item.titleSinhala.toLowerCase().includes(q)) ||
        (item.channel && item.channel.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      this.catalogTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: var(--admin-text-secondary);">
            No media found matching criteria.
          </td>
        </tr>
      `;
      return;
    }

    const catBadgeMap = {
      cartoons: { label: "🦁 Cartoon", class: "cat-cartoons" },
      movies: { label: "🎬 Movie", class: "cat-movies" },
      teledramas: { label: "📺 Teledrama", class: "cat-teledramas" },
      kdramas: { label: "🌸 K-Drama", class: "cat-kdramas" },
      cartoon_series: { label: "⚡ Series", class: "cat-cartoon_series" }
    };

    this.catalogTableBody.innerHTML = "";
    list.forEach((item, index) => {
      const catInfo = catBadgeMap[item.category] || { label: item.category, class: "cat-cartoons" };
      const epCount = item.type === "series" ? `${item.episodes?.length || item.episodesCount || 1} Ep` : "1 Movie";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="color: var(--admin-text-muted); font-size: 0.8rem;">#${index + 1}</td>
        <td>
          <div class="table-item-cell">
            <img src="${item.poster}" alt="${item.titleEnglish}" class="table-poster-thumb" onerror="this.src='assets/images/banner1.jpg'" />
            <div>
              <div class="table-title-main">${item.titleEnglish}</div>
              <div class="table-title-sub">${item.titleSinhala}</div>
            </div>
          </div>
        </td>
        <td><span class="badge-cat-tag ${catInfo.class}">${catInfo.label}</span></td>
        <td><span style="font-weight: 600; color: #38bdf8;">${item.channel}</span></td>
        <td>⭐ ${item.rating} / 10</td>
        <td>${epCount} (${item.year})</td>
        <td>
          <div class="table-actions-cell">
            <button class="btn-action-icon btn-edit" title="Edit Media" onclick="Admin.openEditModal('${item.id}')">✏️</button>
            <button class="btn-action-icon btn-delete" title="Delete Media" onclick="Admin.confirmDelete('${item.id}', '${item.titleEnglish.replace(/'/g, "\\'")}')">🗑️</button>
          </div>
        </td>
      `;
      this.catalogTableBody.appendChild(tr);
    });
  }

  // =========================================================================
  // ADD MEDIA
  // =========================================================================
  addEpisodeRow(container, epData = null) {
    if (!container) return;
    const count = container.children.length + 1;
    const row = document.createElement("div");
    row.className = "ep-item-card";
    row.innerHTML = `
      <div class="ep-header-row">
        <span>Episode ${count}</span>
        <button type="button" class="btn-admin-danger btn-xs" onclick="this.parentElement.parentElement.remove()" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">✕ Remove</button>
      </div>
      <div class="form-grid-2">
        <div class="form-group">
          <label>Title in English</label>
          <input type="text" class="admin-input ep-title-en" placeholder="Episode ${count} - Title" value="${epData?.titleEnglish || `Episode ${count}`}" required />
        </div>
        <div class="form-group">
          <label>Title in Sinhala</label>
          <input type="text" class="admin-input ep-title-si" placeholder="${count} වන කොටස" value="${epData?.titleSinhala || `${count} වන කොටස`}" />
        </div>
      </div>
      <div class="form-grid-2">
        <div class="form-group">
          <label>Stream Video URL (MP4 / WebM)</label>
          <input type="url" class="admin-input ep-stream-url" placeholder="https://..." value="${epData?.streamSources?.[0]?.url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}" required />
        </div>
        <div class="form-group">
          <label>Direct Download Mirror URL</label>
          <input type="url" class="admin-input ep-dl-url" placeholder="https://..." value="${epData?.downloads?.fhd || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}" />
        </div>
      </div>
    `;
    container.appendChild(row);
  }

  handleAddMedia(e) {
    e.preventDefault();
    const titleEn = document.getElementById("newTitleEn")?.value.trim();
    const titleSi = document.getElementById("newTitleSi")?.value.trim() || titleEn;
    const category = document.getElementById("newCategory")?.value;
    const channel = document.getElementById("newChannel")?.value;
    const type = document.getElementById("newMediaType")?.value;
    const year = parseInt(document.getElementById("newYear")?.value, 10) || new Date().getFullYear();
    const rating = parseFloat(document.getElementById("newRating")?.value) || 9.5;
    const audio = document.getElementById("newAudio")?.value || "Sinhala Dubbed Stereo 2.0";
    const poster = document.getElementById("newPoster")?.value.trim() || "assets/images/banner1.jpg";
    const backdrop = document.getElementById("newBackdrop")?.value.trim() || poster;
    const synopsisEn = document.getElementById("newSynopsisEn")?.value.trim();
    const synopsisSi = document.getElementById("newSynopsisSi")?.value.trim() || synopsisEn;
    const isFeatured = document.getElementById("newIsFeatured")?.checked || false;

    const id = "custom-" + Date.now();

    const newItem = {
      id,
      titleEnglish: titleEn,
      titleSinhala: titleSi,
      singlishKeywords: [titleEn.toLowerCase(), titleSi.toLowerCase(), category],
      type,
      category,
      channel,
      year,
      rating,
      audio,
      poster,
      backdrop,
      badge: "",
      director: "",
      dubTeam: channel,
      synopsisEnglish: synopsisEn,
      synopsisSinhala: synopsisSi,
      tags: [category, channel, "HD Dub"],
      isFeatured,
      trending: true,
      views: "1.0K",
      likes: "50",
      downloadQualities: [
        { quality: "1080p FHD", size: "1.2 GB", ext: "MP4", bitRate: "2800 kbps", speed: "Fast" },
        { quality: "720p HD", size: "650 MB", ext: "MP4", bitRate: "1600 kbps", speed: "Recommended" },
        { quality: "480p SD", size: "320 MB", ext: "MP4", bitRate: "800 kbps", speed: "Data Saver" }
      ]
    };

    if (type === "series") {
      const epCards = this.addEpisodesContainer.querySelectorAll(".ep-item-card");
      const episodes = [];
      epCards.forEach((card, idx) => {
        const epNumVal = parseInt(card.querySelector(".ep-num")?.value, 10);
        const epNum = (!isNaN(epNumVal) && epNumVal > 0) ? epNumVal : (idx + 1);
        const tEn = card.querySelector(".ep-title-en")?.value || `Episode ${epNum}`;
        const tSi = card.querySelector(".ep-title-si")?.value || `${epNum} වන කොටස`;
        const sUrl = card.querySelector(".ep-stream-url")?.value || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        const dUrl = card.querySelector(".ep-dl-url")?.value || sUrl;

        episodes.push({
          epNumber: epNum,
          titleEnglish: tEn,
          titleSinhala: tSi,
          duration: "24:00",
          thumbnail: backdrop || poster,
          streamSources: [{ server: "Server 1 (HD Direct)", url: sUrl }],
          downloads: { fhd: dUrl, hd: dUrl, sd: dUrl, gdrive: dUrl }
        });
      });

      if (episodes.length === 0) {
        episodes.push({
          epNumber: 1,
          titleEnglish: "Episode 01",
          titleSinhala: "01 වන කොටස",
          duration: "24:00",
          thumbnail: backdrop || poster,
          streamSources: [{ server: "Server 1 (HD)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }],
          downloads: { fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
        });
      }

      newItem.episodes = episodes;
      newItem.episodesCount = episodes.length;
    } else {
      const movieStreamUrl = document.getElementById("newMovieStreamUrl")?.value || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      const movieDlUrl = document.getElementById("newMovieDlUrl")?.value || movieStreamUrl;
      newItem.episodesCount = 1;
      newItem.episodes = [{
        epNumber: 1,
        titleEnglish: "Full Movie",
        titleSinhala: "සම්පූර්ණ චිත්‍රපටය",
        duration: "01:30:00",
        thumbnail: backdrop || poster,
        streamSources: [{ server: "Server 1 (HD Direct)", url: movieStreamUrl }],
        downloads: { fhd: movieDlUrl, hd: movieDlUrl, sd: movieDlUrl }
      }];
    }

    StorageService.saveCustomContent(newItem);
    this.showToast(`Successfully added "${titleEn}"! 🎉`, "success");
    this.addForm.reset();
    if (this.addEpisodesContainer) this.addEpisodesContainer.innerHTML = "";
    this.switchTab("catalog");
  }

  // =========================================================================
  // EDIT MEDIA MODAL
  // =========================================================================
  openEditModal(contentId) {
    const item = this.catalog.find(c => c.id === contentId);
    if (!item || !this.editModal) return;

    this.editingItemId = contentId;
    this.editModal.classList.add("active");

    document.getElementById("editTitleEn").value = item.titleEnglish || "";
    document.getElementById("editTitleSi").value = item.titleSinhala || "";
    document.getElementById("editCategory").value = item.category || "cartoons";
    document.getElementById("editChannel").value = item.channel || "Rupavahini";
    document.getElementById("editYear").value = item.year || 2024;
    document.getElementById("editRating").value = item.rating || 9.5;
    document.getElementById("editPoster").value = item.poster || "";
    document.getElementById("editAudio").value = item.audio || "";
    document.getElementById("editSynopsisEn").value = item.synopsisEnglish || "";
  }

  closeEditModal() {
    if (this.editModal) this.editModal.classList.remove("active");
    this.editingItemId = null;
  }

  handleSaveEdit(e) {
    e.preventDefault();
    if (!this.editingItemId) return;
    const original = this.catalog.find(c => c.id === this.editingItemId);
    if (!original) return;

    const updated = {
      ...original,
      titleEnglish: document.getElementById("editTitleEn")?.value.trim() || original.titleEnglish,
      titleSinhala: document.getElementById("editTitleSi")?.value.trim() || original.titleSinhala,
      category: document.getElementById("editCategory")?.value || original.category,
      channel: document.getElementById("editChannel")?.value || original.channel,
      year: parseInt(document.getElementById("editYear")?.value, 10) || original.year,
      rating: parseFloat(document.getElementById("editRating")?.value) || original.rating,
      poster: document.getElementById("editPoster")?.value.trim() || original.poster,
      audio: document.getElementById("editAudio")?.value.trim() || original.audio,
      synopsisEnglish: document.getElementById("editSynopsisEn")?.value.trim() || original.synopsisEnglish
    };

    StorageService.updateContent(updated);
    this.showToast(`Updated "${updated.titleEnglish}"! ✅`, "success");
    this.closeEditModal();
    this.renderCatalogTable();
    this.renderDashboardStats();
  }

  confirmDelete(contentId, title) {
    if (confirm(`Are you sure you want to delete "${title}" from the database? This can be restored via Reset Defaults.`)) {
      StorageService.deleteContent(contentId);
      this.showToast(`"${title}" deleted from catalog.`, "info");
      this.renderCatalogTable();
      this.renderDashboardStats();
    }
  }

  // =========================================================================
  // REQUESTS MANAGEMENT
  // =========================================================================
  renderRequests() {
    if (!this.requestsGrid) return;
    const list = StorageService.getRequests();

    if (list.length === 0) {
      this.requestsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--admin-text-secondary); background: var(--admin-bg-card); border-radius: var(--admin-radius);">
          <h3>No Viewer Requests Yet</h3>
          <p>Any content requested by users on the public site will appear here.</p>
        </div>
      `;
      return;
    }

    this.requestsGrid.innerHTML = "";
    list.forEach(req => {
      const isResolved = req.status === "completed";
      const card = document.createElement("div");
      card.className = "request-card";
      card.innerHTML = `
        <div>
          <div class="req-header">
            <h4 class="req-title">${req.title}</h4>
            <span class="badge-cat-tag ${isResolved ? "cat-teledramas" : "cat-kdramas"}">${isResolved ? "✅ Fulfilled" : "⏳ Pending"}</span>
          </div>
          <div class="req-notes">${req.notes || "No additional notes provided."}</div>
          <div class="req-meta">
            <span>👤 ${req.contact}</span>
            <span>📅 ${req.createdAt}</span>
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; border-top: 1px solid var(--admin-border); padding-top: 0.75rem;">
          ${!isResolved ? `<button class="btn-admin-secondary btn-xs" onclick="Admin.resolveRequest('${req.id}')">Mark Fulfilled</button>` : ""}
          <button class="btn-admin-danger btn-xs" onclick="Admin.deleteRequest('${req.id}')">Delete</button>
        </div>
      `;
      this.requestsGrid.appendChild(card);
    });
  }

  resolveRequest(reqId) {
    StorageService.updateRequestStatus(reqId, "completed");
    this.showToast("Request marked as fulfilled! 🎉", "success");
    this.renderRequests();
    this.renderDashboardStats();
  }

  deleteRequest(reqId) {
    StorageService.deleteRequest(reqId);
    this.showToast("Request deleted.", "info");
    this.renderRequests();
    this.renderDashboardStats();
  }

  // =========================================================================
  // BACKUP & DATABASE TOOLS
  // =========================================================================
  exportDatabaseJson() {
    this.refreshCatalog();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.catalog, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sinhalaflix_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    this.showToast("Database exported as JSON backup! 💾", "success");
  }

  importDatabaseJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          imported.forEach(item => StorageService.saveCustomContent(item));
          this.showToast(`Successfully imported ${imported.length} media records! 📥`, "success");
          this.refreshCatalog();
          this.renderCatalogTable();
          this.renderDashboardStats();
        } else {
          alert("Invalid backup file structure.");
        }
      } catch (err) {
        alert("Error parsing JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  resetDefaults() {
    if (confirm("Are you sure you want to reset all edits and deletions back to the default catalog?")) {
      StorageService.resetCatalogToDefaults();
      this.showToast("Database restored to default dataset. 🔄", "success");
      this.refreshCatalog();
      this.renderCatalogTable();
      this.renderDashboardStats();
    }
  }

  // =========================================================================
  // TOAST NOTIFICATIONS
  // =========================================================================
  showToast(message, type = "info") {
    const container = document.getElementById("adminToastContainer") || document.body;
    const toast = document.createElement("div");
    toast.className = `toast-message toast-${type}`;
    toast.style.cssText = `
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      background: rgba(13, 18, 31, 0.95);
      border: 1px solid ${type === "success" ? "var(--admin-emerald)" : type === "error" ? "var(--admin-rose)" : "var(--admin-gold)"};
      color: #fff;
      padding: 0.85rem 1.25rem;
      border-radius: var(--admin-radius-sm);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      animation: slideIn 0.3s ease forwards;
    `;

    toast.innerHTML = `<span>${type === "success" ? "✅" : type === "error" ? "⚠️" : "ℹ️"}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Global initialization
function initAdminApp() {
  window.Admin = new AdminController();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdminApp);
} else {
  initAdminApp();
}
