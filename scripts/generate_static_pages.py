import re
import os
import html

def slugify(text):
    text = str(text or "movie").lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-') or "movie"

def generate_movie_html(item_id, title_en, title_si, synopsis):
    safe_en = html.escape(title_en or "SinhalaFlix Hub")
    safe_si = html.escape(title_si or "")
    page_title = f"{safe_en}{f' ({safe_si})' if safe_si else ''} | SinhalaFlix Hub"
    safe_desc = html.escape(synopsis or "Watch online and download Sinhala dubbed movies, cartoons, K-Dramas and teledramas in 1080p FHD quality.")

    # Note: Strictly NO social preview tags (og:* or twitter:*) per user requirement
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{page_title}</title>
  <meta name="description" content="{safe_desc}" />
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
    window.PRELOADED_MEDIA_ID = "{item_id}";
  </script>

  <!-- Scripts with cache busting -->
  <script src="js/data.js?v=20260916_12"></script>
  <script src="js/storage.js?v=20260916_12"></script>
  <script src="js/movie-page.js?v=20260916_12"></script>

  <!-- Enforce 16:9 Backdrop Image for All Episode Cards -->
  <script>
    (function () {{
      function apply16x9Backdrop() {{
        var grid = document.getElementById("mpEpGrid");
        if (!grid) return;
        var id = window.PRELOADED_MEDIA_ID || new URLSearchParams(window.location.search).get("id");
        if (!id || typeof StorageService === "undefined") return;

        var catalog = StorageService.getFullCatalog();
        var item = catalog.find(function(c) {{ return c.id === id; }});
        if (!item) return;

        var img16x9 = (item.backdrop && item.backdrop.trim()) ? item.backdrop.trim() : "";
        if (!img16x9 && item.episodes && item.episodes[0] && item.episodes[0].thumbnail) {{
          img16x9 = item.episodes[0].thumbnail;
        }}

        var cards = grid.querySelectorAll(".mp-ep-card");
        cards.forEach(function(card) {{
          if (img16x9) {{
            var img = card.querySelector(".mp-ep-thumb img");
            if (img) {{
              var currentSrc = img.getAttribute("src");
              if (currentSrc !== img16x9 && img.src !== img16x9) {{
                img.src = img16x9;
              }}
            }}
          }}
        }});
      }}

      window.addEventListener("DOMContentLoaded", apply16x9Backdrop);
      window.addEventListener("load", apply16x9Backdrop);
      setTimeout(apply16x9Backdrop, 50);
      setTimeout(apply16x9Backdrop, 200);
      setTimeout(apply16x9Backdrop, 500);
      setTimeout(apply16x9Backdrop, 1200);

      try {{
        var target = document.getElementById("mpEpGrid");
        if (target && window.MutationObserver) {{
          var obs = new MutationObserver(function() {{ apply16x9Backdrop(); }});
          obs.observe(target, {{ childList: true, subtree: true }});
        }}
      }} catch(e) {{}}
    }})();
  </script>

</body>
</html>
"""

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    data_path = os.path.join(root_dir, "js", "data.js")

    with open(data_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find items using regex in INITIAL_CATALOG
    # Items start with { and have id: "..."
    item_blocks = re.findall(r'\{\s*id:\s*"([^"]+)"(.*?)downloadQualities:', content, re.DOTALL)
    
    print(f"Found {len(item_blocks)} items in INITIAL_CATALOG")
    created_files = []

    for item_id, block in item_blocks:
        m_en = re.search(r'titleEnglish:\s*"([^"]+)"', block)
        title_en = m_en.group(1) if m_en else item_id
        
        m_si = re.search(r'titleSinhala:\s*"([^"]+)"', block)
        title_si = m_si.group(1) if m_si else ""
        
        m_syn = re.search(r'synopsisEnglish:\s*"([^"]+)"', block)
        synopsis = m_syn.group(1) if m_syn else ""

        slug = slugify(title_en)
        filename = f"{slug}.html"
        filepath = os.path.join(root_dir, filename)

        html_code = generate_movie_html(item_id, title_en, title_si, synopsis)
        
        # Verify no social preview tags exist
        assert "og:" not in html_code, f"Error: og: tag found in {filename}"
        assert "twitter:" not in html_code, f"Error: twitter: tag found in {filename}"

        with open(filepath, "w", encoding="utf-8") as out_f:
            out_f.write(html_code)
        
        created_files.append(filename)
        print(f"Generated: {filename} (ID: {item_id})")

    print(f"\nSUCCESS! Generated {len(created_files)} standalone static HTML movie pages.")
    print("Zero social preview tags (og/twitter) included as requested.")

if __name__ == "__main__":
    main()
