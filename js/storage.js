/**
 * SinhalaFlix Hub - Local Storage & State Management
 * Full Support for Public Site, Custom Content, Admin CRUD & Viewer Requests
 */

const STORAGE_KEYS = {
  WATCHLIST: "sinhalaflix_watchlist_v1",
  HISTORY: "sinhalaflix_watch_history_v1",
  RATINGS: "sinhalaflix_user_ratings_v1",
  COMMENTS: "sinhalaflix_user_comments_v1",
  CUSTOM_CONTENT: "sinhalaflix_custom_content_v1",
  EDITED_CONTENT: "sinhalaflix_edited_content_v1",
  DELETED_IDS: "sinhalaflix_deleted_ids_v1",
  REQUESTS: "sinhalaflix_user_requests_v1",
  LIKES: "sinhalaflix_user_likes_v1",
  ADMIN_AUTH: "sinhalaflix_admin_session_v1"
};

const StorageService = {
  // --- Admin Authentication ---
  isAdminLoggedIn() {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) || sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      return session === "true";
    } catch (e) {
      return false;
    }
  },

  adminLogin(username, pass1, pass2, remember = true) {
    if (typeof pass2 === "boolean") {
      remember = pass2;
      pass2 = "";
    }
    const u = (username || "").trim().toLowerCase();
    const p1 = (pass1 || "").trim();
    const p2 = (pass2 || "").trim();

    const valid = (u === "sinhalaflix2006") &&
                  (p1 === "sinhalaflix@20061679") &&
                  (p2 === "rivindu@20061679");

    if (valid) {
      try {
        if (remember) {
          localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
          localStorage.setItem("sfx_admin_v2", "true");
        }
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
        sessionStorage.setItem("sfx_admin_v2", "true");
      } catch (err) {
        console.warn("Storage write error:", err);
      }
      return { success: true };
    }
    return { success: false, message: "Invalid username or password. Please try again." };
  },

  adminLogout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      localStorage.removeItem("sfx_admin_v2");
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      sessionStorage.removeItem("sfx_admin_v2");
    } catch (e) {
      console.warn("Storage clear error:", e);
    }
  },

  // --- Watchlist Methods ---
  getWatchlist() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  isInWatchlist(id) {
    const list = this.getWatchlist();
    return list.includes(id);
  },

  toggleWatchlist(id) {
    let list = this.getWatchlist();
    const index = list.indexOf(id);
    let added = false;
    if (index > -1) {
      list.splice(index, 1);
      added = false;
    } else {
      list.push(id);
      added = true;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
    return added;
  },

  // --- Watch Progress / History ---
  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  saveProgress(contentId, episodeNumber = 1, currentTime = 0, duration = 0) {
    if (!contentId || duration <= 0) return;
    const history = this.getHistory();
    history[contentId] = {
      contentId,
      episodeNumber,
      currentTime: Math.floor(currentTime),
      duration: Math.floor(duration),
      percent: Math.min(100, Math.round((currentTime / duration) * 100)),
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  },

  getProgress(contentId) {
    const history = this.getHistory();
    return history[contentId] || null;
  },

  // Alias used by movie-page.js — maps to saveProgress
  updateHistory(contentId, episodeNumber = 1, currentTime = 0, duration = 0) {
    return this.saveProgress(contentId, episodeNumber, currentTime, duration);
  },

  // --- Ratings & Likes ---
  getUserRating(contentId) {
    try {
      const ratings = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS) || "{}");
      return ratings[contentId] || 0;
    } catch (e) {
      return 0;
    }
  },

  saveUserRating(contentId, rating) {
    try {
      const ratings = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS) || "{}");
      ratings[contentId] = rating;
      localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
      return true;
    } catch (e) {
      return false;
    }
  },

  isLiked(contentId) {
    try {
      const likes = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES) || "[]");
      return likes.includes(contentId);
    } catch (e) {
      return false;
    }
  },

  toggleLike(contentId) {
    try {
      let likes = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES) || "[]");
      const idx = likes.indexOf(contentId);
      let liked = false;
      if (idx > -1) {
        likes.splice(idx, 1);
        liked = false;
      } else {
        likes.push(contentId);
        liked = true;
      }
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes));
      return liked;
    } catch (e) {
      return false;
    }
  },

  // --- Comments ---
  getComments(contentId) {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || "{}");
      const localComments = stored[contentId] || [];
      const baseComments = (typeof INITIAL_COMMENTS !== "undefined" ? INITIAL_COMMENTS : []).filter(c => c.contentId === contentId);
      return [...localComments, ...baseComments];
    } catch (e) {
      return (typeof INITIAL_COMMENTS !== "undefined" ? INITIAL_COMMENTS : []).filter(c => c.contentId === contentId);
    }
  },

  addComment(contentId, authorName, text, rating = 5) {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || "{}");
      if (!stored[contentId]) stored[contentId] = [];
      const newComment = {
        contentId,
        authorName: authorName.trim() || "නරඹන්නෙක් (Viewer)",
        avatar: (authorName.trim() || "V").substring(0, 2).toUpperCase(),
        timeAgo: "මීට සුළු මොහොතකට පෙර",
        rating: Number(rating) || 5,
        text: text.trim()
      };
      stored[contentId].unshift(newComment);
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(stored));
      return newComment;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  // --- Catalog Data Merging (Initial + Custom + Edited - Deleted) ---
  getDeletedIds() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.DELETED_IDS) || "[]");
    } catch (e) {
      return [];
    }
  },

  getEditedContentMap() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.EDITED_CONTENT) || "{}");
    } catch (e) {
      return {};
    }
  },

  getCustomContent() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_CONTENT);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  _normalizeItemServers(item) {
    if (!item) return item;
    const clean = { ...item };

    const fixSources = (sources, downloads) => {
      if (!Array.isArray(sources)) return sources;
      return sources.map(src => {
        if (!src || !src.url) return src;
        const sUrl = src.url.trim();
        // If Server 2 is a Buzzheavier web page and downloads.buzz has the direct stream link
        if ((sUrl.includes("buzzheavier.com") || sUrl.includes("bzzhr.to")) && !sUrl.includes("ts.buzzheavier.com")) {
          if (downloads && downloads.buzz && (downloads.buzz.includes("ts.buzzheavier.com") || downloads.buzz.includes("/d/"))) {
            return { ...src, url: downloads.buzz.trim() };
          }
        }
        return src;
      });
    };

    clean.streamSources = fixSources(clean.streamSources, clean.downloads);

    const w16h9 = (clean.backdrop && clean.backdrop.trim()) ? clean.backdrop.trim() : "";

    if (Array.isArray(clean.episodes)) {
      clean.episodes = clean.episodes.map(ep => {
        const dl = ep.downloads || clean.downloads;
        // Episode card thumbnails require the 16:9 ratio image uploaded as backdrop/hero banner
        const thumb16x9 = w16h9 || (ep.thumbnail && ep.thumbnail !== clean.poster ? ep.thumbnail : "") || clean.poster || "assets/images/banner1.jpg";
        return {
          ...ep,
          streamSources: fixSources(ep.streamSources, dl),
          thumbnail: thumb16x9
        };
      });
    }

    return clean;
  },

  getFullCatalog() {
    const deletedIds = this.getDeletedIds();
    const editedMap = this.getEditedContentMap();
    const customItems = this.getCustomContent();

    const baseCatalog = (typeof INITIAL_CATALOG !== "undefined" ? INITIAL_CATALOG : []).map(item => {
      return editedMap[item.id] ? { ...item, ...editedMap[item.id] } : item;
    });

    const fullList = [...customItems, ...baseCatalog].map(item => this._normalizeItemServers(item));
    return fullList.filter(item => !deletedIds.includes(item.id));
  },

  _compactItemForStorage(item) {
    if (!item) return item;
    const copy = { ...item };
    // Strip duplicate base64 thumbnails from episodes to save massive localStorage quota
    if (Array.isArray(copy.episodes)) {
      copy.episodes = copy.episodes.map(ep => {
        const cleanEp = { ...ep };
        if (cleanEp.thumbnail === copy.backdrop || cleanEp.thumbnail === copy.poster) {
          cleanEp.thumbnail = "";
        }
        return cleanEp;
      });
    }
    return copy;
  },

  saveCustomContent(newItem) {
    try {
      const list = this.getCustomContent();
      const compacted = this._compactItemForStorage(newItem);
      const existingIdx = list.findIndex(c => c.id === compacted.id);
      if (existingIdx > -1) {
        list[existingIdx] = compacted;
      } else {
        list.unshift(compacted);
      }
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_CONTENT, JSON.stringify(list));
        return true;
      } catch (quotaErr) {
        console.warn("Storage quota exceeded in saveCustomContent, optimizing...", quotaErr);
        const sanitizedList = list.map(item => {
          const clean = this._compactItemForStorage(item);
          return clean;
        });
        localStorage.setItem(STORAGE_KEYS.CUSTOM_CONTENT, JSON.stringify(sanitizedList));
        return true;
      }
    } catch (e) {
      console.error("Critical error in saveCustomContent:", e);
      return false;
    }
  },

  updateContent(updatedItem) {
    try {
      const compacted = this._compactItemForStorage(updatedItem);
      // Check if custom
      let customList = this.getCustomContent();
      const customIdx = customList.findIndex(c => c.id === compacted.id);
      if (customIdx > -1) {
        customList[customIdx] = compacted;
        try {
          localStorage.setItem(STORAGE_KEYS.CUSTOM_CONTENT, JSON.stringify(customList));
        } catch (quotaErr) {
          console.warn("Storage quota exceeded in updateContent, optimizing...", quotaErr);
          const sanitizedList = customList.map(item => this._compactItemForStorage(item));
          localStorage.setItem(STORAGE_KEYS.CUSTOM_CONTENT, JSON.stringify(sanitizedList));
        }
        return true;
      }

      // Base item edit
      const editedMap = this.getEditedContentMap();
      editedMap[compacted.id] = compacted;
      try {
        localStorage.setItem(STORAGE_KEYS.EDITED_CONTENT, JSON.stringify(editedMap));
      } catch (quotaErr) {
        console.warn("Storage quota exceeded in editedMap, optimizing...", quotaErr);
        localStorage.setItem(STORAGE_KEYS.EDITED_CONTENT, JSON.stringify(editedMap));
      }
      return true;
    } catch (e) {
      console.error("Critical error in updateContent:", e);
      return false;
    }
  },

  deleteContent(contentId) {
    try {
      // Remove from custom if exists
      let customList = this.getCustomContent();
      customList = customList.filter(c => c.id !== contentId);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CONTENT, JSON.stringify(customList));

      // Mark in deleted IDs for base items
      const deletedIds = this.getDeletedIds();
      if (!deletedIds.includes(contentId)) {
        deletedIds.push(contentId);
        localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(deletedIds));
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  resetCatalogToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_CONTENT);
    localStorage.removeItem(STORAGE_KEYS.EDITED_CONTENT);
    localStorage.removeItem(STORAGE_KEYS.DELETED_IDS);
  },

  // --- Viewer Requests ---
  getRequests() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return data ? JSON.parse(data) : [
        {
          id: "req-1",
          title: "Doctor Dolittle Ep 05 (දොස්තර හොඳහිත)",
          type: "cartoons",
          contact: "sahan.perera@gmail.com",
          notes: "Need 1080p remaster with original Rupavahini dub audio",
          createdAt: "2026-09-04 14:30",
          status: "pending"
        },
        {
          id: "req-2",
          title: "Sujatha Diyaniya Episode 25-30",
          type: "kdramas",
          contact: "0771234567",
          notes: "High quality 720p with Sinhala songs",
          createdAt: "2026-09-05 08:15",
          status: "pending"
        }
      ];
    } catch (e) {
      return [];
    }
  },

  saveRequest(req) {
    try {
      const list = this.getRequests();
      const newReq = {
        id: "req-" + Date.now(),
        title: req.title,
        type: req.type || "cartoons",
        contact: req.contact || "Anonymous",
        notes: req.notes || "",
        createdAt: new Date().toLocaleString(),
        status: "pending"
      };
      list.unshift(newReq);
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(list));
      return newReq;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  updateRequestStatus(reqId, status) {
    try {
      const list = this.getRequests();
      const item = list.find(r => r.id === reqId);
      if (item) {
        item.status = status;
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(list));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  deleteRequest(reqId) {
    try {
      let list = this.getRequests();
      list = list.filter(r => r.id !== reqId);
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  },

  // --- GitHub Sync Methods ---
  getGitHubConfig() {
    try {
      const data = localStorage.getItem("sinhalaflix_github_config_v1");
      return data ? JSON.parse(data) : { owner: "", repo: "", branch: "main", token: "" };
    } catch (e) {
      return { owner: "", repo: "", branch: "main", token: "" };
    }
  },

  saveGitHubConfig(cfg) {
    try {
      localStorage.setItem("sinhalaflix_github_config_v1", JSON.stringify(cfg));
      return true;
    } catch (e) {
      return false;
    }
  },

  generateDataJsCode() {
    const catalog = this.getFullCatalog();
    const comments = (typeof INITIAL_COMMENTS !== "undefined") ? INITIAL_COMMENTS : [];
    const timestamp = new Date().toISOString();
    return `/**
 * SinhalaFlix Hub - Dataset
 * Automatically Published via Admin Panel
 * Last Updated: ${timestamp}
 */

const INITIAL_CATALOG = ${JSON.stringify(catalog, null, 2)};

const INITIAL_COMMENTS = ${JSON.stringify(comments, null, 2)};
`;
  },

  downloadDataJsFile() {
    const code = this.generateDataJsCode();
    const blob = new Blob([code], { type: "application/javascript;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  utf8ToBase64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  },

  async publishToGitHub(onProgress) {
    const log = (msg) => {
      console.log("[GitHub Sync]", msg);
      if (typeof onProgress === "function") onProgress(msg);
    };

    const cfg = this.getGitHubConfig();
    const owner = (cfg.owner || "").trim();
    const repo = (cfg.repo || "").trim();
    const branch = (cfg.branch || "main").trim();
    const token = (cfg.token || "").trim();

    if (!owner || !repo || !token) {
      throw new Error("GitHub Configuration incomplete. Please configure your Username, Repository, and Personal Access Token in the Database & Tools tab.");
    }

    log("Preparing catalog data with all additions & edits...");
    const dataJsCode = this.generateDataJsCode();
    const filePath = "js/data.js";
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`;

    log("Checking current file status on GitHub...");
    let sha = null;
    try {
      const getResp = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.github.v3+json"
        }
      });

      if (getResp.ok) {
        const fileInfo = await getResp.json();
        sha = fileInfo.sha;
        log("Existing js/data.js found on GitHub (SHA: " + sha.substring(0, 7) + "). Updating...");
      } else if (getResp.status === 404) {
        log("js/data.js not found on branch. Creating new file...");
      } else {
        const errJson = await getResp.json().catch(() => ({}));
        throw new Error(errJson.message || `GitHub returned HTTP ${getResp.status}`);
      }
    } catch (netErr) {
      if (netErr.message && !netErr.message.includes("HTTP")) {
        throw new Error("Failed to connect to GitHub: " + netErr.message);
      }
      throw netErr;
    }

    log("Encoding data and sending commit to GitHub...");
    const base64Content = this.utf8ToBase64(dataJsCode);

    const putBody = {
      message: `Update SinhalaFlix Catalog via Admin Panel (${new Date().toLocaleString()}) [skip ci]`,
      content: base64Content,
      branch: branch
    };
    if (sha) putBody.sha = sha;

    const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const putResp = await fetch(putUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(putBody)
    });

    if (!putResp.ok) {
      const putErr = await putResp.json().catch(() => ({}));
      throw new Error(putErr.message || `Commit failed with HTTP ${putResp.status}`);
    }

    log("Commit pushed to GitHub successfully! 🚀 GitHub Pages will update for all devices within 1-2 minutes.");
    return { success: true, timestamp: new Date().toISOString() };
  }
};
