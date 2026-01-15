/* ========================================
   NAVBAR JS - Navigation Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Custom eases for navbar animations
  CustomEase.create('easeOutFast', 'M0,0 C0.25,0.1 0.25,1 1,1');
  CustomEase.create('easeInFast', 'M0,0 C0.5,0 0.75,0.2 1,1');

  const menuBtn = document.getElementById('menu-btn');
  const dropdown = document.getElementById('dropdown');
  const content = document.getElementById('content');
  const navigation = document.getElementById('navigation');
  let isOpen = false;

  // Menu button click handler
  menuBtn.addEventListener('click', () => {
    if (!isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
    isOpen = !isOpen;
  });

  function openMenu() {
    navigation.classList.add('menu-open');
    
    // Reset visibility
    gsap.set('.dropdown__section--one h1, .dropdown__section--one p, .dropdown__button', {
      opacity: 1,
      y: 0
    });

    const openTimeline = gsap.timeline();

    openTimeline
      .to([dropdown, navigation, content], {
        y: '60vh',
        duration: 0.5,
        ease: 'easeOutFast'
      })
      .from('.dropdown__section--one h1', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'easeOutFast'
      }, '-=0.3')
      .from('.dropdown__section--one p', {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'easeOutFast'
      }, '-=0.2')
      .from('.dropdown__button', {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.08,
        ease: 'easeOutFast'
      }, '-=0.2')
      .to('.divider', {
        width: '100%',
        duration: 0.5,
        ease: 'easeOutFast'
      }, '-=0.4');

    dropdown.classList.add('open');
    document.querySelector('.menu-text').textContent = 'CLOSE';
  }

  function closeMenu() {
    navigation.classList.remove('menu-open');
    
    const closeTimeline = gsap.timeline();

    closeTimeline
      .to('.dropdown__button', {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.05,
        ease: 'easeInFast'
      })
      .to('.dropdown__section--one p', {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: 'easeInFast'
      }, '-=0.1')
      .to('.dropdown__section--one h1', {
        opacity: 0,
        y: 30,
        duration: 0.3,
        ease: 'easeInFast'
      }, '-=0.1')
      .to('.divider', {
        width: '0%',
        duration: 0.4,
        ease: 'easeInFast'
      })
      .to([dropdown, navigation, content], {
        y: '0',
        duration: 0.5,
        ease: 'easeInFast'
      }, '-=0.2')
      .add(() => {
        dropdown.classList.remove('open');
        document.querySelector('.menu-text').textContent = 'MENU';
      });
  }

  // Close menu when clicking on nav links
  document.querySelectorAll('.dropdown__button').forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) {
        closeMenu();
        isOpen = false;
      }
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
      isOpen = false;
    }
  });

  // Hide/show navbar on scroll
  let lastScrollY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  function handleScroll() {
    // Change navbar background when scrolling past landing
    if (lastScrollY > window.innerHeight * 0.8) {
      navigation.style.background = 'rgba(245, 245, 240, 0.95)';
      navigation.style.backdropFilter = 'blur(10px)';
    } else {
      navigation.style.background = 'transparent';
      navigation.style.backdropFilter = 'none';
    }
  }
});
