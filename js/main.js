/* ========================================
   MAIN JS - Core Functionality
   ======================================== */

// Global Lenis instance
let lenis;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins first
  gsap.registerPlugin(ScrollTrigger, CustomEase);

  // Custom eases
  CustomEase.create('verticalEase', '0.4, 0, 0.2, 1');
  CustomEase.create('blurEase', '0.65, 0, 0.35, 1');
  CustomEase.create('svgEase', '0.25, 0.1, 0.25, 1');

  // Initialize Lenis for smooth scrolling
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // Make lenis globally available
  window.lenis = lenis;

  // Synchronize Lenis with GSAP's ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Add Lenis to GSAP ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Disable lag smoothing in GSAP
  gsap.ticker.lagSmoothing(0);

  // Initialize all animations after landing animation completes
  window.initMainAnimations = function() {
    setTimeout(() => {
      initHeroAnimations();
      initStatsAnimations();
      initSectionAnimations();
      initFooterAnimations();
      ScrollTrigger.refresh();
    }, 200);
  };

  // Hero section animations
  function initHeroAnimations() {
    gsap.to('.hero-image', {
      scrollTrigger: {
        trigger: '.main-section',
        start: 'top bottom',
        end: 'center center',
        scrub: 1
      },
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.5,
      ease: 'blurEase'
    });

    gsap.to('.about-text', {
      scrollTrigger: {
        trigger: '.main-section',
        start: 'top bottom',
        end: 'center center',
        scrub: 1
      },
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'verticalEase'
    });
  }

  // Stats counter animations
  function initStatsAnimations() {
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach((item, index) => {
      gsap.to(item, {
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'verticalEase'
      });
    });

    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach((counter) => {
      const target = parseInt(counter.dataset.target);
      
      ScrollTrigger.create({
        trigger: '.stats-section',
        start: 'top center',
        onEnter: () => {
          gsap.to(counter, {
            innerHTML: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerHTML: 1 },
            onUpdate: function() {
              counter.innerHTML = Math.round(counter.innerHTML);
            }
          });
        },
        once: true
      });
    });
  }

  // Section header animations
  function initSectionAnimations() {
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    sectionHeaders.forEach((header) => {
      const title = header.querySelector('.section-title');
      const subtitle = header.querySelector('.section-subtitle');
      
      if (title) {
        gsap.to(title, {
          scrollTrigger: {
            trigger: header,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
          },
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'verticalEase'
        });
      }
      
      if (subtitle) {
        gsap.to(subtitle, {
          scrollTrigger: {
            trigger: header,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
          },
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          delay: 0.2,
          ease: 'verticalEase'
        });
      }
    });
  }

  // Footer animations
  function initFooterAnimations() {
    const footerPaths = document.querySelectorAll('.footer-svg-paths path');
    
    footerPaths.forEach((path, index) => {
      gsap.set(path, {
        opacity: 0,
        y: 30
      });
    });

    const footerTl = gsap.timeline({ paused: true });
    
    footerPaths.forEach((path, index) => {
      footerTl.to(path, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'svgEase'
      }, index * 0.08);
    });

    ScrollTrigger.create({
      trigger: '.footer',
      start: 'top bottom-=100',
      onEnter: () => footerTl.play(),
      onLeaveBack: () => footerTl.reverse()
    });

    gsap.to('.footer-cta', {
      scrollTrigger: {
        trigger: '.footer',
        start: 'top bottom-=200',
        toggleActions: 'play none none reverse'
      },
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'verticalEase'
    });

    gsap.to('.footer-social', {
      scrollTrigger: {
        trigger: '.footer',
        start: 'top bottom-=200',
        toggleActions: 'play none none reverse'
      },
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0.3,
      ease: 'verticalEase'
    });
  }

  // Smooth scroll to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.classList.contains('dropdown__button')) return;
      
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target && lenis) {
        lenis.scrollTo(target, {
          offset: 0,
          duration: 1.5
        });
      }
    });
  });
});