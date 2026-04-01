/* ===============================
   TEXCELERATORS ROBOTICS CLUB - HOMEPAGE
   ===============================
   
   This file handles all interactive functionality for the Homepage including:
   - Navigation (hamburger menu, sidebar, scroll spy)
   - Hero Slideshow (automatic image carousel)
   - Testimonials Sliders (faculty and team testimonials)
   - Achievements (animated counters)
   - Bot Carousel (robot showcase with autoplay)
   - Scroll Animations (fade-in effects)
   - Story Playback (interactive story modals)
   - Form Handling (contact form submission)
   
   TABLE OF CONTENTS:
   1. Page Initialization
   2. Navigation System
   3. Hero Slideshow
   4. Testimonials Sliders
   5. Teams Testimonials
   6. Achievements Section
   7. Bot Carousel
   8. Scroll Animations
   9. Form Handling
   10. Story Playback
   11. Utility Functions
   =============================== */

/* ===============================
   1. PAGE INITIALIZATION
   =============================== 
   
   This section runs when the page loads and initializes
   all the interactive features in the correct order.
*/
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all main features
  initializeNavigation();           // Setup hamburger menu, sidebar, and navigation links
  initializeHeroSlideshow();        // Setup automatic hero image slideshow
  initializeTestimonialsSlider();   // Setup faculty testimonials slider
  initializeTeamsTestimonials();    // Setup team testimonials slider
  initializeAchievements();         // Setup animated achievement counters
  initializeBotCarousel();          // Setup robot showcase carousel
  initializeAnimations();           // Setup fade-in animations on scroll
  initializeFormHandling();         // Setup contact form submission
  initializeStoryPlayback();        // Setup interactive story modals
  initializeCardSpotlight();        // Setup Aceternity-style spotlight effect on bot cards
});

/* ===============================
   2. NAVIGATION SYSTEM
   =============================== 
   
   Handles all navigation functionality including:
   - Hamburger menu (mobile dropdown menu)
   - Sidebar (desktop fixed navigation)
   - Active section highlighting (scroll spy)
   - Smooth scrolling to sections
   - Responsive behavior (mobile vs desktop)
*/
function initializeNavigation() {
  // ===== DOM ELEMENTS =====
  // Get references to all navigation-related HTML elements
  const header = document.getElementById('main-header');           // Top navigation bar
  const sidebar = document.getElementById('sidebar');              // Left sidebar (desktop only)
  const hamburgerBtn = document.getElementById('hamburger-btn');   // Mobile menu button (3 lines)
  const navMenu = document.getElementById('nav-menu');             // Dropdown menu content
  const mainContent = document.getElementById('main-content');     // Main page content
  const body = document.body;                                      // Body element for adding classes
  
  // Get all navigation links (both in dropdown and sidebar)
  const navLinks = document.querySelectorAll('.nav-link');         // Links in dropdown menu
  const sidebarLinks = document.querySelectorAll('.sidebar-link'); // Links in sidebar
  const sections = document.querySelectorAll('section[id]');       // All page sections with IDs
  
  // ===== STATE VARIABLES =====
  // Track the current state of navigation elements
  let isMenuOpen = false;        // Is the mobile dropdown menu currently open?
  let isSidebarMode = false;     // Is the sidebar currently visible? (desktop only)
  let lastScrollTop = 0;         // Last scroll position (for scroll direction detection)
  
  // ===== INITIALIZATION =====
  // Setup all event listeners and initial state
  setupNavigationEvents();       // Attach click and scroll listeners
  updateActiveSection();         // Highlight the current section on page load
  
  /* ===== SETUP EVENT LISTENERS =====
     Attach all click, scroll, and resize event handlers
  */
  function setupNavigationEvents() {
    // Hamburger menu toggle - Opens/closes mobile dropdown menu
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', toggleMenu);
    }
    
    // Navigation link clicks - Handle clicks on menu items
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
      const testimonialSection = document.getElementById('teamsTestimonialContainer');
      
      if (testimonialSection) {
        const testimonialTop = testimonialSection.offsetTop - 200;
        const shouldShowSidebar = scrollTop >= testimonialTop;
        
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

/* ===============================
   3. HERO SLIDESHOW
   =============================== 
   
   Automatic image carousel for the hero section with:
   - Auto-advance every 5 seconds
   - Manual navigation (arrows and dots)
   - Pause on hover
   - Smooth fade transitions
*/
function initializeHeroSlideshow() {
  const heroSlides = document.querySelectorAll('.slide');        // All slide elements
  const slideDots = document.querySelectorAll('.slide-dot');     // Navigation dots
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

/* ===============================
   6. ACHIEVEMENTS SECTION
   =============================== 
   
   Animated counter that counts up from 0 to target value
   when the achievements section scrolls into view.
   Creates an engaging visual effect for statistics.
*/
function initializeAchievements() {
  const counters = document.querySelectorAll('.achievement-count');  // All counter elements
  const animationDuration = 2000;  // Animation duration in milliseconds (2 seconds)
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

/* ===============================
   7. BOT CAROUSEL
   =============================== 
   
   Interactive robot showcase carousel with:
   - Responsive layout (1/2/3 columns based on screen size)
   - Autoplay with pause/play control
   - Manual navigation (arrows and dots)
   - Touch/swipe support for mobile
   - Fullscreen mode
*/
function initializeBotCarousel() {
  const botsSlider = document.querySelector('.bots-slider');     // Slider container
  const botSlides = document.querySelectorAll('.bot-slide');     // Individual bot cards
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

/* ===============================
   11. UTILITY FUNCTIONS
   =============================== 
   
   Helper functions used throughout the code for:
   - Performance optimization (throttle, debounce)
   - Preventing excessive function calls on scroll/resize events
*/

/* ===== DEBOUNCE FUNCTION =====
   Delays function execution until after a pause in events.
   
   Example: If window is being resized, wait until resizing stops
   before running the handler (prevents hundreds of unnecessary calls).
   
   Use case: Resize, input, and search event handlers
   
   @param {Function} func - The function to debounce
   @param {Number} wait - Time (ms) to wait after last event
*/
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

/* ===== THROTTLE FUNCTION =====
   Limits how often a function can be called.
   
   Example: If a scroll event fires 100 times per second,
   throttle ensures the handler only runs once every 16ms (60fps).
   
   Use case: Scroll and resize event handlers
   
   @param {Function} func - The function to throttle
   @param {Number} limit - Minimum time (ms) between function calls
*/
function throttle(func, limit) {
  let inThrottle;  // Flag to track if we're in throttle period
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);  // Execute function
      inThrottle = true;          // Set throttle flag
      setTimeout(() => inThrottle = false, limit);  // Reset after limit
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

// ===== TESTIMONIALS SLIDER CLASS =====
class TestimonialSlider {
  constructor() {
      this.container = document.getElementById('testimonial');
      this.slider = document.getElementById('testimonialSlider');
      this.testimonials = document.querySelectorAll('.testimonial');
      this.indicators = document.querySelectorAll('.indicator');
      this.prevBtn = document.getElementById('prevBtn');
      this.nextBtn = document.getElementById('nextBtn');
      
      this.currentSlide = 0;
      this.totalSlides = this.testimonials.length;
      this.autoplayInterval = null;
      this.isHovered = false;
      this.hasShown = false;

      this.init();
  }

  init() {
      this.setupEventListeners();
      this.showContainerAfterDelay();
      this.startAutoplay();
  }

  setupEventListeners() {
      if (!this.prevBtn || !this.nextBtn) return;
      
      // Navigation buttons
      this.prevBtn.addEventListener('click', () => this.prevSlide());
      this.nextBtn.addEventListener('click', () => this.nextSlide());

      // Indicators
      this.indicators.forEach((indicator, index) => {
          indicator.addEventListener('click', () => this.goToSlide(index));
      });

      if (!this.slider) return;
      
      // Hover events for autoplay control
      this.slider.addEventListener('mouseenter', () => {
          this.isHovered = true;
          this.pauseAutoplay();
          this.showContainer();
      });

      this.slider.addEventListener('mouseleave', () => {
          this.isHovered = false;
          this.startAutoplay();
      });

      // Touch events for mobile
      let startX = 0;
      let endX = 0;

      this.slider.addEventListener('touchstart', (e) => {
          startX = e.touches[0].clientX;
          this.pauseAutoplay();
      });

      this.slider.addEventListener('touchend', (e) => {
          endX = e.changedTouches[0].clientX;
          const diff = startX - endX;

          if (Math.abs(diff) > 50) {
              if (diff > 0) {
                  this.nextSlide();
              } else {
                  this.prevSlide();
              }
          }

          if (!this.isHovered) {
              this.startAutoplay();
          }
      });
  }

  showContainerAfterDelay() {
      setTimeout(() => {
          if (!this.hasShown) {
              this.showContainer();
          }
      }, 2000);
  }

  showContainer() {
      if (!this.hasShown && this.container) {
          this.container.classList.add('visible');
          this.hasShown = true;
      }
  }

  goToSlide(index) {
      if (this.testimonials[this.currentSlide]) {
          this.testimonials[this.currentSlide].classList.remove('active');
      }
      if (this.indicators[this.currentSlide]) {
          this.indicators[this.currentSlide].classList.remove('active');
      }

      this.currentSlide = index;

      if (this.testimonials[this.currentSlide]) {
          this.testimonials[this.currentSlide].classList.add('active');
      }
      if (this.indicators[this.currentSlide]) {
          this.indicators[this.currentSlide].classList.add('active');
      }
  }

  nextSlide() {
      const nextIndex = (this.currentSlide + 1) % this.totalSlides;
      this.goToSlide(nextIndex);
  }

  prevSlide() {
      const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
      this.goToSlide(prevIndex);
  }

  startAutoplay() {
      this.pauseAutoplay();
      this.autoplayInterval = setInterval(() => {
          if (!this.isHovered) {
              this.nextSlide();
          }
      }, 5000);
  }

  pauseAutoplay() {
      if (this.autoplayInterval) {
          clearInterval(this.autoplayInterval);
          this.autoplayInterval = null;
      }
  }
}

// Initialize testimonials slider
function initializeTestimonialsSlider() {
  if (document.getElementById('testimonial')) {
      new TestimonialSlider();
  }
}
// ===== TEAMS TESTIMONIALS SLIDER CLASS =====
class TeamsTestimonialSlider {
  constructor() {
      this.container = document.getElementById('teamsTestimonialContainer');
      this.slider = document.getElementById('teamsTestimonialSlider');
      this.testimonials = document.querySelectorAll('.teams-testimonial');
      this.indicators = document.querySelectorAll('.teams-indicator');
      this.prevBtn = document.getElementById('teamsPrevBtn');
      this.nextBtn = document.getElementById('teamsNextBtn');
      
      this.currentSlide = 0;
      this.totalSlides = this.testimonials.length;
      this.autoplayInterval = null;
      this.isHovered = false;
      this.hasShown = false;

      this.init();
  }

  init() {
      this.setupEventListeners();
      this.showContainerAfterDelay();
      this.startAutoplay();
  }

  setupEventListeners() {
      if (!this.prevBtn || !this.nextBtn) return;
      
      this.prevBtn.addEventListener('click', () => this.prevSlide());
      this.nextBtn.addEventListener('click', () => this.nextSlide());

      this.indicators.forEach((indicator, index) => {
          indicator.addEventListener('click', () => this.goToSlide(index));
      });

      if (!this.slider) return;
      
      this.slider.addEventListener('mouseenter', () => {
          this.isHovered = true;
          this.pauseAutoplay();
          this.showContainer();
      });

      this.slider.addEventListener('mouseleave', () => {
          this.isHovered = false;
          this.startAutoplay();
      });

      // Touch events
      let startX = 0;
      let endX = 0;

      this.slider.addEventListener('touchstart', (e) => {
          startX = e.touches[0].clientX;
          this.pauseAutoplay();
      });

      this.slider.addEventListener('touchend', (e) => {
          endX = e.changedTouches[0].clientX;
          const diff = startX - endX;

          if (Math.abs(diff) > 50) {
              if (diff > 0) {
                  this.nextSlide();
              } else {
                  this.prevSlide();
              }
          }

          if (!this.isHovered) {
              this.startAutoplay();
          }
      });
  }

  showContainerAfterDelay() {
      setTimeout(() => {
          if (!this.hasShown) {
              this.showContainer();
          }
      }, 2000);
  }

  showContainer() {
      if (!this.hasShown && this.container) {
          this.container.classList.add('visible');
          this.hasShown = true;
      }
  }

  goToSlide(index) {
      if (this.testimonials[this.currentSlide]) {
          this.testimonials[this.currentSlide].classList.remove('active');
      }
      if (this.indicators[this.currentSlide]) {
          this.indicators[this.currentSlide].classList.remove('active');
      }

      this.currentSlide = index;

      if (this.testimonials[this.currentSlide]) {
          this.testimonials[this.currentSlide].classList.add('active');
      }
      if (this.indicators[this.currentSlide]) {
          this.indicators[this.currentSlide].classList.add('active');
      }
  }

  nextSlide() {
      const nextIndex = (this.currentSlide + 1) % this.totalSlides;
      this.goToSlide(nextIndex);
  }

  prevSlide() {
      const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
      this.goToSlide(prevIndex);
  }

  startAutoplay() {
      this.pauseAutoplay();
      this.autoplayInterval = setInterval(() => {
          if (!this.isHovered) {
              this.nextSlide();
          }
      }, 5000);
  }

  pauseAutoplay() {
      if (this.autoplayInterval) {
          clearInterval(this.autoplayInterval);
          this.autoplayInterval = null;
      }
  }
}

function initializeTeamsTestimonials() {
  if (document.getElementById('teamsTestimonialContainer')) {
      new TeamsTestimonialSlider();
  }
}

/* ===============================
   10. STORY PLAYBACK FUNCTIONALITY
   =============================== 
   
   Interactive story cards that open modal popups with full story content.
   Features:
   - Click to open story modal
   - Keyboard support (Enter/Space to open, Escape to close)
   - Smooth animations
   - Full story text with images and tags
*/

/* ===== PLAY STORY =====
   Opens a modal with the full story content
   @param {String} storyId - ID of the story to display
*/
function playStory(storyId) {
  const storyCard = document.querySelector(`[data-story="${storyId}"]`);
  
  if (storyCard) {
    // Add visual feedback
    storyCard.style.transform = 'scale(0.98)';
    
    // Create story modal or expanded view
    showStoryModal(storyId);
    
    // Reset visual feedback after animation
    setTimeout(() => {
      storyCard.style.transform = '';
    }, 200);
  }
}

function showStoryModal(storyId) {
  // Story content database - customize these stories for your team
  const stories = {
    breakthrough: {
      title: "🚤 When the Waters Turned",
      author: "Palak Khonde, Core Member",
      fullText: `We thought we had it figured out.
After weeks of prototypes — from foam floats to sleek carbon shells — we had a lineup of RC boats that looked fast, felt powerful, and screamed potential.
Except for one thing: the turn.

No matter how hard we pushed, the turning radius just wouldn't tighten. We'd glide fast, but wide — too wide. And while some of us kept tweaking rudder angles, others simply practiced longer, adapting to the curve.

It was fine. Not perfect, but fine.

And then, just a week before we were set to leave for IIT Bombay 🧳 — when the tension was high and changes seemed too risky — something happened.

Two quiet members from our boat squad, working mostly under the radar, rolled out a fresh design.
No noise. No fuss. Just precision.

The new boat was leaner, lighter, and cut through turns like it was reading our minds.
It didn't just handle better — it flipped our mindset.

While we were working to fix a problem, they had quietly reimagined the solution.
That boat didn't just corner tight.
It cornered everything we thought we knew. 🌊⚙️`,
      image: "Assets/images/Robots/Story/Sail.jpg",
      timestamp: "9:00 PM - March 15th, 2024",
      tags: ["Debugging", "Breakthrough", "Teamwork"]
    },
    learning: {
      title: "🚫 No Backup. No Victory.",
      author: "Ashutosh Maske, Mentor",
      fullText: `The night before Technex, around 7 PM, what was meant to be a final check turned into a moment we'll never forget. During testing at our college, our most reliable bot — the one that had powered through every challenge over the past six months — suddenly slammed into an iron chair while reversing.

In an instant, its acrylic chassis cracked from the front-right. The damage was irreversible. With no way to rejoin the broken parts and no backup ready, panic quickly replaced confidence.

We had trusted that bot like a teammate. But in that trust, we'd overlooked routine checkups. The constant wear had taken its toll, silently weakening it — and we failed to notice.

That night, a few of us stayed up working tirelessly, trying to salvage what we could. But no quick fix could undo months of fatigue or our lack of preparation.

We couldn't give our best at Overdrive. And we didn't win.

But that loss became a turning point. It taught us what no victory ever could: that reliability isn't just built — it's maintained. And that behind every successful run lies discipline, foresight, and a team that learns from its setbacks.`,
      image: "Assets/images/Robots/Story/Acrylic.png",
      timestamp: "8:00 PM - January 19th, 2025",
      tags: ["Learning", "Failure", "Growth"]
    },
    teamwork: {
      title: "⚙️ From Chaos to Combat",
      author: "Arnav Borikar, Designing Lead",
      fullText: `When we stepped into BITS Pilani Goa for Quark 2025, we were already racing the clock.
Not a single bot was ready — and three events were just hours away: Robo Race 🏎️, Robo Soccer ⚽, and Robo Sumo 🤖.

But this time, we didn't panic.
We remembered what went wrong before — when poor coordination and missing backups had cost us dearly 🧠.
We'd promised ourselves: never again.

So we built — together 🤝.
Some shaped claws for Soccer, others carved wedges for Sumo, some worked endlessly on motor assemblies 🔧.
Hours blurred 🌙. Palms ached. But the team held strong.

When the arenas opened, we entered all three 💥.
We fought hard in Race and Soccer. But in Robo Sumo, our bot stood its ground — and brought home 🥉 3rd place.

We didn't just build machines that night.
We built trust, confidence — and a team we could finally be proud of 💪.`,
      image: "assets/images/Robots/Story/Quark.jpg",
      timestamp: "4:45 PM - February 10th, 2025",
      tags: ["Collaboration", "Team Spirit", "Success"]   
    }
  };
  
  const story = stories[storyId];
  if (!story) return;
  
  // Create modal HTML
  const modalHTML = `
    <div class="story-modal-overlay" onclick="closeStoryModal()">
      <div class="story-modal" onclick="event.stopPropagation()">
        <button class="story-modal-close" onclick="closeStoryModal()">
          <i class="fas fa-times"></i>
        </button>
        <div class="story-modal-header">
          <img src="${story.image}" alt="${story.title}">
          <div class="story-modal-info">
            <h3>${story.title}</h3>
            <p class="story-modal-author">${story.author}</p>
            <p class="story-modal-timestamp">
              <i class="fas fa-clock"></i> ${story.timestamp}
            </p>
          </div>
        </div>
        <div class="story-modal-content">
          <div class="story-modal-text">
            ${story.fullText.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
          </div>
          <div class="story-modal-tags">
            ${story.tags.map(tag => `<span class="story-modal-tag">#${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to page
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Add entrance animation
  const modal = document.querySelector('.story-modal-overlay');
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.querySelector('.story-modal').style.transform = 'scale(1)';
  }, 10);
}

function closeStoryModal() {
  const modal = document.querySelector('.story-modal-overlay');
  if (modal) {
    modal.style.opacity = '0';
    modal.querySelector('.story-modal').style.transform = 'scale(0.9)';
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

/* ===== INITIALIZE STORY PLAYBACK =====
   Setup click and keyboard handlers for all story cards
*/
function initializeStoryPlayback() {
  // Get all story card elements
  const storyCards = document.querySelectorAll('.story-card');
  
  storyCards.forEach(card => {
    const storyId = card.getAttribute('data-story');
    if (storyId) {
      // Add click handler to card
      card.addEventListener('click', () => playStory(storyId));
      
      // Add keyboard accessibility
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          playStory(storyId);
        }
      });
    }
  });
  
  // Add escape key handler for modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeStoryModal();
    }
  });
}

/* ===============================
   ACETERNITY CARD SPOTLIGHT EFFECT
   ===============================
   
   Replicates the Aceternity UI card-spotlight component.
   Tracks mouse position on each bot card and applies a radial
   gradient spotlight that follows the cursor, creating a glowing
   light effect identical to the React component.
*/
function initializeCardSpotlight() {
  const botCards = document.querySelectorAll('.bot-card');

  botCards.forEach(card => {
    // Track mouse movement over the card
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();

      // Calculate mouse position as percentage relative to card
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Set CSS custom properties for the spotlight position
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });

    // Reset spotlight to center when mouse leaves
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
}
