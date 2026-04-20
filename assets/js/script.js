document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-enabled', 'page-transition-init');
  setTimeout(() => {
    requestAnimationFrame(() => document.body.classList.add('page-transition-ready'));
  }, 40);

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 800);
    });
  }

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ===== BACK TO TOP =====
  const backToTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop?.classList.add('active');
    } else {
      backToTop?.classList.remove('active');
    }
  });

  // ===== TYPEWRITER EFFECT =====
  const typewriteElements = document.querySelectorAll('.typewrite');
  typewriteElements.forEach(el => {
    const textData = el.getAttribute('data-type');
    if (!textData) return;
    
    const texts = JSON.parse(textData);
    const wrap = el.querySelector('.wrap') || document.createElement('span');
    wrap.className = 'wrap';
    if (!el.querySelector('.wrap')) el.appendChild(wrap);
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        wrap.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        wrap.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }
      
      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500;
      }
      
      setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
  });

  // ===== HAMBURGER MENU =====
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navBackdrop = document.querySelector('.nav-backdrop');

  const closeMenu = () => {
    navMenu?.classList.remove('show');
    navBackdrop?.classList.remove('show');
    hamburger?.classList.remove('active');
  };

  const openMenu = () => {
    navMenu?.classList.add('show');
    navBackdrop?.classList.add('show');
    hamburger?.classList.add('active');
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      if (navMenu.classList.contains('show')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      closeMenu();
    });
  });

  // ===== SCROLL SPY =====
  const handleScrollSpy = () => {
    navLinks.forEach(link => {
      const targetId = link.getAttribute('href')?.substring(1);
      const targetSection = targetId ? document.getElementById(targetId) : null;

      if (targetSection) {
        const rect = targetSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.15) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', handleScrollSpy);
  handleScrollSpy();

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== MODALS =====
  const resumeModal = document.getElementById('resumeModal');
  const heroResumeBtn = document.getElementById('heroResumeBtn');
  const resumeBtn = document.getElementById('resumeBtn');

  const openModal = modal => modal?.classList.add('show');
  const closeModal = modal => modal?.classList.remove('show');

  [resumeBtn, heroResumeBtn].forEach(btn => {
    btn?.addEventListener('click', () => openModal(resumeModal));
  });

  document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('.modal');
      closeModal(modal);
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal(resumeModal);
    }
  });

  // ===== AOS SCROLL ANIMATIONS =====
  const aosElements = document.querySelectorAll('[data-aos]');
  if ('IntersectionObserver' in window) {
    const aosObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          aosObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    aosElements.forEach(el => aosObserver.observe(el));
  }

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.counter-number');
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'));
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          
          const updateCounter = () => {
            current += step;
            if (current < target) {
              counter.textContent = Math.floor(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };
          
          updateCounter();
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
  }

  // ===== PROGRESS BARS =====
  const progressBars = document.querySelectorAll('.progress-bar');
  if ('IntersectionObserver' in window) {
    const progressObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('aria-valuenow') || bar.getAttribute('data-width');
          if (width) {
            setTimeout(() => {
              bar.style.width = width + '%';
            }, 200);
          }
          progressObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => progressObserver.observe(bar));
  }
});
