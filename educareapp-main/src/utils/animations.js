
/**
 * Animation utilities for Educare+ website
 */

// Animate elements when they enter the viewport
export function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  // Check if browser supports IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const animation = el.getAttribute('data-aos');
          const delay = el.getAttribute('data-aos-delay') || 0;
          
          setTimeout(() => {
            if (animation === 'fade-up') {
              el.classList.add('animate-fade-in');
            } else if (animation === 'zoom-in') {
              el.classList.add('animate-scale-up');
            } else {
              el.classList.add('animate-fade-in');
            }
          }, delay);
          
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });
    
    animatedElements.forEach(element => {
      element.classList.add('opacity-0');
      observer.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach(element => {
      element.classList.add('animate-fade-in');
    });
  }
}

// Back to top button functionality
export function initBackToTop() {
  const backToTopButton = document.getElementById('back-to-top');
  
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
    
    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Initialize animations based on user preference
export function initAnimations() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) return;
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize back to top button
  initBackToTop();
}

// Add preloader animation
export function initPreloader() {
  const preloader = document.getElementById('preloader');
  
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });
  }
}

// Animate chart data visualization
export function animateChart(chart, duration = 1000) {
  if (!chart) return;
  
  const originalUpdate = chart.update;
  
  chart.update = function() {
    const previousData = chart.data.datasets.map(dataset => [...dataset.data]);
    
    originalUpdate.apply(this, arguments);
    
    const currentData = chart.data.datasets.map(dataset => [...dataset.data]);
    
    chart.data.datasets.forEach((dataset, i) => {
      dataset.data = previousData[i];
    });
    
    chart.update = originalUpdate;
    chart.update();
    
    chart.data.datasets.forEach((dataset, i) => {
      dataset.data = currentData[i];
    });
    
    chart.update({
      duration: duration,
      easing: 'easeOutQuart'
    });
  };
}
