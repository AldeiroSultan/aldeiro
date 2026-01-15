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
  let isAnimating = false;

  // Menu button click handler
  menuBtn.addEventListener('click', () => {
    if (isAnimating) return; // Prevent clicking during animation
    
    if (!isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
    isOpen = !isOpen;
  });

  function openMenu() {
    isAnimating = true;
    navigation.classList.add('menu-open');
    
    // Stop smooth scroll while menu is open
    if (window.lenis) {
      window.lenis.stop();
    }

    // Create a single timeline for synchronized animation
    const openTimeline = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
      }
    });

    // Reset visibility of dropdown content
    gsap.set('.dropdown__section--one h1, .dropdown__section--one p, .dropdown__button', {
      opacity: 0,
      y: 20
    });
    gsap.set('.divider', { width: '0%' });

    // All elements move together in one animation
    openTimeline
      // Move dropdown, navigation, and content together as ONE unit
      .to(dropdown, {
        y: '60vh',
        duration: 0.6,
        ease: 'easeOutFast'
      }, 0)
      .to(navigation, {
        y: '60vh',
        duration: 0.6,
        ease: 'easeOutFast'
      }, 0) // Same start time = synchronized
      .to(content, {
        y: '60vh',
        duration: 0.6,
        ease: 'easeOutFast'
      }, 0) // Same start time = synchronized
      
      // Content animations start slightly before movement ends
      .to('.dropdown__section--one h1', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'easeOutFast'
      }, 0.3)
      .to('.dropdown__section--one p', {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'easeOutFast'
      }, 0.4)
      .to('.dropdown__button', {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'easeOutFast'
      }, 0.45)
      .to('.divider', {
        width: '100%',
        duration: 0.5,
        ease: 'easeOutFast'
      }, 0.4);

    dropdown.classList.add('open');
    document.querySelector('.menu-text').textContent = 'CLOSE';
  }

  function closeMenu() {
    isAnimating = true;
    navigation.classList.remove('menu-open');
    
    const closeTimeline = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        dropdown.classList.remove('open');
        document.querySelector('.menu-text').textContent = 'MENU';
        
        // Resume smooth scroll
        if (window.lenis) {
          window.lenis.start();
        }
      }
    });

    closeTimeline
      // Fade out content first
      .to('.dropdown__button', {
        opacity: 0,
        y: 15,
        duration: 0.25,
        stagger: 0.03,
        ease: 'easeInFast'
      }, 0)
      .to('.dropdown__section--one p', {
        opacity: 0,
        y: 15,
        duration: 0.25,
        ease: 'easeInFast'
      }, 0.1)
      .to('.dropdown__section--one h1', {
        opacity: 0,
        y: 20,
        duration: 0.25,
        ease: 'easeInFast'
      }, 0.15)
      .to('.divider', {
        width: '0%',
        duration: 0.3,
        ease: 'easeInFast'
      }, 0.1)
      
      // Move everything back together
      .to(dropdown, {
        y: '0',
        duration: 0.5,
        ease: 'easeInFast'
      }, 0.3)
      .to(navigation, {
        y: '0',
        duration: 0.5,
        ease: 'easeInFast'
      }, 0.3) // Same start time = synchronized
      .to(content, {
        y: '0',
        duration: 0.5,
        ease: 'easeInFast'
      }, 0.3); // Same start time = synchronized
  }

  // Close menu when clicking on nav links
  document.querySelectorAll('.dropdown__button').forEach(link => {
    link.addEventListener('click', (e) => {
      if (isOpen && !isAnimating) {
        // Get the target section
        const targetId = link.getAttribute('href');
        
        closeMenu();
        isOpen = false;
        
        // Scroll to target after menu closes
        setTimeout(() => {
          const target = document.querySelector(targetId);
          if (target && window.lenis) {
            window.lenis.scrollTo(target, {
              offset: 0,
              duration: 2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }
        }, 600);
      }
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen && !isAnimating) {
      closeMenu();
      isOpen = false;
    }
  });

  // Hide/show navbar background on scroll
  let lastScrollY = 0;

  if (window.lenis) {
    window.lenis.on('scroll', ({ scroll }) => {
      lastScrollY = scroll;
      handleScroll();
    });
  }

  // Fallback for when lenis isn't available yet
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    handleScroll();
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