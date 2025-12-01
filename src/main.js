
/**
 * Main JavaScript for Educare+ website
 */
import { initAccessibilitySettings, toggleContrast, increaseFontSize, decreaseFontSize } from './utils/accessibility.js';
import { initScrollAnimations, initBackToTop } from './utils/animations.js';
import { initMobileMenu, initSmoothScrolling } from './utils/navigation.js';
import { initSmartPEI } from './utils/smart-pei.js';

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize accessibility settings
  initAccessibilitySettings();
  
  // Initialize animations
  initScrollAnimations();
  initBackToTop();
  
  // Initialize navigation
  initMobileMenu();
  initSmoothScrolling();
  
  // Set up accessibility control event listeners
  const contrastToggleBtn = document.getElementById('contrast-toggle');
  const fontIncreaseBtn = document.getElementById('font-increase');
  const fontDecreaseBtn = document.getElementById('font-decrease');
  
  if (contrastToggleBtn) {
    contrastToggleBtn.addEventListener('click', toggleContrast);
  }
  
  if (fontIncreaseBtn) {
    fontIncreaseBtn.addEventListener('click', increaseFontSize);
  }
  
  if (fontDecreaseBtn) {
    fontDecreaseBtn.addEventListener('click', decreaseFontSize);
  }
  
  // Initialize Smart PEI functionality if on Smart PEI page
  if (window.location.pathname.includes('smart-pei')) {
    initSmartPEI();
  }
  
  // Form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Formulário enviado com sucesso! Em um ambiente de produção, este formulário enviaria os dados para um servidor.');
    });
  }
  
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Inscrição realizada com sucesso! Em um ambiente de produção, este formulário enviaria os dados para um servidor.');
    });
  }
});

// Expose functions to the global scope so they can be called from HTML
window.toggleContrast = toggleContrast;
window.increaseFontSize = increaseFontSize;
window.decreaseFontSize = decreaseFontSize;
