/**
 * ============================================================
 * UMER SURTI — VIP DEVELOPER PORTFOLIO
 * GSAP + SCROLLTRIGGER CINEMATIC ANIMATIONS
 * ============================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. HERO CINEMATIC ENTRANCE (COORDINATED ENTRANCE) ---
    if (!prefersReducedMotion) {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      heroTl
        .from('#site-header', {
          y: -40,
          opacity: 0,
          duration: 0.9,
          delay: 0.15
        })
        // Profile Image on Left Slides in from the Left
        .from('.hero-enter-left', {
          x: -65,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out'
        }, '-=0.6')
        // Floating badge on profile pops in with gentle bounce
        .from('.hero-floating-badge', {
          scale: 0.8,
          opacity: 0,
          y: 15,
          duration: 0.85,
          ease: 'back.out(1.6)'
        }, '-=0.6')
        // Text Column Elements on Right Slide in from the Right
        .from('.hero-enter-right .vip-status-pill', {
          x: 45,
          opacity: 0,
          duration: 0.75
        }, '-=1.2')
        .from('.hero-enter-right .hero-role-badge', {
          x: 35,
          opacity: 0,
          duration: 0.75
        }, '-=0.9')
        .from('.hero-title span', {
          x: 60,
          opacity: 0,
          duration: 0.95,
          stagger: 0.15
        }, '-=0.8')
        .from('.hero-tagline', {
          x: 40,
          opacity: 0,
          duration: 0.8
        }, '-=0.6')
        .from('.hero-cta-group .btn', {
          x: 30,
          opacity: 0,
          scale: 0.92,
          stagger: 0.14,
          duration: 0.7,
          ease: 'back.out(1.5)'
        }, '-=0.5')
        .from('.hero-highlights .hero-hl-pill', {
          opacity: 0,
          y: 16,
          stagger: 0.1,
          duration: 0.6
        }, '-=0.4')
        // Scroll Indicator Fades in at the Bottom
        .from('#hero-scroll-indicator', {
          opacity: 0,
          y: 20,
          duration: 0.9,
          ease: 'power2.out'
        }, '-=0.3');
    }

    // --- 2. ABOUT ME SECTION CINEMATIC SCROLL REVEAL ---
    const aboutSection = document.getElementById('about');
    if (aboutSection && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 80%',
          once: true
        },
        defaults: { ease: 'power3.out' }
      });

      aboutTl
        // Profile Image slides in smoothly from the Left
        .from('.about-enter-left', {
          x: -70,
          opacity: 0,
          duration: 1.15
        })
        // Text header and title slide in from the Right
        .from('.about-enter-right .about-header-meta', {
          x: 50,
          opacity: 0,
          duration: 0.85
        }, '-=0.85')
        // Professional introduction slides in from the Right
        .from('.about-enter-right .about-bio-text', {
          x: 40,
          opacity: 0,
          duration: 0.8
        }, '-=0.65')
        // 3 Compact Highlight Cards Stagger in
        .from('.about-highlight-card', {
          y: 28,
          opacity: 0,
          scale: 0.95,
          duration: 0.65,
          stagger: 0.14,
          ease: 'back.out(1.4)'
        }, '-=0.5')
        // Explore My Projects button fades in
        .from('.about-actions .btn', {
          y: 18,
          opacity: 0,
          duration: 0.6
        }, '-=0.4');
    }

    // --- 3. DIRECTIONAL SCROLL REVEALS (FOR PROJECTS & TIMELINE) ---
    if (!prefersReducedMotion && typeof ScrollTrigger !== 'undefined') {

      // Left Slide-ins (e.g. About Portrait Frame)
      gsap.utils.toArray('.reveal-init-left').forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out'
        });
      });

      // Right Slide-ins (e.g. About Narrative, Project Cards)
      gsap.utils.toArray('.reveal-init-right').forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out'
        });
      });

      // Upward Fade Staggers
      gsap.utils.toArray('.reveal-init-up').forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          y: 0,
          opacity: 1,
          duration: 0.95,
          ease: 'power3.out'
        });
      });

      // Scale In (e.g. Cards)
      gsap.utils.toArray('.reveal-init-scale').forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          scale: 1,
          opacity: 1,
          duration: 1.0,
          ease: 'back.out(1.3)'
        });
      });
    }

    // --- 4. MY SKILLS SECTION CINEMATIC SCROLL REVEAL ---
    const skillsSection = document.getElementById('skills');
    if (skillsSection && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      // Reveal section header
      gsap.from('.skills-header .section-tag, .skills-header .section-title, .skills-header .section-sub', {
        scrollTrigger: {
          trigger: '.skills-header',
          start: 'top 85%',
          once: true
        },
        y: 35,
        opacity: 0,
        stagger: 0.14,
        duration: 0.9,
        ease: 'power3.out'
      });

      // Staggered entrance from alternating sides: Left categories (1 & 3)
      gsap.from('.skill-cat-left', {
        scrollTrigger: {
          trigger: '.skills-showcase-grid',
          start: 'top 82%',
          once: true
        },
        x: -50,
        opacity: 0,
        stagger: 0.22,
        duration: 1.05,
        ease: 'power3.out'
      });

      // Staggered entrance from alternating sides: Right categories (2 & 4)
      gsap.from('.skill-cat-right', {
        scrollTrigger: {
          trigger: '.skills-showcase-grid',
          start: 'top 82%',
          once: true
        },
        x: 50,
        opacity: 0,
        stagger: 0.22,
        duration: 1.05,
        ease: 'power3.out'
      });

      // Smoothly animate indicator tracks when scrolled in
      ScrollTrigger.create({
        trigger: '.skills-showcase-grid',
        start: 'top 80%',
        once: true,
        onEnter: () => {
          document.querySelectorAll('.skill-bar-glow').forEach((glow, idx) => {
            setTimeout(() => {
              glow.style.transform = 'scaleX(1)';
            }, idx * 45);
          });
        }
      });
    } else {
      document.querySelectorAll('.skill-bar-glow').forEach((glow) => {
        glow.style.transform = 'scaleX(1)';
      });
    }

    // --- 5. FEATURED PROJECTS SECTION SCROLL REVEAL ---
    const projectsSection = document.getElementById('projects');
    if (projectsSection && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      // Reveal section header
      gsap.from('.projects-header .section-tag, .projects-header .section-title, .projects-header .section-sub', {
        scrollTrigger: {
          trigger: '.projects-header',
          start: 'top 85%',
          once: true
        },
        y: 35,
        opacity: 0,
        stagger: 0.14,
        duration: 0.9,
        ease: 'power3.out'
      });

      // Alternating entrance: items entering from left
      gsap.from('.project-item-left', {
        scrollTrigger: {
          trigger: '.projects-showcase-grid',
          start: 'top 82%',
          once: true
        },
        x: -45,
        opacity: 0,
        stagger: 0.2,
        duration: 1.05,
        ease: 'power3.out'
      });

      // Alternating entrance: items entering from right
      gsap.from('.project-item-right', {
        scrollTrigger: {
          trigger: '.projects-showcase-grid',
          start: 'top 82%',
          once: true
        },
        x: 45,
        opacity: 0,
        stagger: 0.2,
        duration: 1.05,
        ease: 'power3.out'
      });
    }

    // --- 6. NUMERIC METRIC COUNTERS ---
    const counters = document.querySelectorAll('.counter-val');
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const suffix = counter.getAttribute('data-suffix') || '';

      if (prefersReducedMotion || typeof ScrollTrigger === 'undefined') {
        counter.textContent = target + suffix;
      } else {
        const obj = { val: 0 };
        gsap.to(obj, {
          scrollTrigger: {
            trigger: counter,
            start: 'top 90%',
            once: true
          },
          val: target,
          duration: 2.2,
          ease: 'power3.out',
          onUpdate: () => {
            counter.textContent = Math.floor(obj.val) + suffix;
          }
        });
      }
    });

    // --- 7. MY JOURNEY TIMELINE SCROLL REVEAL ---
    const journeySection = document.getElementById('education');
    if (journeySection && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      // Reveal section header
      gsap.from('.journey-header .section-tag, .journey-header .section-title, .journey-header .section-sub', {
        scrollTrigger: {
          trigger: '.journey-header',
          start: 'top 85%',
          once: true
        },
        y: 35,
        opacity: 0,
        stagger: 0.14,
        duration: 0.9,
        ease: 'power3.out'
      });

      // Reveal filter tabs
      gsap.from('.journey-filter-nav', {
        scrollTrigger: {
          trigger: '.journey-filter-nav',
          start: 'top 88%',
          once: true
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      // Progressive drawing of the central spine
      const spineFill = document.getElementById('timeline-spine-fill');
      const timelineWrap = document.getElementById('education-timeline');
      if (spineFill && timelineWrap) {
        gsap.to(spineFill, {
          scrollTrigger: {
            trigger: timelineWrap,
            start: 'top 75%',
            end: 'bottom 70%',
            scrub: true
          },
          height: '100%',
          ease: 'none'
        });
      }

      // Smooth alternating left/right slide-in for timeline items
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      gsap.utils.toArray('.timeline-item-left').forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true
          },
          x: isMobile ? -25 : -45,
          opacity: 0,
          duration: 0.95,
          ease: 'power3.out'
        });
      });

      gsap.utils.toArray('.timeline-item-right').forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true
          },
          x: isMobile ? -25 : 45,
          opacity: 0,
          duration: 0.95,
          ease: 'power3.out'
        });
      });
    }

    // --- 7.5. PROJECT DOCUMENTATION SCROLL REVEAL ---
    const docsSection = document.getElementById('docs');
    if (docsSection && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      gsap.from('.docs-header .section-tag, .docs-header .section-title, .docs-header .section-sub', {
        scrollTrigger: {
          trigger: '.docs-header',
          start: 'top 85%',
          once: true
        },
        y: 35,
        opacity: 0,
        stagger: 0.14,
        duration: 0.9,
        ease: 'power3.out'
      });

      gsap.from('.docs-card', {
        scrollTrigger: {
          trigger: '.docs-card',
          start: 'top 82%',
          once: true
        },
        y: 40,
        opacity: 0,
        duration: 1.05,
        ease: 'power3.out'
      });

      gsap.from('.docs-tech-item', {
        scrollTrigger: {
          trigger: '.docs-tech-grid',
          start: 'top 85%',
          once: true
        },
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power2.out'
      });
    }

    // --- 8. LET'S CONNECT (CONTACT SECTION) SCROLL REVEAL ---
    const contactSection = document.getElementById('contact');
    if (contactSection && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      // Reveal section header
      gsap.from('.contact-header .section-tag, .contact-header .section-title, .contact-header .section-sub', {
        scrollTrigger: {
          trigger: '.contact-header',
          start: 'top 85%',
          once: true
        },
        y: 35,
        opacity: 0,
        stagger: 0.14,
        duration: 0.9,
        ease: 'power3.out'
      });

      // Left column: Contact Channels
      gsap.from('.contact-channels', {
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 82%',
          once: true
        },
        x: -45,
        opacity: 0,
        duration: 1.05,
        ease: 'power3.out'
      });

      // Right column: Contact Form Container
      gsap.from('.contact-form-container', {
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 82%',
          once: true
        },
        x: 45,
        opacity: 0,
        duration: 1.05,
        ease: 'power3.out'
      });
    }

    // --- 9. FOOTER SCROLL REVEAL ---
    const footer = document.getElementById('site-footer');
    if (footer && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      gsap.from('.footer-top > div', {
        scrollTrigger: {
          trigger: footer,
          start: 'top 90%',
          once: true
        },
        y: 28,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out'
      });

      gsap.from('.footer-bottom', {
        scrollTrigger: {
          trigger: '.footer-bottom',
          start: 'top 98%',
          once: true
        },
        y: 15,
        opacity: 0,
        duration: 0.7,
        delay: 0.15,
        ease: 'power3.out'
      });
    }
  });
})();
