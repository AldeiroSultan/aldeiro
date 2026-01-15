/* ========================================
   LANDING JS - Loading Animation
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLandingAnimation();
});

function initLandingAnimation() {
  const container = document.querySelector('.landing-header');
  
  if (!container) return;

  const loadingLetter = container.querySelectorAll('.landing__letter');
  const box = container.querySelectorAll('.landing-loader__box');
  const growingImage = container.querySelectorAll('.landing__growing-image');
  const headingStart = container.querySelectorAll('.landing__h1-start');
  const headingEnd = container.querySelectorAll('.landing__h1-end');
  const coverImageExtra = container.querySelectorAll('.landing__cover-image-extra');
  const headerLetter = container.querySelectorAll('.landing__letter-white');
  const navLinks = container.querySelectorAll('.landing-nav__link, .landing-credits__p');

  // GSAP Timeline
  const tl = gsap.timeline({
    defaults: {
      ease: 'expo.inOut',
    },
    onStart: () => {
      container.classList.remove('is--hidden');
      // Disable scroll during animation
      document.body.style.overflow = 'hidden';
    },
    onComplete: () => {
      // Enable scroll after animation
      document.body.style.overflow = '';
      container.classList.remove('is--loading');
      
      // Initialize main page animations after landing completes
      if (typeof window.initMainAnimations === 'function') {
        setTimeout(() => {
          window.initMainAnimations();
        }, 100);
      }
    }
  });

  // Start of Timeline - Letters animate up
  if (loadingLetter.length) {
    tl.from(loadingLetter, {
      yPercent: 100,
      stagger: 0.04,
      duration: 1.25
    });
  }

  // Box expands
  if (box.length) {
    tl.fromTo(box, {
      width: '0em',
    }, {
      width: '1em',
      duration: 1.25
    }, '< 1.25');
  }

  // Image grows inside box
  if (growingImage.length) {
    tl.fromTo(growingImage, {
      width: '0%',
    }, {
      width: '100%',
      duration: 1.25
    }, '<');
  }

  // Letters spread apart
  if (headingStart.length) {
    tl.fromTo(headingStart, {
      x: '0em',
    }, {
      x: '-0.05em',
      duration: 1.25
    }, '<');
  }

  if (headingEnd.length) {
    tl.fromTo(headingEnd, {
      x: '0em',
    }, {
      x: '0.05em',
      duration: 1.25
    }, '<');
  }

  // Image layer transitions
  if (coverImageExtra.length) {
    tl.fromTo(coverImageExtra, {
      opacity: 1,
    }, {
      opacity: 0,
      duration: 0.08,
      ease: 'none',
      stagger: 0.4
    }, '-=0.1');
  }

  // Image expands to full screen
  if (growingImage.length) {
    tl.to(growingImage, {
      width: '100vw',
      height: '100dvh',
      duration: 2
    }, '< 1.25');
  }

  if (box.length) {
    tl.to(box, {
      width: '110vw',
      duration: 2
    }, '<');
  }

  // White letters animate in
  if (headerLetter.length) {
    tl.from(headerLetter, {
      yPercent: 100,
      duration: 1.25,
      ease: 'expo.out',
      stagger: 0.04
    }, '< 1.2');
  }

  // Nav links animate in
  if (navLinks.length) {
    tl.from(navLinks, {
      yPercent: 100,
      opacity: 0,
      duration: 1.25,
      ease: 'expo.out',
      stagger: 0.08
    }, '<');
  }
}
