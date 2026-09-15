document.addEventListener("DOMContentLoaded", (event) => {
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // 1. Initial Page Load Reveal (Staggered)
  // Animate the nav and the hero elements in sequence
  gsap.fromTo(".nav-pill.gs-reveal, .hero-title.gs-reveal, .hero-subtitle.gs-reveal, .hero-cta-group.gs-reveal, .hero-visual.gs-reveal", 
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

    // 3D Parallax on the Hero orbit nodes
    orbitNodes.forEach((node, i) => {
      const depth = (i + 1) * 0.05;
      gsap.to(node, {
        x: (mouseX - windowWidth / 2) * depth,
        y: (mouseY - windowHeight / 2) * depth,
        duration: 1,
        ease: "power2.out"
      });
    });
  });
});
