/**
 * UMER SURTI VIP PORTFOLIO — DYNAMIC PROJECTS LOADER
 * Seamlessly connects public projects section to Supabase database
 * with fallback to curated static projects.
 */

(function () {
  'use strict';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeJsString(str) {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, ' ');
  }

  async function loadPortfolioProjects() {
    const grid = document.querySelector('.projects-showcase-grid');
    if (!grid) return;

    if (!window.PortfolioService || !window.PortfolioService.isConfigured()) {
      return; // Keep existing curated static markup
    }

    try {
      const projects = await window.PortfolioService.getPublishedProjects();

      // If no published projects in DB, retain the static fallback
      if (!projects || projects.length === 0) {
        return;
      }

      // Generate luxury markup matching design system
      const cardsHtml = projects.map((p, index) => {
        const itemSideClass = index % 2 === 0 ? 'project-item-left' : 'project-item-right';
        const numLabel = String(index + 1).padStart(2, '0');
        const titleEsc = escapeHtml(p.title);
        const descEsc = escapeHtml(p.description);
        const catEsc = escapeHtml(p.category || 'Curated Work');
        const imgUrl = escapeHtml(p.image_url || 'assets/images/project1.jpg');
        const projUrl = escapeHtml(p.project_url || 'https://github.com/umersurti17-svg');

        const techs = Array.isArray(p.technologies) ? p.technologies : [];
        const techTagsHtml = techs.map(t => `<span class="project-tech-tag">${escapeHtml(t)}</span>`).join('\n                ');
        const techString = escapeJsString(techs.join(', '));

        const titleJs = escapeJsString(p.title);
        const catJs = escapeJsString(p.category || 'Featured Project');
        const descJs = escapeJsString(p.description);
        const imgJs = escapeJsString(p.image_url || 'assets/images/project1.jpg');
        const projJs = escapeJsString(p.project_url || 'https://github.com/umersurti17-svg');

        return `
        <!-- Project ${numLabel}: ${titleEsc} (Live Supabase Record) -->
        <div class="project-grid-item ${itemSideClass}" data-project-id="${escapeHtml(p.id)}">
          <article class="project-showcase-card tilt-card">
            <!-- Project Media / Preview Area -->
            <div class="project-media-wrap">
              <img src="${imgUrl}" alt="${titleEsc}" class="project-card-img" loading="lazy">
              <div class="project-media-overlay">
                <button type="button" class="project-quick-preview-btn" onclick="openCaseStudy('${titleJs}', '${catJs}', '${descJs}', '${techString}', '${imgJs}', '${projJs}')" aria-label="Preview ${titleEsc}">
                  <i class="fa-solid fa-expand"></i> Quick Preview
                </button>
              </div>
              <span class="project-floating-badge">${catEsc}</span>
            </div>

            <!-- Project Content Body -->
            <div class="project-card-body">
              <div class="project-category-row">
                <span class="project-cat-label">${catEsc}</span>
                <span class="project-number-label">${numLabel}</span>
              </div>

              <h3 class="project-card-title">${titleEsc}</h3>
              
              <p class="project-card-desc">
                ${descEsc}
              </p>

              <!-- Technology Tags -->
              <div class="project-tech-tags">
                ${techTagsHtml}
              </div>

              <!-- Functional Action Links -->
              <div class="project-card-actions">
                <button type="button" class="btn btn--champagne btn--sm btn-shimmer project-btn" onclick="openCaseStudy('${titleJs}', '${catJs}', '${descJs}', '${techString}', '${imgJs}', '${projJs}')">
                  <span>View Project</span>
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </button>
                <a href="${projUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--ghost btn--sm project-btn" title="View Code on GitHub">
                  <i class="fa-brands fa-github"></i>
                  <span>View Code</span>
                </a>
              </div>
            </div>
          </article>
        </div>`;
      }).join('\n');

      grid.innerHTML = cardsHtml;

      // Add live database badge to section header if not present
      const headerSub = document.querySelector('.projects-header .section-sub');
      if (headerSub && !document.getElementById('db-live-indicator')) {
        const badge = document.createElement('span');
        badge.id = 'db-live-indicator';
        badge.className = 'db-live-badge';
        badge.innerHTML = '<i class="fa-solid fa-database"></i> Supabase Live Sync (' + projects.length + ' Projects)';
        headerSub.appendChild(badge);
      }

      // Re-initialize tilt if VanillaTilt exists
      if (typeof VanillaTilt !== 'undefined') {
        const tiltCards = grid.querySelectorAll('.tilt-card');
        VanillaTilt.init(Array.from(tiltCards), {
          max: 8,
          speed: 400,
          glare: true,
          'max-glare': 0.15
        });
      }

      // Refresh ScrollTrigger if GSAP is available
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }

    } catch (err) {
      console.warn('[Projects] Supabase live fetch failed, continuing with static fallback:', err.message);
      // Retain the existing static fallback HTML
    }
  }

  async function updatePortalNavLinks() {
    if (!window.PortfolioService) return;
    try {
      const session = await window.PortfolioService.getSession();
      const navLink = document.getElementById('nav-portal-link');
      const mobileLink = document.getElementById('mobile-portal-link');

      if (session && session.user) {
        if (session.isAdmin) {
          if (navLink) {
            navLink.href = 'admin.html';
            navLink.innerHTML = '<i class="fa-solid fa-screwdriver-wrench" style="font-size: 0.7rem; margin-right: 0.25rem;"></i>Admin';
          }
          if (mobileLink) {
            mobileLink.href = 'admin.html';
            mobileLink.textContent = '09. Admin Console';
          }
        } else {
          if (navLink) {
            navLink.href = 'user-dashboard.html';
            navLink.innerHTML = '<i class="fa-solid fa-user-circle" style="font-size: 0.7rem; margin-right: 0.25rem;"></i>Account';
          }
          if (mobileLink) {
            mobileLink.href = 'user-dashboard.html';
            mobileLink.textContent = '09. User Account';
          }
        }
      }
    } catch (e) {
      // Non-blocking
    }
  }

  function init() {
    loadPortfolioProjects();
    updatePortalNavLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
