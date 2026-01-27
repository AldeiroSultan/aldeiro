/* ========================================
   PROJECTS JS - 3x3 Grid with 2x2 Expansion
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProjectsSection();
});

function initProjectsSection() {
  const projectCards = document.querySelectorAll('.project-card');
  const projectsSection = document.querySelector('.projects-section');
  const projectsGrid = document.querySelector('.projects-grid');
  
  if (!projectCards.length) return;

  // Initial reveal animation
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
  projectCards.forEach((card, index) => {
    const cardImage = card.querySelector('.project-card__image');
    const closeBtn = card.querySelector('.project-close');
    
    cardImage.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!card.classList.contains('is-expanded')) {
        openProject(card, index);
      }
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeProject(card);
    });

    card.querySelector('.project-card__expanded').addEventListener('click', (e) => {
      if (e.target.classList.contains('project-card__expanded')) {
        closeProject(card);
      }
    });
  });

  function getExpandPosition(index) {
    // 3x3 grid positions (0-8)
    // Row: Math.floor(index / 3), Col: index % 3
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    // Determine which corner/position to expand from
    // Top-left (0), Top-center (1), Top-right (2)
    // Middle-left (3), Middle-center (4), Middle-right (5)
    // Bottom-left (6), Bottom-center (7), Bottom-right (8)
    
    let position = {
      gridColumn: '',
      gridRow: '',
      transformOrigin: ''
    };
    
    // Determine column span and position
    if (col === 0) {
      // Left column - expand right
      position.gridColumn = '1 / 3';
      position.transformOrigin = 'left';
    } else if (col === 1) {
      // Center column - expand to cover center and right
      position.gridColumn = '2 / 4';
      position.transformOrigin = 'center';
    } else {
      // Right column - expand left
      position.gridColumn = '2 / 4';
      position.transformOrigin = 'right';
    }
    
    // Determine row span and position
    if (row === 0) {
      // Top row - expand down
      position.gridRow = '1 / 3';
      position.transformOrigin += ' top';
    } else if (row === 1) {
      // Middle row - expand down
      position.gridRow = '2 / 4';
      position.transformOrigin += ' center';
    } else {
      // Bottom row - expand up
      position.gridRow = '2 / 4';
      position.transformOrigin += ' bottom';
    }
    
    return position;
  }

  function openProject(card, index) {
    // Close any other open projects
    projectCards.forEach(otherCard => {
      if (otherCard !== card && otherCard.classList.contains('is-expanded')) {
        closeProject(otherCard);
      }
    });

    const position = getExpandPosition(index);
    
    // Store original position
    card.dataset.originalColumn = card.style.gridColumn || '';
    card.dataset.originalRow = card.style.gridRow || '';
    
    // Add expanded class
    card.classList.add('is-expanded');
    projectsSection.classList.add('has-expanded');
    
    // Apply expansion
    card.style.gridColumn = position.gridColumn;
    card.style.gridRow = position.gridRow;
    card.style.transformOrigin = position.transformOrigin;
    
    // Animate
    gsap.to(card, {
      scale: 1,
      zIndex: 10,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Fade other cards
    projectCards.forEach(otherCard => {
      if (otherCard !== card) {
        gsap.to(otherCard, {
          opacity: 0.3,
          scale: 0.95,
          duration: 0.3
        });
      }
    });

    // Animate expanded content
    const expandedContent = card.querySelector('.project-card__expanded');
    const expandedImage = card.querySelector('.project-expanded__image');
    const expandedDetails = card.querySelector('.project-expanded__details');

    gsap.to(expandedContent, {
      opacity: 1,
      duration: 0.3,
      delay: 0.2
    });

    gsap.fromTo(expandedImage, {
      opacity: 0,
      x: -30
    }, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      delay: 0.3,
      ease: 'power2.out'
    });

    gsap.fromTo(expandedDetails.children, {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.08,
      delay: 0.4,
      ease: 'power2.out'
    });
  }

  function closeProject(card) {
    const expandedContent = card.querySelector('.project-card__expanded');
    
    gsap.to(expandedContent, {
      opacity: 0,
      duration: 0.2
    });

    gsap.to(card, {
      scale: 1,
      zIndex: 1,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        card.classList.remove('is-expanded');
        projectsSection.classList.remove('has-expanded');
        
        // Reset grid position
        card.style.gridColumn = card.dataset.originalColumn || '';
        card.style.gridRow = card.dataset.originalRow || '';
      }
    });

    // Restore other cards
    projectCards.forEach(otherCard => {
      gsap.to(otherCard, {
        opacity: 1,
        scale: 1,
        duration: 0.3
      });
    });
  }

  // Close on escape
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
      if (!card.classList.contains('is-expanded') && !projectsSection.classList.contains('has-expanded')) {
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
        cardImage.click();
      }
    });
  });
}