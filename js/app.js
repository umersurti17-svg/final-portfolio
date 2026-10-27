/**
 * ============================================================
 * UMER SURTI — VIP DEVELOPER PORTFOLIO
 * CORE APPLICATION LOGIC (LENIS, 3D TILT, MODAL, NAVIGATION)
 * ============================================================
 */

(function () {
  'use strict';

  let lenisInstance = null;

  document.addEventListener('DOMContentLoaded', () => {
    // --- 1. LENIS SMOOTH SCROLL ---
    if (typeof Lenis !== 'undefined') {
      lenisInstance = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false
      });

      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Smooth scroll anchor clicks
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId && targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
              e.preventDefault();
              lenisInstance.scrollTo(target, { offset: -80, duration: 1.4 });
              closeMobileMenu();
            }
          }
        });
      });
    }

    // --- 2. NAVBAR SCROLL & ACTIVE SPY ---
    const header = document.getElementById('site-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      // Scrolled styling
      if (header) {
        header.classList.toggle('scrolled', scrollY > 60);
      }

      // Hero scroll indicator fade out on scroll
      const scrollIndicator = document.getElementById('hero-scroll-indicator');
      if (scrollIndicator) {
        scrollIndicator.style.opacity = scrollY > 80 ? '0' : '0.8';
        scrollIndicator.style.pointerEvents = scrollY > 80 ? 'none' : 'auto';
      }

      // Active Section Spy
      let currentSectionId = '';
      sections.forEach((sec) => {
        const top = sec.offsetTop - 120;
        const height = sec.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });

    // --- 3. MOBILE MENU DRAWER & BACKDROP ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBackdrop = document.getElementById('mobile-backdrop');

    function openMobileMenu() {
      if (!mobileToggle || !mobileMenu) return;
      mobileToggle.classList.add('open');
      mobileMenu.classList.add('open');
      if (mobileBackdrop) mobileBackdrop.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.setAttribute('aria-label', 'Close Navigation Menu');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      if (!mobileToggle || !mobileMenu) return;
      mobileToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      if (mobileBackdrop) mobileBackdrop.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.setAttribute('aria-label', 'Open Navigation Menu');
      if (!modal || !modal.classList.contains('active')) {
        document.body.style.overflow = '';
      }
    }

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });

      if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', closeMobileMenu);
      }

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target) && mobileMenu.classList.contains('open')) {
          closeMobileMenu();
        }
      });

      // Close when clicking any link inside mobile menu
      mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
      });
    }

    // --- 4. 3D CARD TILT FOR DESKTOP ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktopPointer = window.matchMedia('(pointer: fine)').matches;
    if (isDesktopPointer && !prefersReducedMotion) {
      const tiltCards = document.querySelectorAll('.tilt-card');
      tiltCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          // Refined, gentle tilt (max 5 degrees)
          const rotateX = ((y - centerY) / centerY) * -5;
          const rotateY = ((x - centerX) / centerX) * 5;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
      });
    }

    // --- 5. CASE STUDY MODAL VIEWER ---
    const modal = document.getElementById('case-study-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCategory = document.getElementById('modal-cat');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTech = document.getElementById('modal-tech');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    window.openCaseStudy = function (title, cat, desc, tech, imgUrl, codeUrl) {
      if (!modal) return;
      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = cat;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalTech) modalTech.textContent = tech;
      if (modalImg && imgUrl) modalImg.src = imgUrl;

      const modalCodeLink = document.getElementById('modal-code-link');
      if (modalCodeLink) {
        modalCodeLink.href = codeUrl || 'https://github.com/umersurti17-svg';
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (lenisInstance) lenisInstance.stop();
    };

    window.closeCaseStudy = function () {
      if (!modal) return;
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (lenisInstance) lenisInstance.start();
    };

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', window.closeCaseStudy);
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.closeCaseStudy();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (modal && modal.classList.contains('active')) {
          window.closeCaseStudy();
        }
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          closeMobileMenu();
        }
      }
    });

    // --- 6. CONTACT FORM VALIDATION & CLIENT FALLBACK ---
    const contactForm = document.getElementById('contact-form') || document.getElementById('vip-contact-form');
    if (contactForm) {
      const nameInput = document.getElementById('contact-name') || contactForm.querySelector('input[type="text"]');
      const emailInput = document.getElementById('contact-email') || contactForm.querySelector('input[type="email"]');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message') || contactForm.querySelector('textarea');

      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const subjectError = document.getElementById('subject-error');
      const messageError = document.getElementById('message-error');

      const submitBtn = document.getElementById('contact-submit-btn') || contactForm.querySelector('button[type="submit"]');
      const feedbackCard = document.getElementById('form-feedback-card');

      // Clear error on input
      [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
        if (!input) return;
        input.addEventListener('input', () => {
          const group = input.closest('.form-group');
          if (group) group.classList.remove('has-error');
          if (feedbackCard) feedbackCard.style.display = 'none';
        });
      });

      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // 1. Validate Name
        if (nameInput) {
          const val = nameInput.value.trim();
          if (!val || val.length < 2) {
            isValid = false;
            nameInput.closest('.form-group')?.classList.add('has-error');
            if (nameError) nameError.textContent = 'Please enter your name (minimum 2 characters).';
          } else {
            nameInput.closest('.form-group')?.classList.remove('has-error');
          }
        }

        // 2. Validate Email
        if (emailInput) {
          const val = emailInput.value.trim();
          if (!val || !emailRegex.test(val)) {
            isValid = false;
            emailInput.closest('.form-group')?.classList.add('has-error');
            if (emailError) emailError.textContent = 'Please enter a valid email address (e.g. name@domain.com).';
          } else {
            emailInput.closest('.form-group')?.classList.remove('has-error');
          }
        }

        // 3. Validate Subject
        if (subjectInput) {
          const val = subjectInput.value.trim();
          if (!val || val.length < 3) {
            isValid = false;
            subjectInput.closest('.form-group')?.classList.add('has-error');
            if (subjectError) subjectError.textContent = 'Please enter a subject (minimum 3 characters).';
          } else {
            subjectInput.closest('.form-group')?.classList.remove('has-error');
          }
        }

        // 4. Validate Message
        if (messageInput) {
          const val = messageInput.value.trim();
          if (!val || val.length < 10) {
            isValid = false;
            messageInput.closest('.form-group')?.classList.add('has-error');
            if (messageError) messageError.textContent = 'Please enter your message (minimum 10 characters).';
          } else {
            messageInput.closest('.form-group')?.classList.remove('has-error');
          }
        }

        if (!isValid) return;

        // Prevent duplicate submission and show loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.classList.add('is-loading');
          const originalBtnHtml = submitBtn.innerHTML;
          submitBtn.innerHTML = '<span class="submit-btn-content"><i class="fa-solid fa-spinner fa-spin"></i> Validating &amp; Processing...</span>';

          const senderName = nameInput ? nameInput.value.trim() : '';
          const senderEmail = emailInput ? emailInput.value.trim() : '';
          const senderSubject = subjectInput ? subjectInput.value.trim() : 'Project Inquiry';
          const senderMessage = messageInput ? messageInput.value.trim() : '';

          // Transparent frontend-only fallback
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('is-loading');
            submitBtn.innerHTML = '<span class="submit-btn-content"><i class="fa-solid fa-check"></i> Form Validated (Demo Mode)</span>';

            const mailtoUrl = `mailto:umer.surti@example.com?subject=${encodeURIComponent(senderSubject)}&body=${encodeURIComponent('From: ' + senderName + ' (' + senderEmail + ')\n\n' + senderMessage)}`;

            if (feedbackCard) {
              feedbackCard.className = 'form-feedback-card is-notice';
              feedbackCard.style.display = 'block';
              feedbackCard.innerHTML = `
                <div style="display: flex; gap: 0.85rem; align-items: flex-start;">
                  <i class="fa-solid fa-circle-info" style="color: var(--clr-champagne); font-size: 1.15rem; margin-top: 0.15rem; flex-shrink: 0;"></i>
                  <div>
                    <strong style="color: var(--clr-champagne-light); display: block; margin-bottom: 0.35rem; font-size: var(--fs-sm);">
                      Form Validated (Frontend-Only Mode)
                    </strong>
                    <p style="margin: 0 0 0.65rem; color: var(--clr-text-muted);">
                      This static portfolio does not currently host an active backend service or email API. To deliver your message directly to Umer Surti, launch your email client with your prefilled message:
                    </p>
                    <a href="${mailtoUrl}" class="btn btn--champagne btn--sm btn-shimmer" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;">
                      <i class="fa-regular fa-envelope"></i> Open in Email Client
                    </a>
                  </div>
                </div>
              `;
            }

            contactForm.reset();

            setTimeout(() => {
              submitBtn.innerHTML = originalBtnHtml;
            }, 5000);
          }, 800);
        }
      });
    }

    // --- 8. JOURNEY TIMELINE CATEGORY FILTER ---
    const journeyTabs = document.querySelectorAll('.journey-tab');
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (journeyTabs.length && timelineItems.length) {
      journeyTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          journeyTabs.forEach((t) => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          const filter = tab.getAttribute('data-filter');
          timelineItems.forEach((item) => {
            const cat = item.getAttribute('data-category');
            if (filter === 'all' || cat === filter) {
              item.style.display = '';
              if (typeof gsap !== 'undefined') {
                gsap.fromTo(item, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
              }
            } else {
              item.style.display = 'none';
            }
          });

          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
          }
        });
      });
    }

    // --- 9. BACK TO TOP BUTTON ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        if (lenisInstance) {
          lenisInstance.scrollTo(0, { duration: 1.5 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    // --- 10. DYNAMIC COPYRIGHT YEAR ---
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
      currentYearEl.textContent = new Date().getFullYear();
    }
  });
})();
