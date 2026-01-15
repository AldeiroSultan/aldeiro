/* ========================================
   EXPERIENCE JS - Expandable List
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initExperienceSection();
});

function initExperienceSection() {
  const experienceItems = document.querySelectorAll('.experience-item');
  
  if (!experienceItems.length) return;

  // Duplicate gallery images for seamless loop
  experienceItems.forEach(item => {
    const track = item.querySelector('.gallery-track');
    if (track) {
      const images = track.innerHTML;
      track.innerHTML = images + images; // Duplicate for infinite scroll
    }
  });

  // Click handlers for expanding/collapsing
  experienceItems.forEach((item, index) => {
    const header = item.querySelector('.experience-header');
    
    header.addEventListener('click', () => {
      const isExpanded = item.classList.contains('is-expanded');
      
      // Close all other items
      experienceItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('is-expanded')) {
          collapseItem(otherItem);
        }
      });
      
      // Toggle current item
      if (isExpanded) {
        collapseItem(item);
      } else {
        expandItem(item);
      }
    });
  });

  function expandItem(item) {
    item.classList.add('is-expanded');
    
    const content = item.querySelector('.experience-content');
    const gallery = item.querySelector('.gallery-track');
    
    // Animate expansion
    gsap.to(content, {
      maxHeight: '50rem',
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    });
    
    // Start gallery animation
    if (gallery) {
      gallery.style.animationPlayState = 'running';
    }
  }

  function collapseItem(item) {
    item.classList.remove('is-expanded');
    
    const content = item.querySelector('.experience-content');
    const gallery = item.querySelector('.gallery-track');
    
    // Animate collapse
    gsap.to(content, {
      maxHeight: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    });
    
    // Pause gallery animation
    if (gallery) {
      gallery.style.animationPlayState = 'paused';
    }
  }

  // Scroll-triggered reveal animations
  experienceItems.forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top bottom-=50',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'power2.out'
    });
  });

  // Keyboard accessibility
  experienceItems.forEach(item => {
    const header = item.querySelector('.experience-header');
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');
    
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  // Update aria-expanded on toggle
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const item = mutation.target;
        const header = item.querySelector('.experience-header');
        const isExpanded = item.classList.contains('is-expanded');
        header.setAttribute('aria-expanded', isExpanded.toString());
      }
    });
  });

  experienceItems.forEach(item => {
    observer.observe(item, { attributes: true });
  });
}
