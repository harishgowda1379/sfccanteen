// Modern Canteen App - Enhanced JavaScript Functionality

class ModernCanteenApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.setupFormEnhancements();
    this.setupAnimations();
    this.setupNotifications();
    this.initializeComponents();
  }

  // Theme System
  setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    this.updateThemeIcon(currentTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        // Add transition animation
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
          document.body.style.transition = '';
        }, 300);
      });
    }
  }

  updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    }
  }

  // Form Enhancements
  setupFormEnhancements() {
    // Real-time form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        this.handleFormSubmit(e, form);
      });

      // Add input validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearValidation(input));
      });
    });

    // Auto-calculate total amount
    this.setupAutoCalculation();
  }

  setupAutoCalculation() {
    const costPerUnit = document.getElementById('costPerUnit');
    const numberOfPersons = document.getElementById('numberOfPersons');
    const estimatedAmount = document.getElementById('estimatedAmount');

    if (costPerUnit && numberOfPersons && estimatedAmount) {
      const calculate = () => {
        const cost = parseFloat(costPerUnit.value) || 0;
        const persons = parseInt(numberOfPersons.value) || 0;
        const total = cost * persons;
        
        if (total > 0) {
          estimatedAmount.value = total;
          estimatedAmount.classList.add('is-valid');
        }
      };

      costPerUnit.addEventListener('input', calculate);
      numberOfPersons.addEventListener('input', calculate);
    }
  }

  validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    field.classList.remove('is-valid', 'is-invalid');
    
    if (isRequired && !value) {
      field.classList.add('is-invalid');
      return false;
    } else if (value) {
      field.classList.add('is-valid');
      return true;
    }
    
    return true;
  }

  clearValidation(field) {
    field.classList.remove('is-valid', 'is-invalid');
  }

  handleFormSubmit(e, form) {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showNotification('Please fill in all required fields', 'error');
      return;
    }

    // Add loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      
      setTimeout(() => {
        form.submit();
      }, 500);
    }
  }

  // Animation System
  setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe cards and forms
    document.querySelectorAll('.glass-card, .form-modern').forEach(el => {
      observer.observe(el);
    });

    // Staggered animations for login cards
    const loginCards = document.querySelectorAll('.login-card');
    loginCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-scaleIn');
    });
  }

  // Enhanced Notification System
  showNotification(message, type = 'info', duration = 7000) {
    // Remove any existing notifications of the same type
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `alert-modern alert-${type}-modern notification-toast`;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 9999;
      min-width: 350px;
      max-width: 500px;
      transform: translateX(100%);
      opacity: 0;
    `;
    
    notification.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="fas fa-${this.getIconForType(type)} me-3" style="font-size: 1.3rem;"></i>
        <div class="flex-grow-1">
          <div class="fw-bold">${this.getTitleForType(type)}</div>
          <div>${message}</div>
        </div>
        <button type="button" class="btn-close ms-3" onclick="this.parentElement.parentElement.remove()" 
                style="background: rgba(255,255,255,0.3); border-radius: 50%; width: 30px; height: 30px;"></button>
      </div>
    `;

    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
      notification.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }, 100);
    
    // Add pulse effect for important notifications
    if (type === 'success' || type === 'error') {
      notification.classList.add('pulse');
    }
    
    // Auto-remove
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
      }
    }, duration);
    
    // Add sound effect (optional)
    this.playNotificationSound(type);
  }
  
  getTitleForType(type) {
    const titles = {
      'success': 'Success!',
      'error': 'Error!',
      'warning': 'Warning!',
      'info': 'Information'
    };
    return titles[type] || 'Notification';
  }
  
  playNotificationSound(type) {
    // Create subtle audio feedback (optional)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      const frequencies = {
        'success': 800,
        'error': 400,
        'warning': 600,
        'info': 500
      };
      
      oscillator.frequency.setValueAtTime(frequencies[type] || 500, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Audio not supported or blocked, skip silently
    }
  }

  getIconForType(type) {
    const icons = {
      'success': 'check-circle',
      'error': 'exclamation-triangle',
      'warning': 'exclamation-triangle',
      'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
  }

  setupNotifications() {
    // Handle existing flash messages
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
      alert.classList.add('animate-slideIn');
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        if (alert.parentNode) {
          alert.style.animation = 'slideOut 0.5s ease';
          setTimeout(() => alert.remove(), 500);
        }
      }, 5000);
    });
  }

  // Component Initialization
  initializeComponents() {
    // Initialize tooltips
    this.initTooltips();
    
    // Add loading states to navigation links
    this.setupNavigationLoading();
    
    // Setup smooth scrolling
    this.setupSmoothScrolling();
    
    // Add page transition effects
    document.body.classList.add('page-transition');
  }

  initTooltips() {
    // Add tooltips to buttons and icons
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    elementsWithTooltips.forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target, e.target.dataset.tooltip);
      });
      
      el.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'modern-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.8rem;
      z-index: 1000;
      pointer-events: none;
      white-space: nowrap;
      animation: fadeIn 0.2s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    
    this.currentTooltip = tooltip;
  }

  hideTooltip() {
    if (this.currentTooltip) {
      this.currentTooltip.remove();
      this.currentTooltip = null;
    }
  }

  setupNavigationLoading() {
    const navLinks = document.querySelectorAll('a:not([href^="#"])');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.hostname === window.location.hostname) {
          link.classList.add('loading');
        }
      });
    });
  }

  setupSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Utility Methods
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  // Progress Steps for Multi-step Forms
  updateProgressStep(currentStep, totalSteps) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      step.classList.remove('active', 'completed');
      if (index < currentStep) {
        step.classList.add('completed');
      } else if (index === currentStep) {
        step.classList.add('active');
      }
    });
  }
}

// Animation Utilities
const animationUtils = {
  fadeIn: (element, duration = 300) => {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = (timestamp - start) / duration;
      
      element.style.opacity = Math.min(progress, 1);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  },
  
  slideIn: (element, direction = 'left', duration = 400) => {
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)'
    };
    
    element.style.transform = transforms[direction];
    element.style.transition = `transform ${duration}ms ease`;
    element.style.display = 'block';
    
    setTimeout(() => {
      element.style.transform = 'translate(0, 0)';
    }, 10);
  }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.modernApp = new ModernCanteenApp();
  
  // Add global click effect
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-modern') || e.target.closest('.btn-modern')) {
      const ripple = document.createElement('span');
      const rect = e.target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
      `;
      
      e.target.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
  });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// Page transition effect
window.addEventListener('beforeunload', () => {
  document.body.style.opacity = '0';
  document.body.style.transform = 'translateY(-20px)';
});

// Form validation patterns
const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  name: /^[a-zA-Z\s]{2,50}$/,
  department: /^[a-zA-Z\s\-\_]{2,100}$/
};

// Enhanced form validation
function validateInput(input, pattern) {
  const value = input.value.trim();
  
  if (input.hasAttribute('required') && !value) {
    return { valid: false, message: 'This field is required' };
  }
  
  if (value && pattern && !pattern.test(value)) {
    return { valid: false, message: 'Please enter a valid format' };
  }
  
  return { valid: true, message: '' };
}

// Smooth page transitions
function navigateWithTransition(url) {
  document.body.style.opacity = '0';
  document.body.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    window.location.href = url;
  }, 200);
}

// Export for global access
window.modernCanteenApp = {
  showNotification: (message, type) => window.modernApp?.showNotification(message, type),
  validateInput,
  navigateWithTransition,
  animationUtils
};
