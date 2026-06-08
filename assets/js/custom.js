/* ============================================
   ATEF BOUTARA PORTFOLIO
   Custom Animations & Interactivity
   ============================================ */

(function () {
  'use strict';

  /* -----------------------------------------------
     1. SCROLL-REVEAL via Intersection Observer
     ----------------------------------------------- */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal, .reveal-scale');
    if (!reveals.length) return;

    // Fallback: if IntersectionObserver not supported, show everything
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* -----------------------------------------------
     2. PARTICLE CANVAS — Hero section
     ----------------------------------------------- */
  function initParticles() {
    var canvas = document.getElementById('intro-particles');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 60;
    var mouse = { x: null, y: null };
    var animationId;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.8 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() * 60 + 180  // cyan-to-violet range
      };
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    }

    function drawParticle(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + p.hue + ', 70%, 70%, ' + p.opacity + ')';
      ctx.fill();
    }

    function drawConnections() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            var opacity = (1 - dist / 120) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(167, 139, 250, ' + opacity + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function update() {
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;

        // Gentle mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          var dx = p.x - mouse.x;
          var dy = p.y - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            var force = (150 - dist) / 150 * 0.02;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Dampen velocity
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Wrap around edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      update();
      drawConnections();
      particles.forEach(drawParticle);
      animationId = requestAnimationFrame(animate);
    }

    // Mouse tracking within intro
    var intro = document.getElementById('intro');
    if (intro) {
      intro.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      intro.addEventListener('mouseleave', function () {
        mouse.x = null;
        mouse.y = null;
      });
    }

    // Pause when not visible
    var introObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        if (!animationId) animate();
      } else {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    }, { threshold: 0.05 });

    if (intro) introObserver.observe(intro);

    window.addEventListener('resize', function () {
      resize();
    });

    init();
    animate();
  }

  /* -----------------------------------------------
     3. PROJECT CARD NAVIGATION
     ----------------------------------------------- */
  function initProjectCards() {
    var cards = document.querySelectorAll('.project-card[data-project]');

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var projectId = card.getAttribute('data-project');
        if (projectId) {
          window.location.href = 'project.html?id=' + projectId;
        }
      });
    });
  }

  /* -----------------------------------------------
     4. INIT ON DOM READY
     ----------------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initScrollReveal();
      initParticles();
      initProjectCards();
    });
  } else {
    initScrollReveal();
    initParticles();
    initProjectCards();
  }

})();
