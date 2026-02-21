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
      var mouse = { x: -1000, y: -1000 };
      var attractRadius = 180;
      var attractStrength = 0.08;
      var trailLength = 8;

      document.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });
      document.addEventListener('mouseleave', function() {
        mouse.x = -1000;
        mouse.y = -1000;
      });

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
            baseAlpha: Math.random() * 0.5 + 0.2,
            alpha: Math.random() * 0.5 + 0.2,
            trail: []
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
          // Mouse attraction
          var dx = mouse.x - p.x;
          var dy = mouse.y - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var drawRadius = p.radius;
          if (dist < attractRadius && dist > 1) {
            var proximity = 1 - dist / attractRadius;
            var force = proximity * attractStrength;
            p.vx += dx / dist * force;
            p.vy += dy / dist * force;
            p.alpha = Math.min(1, p.baseAlpha + proximity * 0.6);
            drawRadius = p.radius + proximity * 2;

            // Draw connection line to cursor
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = proximity * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          } else {
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.alpha += (p.baseAlpha - p.alpha) * 0.02;
          }

          // Clamp velocity
          var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > 3) {
            p.vx = (p.vx / speed) * 3;
            p.vy = (p.vy / speed) * 3;
          }

          p.x += p.vx;
          p.y += p.vy;

          // Store trail position
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > trailLength) p.trail.shift();

          // Draw trail
          for (var t = 0; t < p.trail.length - 1; t++) {
            var trailAlpha = (t / p.trail.length) * p.alpha * 0.4;
            var trailRadius = drawRadius * (t / p.trail.length) * 0.7;
            ctx.beginPath();
            ctx.arc(p.trail[t].x, p.trail[t].y, trailRadius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = trailAlpha;
            ctx.fill();
          }

          // Draw main particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;

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
  var spotifyContainers = document.querySelectorAll('.spotify-container[data-src]');
  if (spotifyContainers.length) {
    var spotifyObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var container = entry.target;
          var src = container.dataset.src;
          if (src) {
            var iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.width = '100%';
            iframe.height = '152';
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
            iframe.setAttribute('loading', 'lazy');
            container.appendChild(iframe);
          }
          spotifyObserver.unobserve(container);
        }
      });
    }, { rootMargin: '200px' });

    spotifyContainers.forEach(function(container) {
      spotifyObserver.observe(container);
    });
  }

  // === Hero Profile Hover ===
  var heroProfile = document.querySelector('.hero-profile');
  var engineerImg = document.querySelector('.hero-profile-engineer');
  var musicianImg = document.querySelector('.hero-profile-musician');
  var ctaButtons = document.querySelectorAll('.hero-cta [data-profile]');

  if (heroProfile && engineerImg && musicianImg) {
    ctaButtons.forEach(function(btn) {
      btn.addEventListener('mouseenter', function() {
        var profile = btn.dataset.profile;
        heroProfile.className = 'hero-profile ' + profile + '-hover';
        if (profile === 'musician') {
          engineerImg.classList.remove('active');
          musicianImg.classList.add('active');
        } else {
          musicianImg.classList.remove('active');
          engineerImg.classList.add('active');
        }
      });
      btn.addEventListener('mouseleave', function() {
        heroProfile.className = 'hero-profile';
        musicianImg.classList.remove('active');
        engineerImg.classList.add('active');
      });
    });
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
