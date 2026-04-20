document.addEventListener('DOMContentLoaded', () => {
  // ===== PAGE TRANSITION =====
  document.body.classList.add('page-transition-init');
  setTimeout(() => {
    requestAnimationFrame(() => document.body.classList.add('page-transition-ready'));
  }, 40);

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 600);
    });
  }

  // ===== THEME TOGGLE =====
  const themeBtns = document.querySelectorAll('#headerThemeToggle, #themeToggle, #quickThemeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Update icon based on theme
  const updateThemeIcon = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const icon = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    themeBtns.forEach(btn => {
      if (btn) btn.innerHTML = icon;
    });
  };
  updateThemeIcon();

  // Add click handler with smooth CSS transition
  themeBtns.forEach(btn => {
    btn?.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon();
    });
  });

  // ===== MOBILE NAVIGATION =====
  const menuBtn = document.querySelector('.menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navBackdrop = document.querySelector('.nav-backdrop');

  const closeMenu = () => {
    navMenu?.classList.remove('active');
    navBackdrop?.classList.remove('active');
    menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    navMenu?.classList.add('active');
    navBackdrop?.classList.add('active');
    menuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  menuBtn?.addEventListener('click', () => {
    if (navMenu?.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navBackdrop?.addEventListener('click', closeMenu);

  // Close menu on nav link click (mobile)
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        closeMenu();
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
      closeMenu();
    }
  });

  // ===== BACK TO TOP =====
  const backToTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop?.classList.add('active');
    } else {
      backToTop?.classList.remove('active');
    }
  }, { passive: true });

  // ===== TYPEWRITER EFFECT =====
  const typewriteElements = document.querySelectorAll('.typewrite');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    typewriteElements.forEach(el => {
      const textData = el.getAttribute('data-type');
      if (!textData) return;
      
      const texts = JSON.parse(textData);
      const wrap = document.createElement('span');
      wrap.className = 'wrap';
      el.appendChild(wrap);
      
      let textIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      
      function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
          wrap.textContent = currentText.substring(0, charIndex - 1);
          charIndex--;
        } else {
          wrap.textContent = currentText.substring(0, charIndex + 1);
          charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
          isDeleting = true;
          setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(type, 500);
        } else {
          setTimeout(type, isDeleting ? 40 : 80);
        }
      }
      
      setTimeout(type, 1000);
    });
  } else {
    // Show all text at once if reduced motion
    typewriteElements.forEach(el => {
      const textData = el.getAttribute('data-type');
      if (textData) {
        const texts = JSON.parse(textData);
        el.innerHTML = `<span class="wrap">${texts[0]}</span>`;
      }
    });
  }

  // ===== SCROLL SPY =====
  const navLinks = document.querySelectorAll('.nav-link');
  
  const handleScrollSpy = () => {
    const scrollPos = window.scrollY + 150;
    
    document.querySelectorAll('section[id]').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  handleScrollSpy();

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = window.innerWidth < 1024 ? 80 : 100;
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== MODALS =====
  // Resume opens in new tab now, no modal needed
  const resumeLinks = document.querySelectorAll('a[href*="Purushothaman_Natarajan_CV.pdf"]');
  resumeLinks.forEach(link => {
    link.setAttribute('target', '_blank');
  });

  document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      closeModal(closeBtn.closest('.modal'));
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(resumeModal);
    }
  });

  // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    // Fade up animations
    const fadeElements = document.querySelectorAll('[data-aos="fade-up"]');
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    fadeElements.forEach(el => fadeObserver.observe(el));

    // Counter animations
    const counters = document.querySelectorAll('.counter-number');
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'));
          const duration = 1500;
          const startTime = performance.now();
          
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            counter.textContent = Math.floor(progress * target);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));

    // Progress bar animations
    const progressBars = document.querySelectorAll('.progress-bar');
    const progressObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('aria-valuenow');
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
  } else {
    // Show all animations immediately if reduced motion
    document.querySelectorAll('[data-aos]').forEach(el => el.classList.add('aos-animate'));
    document.querySelectorAll('.progress-bar').forEach(bar => {
      const width = bar.getAttribute('aria-valuenow');
      if (width) bar.style.width = width + '%';
    });
    document.querySelectorAll('.counter-number').forEach(counter => {
      counter.textContent = counter.getAttribute('data-target');
    });
  }

  // ===== TOUCH IMPROVEMENTS =====
  // Remove 300ms tap delay on mobile
  document.addEventListener('touchstart', () => {}, { passive: true });
  
  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ===== SCROLL REVEAL ANIMATION =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
  });
});
