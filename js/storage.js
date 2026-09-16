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
  // --- Cryptographic Security Vault ---
  _AUTH_SALT: "sinhalaflix_secure_vault_2026",
  _MASTER_AUTH_HASH: "88767b8d33c03a777ce767f064d2b3e6ac24bcf4bf346b355a25b1564d414a8a",
  _SESSION_TOKEN_HASH: "9359da5b613a7698b54a1c7c47cecd87f42fb429abf40b7a8b544bb29fc2b293",

  _sha256(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length';
    var i, j;
    var result = '';
    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;
    var hash = [];
    var k = [];
    var primeCounter = 0;
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += '\x80';
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) return;
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
    words[words[lengthProperty]] = asciiBitLength;
    for (j = 0; j < words[lengthProperty];) {
      var w = words.slice(j, j += 16);
      var oldHash = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2];
        var s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        var s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;
        var ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
        var maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
        var temp1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + w[i]) | 0;
        var temp2 = ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj) | 0;
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += ((b < 16) ? 0 : '') + b.toString(16);
      }
    }
    return result;
  },

  // --- Admin Authentication ---
  isAdminLoggedIn() {
    try {
      const token = sessionStorage.getItem("sfx_admin_token") || localStorage.getItem("sfx_admin_token");
      if (token === this._SESSION_TOKEN_HASH) return true;
      const ghSession = sessionStorage.getItem("sfx_gh_session_token") || localStorage.getItem("sfx_gh_session_token");
      const ghUser = sessionStorage.getItem("sfx_gh_user") || localStorage.getItem("sfx_gh_user");
      if (ghSession && ghUser) return true;
      const googleSession = sessionStorage.getItem("sfx_google_session_token") || localStorage.getItem("sfx_google_session_token");
      const googleUser = sessionStorage.getItem("sfx_google_user") || localStorage.getItem("sfx_google_user");
      if (googleSession && googleUser) return true;
      return false;
    } catch (e) {
      return false;
    }
  },

  getAdminProfile() {
    try {
      const googleUserStr = sessionStorage.getItem("sfx_google_user") || localStorage.getItem("sfx_google_user");
      if (googleUserStr) {
        const gu = JSON.parse(googleUserStr);
        return {
          type: "google",
          login: gu.email,
          name: gu.name || gu.email,
          avatar_url: gu.avatar_url || "",
          badge: `Google: ${gu.email}`
        };
      }
      const ghUserStr = sessionStorage.getItem("sfx_gh_user") || localStorage.getItem("sfx_gh_user");
      if (ghUserStr) {
        const u = JSON.parse(ghUserStr);
        return {
          type: "github",
          login: u.login,
          name: u.name || u.login,
          avatar_url: u.avatar_url || `https://github.com/identicons/${u.login}.png`,
          html_url: u.html_url || `https://github.com/${u.login}`,
          badge: `@${u.login}`
        };
      }
    } catch (e) {}
    return {
      type: "master",
      login: "sinhalaflix2006",
      name: "Master Administrator",
      avatar_url: "",
      badge: "👑 Master Admin"
    };
  },

  // --- Firebase & Google Authentication ---
  getFirebaseConfig() {
    try {
      const data = localStorage.getItem("sinhalaflix_firebase_config_v1");
      return data ? JSON.parse(data) : null;
    } catch(e) {
      return null;
    }
  },

  saveFirebaseConfig(cfg) {
    try {
      if (cfg) {
        localStorage.setItem("sinhalaflix_firebase_config_v1", JSON.stringify(cfg));
      } else {
        localStorage.removeItem("sinhalaflix_firebase_config_v1");
      }
      return true;
    } catch(e) {
      console.warn("Failed to save Firebase config:", e);
      return false;
    }
  },

  verifyGoogleLogin(googleUser, remember = true) {
    if (!googleUser || !googleUser.email) {
      return { success: false, message: "No Google account information received." };
    }

    const email = googleUser.email.trim().toLowerCase();
    const fbConfig = this.getFirebaseConfig();
    const authorizedEmail = fbConfig && fbConfig.authorizedEmail ? fbConfig.authorizedEmail.trim().toLowerCase() : "";

    // If an authorized email is configured, strictly enforce it
    if (authorizedEmail && email !== authorizedEmail) {
      return {
        success: false,
        message: `Access Denied: Google account (${email}) is not authorized. Required administrator account: ${authorizedEmail}.`
      };
    }

    // If no authorized email was configured yet, register this email as authorized admin
    if (!authorizedEmail && fbConfig) {
      fbConfig.authorizedEmail = email;
      this.saveFirebaseConfig(fbConfig);
    }

    const sessionSignature = this._sha256(`sfx_google_session::${googleUser.uid || email}::${this._AUTH_SALT}`);
    const userProfile = {
      email: email,
      name: googleUser.displayName || email.split("@")[0],
      avatar_url: googleUser.photoURL || "",
      uid: googleUser.uid || "",
      verifiedAt: Date.now()
    };

    try {
      if (remember) {
        localStorage.setItem("sfx_google_session_token", sessionSignature);
        localStorage.setItem("sfx_google_user", JSON.stringify(userProfile));
        localStorage.setItem("sfx_admin_auth_type", "google");
        localStorage.setItem("sfx_admin_v2", "true");
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
      }
      sessionStorage.setItem("sfx_google_session_token", sessionSignature);
      sessionStorage.setItem("sfx_google_user", JSON.stringify(userProfile));
      sessionStorage.setItem("sfx_admin_auth_type", "google");
      sessionStorage.setItem("sfx_admin_v2", "true");
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
    } catch(e) {
      console.warn("Google session storage write error:", e);
    }

    return { success: true, user: userProfile };
  },

  async verifyGitHubLogin(rawToken, remember = true) {
    const token = (rawToken || "").trim();
    if (!token) {
      return { success: false, message: "Please enter your GitHub Personal Access Token." };
    }

    try {
      // 1. Verify token against official GitHub User API
      const userResp = await fetch("https://api.github.com/user", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.github.v3+json"
        }
      });

      if (userResp.status === 401) {
        return { success: false, message: "Invalid GitHub Token. GitHub rejected authentication (401 Unauthorized)." };
      }
      if (!userResp.ok) {
        const err = await userResp.json().catch(() => ({}));
        return { success: false, message: err.message || `GitHub server returned error HTTP ${userResp.status}` };
      }

      const userData = await userResp.json();

      // 2. Verify repository access and push permissions for sinhalaflix/sinhalaflix
      const repoResp = await fetch("https://api.github.com/repos/sinhalaflix/sinhalaflix", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.github.v3+json"
        }
      });

      let hasPush = false;
      let repoOwner = "sinhalaflix";
      let repoName = "sinhalaflix";
      let defaultBranch = "main";

      if (repoResp.ok) {
        const repoData = await repoResp.json();
        defaultBranch = repoData.default_branch || "main";
        if (repoData.owner && repoData.owner.login) {
          repoOwner = repoData.owner.login;
        }
        const isOwner = (repoData.owner && repoData.owner.login && repoData.owner.login.toLowerCase() === userData.login.toLowerCase());
        const perms = repoData.permissions || {};
        if (isOwner || perms.push || perms.admin) {
          hasPush = true;
        }
      }

      // Check if user is repository owner or collaborator with push access
      if (!hasPush && userData.login.toLowerCase() !== "sinhalaflix") {
        return {
          success: false,
          message: `Access Denied: GitHub user @${userData.login} does not have push or write permissions to repository sinhalaflix/sinhalaflix.`
        };
      }

      // Generate a secure session signature for this verified session
      const sessionSignature = this._sha256(`sfx_gh_session::${token}::${this._AUTH_SALT}`);
      const userProfile = {
        login: userData.login,
        name: userData.name || userData.login,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        verifiedAt: Date.now()
      };

      try {
        if (remember) {
          localStorage.setItem("sfx_gh_session_token", sessionSignature);
          localStorage.setItem("sfx_gh_user", JSON.stringify(userProfile));
          localStorage.setItem("sfx_admin_auth_type", "github");
          localStorage.setItem("sfx_admin_v2", "true");
          localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
        }
        sessionStorage.setItem("sfx_gh_session_token", sessionSignature);
        sessionStorage.setItem("sfx_gh_user", JSON.stringify(userProfile));
        sessionStorage.setItem("sfx_admin_auth_type", "github");
        sessionStorage.setItem("sfx_admin_v2", "true");
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");

        // Automatically configure GitHub Live Sync with this authenticated token!
        this.saveGitHubConfig({
          owner: repoOwner,
          repo: repoName,
          branch: defaultBranch,
          token: token
        });
      } catch (e) {
        console.warn("Session storage write error:", e);
      }

      return { success: true, user: userProfile };
    } catch (netErr) {
      return { success: false, message: "Network error connecting to GitHub: " + (netErr.message || "Failed to fetch") };
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

    if (!u || !p1 || !p2) {
      return { success: false, message: "All authentication fields are required." };
    }

    const payload = `${this._AUTH_SALT}::${u}::${p1}::${p2}`;
    const computedHash = this._sha256(payload);

    if (computedHash === this._MASTER_AUTH_HASH) {
      try {
        if (remember) {
          localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
          localStorage.setItem("sfx_admin_v2", "true");
          localStorage.setItem("sfx_admin_token", this._SESSION_TOKEN_HASH);
          localStorage.setItem("sfx_admin_auth_type", "master");
        }
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
        sessionStorage.setItem("sfx_admin_v2", "true");
        sessionStorage.setItem("sfx_admin_token", this._SESSION_TOKEN_HASH);
        sessionStorage.setItem("sfx_admin_auth_type", "master");
      } catch (err) {
        console.warn("Storage write error:", err);
      }
      return { success: true };
    }
    return { success: false, message: "Invalid administrator credentials. Access denied." };
  },

  adminLogout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      localStorage.removeItem("sfx_admin_v2");
      localStorage.removeItem("sfx_admin_token");
      localStorage.removeItem("sfx_gh_session_token");
      localStorage.removeItem("sfx_gh_user");
      localStorage.removeItem("sfx_google_session_token");
      localStorage.removeItem("sfx_google_user");
      localStorage.removeItem("sfx_admin_auth_type");
      localStorage.removeItem("sinhalaflix_admin_authenticated");

      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      sessionStorage.removeItem("sfx_admin_v2");
      sessionStorage.removeItem("sfx_admin_token");
      sessionStorage.removeItem("sfx_gh_session_token");
      sessionStorage.removeItem("sfx_gh_user");
      sessionStorage.removeItem("sfx_google_session_token");
      sessionStorage.removeItem("sfx_google_user");
      sessionStorage.removeItem("sfx_admin_auth_type");
      sessionStorage.removeItem("sinhalaflix_admin_authenticated");

      // Sign out from Firebase if active
      if (typeof firebase !== "undefined" && firebase.auth && firebase.apps && firebase.apps.length) {
        try { firebase.auth().signOut(); } catch(err) {}
      }
    } catch (e) {
      console.warn("Logout cleanup error:", e);
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
  },

  /**
   * Generates a clean URL slug for a movie/series item
   */
  generateMovieSlug(item) {
    if (!item) return "movie";
    const raw = (item.titleEnglish || item.titleSinhala || item.id || "movie")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return raw || "movie-" + (item.id || Date.now());
  },

  /**
   * Generates a standalone static HTML file content for an item (without social preview tags)
   */
  generateStaticMovieHtml(item) {
    if (!item) return "";
    const safeTitleEn = (item.titleEnglish || "SinhalaFlix Hub").replace(/"/g, '&quot;');
    const safeTitleSi = (item.titleSinhala || "").replace(/"/g, '&quot;');
    const pageTitle = `${safeTitleEn}${safeTitleSi ? ' (' + safeTitleSi + ')' : ''} | SinhalaFlix Hub`;
    const safeDesc = (item.synopsis || "Watch online and download Sinhala dubbed movies, cartoons, K-Dramas and teledramas in 1080p FHD quality.").replace(/"/g, '&quot;');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="${safeDesc}" />
  <meta name="theme-color" content="#080b12" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg" />

  <!-- Stylesheets -->
  <link rel="stylesheet" href="css/main.css?v=20260916_12" />
  <link rel="stylesheet" href="css/movie-page.css?v=20260916_12" />
</head>
<body>

  <!-- ══════════════════════════════════════════
       STICKY HEADER
       ══════════════════════════════════════════ -->
  <header class="mp-header" id="mpHeader">
    <div class="container">
      <div class="mp-header-inner">

        <!-- Back Button -->
        <a href="index.html" class="mp-back-btn" id="btnBackHome">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          <span>Back</span>
        </a>

        <!-- Sticky Title (visible on scroll) -->
        <span class="mp-sticky-title" id="mpStickyTitle"></span>

        <!-- Header Actions -->
        <div class="mp-header-actions">
          <button class="btn btn-secondary btn-sm mp-watchlist-btn" id="mpHeaderWatchlist" title="Watchlist">
            <span>🤍</span>
            <span>Watchlist</span>
          </button>
          <button class="btn btn-secondary btn-sm mp-share-btn" id="mpHeaderShare" title="Share">
            <span>🔗</span>
            <span>Share</span>
          </button>
          <a href="index.html" class="btn btn-primary btn-sm" title="Home">
            <span>🎬</span>
            <span>Home</span>
          </a>
        </div>

      </div>
    </div>
  </header>

  <!-- ══════════════════════════════════════════
       MAIN CONTENT
       ══════════════════════════════════════════ -->
  <main class="mp-main" id="mpMain">

    <!-- ── Hero Banner ── -->
    <section class="mp-hero" id="mpHero">
      <div class="mp-hero-backdrop" id="mpBackdrop"></div>
      <div class="mp-hero-gradient"></div>

      <div class="container mp-hero-container">
        <div class="mp-hero-layout">

          <!-- Poster Column -->
          <div class="mp-poster-col">
            <div class="mp-poster-wrapper">
              <img id="mpPoster" src="" alt="Poster" class="mp-poster-img" />
              <div class="mp-poster-badge" id="mpQualityBadge">FHD 1080p</div>
            </div>
            <!-- Action buttons below poster -->
            <div class="mp-poster-actions">
              <button class="btn btn-primary btn-block mp-watch-btn" id="btnWatchOnline">
                <span>▶</span>
                <span>Watch Online</span>
              </button>
              <button class="btn btn-accent btn-block mp-dl-quick-btn" id="btnQuickDownload">
                <span>⬇</span>
                <span>Download</span>
              </button>
            </div>
          </div>

          <!-- Info Column -->
          <div class="mp-info-col">

            <!-- Category & Type Pills -->
            <div class="mp-meta-badges" id="mpMetaBadges">
              <!-- populated by JS -->
            </div>

            <!-- Title -->
            <h1 class="mp-title" id="mpTitleEnglish"></h1>
            <h2 class="mp-title-si" id="mpTitleSinhala"></h2>

            <!-- Key Meta: Year, Runtime, Rating, Audio -->
            <div class="mp-meta-row" id="mpMetaRow">
              <!-- populated by JS -->
            </div>

            <!-- Genres -->
            <div class="mp-genres" id="mpGenres">
              <!-- populated by JS -->
            </div>

            <!-- Synopsis -->
            <div class="mp-synopsis-block">
              <h3 class="mp-synopsis-label">Overview</h3>
              <p class="mp-synopsis-text" id="mpSynopsis"></p>
            </div>

            <!-- Credits & Cast -->
            <div class="mp-credits-block" id="mpCreditsBlock">
              <!-- populated by JS -->
            </div>

            <!-- Notice / Guide Alert Box -->
            <div class="mp-notice-box" id="mpNoticeBox">
              <div class="mp-notice-header">
                <span class="mp-notice-icon">💡</span>
                <strong>Server එක Change කරන්නේ කොහොමද? — How to switch servers?</strong>
              </div>
              <p class="mp-notice-body">
                🎬 Video එක Load නොවී Buffering වෙනවා නම්, ඉහළින් තියෙන “Server 2” Button එක Click කරන්න.
              </p>
            </div>

          </div><!-- /info-col -->

        </div><!-- /layout -->
      </div><!-- /container -->
    </section>

    <!-- ── Video Player Section ── -->
    <section class="mp-player-section" id="playerSection">
      <div class="container">

        <!-- Server Switcher Bar -->
        <div class="mp-player-topbar">
          <div class="mp-server-selector">
            <span class="mp-server-label">Servers:</span>
            <div class="mp-server-tabs" id="mpServerTabs">
              <!-- populated by JS -->
            </div>
          </div>
          <!-- Quality Selector -->
          <div class="mp-quality-selector" id="mpQualitySelector">
            <!-- populated by JS if multiple qualities -->
          </div>
        </div>

        <!-- Guidance Alerts -->
        <div class="mp-server-alert" id="mpServerAlert">
          <!-- populated dynamically by JS switchServer() -->
        </div>
        <div class="mp-redirect-alert" id="mpRedirectAlert">
          <span class="mp-alert-icon">🚨</span>
          <span><strong>වැදගත්:</strong> වෙනත් සයිට් එකකට Redirect වුණොත් 🕒 තත්පර කිහිපයක් රැඳී සිට Back වී, 🎬 Play Button එක නැවත Click කරන්න.</span>
        </div>

        <!-- Video Frame Container (16:9) -->
        <div class="mp-player-wrapper" id="playerWrapper">
          <div class="mp-player-loader" id="playerLoader">
            <div class="mp-spinner"></div>
            <span>Loading player...</span>
          </div>
          <iframe
            id="mpIframe"
            class="mp-iframe"
            src=""
            allowfullscreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            sandbox="allow-forms allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
            referrerpolicy="no-referrer"
          ></iframe>
        </div>

        <!-- Current Episode Info Bar (for series) -->
        <div class="mp-now-playing-bar" id="mpNowPlayingBar" style="display:none;">
          <span id="mpNowPlayingText">Episode 1</span>
          <div class="mp-ep-nav-btns">
            <button class="btn btn-secondary btn-sm" id="btnPrevEp" disabled>⏮ Prev Episode</button>
            <button class="btn btn-secondary btn-sm" id="btnNextEp">Next Episode ⏭</button>
          </div>
        </div>

      </div>
    </section>

    <!-- ── Episodes Section (Series Only) ── -->
    <section class="mp-episodes-section" id="episodesSection" style="display:none;">
      <div class="container">
        <div class="mp-section-header">
          <h2>📺 All Episodes</h2>
          <span class="mp-ep-count-badge" id="mpEpCountBadge">0 Episodes</span>
        </div>
        <div class="mp-episodes-grid" id="mpEpGrid">
          <!-- populated by JS -->
        </div>
      </div>
    </section>

    <!-- ── Download Section ── -->
    <section class="mp-download-section" id="downloadSection">
      <div class="container">
        <div class="mp-section-header">
          <h2>⬇️ Download Links</h2>
          <span class="mp-badge mp-badge-fhd">1080p FHD Direct</span>
        </div>

        <div class="mp-download-card">
          <div class="mp-dl-info">
            <div class="mp-dl-title-group">
              <span class="mp-dl-item-title" id="mpDlItemTitle"></span>
              <span class="mp-dl-file-info" id="mpDlFileInfo">1080p • MP4 • Sinhala Audio</span>
            </div>
            <div class="mp-dl-badge-group">
              <span class="mp-badge mp-badge-green">High Speed</span>
              <span class="mp-badge mp-badge-gold">No Ads / Free</span>
            </div>
          </div>

          <!-- Series episode download selector -->
          <div class="mp-dl-ep-picker" id="mpDlEpPicker" style="display:none;">
            <label for="mpDlEpSelect">Select Episode to Download:</label>
            <select id="mpDlEpSelect" class="form-select"></select>
          </div>

          <!-- Notice Alert for Download Section -->
          <div class="mp-redirect-alert" style="margin-bottom: 1.25rem;">
            <span class="mp-alert-icon">🚨</span>
            <span><strong>වැදගත්:</strong> වෙනත් සයිට් එකකට Redirect වුණොත් 🕒 තත්පර කිහිපයක් රැඳී සිට Back වී, ⬇️ Download Button එක නැවත Click කරන්න.</span>
          </div>

          <!-- Download Action Buttons -->
          <div class="mp-dl-buttons" id="mpDlButtons">
            <!-- populated by JS -->
          </div>

          <p class="mp-dl-hint">
            💡 <strong>Tip:</strong> Buzzheavier links give maximum download speed without waiting times.
            Google Drive links may require you to sign in with your Google account.
          </p>
        </div>
      </div>
    </section>

    <!-- ── Related Titles ── -->
    <section class="mp-related-section" id="relatedSection">
      <div class="container">
        <div class="mp-section-header">
          <h2>🍿 You May Also Like</h2>
        </div>
        <div class="mp-related-grid" id="mpRelatedGrid">
          <!-- populated by JS -->
        </div>
      </div>
    </section>

  </main>

  <!-- ══════════════════════════════════════════
       FOOTER
       ══════════════════════════════════════════ -->
  <footer class="mp-footer">
    <div class="container">
      <div class="mp-footer-inner">
        <span>© 2026 SinhalaFlix Hub. All Rights Reserved. Made with ❤️ for Sri Lankan Entertainment Lovers.</span>
        <a href="index.html">← Back to Home</a>
      </div>
    </div>
  </footer>

  <!-- Toast Container -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- Preloaded Media ID -->
  <script>
    window.PRELOADED_MEDIA_ID = "${item.id}";
  </script>

  <!-- Scripts with cache busting -->
  <script src="js/data.js?v=20260916_12"></script>
  <script src="js/storage.js?v=20260916_12"></script>
  <script src="js/movie-page.js?v=20260916_12"></script>

  <!-- Enforce 16:9 Backdrop Image for All Episode Cards -->
  <script>
    (function () {
      function apply16x9Backdrop() {
        var grid = document.getElementById("mpEpGrid");
        if (!grid) return;
        var id = window.PRELOADED_MEDIA_ID || new URLSearchParams(window.location.search).get("id");
        if (!id || typeof StorageService === "undefined") return;

        var catalog = StorageService.getFullCatalog();
        var item = catalog.find(function(c) { return c.id === id; });
        if (!item) return;

        var img16x9 = (item.backdrop && item.backdrop.trim()) ? item.backdrop.trim() : "";
        if (!img16x9 && item.episodes && item.episodes[0] && item.episodes[0].thumbnail) {
          img16x9 = item.episodes[0].thumbnail;
        }

        var cards = grid.querySelectorAll(".mp-ep-card");
        cards.forEach(function(card) {
          if (img16x9) {
            var img = card.querySelector(".mp-ep-thumb img");
            if (img) {
              var currentSrc = img.getAttribute("src");
              if (currentSrc !== img16x9 && img.src !== img16x9) {
                img.src = img16x9;
              }
            }
          }
        });
      }

      window.addEventListener("DOMContentLoaded", apply16x9Backdrop);
      window.addEventListener("load", apply16x9Backdrop);
      setTimeout(apply16x9Backdrop, 50);
      setTimeout(apply16x9Backdrop, 200);
      setTimeout(apply16x9Backdrop, 500);
      setTimeout(apply16x9Backdrop, 1200);

      try {
        var target = document.getElementById("mpEpGrid");
        if (target && window.MutationObserver) {
          var obs = new MutationObserver(function() { apply16x9Backdrop(); });
          obs.observe(target, { childList: true, subtree: true });
        }
      } catch(e) {}
    })();
  </script>

</body>
</html>
`;
  },

  /**
   * Prompts browser to download the standalone HTML page for an item
   */
  downloadMovieHtmlFile(item) {
    if (!item) return null;
    const htmlContent = this.generateStaticMovieHtml(item);
    const slug = this.generateMovieSlug(item);
    const filename = slug + ".html";

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 300);
    return filename;
  }
};

if (typeof window !== "undefined") {
  window.StorageService = StorageService;
}

