/**
 * ============================================================
 * UMER SURTI — VIP DEVELOPER PORTFOLIO
 * DEVELOPER DASHBOARD LOGIC (js/dashboard.js)
 * High-performance vanilla logic for sidebar, metrics,
 * SVG charts, and interactive file explorer.
 * ============================================================
 */

(function () {
  'use strict';

  // --- Static Fallback Metrics (guarantees offline/file:// protocol operation) ---
  const FALLBACK_METRICS = {
  "git": {
    "repository": "https://github.com/umersurti17-svg/final-portfolio.git",
    "branch": "main",
    "latestCommit": "48f943fdba38cfb67883c31c9a3e29dcf3e3f499",
    "shortCommit": "48f943f",
    "commitMessage": "Upgrade Umer Surti VIP portfolio",
    "status": "Clean / Up to date with origin/main"
  },
  "deployment": {
    "githubPages": {
      "status": "Supported",
      "config": ".nojekyll"
    },
    "vercel": {
      "status": "Supported",
      "config": "vercel.json"
    },
    "netlify": {
      "status": "Supported",
      "config": "netlify.toml"
    }
  },
  "totals": {
    "sourceFiles": 16,
    "imageFiles": 6,
    "allFiles": 22,
    "sourceBytes": 243340,
    "imageBytes": 3531627,
    "allBytes": 3774967,
    "lines": 7493,
    "codeLines": 6217,
    "commentLines": 432,
    "blankLines": 844
  },
  "languages": {
    "HTML": {
      "lines": 1953,
      "codeLines": 1610,
      "commentLines": 180,
      "blankLines": 163,
      "bytes": 101111,
      "files": 2
    },
    "CSS": {
      "lines": 3644,
      "codeLines": 3127,
      "commentLines": 80,
      "blankLines": 437,
      "bytes": 76706,
      "files": 4
    },
    "JavaScript": {
      "lines": 1621,
      "codeLines": 1309,
      "commentLines": 118,
      "blankLines": 194,
      "bytes": 59846,
      "files": 4
    },
    "Config": {
      "lines": 275,
      "codeLines": 171,
      "commentLines": 54,
      "blankLines": 50,
      "bytes": 5677,
      "files": 6
    }
  },
  "files": [
    {
      "path": "index.html",
      "name": "index.html",
      "lang": "HTML",
      "category": "Markup",
      "description": "Main VIP Developer Portfolio Homepage (7 sections + modal + mobile drawer)",
      "sizeBytes": 56496,
      "totalLines": 1113,
      "codeLines": 875,
      "commentLines": 137,
      "blankLines": 101
    },
    {
      "path": "dashboard.html",
      "name": "dashboard.html",
      "lang": "HTML",
      "category": "Markup",
      "description": "Developer Architecture & Technical Showcase Dashboard",
      "sizeBytes": 44615,
      "totalLines": 840,
      "codeLines": 735,
      "commentLines": 43,
      "blankLines": 62
    },
    {
      "path": "css/luxury-tokens.css",
      "name": "luxury-tokens.css",
      "lang": "CSS",
      "category": "Design System",
      "description": "Luxury dark color tokens, gradients, glass tokens, fluid typography",
      "sizeBytes": 3837,
      "totalLines": 97,
      "codeLines": 71,
      "commentLines": 12,
      "blankLines": 14
    },
    {
      "path": "css/animations.css",
      "name": "animations.css",
      "lang": "CSS",
      "category": "Animations",
      "description": "Keyframes, metallic shimmers, reduced-motion overrides",
      "sizeBytes": 4686,
      "totalLines": 245,
      "codeLines": 206,
      "commentLines": 10,
      "blankLines": 29
    },
    {
      "path": "css/style.css",
      "name": "style.css",
      "lang": "CSS",
      "category": "Styles",
      "description": "Core portfolio styling, 3D card tilt, responsive grid, luxury footer",
      "sizeBytes": 50678,
      "totalLines": 2460,
      "codeLines": 2133,
      "commentLines": 38,
      "blankLines": 289
    },
    {
      "path": "css/dashboard.css",
      "name": "dashboard.css",
      "lang": "CSS",
      "category": "Styles",
      "description": "Dedicated styles for developer showcase dashboard & sidebar",
      "sizeBytes": 17505,
      "totalLines": 842,
      "codeLines": 717,
      "commentLines": 20,
      "blankLines": 105
    },
    {
      "path": "js/three-particles.js",
      "name": "three-particles.js",
      "lang": "JavaScript",
      "category": "3D Graphics",
      "description": "Three.js particle galaxy, drift-free light trails, tab visibility",
      "sizeBytes": 8822,
      "totalLines": 261,
      "codeLines": 194,
      "commentLines": 19,
      "blankLines": 48
    },
    {
      "path": "js/animations.js",
      "name": "animations.js",
      "lang": "JavaScript",
      "category": "Motion",
      "description": "GSAP 3 & ScrollTrigger timeline orchestration and defensive fallbacks",
      "sizeBytes": 13670,
      "totalLines": 486,
      "codeLines": 411,
      "commentLines": 42,
      "blankLines": 33
    },
    {
      "path": "js/app.js",
      "name": "app.js",
      "lang": "JavaScript",
      "category": "Core App",
      "description": "Lenis smooth scroll, mobile drawer state, contact validation & mailto fallback",
      "sizeBytes": 15865,
      "totalLines": 406,
      "codeLines": 322,
      "commentLines": 29,
      "blankLines": 55
    },
    {
      "path": "js/dashboard.js",
      "name": "dashboard.js",
      "lang": "JavaScript",
      "category": "Dashboard Logic",
      "description": "Interactive sidebar, metrics counters, chart rendering, file explorer",
      "sizeBytes": 21489,
      "totalLines": 468,
      "codeLines": 382,
      "commentLines": 28,
      "blankLines": 58
    },
    {
      "path": "package.json",
      "name": "package.json",
      "lang": "JSON",
      "category": "Configuration",
      "description": "Project metadata, npm validation scripts, and keywords",
      "sizeBytes": 808,
      "totalLines": 28,
      "codeLines": 27,
      "commentLines": 0,
      "blankLines": 1
    },
    {
      "path": "vercel.json",
      "name": "vercel.json",
      "lang": "JSON",
      "category": "Deployment",
      "description": "Vercel edge caching rules, clean URLs, and HTTP security headers",
      "sizeBytes": 1111,
      "totalLines": 56,
      "codeLines": 55,
      "commentLines": 0,
      "blankLines": 1
    },
    {
      "path": "netlify.toml",
      "name": "netlify.toml",
      "lang": "TOML",
      "category": "Deployment",
      "description": "Netlify deployment configuration, publish directory, and security headers",
      "sizeBytes": 596,
      "totalLines": 26,
      "codeLines": 21,
      "commentLines": 0,
      "blankLines": 5
    },
    {
      "path": ".env.example",
      "name": ".env.example",
      "lang": "Config",
      "category": "Environment",
      "description": "Environment variables template with documented placeholder keys",
      "sizeBytes": 763,
      "totalLines": 17,
      "codeLines": 0,
      "commentLines": 13,
      "blankLines": 4
    },
    {
      "path": ".gitignore",
      "name": ".gitignore",
      "lang": "Git",
      "category": "Git",
      "description": "Git ignore rules for secrets, hosting builds, IDEs, and OS artifacts",
      "sizeBytes": 2399,
      "totalLines": 147,
      "codeLines": 68,
      "commentLines": 41,
      "blankLines": 38
    },
    {
      "path": ".nojekyll",
      "name": ".nojekyll",
      "lang": "Config",
      "category": "Deployment",
      "description": "Bypasses Jekyll parser on GitHub Pages for direct static asset delivery",
      "sizeBytes": 0,
      "totalLines": 1,
      "codeLines": 0,
      "commentLines": 0,
      "blankLines": 1
    }
  ],
  "images": [
    {
      "path": "assets/images/profile.jpg",
      "name": "profile.jpg",
      "description": "Authentic portrait of Umer Surti (Hero & About frames)",
      "sizeBytes": 553989
    },
    {
      "path": "assets/images/project1.jpg",
      "name": "project1.jpg",
      "description": "Velasco Couture Haute Horlogerie & Fashion Platform screenshot",
      "sizeBytes": 570981
    },
    {
      "path": "assets/images/project2.jpg",
      "name": "project2.jpg",
      "description": "Aether Banking Wealth Management & Fintech UI screenshot",
      "sizeBytes": 683044
    },
    {
      "path": "assets/images/project3.jpg",
      "name": "project3.jpg",
      "description": "Vertex Analytics Spatial Intelligence & Data Observatory screenshot",
      "sizeBytes": 524792
    },
    {
      "path": "assets/images/gallery1.jpg",
      "name": "gallery1.jpg",
      "description": "Visual concept artwork asset",
      "sizeBytes": 555122
    },
    {
      "path": "assets/images/gallery2.jpg",
      "name": "gallery2.jpg",
      "description": "Visual concept artwork asset",
      "sizeBytes": 643699
    }
  ]
};

  let activeMetrics = FALLBACK_METRICS;
  let currentFilter = 'all';
  let currentSearch = '';

  // --- Initialize on DOMContentLoaded ---
  document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initScrollSpy();
    fetchAndHydrateMetrics();
    initFileExplorer();
  });

  // --- Sidebar Logic ---
  function initSidebar() {
    const sidebar = document.getElementById('dashboard-sidebar');
    const desktopToggle = document.getElementById('desktop-sidebar-toggle');
    const mobileToggle = document.getElementById('mobile-sidebar-toggle');
    const backdrop = document.getElementById('dashboard-backdrop');
    const toggleIcon = document.getElementById('sidebar-toggle-icon');

    // Restore desktop collapsed state
    const isCollapsed = localStorage.getItem('dashboard_sidebar_collapsed') === 'true';
    if (sidebar && isCollapsed && window.innerWidth >= 992) {
      sidebar.classList.add('collapsed');
      if (toggleIcon) {
        toggleIcon.classList.remove('fa-chevron-left');
        toggleIcon.classList.add('fa-chevron-right');
      }
    }

    // Desktop Toggle
    if (desktopToggle && sidebar) {
      desktopToggle.addEventListener('click', () => {
        const collapsed = sidebar.classList.toggle('collapsed');
        localStorage.setItem('dashboard_sidebar_collapsed', collapsed ? 'true' : 'false');
        if (toggleIcon) {
          if (collapsed) {
            toggleIcon.classList.remove('fa-chevron-left');
            toggleIcon.classList.add('fa-chevron-right');
          } else {
            toggleIcon.classList.remove('fa-chevron-right');
            toggleIcon.classList.add('fa-chevron-left');
          }
        }
      });
    }

    // Mobile Toggle
    if (mobileToggle && sidebar && backdrop) {
      mobileToggle.addEventListener('click', () => {
        const open = sidebar.classList.toggle('mobile-open');
        backdrop.classList.toggle('open', open);
      });

      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        backdrop.classList.remove('open');
      });

      // Close on navigation click on mobile
      const navLinks = sidebar.querySelectorAll('.sidebar-nav-link, .sidebar-back-btn');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth < 992) {
            sidebar.classList.remove('mobile-open');
            backdrop.classList.remove('open');
          }
        });
      });
    }
  }

  // --- Scrollspy & Active Section Highlighting ---
  function initScrollSpy() {
    const sections = document.querySelectorAll('.dashboard-section');
    const navLinks = document.querySelectorAll('.sidebar-nav-link');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));
  }

  // --- Fetch & Hydrate Metrics ---
  async function fetchAndHydrateMetrics() {
    try {
      const response = await fetch('js/project-metrics.json');
      if (response.ok) {
        const data = await response.json();
        if (data && data.totals && data.languages) {
          activeMetrics = data;
        }
      }
    } catch (err) {
      console.info('Using embedded fallback metrics (local/offline context):', err.message);
    }

    renderMetricsKPIs(activeMetrics);
    renderCharts(activeMetrics);
    renderFileList();
  }

  // --- KPI Render & Counters ---
  function renderMetricsKPIs(data) {
    const totals = data.totals || {};
    const langs = data.languages || {};

    const elTotalLines = document.getElementById('kpi-total-lines');
    const elSloc = document.getElementById('kpi-sloc');
    const elSourceFiles = document.getElementById('kpi-source-files');
    const elSourceKb = document.getElementById('kpi-source-kb');
    const elMediaFiles = document.getElementById('kpi-media-files');

    if (elTotalLines) animateCounter(elTotalLines, totals.lines || 6500);
    if (elSloc) elSloc.textContent = (totals.codeLines || 5350).toLocaleString();
    if (elSourceFiles) animateCounter(elSourceFiles, totals.sourceFiles || 15);
    if (elSourceKb) elSourceKb.textContent = Math.round((totals.sourceBytes || 204000) / 1024) + ' KB';
    if (elMediaFiles) animateCounter(elMediaFiles, totals.imageFiles || 6);

    // Languages
    const totalLines = totals.lines || 6500;
    const updateLangCard = (prefix, langKey) => {
      const l = langs[langKey] || {};
      const pct = Math.round(((l.lines || 0) / totalLines) * 100);
      const elPct = document.getElementById(prefix + '-pct');
      const elLines = document.getElementById(prefix + '-lines');
      const elSloc = document.getElementById(prefix + '-sloc');
      const elBytes = document.getElementById(prefix + '-bytes');

      if (elPct) elPct.textContent = pct + '% of lines';
      if (elLines) elLines.textContent = (l.lines || 0).toLocaleString();
      if (elSloc) elSloc.textContent = (l.codeLines || 0).toLocaleString();
      if (elBytes) elBytes.textContent = ((l.bytes || 0) / 1024).toFixed(1) + ' KB';
    };

    updateLangCard('html', 'HTML');
    updateLangCard('css', 'CSS');
    updateLangCard('js', 'JavaScript');
    updateLangCard('config', 'Config');
  }

  // --- Smooth Animated Counter ---
  function animateCounter(element, target) {
    const duration = 1200;
    const start = 0;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * ease);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  // --- SVG Charts Render ---
  function renderCharts(data) {
    const totals = data.totals || {};
    const langs = data.languages || {};
    const totalLines = totals.lines || 6500;

    const cssLines = (langs.CSS && langs.CSS.lines) || 3644;
    const jsLines = (langs.JavaScript && langs.JavaScript.lines) || 1450;
    const htmlLines = (langs.HTML && langs.HTML.lines) || 1953;
    const configLines = (langs.Config && langs.Config.lines) || 275;

    // SVG width = 500
    const cssW = Math.max(10, Math.round((cssLines / totalLines) * 490));
    const htmlW = Math.max(10, Math.round((htmlLines / totalLines) * 490));
    const jsW = Math.max(10, Math.round((jsLines / totalLines) * 490));
    const configW = Math.max(6, 490 - (cssW + htmlW + jsW));

    const barCss = document.getElementById('bar-css');
    const barHtml = document.getElementById('bar-html');
    const barJs = document.getElementById('bar-js');
    const barConfig = document.getElementById('bar-config');

    if (barCss) {
      barCss.setAttribute('x', 0);
      barCss.setAttribute('width', cssW);
    }
    if (barHtml) {
      barHtml.setAttribute('x', cssW + 2);
      barHtml.setAttribute('width', htmlW);
    }
    if (barJs) {
      barJs.setAttribute('x', cssW + htmlW + 4);
      barJs.setAttribute('width', jsW);
    }
    if (barConfig) {
      barConfig.setAttribute('x', cssW + htmlW + jsW + 6);
      barConfig.setAttribute('width', configW);
    }

    const lblCss = document.getElementById('lbl-css-pct');
    const lblHtml = document.getElementById('lbl-html-pct');
    const lblJs = document.getElementById('lbl-js-pct');
    const lblConfig = document.getElementById('lbl-config-pct');

    if (lblCss) lblCss.textContent = 'CSS: ' + ((cssLines / totalLines) * 100).toFixed(1) + '%';
    if (lblHtml) lblHtml.textContent = 'HTML: ' + ((htmlLines / totalLines) * 100).toFixed(1) + '%';
    if (lblJs) lblJs.textContent = 'JavaScript: ' + ((jsLines / totalLines) * 100).toFixed(1) + '%';
    if (lblConfig) lblConfig.textContent = 'Config: ' + ((configLines / totalLines) * 100).toFixed(1) + '%';

    // Anatomy Bar
    const codeLines = totals.codeLines || 5350;
    const blankLines = totals.blankLines || 730;
    const commentLines = totals.commentLines || 420;

    const codeW = Math.round((codeLines / totalLines) * 490);
    const blankW = Math.round((blankLines / totalLines) * 490);
    const commentW = Math.max(6, 490 - (codeW + blankW));

    const barCode = document.getElementById('bar-code');
    const barWhitespace = document.getElementById('bar-whitespace');
    const barComments = document.getElementById('bar-comments');

    if (barCode) {
      barCode.setAttribute('x', 0);
      barCode.setAttribute('width', codeW);
    }
    if (barWhitespace) {
      barWhitespace.setAttribute('x', codeW + 2);
      barWhitespace.setAttribute('width', blankW);
    }
    if (barComments) {
      barComments.setAttribute('x', codeW + blankW + 4);
      barComments.setAttribute('width', commentW);
    }

    const lblCode = document.getElementById('lbl-code-count');
    const lblWs = document.getElementById('lbl-whitespace-count');
    const lblComm = document.getElementById('lbl-comments-count');

    if (lblCode) lblCode.textContent = 'SLOC: ' + codeLines.toLocaleString() + ' (' + ((codeLines / totalLines) * 100).toFixed(1) + '%)';
    if (lblWs) lblWs.textContent = 'Whitespace: ' + blankLines.toLocaleString() + ' (' + ((blankLines / totalLines) * 100).toFixed(1) + '%)';
    if (lblComm) lblComm.textContent = 'Comments: ' + commentLines.toLocaleString() + ' (' + ((commentLines / totalLines) * 100).toFixed(1) + '%)';
  }

  // --- Interactive File Explorer ---
  function initFileExplorer() {
    const searchInput = document.getElementById('explorer-search');
    const filterBtns = document.querySelectorAll('.explorer-filter-btn');

    if (searchInput) {
      searchInput.addEventListener('input', e => {
        currentSearch = e.target.value.toLowerCase().trim();
        renderFileList();
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-category');
        renderFileList();
      });
    });
  }

  function renderFileList() {
    const container = document.getElementById('file-list');
    if (!container) return;

    // Combine code files and image assets
    const files = (activeMetrics.files || []).map(f => ({ ...f, type: 'code' }));
    const images = (activeMetrics.images || []).map(img => ({
      path: img.path,
      name: img.name,
      lang: 'Binary',
      category: 'Images',
      description: img.description,
      sizeBytes: img.sizeBytes,
      totalLines: 'Binary',
      type: 'image'
    }));

    const allItems = [...files, ...images];

    const filtered = allItems.filter(item => {
      // Category filter match
      if (currentFilter !== 'all') {
        const cat = (item.category || '').toLowerCase();
        const targetCat = currentFilter.toLowerCase();
        if (targetCat === 'scripts' && cat !== 'scripts' && cat !== 'javascript' && cat !== '3d graphics' && cat !== 'motion' && cat !== 'core app' && cat !== 'dashboard logic') {
          return false;
        } else if (targetCat === 'markup' && cat !== 'markup') {
          return false;
        } else if (targetCat === 'styles' && cat !== 'styles' && cat !== 'design system' && cat !== 'animations') {
          return false;
        } else if (targetCat === 'config' && cat !== 'config' && cat !== 'configuration' && cat !== 'deployment' && cat !== 'git' && cat !== 'environment') {
          return false;
        } else if (targetCat === 'images' && cat !== 'images') {
          return false;
        }
      }

      // Text search match
      if (currentSearch) {
        const nameMatch = (item.name || '').toLowerCase().includes(currentSearch);
        const pathMatch = (item.path || '').toLowerCase().includes(currentSearch);
        const descMatch = (item.description || '').toLowerCase().includes(currentSearch);
        const langMatch = (item.lang || '').toLowerCase().includes(currentSearch);
        return nameMatch || pathMatch || descMatch || langMatch;
      }

      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 3rem 1rem; color: var(--clr-text-dim);">
          <i class="fas fa-folder-open" style="font-size:2.5rem; margin-bottom:1rem; color:var(--clr-bronze-light);"></i>
          <p style="font-family:var(--font-display); font-size:1.1rem; color:var(--clr-champagne); margin-bottom:0.35rem;">No files matched your filter</p>
          <span style="font-size:0.8rem; color:var(--clr-text-muted);">Try adjusting your search terms or selecting another category</span>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => {
      let iconColor = '#D8C8AD';
      let iconClass = 'fas fa-file';

      if (item.category === 'Markup' || item.lang === 'HTML') {
        iconColor = '#e34f26';
        iconClass = 'fab fa-html5';
      } else if (item.category === 'Styles' || item.lang === 'CSS') {
        iconColor = '#1572b6';
        iconClass = 'fab fa-css3-alt';
      } else if (item.lang === 'JavaScript') {
        iconColor = '#f7df1e';
        iconClass = 'fab fa-js';
      } else if (item.type === 'image') {
        iconColor = '#D8C8AD';
        iconClass = 'fas fa-image';
      } else if (item.category === 'Config' || item.lang === 'JSON' || item.lang === 'TOML') {
        iconColor = '#98704F';
        iconClass = 'fas fa-gear';
      }

      const sizeFormatted = item.sizeBytes > 1024 * 1024
        ? (item.sizeBytes / (1024 * 1024)).toFixed(2) + ' MB'
        : (item.sizeBytes / 1024).toFixed(1) + ' KB';

      const linesFormatted = typeof item.totalLines === 'number'
        ? item.totalLines.toLocaleString() + ' lines'
        : item.totalLines;

      return `
        <div class="file-item" data-category="${item.category}" role="listitem">
          <div class="file-name-col">
            <span class="file-icon" style="color:${iconColor};"><i class="${iconClass}"></i></span>
            <div>
              <span class="file-name-text">${item.path}</span>
              <span class="file-desc-sub">${item.description || ''}</span>
            </div>
          </div>
          <div><span class="feature-tech-pill">${item.category || item.lang}</span></div>
          <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--clr-champagne);">${linesFormatted}</div>
          <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--clr-bronze-light); text-align:right;">${sizeFormatted}</div>
        </div>
      `;
    }).join('');
  }

})();
