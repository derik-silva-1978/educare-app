
/**
 * Smart PEI Core Functionality
 * Modernized utilities for the Smart PEI application
 */

// Theme management
export const initTheme = () => {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Initialize theme toggle if it exists
  const themeToggle = document.querySelector('#theme-toggle');
  if (themeToggle) {
    // Set initial state
    themeToggle.checked = savedTheme === 'dark';
    
    // Add change event
    themeToggle.addEventListener('change', function() {
      const newTheme = this.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
};

// UI Components initialization
export const initUIComponents = () => {
  initTooltips();
  initPopovers();
  initModals();
  initTabs();
  initAccordions();
  initDatepickers();
  initScrollToTop();
};

// Tooltips initialization
export const initTooltips = () => {
  const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
  
  tooltipTriggers.forEach(trigger => {
    const tooltipText = trigger.getAttribute('data-tooltip');
    const tooltipPosition = trigger.getAttribute('data-tooltip-position') || 'top';
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip-${tooltipPosition}`;
    tooltip.innerHTML = `<div class="tooltip-content">${tooltipText}</div>`;
    
    // Append to document
    document.body.appendChild(tooltip);
    
    // Show tooltip on hover/focus
    function showTooltip() {
      const rect = trigger.getBoundingClientRect();
      
      // Position the tooltip
      switch (tooltipPosition) {
        case 'top':
          tooltip.style.bottom = `${window.innerHeight - rect.top + 5}px`;
          tooltip.style.left = `${rect.left + rect.width/2}px`;
          tooltip.style.transform = 'translateX(-50%)';
          break;
        case 'bottom':
          tooltip.style.top = `${rect.bottom + 5}px`;
          tooltip.style.left = `${rect.left + rect.width/2}px`;
          tooltip.style.transform = 'translateX(-50%)';
          break;
        case 'left':
          tooltip.style.top = `${rect.top + rect.height/2}px`;
          tooltip.style.right = `${window.innerWidth - rect.left + 5}px`;
          tooltip.style.transform = 'translateY(-50%)';
          break;
        case 'right':
          tooltip.style.top = `${rect.top + rect.height/2}px`;
          tooltip.style.left = `${rect.right + 5}px`;
          tooltip.style.transform = 'translateY(-50%)';
          break;
      }
      
      tooltip.classList.add('show');
    }
    
    function hideTooltip() {
      tooltip.classList.remove('show');
    }
    
    // Add event listeners
    trigger.addEventListener('mouseenter', showTooltip);
    trigger.addEventListener('mouseleave', hideTooltip);
    trigger.addEventListener('focus', showTooltip);
    trigger.addEventListener('blur', hideTooltip);
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      document.body.removeChild(tooltip);
    });
  });
};

// Popovers initialization
export const initPopovers = () => {
  const popoverTriggers = document.querySelectorAll('[data-popover]');
  
  popoverTriggers.forEach(trigger => {
    const popoverId = trigger.getAttribute('data-popover');
    const popoverEl = document.getElementById(popoverId);
    
    if (!popoverEl) return;
    
    // Hide popover initially
    popoverEl.classList.add('popover');
    popoverEl.classList.add('hidden');
    
    // Show/hide popover on click
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isVisible = !popoverEl.classList.contains('hidden');
      
      // Hide all other popovers
      document.querySelectorAll('.popover').forEach(p => {
        if (p !== popoverEl) {
          p.classList.add('hidden');
        }
      });
      
      // Toggle current popover
      popoverEl.classList.toggle('hidden');
      
      // Position the popover
      if (!isVisible) {
        const rect = trigger.getBoundingClientRect();
        popoverEl.style.top = `${rect.bottom + 5}px`;
        popoverEl.style.left = `${rect.left}px`;
        
        // Add document event to close popover when clicking outside
        setTimeout(() => {
          document.addEventListener('click', closePopover);
        }, 0);
      }
      
      function closePopover(event) {
        if (!popoverEl.contains(event.target) && !trigger.contains(event.target)) {
          popoverEl.classList.add('hidden');
          document.removeEventListener('click', closePopover);
        }
      }
    });
  });
};

// Modal functionality
export const initModals = () => {
  // Modal open buttons
  const modalTriggers = document.querySelectorAll('[data-modal]');
  
  modalTriggers.forEach(trigger => {
    const modalId = trigger.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    
    if (!modal) return;
    
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modal);
    });
  });
  
  // Modal close buttons
  const closeButtons = document.querySelectorAll('.modal-close, .modal-cancel');
  
  closeButtons.forEach(button => {
    const modal = button.closest('.modal');
    
    if (!modal) return;
    
    button.addEventListener('click', () => {
      closeModal(modal);
    });
  });
  
  // Close modal when clicking on backdrop
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal') && e.target.classList.contains('show')) {
      const closeOnBackdrop = e.target.getAttribute('data-close-backdrop') !== 'false';
      
      if (closeOnBackdrop) {
        closeModal(e.target);
      }
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const visibleModal = document.querySelector('.modal.show');
      
      if (visibleModal) {
        const closeOnEscape = visibleModal.getAttribute('data-close-escape') !== 'false';
        
        if (closeOnEscape) {
          closeModal(visibleModal);
        }
      }
    }
  });
};

// Open modal function
export const openModal = (modal) => {
  // Hide all other modals
  document.querySelectorAll('.modal.show').forEach(m => {
    if (m !== modal) {
      m.classList.remove('show');
      m.setAttribute('aria-hidden', 'true');
    }
  });
  
  // Show modal
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  
  // Set focus to first focusable element
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
  
  // Disable scrolling on body
  document.body.classList.add('modal-open');
  
  // Store last focused element to restore later
  modal._lastFocusedElement = document.activeElement;
  
  // Trap focus inside modal
  modal._handleTab = function(e) {
    if (e.key === 'Tab') {
      const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  document.addEventListener('keydown', modal._handleTab);
};

// Close modal function
export const closeModal = (modal) => {
  // Hide modal
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  
  // Enable scrolling on body (only if no other modals are open)
  if (!document.querySelector('.modal.show')) {
    document.body.classList.remove('modal-open');
  }
  
  // Restore focus
  if (modal._lastFocusedElement) {
    modal._lastFocusedElement.focus();
  }
  
  // Remove tab trap
  document.removeEventListener('keydown', modal._handleTab);
};

// Tabs functionality
export const initTabs = () => {
  const tabContainers = document.querySelectorAll('.tabs-container');
  
  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('.tab-btn');
    const tabPanes = container.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Deactivate all tabs
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        
        // Hide all tab panes
        tabPanes.forEach(pane => {
          pane.classList.remove('active');
          pane.setAttribute('hidden', '');
        });
        
        // Activate selected tab
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        
        // Show selected tab pane
        const selectedPane = container.querySelector(`.tab-pane[data-tab="${tabId}"]`);
        if (selectedPane) {
          selectedPane.classList.add('active');
          selectedPane.removeAttribute('hidden');
        }
      });
      
      // Handle keyboard navigation
      tab.addEventListener('keydown', function(e) {
        const tabsArray = Array.from(tabs);
        const index = tabsArray.indexOf(this);
        
        // Left/Right arrow keys
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          
          let newIndex;
          if (e.key === 'ArrowLeft') {
            newIndex = index === 0 ? tabsArray.length - 1 : index - 1;
          } else {
            newIndex = index === tabsArray.length - 1 ? 0 : index + 1;
          }
          
          tabsArray[newIndex].focus();
          tabsArray[newIndex].click();
        }
      });
    });
    
    // Activate first tab if none is active
    if (!container.querySelector('.tab-btn.active')) {
      const firstTab = tabs[0];
      if (firstTab) {
        firstTab.click();
      }
    }
  });
};

// Accordions functionality
export const initAccordions = () => {
  const accordions = document.querySelectorAll('.accordion');
  
  accordions.forEach(accordion => {
    const headers = accordion.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
      header.addEventListener('click', function() {
        const panel = this.nextElementSibling;
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // If accordion is not multi-expandable, close other panels
        if (!accordion.hasAttribute('data-multi-expand')) {
          headers.forEach(h => {
            if (h !== this) {
              h.setAttribute('aria-expanded', 'false');
              h.nextElementSibling.style.maxHeight = null;
            }
          });
        }
        
        // Toggle current panel
        this.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
          panel.style.maxHeight = null;
        }
      });
    });
    
    // Expand default panels
    headers.forEach(header => {
      if (header.hasAttribute('data-expanded')) {
        header.setAttribute('aria-expanded', 'true');
        const panel = header.nextElementSibling;
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
};

// Datepickers initialization
export const initDatepickers = () => {
  // Simple datepicker for browsers that support it
  const datepickers = document.querySelectorAll('input[type="date"]');
  
  datepickers.forEach(input => {
    // Add min/max attributes based on data attributes
    if (input.hasAttribute('data-min-date')) {
      input.min = input.getAttribute('data-min-date');
    }
    
    if (input.hasAttribute('data-max-date')) {
      input.max = input.getAttribute('data-max-date');
    }
    
    // Set current date if required
    if (input.hasAttribute('data-today') && !input.value) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      input.value = `${year}-${month}-${day}`;
    }
  });
};

// Scroll to top functionality
export const initScrollToTop = () => {
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  
  if (!scrollToTopBtn) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('active');
    } else {
      scrollToTopBtn.classList.remove('active');
    }
  });
  
  // Scroll to top when clicked
  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};

// Notification system
export const initNotifications = () => {
  // Check for notification container
  let notificationContainer = document.querySelector('.notification-container');
  
  // Create if it doesn't exist
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Create global notification function
  window.showNotification = function(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    
    // Add icon based on type
    let icon = '';
    switch (type) {
      case 'success':
        icon = 'check-circle';
        break;
      case 'error':
        icon = 'exclamation-circle';
        break;
      case 'warning':
        icon = 'exclamation-triangle';
        break;
      default:
        icon = 'info-circle';
    }
    
    notification.innerHTML = `
      <div class="notification-icon">
        <i class="fas fa-${icon}"></i>
      </div>
      <div class="notification-content">
        ${message}
      </div>
      <button class="notification-close" aria-label="Fechar">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
      notification.classList.add('notification-closing');
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    
    // Auto-remove after delay
    if (duration > 0) {
      setTimeout(() => {
        if (notification.parentNode) {
          notification.classList.add('notification-closing');
          setTimeout(() => {
            if (notification.parentNode) {
              notification.remove();
            }
          }, 300);
        }
      }, duration);
    }
    
    return notification;
  };
  
  // Check for URL params to show notifications
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.has('success')) {
    window.showNotification(decodeURIComponent(urlParams.get('success')), 'success');
    
    // Clean URL
    const url = new URL(window.location);
    url.searchParams.delete('success');
    window.history.replaceState({}, '', url);
  }
  
  if (urlParams.has('error')) {
    window.showNotification(decodeURIComponent(urlParams.get('error')), 'error');
    
    // Clean URL
    const url = new URL(window.location);
    url.searchParams.delete('error');
    window.history.replaceState({}, '', url);
  }
};

// First use check
export const checkFirstUse = () => {
  // Check if this is the first time using the app
  const hasUsedBefore = localStorage.getItem('has_used_app');
  
  if (!hasUsedBefore && !window.location.pathname.includes('login.html')) {
    // Show welcome message
    const welcomeModal = document.querySelector('#welcome-modal');
    
    if (welcomeModal) {
      // Show modal with slight delay
      setTimeout(() => {
        openModal(welcomeModal);
      }, 800);
      
      // Mark as used
      localStorage.setItem('has_used_app', 'true');
    }
  }
};

// Helper function to get diagnosis text
export const getDiagnosisText = (diagnosisType) => {
  switch (diagnosisType) {
    case 'autism':
      return 'Transtorno do Espectro Autista (TEA)';
    case 'adhd':
      return 'Transtorno do Déficit de Atenção com Hiperatividade (TDAH)';
    case 'intellectual':
      return 'Deficiência Intelectual';
    case 'down':
      return 'Síndrome de Down';
    case 'other':
      return 'Outro';
    default:
      return diagnosisType;
  }
};

// Animation utilities
export const animateCounter = (element, start, target, duration) => {
  let startTime = null;
  const step = timestamp => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(progress * (target - start) + start);
    element.textContent = value;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = target;
    }
  };
  
  window.requestAnimationFrame(step);
};

// Main initialization function
export const initSmartPEI = () => {
  initTheme();
  initUIComponents();
  initNotifications();
  checkFirstUse();
  
  console.log("Smart PEI application initialized successfully");
  
  // Return API for programmatic access
  return {
    openModal,
    closeModal,
    showNotification: window.showNotification,
    animateCounter
  };
};
