/* ===============================
   TEAM PAGE ORGANIZED JAVASCRIPT
   ===============================
   
   This file handles all interactive functionality for the Team page including:
   - Navigation (hamburger menu, sidebar, scroll spy)
   - Robot Assistant (interactive help dialog)
   - Visual Effects (mouse trails, glassy cards, hover effects)
   - Scroll Animations (fade-in effects for elements)
   - Accessibility (keyboard navigation, ARIA labels)
   - Back to Top button
   
   TABLE OF CONTENTS:
   1. Page Initialization
   2. Back to Top Button
   3. Navigation System
   4. Robot Assistant
   5. Visual Effects
   6. Scroll Animations
   7. Accessibility Features
   8. Behind the Scenes Section
   9. Utility Functions
   =============================== */

   document.addEventListener('DOMContentLoaded', () => {
  
    /* ===============================
       1. PAGE INITIALIZATION
       =============================== 
       
       This section runs when the page loads and initializes
       all the interactive features in the correct order.
    */
    
    // Initialize all main features
    initializeNavigation();          // Setup hamburger menu, sidebar, and navigation links
    initializeBackToTop();           // Setup the back-to-top button
    initializeRobotAssistant();      // Setup the robot helper dialog
    initializeVisualEffects();       // Setup mouse trails and card effects
    initializeScrollAnimations();    // Setup fade-in animations on scroll
    initializeAccessibility();       // Setup keyboard navigation and accessibility features
    

    /* ===============================
       2. BACK TO TOP BUTTON
       =============================== 
       
       Creates and manages the floating "Back to Top" button that appears
       when the user scrolls down the page. The button smoothly scrolls
       the page back to the top when clicked.
    */
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    // If button doesn't exist in HTML, create it dynamically
    if (!backToTopBtn) {
      const btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Back to top'); // Accessibility label for screen readers
      btn.innerHTML = '<i class="fas fa-chevron-up"></i>'; // Up arrow icon
      document.body.appendChild(btn);
    }
    
    const button = document.getElementById('back-to-top');
    
    // Show button when user scrolls down more than 300px
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        button.classList.add('visible'); // Makes button visible
      } else {
        button.classList.remove('visible'); // Hides button
      }
    });
    
    // Smooth scroll to top when button is clicked
    button.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scrolling animation
      });
    });
  }
  
 

    /* ===============================
       (DUPLICATE ROBOT ASSISTANT - REMOVED)
       This was a duplicate function that's been consolidated below
       =============================== */
  
    /* ===============================
       3. NAVIGATION SYSTEM
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
      const header = document.getElementById("main-header");           // Top navigation bar
      const sidebar = document.getElementById("sidebar");              // Left sidebar (desktop only)
      const hamburgerBtn = document.getElementById("hamburger-btn");   // Mobile menu button (3 lines)
      const navMenu = document.getElementById("nav-menu");             // Dropdown menu content
      const body = document.body;                                      // Body element for adding classes
  
      // Get all navigation links (both in dropdown and sidebar)
      const navLinks = document.querySelectorAll(".nav-link");         // Links in dropdown menu
      const sidebarLinks = document.querySelectorAll(".sidebar-link"); // Links in sidebar
      const sections = document.querySelectorAll("section[id]");       // All page sections with IDs
  
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
          hamburgerBtn.addEventListener("click", toggleMenu);
        }
  
        // Navigation link clicks - Handle clicks on menu items
        navLinks.forEach((link) => {
          link.addEventListener("click", handleNavClick);
        });
  
        sidebarLinks.forEach((link) => {
          link.addEventListener("click", handleNavClick);
        });
  
        // Scroll events - Update sidebar and active section as user scrolls
        // throttle() limits function calls to 60fps for better performance
        window.addEventListener("scroll", throttle(handleScroll, 16)); 
        
        // Resize events - Adjust navigation for different screen sizes
        // debounce() waits 250ms after resize stops before running
        window.addEventListener("resize", debounce(handleResize, 250));
  
        // Close menu when clicking outside - Improves UX
        document.addEventListener("click", (e) => {
          if (isMenuOpen && header && !header.contains(e.target)) {
            closeMenu();
          }
        });
      }
  
      /* ===== MENU FUNCTIONALITY =====
         Functions to open, close, and toggle the mobile dropdown menu
      */
      
      // Toggle menu - Opens if closed, closes if open
      function toggleMenu() {
        if (isMenuOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      }
  
      // Open the dropdown menu with animation
      function openMenu() {
        isMenuOpen = true;
        if (hamburgerBtn) hamburgerBtn.classList.add("active");  // Animate hamburger to X
        if (navMenu) navMenu.classList.add("active");            // Show dropdown menu
  
        // Animate menu items with stagger effect (cascade animation)
        // Each item appears 50ms after the previous one
        const menuItems = navMenu ? navMenu.querySelectorAll(".nav-link") : [];
        menuItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.transform = "translateY(0)";   // Slide down to position
            item.style.opacity = "1";                 // Fade in
          }, index * 50);  // Delay increases for each item
        });
      }
  
      // Close the dropdown menu with animation
      function closeMenu() {
        isMenuOpen = false;
        if (hamburgerBtn) hamburgerBtn.classList.remove("active");  // Animate X back to hamburger
        if (navMenu) navMenu.classList.remove("active");            // Hide dropdown menu
  
        // Reset menu items to initial state (hidden above viewport)
        const menuItems = navMenu ? navMenu.querySelectorAll(".nav-link") : [];
        menuItems.forEach((item) => {
          item.style.transform = "translateY(-20px)";  // Move up
          item.style.opacity = "0";                    // Fade out
        });
      }
  
      /* ===== NAVIGATION CLICK HANDLER =====
         Handles clicks on navigation links (both dropdown and sidebar)
         Supports both internal section links (#section) and external page links (.html)
      */
      function handleNavClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        // Check if it's an external link (navigates to another page)
        if (href.includes('.html')) {
          // Let the browser handle the navigation normally (page reload)
          closeMenu();
          return;
        }
        
        // Handle internal section navigation (smooth scroll to section on same page)
        e.preventDefault();  // Prevent default jump behavior
        const targetId = href.substring(1);  // Remove the # from href
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          // Calculate scroll position accounting for fixed header/sidebar
          // If sidebar is active, no offset needed. Otherwise, offset by 120px for header
          const offsetTop = targetSection.offsetTop - (isSidebarMode ? 0 : 120);
          
          // Smooth scroll to the target section
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'  // Smooth scrolling animation
          });
          
          closeMenu();  // Close mobile menu after navigation
        }
      }
  
      /* ===== SCROLL HANDLER =====
         Runs on every scroll event to:
         1. Show/hide sidebar based on scroll position (desktop only)
         2. Update active section highlighting (scroll spy)
      */
      function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
        // ===== SIDEBAR ACTIVATION LOGIC (DESKTOP ONLY) =====
        // Only show sidebar on screens wider than 768px (tablets and desktops)
        if (window.innerWidth > 768) {
          // Show sidebar when user scrolls to the mentor section (first team section)
          const mentorSection = document.getElementById("mentor-section");
  
          if (mentorSection) {
            // Calculate trigger point: 200px before the mentor section
            const mentorSectionTop = mentorSection.offsetTop - 200;
            const shouldShowSidebar = scrollTop >= mentorSectionTop;
  
            // Activate sidebar if we've scrolled past trigger point and it's not already active
            if (shouldShowSidebar && !isSidebarMode) {
              activateSidebarMode();
            } 
            // Deactivate sidebar if we've scrolled back up and it's currently active
            else if (!shouldShowSidebar && isSidebarMode) {
              deactivateSidebarMode();
            }
          }
        }
  
        // Update which navigation link is highlighted based on current scroll position
        updateActiveSection();
        
        // Store current scroll position for future reference
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      }
  
      /* ===== SIDEBAR FUNCTIONALITY =====
         Functions to show/hide the fixed sidebar navigation (desktop only)
      */
      
      // Activate sidebar - Slides in from the left
      function activateSidebarMode() {
        // Safety check: Only activate on desktop (screen width > 768px)
        if (window.innerWidth <= 768) return;
  
        isSidebarMode = true;
        body.classList.add("sidebar-active");      // Adds class to body for CSS adjustments
        if (sidebar) sidebar.classList.add("active");  // Makes sidebar visible
        closeMenu();  // Close mobile menu if it's open
  
        // Smooth entrance animation - Slide in from left after 100ms
        setTimeout(() => {
          if (sidebar) sidebar.style.transform = "translateX(0)";
        }, 100);
      }
  
      // Deactivate sidebar - Hides the sidebar
      function deactivateSidebarMode() {
        isSidebarMode = false;
        body.classList.remove("sidebar-active");      // Removes body class
        if (sidebar) sidebar.classList.remove("active");  // Hides sidebar
      }
  
      // Handle window resize - Adjust navigation for different screen sizes
      function handleResize() {
        // Disable sidebar on mobile if it's currently active
        // This prevents sidebar from showing on mobile after rotating device
        if (window.innerWidth <= 768 && isSidebarMode) {
          deactivateSidebarMode();
        }
        // Update active section highlighting for new viewport size
        updateActiveSection();
      }
  
      /* ===== ACTIVE SECTION HIGHLIGHTING (SCROLL SPY) =====
         Highlights the navigation link corresponding to the current section
         being viewed. This is called "scroll spy" functionality.
      */
      function updateActiveSection() {
        // Add 200px offset to scroll position for better UX
        // This highlights the section slightly before it reaches the top
        const scrollPosition = window.scrollY + 200;
  
        // Loop through all sections on the page
        sections.forEach((section) => {
          const sectionTop = section.offsetTop;        // Top position of section
          const sectionHeight = section.offsetHeight;  // Height of section
          const sectionId = section.getAttribute("id"); // ID of section (e.g., "mentor-section")
  
          // Check if current scroll position is within this section
          if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
          ) {
            // ===== UPDATE NAVBAR LINKS =====
            // Remove active class from all navbar links
            navLinks.forEach((link) => {
              link.classList.remove("active", "scroll-spy-active");
              // Add active class to the link that matches this section
              if (link.getAttribute("href") === `#${sectionId}`) {
                link.classList.add("active", "scroll-spy-active");
              }
            });
  
            // ===== UPDATE SIDEBAR LINKS =====
            // Remove active class from all sidebar links
            sidebarLinks.forEach((link) => {
              link.classList.remove("active", "scroll-spy-active");
              // Add active class to the link that matches this section
              if (link.getAttribute("href") === `#${sectionId}`) {
                link.classList.add("active", "scroll-spy-active");
              }
            });
          }
        });
      }
    }
  
    /* ===============================
       4. ROBOT ASSISTANT
       =============================== 
       
       Interactive floating robot helper that:
       - Provides contextual messages about each team section
       - Offers quick navigation to different sections
       - Auto-shows after 8 seconds, auto-hides after 12 seconds
       - Can be manually opened/closed by clicking the robot icon
    */
    
    function initializeRobotAssistant() {
      // ===== GET DOM ELEMENTS =====
      const robotAssistantIcon = document.querySelector('.robot-assistant-icon');      // Floating robot icon
      const robotAssistantDialog = document.getElementById('robot-assistant-dialog'); // Dialog popup
      const robotAssistantClose = document.getElementById('robot-assistant-close');   // Close button
      const robotAssistantMessage = document.getElementById('robot-assistant-message'); // Message text
      const robotOptions = document.querySelectorAll('.robot-option');                // Navigation buttons
      
      // Safety check: Exit if required elements don't exist in HTML
      if (!robotAssistantIcon || !robotAssistantDialog) return;
      
      // ===== CONTEXTUAL MESSAGES =====
      // Different messages for each team section
      const robotMessages = {
        'mentor-section': "Our mentor guides the team with years of experience and expertise. Would you like to learn about our other team members?",
        'leadership-section': "Our leadership team brings together experts in various fields of robotics. What else would you like to explore?",
        'core-section': "Our core team members are specialists who drive our projects forward. Can I help you navigate to other sections?",
        'junior-section': "Our junior members are the future of robotics innovation, bringing fresh ideas and enthusiasm. Where would you like to go next?",
      };
      
      // ===== OPEN DIALOG =====
      // Show dialog when clicking the floating robot icon
      robotAssistantIcon.addEventListener('click', () => {
        robotAssistantDialog.classList.add('active');
      });
      
      // ===== CLOSE DIALOG =====
      // Close dialog when clicking the X button
      if (robotAssistantClose) {
        robotAssistantClose.addEventListener('click', () => {
          robotAssistantDialog.classList.remove('active');
        });
      }
      
      // ===== HANDLE NAVIGATION OPTIONS =====
      // When user clicks a navigation button in the dialog
      robotOptions.forEach(option => {
        option.addEventListener('click', () => {
          const sectionId = option.getAttribute('data-section');  // Get target section ID
          
          // Smooth scroll to the selected section
          const targetSection = document.getElementById(sectionId);
          if (targetSection) {
            targetSection.scrollIntoView({ 
              behavior: 'smooth'  // Smooth scrolling animation
            });
          }
          
          // Update the robot's message to match the new section
          if (robotAssistantMessage && robotMessages[sectionId]) {
            robotAssistantMessage.textContent = robotMessages[sectionId];
          }
          
          // Close dialog 1 second after navigation starts
          setTimeout(() => {
            robotAssistantDialog.classList.remove('active');
          }, 1000);
        });
      });
      
      // ===== AUTO-SHOW FEATURE =====
      // Automatically show robot assistant after 8 seconds
      setTimeout(() => {
        robotAssistantDialog.classList.add('active');
        
        // Auto-hide after 12 more seconds if user doesn't interact
        setTimeout(() => {
          if (robotAssistantDialog.classList.contains('active')) {
            robotAssistantDialog.classList.remove('active');
          }
        }, 12000);  // 12 seconds
      }, 8000);  // 8 seconds
      
      // ===== CLOSE WHEN CLICKING OUTSIDE =====
      // Improves UX by allowing users to dismiss dialog by clicking anywhere
      document.addEventListener('click', function(event) {
        const isClickInside = robotAssistantDialog.contains(event.target) || 
                              robotAssistantIcon.contains(event.target);
        
        // If click is outside and dialog is open, close it
        if (!isClickInside && robotAssistantDialog.classList.contains('active')) {
          robotAssistantDialog.classList.remove('active');
        }
      });
      
      // ===== PREVENT DIALOG FROM CLOSING WHEN CLICKING INSIDE =====
      // Stop click events from bubbling up to document listener
      robotAssistantDialog.addEventListener('click', function(event) {
        event.stopPropagation();
      });
    }
  
    /* ===============================
       5. VISUAL EFFECTS
       =============================== 
       
       Adds interactive visual effects to enhance user experience:
       - Mouse trail: Animated dots that follow cursor movement
       - Glassy effect: Radial gradient that follows mouse on cards
       - Pulse effect: Subtle scale animation on card hover
    */
    
    function initializeVisualEffects() {
      initializeMouseTrail();    // Cursor trail effect
      initializeGlassyEffect();  // Glassy card hover effect
      initializePulseEffect();   // Pulse animation on hover
    }
  
    /* ===== MOUSE TRAIL EFFECT =====
       Creates small animated dots that follow the cursor
       Adds a modern, interactive feel to the page
    */
    function initializeMouseTrail() {
      document.addEventListener('mousemove', e => {
        // Create a new dot element
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        
        // Position dot at cursor location
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        
        // Add dot to page
        document.body.appendChild(dot);
      
        // Remove dot after 600ms (fade-out animation duration)
        setTimeout(() => {
          if (document.body.contains(dot)) {
            dot.remove();
          }
        }, 600);
      });
    }
  
    /* ===== GLASSY CARD EFFECT =====
       Creates a radial gradient that follows the mouse cursor
       on team cards, creating a "glassy" highlight effect
    */
    function initializeGlassyEffect() {
      document.querySelectorAll('.team-card').forEach(card => {
        // Update gradient position as mouse moves over card
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;  // Mouse X relative to card
          const y = e.clientY - rect.top;   // Mouse Y relative to card
          
          // Apply radial gradient centered at mouse position
          card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,255,255,0.15), transparent)`;
        });
      
        // Remove gradient when mouse leaves card
        card.addEventListener('mouseleave', () => {
          card.style.background = '';
        });
      });
    }
  
    /* ===== PULSE HOVER EFFECT =====
       Adds a CSS class that creates a subtle scale animation
       when hovering over team cards
    */
    function initializePulseEffect() {
      document.querySelectorAll('.team-card').forEach(card => {
        card.classList.add('pulse-hover');  // CSS class handles the animation
      });
    }
  
    /* ===============================
       6. SCROLL ANIMATIONS
       =============================== 
       
       Implements "fade-in on scroll" animations for elements with
       the 'animate-on-scroll' class. Elements become visible with
       animation when they enter the viewport.
    */
    
    function initializeScrollAnimations() {
      // Get all elements that should animate on scroll
      const animatedElements = document.querySelectorAll('.animate-on-scroll');
      
      /* ===== CHECK IF ELEMENTS ARE IN VIEWPORT =====
         Determines which elements are currently visible and adds
         the 'visible' class to trigger CSS animations
      */
      function checkInView() {
        const windowHeight = window.innerHeight;  // Height of browser window
        const windowTop = window.scrollY;         // Current scroll position
        const windowBottom = windowTop + windowHeight;  // Bottom of viewport
        
        animatedElements.forEach(element => {
          const elementTop = element.offsetTop;           // Top position of element
          const elementHeight = element.offsetHeight;     // Height of element
          const elementBottom = elementTop + elementHeight;  // Bottom position of element
          
          // Check if any part of the element is visible in viewport
          if (elementBottom > windowTop && elementTop < windowBottom) {
            element.classList.add('visible');  // Trigger CSS animation
          }
        });
      }
      
      // Run check on scroll and resize events
      window.addEventListener('scroll', checkInView);
      window.addEventListener('resize', checkInView);
      
      // Run initial check when page loads (for elements already in view)
      checkInView();
    }
  
    /* ===============================
       7. ACCESSIBILITY FEATURES
       =============================== 
       
       Ensures the page is accessible to all users, including those
       using keyboard navigation or screen readers. Implements:
       - Keyboard shortcuts (ESC to close dialogs)
       - Keyboard navigation for interactive elements
       - ARIA labels for screen readers
    */
    
    function initializeAccessibility() {
      // ===== KEYBOARD NAVIGATION =====
      document.addEventListener('keydown', function(event) {
        // ESC key closes robot assistant dialog
        // This is a common UX pattern for closing modals/dialogs
        const robotDialog = document.getElementById('robot-assistant-dialog');
        if (event.key === 'Escape' && robotDialog && robotDialog.classList.contains('active')) {
          robotDialog.classList.remove('active');
        }
      });
      
      // ===== MOBILE MENU KEYBOARD ACCESSIBILITY =====
      // Allow keyboard users to open/close mobile menu with Enter or Space
      const mobileMenuButton = document.getElementById('hamburger-btn');
      if (mobileMenuButton) {
        mobileMenuButton.addEventListener('keydown', function(event) {
          // Enter or Space key triggers menu toggle
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();  // Prevent page scroll on Space
            mobileMenuButton.click();  // Trigger click event
          }
        });
      }
    }
  
    /* ===============================
       9. UTILITY FUNCTIONS
       =============================== 
       
       Helper functions used throughout the code for:
       - Performance optimization (throttle, debounce)
       - User notifications (showNotification)
       - External API access (window.TeamPageUtils)
    */
    
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
  
    /* ===== DEBOUNCE FUNCTION =====
       Delays function execution until after a pause in events.
       
       Example: If window is being resized, wait until resizing stops
       before running the handler (prevents hundreds of unnecessary calls).
       
       Use case: Resize, input, and search event handlers
       
       @param {Function} func - The function to debounce
       @param {Number} wait - Time (ms) to wait after last event
       @param {Boolean} immediate - Execute on leading edge instead of trailing
    */
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
  
    /* ===== SHOW NOTIFICATION =====
       Displays a temporary notification message in the top-right corner.
       
       @param {String} message - The message to display
       @param {String} type - Type of notification ('info' or 'success')
       
       Example usage:
       showNotification('Profile updated!', 'success');
    */
    function showNotification(message, type = 'info') {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      
      // Apply inline styles for positioning and appearance
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
        transform: translateX(100%);  /* Start off-screen */
        transition: transform 0.3s ease;
        font-family: 'Outfit', sans-serif;
      `;
      
      document.body.appendChild(notification);
      
      // Slide in animation
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 100);
      
      // Slide out and remove after 3 seconds
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    }
  
    /* ===== EXPORT FUNCTIONS =====
       Make utility functions available globally for use in other scripts
       or browser console. Access via: window.TeamPageUtils.functionName()
    */
    window.TeamPageUtils = {
      showNotification,
      throttle,
      debounce
    };
    
  });

/* ===============================
   8. BEHIND THE SCENES SECTION
   =============================== 
   
   Handles the "Behind the Scenes" section functionality:
   - Filter buttons to show/hide different categories
   - Story moment cards with interactive overlays
   - Mobile-specific interactions
*/

/* ===== MAIN INITIALIZATION =====
   Initialize all Behind the Scenes features
*/
function initializeBehindScenes() {
  initializeFilters();        // Setup category filter buttons
  initializeStoryMoments();   // Setup story card interactions
}

/* ===== FILTER FUNCTIONALITY =====
   Allows users to filter story moments by category
   (e.g., "All", "Workshops", "Competitions", "Build Sessions")
*/
function initializeFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');      // Filter buttons
  const storyMoments = document.querySelectorAll('.story-moment');  // Story cards
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');  // Get selected category
      
      // ===== UPDATE ACTIVE BUTTON =====
      // Remove 'active' class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add 'active' class to clicked button
      btn.classList.add('active');
      
      // ===== FILTER STORY MOMENTS =====
      storyMoments.forEach(moment => {
        const category = moment.getAttribute('data-category');
        
        // Show moment if it matches filter or filter is 'all'
        if (filter === 'all' || category === filter) {
          moment.classList.remove('hidden');
          // Trigger fade-in animation after a short delay
          setTimeout(() => {
            moment.classList.add('visible');
          }, 100);
        } 
        // Hide moment if it doesn't match filter
        else {
          moment.classList.add('hidden');
          moment.classList.remove('visible');
        }
      });
    });
  });
}

/* ===== STORY MOMENT INTERACTIONS =====
   Adds interactive features to story moment cards:
   - Mobile: Tap to toggle overlay visibility
   - Keyboard: Enter/Space to activate
*/
function initializeStoryMoments() {
  const storyMoments = document.querySelectorAll('.story-moment');
  
  storyMoments.forEach(moment => {
    // ===== MOBILE CLICK INTERACTION =====
    // On mobile, tapping a card toggles the overlay (shows/hides details)
    moment.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {  // Only on mobile screens
        const overlay = moment.querySelector('.story-overlay');
        // Toggle overlay: if visible, hide it; if hidden, show it
        overlay.style.opacity = overlay.style.opacity === '1' ? '0' : '1';
      }
    });
    
    // ===== KEYBOARD ACCESSIBILITY =====
    // Allow keyboard users to interact with story cards
    moment.setAttribute('tabindex', '0');  // Make card focusable
    moment.addEventListener('keydown', (e) => {
      // Enter or Space key triggers click event
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();  // Prevent page scroll on Space
        moment.click();      // Trigger click handler
      }
    });
  });
}

/* ===== INITIALIZE ON PAGE LOAD =====
   Run initialization when DOM is fully loaded
*/
document.addEventListener('DOMContentLoaded', function() {
  initializeBehindScenes();
});
