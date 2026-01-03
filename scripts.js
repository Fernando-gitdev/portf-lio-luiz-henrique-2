// Ano dinâmico
document.getElementById('year').textContent = new Date().getFullYear();

// Lazy load videos
document.addEventListener('DOMContentLoaded', function() {
  const lazyVideos = document.querySelectorAll('video[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.play().catch(() => {});
          videoObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '50px' });

    lazyVideos.forEach(video => videoObserver.observe(video));
  }
});

// ===== Tilt/parallax leve =====
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - .5; // -0.5 .. 0.5
    const py = (e.clientY - r.top)/r.height - .5;
    card.style.transform = `perspective(900px) rotateY(${px*8}deg) rotateX(${-py*8}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', () => { 
    card.style.transform = ''; 
  });
});

// ===== Partículas (canvas) =====
function initParticles() {
  const cvs = document.getElementById('particles');
  if (!cvs) return;
  
  const ctx = cvs.getContext('2d');
  let W,H,particles = [];
  const N = 60; // quantidade

  function resize(){ 
    W = cvs.width = cvs.offsetWidth; 
    H = cvs.height = 260; 
  }
  
  window.addEventListener('resize', resize); 
  resize();

  function spawn(){
    particles = Array.from({length:N}, ()=>({
      x: Math.random()*W,
      y: Math.random()*H,
      vx:(Math.random()-.5)*.4,
      vy:(Math.random()-.5)*.4,
      r: Math.random()*1.6+0.6
    }));
  } 
  
  spawn();

  function step(){
    ctx.clearRect(0,0,W,H);
    for(const p of particles){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1; 
      if(p.y<0||p.y>H) p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = 'rgba(122,241,255,.8)';
      ctx.shadowColor = 'rgba(91,140,255,.65)';
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    // linhas entre próximas
    for(let i=0;i<N;i++){
      for(let j=i+1;j<N;j++){
        const a = particles[i], b = particles[j];
        const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
        if(d<110){
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); 
          ctx.lineTo(b.x,b.y);
          ctx.strokeStyle = `rgba(91,140,255, ${1- d/110})`;
          ctx.lineWidth = .6; 
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  } 
  
  step();
}

// Initialize particles on load
document.addEventListener('DOMContentLoaded', initParticles);

// Handle videos independently
document.querySelectorAll('video').forEach(video => {
  video.addEventListener('play', function() {
    // Pause all other videos when this one plays
    document.querySelectorAll('video').forEach(otherVideo => {
      if (otherVideo !== video && !otherVideo.paused) {
        otherVideo.pause();
      }
    });
  });
});

// Mobile menu toggle
(function(){
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  if(!toggle || !menu) return;
  
  toggle.addEventListener('click', (e)=>{
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  
  // close when clicking outside
  document.addEventListener('click', (e)=>{
    if(!menu.contains(e.target) && !toggle.contains(e.target)){
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Form submission handler
(function() {
  const form = document.getElementById('contact-form');
  const msgEl = document.getElementById('contact-msg');

  function showMessage(text, isError = false) {
    if (!msgEl) return;
    msgEl.style.display = 'block';
    msgEl.style.color = isError ? '#ff6b6b' : 'var(--accent-2)';
    msgEl.textContent = text;
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      if (!data.nome || !data.email || !data.mensagem) {
        showMessage('Por favor, preencha todos os campos.', true);
        return;
      }

      showMessage('Enviando mensagem...');

      try {
        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          showMessage('Por favor, insira um email válido.', true);
          return;
        }

        // Here you can integrate with your preferred backend
        // For now, we'll simulate a successful submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        form.reset();
      } catch (error) {
        console.error('Erro ao enviar:', error);
        showMessage('Erro ao enviar mensagem. Por favor, tente novamente.', true);
      }
    });
  }
})();