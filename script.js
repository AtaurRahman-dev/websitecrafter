/**
 * Website Crafter - Main JavaScript
 * Premium agency portfolio interactions
 * Vanilla JS only - no frameworks
 */

(function () {
  'use strict';

  /* ============================================
     DOM READY
     ============================================ */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimation();
    initTestimonialCarousel();
    initParticles();
    initProjectFilters();
    initProjectSearch();
    initSmoothScroll();
    initActiveNavLink();
  }

  /* ============================================
     NAVBAR SCROLL EFFECT
     ============================================ */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let ticking = false;

    function updateNavbar() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    });

    // Initial check
    updateNavbar();
  }

  /* ============================================
     MOBILE MENU
     ============================================ */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');

    function toggleMenu() {
      const isOpen = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ============================================
     SCROLL ANIMATIONS (Intersection Observer)
     ============================================ */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.animate-fade-up, .animate-fade-left, .animate-fade-right, .animate-scale-in'
    );

    if (animatedElements.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay) || 0;

          setTimeout(function () {
            el.classList.add('visible');
          }, delay);

          observer.unobserve(el);
        }
      });
    }, observerOptions);

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================
     COUNTER ANIMATION
     ============================================ */
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (counters.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(function (counter) {
      observer.observe(counter);
    });

    function animateCounter(el) {
      const target = parseInt(el.dataset.target, 10);
      const duration = 2000; // ms
      const startTime = performance.now();
      const suffix = el.dataset.suffix || '+';

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + suffix;
        }
      }

      requestAnimationFrame(update);
    }
  }

  /* ============================================
     TESTIMONIAL CAROUSEL
     ============================================ */
  function initTestimonialCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    if (!track || !dotsContainer) return;

    const cards = track.querySelectorAll('.review-card');
    const total = cards.length;
    if (total === 0) return;

    let currentIndex = 0;
    let autoSlideInterval;
    const autoSlideDelay = 5000;

    // Create dots
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () {
        goToSlide(i);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    // Navigation arrows
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToSlide(currentIndex - 1 < 0 ? total - 1 : currentIndex - 1);
        resetAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goToSlide(currentIndex + 1 >= total ? 0 : currentIndex + 1);
        resetAutoSlide();
      });
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // Swipe left - next
          goToSlide(currentIndex + 1 >= total ? 0 : currentIndex + 1);
        } else {
          // Swipe right - prev
          goToSlide(currentIndex - 1 < 0 ? total - 1 : currentIndex - 1);
        }
        resetAutoSlide();
      }
    }

    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(function () {
        goToSlide(currentIndex + 1 >= total ? 0 : currentIndex + 1);
      }, autoSlideDelay);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    // Pause on hover
    const carouselWrapper = track.closest('.reviews-carousel');
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', function () {
        clearInterval(autoSlideInterval);
      });
      carouselWrapper.addEventListener('mouseleave', function () {
        startAutoSlide();
      });
    }

    startAutoSlide();
  }

  /* ============================================
     FLOATING PARTICLES (Hero Background)
     ============================================ */
  function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 25;
    const colors = ['rgba(45, 212, 191, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(255, 255, 255, 0.15)'];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * duration;

      particle.style.cssText =
        'position: absolute;' +
        'width: ' + size + 'px;' +
        'height: ' + size + 'px;' +
        'left: ' + left + '%;' +
        'top: ' + top + '%;' +
        'background: ' + color + ';' +
        'border-radius: 50%;' +
        'pointer-events: none;' +
        'animation: particleFloat ' + duration + 's ease-in-out ' + delay + 's infinite;';

      container.appendChild(particle);
    }

    // Inject keyframes if not already present
    if (!document.getElementById('particle-styles')) {
      const style = document.createElement('style');
      style.id = 'particle-styles';
      style.textContent =
        '@keyframes particleFloat {' +
        '0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }' +
        '10% { opacity: 1; }' +
        '90% { opacity: 1; }' +
        '50% { transform: translateY(-100px) translateX(30px); }' +
        '100% { transform: translateY(0) translateX(0); opacity: 0; }' +
        '}';
      document.head.appendChild(style);
    }
  }

  /* ============================================
     PROJECT FILTERS
     ============================================ */
  function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const noResults = document.getElementById('noResults');

    if (filterBtns.length === 0 || projectItems.length === 0) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.dataset.filter;

        // Update active state
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        // Filter items
        let visibleCount = 0;

        projectItems.forEach(function (item) {
          const categories = item.dataset.category || '';
          const shouldShow = filter === 'all' || categories.includes(filter);

          if (shouldShow) {
            item.classList.remove('hidden');
            // Stagger animation
            item.style.animation = 'none';
            item.offsetHeight; // trigger reflow
            item.style.animation = '';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(function () {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, visibleCount * 80);
            visibleCount++;
          } else {
            item.classList.add('hidden');
          }
        });

        // Show/hide no results
        if (noResults) {
          noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      });
    });
  }

  /* ============================================
     PROJECT SEARCH
     ============================================ */
  function initProjectSearch() {
    const searchInput = document.getElementById('projectSearch');
    const projectItems = document.querySelectorAll('.project-item');
    const noResults = document.getElementById('noResults');

    if (!searchInput || projectItems.length === 0) return;

    let searchTimeout;

    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function () {
        performSearch(searchInput.value.trim().toLowerCase());
      }, 200);
    });

    function performSearch(query) {
      let visibleCount = 0;

      projectItems.forEach(function (item) {
        const title = item.querySelector('.project-title')?.textContent.toLowerCase() || '';
        const desc = item.querySelector('.project-desc')?.textContent.toLowerCase() || '';
        const tags = item.querySelector('.project-tags')?.textContent.toLowerCase() || '';

        const match = !query || title.includes(query) || desc.includes(query) || tags.includes(query);

        if (match) {
          item.classList.remove('hidden');
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }
  }

  /* ============================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  /* ============================================
     ACTIVE NAV LINK ON SCROLL
     ============================================ */
  function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    let ticking = false;

    function updateActiveLink() {
      const scrollPos = window.scrollY + 150;

      sections.forEach(function (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateActiveLink);
        ticking = true;
      }
    });
  }
})();



// Initialize Carousel
document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.work-carousel', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true, // Creates an infinite loop of the 6 images
    coverflowEffect: {
      rotate: 40,      // Rotation angle of side slides
      stretch: 0,      // Space between slides
      depth: 150,      // Depth of 3D effect (how far back side slides go)
      modifier: 1,     // Effect multiplier
      slideShadows: true, // Enables realistic shadows on the sides
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
});