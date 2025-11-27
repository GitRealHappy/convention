// Smooth scroll with header offset
document.addEventListener('click', e=>{
    const a=e.target.closest('a[href^="#"]');
    if(!a)return;
    const id=a.getAttribute('href').slice(1);
    const el=document.getElementById(id);
    if(el){
      e.preventDefault();
      // More reliable position calculation using getBoundingClientRect
      const rect = el.getBoundingClientRect();
      const absoluteTop = rect.top + window.pageYOffset;
      const headerHeight = document.querySelector('.site-header').offsetHeight;
      const offsetTop = absoluteTop - headerHeight - 20; // 20px extra padding
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Force visibility check after scroll - important for mobile devices
      setTimeout(() => {
        const targetEl = document.getElementById(id);
        if (targetEl && targetEl.classList.contains('fadein') && !targetEl.classList.contains('visible')) {
          // Check if element is now in viewport
          const rect = targetEl.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (isVisible) {
            targetEl.classList.add('visible');
          }
        }
      }, 100);
    }
  });
  
  // Fade-in on scroll
  const faders=document.querySelectorAll('.fadein');
  
  // Helper function to check if element is visible
  const checkVisibility = (element) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const threshold = 0.15;
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    return visibleHeight > 0 && (visibleHeight / rect.height) >= threshold;
  };
  
  // Check initial visibility for elements already in viewport
  faders.forEach(f => {
    if (checkVisibility(f)) {
      f.classList.add('visible');
    }
  });
  
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}
    });
  },{threshold:.15, rootMargin:'50px'}); // Added rootMargin for better mobile detection
  faders.forEach(f=>{
    if(!f.classList.contains('visible')) {
      io.observe(f);
    }
  });
  
  // Sticky CTA show/hide logic
  const sticky = document.querySelector('.sticky-cta');
  const startSection = document.querySelector('#problem');
  const speakersSection = document.querySelector('#offer');
  
  if (sticky && startSection && speakersSection) {
    // Function to check visibility on scroll
    const checkStickyVisibility = () => {
      const startRect = startSection.getBoundingClientRect();
      const offerRect = speakersSection.getBoundingClientRect();
      
      // Show if start section top has passed the viewport top (scrolled past start of it)
      // AND if we haven't reached the offer section yet
      const passedStart = startRect.top < window.innerHeight / 2; 
      const reachedOffer = offerRect.top < window.innerHeight;
      
      if (passedStart && !reachedOffer) {
        sticky.classList.add('show');
        sticky.style.opacity = '1';
        sticky.style.pointerEvents = 'auto';
      } else {
        sticky.classList.remove('show');
        sticky.style.opacity = '0';
        sticky.style.pointerEvents = 'none';
      }
    };

    // Initial check
    checkStickyVisibility();

    // Check on scroll
    window.addEventListener('scroll', checkStickyVisibility);
  }

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.nav.mobile');
  if(hamburger && mobileNav){
    const toggleMenu = ()=>{
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking on nav links
    mobileNav.addEventListener('click', (e)=>{
      if(e.target.tagName === 'A'){
        toggleMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e)=>{
      if(!hamburger.contains(e.target) && !mobileNav.contains(e.target) && mobileNav.classList.contains('open')){
        toggleMenu();
      }
    });
  }

  // Header hide/show on scroll
  let lastScrollY = window.scrollY;
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down and past 100px
      header.classList.add('hidden');
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up
      header.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
  });

  // Itinerary Accordion
  const dayModules = document.querySelectorAll('.day-module');
  
  dayModules.forEach(module => {
    const header = module.querySelector('.day-header');
    const content = module.querySelector('.day-content');
    
    if(!header || !content) return;

    // Ensure collapsed state initially
    content.style.maxHeight = '0px';

    const closeDay = () => {
      module.classList.remove('open');
      header.setAttribute('aria-expanded', 'false');
      content.style.maxHeight = '0px';
      
      // Hide after transition
      const onEnd = () => {
        content.hidden = true;
        content.removeEventListener('transitionend', onEnd);
      };
      content.addEventListener('transitionend', onEnd);
    };

    const openDay = () => {
      module.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
      content.hidden = false;
      
      // Force reflow
      content.style.maxHeight = '0px';
      
      requestAnimationFrame(() => {
        // Calculate full height including padding
        content.style.maxHeight = content.scrollHeight + 40 + 'px'; // +40 for padding buffer
      });
    };

    header.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = module.classList.contains('open');
      
      // Optional: Close others if we want strict accordion behavior
      // dayModules.forEach(m => {
      //   if(m !== module && m.classList.contains('open')) {
      //      // close logic...
      //   }
      // });

      if(isOpen) {
        closeDay();
      } else {
        openDay();
      }
    });
  });

