// ===== TEXCELERATORS ROBOTICS CLUB WEBSITE =====
// Enhanced JavaScript with all functionality from both files merged

document.addEventListener('DOMContentLoaded', function() {
  // ===== INITIALIZATION =====
  initializeNavigation();
  initializeHeroSlideshow();
  initializeAchievements();
  initializeBotCarousel();
  initializeAnimations();
  initializeFormHandling();
});

// ===== NAVIGATION SYSTEM =====
function initializeNavigation() {
  // DOM Elements
  const header = document.getElementById('main-header');
  const sidebar = document.getElementById('sidebar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const mainContent = document.getElementById('main-content');
  const body = document.body;
  
  // Navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sections = document.querySelectorAll('section[id]');
  
  // State variables
  let isMenuOpen = false;
  let isSidebarMode = false;
  let lastScrollTop = 0;
  
  // Setup event listeners
  setupNavigationEvents();
  updateActiveSection();
  
  function setupNavigationEvents() {
    // Hamburger menu toggle
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', toggleMenu);
    }
    
    // Navigation link clicks
    navLinks.forEach(link => {
      link.addEventListener('click', handleNavClick);
    });
    
    sidebarLinks.forEach(link => {
      link.addEventListener('click', handleNavClick);
    });
    
    // Scroll events for sidebar activation and section highlighting
    window.addEventListener('scroll', throttle(handleScroll, 16)); // 60fps throttling
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (isMenuOpen && header && !header.contains(e.target)) {
        closeMenu();
      }
    });
  }
  
  // ===== MENU FUNCTIONALITY =====
  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }
  
  function openMenu() {
    isMenuOpen = true;
    if (hamburgerBtn) hamburgerBtn.classList.add('active');
    if (navMenu) navMenu.classList.add('active');
    
    // Animate menu items with stagger effect
    const menuItems = navMenu ? navMenu.querySelectorAll('.nav-link') : [];
    menuItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.transform = 'translateY(0)';
        item.style.opacity = '1';
      }, index * 50);
    });
  }
  
  function closeMenu() {
    isMenuOpen = false;
    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    
    // Reset menu items
    const menuItems = navMenu ? navMenu.querySelectorAll('.nav-link') : [];
    menuItems.forEach(item => {
      item.style.transform = 'translateY(-20px)';
      item.style.opacity = '0';
    });
  }
  
  // ===== NAVIGATION CLICK HANDLER =====
  function handleNavClick(e) {
    const href = e.currentTarget.getAttribute('href');
    
    // Check if it's an external link (contains .html)
    if (href.includes('.html')) {
      // Let the browser handle the navigation normally
      closeMenu();
      return;
    }
    
    // Handle internal section navigation
    e.preventDefault();
    const targetId = href.substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - (isSidebarMode ? 0 : 120);
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      closeMenu();
    }
  }
  
  // ===== SCROLL HANDLER =====
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Sidebar activation logic (desktop only)
    if (window.innerWidth > 768) {
      const achievementsSection = document.getElementById('achievements');
      
      if (achievementsSection) {
        const achievementsTop = achievementsSection.offsetTop - 200;
        const shouldShowSidebar = scrollTop >= achievementsTop;
        
        if (shouldShowSidebar && !isSidebarMode) {
          activateSidebarMode();
        } else if (!shouldShowSidebar && isSidebarMode) {
          deactivateSidebarMode();
        }
      }
    }
    
    // Update active section highlighting
    updateActiveSection();
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }
  
  // ===== SIDEBAR FUNCTIONALITY =====
  function activateSidebarMode() {
    // Only activate on desktop
    if (window.innerWidth <= 768) return;
    
    isSidebarMode = true;
    body.classList.add('sidebar-active');
    if (sidebar) sidebar.classList.add('active');
    closeMenu();
    
    // Smooth entrance animation
    setTimeout(() => {
      if (sidebar) sidebar.style.transform = 'translateX(0)';
    }, 100);
  }
  
  function deactivateSidebarMode() {
    isSidebarMode = false;
    body.classList.remove('sidebar-active');
    if (sidebar) sidebar.classList.remove('active');
  }
  
  function handleResize() {
    // Disable sidebar on mobile
    if (window.innerWidth <= 768 && isSidebarMode) {
      deactivateSidebarMode();
    }
    updateActiveSection();
  }
  
  // ===== ACTIVE SECTION HIGHLIGHTING =====
  function updateActiveSection() {
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Update navbar links
        navLinks.forEach(link => {
          link.classList.remove('active', 'scroll-spy-active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active', 'scroll-spy-active');
          }
        });
        
        // Update sidebar links
        sidebarLinks.forEach(link => {
          link.classList.remove('active', 'scroll-spy-active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active', 'scroll-spy-active');
          }
        });
      }
    });
  }
  
  // ===== NOTIFICATION SYSTEM =====
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'var(--secondary)' : 'var(--primary)'};
      color: white;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-family: 'Outfit', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
  
  // Export navigation functions for external use
  window.NavSystem = {
    toggleMenu,
    openMenu,
    closeMenu,
    activateSidebarMode,
    deactivateSidebarMode,
    updateActiveSection,
    showNotification
  };
}

// ===== HERO SLIDESHOW =====
function initializeHeroSlideshow() {
  const heroSlides = document.querySelectorAll('.slide');
  const slideDots = document.querySelectorAll('.slide-dot');
  const prevSlideBtn = document.querySelector('.slide-arrow.prev');
  const nextSlideBtn = document.querySelector('.slide-arrow.next');
  
  if (heroSlides.length === 0) return;
  
  let currentSlide = 0;
  let slideInterval;
  
  function showSlide(index) {
    // Remove active class from all slides and dots
    heroSlides.forEach(slide => slide.classList.remove('active'));
    slideDots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    heroSlides[index].classList.add('active');
    if (slideDots[index]) slideDots[index].classList.add('active');
    currentSlide = index;
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % heroSlides.length;
    showSlide(currentSlide);
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    showSlide(currentSlide);
  }
  
  function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000);
  }
  
  function stopSlideshow() {
    clearInterval(slideInterval);
  }
  
  // Setup dot navigation
  slideDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopSlideshow();
      showSlide(index);
      startSlideshow();
    });
  });
  
  // Setup arrow navigation
  if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
      stopSlideshow();
      prevSlide();
      startSlideshow();
    });
  }
  
  if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
      stopSlideshow();
      nextSlide();
      startSlideshow();
    });
  }
  
  // Initialize slideshow
  showSlide(0);
  startSlideshow();
  
  // Pause slideshow on hover
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopSlideshow);
    heroSection.addEventListener('mouseleave', startSlideshow);
  }
}

// ===== ACHIEVEMENTS SECTION =====
function initializeAchievements() {
  const counters = document.querySelectorAll('.achievement-count');
  const animationDuration = 2000;
  let hasAnimated = false;
  
  function animateCounter(counter, targetValue) {
    let startTime;
    
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / animationDuration, 1);
      const currentCount = Math.floor(progress * targetValue);
      
      counter.textContent = currentCount;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        counter.textContent = targetValue;
      }
    }
    
    window.requestAnimationFrame(step);
  }
  
  function checkCountersInView() {
    if (hasAnimated) return;
    
    const achievementsSection = document.getElementById('achievements');
    if (!achievementsSection) return;
    
    const rect = achievementsSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInView) {
      hasAnimated = true;
      counters.forEach(counter => {
        const targetValue = parseInt(counter.getAttribute('data-count')) || 0;
        animateCounter(counter, targetValue);
        counter.classList.add('animated');
      });
    }
  }
  
  // Check on scroll
  window.addEventListener('scroll', throttle(checkCountersInView, 16));
  checkCountersInView(); // Initial check
}

// ===== ENHANCED BOT CAROUSEL =====
function initializeBotCarousel() {
  const botsSlider = document.querySelector('.bots-slider');
  const botSlides = document.querySelectorAll('.bot-slide');
  const botDots = document.querySelectorAll('.bot-dot');
  const prevBotBtn = document.querySelector('.bot-arrow.prev');
  const nextBotBtn = document.querySelector('.bot-arrow.next');
  const autoplayToggle = document.getElementById('bot-autoplay-toggle');
  const fullscreenToggle = document.getElementById('bot-fullscreen-toggle');
  const botCarouselContainer = document.querySelector('.bot-carousel-container');
  
  if (!botsSlider || botSlides.length === 0) return;
  
  let currentBotSlide = 0;
  let slidesToShow = 3;
  let autoplayInterval;
  let isAutoplayActive = true;
  let isAnimating = false;
  let isFullscreen = false;
  let touchStartX = 0;
  let touchStartY = 0;
  
  function updateSlidesToShow() {
    if (window.innerWidth < 768) {
      slidesToShow = 1;
    } else if (window.innerWidth < 1024) {
      slidesToShow = 2;
    } else {
      slidesToShow = 3;
    }
    updateBotSlider();
  }
  
  function updateBotSlider() {
    if (!botsSlider) return;
    
    const maxSlideIndex = Math.max(0, botSlides.length - slidesToShow);
    currentBotSlide = Math.min(currentBotSlide, maxSlideIndex);
    
    const slideWidth = 100 / slidesToShow;
    botsSlider.style.transform = `translateX(-${currentBotSlide * slideWidth}%)`;
    
    // Update slide widths
    botSlides.forEach(slide => {
      slide.style.minWidth = `${slideWidth}%`;
      slide.style.flex = `0 0 ${slideWidth}%`;
    });
    
    updateActiveBotSlide();
    
    // Update buttons visibility
    if (prevBotBtn) {
      prevBotBtn.style.opacity = currentBotSlide > 0 ? '1' : '0.5';
    }
    
    if (nextBotBtn) {
      nextBotBtn.style.opacity = currentBotSlide < maxSlideIndex ? '1' : '0.5';
    }
  }
  
  function updateActiveBotSlide() {
    // Update dots if they exist
    botDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentBotSlide);
    });
    
    // Update active slide class
    botSlides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentBotSlide);
    });
  }
  
  function nextBotSlide() {
    if (isAnimating) return;
    isAnimating = true;
    
    const maxSlideIndex = Math.max(0, botSlides.length - slidesToShow);
    currentBotSlide = Math.min(currentBotSlide + 1, maxSlideIndex);
    
    updateBotSlider();
    
    // Reset animation lock after transition
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }
  
  function prevBotSlide() {
    if (isAnimating) return;
    isAnimating = true;
    
    currentBotSlide = Math.max(currentBotSlide - 1, 0);
    
    updateBotSlider();
    
    // Reset animation lock after transition
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }
  
  function goToBotSlide(index) {
    if (isAnimating || index === currentBotSlide) return;
    isAnimating = true;
    
    currentBotSlide = index;
    updateBotSlider();
    
    // Reset animation lock after transition
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }
  
  function startAutoplay() {
    stopAutoplay(); // Clear any existing interval
    
    if (isAutoplayActive) {
      autoplayInterval = setInterval(() => {
        const maxSlideIndex = Math.max(0, botSlides.length - slidesToShow);
        
        if (currentBotSlide < maxSlideIndex) {
          nextBotSlide();
        } else {
          // Reset to first slide when reaching the end
          currentBotSlide = 0;
          updateBotSlider();
        }
      }, 5000); // 5 seconds interval
    }
  }
  
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }
  
  function toggleAutoplay() {
    isAutoplayActive = !isAutoplayActive;
    
    if (autoplayToggle) {
      autoplayToggle.innerHTML = isAutoplayActive
        ? '<i class="fas fa-pause"></i>'
        : '<i class="fas fa-play"></i>';
    }
    
    if (isAutoplayActive) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  }
  
  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    
    if (fullscreenToggle) {
      fullscreenToggle.innerHTML = isFullscreen
        ? '<i class="fas fa-compress"></i>'
        : '<i class="fas fa-expand"></i>';
    }
    
    if (botCarouselContainer) {
      if (isFullscreen) {
        botCarouselContainer.classList.add('fullscreen');
        document.body.style.overflow = 'hidden';
      } else {
        botCarouselContainer.classList.remove('fullscreen');
        document.body.style.overflow = '';
      }
    }
  }
  
  // Setup event listeners
  function setupCarouselEvents() {
    // Window resize
    window.addEventListener('resize', debounce(updateSlidesToShow, 250));
    
    // Previous and next buttons
    if (prevBotBtn) {
      prevBotBtn.addEventListener('click', () => {
        prevBotSlide();
        if (isAutoplayActive) {
          startAutoplay(); // Reset the timer
        }
      });
    }
    
    if (nextBotBtn) {
      nextBotBtn.addEventListener('click', () => {
        nextBotSlide();
        if (isAutoplayActive) {
          startAutoplay(); // Reset the timer
        }
      });
    }
    
    // Navigation dots
    botDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToBotSlide(index);
        if (isAutoplayActive) {
          startAutoplay(); // Reset the timer
        }
      });
    });
    
    // Control buttons
    if (autoplayToggle) {
      autoplayToggle.addEventListener('click', toggleAutoplay);
    }
    
    if (fullscreenToggle) {
      fullscreenToggle.addEventListener('click', toggleFullscreen);
    }
    
    // Touch events for swipe on mobile
    if (botCarouselContainer) {
      botCarouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        stopAutoplay();
      }, { passive: true });
      
      botCarouselContainer.addEventListener('touchmove', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Only prevent default if horizontal scroll is greater than vertical
        if (Math.abs(diffX) > Math.abs(diffY)) {
          e.preventDefault();
        }
      }, { passive: false });
      
      botCarouselContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchEndX - touchStartX;
        const threshold = 50; // Minimum distance to be considered a swipe
        
        if (diffX > threshold) {
          prevBotSlide(); // Swipe right = previous slide
        } else if (diffX < -threshold) {
          nextBotSlide(); // Swipe left = next slide
        }
        
        // Resume autoplay if it was active
        if (isAutoplayActive) {
          startAutoplay();
        }
      }, { passive: true });
      
      // Pause autoplay on hover
      botCarouselContainer.addEventListener('mouseenter', () => {
        stopAutoplay();
      });
      
      botCarouselContainer.addEventListener('mouseleave', () => {
        if (isAutoplayActive) {
          startAutoplay();
        }
      });
    }
  }
  
  // Initialize carousel
  setupCarouselEvents();
  updateSlidesToShow();
  startAutoplay();
}

// ===== ANIMATION SYSTEM =====
function initializeAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  function checkInView() {
    const windowHeight = window.innerHeight;
    const windowTop = window.scrollY;
    const windowBottom = windowTop + windowHeight;
    
    animatedElements.forEach(element => {
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const elementBottom = elementTop + elementHeight;
      
      // Check if element is in view
      if (elementBottom > windowTop && elementTop < windowBottom) {
        element.classList.add('visible');
      }
    });
  }
  
  window.addEventListener('scroll', throttle(checkInView, 16));
  window.addEventListener('resize', debounce(checkInView, 250));
  checkInView(); // Initial check
}

// ===== FORM HANDLING =====
function initializeFormHandling() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show success notification
      if (window.NavSystem) {
        window.NavSystem.showNotification('Thank you for your message! We will get back to you soon.', 'success');
      }
      
      // Reset form
      contactForm.reset();
    });
  }
}

// ===== UTILITY FUNCTIONS =====
// Debounce function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// ===== GLOBAL ERROR HANDLER =====
window.addEventListener('error', function(e) {
  console.error('JavaScript Error:', e.error);
  // Could show user-friendly notification here
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
  window.addEventListener('load', function() {
    setTimeout(function() {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }, 0);
  });
}

// ===== ADDITIONAL FEATURES FROM WORKING FILE =====
// Export enhanced navigation system for global access
window.NavbarSidebar = {
  init: () => initializeNavigation(),
  toggleMenu: () => window.NavSystem?.toggleMenu(),
  openMenu: () => window.NavSystem?.openMenu(),
  closeMenu: () => window.NavSystem?.closeMenu(),
  activateSidebarMode: () => window.NavSystem?.activateSidebarMode(),
  deactivateSidebarMode: () => window.NavSystem?.deactivateSidebarMode(),
  updateActiveSection: () => window.NavSystem?.updateActiveSection(),
  showNotification: (msg, type) => window.NavSystem?.showNotification(msg, type)
};

// ===== TIMELINE FUNCTIONALITY =====
function initializeTimeline() {
  // Initialize timeline scroll animations
  initializeTimelineAnimations();
  
  // Add enhanced timeline interactions
  addTimelineInteractions();
}

function initializeTimelineAnimations() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  // Create intersection observer for timeline items
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add staggered animation delay based on item index
        const index = Array.from(timelineItems).indexOf(entry.target);
        const delay = index * 200; // 200ms delay between each item
        
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        
        // Only animate once
        timelineObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2, // Trigger when 20% of item is visible
    rootMargin: '0px 0px -50px 0px' // Start animation slightly before item is fully visible
  });
  
  // Observe all timeline items
  timelineItems.forEach(item => {
    timelineObserver.observe(item);
  });
}

function addTimelineInteractions() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  timelineItems.forEach(item => {
    // Add click functionality for mobile
    item.addEventListener('click', function() {
      // Smooth scroll to center the clicked item
      this.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      
      // Add temporary highlight effect
      this.style.transform = 'scale(1.02)';
      setTimeout(() => {
        this.style.transform = '';
      }, 300);
    });
    
    // Add keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
    
    // Enhanced hover effects for desktop
    if (window.innerWidth > 768) {
      item.addEventListener('mouseenter', function() {
        // Highlight connected timeline line section
        const indicator = this.querySelector('::after');
        this.style.zIndex = '10';
      });
      
      item.addEventListener('mouseleave', function() {
        this.style.zIndex = '';
      });
    }
  });
}

// Timeline navigation function (optional enhancement)
function navigateTimeline(direction) {
  const timelineItems = document.querySelectorAll('.timeline-item.visible');
  const currentScroll = window.pageYOffset;
  let targetItem = null;
  
  if (direction === 'next') {
    // Find next item below current scroll position
    for (let item of timelineItems) {
      if (item.offsetTop > currentScroll + 100) {
        targetItem = item;
        break;
      }
    }
  } else if (direction === 'prev') {
    // Find previous item above current scroll position
    for (let i = timelineItems.length - 1; i >= 0; i--) {
      if (timelineItems[i].offsetTop < currentScroll - 100) {
        targetItem = timelineItems[i];
        break;
      }
    }
  }
  
  if (targetItem) {
    targetItem.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add this to your existing initialization
  initializeTimeline();
});

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
  // Reinitialize interactions for responsive changes
  if (window.innerWidth <= 768) {
    // Mobile-specific adjustments
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      item.style.transform = '';
      item.style.zIndex = '';
    });
  }

  // ===== GLASSY HOVER EFFECTS =====
function initializeGlassyEffects() {
  // Initialize dynamic mouse-following light effect
  initializeDynamicGlassyEffect();
  
  // Initialize mouse trail effect
  initializeMouseTrail();
  
  // Add glassy hover classes to cards
  addGlassyHoverClasses();
}

function initializeDynamicGlassyEffect() {
  // Target cards for dynamic glassy effect
  const cards = document.querySelectorAll('.achievement-card, .highlighted-card, .team-card, .testimonial-card');
  
  cards.forEach(card => {
    card.classList.add('glassy-hover-dynamic');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Set CSS custom properties for mouse position
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
    
    card.addEventListener('mouseleave', () => {
      // Reset mouse position to center when leaving
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
}

function initializeMouseTrail() {
  // Create mouse trail effect
  document.addEventListener('mousemove', e => {
    // Only create trail dots occasionally to avoid performance issues
    if (Math.random() > 0.7) {
      const dot = document.createElement('div');
      dot.className = 'trail-dot';
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      document.body.appendChild(dot);
      
      // Remove dot after animation
      setTimeout(() => {
        if (document.body.contains(dot)) {
          dot.remove();
        }
      }, 600);
    }
  });
}

function addGlassyHoverClasses() {
  // Add additional hover classes for enhanced effects
  const cards = document.querySelectorAll('.achievement-card, .highlighted-card, .team-card, .testimonial-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });
}

// Call the glassy effects initialization after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add this after your existing initialization calls
  initializeGlassyEffects();
});
});

