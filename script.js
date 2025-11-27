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
  const startSection = document.querySelector('#different');
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

  // Topics dropdown toggles
  const topicContainers = document.querySelectorAll('.topic');
  topicContainers.forEach(topic => {
    const toggle = topic.querySelector('.topic-toggle');
    const list = topic.querySelector('.topic-list');
    if(!toggle || !list) return;

    // Ensure collapsed state
    list.style.maxHeight = '0px';

    const closeList = () => {
      topic.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      list.style.maxHeight = '0px';
      // Hide after transition for accessibility
      const onEnd = () => {
        list.hidden = true;
        list.removeEventListener('transitionend', onEnd);
      };
      list.addEventListener('transitionend', onEnd);
    };

    const openList = () => {
      topic.classList.add('open');
      toggle.setAttribute('aria-expanded','true');
      list.hidden = false;
      // Force reflow then expand to natural height
      list.style.maxHeight = '0px';
      // Next frame for transition to apply
      requestAnimationFrame(() => {
        list.style.maxHeight = list.scrollHeight + 'px';
      });
    };

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      if(expanded){
        closeList();
      }else{
        openList();
      }
    });
  });

  // Black Friday Countdown Timer
  const timerElement = document.getElementById('bf-timer');
  if(timerElement) {
    // Set target date to today (Nov 27, 2025) at 2:00 PM PST
    // PST is UTC-8
    const targetDate = new Date("2025-11-27T14:00:00-08:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        // Time's up
        timerElement.innerHTML = "SALE IS LIVE!";
        return;
      }

      // Time calculations
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Format with leading zeros
      const formattedHours = hours < 10 ? "0" + hours : hours;
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

      timerElement.innerHTML = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    // Initial call
    updateTimer();
    
    // Update every second
    setInterval(updateTimer, 1000);
  }