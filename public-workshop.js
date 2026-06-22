/* ===============================
   TEXCELERATORS ROBOTICS CLUB - WORKSHOP PAGE
   ===============================
   
   This file handles all interactive functionality for the Workshop page including:
   - Navigation (hamburger menu, sidebar, scroll spy)
   - Gallery (lightbox image viewer)
   - Contact Form (submission and validation)
   - Workshop Registration (modal popups)
   - Scroll Effects (animations and parallax)
   
   TABLE OF CONTENTS:
   1. Page Initialization
   2. Navigation System
   3. Footer Links
   4. Gallery Lightbox
   5. Contact Form
   6. Workshop Registration
   7. Scroll Effects
   8. Utility Functions
   =============================== */

/* ===============================
   1. PAGE INITIALIZATION
   =============================== 
   
   This section runs when the page loads and initializes
   all the interactive features in the correct order.
   This ensures proper loading order and prevents issues with missing DOM elements.
*/
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all main features
  initializeNavigation();           // Setup hamburger menu, sidebar, and navigation links
  initializeFooterLinks();          // Setup footer navigation links
  initializeGallery();              // Setup gallery lightbox functionality
  initializeContactForm();          // Setup contact form submission and validation
  initializeWorkshopRegistration(); // Setup workshop registration modals
  initializeScrollEffects();        // Setup scroll-based animations and parallax effects
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
  // Cache frequently used elements for better performance
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
    e.preventDefault();
    const href = e.currentTarget.getAttribute('data-href') || e.currentTarget.getAttribute('href');
    
    // Check if it's an external link (contains .html)
    if (href && href.includes('.html')) {
      // Let the browser handle the navigation normally
      window.location.href = href;
      closeMenu();
      return;
    }
    
    // Handle internal section navigation
    if (href && href.startsWith('#')) {
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
  }
  
  // ===== SCROLL HANDLER =====
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Sidebar activation logic (desktop only)
    if (window.innerWidth > 768) {
      const procedureSection = document.getElementById('procedure');
      
      if (procedureSection) {
        const procedureTop = procedureSection.offsetTop - 200;
        const shouldShowSidebar = scrollTop >= procedureTop;
        
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
    
    // IMPORTANT: Hide the dropdown navigation menu when sidebar is active
    // This ensures the navbar dropdown doesn't interfere with the sidebar
    closeMenu();
    
    // COMPLETELY HIDE the header when sidebar is active
    if (header) {
      header.style.transform = 'translateY(-100%)';
      header.style.opacity = '0';
      header.style.visibility = 'hidden';
    }
    
    // Smooth entrance animation
    setTimeout(() => {
      if (sidebar) sidebar.style.transform = 'translateX(0)';
    }, 100);
  }
  
  function deactivateSidebarMode() {
    isSidebarMode = false;
    body.classList.remove('sidebar-active');
    if (sidebar) sidebar.classList.remove('active');
    
    // SHOW the header again when sidebar is deactivated
    if (header) {
      header.style.transform = 'translateY(0)';
      header.style.opacity = '1';
      header.style.visibility = 'visible';
    }
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

// ===== FOOTER LINKS SYSTEM =====
// This function handles footer navigation links to maintain consistency
// with the main navigation system and ensure proper scroll behavior
function initializeFooterLinks() {
  const footerLinks = document.querySelectorAll('.footer-link');
  
  if (footerLinks.length === 0) return;
  
  footerLinks.forEach(link => {
    link.addEventListener('click', handleFooterLinkClick);
  });
  
  function handleFooterLinkClick(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('data-href') || e.currentTarget.getAttribute('href');
    
    // Check if it's an external link (contains .html)
    if (href && href.includes('.html')) {
      window.location.href = href;
      return;
    }
    
    // Handle internal section navigation
    if (href && href.startsWith('#')) {
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Calculate offset based on current navigation state
        const offset = window.innerWidth > 768 && document.body.classList.contains('sidebar-active') ? 0 : 120;
        const offsetTop = targetSection.offsetTop - offset;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  }
}

// ===== GALLERY FUNCTIONALITY =====
function initializeGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');
  
  if (!lightbox || !lightboxImage || !lightboxClose) return;
  
  // Gallery item click handlers
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imageSrc = item.getAttribute('data-image') || item.querySelector('img').src;
      const imageAlt = item.querySelector('img').alt || 'Gallery image';
      
      lightboxImage.src = imageSrc;
      lightboxImage.alt = imageAlt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Close lightbox handlers
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Close lightbox with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImage.src = '';
    lightboxImage.alt = '';
  }
}

// ===== CONTACT FORM FUNCTIONALITY =====
function initializeContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', handleFormSubmit);
  
  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const workshopInterest = formData.get('workshop-interest');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !message) {
      window.NavSystem.showNotification('Please fill in all required fields.', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      window.NavSystem.showNotification('Please enter a valid email address.', 'error');
      return;
    }
    
    const submitBtn = contactForm.querySelector('.form-submit-btn') || contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
    }

    const payload = {
      fullName: String(name).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : 'Not provided',
      college: 'Workshop Inquiry',
      roleInterested: 'Event Collaboration',
      skills: workshopInterest ? String(workshopInterest).trim() : 'Workshop',
      collaborationReason: String(message).trim(),
      portfolioLink: ''
    };

    fetch('/api/collaboration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to submit message');
        }
        window.NavSystem.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
      })
      .catch((error) => {
        window.NavSystem.showNotification(error.message || 'An error occurred. Please try again.', 'error');
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      });
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// ===== WORKSHOP REGISTRATION FUNCTIONALITY =====
function initializeWorkshopRegistration() {
  // Google Form URL - Replace with your actual Google Form URL
  const GOOGLE_FORM_URL = 'https://forms.google.com/workshop-registration';
  
  // Register Now buttons
  const registerNowBtn = document.getElementById('register-now-btn');
  const workshopRegisterBtns = document.querySelectorAll('.workshop-register-btn');
  
  // Learn More button
  const learnMoreBtn = document.getElementById('learn-more-btn');
  
  // Event listeners for registration buttons
  if (registerNowBtn) {
    registerNowBtn.addEventListener('click', handleRegistration);
  }
  
  workshopRegisterBtns.forEach(btn => {
    btn.addEventListener('click', handleRegistration);
  });
  
  // Event listener for learn more button
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', handleLearnMore);
  }
  
  function handleRegistration() {
    // Show registration information modal before opening Google Form
    showRegistrationInfo();
  }
  
  function handleLearnMore() {
    const procedureSection = document.getElementById('procedure');
    if (procedureSection) {
      const offsetTop = procedureSection.offsetTop - 120;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }
  
  function showRegistrationInfo() {
    // Create a modal to show registration information
    const modal = document.createElement('div');
    modal.className = 'registration-modal';
    modal.innerHTML = `
      <div class="registration-modal-content">
        <div class="registration-modal-header">
          <h3>Workshop Registration</h3>
          <button class="registration-modal-close">&times;</button>
        </div>
        <div class="registration-modal-body">
          <h4>What You'll Need to Provide:</h4>
          <ul class="registration-requirements">
            <li><i class="fas fa-check text-green"></i> Full Name and Contact Details</li>
            <li><i class="fas fa-check text-green"></i> Educational Background</li>
            <li><i class="fas fa-check text-green"></i> Workshop Preferences</li>
            <li><i class="fas fa-check text-green"></i> Previous Experience (if any)</li>
            <li><i class="fas fa-check text-green"></i> Specific Learning Goals</li>
          </ul>
          
          <h4>What Happens Next:</h4>
          <ul class="registration-process">
            <li><i class="fas fa-arrow-right text-blue"></i> Fill out the Google Form</li>
            <li><i class="fas fa-arrow-right text-blue"></i> Receive confirmation email within 24 hours</li>
            <li><i class="fas fa-arrow-right text-blue"></i> Get workshop materials and preparation guide</li>
            <li><i class="fas fa-arrow-right text-blue"></i> Join the workshop on the scheduled date</li>
          </ul>
          
          <div class="registration-notes">
            <p><strong>Note:</strong> Our workshops have limited seats to ensure personalized attention. Early registration is recommended!</p>
          </div>
        </div>
        <div class="registration-modal-footer">
          <button class="btn-secondary registration-modal-cancel">Cancel</button>
          <button class="btn-primary registration-modal-proceed">
            <i class="fas fa-external-link-alt"></i>
            Proceed to Google Form
          </button>
        </div>
      </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 2rem;
    `;
    
    const modalContent = modal.querySelector('.registration-modal-content');
    modalContent.style.cssText = `
      background: linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(30, 41, 59, 0.9));
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 1rem;
      max-width: 600px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
      color: var(--foreground);
    `;
    
    const modalHeader = modal.querySelector('.registration-modal-header');
    modalHeader.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(148, 163, 184, 0.2);
    `;
    
    const modalBody = modal.querySelector('.registration-modal-body');
    modalBody.style.cssText = `
      padding: 1.5rem;
    `;
    
    const modalFooter = modal.querySelector('.registration-modal-footer');
    modalFooter.style.cssText = `
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding: 1.5rem;
      border-top: 1px solid rgba(148, 163, 184, 0.2);
    `;
    
    // Style lists
    const requirementsList = modal.querySelector('.registration-requirements');
    const processList = modal.querySelector('.registration-process');
    [requirementsList, processList].forEach(list => {
      list.style.cssText = `
        list-style: none;
        padding: 0;
        margin: 1rem 0;
      `;
      
      list.querySelectorAll('li').forEach(li => {
        li.style.cssText = `
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: var(--muted-foreground);
        `;
      });
    });
    
    // Style notes
    const notes = modal.querySelector('.registration-notes');
    notes.style.cssText = `
      background: rgba(37, 99, 235, 0.1);
      border: 1px solid rgba(37, 99, 235, 0.3);
      border-radius: 0.5rem;
      padding: 1rem;
      margin-top: 1rem;
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Event listeners
    const closeBtn = modal.querySelector('.registration-modal-close');
    const cancelBtn = modal.querySelector('.registration-modal-cancel');
    const proceedBtn = modal.querySelector('.registration-modal-proceed');
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    proceedBtn.addEventListener('click', () => {
      closeModal();
      // Open Google Form in new tab
      window.open(GOOGLE_FORM_URL, '_blank');
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    function closeModal() {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    }
  }
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const animateElements = document.querySelectorAll('.procedure-step, .workshop-card, .topic-category, .gallery-item');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });
}

// ===== UTILITY FUNCTIONS =====

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

// Debounce function for resize events
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// ===== ADDITIONAL WORKSHOP FEATURES =====

// Learn More button functionality
document.addEventListener('DOMContentLoaded', function() {
  const learnMoreBtn = document.getElementById('learn-more-btn');
  
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
      const procedureSection = document.getElementById('procedure');
      if (procedureSection) {
        const offsetTop = procedureSection.offsetTop - 120;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  }
});

// Enhanced workshop card interactions
document.addEventListener('DOMContentLoaded', function() {
  const workshopCards = document.querySelectorAll('.workshop-card');
  
  workshopCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.background = 'linear-gradient(145deg, rgba(37, 99, 235, 0.1), rgba(139, 92, 246, 0.05))';
    });
    
    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('featured')) {
        card.style.background = 'linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(30, 41, 59, 0.2))';
      }
    });
  });
});

// Dynamic pricing display
document.addEventListener('DOMContentLoaded', function() {
  const workshopSelect = document.getElementById('reg-workshop');
  
  if (workshopSelect) {
    workshopSelect.addEventListener('change', (e) => {
      const selectedValue = e.target.value;
      let price = '';
      
      switch (selectedValue) {
        case 'arduino':
          price = '₹500';
          break;
        case 'ai-ml':
          price = '₹800';
          break;
        case 'iot':
          price = '₹1200';
          break;
        default:
          price = '';
      }
      
      // Update pricing display if exists
      const priceDisplay = document.querySelector('.price-display');
      if (priceDisplay) {
        priceDisplay.textContent = price;
      }
    });
  }
});
