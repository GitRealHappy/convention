// Smooth scroll
document.addEventListener('click', e=>{
    const a=e.target.closest('a[href^="#"]');
    if(!a)return;
    const id=a.getAttribute('href').slice(1);
    const el=document.getElementById(id);
    if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'});}
  });
  
  // Fade-in on scroll
  const faders=document.querySelectorAll('.fadein');
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}
    });
  },{threshold:.15});
  faders.forEach(f=>io.observe(f));
  
  // Sticky CTA show/hide logic
  const sticky=document.querySelector('.sticky-cta');
  const hero=document.querySelector('.hero');
  const faq=document.querySelector('#faq');
  if(sticky&&hero&&faq){
    const watchHero=new IntersectionObserver(entries=>{
      entries.forEach(en=>{
        if(en.isIntersecting){sticky.classList.remove('show');}
        else{sticky.classList.add('show');}
      });
    },{threshold:0});
    watchHero.observe(hero);
  
    const watchFAQ=new IntersectionObserver(entries=>{
      entries.forEach(en=>{
        if(en.isIntersecting){
          sticky.style.opacity='0';
          sticky.style.pointerEvents='none';
        }else{
          sticky.style.opacity='1';
          sticky.style.pointerEvents='auto';
        }
      });
    },{threshold:0});
    watchFAQ.observe(faq);
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
  