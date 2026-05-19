/* ========================================
   PROJECTS JS - 3x3 Grid with 2x2 Expansion
   + Infinite Vertical Carousel
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProjectsSection();
});

function initProjectsSection() {
  const projectCards = document.querySelectorAll('.project-card');
  const projectsSection = document.querySelector('.projects-section');
  const projectsGrid = document.querySelector('.projects-grid');
  
  if (!projectCards.length) return;

  // Reveal ALL cards when the projects section enters view
  projectCards.forEach((card, index) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: projectsSection,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: index * 0.06,
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
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    let position = {
      gridColumn: '',
      gridRow: '',
      transformOrigin: ''
    };
    
    if (col === 0) {
      position.gridColumn = '1 / 3';
      position.transformOrigin = 'left';
    } else if (col === 1) {
      position.gridColumn = '2 / 4';
      position.transformOrigin = 'center';
    } else {
      position.gridColumn = '2 / 4';
      position.transformOrigin = 'right';
    }
    
    if (row === 0) {
      position.gridRow = '1 / 3';
      position.transformOrigin += ' top';
    } else if (row === 1) {
      position.gridRow = '2 / 4';
      position.transformOrigin += ' center';
    } else {
      position.gridRow = '2 / 4';
      position.transformOrigin += ' bottom';
    }
    
    return position;
  }

  // ========================================
  // INFINITE VERTICAL CAROUSEL
  // ========================================

  function initCarousel(card) {
    const carousel = card.querySelector('.project-carousel');
    if (!carousel) return null;

    const slotTop = carousel.querySelector('.project-carousel__slot--top');
    const slotCenter = carousel.querySelector('.project-carousel__slot--center');
    const slotBottom = carousel.querySelector('.project-carousel__slot--bottom');
    const dots = carousel.querySelectorAll('.project-carousel__dot');
    const btnUp = carousel.querySelector('.project-carousel__btn--up');
    const btnDown = carousel.querySelector('.project-carousel__btn--down');

    let images = [];
    try {
      images = JSON.parse(carousel.dataset.images);
    } catch (e) {
      return null;
    }

    if (images.length < 2) return null;

    const total = images.length;
    let currentIndex = 0;
    let isAnimating = false;

    function wrap(i) {
      return ((i % total) + total) % total;
    }

    function setSlotImages(centerIdx) {
      const prevIdx = wrap(centerIdx - 1);
      const nextIdx = wrap(centerIdx + 1);
      slotTop.querySelector('img').src = images[prevIdx];
      slotCenter.querySelector('img').src = images[centerIdx];
      slotBottom.querySelector('img').src = images[nextIdx];
    }

    function updateDots(centerIdx) {
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === centerIdx);
      });
    }

    function goTo(newIndex, direction) {
      if (isAnimating) return;
      isAnimating = true;

      const newCenter = wrap(newIndex);
      const slideDistance = direction === 'down' ? -40 : 40;

      const tl = gsap.timeline({
        onComplete: () => {
          currentIndex = newCenter;
          setSlotImages(currentIndex);
          updateDots(currentIndex);

          gsap.set([slotTop, slotCenter, slotBottom], { y: 0, opacity: 1 });
          gsap.set(slotTop, { opacity: 0.4 });
          gsap.set(slotTop.querySelector('img'), { filter: 'grayscale(100%)' });
          gsap.set(slotCenter, { opacity: 1 });
          gsap.set(slotCenter.querySelector('img'), { filter: 'grayscale(0%)' });
          gsap.set(slotBottom, { opacity: 0.4 });
          gsap.set(slotBottom.querySelector('img'), { filter: 'grayscale(100%)' });

          gsap.fromTo([slotTop, slotCenter, slotBottom], 
            { y: -slideDistance * 0.6, opacity: 0 },
            { 
              y: 0, 
              opacity: (i) => i === 1 ? 1 : 0.4,
              duration: 0.35, 
              ease: 'power2.out',
              onComplete: () => { isAnimating = false; }
            }
          );
        }
      });

      tl.to([slotTop, slotCenter, slotBottom], {
        y: slideDistance,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in'
      });
    }

    function goDown() { goTo(currentIndex + 1, 'down'); }
    function goUp() { goTo(currentIndex - 1, 'up'); }

    btnUp.addEventListener('click', (e) => { e.stopPropagation(); goUp(); });
    btnDown.addEventListener('click', (e) => { e.stopPropagation(); goDown(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        if (i === currentIndex || isAnimating) return;
        goTo(i, i > currentIndex ? 'down' : 'up');
      });
    });

    slotTop.addEventListener('click', (e) => { e.stopPropagation(); goUp(); });
    slotBottom.addEventListener('click', (e) => { e.stopPropagation(); goDown(); });

    let wheelCooldown = false;
    carousel.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (wheelCooldown || isAnimating) return;
      wheelCooldown = true;
      setTimeout(() => { wheelCooldown = false; }, 400);
      if (e.deltaY > 0) { goDown(); } else { goUp(); }
    }, { passive: false });

    currentIndex = 0;
    setSlotImages(currentIndex);
    updateDots(currentIndex);

    return { goDown, goUp };
  }

  function openProject(card, index) {
    projectCards.forEach(otherCard => {
      if (otherCard !== card && otherCard.classList.contains('is-expanded')) {
        closeProject(otherCard);
      }
    });

    const position = getExpandPosition(index);
    
    card.dataset.originalColumn = card.style.gridColumn || '';
    card.dataset.originalRow = card.style.gridRow || '';
    
    card.classList.add('is-expanded');
    projectsSection.classList.add('has-expanded');
    
    card.style.gridColumn = position.gridColumn;
    card.style.gridRow = position.gridRow;
    card.style.transformOrigin = position.transformOrigin;
    
    gsap.to(card, { scale: 1, zIndex: 10, duration: 0.4, ease: 'power2.out' });

    projectCards.forEach(otherCard => {
      if (otherCard !== card) {
        gsap.to(otherCard, { opacity: 0.3, scale: 0.95, duration: 0.3 });
      }
    });

    const expandedContent = card.querySelector('.project-card__expanded');
    const expandedDetails = card.querySelector('.project-expanded__details');

    gsap.to(expandedContent, { opacity: 1, duration: 0.3, delay: 0.2 });

    if (expandedDetails) {
      gsap.fromTo(expandedDetails.children, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, delay: 0.4, ease: 'power2.out' }
      );
    }

    const carouselCtrl = initCarousel(card);
    if (carouselCtrl) { card._carouselCtrl = carouselCtrl; }

    const slots = card.querySelectorAll('.project-carousel__slot');
    gsap.fromTo(slots,
      { opacity: 0, x: -20 },
      { opacity: (i) => i === 1 ? 1 : 0.4, x: 0, duration: 0.5, stagger: 0.08, delay: 0.3, ease: 'power2.out' }
    );
  }

  function closeProject(card) {
    const expandedContent = card.querySelector('.project-card__expanded');
    
    gsap.to(expandedContent, { opacity: 0, duration: 0.2 });

    gsap.to(card, {
      scale: 1, zIndex: 1, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        card.classList.remove('is-expanded');
        projectsSection.classList.remove('has-expanded');
        card.style.gridColumn = card.dataset.originalColumn || '';
        card.style.gridRow = card.dataset.originalRow || '';
        delete card._carouselCtrl;
      }
    });

    projectCards.forEach(otherCard => {
      gsap.to(otherCard, { opacity: 1, scale: 1, duration: 0.3 });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      projectCards.forEach(card => {
        if (card.classList.contains('is-expanded')) { closeProject(card); }
      });
    }
  });

  projectCards.forEach(card => {
    const info = card.querySelector('.project-card__info');
    
    card.addEventListener('mouseenter', () => {
      if (!card.classList.contains('is-expanded') && !projectsSection.classList.contains('has-expanded')) {
        gsap.to(info, { y: -10, duration: 0.3, ease: 'power2.out' });
      }
    });

    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('is-expanded')) {
        gsap.to(info, { y: 0, duration: 0.3, ease: 'power2.out' });
      }
    });
  });

  projectCards.forEach(card => {
    const cardImage = card.querySelector('.project-card__image');
    cardImage.setAttribute('tabindex', '0');
    cardImage.setAttribute('role', 'button');
    cardImage.setAttribute('aria-label', 'View project details');
    
    cardImage.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cardImage.click(); }
    });
  });
}