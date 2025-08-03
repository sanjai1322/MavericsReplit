import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Fade in animation from bottom
export const fadeInUp = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(element, 
    {
      y: 100,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    }
  );
};

// Fade in animation from left
export const fadeInLeft = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(element,
    {
      x: -100,
      opacity: 0
    },
    {
      x: 0,
      opacity: 1,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    }
  );
};

// Fade in animation from right
export const fadeInRight = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(element,
    {
      x: 100,
      opacity: 0
    },
    {
      x: 0,
      opacity: 1,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    }
  );
};

// Scale in animation
export const scaleIn = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(element,
    {
      scale: 0.8,
      opacity: 0
    },
    {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      delay,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    }
  );
};

// Stagger animation for multiple elements
export const staggerFadeIn = (elements: NodeListOf<HTMLElement> | HTMLElement[], delay = 0.1) => {
  gsap.fromTo(elements,
    {
      y: 50,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: elements[0],
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    }
  );
};

// Parallax scrolling effect
export const parallaxScroll = (element: HTMLElement, speed = 0.5) => {
  gsap.to(element, {
    yPercent: -50 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
};

// Floating animation
export const floatingAnimation = (element: HTMLElement) => {
  gsap.to(element, {
    y: "-=20",
    duration: 2,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true
  });
};

// Neon glow pulse effect
export const neonPulse = (element: HTMLElement) => {
  gsap.to(element, {
    textShadow: "0 0 20px var(--neon-green), 0 0 30px var(--neon-green), 0 0 40px var(--neon-green)",
    duration: 2,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true
  });
};

// Card hover animation
export const cardHoverEffect = (element: HTMLElement) => {
  const tl = gsap.timeline({ paused: true });
  
  tl.to(element, {
    y: -10,
    scale: 1.05,
    boxShadow: "0 20px 40px rgba(0, 255, 150, 0.3)",
    duration: 0.3,
    ease: "power2.out"
  });

  element.addEventListener('mouseenter', () => tl.play());
  element.addEventListener('mouseleave', () => tl.reverse());
};

// Initialize scroll animations
export const initScrollAnimations = () => {
  // Refresh ScrollTrigger on page load
  ScrollTrigger.refresh();
  
  // Update ScrollTrigger on window resize
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
};

// Cleanup function
export const cleanupAnimations = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf("*");
};