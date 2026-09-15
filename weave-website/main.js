document.addEventListener("DOMContentLoaded", (event) => {
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // 1. Initial Page Load Reveal (Staggered)
  // Animate the nav and the hero elements in sequence
  gsap.fromTo(".nav-pill.gs-reveal, .hero-title.gs-reveal, .hero-subtitle.gs-reveal, .hero-cta-group.gs-reveal, .hero-visual-responsive.gs-reveal", 
    { 
      y: 50, 
      opacity: 0 
    }, 
    { 
      y: 0, 
      opacity: 1, 
      duration: 1, 
      stagger: 0.2, 
      ease: "power3.out",
      delay: 0.1
    }
  );

  // 2. Scroll Trigger Reveal for Features
  // Animate the feature orbs as they enter the viewport
  const featureOrbs = gsap.utils.toArray('.feature-orb.gs-reveal');
  featureOrbs.forEach((orb, i) => {
    gsap.fromTo(orb, 
      { 
        y: 80, 
        opacity: 0 
      }, 
      { 
        scrollTrigger: {
          trigger: orb,
          start: "top 85%", // Trigger when top of element hits 85% of viewport
          toggleActions: "play none none reverse"
        },
        y: 0, 
        opacity: 1, 
        duration: 0.8,
        ease: "power3.out",
        delay: i * 0.15 // Stagger based on index
      }
    );
  });

  // Footer reveal
  gsap.fromTo(".footer-pill.gs-reveal",
    { y: 30, opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".footer-pill",
        start: "top 95%"
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }
  );

  // 3. Mouse Tracking / Parallax Effects
  const glow1 = document.querySelector('.glow-1');
  const glow2 = document.querySelector('.glow-2');
  const orbitNodes = document.querySelectorAll('.orbit-node');

  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Smoothly move the background glows towards the mouse cursor
    // glow1 follows closely, glow2 follows inversely or slowly
    gsap.to(glow1, {
      x: (mouseX - windowWidth / 2) * 0.2,
      y: (mouseY - windowHeight / 2) * 0.2,
      duration: 2,
      ease: "power2.out"
    });

    gsap.to(glow2, {
      x: (mouseX - windowWidth / 2) * -0.1,
      y: (mouseY - windowHeight / 2) * -0.1,
      duration: 3,
      ease: "power2.out"
    });

    // Note: Removed 3D Parallax on old orbit nodes since we replaced them with the AI workflow visual
  });

  // 3.5 Fully Animated Symmetrical Exploded Flowchart (Hero)
  const aiTl = gsap.timeline({ repeat: -1 });

  // 1. Inputs start separated on the left and suck into the Core
  aiTl.fromTo(".in-1", { x: -200, y: -100, autoAlpha: 0, scale: 0.5 }, { x: -100, y: -50, autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out" }, "converge");
  aiTl.fromTo(".in-2", { x: -250, y: 0, autoAlpha: 0, scale: 0.5 }, { x: -125, y: 0, autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out" }, "converge+=0.1");
  aiTl.fromTo(".in-3", { x: -200, y: 100, autoAlpha: 0, scale: 0.5 }, { x: -100, y: 50, autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out" }, "converge+=0.2");

  // Inputs get sucked into Core
  aiTl.to(".in-1", { x: 0, y: 0, autoAlpha: 0, scale: 0, duration: 0.5, ease: "back.in(1.5)" }, "suck");
  aiTl.to(".in-2", { x: 0, y: 0, autoAlpha: 0, scale: 0, duration: 0.5, ease: "back.in(1.5)" }, "suck");
  aiTl.to(".in-3", { x: 0, y: 0, autoAlpha: 0, scale: 0, duration: 0.5, ease: "back.in(1.5)" }, "suck");

  // 2. Core processes the data and "Done by Weave" pops slightly
  aiTl.to(".node-core", { scale: 1.2, boxShadow: "0 0 60px #8b5cf6", duration: 0.3, yoyo: true, repeat: 1 });
  aiTl.fromTo(".done-by-weave", { autoAlpha: 0.5, scale: 0.9 }, { autoAlpha: 1, scale: 1.1, color: "#a78bfa", duration: 0.3, yoyo: true, repeat: 1 }, "<");

  // 3. AI Outputs explode outwards from the Core
  aiTl.fromTo(".out-1", { x: 0, y: 0, autoAlpha: 0, scale: 0.5 }, { x: 200, y: -100, autoAlpha: 1, scale: 1, duration: 1, ease: "back.out(1.2)" }, "explode");
  aiTl.fromTo(".out-2", { x: 0, y: 0, autoAlpha: 0, scale: 0.5 }, { x: 250, y: 0, autoAlpha: 1, scale: 1, duration: 1, ease: "back.out(1.2)" }, "explode+=0.1");
  aiTl.fromTo(".out-3", { x: 0, y: 0, autoAlpha: 0, scale: 0.5 }, { x: 200, y: 100, autoAlpha: 1, scale: 1, duration: 1, ease: "back.out(1.2)" }, "explode+=0.2");

  // 4. They pause, then drift away and fade out
  aiTl.to(".out-1", { x: "+=50", autoAlpha: 0, duration: 0.8 }, "+=1.5");
  aiTl.to(".out-2", { x: "+=50", autoAlpha: 0, duration: 0.8 }, "<0.1");
  aiTl.to(".out-3", { x: "+=50", autoAlpha: 0, duration: 0.8 }, "<0.1");

  // 4. Reveal "How it Works" elements
  gsap.fromTo(".section-title.gs-reveal, .section-subtitle.gs-reveal", 
    { y: 50, autoAlpha: 0 },
    {
      scrollTrigger: {
        trigger: ".how-it-works",
        start: "top 80%",
      },
      y: 0,
      autoAlpha: 1,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    }
  );

  const timelineSteps = gsap.utils.toArray('.timeline-step.gs-reveal, .timeline-connector.gs-reveal');
  timelineSteps.forEach((el, i) => {
    gsap.fromTo(el,
      { y: 50, autoAlpha: 0, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.2)"
      }
    );
  });

  // 5. Interactive Particle Network Background
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
        ctx.fill();
      }
    }

    // Create particles based on screen size
    const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${1 - dist / 150})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

});
