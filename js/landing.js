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
  const nameOverlay = container.querySelector('.landing-name-text');

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

  // Animate letters coming in
  if (loadingLetter.length) {
    tl.from(loadingLetter, {
      yPercent: 100,
      stagger: 0.03,
      duration: 1.25
    });
  }

  // Expand the box between Sultan and Aldeiro
  if (box.length) {
    tl.fromTo(box, {
      width: '0em',
    }, {
      width: '0.8em',
      duration: 1.25
    }, '< 1');
  }

  // Grow the image inside the box
  if (growingImage.length) {
    tl.fromTo(growingImage, {
      width: '0%',
    }, {
      width: '100%',
      duration: 1.25
    }, '<');
  }

  // Push "Sultan" to the left
  if (headingStart.length) {
    tl.fromTo(headingStart, {
      x: '0em',
    }, {
      x: '-0.12em',
      duration: 1.25
    }, '<');
  }

  // Push "Aldeiro" to the right
  if (headingEnd.length) {
    tl.fromTo(headingEnd, {
      x: '0em',
    }, {
      x: '0.12em',
      duration: 1.25
    }, '<');
  }

  // Fade out the extra images (loading1, 2, 3)
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

  // Expand image to full viewport
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

  // Animate the name overlay appearing over the landscape
  if (nameOverlay) {
    tl.to(nameOverlay, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.5,
      ease: 'expo.out'
    }, '-=1.2');
  }

  // Animate bottom letters
  if (headerLetter.length) {
    tl.from(headerLetter, {
      yPercent: 100,
      duration: 1.25,
      ease: 'expo.out',
      stagger: 0.03
    }, '< 0.5');
  }

  // Animate nav links
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