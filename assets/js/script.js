document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-enabled', 'page-transition-init');
  setTimeout(() => {
    requestAnimationFrame(() => document.body.classList.add('page-transition-ready'));
  }, 40);
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      hamburger.classList.toggle('active');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      navMenu?.classList.remove('show');
      hamburger?.classList.remove('active');
    });
  });

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

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Soft page transitions between index and consulting
  const softLinks = document.querySelectorAll('a[data-soft-nav]');
  softLinks.forEach(link => {
    if (link.target === '_blank') return;
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href) return;
      // only intercept full page navigations, not same-page anchors
      if (href.startsWith('#')) return;
      event.preventDefault();
      document.body.classList.add('page-leave');
      setTimeout(() => {
        window.location.href = href;
      }, 280);
    });
  });

  const resumeModal = document.getElementById('resumeModal');
  const papersModal = document.getElementById('papersModal');
  const heroResumeBtn = document.getElementById('heroResumeBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const papersBtn = document.getElementById('papersBtn');

  const openModal = modal => modal?.classList.add('show');
  const closeModal = modal => modal?.classList.remove('show');

  [resumeBtn, heroResumeBtn].forEach(btn => {
    btn?.addEventListener('click', () => openModal(resumeModal));
  });

  papersBtn?.addEventListener('click', () => openModal(papersModal));

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
      [resumeModal, papersModal].forEach(closeModal);
    }
  });

  // Smooth slide-in reveals
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.revealDelay || '0ms';
            entry.target.style.transitionDelay = delay;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

      revealEls.forEach(el => observer.observe(el));
    } else {
      // Fallback: show immediately if observer not supported
      revealEls.forEach(el => el.classList.add('visible'));
    }
  }

  const consultForm = document.getElementById('consultContactForm');
  const consultStatus = document.getElementById('consultFormStatus');
  const consultSubmitBtn = document.getElementById('consultSubmitBtn');

  if (consultForm && consultSubmitBtn && consultStatus) {
    consultForm.addEventListener('submit', async event => {
      event.preventDefault();
      consultSubmitBtn.disabled = true;
      const originalText = consultSubmitBtn.textContent;
      consultSubmitBtn.textContent = 'Sending...';
      consultStatus.textContent = '';

      try {
        const formData = new FormData(consultForm);
        const response = await fetch(consultForm.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          consultSubmitBtn.textContent = 'Sent!';
          consultStatus.textContent = 'Thanks! I will reply within one business day.';
          consultForm.reset();
        } else {
          throw new Error('Formspree error');
        }
      } catch (error) {
        consultSubmitBtn.disabled = false;
        consultSubmitBtn.textContent = originalText;
        consultStatus.textContent = 'Something went wrong. Please email me directly.';
        console.error(error);
      }
    });
  }
});
