/* ========================================
   LANDING JS - Loading Animation
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLandingAnimation();
});

function initLandingAnimation() {
  const container = document.querySelector('.landing-header');
  
  if (!container) return;

  const loadingLetter = container.querySelectorAll('.landing-loader .landing__letter');
  const box = container.querySelectorAll('.landing-loader__box');
  const growingImage = container.querySelectorAll('.landing__growing-image');
  const headingStart = container.querySelectorAll('.landing__h1-start');
  const headingEnd = container.querySelectorAll('.landing__h1-end');
  const coverImageExtra = container.querySelectorAll('.landing__cover-image-extra');
  const headerLetter = container.querySelectorAll('.landing__letter-white');
  const navLinks = container.querySelectorAll('.landing-nav__link, .landing-credits__p');

  const tl = gsap.timeline({
    defaults: {
      ease: 'expo.inOut',
    },
    onStart: () => {
      container.classList.remove('is--hidden');
      document.body.style.overflow = 'hidden';
      
      if (window.lenis) {
        window.lenis.stop();
      }
    },
    onComplete: () => {
      document.body.style.overflow = '';
      container.classList.remove('is--loading');
      
      if (window.lenis) {
        window.lenis.start();
      }
      
      if (typeof window.initMainAnimations === 'function') {
        setTimeout(() => {
          window.initMainAnimations();
        }, 100);
      }
    }
  });

  if (loadingLetter.length) {
    tl.from(loadingLetter, {
      yPercent: 100,
      stagger: 0.03,
      duration: 1.25
    });
  }

  if (box.length) {
    tl.fromTo(box, {
      width: '0em',
    }, {
      width: '0.8em',
      duration: 1.25
    }, '< 1');
  }

  if (growingImage.length) {
    tl.fromTo(growingImage, {
      width: '0%',
    }, {
      width: '100%',
      duration: 1.25
    }, '<');
  }

  if (headingStart.length) {
    tl.fromTo(headingStart, {
      x: '0em',
    }, {
      x: '-0.08em',
      duration: 1.25
    }, '<');
  }

  if (headingEnd.length) {
    tl.fromTo(headingEnd, {
      x: '0em',
    }, {
      x: '0.08em',
      duration: 1.25
    }, '<');
  }

  if (coverImageExtra.length) {
    tl.fromTo(coverImageExtra, {
      opacity: 1,
    }, {
      opacity: 0,
      duration: 0.1,
      ease: 'none',
      stagger: 0.35
    }, '-=0.2');
  }

  if (growingImage.length) {
    tl.to(growingImage, {
      width: '100vw',
      height: '100dvh',
      duration: 2
    }, '< 1');
  }

  if (box.length) {
    tl.to(box, {
      width: '110vw',
      duration: 2
    }, '<');
  }

  if (headerLetter.length) {
    tl.from(headerLetter, {
      yPercent: 100,
      duration: 1.25,
      ease: 'expo.out',
      stagger: 0.03
    }, '< 1');
  }

  if (navLinks.length) {
    tl.from(navLinks, {
      yPercent: 100,
      opacity: 0,
      duration: 1.25,
      ease: 'expo.out',
      stagger: 0.06
    }, '<');
  }
}