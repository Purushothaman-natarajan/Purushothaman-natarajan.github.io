document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      navMenu?.classList.remove('show');
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
