/**
 * DECODELABS — PRODUCTION JAVASCRIPT ARCHITECTURE
 * Vanilla ES6+ | Zero Framework Dependencies | WCAG 2.1 AA Accessible
 * 
 * Modules:
 *  1. Accessible Mobile Navigation Drawer with Focus Trap & Keyboard Handling
 *  2. Deterministic Sequential ScrollSpy (1. Overview -> 2. Services -> 3. Case Study -> 4. Engineering -> 5. Contact)
 *  3. Interactive Category Filter System with Live ARIA Announcements & Fallback
 *  4. Solution Architecture Inspector Modal Dialog (<dialog>) with Copy Feedback
 *  5. Sticky Header Scroll Elevation
 *  6. Main Consultation Form Client-Side Validation & Accessible Alerts
 *  7. Performance Timing Telemetry Benchmark
 */

'use strict';

(function () {
  /**
   * DOM Elements Cache
   */
  const DOM = {
    body: document.body,
    header: document.getElementById('site-header'),
    mobileToggle: document.getElementById('mobile-menu-toggle'),
    primaryNav: document.getElementById('primary-nav'),
    navBackdrop: document.getElementById('nav-backdrop'),
    navLinks: document.querySelectorAll('.nav-link'),
    sidebarLinks: document.querySelectorAll('.sidebar-link'),
    filterChips: document.querySelectorAll('.chip-btn'),
    servicesGrid: document.getElementById('services-grid'),
    serviceCards: document.querySelectorAll('.service-card'),
    filterStatus: document.getElementById('filter-status'),
    emptyState: document.getElementById('empty-state'),
    resetFilterBtn: document.getElementById('reset-filter-btn'),

    // Consultation Form Elements
    consultationForm: document.getElementById('consultation-form'),
    contactName: document.getElementById('contact-name'),
    contactEmail: document.getElementById('contact-email'),
    contactCompany: document.getElementById('contact-company'),
    contactService: document.getElementById('contact-service'),
    contactMessage: document.getElementById('contact-message'),
    nameError: document.getElementById('name-error'),
    emailError: document.getElementById('email-error'),
    serviceError: document.getElementById('service-error'),
    formSuccessMsg: document.getElementById('form-success-msg'),

    // Telemetry & Utility Elements
    currentYear: document.getElementById('current-year'),
    loadTimeMetric: document.getElementById('load-time-metric'),

    // Solution Modal Dialog Elements
    solutionDialog: document.getElementById('solution-dialog'),
    dialogBadge: document.getElementById('dialog-badge'),
    dialogCategory: document.getElementById('dialog-category'),
    dialogCloseBtn: document.getElementById('dialog-close-btn'),
    dialogTitle: document.getElementById('dialog-title'),
    dialogDescription: document.getElementById('dialog-description'),
    dialogCode: document.getElementById('dialog-code'),
    dialogSpec: document.getElementById('dialog-spec'),
    dialogSla: document.getElementById('dialog-sla'),
    copyCodeBtn: document.getElementById('copy-code-btn')
  };

  /**
   * Application State Store
   */
  const state = {
    isMenuOpen: false,
    activeFilter: 'all',
    lastFocusedElement: null,
    isManualScrolling: false
  };

  /* ==========================================================================
     1. ACCESSIBLE MOBILE NAVIGATION DRAWER (With Focus Trap)
     ========================================================================== */
  const NavigationController = {
    init() {
      if (!DOM.mobileToggle || !DOM.primaryNav) return;

      // Toggle button click listener
      DOM.mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });

      // Backdrop click dismissal
      if (DOM.navBackdrop) {
        DOM.navBackdrop.addEventListener('click', () => {
          this.closeMenu(true);
        });
      }

      // Close drawer when clicking nav links on mobile devices
      DOM.navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          if (window.innerWidth < 768 && state.isMenuOpen) {
            this.closeMenu(false);
          }
        });
      });

      // Global keyboard accessibility: Close on Escape key & Focus Trap
      document.addEventListener('keydown', (e) => {
        if (!state.isMenuOpen) return;

        if (e.key === 'Escape') {
          this.closeMenu(true);
          return;
        }

        if (e.key === 'Tab') {
          this.handleFocusTrap(e);
        }
      });

      // Auto-close on viewport resize to desktop layout
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && state.isMenuOpen) {
          this.closeMenu(false);
        }
      });
    },

    handleFocusTrap(e) {
      const focusableElements = DOM.primaryNav.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled])'
      );
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    },

    toggleMenu() {
      if (state.isMenuOpen) {
        this.closeMenu(true);
      } else {
        this.openMenu();
      }
    },

    openMenu() {
      state.isMenuOpen = true;
      DOM.mobileToggle.setAttribute('aria-expanded', 'true');
      DOM.primaryNav.classList.add('is-open');
      DOM.primaryNav.removeAttribute('aria-hidden');

      if (DOM.navBackdrop) {
        DOM.navBackdrop.classList.add('is-visible');
        DOM.navBackdrop.setAttribute('aria-hidden', 'false');
      }

      DOM.body.classList.add('menu-open');

      const firstNavLink = DOM.primaryNav.querySelector('a, button');
      if (firstNavLink) {
        firstNavLink.focus();
      }
    },

    closeMenu(restoreFocus = true) {
      if (!state.isMenuOpen) return;

      state.isMenuOpen = false;
      DOM.mobileToggle.setAttribute('aria-expanded', 'false');
      DOM.primaryNav.classList.remove('is-open');

      if (DOM.navBackdrop) {
        DOM.navBackdrop.classList.remove('is-visible');
        DOM.navBackdrop.setAttribute('aria-hidden', 'true');
      }

      DOM.body.classList.remove('menu-open');

      if (restoreFocus && DOM.mobileToggle) {
        DOM.mobileToggle.focus();
      }
    }
  };

  /* ==========================================================================
     2. DETERMINISTIC SEQUENTIAL SCROLLSPY CONTROLLER
     Guarantees strict sequential activation: 1 -> 2 -> 3 -> 4 -> 5
     ========================================================================== */
  const ScrollSpyController = {
    // Ordered main landmark sections in chronological page sequence
    sectionSequence: ['hero', 'services', 'case-study', 'pillars', 'contact'],

    init() {
      this.sections = this.sectionSequence
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      if (!this.sections.length) return;

      // Handle user smooth scrolling
      let isTicking = false;
      window.addEventListener(
        'scroll',
        () => {
          if (!isTicking) {
            window.requestAnimationFrame(() => {
              this.onScroll();
              isTicking = false;
            });
            isTicking = true;
          }
        },
        { passive: true }
      );

      // Handle direct link clicks for immediate responsive highlight
      DOM.navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            this.updateActiveLinks(targetId);
          }
        });
      });

      DOM.sidebarLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            this.updateActiveLinks(targetId);
          }
        });
      });

      // Initial active state determination on load
      this.onScroll();
    },

    onScroll() {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const headerOffset = 130; // Accounts for sticky header + breathing room

      // 1. If at bottom of page, immediately activate last section (5. Contact)
      if (scrollPosition + windowHeight >= documentHeight - 60) {
        this.updateActiveLinks('contact');
        return;
      }

      // 2. Linear top-down search for the currently active section
      let currentActiveId = this.sectionSequence[0];

      for (let i = 0; i < this.sections.length; i++) {
        const section = this.sections[i];
        const sectionTop = section.offsetTop - headerOffset;

        if (scrollPosition >= sectionTop) {
          currentActiveId = section.id;
        } else {
          // Since sections are arranged in strict DOM order, we can stop evaluating
          break;
        }
      }

      this.updateActiveLinks(currentActiveId);
    },

    updateActiveLinks(activeId) {
      // 1. Update Primary Header Navigation Bar (<nav>)
      DOM.navLinks.forEach((link) => {
        const linkTarget = link.getAttribute('data-nav') || (link.getAttribute('href') || '').replace('#', '');
        const isMatch = linkTarget === activeId;

        link.classList.toggle('active', isMatch);
        if (isMatch) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });

      // 2. Update Sidebar Table of Contents (TOC)
      DOM.sidebarLinks.forEach((link) => {
        const linkTarget = link.getAttribute('data-toc') || (link.getAttribute('href') || '').replace('#', '');
        const isMatch = linkTarget === activeId;

        link.classList.toggle('active', isMatch);
      });
    }
  };

  /* ==========================================================================
     3. INTERACTIVE CATEGORY FILTER SYSTEM
     ========================================================================== */
  const FilterController = {
    init() {
      if (!DOM.filterChips.length || !DOM.serviceCards.length) return;

      DOM.filterChips.forEach((chip) => {
        chip.addEventListener('click', () => {
          const filterValue = chip.getAttribute('data-filter');
          if (filterValue) {
            this.applyFilter(filterValue, chip);
          }
        });
      });

      // Reset filter button inside empty state
      if (DOM.resetFilterBtn) {
        DOM.resetFilterBtn.addEventListener('click', () => {
          const allChip = Array.from(DOM.filterChips).find(
            (c) => c.getAttribute('data-filter') === 'all'
          );
          if (allChip) {
            this.applyFilter('all', allChip);
            allChip.focus();
          }
        });
      }
    },

    applyFilter(category, clickedButton) {
      state.activeFilter = category;

      // 1. Update Buttons Active & ARIA Pressed States
      DOM.filterChips.forEach((btn) => {
        const isTarget = btn === clickedButton;
        btn.classList.toggle('active', isTarget);
        btn.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
      });

      // 2. Filter Cards with Smooth Animation
      let visibleCount = 0;
      const categoryName = clickedButton.textContent.trim().replace(/\(\d+\)/, '').trim();

      DOM.serviceCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        const matches = category === 'all' || cardCategory === category;

        if (matches) {
          card.classList.remove('is-hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.98)';

          requestAnimationFrame(() => {
            card.style.transition = 'opacity 250ms ease, transform 250ms ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
          visibleCount++;
        } else {
          card.classList.add('is-hidden');
        }
      });

      // 3. Handle Empty State
      if (DOM.emptyState) {
        DOM.emptyState.hidden = visibleCount > 0;
      }

      // 4. Update Screen Reader Live Region Announcement
      if (DOM.filterStatus) {
        if (category === 'all') {
          DOM.filterStatus.textContent = `Showing all ${visibleCount} solutions.`;
        } else {
          DOM.filterStatus.textContent = `Filtered to ${visibleCount} ${categoryName} solution${visibleCount === 1 ? '' : 's'}.`;
        }
      }
    }
  };

  /* ==========================================================================
     4. SOLUTION INSPECTOR MODAL CONTROLLER (<dialog>)
     ========================================================================== */
  const SolutionModalController = {
    init() {
      if (!DOM.solutionDialog) return;

      // Attach click listeners to cards' inspect buttons and title links
      DOM.serviceCards.forEach((card) => {
        const inspectBtn = card.querySelector('.card-action-btn');
        const titleLink = card.querySelector('.card-title-link');

        if (inspectBtn) {
          inspectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal(card, inspectBtn);
          });
        }

        if (titleLink) {
          titleLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal(card, titleLink);
          });
        }
      });

      // Close button
      if (DOM.dialogCloseBtn) {
        DOM.dialogCloseBtn.addEventListener('click', () => {
          this.closeModal();
        });
      }

      // Close when clicking outside modal card (on native dialog backdrop)
      DOM.solutionDialog.addEventListener('click', (e) => {
        if (e.target === DOM.solutionDialog) {
          this.closeModal();
        }
      });

      // Native Escape key handling for dialog
      DOM.solutionDialog.addEventListener('cancel', () => {
        state.lastFocusedElement = state.lastFocusedElement || document.activeElement;
      });

      DOM.solutionDialog.addEventListener('close', () => {
        if (state.lastFocusedElement) {
          state.lastFocusedElement.focus();
        }
      });

      // Copy Code Snippet Button
      if (DOM.copyCodeBtn && DOM.dialogCode) {
        DOM.copyCodeBtn.addEventListener('click', () => {
          this.copyCode();
        });
      }
    },

    openModal(card, triggerElement) {
      state.lastFocusedElement = triggerElement;

      // Extract data attributes
      const title = card.getAttribute('data-title') || card.querySelector('.card-title')?.textContent || 'Solution Architecture';
      const category = card.getAttribute('data-service-category') || 'Engineering Solution';
      const badge = card.getAttribute('data-badge') || 'Service 01';
      const sla = card.getAttribute('data-sla') || '99.99% SLA';
      const spec = card.getAttribute('data-spec') || 'Multi-Cloud • Resilient';
      const description = card.getAttribute('data-description') || card.querySelector('.card-text')?.textContent || '';
      const code = card.getAttribute('data-code') || '// DecodeLabs Blueprint';

      // Populate dialog
      if (DOM.dialogTitle) DOM.dialogTitle.textContent = title;
      if (DOM.dialogCategory) DOM.dialogCategory.textContent = category;
      if (DOM.dialogBadge) DOM.dialogBadge.textContent = badge;
      if (DOM.dialogSla) DOM.dialogSla.textContent = sla;
      if (DOM.dialogSpec) DOM.dialogSpec.innerHTML = spec;
      if (DOM.dialogDescription) DOM.dialogDescription.textContent = description;
      if (DOM.dialogCode) DOM.dialogCode.textContent = code;

      // Reset copy button state
      if (DOM.copyCodeBtn) {
        DOM.copyCodeBtn.classList.remove('copied');
        const copyText = DOM.copyCodeBtn.querySelector('.copy-text');
        if (copyText) copyText.textContent = 'Copy Blueprint';
      }

      // Open standard HTML5 modal dialog
      if (typeof DOM.solutionDialog.showModal === 'function') {
        DOM.solutionDialog.showModal();
      } else {
        DOM.solutionDialog.setAttribute('open', '');
      }

      if (DOM.dialogCloseBtn) {
        DOM.dialogCloseBtn.focus();
      }
    },

    closeModal() {
      if (typeof DOM.solutionDialog.close === 'function') {
        DOM.solutionDialog.close();
      } else {
        DOM.solutionDialog.removeAttribute('open');
      }

      if (state.lastFocusedElement) {
        state.lastFocusedElement.focus();
      }
    },

    copyCode() {
      const codeText = DOM.dialogCode?.textContent || '';
      if (!codeText) return;

      navigator.clipboard.writeText(codeText).then(() => {
        if (DOM.copyCodeBtn) {
          DOM.copyCodeBtn.classList.add('copied');
          const copyText = DOM.copyCodeBtn.querySelector('.copy-text');
          if (copyText) copyText.textContent = '✓ Blueprint Copied';

          setTimeout(() => {
            DOM.copyCodeBtn.classList.remove('copied');
            if (copyText) copyText.textContent = 'Copy Blueprint';
          }, 2400);
        }
      }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = codeText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        if (DOM.copyCodeBtn) {
          DOM.copyCodeBtn.classList.add('copied');
          const copyText = DOM.copyCodeBtn.querySelector('.copy-text');
          if (copyText) copyText.textContent = '✓ Copied';
          setTimeout(() => {
            DOM.copyCodeBtn.classList.remove('copied');
            if (copyText) copyText.textContent = 'Copy Blueprint';
          }, 2400);
        }
      });
    }
  };

  /* ==========================================================================
     5. STICKY HEADER SCROLL ELEVATION
     ========================================================================== */
  const HeaderScrollController = {
    init() {
      if (!DOM.header) return;

      const handleScroll = () => {
        if (window.scrollY > 20) {
          DOM.header.classList.add('scrolled');
        } else {
          DOM.header.classList.remove('scrolled');
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
  };

  /* ==========================================================================
     6. CONSULTATION FORM CONTROLLER
     ========================================================================== */
  const ConsultationFormController = {
    init() {
      if (!DOM.consultationForm) return;

      DOM.consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });

      // Clear validation errors on active user typing / selection
      if (DOM.contactName) {
        DOM.contactName.addEventListener('input', () => {
          if (DOM.nameError) DOM.nameError.textContent = '';
          DOM.contactName.removeAttribute('aria-invalid');
        });
      }

      if (DOM.contactEmail) {
        DOM.contactEmail.addEventListener('input', () => {
          if (DOM.emailError) DOM.emailError.textContent = '';
          DOM.contactEmail.removeAttribute('aria-invalid');
        });
      }

      if (DOM.contactService) {
        DOM.contactService.addEventListener('change', () => {
          if (DOM.serviceError) DOM.serviceError.textContent = '';
          DOM.contactService.removeAttribute('aria-invalid');
        });
      }
    },

    handleSubmit() {
      let isValid = true;

      // 1. Validate Name
      const nameVal = DOM.contactName ? DOM.contactName.value.trim() : '';
      if (!nameVal) {
        this.showError(DOM.contactName, DOM.nameError, 'Please provide your full name.');
        isValid = false;
      }

      // 2. Validate Email
      const emailVal = DOM.contactEmail ? DOM.contactEmail.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        this.showError(DOM.contactEmail, DOM.emailError, 'Please enter your work email.');
        isValid = false;
      } else if (!emailRegex.test(emailVal)) {
        this.showError(DOM.contactEmail, DOM.emailError, 'Please enter a valid work email address.');
        isValid = false;
      }

      // 3. Validate Service Selection
      const serviceVal = DOM.contactService ? DOM.contactService.value : '';
      if (!serviceVal) {
        this.showError(DOM.contactService, DOM.serviceError, 'Please select a solution area.');
        isValid = false;
      }

      if (!isValid) return;

      // Reset fields upon valid submission
      if (DOM.contactName) DOM.contactName.value = '';
      if (DOM.contactEmail) DOM.contactEmail.value = '';
      if (DOM.contactCompany) DOM.contactCompany.value = '';
      if (DOM.contactService) DOM.contactService.selectedIndex = 0;
      if (DOM.contactMessage) DOM.contactMessage.value = '';

      if (DOM.formSuccessMsg) {
        DOM.formSuccessMsg.hidden = false;
        setTimeout(() => {
          DOM.formSuccessMsg.hidden = true;
        }, 7000);
      }
    },

    showError(inputElement, errorElement, message) {
      if (errorElement) {
        errorElement.textContent = message;
      }
      if (inputElement) {
        inputElement.setAttribute('aria-invalid', 'true');
        inputElement.focus();
      }
    }
  };

  /* ==========================================================================
     7. SYSTEM TELEMETRY & UTILITIES (Performance Timing Level 2)
     ========================================================================== */
  const TelemetryController = {
    init() {
      if (DOM.currentYear) {
        DOM.currentYear.textContent = new Date().getFullYear();
      }

      if (DOM.loadTimeMetric && window.performance) {
        const updateMetric = () => {
          const navEntries = window.performance.getEntriesByType && window.performance.getEntriesByType('navigation');
          let durationMs = 0;

          if (navEntries && navEntries.length > 0) {
            const navEntry = navEntries[0];
            durationMs = Math.round(navEntry.domContentLoadedEventEnd || navEntry.duration || performance.now());
          } else {
            durationMs = Math.round(performance.now());
          }

          DOM.loadTimeMetric.textContent = `${durationMs}ms (Instant)`;
        };

        if (document.readyState === 'complete') {
          updateMetric();
        } else {
          window.addEventListener('load', updateMetric, { once: true });
        }
      }
    }
  };

  /* ==========================================================================
     APPLICATION BOOTSTRAP ON DOMContentLoaded
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    NavigationController.init();
    ScrollSpyController.init();
    FilterController.init();
    SolutionModalController.init();
    HeaderScrollController.init();
    ConsultationFormController.init();
    TelemetryController.init();
  });
})();
