(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // === Canvas Animation ===
  if (!prefersReducedMotion) {
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let width, height;
      let particles = [];

      const colors = ['#00f0ff', '#ff00aa', '#8b5cf6', '#39ff14'];

      function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }

      function createParticles() {
        const count = Math.min(100, Math.max(60, Math.floor(width / 15)));
        particles = [];
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            alpha: Math.random() * 0.5 + 0.2
          });
        }
      }

      function drawWaves(time) {
        var waveConfigs = [
          { color: '0, 240, 255', amplitude: 30, frequency: 0.003, speed: 0.0008, yOffset: 0.6 },
          { color: '255, 0, 170', amplitude: 25, frequency: 0.004, speed: 0.001, yOffset: 0.65 },
          { color: '139, 92, 246', amplitude: 20, frequency: 0.005, speed: 0.0012, yOffset: 0.7 }
        ];

        waveConfigs.forEach(function(wave) {
          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 4) {
            const y = height * wave.yOffset +
                      Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
                      Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 1.3) * wave.amplitude * 0.5;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fillStyle = 'rgba(' + wave.color + ', 0.03)';
          ctx.fill();
        });
      }

      function drawParticles() {
        particles.forEach(function(p) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        });
      }

      let time = 0;
      function animate() {
        ctx.clearRect(0, 0, width, height);
        time++;
        drawWaves(time);
        drawParticles();
        requestAnimationFrame(animate);
      }

      let resizeTimeout;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          resize();
          createParticles();
        }, 200);
      });

      resize();
      createParticles();
      animate();
    }
  }

  // === Scroll Reveal ===
  var sections = document.querySelectorAll('.section');
  if (sections.length) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    sections.forEach(function(section) {
      revealObserver.observe(section);
    });
  }

  // === Spotify Lazy-Load ===
  var spotifyContainer = document.getElementById('spotify-embed');
  if (spotifyContainer) {
    var spotifyObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var src = spotifyContainer.dataset.src;
          if (src) {
            var iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.width = '100%';
            iframe.height = '352';
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
            iframe.setAttribute('loading', 'lazy');
            spotifyContainer.appendChild(iframe);
          }
          spotifyObserver.unobserve(spotifyContainer);
        }
      });
    }, { rootMargin: '200px' });

    spotifyObserver.observe(spotifyContainer);
  }

  // === Smooth Scroll ===
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
