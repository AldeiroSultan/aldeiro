/* ========================================
   PROJECTS JS - Expandable Project Cards
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProjectsSection();
});

function initProjectsSection() {
  const projectCards = document.querySelectorAll('.project-card');
  const projectsSection = document.querySelector('.projects-section');
  
  if (!projectCards.length) return;

  // Initial reveal animation for project cards
  projectCards.forEach((card, index) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'power2.out'
    });
  });

  // Click to expand project
  projectCards.forEach((card) => {
    const cardImage = card.querySelector('.project-card__image');
    const closeBtn = card.querySelector('.project-close');
    
    // Open on card click
    cardImage.addEventListener('click', (e) => {
      e.stopPropagation();
      openProject(card);
    });

    // Close button
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeProject(card);
    });

    // Close on clicking outside expanded content
    card.querySelector('.project-card__expanded').addEventListener('click', (e) => {
      if (e.target.classList.contains('project-card__expanded')) {
        closeProject(card);
      }
    });
  });

  function openProject(card) {
    // Close any other open projects first
    projectCards.forEach(otherCard => {
      if (otherCard !== card && otherCard.classList.contains('is-expanded')) {
        closeProject(otherCard);
      }
    });

    card.classList.add('is-expanded');
    projectsSection.classList.add('has-expanded');
    document.body.classList.add('project-open');
    
    // Stop smooth scroll while modal is open
    if (typeof lenis !== 'undefined') {
      lenis.stop();
    }

    // Animate in the expanded content
    const expandedContent = card.querySelector('.project-expanded__content');
    const expandedImage = card.querySelector('.project-expanded__image');
    const expandedDetails = card.querySelector('.project-expanded__details');

    gsap.fromTo(expandedImage, {
      opacity: 0,
      x: -50
    }, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      delay: 0.2,
      ease: 'power2.out'
    });

    gsap.fromTo(expandedDetails.children, {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.3,
      ease: 'power2.out'
    });
  }

  function closeProject(card) {
    // Animate out
    const expandedContent = card.querySelector('.project-expanded__content');
    
    gsap.to(expandedContent.children, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in',
      onComplete: () => {
        card.classList.remove('is-expanded');
        projectsSection.classList.remove('has-expanded');
        document.body.classList.remove('project-open');
        
        // Resume smooth scroll
        if (typeof lenis !== 'undefined') {
          lenis.start();
        }
      }
    });
  }

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      projectCards.forEach(card => {
        if (card.classList.contains('is-expanded')) {
          closeProject(card);
        }
      });
    }
  });

  // Hover effects
  projectCards.forEach(card => {
    const info = card.querySelector('.project-card__info');
    
    card.addEventListener('mouseenter', () => {
      if (!card.classList.contains('is-expanded')) {
        gsap.to(info, {
          y: -10,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('is-expanded')) {
        gsap.to(info, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  });

  // Keyboard accessibility
  projectCards.forEach(card => {
    const cardImage = card.querySelector('.project-card__image');
    cardImage.setAttribute('tabindex', '0');
    cardImage.setAttribute('role', 'button');
    cardImage.setAttribute('aria-label', 'View project details');
    
    cardImage.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProject(card);
      }
    });
  });
}
