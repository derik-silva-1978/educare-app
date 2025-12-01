
/**
 * Accessibility utilities for Educare+ website
 */

// Toggle high contrast mode
export function toggleContrast() {
  document.body.classList.toggle('high-contrast');
  localStorage.setItem('high-contrast', document.body.classList.contains('high-contrast'));
  
  // Apply high contrast specific styles
  if (document.body.classList.contains('high-contrast')) {
    document.documentElement.style.setProperty('--contrast-factor', '1.5');
    document.documentElement.style.setProperty('--border-contrast', '3px');
  } else {
    document.documentElement.style.setProperty('--contrast-factor', '1');
    document.documentElement.style.setProperty('--border-contrast', '1px');
  }
}

// Increase font size
export function increaseFontSize() {
  const currentSize = parseInt(localStorage.getItem('font-size') || '0');
  
  if (currentSize < 3) {
    const newSize = currentSize + 1;
    document.documentElement.style.fontSize = `${100 + newSize * 10}%`;
    localStorage.setItem('font-size', newSize.toString());
    
    // Ensure spacing scales proportionally
    adjustSpacing(newSize);
  }
}

// Decrease font size
export function decreaseFontSize() {
  const currentSize = parseInt(localStorage.getItem('font-size') || '0');
  
  if (currentSize > -2) {
    const newSize = currentSize - 1;
    document.documentElement.style.fontSize = `${100 + newSize * 10}%`;
    localStorage.setItem('font-size', newSize.toString());
    
    // Ensure spacing scales proportionally
    adjustSpacing(newSize);
  }
}

// Adjust spacing based on font size changes
function adjustSpacing(sizeLevel) {
  // Calculate spacing multiplier (values between 0.8 and 1.2)
  const spacingMultiplier = 1 + (sizeLevel * 0.1);
  document.documentElement.style.setProperty('--spacing-factor', spacingMultiplier.toString());
}

// Toggle dark mode
export function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  
  // Add or remove 'dark' class on the document element (for Tailwind dark mode)
  if (document.body.classList.contains('dark-mode')) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
}

// Update contrast toggle icon based on current theme
export function updateContrastIcon(theme) {
  const contrastToggle = document.getElementById('contrast-toggle');
  if (!contrastToggle) return;
  
  const icon = contrastToggle.querySelector('i');
  if (!icon) return;
  
  if (theme === 'high-contrast') {
    icon.className = 'fas fa-sun';
    contrastToggle.setAttribute('title', 'Mudar para modo escuro');
  } else if (theme === 'dark-mode') {
    icon.className = 'fas fa-moon';
    contrastToggle.setAttribute('title', 'Mudar para modo normal');
  } else {
    icon.className = 'fas fa-adjust';
    contrastToggle.setAttribute('title', 'Mudar para alto contraste');
  }
}

// Initialize accessibility settings from local storage
export function initAccessibilitySettings() {
  // Apply high contrast if saved
  if (localStorage.getItem('high-contrast') === 'true') {
    document.body.classList.add('high-contrast');
    document.documentElement.style.setProperty('--contrast-factor', '1.5');
    document.documentElement.style.setProperty('--border-contrast', '3px');
  } else {
    document.documentElement.style.setProperty('--contrast-factor', '1');
    document.documentElement.style.setProperty('--border-contrast', '1px');
  }
  
  // Apply dark mode if saved
  if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.add('dark');
  }
  
  // Apply font size if saved
  const savedFontSize = localStorage.getItem('font-size');
  if (savedFontSize) {
    const sizeLevel = parseInt(savedFontSize);
    document.documentElement.style.fontSize = `${100 + sizeLevel * 10}%`;
    
    // Adjust spacing based on font size
    adjustSpacing(sizeLevel);
  } else {
    document.documentElement.style.setProperty('--spacing-factor', '1');
  }
  
  // Set up additional accessibility features
  setupKeyboardNavigation();
  setupFocusIndicators();
  setupReducedMotion();
  setupScreenReaderAnnouncements();
}

// Set up keyboard navigation
function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Skip to content: Alt + 1
    if (e.altKey && e.key === '1') {
      e.preventDefault();
      const mainContent = document.querySelector('main') || document.querySelector('#content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
      }
    }
    
    // Toggle high contrast: Alt + C
    if (e.altKey && e.key === 'c') {
      e.preventDefault();
      toggleContrast();
      announceScreenReaderMessage(document.body.classList.contains('high-contrast') 
        ? 'Alto contraste ativado' 
        : 'Alto contraste desativado');
    }
    
    // Toggle dark mode: Alt + D
    if (e.altKey && e.key === 'd') {
      e.preventDefault();
      toggleDarkMode();
      announceScreenReaderMessage(document.body.classList.contains('dark-mode') 
        ? 'Modo escuro ativado' 
        : 'Modo claro ativado');
    }
    
    // Increase font size: Alt + Plus
    if (e.altKey && e.key === '+') {
      e.preventDefault();
      increaseFontSize();
      announceScreenReaderMessage('Tamanho da fonte aumentado');
    }
    
    // Decrease font size: Alt + Minus
    if (e.altKey && e.key === '-') {
      e.preventDefault();
      decreaseFontSize();
      announceScreenReaderMessage('Tamanho da fonte diminuído');
    }
  });
}

// Set up focus indicators
function setupFocusIndicators() {
  // Add a class to the body when the user is using keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  // Remove the class when the user clicks with the mouse
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
  
  // Add styles for keyboard focus indicators
  const style = document.createElement('style');
  style.textContent = `
    body.keyboard-navigation :focus {
      outline: 3px solid var(--primary) !important;
      outline-offset: 2px !important;
    }
  `;
  document.head.appendChild(style);
}

// Set up reduced motion
function setupReducedMotion() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduce-motion');
  }
  
  // Add styles for reduced motion
  const style = document.createElement('style');
  style.textContent = `
    .reduce-motion * {
      transition-duration: 0.1s !important;
      animation-duration: 0.1s !important;
    }
  `;
  document.head.appendChild(style);
}

// Set up screen reader announcements
function setupScreenReaderAnnouncements() {
  // Create or find the live region element
  let liveRegion = document.querySelector('.sr-announcer');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.className = 'sr-only sr-announcer';
    liveRegion.setAttribute('aria-live', 'polite');
    document.body.appendChild(liveRegion);
  }
}

// Announce screen reader message
export function announceScreenReaderMessage(message) {
  const liveRegion = document.querySelector('.sr-announcer') || document.createElement('div');
  liveRegion.className = 'sr-only sr-announcer';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.textContent = message;
  
  if (!document.body.contains(liveRegion)) {
    document.body.appendChild(liveRegion);
  }
  
  // Clear after a few seconds
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 3000);
}

// Add skip link for keyboard navigation
export function addSkipLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Pular para o conteúdo principal';
  
  skipLink.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const mainContent = document.querySelector('main') || document.querySelector('#content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
      }
    }
  });
  
  const style = document.createElement('style');
  style.textContent = `
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      padding: 8px 16px;
      background-color: var(--primary);
      color: white;
      z-index: 1000;
      transition: top 0.2s;
    }
    
    .skip-link:focus {
      top: 0;
    }
  `;
  
  document.head.appendChild(style);
  document.body.prepend(skipLink);
}
