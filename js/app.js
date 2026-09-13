/**
 * Sinhala Dubbed Cartoons & Movies - Main Application Orchestrator
 * Interface Language: English | Content Display: English Title + Sinhala Name
 */

class SinhalaToonApp {
  constructor() {
    this.catalog = [];
    this.currentCategory = "all";
    this.currentChannel = "all";
    this.currentSort = "popular";
    this.searchQuery = "";
    this.activeHeroSlide = 0;
    this.heroSlideInterval = null;

    this.selectedDetailContent = null;
  }

  init() {
    this.refreshCatalog();
    this.initControllers();
    this.initDOM();
    this.initHeroCarousel();
    this.renderCatalog();
    this.renderContinueWatching();
    this.bindGlobalEvents();
  }

  refreshCatalog() {
    this.catalog = StorageService.getFullCatalog();
  }

  initControllers() {
    window.Player = new VideoPlayerController();
    window.DownloadHub = new DownloadHubController();
    window.Manager = new ContentManager();
  }

  initDOM() {
    this.searchInput = document.getElementById("mainSearchInput");
    this.clearSearchBtn = document.getElementById("btnClearSearch");
    this.categoryTabs = document.querySelectorAll(".category-tab-btn");
    this.channelPills = document.querySelectorAll(".channel-pill");
    this.sortSelect = document.getElementById("sortSelector");
    this.catalogGrid = document.getElementById("catalogGrid");
    this.catalogCountDisplay = document.getElementById("catalogCountBadge");
    this.catalogSectionTitle = document.getElementById("catalogSectionHeading");
    this.heroSlideContainer = document.getElementById("heroCarouselContainer");
    this.heroIndicatorsContainer = document.getElementById("heroIndicators");
    this.continueWatchingSection = document.getElementById("continueWatchingSection");
    this.continueWatchingGrid = document.getElementById("continueWatchingGrid");

    // Modals
    this.detailModal = document.getElementById("detailModal");
    this.requestModal = document.getElementById("requestModal");
    this.btnOpenAddContent = document.getElementById("btnOpenAddContent");
    this.btnOpenRequest = document.getElementById("btnOpenRequestModal");
    this.navBtnWatchlist = document.getElementById("navBtnWatchlist");
    this.navBtnHistory = document.getElementById("navBtnHistory");
    this.btnMobileMenu = document.getElementById("btnMobileMenuToggle");
    this.mobileNavDrawer = document.getElementById("mobileNavDrawer");
  }

  bindGlobalEvents() {
    // Search input with debounce
    let searchTimeout;
    this.searchInput?.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      this.searchQuery = e.target.value.trim().toLowerCase();
      if (this.clearSearchBtn) {
        this.clearSearchBtn.style.display = this.searchQuery ? "block" : "none";
      }
      searchTimeout = setTimeout(() => {
        this.renderCatalog();
      }, 200);
    });

    this.clearSearchBtn?.addEventListener("click", () => {
      if (this.searchInput) this.searchInput.value = "";
      this.searchQuery = "";
      this.clearSearchBtn.style.display = "none";
      this.renderCatalog();
    });

    // Category Tabs
    this.categoryTabs.forEach(btn => {
      btn.addEventListener("click", () => {
        this.categoryTabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCategory = btn.dataset.category || "all";
        this.renderCatalog();
      });
    });

    // Channel Pills
    this.channelPills.forEach(pill => {
      pill.addEventListener("click", () => {
        this.channelPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.currentChannel = pill.dataset.channel || "all";
        this.renderCatalog();
      });
    });

    // Sorting selector
    this.sortSelect?.addEventListener("change", (e) => {
      this.currentSort = e.target.value;
      this.renderCatalog();
    });

    // Header Action Buttons
    this.btnOpenAddContent?.addEventListener("click", () => Manager.open());
    this.btnOpenRequest?.addEventListener("click", () => this.openRequestModal());

    // Navigation links
    this.navBtnWatchlist?.addEventListener("click", (e) => {
      e.preventDefault();
      this.setCategory("watchlist");
    });

    this.navBtnHistory?.addEventListener("click", (e) => {
      e.preventDefault();
      this.setCategory("continue");
    });

    // Mobile Drawer
    this.btnMobileMenu?.addEventListener("click", () => {
      this.mobileNavDrawer?.classList.toggle("active");
    });

    document.getElementById("btnCloseMobileNav")?.addEventListener("click", () => {
      this.mobileNavDrawer?.classList.remove("active");
    });

    // Detail modal close
    document.getElementById("btnCloseDetailModal")?.addEventListener("click", () => {
      this.closeDetailModal();
    });

    // Request modal close & submit
    document.getElementById("btnCloseRequestModal")?.addEventListener("click", () => {
      this.closeRequestModal();
    });

    document.getElementById("requestForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("reqCartoonName")?.value || "";
      const type = document.getElementById("reqMediaType")?.value || "cartoons";
      const contact = document.getElementById("reqUserContact")?.value || "";
      const notes = document.getElementById("reqNotes")?.value || "";

      StorageService.saveRequest({ title, type, contact, notes });
      this.showToast(`Request submitted for "${title}"! Our admins have received it. 🎉`, "success");
      this.closeRequestModal();
      e.target.reset();
    });

    // Close modals on outside click
    window.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        e.target.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Global keyboard shortcut for search '/'
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
        e.preventDefault();
        this.searchInput?.focus();
      }
    });

    // Cross-tab synchronization: re-render catalog when admin adds/edits/deletes media in another tab
    window.addEventListener("storage", (e) => {
      if (
        e.key === "sinhalaflix_custom_content_v1" ||
        e.key === "sinhalaflix_edited_content_v1" ||
        e.key === "sinhalaflix_deleted_ids_v1"
      ) {
        this.refreshCatalog();
        this.renderCatalog();
        this.renderContinueWatching();
      }
    });

    // Auto-refresh when user switches back to this tab
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.refreshCatalog();
        this.renderCatalog();
      }
    });
  }

  setCategory(categoryKey) {
    this.currentCategory = categoryKey;
    this.categoryTabs.forEach(b => {
      b.classList.toggle("active", b.dataset.category === categoryKey);
    });

    const headingsMap = {
      all: "🍿 Sinhala Dubbed Entertainment Universe | සියලුම නිර්මාණ",
      cartoons: "🦁 Sinhala Dubbed Cartoons | සිංහල හඬකැවූ කාටූන්",
      movies: "🎬 Sinhala Dubbed Movies | සිංහල හඬකැවූ චිත්‍රපට",
      teledramas: "📺 Sinhala Teledramas | ශ්‍රී ලාංකීය ටෙලි නාට්‍ය",
      kdramas: "🌸 Sinhala Dubbed K-Dramas | සිංහල හඬකැවූ කොරියන් නාට්‍ය",
      cartoon_series: "⚡ Cartoon Series | කාටූන් කතා මාලා",
      watchlist: "❤️ My Watchlist | මගේ නැරඹුම් ලැයිස්තුව",
      continue: "🕒 Continue Watching History | නැවත නරඹන්න"
    };

    if (this.catalogSectionTitle && headingsMap[categoryKey]) {
      this.catalogSectionTitle.innerHTML = `
        <span class="section-title-icon">${headingsMap[categoryKey].split(" ")[0]}</span>
        <span>${headingsMap[categoryKey].substring(headingsMap[categoryKey].indexOf(" ") + 1)}</span>
      `;
    }

    this.renderCatalog();
    document.getElementById("catalogSection")?.scrollIntoView({ behavior: "smooth" });
  }

  setChannel(channelName) {
    this.currentChannel = channelName;
    this.channelPills.forEach(p => {
      p.classList.toggle("active", p.dataset.channel === channelName);
    });
    this.renderCatalog();
    document.getElementById("catalogSection")?.scrollIntoView({ behavior: "smooth" });
  }

  // --- Hero Carousel ---
  initHeroCarousel() {
    if (!this.heroSlideContainer) return;
    const featuredItems = this.catalog.filter(item => item.isFeatured);
    if (featuredItems.length === 0) return;

    this.heroSlideContainer.innerHTML = "";
    if (this.heroIndicatorsContainer) this.heroIndicatorsContainer.innerHTML = "";

    const categoryLabelMap = {
      cartoons: "🦁 Cartoon",
      movies: "🎬 Dubbed Movie",
      teledramas: "📺 Teledrama",
      kdramas: "🌸 K-Drama",
      cartoon_series: "⚡ Cartoon Series"
    };

    featuredItems.forEach((item, idx) => {
      const slide = document.createElement("div");
      slide.className = `hero-slide ${idx === 0 ? "active" : ""}`;
      const catLabel = categoryLabelMap[item.category] || "🔥 Featured";
      slide.innerHTML = `
        <div class="hero-bg-overlay"></div>
        <img class="hero-bg-img" src="${item.backdrop || item.poster}" alt="${item.titleEnglish}" />
        <div class="hero-content">
          <div class="hero-badges">
            <span class="badge-featured">${catLabel}</span>
            <span class="badge-channel">${item.channel}</span>
            <span class="badge-audio">${item.audio}</span>
          </div>
          <h2 class="hero-title">${item.titleEnglish}</h2>
          <h3 class="hero-subtitle">${item.titleSinhala} • <span style="font-weight:400; font-size: 0.9em; opacity: 0.85;">${item.year}</span></h3>
          <div class="hero-meta">
            <span class="hero-rating">⭐ ${item.rating} / 10</span>
            <span class="hero-type">${item.type === "series" ? `${item.episodesCount || 12} Episodes` : `${item.duration || "Full Movie"}`}</span>
          </div>
          <p class="hero-desc">${item.synopsisEnglish || item.synopsisSinhala}</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="App.watchDirect('${item.id}')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              <span>Watch Now</span>
            </button>
            <button class="btn btn-glass btn-lg" onclick="App.downloadDirect('${item.id}')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              <span>Download</span>
            </button>
            <button class="btn btn-icon btn-lg" onclick="App.toggleWatchlist('${item.id}', this)" title="Add to My Watchlist">
              ${StorageService.isInWatchlist(item.id) ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      `;
      this.heroSlideContainer.appendChild(slide);

      // Indicator
      if (this.heroIndicatorsContainer) {
        const ind = document.createElement("button");
        ind.className = `hero-indicator ${idx === 0 ? "active" : ""}`;
        ind.setAttribute("aria-label", `Slide ${idx + 1}`);
        ind.addEventListener("click", () => this.goToHeroSlide(idx));
        this.heroIndicatorsContainer.appendChild(ind);
      }
    });

    this.startHeroAutoSlide(featuredItems.length);
  }

  startHeroAutoSlide(total) {
    if (this.heroSlideInterval) clearInterval(this.heroSlideInterval);
    this.heroSlideInterval = setInterval(() => {
      this.activeHeroSlide = (this.activeHeroSlide + 1) % total;
      this.updateHeroSlideDOM();
    }, 7000);

    const banner = document.getElementById("heroBanner");
    banner?.addEventListener("mouseenter", () => clearInterval(this.heroSlideInterval));
    banner?.addEventListener("mouseleave", () => this.startHeroAutoSlide(total));
  }

  goToHeroSlide(index) {
    this.activeHeroSlide = index;
    this.updateHeroSlideDOM();
  }

  updateHeroSlideDOM() {
    const slides = document.querySelectorAll(".hero-slide");
    const indicators = document.querySelectorAll(".hero-indicator");
    slides.forEach((s, i) => s.classList.toggle("active", i === this.activeHeroSlide));
    indicators.forEach((ind, i) => ind.classList.toggle("active", i === this.activeHeroSlide));
  }

  // --- Continue Watching Shelf ---
  renderContinueWatching() {
    if (!this.continueWatchingSection || !this.continueWatchingGrid) return;
    const history = StorageService.getHistory();
    const historyKeys = Object.keys(history);

    if (historyKeys.length === 0) {
      this.continueWatchingSection.style.display = "none";
      return;
    }

    this.continueWatchingSection.style.display = "block";
    this.continueWatchingGrid.innerHTML = "";

    historyKeys.forEach(contentId => {
      const item = this.catalog.find(c => c.id === contentId);
      const record = history[contentId];
      if (!item || !record) return;

      const card = document.createElement("div");
      card.className = "continue-card";
      card.innerHTML = `
        <div class="continue-thumb">
          <img src="${item.poster}" alt="${item.titleEnglish}" loading="lazy" />
          <button class="continue-play-btn" onclick="App.resumePlay('${item.id}', ${record.episodeNumber - 1})" title="Resume">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <div class="continue-progress-bar">
            <div class="continue-progress-fill" style="width: ${record.percent}%"></div>
          </div>
        </div>
        <div class="continue-info">
          <h4 class="continue-title">${item.titleEnglish}</h4>
          <span class="continue-sub">${item.type === "series" ? `Episode ${record.episodeNumber} • ` : ""}${record.percent}% Watched • ${item.titleSinhala}</span>
        </div>
      `;
      this.continueWatchingGrid.appendChild(card);
    });
  }

  // --- Filter & Catalog Rendering ---
  getFilteredCatalog() {
    let list = [...this.catalog];

    // Category Filter
    if (this.currentCategory === "watchlist") {
      const watchlist = StorageService.getWatchlist();
      list = list.filter(item => watchlist.includes(item.id));
    } else if (this.currentCategory === "continue") {
      const history = StorageService.getHistory();
      list = list.filter(item => Boolean(history[item.id]));
    } else if (this.currentCategory !== "all") {
      list = list.filter(item => item.category === this.currentCategory || (this.currentCategory === "series" && item.type === "series"));
    }

    // Channel Filter
    if (this.currentChannel !== "all") {
      list = list.filter(item => item.channel === this.currentChannel);
    }

    // Search Query Filter
    if (this.searchQuery) {
      const q = this.searchQuery;
      list = list.filter(item => {
        const titleEnMatch = item.titleEnglish && item.titleEnglish.toLowerCase().includes(q);
        const titleSiMatch = item.titleSinhala && item.titleSinhala.toLowerCase().includes(q);
        const singlishMatch = item.singlishKeywords && item.singlishKeywords.some(kw => kw.toLowerCase().includes(q));
        const tagsMatch = item.tags && item.tags.some(t => t.toLowerCase().includes(q));
        const directorMatch = item.director && item.director.toLowerCase().includes(q);
        return titleEnMatch || titleSiMatch || singlishMatch || tagsMatch || directorMatch;
      });
    }

    // Sorting
    const parseStat = (val, isCustom) => {
      if (!val) return isCustom ? 200000 : 0;
      const s = String(val).trim().toUpperCase();
      if (s.endsWith("M")) return parseFloat(s) * 1_000_000;
      if (s.endsWith("K")) return parseFloat(s) * 1_000;
      const num = parseFloat(s) || 0;
      return (isCustom && num < 1000) ? 200000 : num;
    };
    if (this.currentSort === "popular") {
      list.sort((a, b) => {
        const isCustomA = Boolean(a.id && a.id.startsWith("custom-"));
        const isCustomB = Boolean(b.id && b.id.startsWith("custom-"));
        return parseStat(b.likes, isCustomB) - parseStat(a.likes, isCustomA);
      });
    } else if (this.currentSort === "latest") {
      list.sort((a, b) => {
        const parseTime = (item) => {
          if (item.createdAt) return item.createdAt;
          if (item.id && item.id.startsWith("custom-")) {
            const t = parseInt(item.id.replace("custom-", ""), 10);
            if (!isNaN(t)) return t;
          }
          return ((item.year || 2020) * 100000);
        };
        return parseTime(b) - parseTime(a);
      });
    } else if (this.currentSort === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (this.currentSort === "az") {
      list.sort((a, b) => (a.titleEnglish || a.titleSinhala).localeCompare(b.titleEnglish || b.titleSinhala));
    }

    return list;
  }

  renderCatalog() {
    if (!this.catalogGrid) return;
    this.refreshCatalog(); // Always pull fresh data from localStorage before rendering
    const items = this.getFilteredCatalog();

    if (this.catalogCountDisplay) {
      this.catalogCountDisplay.textContent = `${items.length} Titles Available`;
    }

    if (items.length === 0) {
      this.catalogGrid.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">🔍</div>
          <h3>No Content Found</h3>
          <p>The cartoon or movie you searched for is not currently in our library. Feel free to request it!</p>
          <button class="btn btn-primary" onclick="App.openRequestModal()">
            <span>✨ Request Cartoon</span>
          </button>
        </div>
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

    this.catalogGrid.innerHTML = "";
    items.forEach(item => {
      const isBookmarked = StorageService.isInWatchlist(item.id);
      const catInfo = catBadgeMap[item.category] || { label: "Media", class: "cat-cartoons" };
      const card = document.createElement("div");
      card.className = "cartoon-card";
      card.innerHTML = `
        <div class="card-poster-wrapper">
          <img src="${item.poster}" alt="${item.titleEnglish}" class="card-poster-img" loading="lazy" />
          <div class="card-badges">
            <span class="badge-cat-tag ${catInfo.class}">${catInfo.label}</span>
          </div>
          <button class="card-bookmark-btn ${isBookmarked ? "active" : ""}" onclick="App.toggleWatchlist('${item.id}', this, event)" title="Save to Watchlist">
            ${isBookmarked ? "❤️" : "🤍"}
          </button>
          <div class="card-hover-overlay">
            <button class="btn-card-play" onclick="App.watchDirect('${item.id}')" title="Watch Now">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <div class="card-hover-actions">
              <button class="btn btn-secondary btn-sm" onclick="App.openDetail('${item.id}')">Details</button>
              <button class="btn btn-primary btn-sm" onclick="App.downloadDirect('${item.id}')">Download</button>
            </div>
          </div>
        </div>
        <div class="card-info" onclick="App.openDetail('${item.id}')">
          <div class="card-meta-top">
            <span class="card-channel-tag">${item.channel}</span>
            <span class="card-rating">⭐ ${item.rating}</span>
          </div>
          <h3 class="card-title-main" title="${item.titleEnglish}">${item.titleEnglish}</h3>
          <p class="card-title-sub">${item.titleSinhala}</p>
          <div class="card-meta-bottom">
            <span class="card-year">📅 ${item.year}</span>
            <span class="card-type-count">${item.type === "series" ? `${item.episodesCount || 12} Episodes` : "Full Movie"}</span>
          </div>
        </div>
      `;
      this.catalogGrid.appendChild(card);
    });
  }

  // --- Quick Actions — navigate to dedicated movie detail page ---
  watchDirect(contentId, episodeIndex = 0) {
    window.location.href = `movie.html?id=${contentId}&autoplay=true&ep=${episodeIndex}`;
  }

  resumePlay(contentId, episodeIndex = 0) {
    window.location.href = `movie.html?id=${contentId}&autoplay=true&ep=${episodeIndex}`;
  }

  downloadDirect(contentId, episodeIndex = 0) {
    window.location.href = `movie.html?id=${contentId}#download`;
  }

  toggleWatchlist(contentId, btnEl, event) {
    if (event) event.stopPropagation();
    const added = StorageService.toggleWatchlist(contentId);
    if (btnEl) {
      btnEl.innerHTML = added ? "❤️" : "🤍";
      btnEl.classList.toggle("active", added);
    }
    this.showToast(added ? "Added to My Watchlist! ❤️" : "Removed from Watchlist", "info");

    if (this.currentCategory === "watchlist") {
      this.renderCatalog();
    }
  }

  // --- Detail Page — navigate to movie.html ---
  openDetail(contentId) {
    window.location.href = `movie.html?id=${contentId}`;
  }

  _openDetailLegacy(contentId) {
    const item = this.catalog.find(c => c.id === contentId);
    if (!item || !this.detailModal) return;

    this.selectedDetailContent = item;
    this.detailModal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Populate elements: English Main + Sinhala Name
    document.getElementById("detailPoster").src = item.poster;
    document.getElementById("detailTitleEn").textContent = `${item.titleEnglish} (${item.year})`;
    document.getElementById("detailTitleSi").textContent = item.titleSinhala;
    document.getElementById("detailRating").textContent = `⭐ ${item.rating} / 10`;
    document.getElementById("detailChannel").textContent = item.channel;
    document.getElementById("detailAudio").textContent = item.audio;
    document.getElementById("detailDirector").textContent = item.director || "Television Dubbing Department";
    document.getElementById("detailDubTeam").textContent = item.dubTeam || item.channel;
    document.getElementById("detailSynopsis").textContent = item.synopsisEnglish || item.synopsisSinhala;

    // Tags
    const tagsContainer = document.getElementById("detailTagsList");
    if (tagsContainer) {
      tagsContainer.innerHTML = "";
      (item.tags || []).forEach(t => {
        const span = document.createElement("span");
        span.className = "detail-tag-pill";
        span.textContent = t;
        tagsContainer.appendChild(span);
      });
    }

    // Watchlist & Like button status
    const btnBm = document.getElementById("btnDetailBookmark");
    if (btnBm) {
      const isBm = StorageService.isInWatchlist(item.id);
      btnBm.innerHTML = isBm ? "❤️ In Watchlist" : "🤍 Add to Watchlist";
      btnBm.onclick = () => {
        const added = StorageService.toggleWatchlist(item.id);
        btnBm.innerHTML = added ? "❤️ In Watchlist" : "🤍 Add to Watchlist";
        App.showToast(added ? "Added to Watchlist!" : "Removed from Watchlist", "info");
      };
    }

    const btnLike = document.getElementById("btnDetailLike");
    if (btnLike) {
      const isLiked = StorageService.isLiked(item.id);
      btnLike.innerHTML = `👍 ${isLiked ? "Liked" : "Like"} (${item.likes || "10K"})`;
      btnLike.onclick = () => {
        const liked = StorageService.toggleLike(item.id);
        btnLike.innerHTML = `👍 ${liked ? "Liked" : "Like"} (${item.likes || "10K"})`;
        App.showToast(liked ? "You liked this cartoon! 👍" : "Like removed", "info");
      };
    }

    // Direct actions inside modal
    document.getElementById("btnDetailWatch").onclick = () => this.watchDirect(item.id);
    document.getElementById("btnDetailDownload").onclick = () => this.downloadDirect(item.id);

    // Episodes Tab / List
    const epSection = document.getElementById("detailEpisodeSection");
    const epGrid = document.getElementById("detailEpisodeGrid");
    if (item.type === "series" && item.episodes && item.episodes.length > 0) {
      epSection.style.display = "block";
      epGrid.innerHTML = "";
      item.episodes.forEach((ep, idx) => {
        const epCard = document.createElement("div");
        epCard.className = "detail-ep-card";
        const epImg = (item.backdrop && item.backdrop.trim()) ? item.backdrop : (ep.thumbnail || item.poster);
        epCard.innerHTML = `
          <div class="ep-card-thumb">
            <img src="${epImg}" alt="Episode ${ep.epNumber || idx + 1}" loading="lazy" />
            <span class="ep-badge">EP ${ep.epNumber || idx + 1}</span>
          </div>
          <div class="ep-card-info">
            <h4 style="font-size:0.85rem; font-weight:600;">${ep.titleEnglish}</h4>
            <p style="font-size:0.75rem; color:var(--text-gold); font-family:var(--font-sinhala);">${ep.titleSinhala}</p>
            <span class="ep-dur">${ep.duration || "22:00"}</span>
            <div class="ep-card-actions" style="margin-top:0.4rem; display:flex; gap:0.4rem;">
              <button class="btn btn-primary btn-xs" onclick="App.watchDirect('${item.id}', ${idx})">Watch</button>
              <button class="btn btn-secondary btn-xs" onclick="App.downloadDirect('${item.id}', ${idx})">Download</button>
            </div>
          </div>
        `;
        epGrid.appendChild(epCard);
      });
    } else {
      epSection.style.display = "none";
    }

    // Render Comments
    this.renderComments(item.id);

    // Comment form submission
    const commentForm = document.getElementById("commentSubmitForm");
    if (commentForm) {
      commentForm.onsubmit = (e) => {
        e.preventDefault();
        const author = document.getElementById("commentAuthorName")?.value || "Viewer";
        const text = document.getElementById("commentInputText")?.value;
        const rating = document.getElementById("commentRatingScore")?.value || 5;
        if (!text) return;

        StorageService.addComment(item.id, author, text, rating);
        this.showToast("Your review was posted successfully! Thank you. 💬", "success");
        commentForm.reset();
        this.renderComments(item.id);
      };
    }
  }

  closeDetailModal() {
    if (this.detailModal) this.detailModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  renderComments(contentId) {
    const listContainer = document.getElementById("detailCommentsList");
    if (!listContainer) return;
    const comments = StorageService.getComments(contentId);

    if (comments.length === 0) {
      listContainer.innerHTML = `<p class="text-muted">No reviews yet. Be the first to share your thoughts!</p>`;
      return;
    }

    listContainer.innerHTML = "";
    comments.forEach(c => {
      const el = document.createElement("div");
      el.className = "comment-bubble";
      el.innerHTML = `
        <div class="comment-avatar">${c.avatar || "U"}</div>
        <div class="comment-body">
          <div class="comment-header">
            <strong>${c.authorName}</strong>
            <span class="comment-stars">${"⭐".repeat(c.rating || 5)}</span>
            <span class="comment-time">${c.timeAgo}</span>
          </div>
          <p class="comment-text">${c.text}</p>
        </div>
      `;
      listContainer.appendChild(el);
    });
  }

  // --- Request Modal ---
  openRequestModal() {
    if (this.requestModal) {
      this.requestModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  closeRequestModal() {
    if (this.requestModal) {
      this.requestModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // --- Toast Notification ---
  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-message toast-${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "⚠️";

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // Share methods
  shareOnWhatsApp(title) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Watch or Download: ${title} - Sinhala Dubbed Cartoons & Movies!\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  }

  shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  }

  copyShareLink() {
    navigator.clipboard?.writeText(window.location.href);
    this.showToast("Link copied to clipboard! 📋", "success");
  }
}

// Instantiate global app
window.App = new SinhalaToonApp();
document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});
