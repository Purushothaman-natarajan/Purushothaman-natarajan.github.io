document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // Active nav link
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      if (navMenu) navMenu.style.display = 'none';
    });
  });

  // Scroll animation
  window.addEventListener('scroll', () => {
    navLinks.forEach(link => {
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const rect = targetSection.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smoot

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
});
block: 'start' });
      }
    });
  });
});