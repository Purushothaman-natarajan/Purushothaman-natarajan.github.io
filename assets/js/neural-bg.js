// Neural Network Particle Background - Floating aligned particles with connections
(function() {
  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null };
  
  // Config - refined for subtle, professional look
  const particleCount = 60;
  const connectionDistance = 130;
  const mouseDistance = 150;
  
  // Colors adapt to theme - vibrant, playful, visible on each mode
  const getColors = () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return isLight 
      ? ['#0891b2', '#7c3aed', '#2563eb', '#0d9488', '#8b5cf6']  // Light mode: teal, purple, blue, emerald, violet - more visible
      : ['#00d4ff', '#a78bfa', '#f472b6', '#fbbf24', '#818cf8']; // Dark mode: cyan, lavender, pink, amber, indigo
  };
  
  // Reset particles when theme changes
  const resetParticles = () => {
    particles.forEach(p => {
      const colors = getColors();
      p.color = colors[Math.floor(Math.random() * colors.length)];
    });
  };
  
  // Listen for theme changes
  document.addEventListener('click', (e) => {
    if (e.target.closest('.theme-btn') || e.target.closest('.quick-btn')) {
      setTimeout(resetParticles, 50);
    }
  });
  
  class Particle {
    constructor() {
      const colors = getColors();
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1.5;
      this.baseAlpha = Math.random() * 0.5 + 0.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
      // Update color based on current theme
      const colors = getColors();
      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off edges with smooth behavior
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
      
      // Mouse interaction - gentle repulsion
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseDistance) {
          const force = (mouseDistance - dist) / mouseDistance;
          this.vx -= (dx / dist) * force * 0.02;
          this.vy -= (dy / dist) * force * 0.02;
        }
      }
      
      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;
      
      // Minimum velocity
      if (Math.abs(this.vx) < 0.2) this.vx += (Math.random() - 0.5) * 0.1;
      if (Math.abs(this.vy) < 0.2) this.vy += (Math.random() - 0.5) * 0.1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.baseAlpha;
      ctx.fill();
    }
  }
  
  function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  
  function drawConnections() {
    const colors = getColors();
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.15;
          const colorIndex = (i + j) % colors.length;
          
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = colors[colorIndex];
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }
  
  function animate() {
    // Clear canvas fully each frame - no trail/accumulation
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    // Draw connections
    drawConnections();
    
    // Keep animation fresh - keep clearing each frame
    requestAnimationFrame(animate);
  }
  
  // Handle reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!prefersReducedMotion.matches) {
    init();
    animate();
  }
  
  window.addEventListener('resize', resize);
  
  // Track mouse
  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
})();