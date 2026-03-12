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
    const threshold = 0.05; // Reduced from 0.15 to trigger sooner
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
  },{threshold:0.05, rootMargin:'0px'}); // Reduced threshold and adjusted rootMargin for earlier detection
  faders.forEach(f=>{
    if(!f.classList.contains('visible')) {
      io.observe(f);
    }
  });
  
  // Sticky CTA show/hide logic
  const sticky = document.querySelector('.sticky-cta');
  const startSection = document.querySelector('#venue');
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

  // Header shrink on scroll
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
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

  // Hero Image Rotation (removed - images now in venue section)

  // Speaker Modal Data
  const speakerData = {
    'dan-koe': {
      name: 'Dan Koe',
      photo: 'assets/speaker-icons/speaker1.jpg',
      tagline: '"Work less. Earn More. Enjoy Life."',
      talkTitle: 'Focusing Your Time and Attention on Your Craft In The Age of AI',
      videoId: 'x3KW3_tlZoM',
      bio: '<p>Dan Koe. The philosopher of the one-person business model, and the flow scientist behind the 4-hour workday.</p><p>Founder of Eden: One Place For All Your Creative Work.</p>',
      links: [
        { text: 'Eden', url: 'https://eden.so/' },
        { text: '1.22M Subscribers on Youtube', url: 'https://www.youtube.com/@DanKoeTalks' },
        { text: 'Author of The Future/Proof Letters', url: 'https://letters.thedankoe.com/' }
      ]
    },
    'kieran-drew': {
      name: 'Kieran Drew',
      photo: 'assets/speaker-icons/speaker12.jpg',
      tagline: 'Ex-dentist building a $500k/year internet business',
      talkTitle: 'How to Grow Your Business With Magnetic Writing',
      videoId: '7cNp7_BflD0',
      bio: '<p>On a mission to become a better writer, thinker, and entrepreneur • Ex-dentist, now building an internet business (at ~$500k/year).</p>',
      links: [
        { text: '230.3K Followers on X', url: 'https://x.com/ItsKieranDrew' },
        { text: 'Youtube', url: 'https://www.youtube.com/@kierandrewyoutube' },
        { text: 'Get his copywriting framework: SUCKS', url: 'https://sucks.kierandrew.com/' }
      ]
    },
    'taylin-simmonds': {
      name: 'Taylin Simmonds',
      photo: 'assets/speaker-icons/speaker7.jpg',
      tagline: 'AI-assisted ghostwriter • 2B impressions',
      talkTitle: 'How To Be A Multi-Passionate Creator',
      videoId: 'wfK0uFMAdPw',
      bio: '<p>College teacher turned AI assisted ghostwriter | Helping writers & creatives earn on the internet • 2B impressions • $4M+ revenue • All in on Substack</p>',
      links: [
        { text: '97.5K Followers on X', url: 'https://x.com/TaylinSimmonds' },
        { text: 'Read The Simmonds Signal', url: 'https://taylinsimmonds.substack.com/' }
      ]
    },
    'brian-maierhofer': {
      name: 'Brian Maierhofer',
      photo: 'assets/speaker-icons/speaker2.jpg',
      tagline: 'Somatic therapist & carrier of stories',
      talkTitle: 'Liminal Means ~ Entrepreneurship From A Healed Nervous System',
      videoId: 'SoWKdakrz9w',
      bio: '<p>Associate marriage and family therapist specializing in somatic & biomechanical therapy for anxiety, sensory overload, and emotional resilience.</p><p>He is a carrier of stories who, through his online work, helps countless more people than he could through 1:1 therapy alone.</p>',
      links: [
        { text: 'Find him on X @LiminalMeans', url: 'https://x.com/LiminalMeans' },
        { text: 'Find him on Substack @brianmaierhofer', url: 'https://substack.com/@brianmaierhofer?utm_source=global-search' }
      ]
    },
    'kimia-nora': {
      name: 'Kimia Nora',
      photo: 'assets/speaker-icons/speaker10.jpg',
      tagline: 'Applied Neuroscience & Neuroplasticity',
      talkTitle: 'Neuroplasticity, the Future of Success and Health',
      videoId: '-mZDcZEqd9g',
      bio: '<p>Applied Neuroscience | Self-directed Neuroplasticity | Brain Homeostasis | MindBody Medicine for healing chronic conditions.</p><p>Building <em>The Paradigm of Wholeness.</em></p><p>"Everybody deserves to know the science of change."</p>',
      links: [
        { text: '40.5K Followers on X', url: 'https://x.com/iamkimianora' },
        { text: 'Find her on Substack @kimianora', url: 'https://substack.com/@kimianora?utm_source=global-search' }
      ]
    },
    'dan-goldfield': {
      name: 'Dan Goldfield',
      photo: 'assets/speaker-icons/speaker3.jpg',
      tagline: 'Peace as your Default Mode',
      talkTitle: 'Talk 1: Effortless Effectiveness for Solopreneurs<br>Talk 2: Letting Go is Not Giving Up',
      videoId: 'M-fpcdYx23o',
      bio: '<p>"Studied with a monk for 5 years, married a hot psychologist, built a 6-figure business. Mission: help 1 billion people realize peace as their Default Mode."</p>',
      links: [
        { text: '29.1K Followers on X', url: 'https://x.com/itsdangoldfield' },
        { text: 'Debug Your Human Operating System on Youtube', url: 'https://www.youtube.com/watch?v=RWLCH0ZhfIo' }
      ]
    },
    'jack-moses': {
      name: 'Jack Moses',
      photo: 'assets/speaker-icons/speaker11.jpg',
      tagline: 'Transformation Coach & Podcaster',
      talkTitle: 'How To Magnetize Your Dream Fans and Customers with Aura and Authenticity',
      bio: '<p>Personal Transformation Coach. Writer. Creator. Quarterback. Podcaster.</p><p>Founder of Transcendence, and the Sovereign Creators Skool.</p>',
      links: [
        { text: '28K Followers on X', url: 'https://x.com/jackmoses0' }
      ]
    },
    'hussain-ibarra': {
      name: 'Hussain Ibarra',
      photo: 'assets/speaker-icons/speaker4.jpg',
      tagline: 'Engineer turned writer',
      talkTitle: 'The Key to writing high quality content and building an audience',
      videoId: 'l8gzNdc09To',
      bio: '<p>Engineer turned writer. Building a writing business to $120k/year. Helped 20+ clients build and monetize their audience.</p>',
      links: [
        { text: '22.6K Followers on X', url: 'https://x.com/HussainIbarra' },
        { text: 'Find him on Substack @hussainibarra', url: 'https://substack.com/@hussainibarra?utm_source=global-search' }
      ]
    },
    'valentin-sounds': {
      name: 'Valentin Sounds',
      photo: 'assets/speaker-icons/speaker8.jpg',
      tagline: 'Artist & Brand Advisor',
      talkTitle: 'Visionary Brand Identity: Expressing a clear feeling and message',
      bio: '<p>Artist & Brand Advisor. Helping creatives build autonomy through branding, AI, and emotional intelligence. Create work you love and explore the world.</p>',
      links: [
        { text: 'Find him on X', url: 'https://x.com/valentinmakes' }
      ]
    },
    'nathalie-agnes': {
      name: 'Nathalie Agnes',
      photo: 'assets/speaker-icons/speaker6.jpg',
      tagline: 'Business, spirituality & creativity',
      talkTitle: 'The Spiritual Dimension of Sales',
      bio: '<p>"I used to help people see more clearly through glasses. Now I write to help them see themselves and their future more clearly. Perspectives on business, spirituality & creativity."</p>',
      links: [
        { text: 'Find her on X', url: 'https://x.com/NathalieAgnesk' },
        { text: 'Host of the podcast 20/20 Vision', url: 'https://youtube.com/playlist?list=PLq8mioblqLPCy5-rjI6dyQKAy2Q2X1VW6' }
      ]
    },
    'david-morin': {
      name: 'David Morin',
      photo: 'assets/speaker-icons/speaker14.jpg',
      tagline: 'Poet & Existential Guide',
      talkTitle: 'Uncovering Your True Voice',
      videoId: 'c3f9a7or_s0',
      bio: '<p>"Poet, Existential Guide, & Life Transition Coach. Turn existential dread into meaningful living."</p><p>David\'s work is to guide you in reclaiming your true voice.</p>',
      links: [
        { text: 'Find him on IG @mor.intune', url: 'https://www.instagram.com/mor.intune/' },
        { text: 'Find him on Substack @moreintune', url: 'https://substack.com/@morintune' }
      ]
    },
    'logan-quinn': {
      name: 'Logan Quinn',
      photo: 'assets/speaker-icons/speaker5.jpg',
      tagline: 'Holistic health practitioner',
      talkTitle: 'Scaling A Holistic Health Coaching Business To Training Practitioners Online',
      videoId: 'KUEKB2xhP5s',
      bio: '<p>Holistic health care practitioner with a background in kinesiology and body-centered psychotherapy.</p><p>Logan runs Medicine of Mankind in Vancouver, Canada, and internationally online, where he helps clients wake up to their soul\'s calling by rehabilitating the body, mind, and soul through applied spirituality, psychotherapy, and kinesiology based principles.</p>',
      links: [
        { text: 'Medicine of Mankind', url: 'https://www.medicineofmankind.com/' }
      ]
    },
    'jesse-james-carver': {
      name: 'Jesse James Carver',
      photo: 'assets/speaker-icons/speaker13-jessejames.jpg',
      tagline: 'Host of Unblocked Creators',
      talkTitle: 'Rites of Passage, Leadership, Being Human (Live podcast with Ish Hasan)',
      bio: '<p>Host of the podcast Unblocked Creators.</p><p>"Helping creators unblock their freedom, creativity, and personal agency through depth psychology, digital skills, and community."</p><p>Creator of The Living Internet University.</p>',
      links: [
        { text: 'Unblocked Creators Podcast', url: 'https://youtube.com/playlist?list=PLdQ91meMfIHldnc6T57Y-A6AH1auy6-vE' },
        { text: 'Find him on X', url: 'https://x.com/UnblockedCarver' }
      ]
    },
    'ish-hasan': {
      name: 'Ish Hasan',
      photo: 'assets/speaker-icons/speaker15.jpg',
      tagline: 'Author & men\'s work facilitator',
      talkTitle: 'Rites of Passage, Leadership, Being Human (Live podcast with Jesse James Carver)',
      bio: '<p>Published author, mountain guide, intimacy coach, and men\'s work facilitator.</p><p>Ish writes about shadow work, conscious relationships, and purpose.</p>',
      links: [
        { text: 'Find him on Substack: RadicalEros', url: 'https://substack.com/@radicaleros' }
      ]
    },
    'olivia-peers': {
      name: 'Olivia Peers',
      photo: 'assets/speaker-icons/speaker16.jpg',
      tagline: 'Founder, Artist, Human potential educator',
      talkTitle: 'How I used The Creator Economy to transform my life philosophy “Deeper Living OS” into a sold-out human potential course (with 100% close rate & life-changing results).',
      bio: '<p>Founder, Artist, Human potential educator exploring the intersection of philosophy, psychology, and living deeply.</p>',
      links: []
    },
    'michael-oliver': {
      name: 'Michael Oliver',
      photo: 'assets/speaker-icons/speaker17.jpg',
      tagline: 'Transformative Healing & Community Driven Business',
      talkTitle: 'Democratizing Transcendence',
      bio: '<p>Michael is founder of The Flying Sage, a community on a mission to democratize transcendence, and Legacy Journeys, a guiding practice that offers transformative psychedelic experiences towards embodiment and lasting change. Michael also supports creators and entrepreneurs optimize their businesses and work through Reclaimer, which offers deep work sprints and Notion systems for businesses.</p>',
      links: [
        { text: 'michaeloliver.ca', url: 'https://www.michaeloliver.ca' }
      ]
    }
  };

  // Speaker Modal Functionality
  const speakerOrder = ['dan-koe', 'kieran-drew', 'taylin-simmonds', 'brian-maierhofer', 'dan-goldfield', 'hussain-ibarra', 'kimia-nora', 'jack-moses', 'valentin-sounds', 'logan-quinn', 'nathalie-agnes', 'ish-hasan', 'david-morin', 'olivia-peers', 'michael-oliver'];
  let currentSpeakerId = null;

  const speakerModal = document.getElementById('speaker-modal');
  const modalBackdrop = speakerModal?.querySelector('.modal-backdrop');
  const modalClose = speakerModal?.querySelector('.modal-close');
  const modalPhoto = speakerModal?.querySelector('.modal-photo');
  const modalName = speakerModal?.querySelector('.modal-name');
  const modalTagline = speakerModal?.querySelector('.modal-tagline');
  const modalTalkTitle = speakerModal?.querySelector('.modal-talk-title');
  const modalVideoWrap = speakerModal?.querySelector('.modal-video-wrap');
  const modalVideoIframe = speakerModal?.querySelector('.modal-video-iframe');
  const modalBio = speakerModal?.querySelector('.modal-bio');
  const modalLinks = speakerModal?.querySelector('.modal-links');
  const modalNavPrev = speakerModal?.querySelector('.modal-nav-prev');
  const modalNavNext = speakerModal?.querySelector('.modal-nav-next');

  function populateSpeakerModal(speakerId) {
    const speaker = speakerData[speakerId];
    if (!speaker || !speakerModal) return;

    currentSpeakerId = speakerId;

    // Populate modal
    modalPhoto.src = speaker.photo;
    modalPhoto.alt = speaker.name;
    modalName.textContent = speaker.name;
    modalTagline.textContent = speaker.tagline;
    if (modalTalkTitle) {
      modalTalkTitle.innerHTML = speaker.talkTitle || '';
    }
    modalBio.innerHTML = speaker.bio;

    // Show/hide video based on speaker
    if (speaker.videoId && modalVideoWrap && modalVideoIframe) {
      modalVideoIframe.src = `https://www.youtube.com/embed/${speaker.videoId}?start=20`;
      modalVideoWrap.style.display = 'block';
    } else if (modalVideoWrap && modalVideoIframe) {
      modalVideoIframe.src = '';
      modalVideoWrap.style.display = 'none';
    }

    // Show modal
    speakerModal.classList.add('open');
    speakerModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function openSpeakerModal(speakerId) {
    populateSpeakerModal(speakerId);
  }

  function goToPrevSpeaker() {
    if (!currentSpeakerId) return;
    const idx = speakerOrder.indexOf(currentSpeakerId);
    const prevIdx = idx <= 0 ? speakerOrder.length - 1 : idx - 1;
    populateSpeakerModal(speakerOrder[prevIdx]);
  }

  function goToNextSpeaker() {
    if (!currentSpeakerId) return;
    const idx = speakerOrder.indexOf(currentSpeakerId);
    const nextIdx = idx >= speakerOrder.length - 1 ? 0 : idx + 1;
    populateSpeakerModal(speakerOrder[nextIdx]);
  }

  function closeSpeakerModal() {
    if (!speakerModal) return;
    if (modalVideoIframe) modalVideoIframe.src = '';
    currentSpeakerId = null;
    speakerModal.classList.remove('open');
    speakerModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Click handlers for speaker items (handles both id and data-speaker attributes)
  document.querySelectorAll('.speaker-item').forEach(item => {
    const speakerId = item.id || item.dataset.speaker;
    if (speakerId && speakerData[speakerId]) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openSpeakerModal(speakerId);
      });
    }
  });

  // Click handler for quote icons with data-speaker attribute
  document.querySelectorAll('.quote-icon[data-speaker]').forEach(icon => {
    const speakerId = icon.dataset.speaker;
    if (speakerId && speakerData[speakerId]) {
      icon.style.cursor = 'pointer';
      icon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openSpeakerModal(speakerId);
      });
    }
  });

  // Click handler for speaker talk rows
  document.querySelectorAll('.speaker-talk-row[data-speaker]').forEach(row => {
    const speakerId = row.dataset.speaker;
    if (speakerId && speakerData[speakerId]) {
      row.style.cursor = 'pointer';
      row.addEventListener('click', (e) => {
        e.preventDefault();
        openSpeakerModal(speakerId);
      });
    }
  });

  // Close modal handlers
  modalClose?.addEventListener('click', closeSpeakerModal);
  modalBackdrop?.addEventListener('click', closeSpeakerModal);

  // Nav arrow handlers
  modalNavPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToPrevSpeaker();
  });
  modalNavNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToNextSpeaker();
  });

  document.addEventListener('keydown', (e) => {
    if (!speakerModal?.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeSpeakerModal();
    } else if (e.key === 'ArrowLeft') {
      goToPrevSpeaker();
    } else if (e.key === 'ArrowRight') {
      goToNextSpeaker();
    }
  });

  // Free Guide Modal
  const freeGuideModal = document.getElementById('free-guide-modal');
  const freeGuideBackdrop = freeGuideModal?.querySelector('.modal-backdrop');
  const freeGuideClose = freeGuideModal?.querySelector('.free-guide-modal-close');

  function openFreeGuideModal() {
    if (!freeGuideModal) return;
    freeGuideModal.classList.add('open');
    freeGuideModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeFreeGuideModal() {
    if (!freeGuideModal) return;
    freeGuideModal.classList.remove('open');
    freeGuideModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.free-guide-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openFreeGuideModal();
    });
  });

  freeGuideClose?.addEventListener('click', closeFreeGuideModal);
  freeGuideBackdrop?.addEventListener('click', closeFreeGuideModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && freeGuideModal?.classList.contains('open')) {
      closeFreeGuideModal();
    }
  });

  // Sponsor Popup
  const sponsorPopup = document.getElementById('sponsor-popup');
  const sponsorPopupBackdrop = sponsorPopup?.querySelector('.sponsor-popup-backdrop');
  const sponsorPopupClose = sponsorPopup?.querySelector('.sponsor-popup-close');
  const sponsorPopupTitle = sponsorPopup?.querySelector('.sponsor-popup-title');
  const sponsorPopupDesc = sponsorPopup?.querySelector('.sponsor-popup-desc');
  const sponsorPopupLink = sponsorPopup?.querySelector('.sponsor-popup-link');

  function openSponsorPopup(name, desc, url) {
    if (!sponsorPopup || !sponsorPopupTitle || !sponsorPopupDesc || !sponsorPopupLink) return;
    sponsorPopupTitle.textContent = name;
    sponsorPopupDesc.textContent = desc;
    sponsorPopupLink.href = url;
    sponsorPopup.classList.add('open');
    sponsorPopup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSponsorPopup() {
    if (!sponsorPopup) return;
    sponsorPopup.classList.remove('open');
    sponsorPopup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const logo = e.target.closest('.sponsor-logo[data-sponsor-name]');
    if (!logo) return;
    e.preventDefault();
    e.stopPropagation();
    const name = logo.getAttribute('data-sponsor-name');
    const desc = logo.getAttribute('data-sponsor-desc');
    const url = logo.getAttribute('data-sponsor-url');
    if (name && desc && url) openSponsorPopup(name, desc, url);
  });

  sponsorPopupClose?.addEventListener('click', closeSponsorPopup);
  sponsorPopupBackdrop?.addEventListener('click', closeSponsorPopup);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sponsorPopup?.classList.contains('open')) {
      closeSponsorPopup();
    }
  });

  // Free Stuff Dropdown
  document.querySelectorAll('.free-stuff-dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.free-stuff-toggle');
    const menu = dropdown.querySelector('.free-stuff-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('open');
      // Close all other dropdowns first
      document.querySelectorAll('.free-stuff-menu.open').forEach(m => {
        m.classList.remove('open');
        m.setAttribute('aria-hidden', 'true');
        m.closest('.free-stuff-dropdown').querySelector('.free-stuff-toggle').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        menu.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.free-stuff-menu.open').forEach(menu => {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      menu.closest('.free-stuff-dropdown').querySelector('.free-stuff-toggle').setAttribute('aria-expanded', 'false');
    });
  });

  // Prevent dropdown close when clicking inside the menu
  document.querySelectorAll('.free-stuff-menu').forEach(menu => {
    menu.addEventListener('click', (e) => e.stopPropagation());
  });

  // Speaker navigation arrows
  (function() {
    const speakerTrack = document.querySelector('.speaker-track');
    const prevBtn = document.querySelector('.speaker-nav-prev');
    const nextBtn = document.querySelector('.speaker-nav-next');
    
    if (!speakerTrack || !prevBtn || !nextBtn) return;
    
    let manualOffset = 0;
    let isManualMode = false;
    let resumeTimeout = null;
    const speakerWidth = 160; // approximate width of speaker item + gap
    
    // Jump 2 speakers on desktop, 1 on mobile
    const getJumpAmount = () => {
      return window.innerWidth <= 768 ? speakerWidth : speakerWidth * 2;
    };
    
    // Get the total width of original speakers (half of track since it's duplicated)
    const getMaxOffset = () => {
      return speakerTrack.scrollWidth / 2;
    };
    
    const pauseAutoScroll = () => {
      speakerTrack.style.animation = 'none';
      isManualMode = true;
      
      // Clear any existing resume timeout
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
      }
      
      // Resume auto-scroll after 5 seconds of inactivity
      resumeTimeout = setTimeout(() => {
        resumeAutoScroll();
      }, 5000);
    };
    
    const resumeAutoScroll = () => {
      isManualMode = false;
      manualOffset = 0;
      speakerTrack.style.transform = '';
      speakerTrack.style.animation = '';
    };
    
    const scrollSpeakers = (direction) => {
      if (!isManualMode) {
        // Get current computed transform to start from current position
        const computedStyle = window.getComputedStyle(speakerTrack);
        const matrix = new DOMMatrix(computedStyle.transform);
        manualOffset = matrix.m41; // get current X translation
      }
      
      pauseAutoScroll();
      
      const maxOffset = getMaxOffset();
      
      const jumpAmount = getJumpAmount();
      
      if (direction === 'next') {
        manualOffset -= jumpAmount;
      } else {
        manualOffset += jumpAmount;
      }
      
      speakerTrack.style.transition = 'transform 0.5s ease-out';
      speakerTrack.style.transform = `translateX(${manualOffset}px)`;
      
      // After animation completes, check for seamless loop repositioning
      setTimeout(() => {
        speakerTrack.style.transition = 'none';
        
        // Seamless loop: silently reposition when crossing boundaries
        if (Math.abs(manualOffset) >= maxOffset) {
          // Gone past the end of Set 2, reset to equivalent position in Set 1
          manualOffset = manualOffset + maxOffset;
          speakerTrack.style.transform = `translateX(${manualOffset}px)`;
        } else if (manualOffset > 0) {
          // Gone past the start of Set 1, jump to equivalent position in Set 2
          manualOffset = manualOffset - maxOffset;
          speakerTrack.style.transform = `translateX(${manualOffset}px)`;
        }
      }, 500);
    };
    
    prevBtn.addEventListener('click', () => scrollSpeakers('prev'));
    nextBtn.addEventListener('click', () => scrollSpeakers('next'));
  })();

  // Ticket tier toggle functionality
  document.querySelectorAll('.tier-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const tier = btn.closest('.tier');
      tier.classList.toggle('open');
      btn.textContent = tier.classList.contains('open') 
        ? 'Show less' 
        : 'See full details';
    });
  });

  // Venue gallery: dot indicators switch visible slide, auto-advance every 2.5s, swipe on mobile
  (function() {
    const gallery = document.querySelector('.venue-gallery');
    if (!gallery) return;
    const view = gallery.querySelector('.venue-gallery-view');
    const slides = gallery.querySelectorAll('.venue-gallery-slide');
    const dots = gallery.querySelectorAll('.venue-gallery-dot');
    if (!slides.length || !dots.length) return;

    let currentIndex = 0;
    const delayMs = 2500;
    let autoInterval = null;
    let touchStartX = null;

    function goTo(index) {
      const i = Math.max(0, Math.min(index, slides.length - 1));
      currentIndex = i;
      slides.forEach((s, j) => s.classList.toggle('active', j === i));
      dots.forEach((d, j) => {
        d.classList.toggle('active', j === i);
        d.setAttribute('aria-selected', j === i);
      });
    }

    function next() {
      goTo((currentIndex + 1) % slides.length);
    }

    function prev() {
      goTo(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
    }

    function startAutoAdvance() {
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setInterval(next, delayMs);
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        startAutoAdvance();
      });
    });

    if (view) {
      view.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches ? e.changedTouches[0].clientX : e.touches[0].clientX;
      }, { passive: true });
      view.addEventListener('touchend', (e) => {
        if (touchStartX == null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchStartX - touchEndX;
        const minSwipe = 50;
        if (deltaX > minSwipe) next();
        else if (deltaX < -minSwipe) prev();
        touchStartX = null;
      }, { passive: true });
    }

    startAutoAdvance();
  })();

  // Workshop Series Pop-up (shows after 15 seconds)
  (function() {
    const popup = document.getElementById('workshop-popup');
    if (!popup) return;

    const closeBtn = popup.querySelector('.workshop-popup-close');
    const STORAGE_KEY = 'workshop-popup-dismissed';

    // Check if user has already dismissed the popup
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // Show popup after 15 seconds
    const showTimeout = setTimeout(() => {
      popup.classList.add('visible');
      popup.setAttribute('aria-hidden', 'false');
    }, 45000);

    // Close popup handler
    function closePopup() {
      popup.classList.remove('visible');
      popup.setAttribute('aria-hidden', 'true');
      sessionStorage.setItem(STORAGE_KEY, 'true');
      clearTimeout(showTimeout);
    }

    closeBtn?.addEventListener('click', closePopup);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('visible')) {
        closePopup();
      }
    });
  })();

  // Lazy-load Unblocked Creators iframes only when expanded
  (function() {
    const detailsEl = document.querySelector('.unblocked-creators-expand');
    if (!detailsEl) return;
    detailsEl.addEventListener('toggle', function() {
      if (detailsEl.open) {
        detailsEl.querySelectorAll('iframe[data-src]').forEach(iframe => {
          if (iframe.dataset.src && !iframe.src) {
            iframe.src = iframe.dataset.src;
          }
        });
      }
    });
  })();

  // Early Bird Countdown Timer
  (function() {
    const countdownEl = document.getElementById('early-bird-countdown');
    if (!countdownEl) return;

    const deadline = new Date(countdownEl.dataset.deadline).getTime();
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    function updateCountdown() {
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        countdownEl.innerHTML = '<span class="countdown-expired">Early Bird Has Ended!</span>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = days.toString().padStart(2, '0');
      hoursEl.textContent = hours.toString().padStart(2, '0');
      minutesEl.textContent = minutes.toString().padStart(2, '0');
      secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  })();

  // Agenda panel: reorder content on mobile so each day's content follows its header
  (function() {
    const agendaPanel = document.querySelector('.agenda-panel');
    if (!agendaPanel) return;

    const isMobile = () => window.innerWidth < 900;
    let isReordered = false;

    function reorderForMobile() {
      if (!isMobile() || isReordered) return;
      
      const headers = agendaPanel.querySelectorAll('.agenda-days-headers .agenda-day-header');
      const days = agendaPanel.querySelectorAll('.agenda-days-grid .agenda-day');
      
      if (headers.length !== days.length) return;

      // Create mobile headers container (always visible, inside summary)
      const mobileHeaders = document.createElement('div');
      mobileHeaders.className = 'agenda-mobile-headers';
      
      // Create mobile content container (collapsible, outside summary)
      const mobileContent = document.createElement('div');
      mobileContent.className = 'agenda-mobile-content';
      
      headers.forEach((header, i) => {
        // Clone header for the always-visible summary
        const headerForSummary = header.cloneNode(true);
        headerForSummary.classList.add('agenda-mobile-header');
        mobileHeaders.appendChild(headerForSummary);
        
        // Create a wrapper with header + content for the expandable area
        const dayWrapper = document.createElement('div');
        dayWrapper.className = 'agenda-mobile-day-wrapper';
        
        const headerClone = header.cloneNode(true);
        headerClone.classList.add('agenda-mobile-day-header');
        dayWrapper.appendChild(headerClone);
        
        if (days[i]) {
          const dayClone = days[i].cloneNode(true);
          dayClone.classList.add('agenda-mobile-day');
          dayWrapper.appendChild(dayClone);
        }
        
        mobileContent.appendChild(dayWrapper);
      });

      // Hide desktop elements
      agendaPanel.querySelector('.agenda-days-headers').style.display = 'none';
      agendaPanel.querySelector('.agenda-days-grid').style.display = 'none';
      
      // Add mobile headers to summary, content after summary
      const toggle = agendaPanel.querySelector('.agenda-panel-toggle');
      toggle.appendChild(mobileHeaders);
      toggle.after(mobileContent);
      
      // Make day headers clickable to collapse the panel
      mobileContent.querySelectorAll('.agenda-mobile-day-header').forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
          agendaPanel.removeAttribute('open');
        });
      });
      
      isReordered = true;
    }

    function reorderForDesktop() {
      if (isMobile() || !isReordered) return;
      
      const mobileHeaders = agendaPanel.querySelector('.agenda-mobile-headers');
      const mobileContent = agendaPanel.querySelector('.agenda-mobile-content');
      if (mobileHeaders) mobileHeaders.remove();
      if (mobileContent) mobileContent.remove();
      
      agendaPanel.querySelector('.agenda-days-headers').style.display = '';
      agendaPanel.querySelector('.agenda-days-grid').style.display = '';
      
      isReordered = false;
    }

    function handleResize() {
      if (isMobile()) {
        reorderForMobile();
      } else {
        reorderForDesktop();
      }
    }

    // Initial setup
    handleResize();
    window.addEventListener('resize', handleResize);
  })();

