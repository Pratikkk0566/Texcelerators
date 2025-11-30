/* ===============================
   TEXCELERATORS ROBOTICS CLUB - ROBOTS PAGE
   ===============================
   
   This file handles all interactive functionality for the Robots page including:
   - Navigation (hamburger menu, sidebar, scroll spy)
   - Scroll Animations (fade-in effects for robot cards)
   - Story Playback (interactive workshop story modals)
   - Category Filtering (filter robots by type)
   
   TABLE OF CONTENTS:
   1. Page Initialization
   2. Navigation System
   3. Scroll Animations
   4. Story Playback
   5. Utility Functions
   =============================== */

/* ===============================
   1. PAGE INITIALIZATION
   =============================== 
   
   This section runs when the page loads and initializes
   all the interactive features in the correct order.
*/
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all main features
  initializeNavigation();    // Setup hamburger menu, sidebar, and navigation links
  initializeAnimations();    // Setup fade-in animations on scroll
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
      const robotSection = document.getElementById('robosoccer');
      
      if (robotSection) {
        const robotTop = robotSection.offsetTop - 200;
        const shouldShowSidebar = scrollTop >= robotTop;
        
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
  
  // ===== UTILITY FUNCTIONS =====
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
}

// ===== ANIMATIONS =====
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
  
  window.addEventListener('scroll', checkInView);
  window.addEventListener('resize', checkInView);
  checkInView(); // Initial check
  
  // Add staggered animation delays for better visual effect
  animatedElements.forEach((element, index) => {
    element.style.animationDelay = (index * 0.1) + 's';
  });
}

// Robot Details Toggle Function (Keep your existing function)
function toggleRobotDetails(robotId) {
  const details = document.getElementById(robotId + '-details');
  
  if (details) {
    // Close all other expanded details first
    const allDetails = document.querySelectorAll('.robot-details');
    allDetails.forEach(detail => {
      if (detail.id !== robotId + '-details') {
        detail.classList.remove('expanded');
      }
    });
    
    // Toggle the clicked one
    details.classList.toggle('expanded');
    
    // Add a small delay to ensure smooth animation
    if (details.classList.contains('expanded')) {
      setTimeout(() => {
        details.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 300);
    }
  }
}

// ===== BEHIND THE BUILD FUNCTIONALITY =====
// Interactive functionality for the Behind the Build section
// Handles process details, story playback, and tool showcases

// Initialize Behind the Build functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeBehindBuild();
});

function initializeBehindBuild() {
  // Initialize all Behind the Build components
  initializeProcessDetails();
  initializeStoryPlayback();
  initializeToolShowcase();
  initializeResponsiveFeatures();
}

// ===== PROCESS DETAILS FUNCTIONALITY =====
// Handles expandable process details for each build phase
function toggleProcessDetails(phase) {
  const details = document.getElementById(phase + '-details');
  const button = document.querySelector(`[data-phase="${phase}"] .expand-btn`);
  
  if (details && button) {
    // Close all other expanded details first for cleaner UX
    const allDetails = document.querySelectorAll('.process-details');
    const allButtons = document.querySelectorAll('.expand-btn');
    
    allDetails.forEach(detail => {
      if (detail.id !== phase + '-details') {
        detail.classList.remove('expanded');
      }
    });
    
    allButtons.forEach(btn => {
      if (btn !== button) {
        btn.classList.remove('expanded');
        const icon = btn.querySelector('i');
        const text = btn.querySelector('span');
        if (icon) icon.style.transform = 'rotate(0deg)';
        if (text) text.textContent = 'View Details';
      }
    });
    
    // Toggle the clicked one
    const isExpanded = details.classList.contains('expanded');
    
    if (isExpanded) {
      details.classList.remove('expanded');
      button.classList.remove('expanded');
      const icon = button.querySelector('i');
      const text = button.querySelector('span');
      if (icon) icon.style.transform = 'rotate(0deg)';
      if (text) text.textContent = 'View Details';
    } else {
      details.classList.add('expanded');
      button.classList.add('expanded');
      const icon = button.querySelector('i');
      const text = button.querySelector('span');
      if (icon) icon.style.transform = 'rotate(180deg)';
      if (text) text.textContent = 'Hide Details';
      
      // Smooth scroll to details after expansion
      setTimeout(() => {
        details.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 300);
    }
  }
}

function initializeProcessDetails() {
  // Add event listeners for process detail toggles
  const expandButtons = document.querySelectorAll('.expand-btn');
  
  expandButtons.forEach(button => {
    // Extract phase from parent card's data attribute
    const card = button.closest('.process-card');
    if (card) {
      const phase = card.getAttribute('data-phase');
      if (phase) {
        button.addEventListener('click', () => toggleProcessDetails(phase));
      }
    }
  });
  
  // Add keyboard accessibility
  expandButtons.forEach(button => {
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });
}

/* ===============================
   4. STORY PLAYBACK FUNCTIONALITY
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

/* ===== SHOW STORY MODAL =====
   Creates and displays a modal with the full story content
   @param {String} storyId - ID of the story to display
*/
function showStoryModal(storyId) {
  // ===== STORY CONTENT DATABASE =====
  // Contains all story data (title, author, text, images, tags)
  const stories = {
    breakthrough: {
      title: "🚤 When the Waters Turned",
      author: ", Core Member",
      fullText: `We thought we had it figured out.
After weeks of prototypes — from foam floats to sleek carbon shells — we had a lineup of RC boats that looked fast, felt powerful, and screamed potential.
Except for one thing: the turn.

No matter how hard we pushed, the turning radius just wouldn’t tighten. We'd glide fast, but wide — too wide. And while some of us kept tweaking rudder angles, others simply practiced longer, adapting to the curve.

It was fine. Not perfect, but fine.

And then, just a week before we were set to leave for IIT Bombay 🧳 — when the tension was high and changes seemed too risky — something happened.

Two quiet members from our boat squad, working mostly under the radar, rolled out a fresh design.
No noise. No fuss. Just precision.

The new boat was leaner, lighter, and cut through turns like it was reading our minds.
It didn’t just handle better — it flipped our mindset.

While we were working to fix a problem, they had quietly reimagined the solution.
That boat didn’t just corner tight.
It cornered everything we thought we knew. 🌊⚙️

`,
      image: "Assets/images/Robots/Story/Sail.jpg",
      timestamp: "9:00 PM - March 15th, 2024",
      tags: ["Debugging", "Breakthrough", "Teamwork"]
    },
    learning: {
      title: "🚫 No Backup. No Victory.",
      author: "Ashutosh Maske, Mentor",
      fullText: `The night before Technex, around 7 PM, what was meant to be a final check turned into a moment we’ll never forget. During testing at our college, our most reliable bot — the one that had powered through every challenge over the past six months — suddenly slammed into an iron chair while reversing.

In an instant, its acrylic chassis cracked from the front-right. The damage was irreversible. With no way to rejoin the broken parts and no backup ready, panic quickly replaced confidence.

We had trusted that bot like a teammate. But in that trust, we’d overlooked routine checkups. The constant wear had taken its toll, silently weakening it — and we failed to notice.

That night, a few of us stayed up working tirelessly, trying to salvage what we could. But no quick fix could undo months of fatigue or our lack of preparation.

We couldn’t give our best at Overdrive. And we didn’t win.

But that loss became a turning point. It taught us what no victory ever could: that reliability isn’t just built — it’s maintained. And that behind every successful run lies discipline, foresight, and a team that learns from its setbacks.

`,
      image: "assets/images/Robots/Story/Acrylic.png",
      timestamp: "8:00 PM - January 19th, 2025",
      tags: ["Learning", "Failure", "Growth"]
    },
    teamwork: {
      title: "⚙️ From Chaos to Combat",
      author: "Amit, Team Captain",
      fullText: `When we stepped into BITS Pilani Goa for Quark 2025, we were already racing the clock.
Not a single bot was ready — and three events were just hours away: Robo Race 🏎️, Robo Soccer ⚽, and Robo Sumo 🤖.

But this time, we didn’t panic.
We remembered what went wrong before — when poor coordination and missing backups had cost us dearly 🧠.
We’d promised ourselves: never again.

So we built — together 🤝.
Some shaped claws for Soccer, others carved wedges for Sumo, some worked endlessly on motor assemblies 🔧.
Hours blurred 🌙. Palms ached. But the team held strong.

When the arenas opened, we entered all three 💥.
We fought hard in Race and Soccer. But in Robo Sumo, our bot stood its ground — and brought home 🥉 3rd place.

We didn’t just build machines that night.
We built trust, confidence — and a team we could finally be proud of 💪. `,
      image: "assets/images/Robots/Story/Quark.jpg",
      timestamp: "4:45 PM - February 10th, 2024",
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

function initializeStoryPlayback() {
  // Add click handlers for story cards
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
// ===== FOR FUTURE USE =====
// ===== TOOL SHOWCASE FUNCTIONALITY =====
// // Handles tool category switching and details display
// function switchToolCategory(category) {
//   // Update active tab
//   const tabs = document.querySelectorAll('.tool-tab');
//   tabs.forEach(tab => {
//     tab.classList.remove('active');
//     if (tab.getAttribute('data-category') === category) {
//       tab.classList.add('active');
//     }
//   });
  
//   // Update active content
//   const contents = document.querySelectorAll('.tool-category-content');
//   contents.forEach(content => {
//     content.classList.remove('active');
//     if (content.id === category + '-tools') {
//       content.classList.add('active');
//     }
//   });
  
//   // Add smooth transition effect
//   const activeContent = document.querySelector('.tool-category-content.active');
//   if (activeContent) {
//     activeContent.style.opacity = '0';
//     setTimeout(() => {
//       activeContent.style.opacity = '1';
//     }, 150);
//   }
// }

// function showToolDetails(toolId) {
//   // Tool information database - customize for your actual tools
//   const toolDetails = {
//     solidworks: {
//       name: "SolidWorks 2024",
//       description: "Professional 3D CAD software for mechanical design",
//       website: "https://www.solidworks.com",
//       features: ["3D Modeling", "Assembly Design", "Simulation", "Rendering"],
//       usedFor: "Robot chassis design, mechanism modeling, stress analysis"
//     },
//     fusion360: {
//       name: "Fusion 360",
//       description: "Cloud-based 3D CAD/CAM/CAE platform",
//       website: "https://www.autodesk.com/products/fusion-360",
//       features: ["Integrated CAD/CAM", "Cloud Collaboration", "Simulation"],
//       usedFor: "Collaborative design, manufacturing preparation"
//     },
//     arduino: {
//       name: "Arduino IDE",
//       description: "Integrated development environment for Arduino boards",
//       website: "https://www.arduino.cc",
//       features: ["Code Editor", "Library Manager", "Serial Monitor"],
//       usedFor: "Microcontroller programming, sensor integration"
//     },
//     python: {
//       name: "Python",
//       description: "High-level programming language for AI and automation",
//       website: "https://www.python.org",
//       features: ["Machine Learning", "Computer Vision", "Data Analysis"],
//       usedFor: "AI algorithms, image processing, automation scripts"
//     },
//     gazebo: {
//       name: "Gazebo Simulator",
//       description: "3D robotics simulation environment",
//       website: "http://gazebosim.org",
//       features: ["Physics Simulation", "Sensor Modeling", "Multi-robot"],
//       usedFor: "Robot testing, algorithm validation, virtual competitions"
//     },
//     matlab: {
//       name: "MATLAB",
//       description: "Technical computing platform for analysis and design",
//       website: "https://www.mathworks.com/products/matlab.html",
//       features: ["Mathematical Modeling", "Data Analysis", "Visualization"],
//       usedFor: "Control system design, signal processing, data analysis"
//     }
//   };
  
//   const tool = toolDetails[toolId];
//   if (!tool) return;
  
//   // Create tool details modal
//   const modalHTML = `
//     <div class="tool-modal-overlay" onclick="closeToolModal()">
//       <div class="tool-modal" onclick="event.stopPropagation()">
//         <button class="tool-modal-close" onclick="closeToolModal()">
//           <i class="fas fa-times"></i>
//         </button>
//         <div class="tool-modal-header">
//           <h3>${tool.name}</h3>
//           <p>${tool.description}</p>
//           <a href="${tool.website}" target="_blank" class="tool-website-link">
//             <i class="fas fa-external-link-alt"></i> Visit Website
//           </a>
//         </div>
//         <div class="tool-modal-content">
//           <div class="tool-modal-section">
//             <h4>Key Features</h4>
//             <ul class="tool-features-list">
//               ${tool.features.map(feature => `<li>${feature}</li>`).join('')}
//             </ul>
//           </div>
//           <div class="tool-modal-section">
//             <h4>How We Use It</h4>
//             <p>${tool.usedFor}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   `;
  
//   // Add modal to page
//   document.body.insertAdjacentHTML('beforeend', modalHTML);
  
//   // Add entrance animation
//   const modal = document.querySelector('.tool-modal-overlay');
//   setTimeout(() => {
//     modal.style.opacity = '1';
//     modal.querySelector('.tool-modal').style.transform = 'scale(1)';
//   }, 10);
// }

// function closeToolModal() {
//   const modal = document.querySelector('.tool-modal-overlay');
//   if (modal) {
//     modal.style.opacity = '0';
//     modal.querySelector('.tool-modal').style.transform = 'scale(0.9)';
//     setTimeout(() => {
//       modal.remove();
//     }, 300);
//   }
// }

// function initializeToolShowcase() {
//   // Add click handlers for tool tabs
//   const toolTabs = document.querySelectorAll('.tool-tab');
//   toolTabs.forEach(tab => {
//     tab.addEventListener('click', () => {
//       const category = tab.getAttribute('data-category');
//       if (category) {
//         switchToolCategory(category);
//       }
//     });
    
//     // Add keyboard accessibility
//     tab.addEventListener('keydown', (e) => {
//       if (e.key === 'Enter' || e.key === ' ') {
//         e.preventDefault();
//         tab.click();
//       }
//     });
//   });
  
//   // Add click handlers for tool detail buttons
//   const toolDetailButtons = document.querySelectorAll('.tool-details-btn');
//   toolDetailButtons.forEach(button => {
//     const toolCard = button.closest('.tool-card');
//     if (toolCard) {
//       const toolId = toolCard.getAttribute('data-tool');
//       if (toolId) {
//         button.addEventListener('click', (e) => {
//           e.stopPropagation();
//           showToolDetails(toolId);
//         });
//       }
//     }
//   });
  
//   // Add escape key handler for tool modal
//   document.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape') {
//       closeToolModal();
//     }
//   });
// }

// ===== RESPONSIVE FEATURES =====
// Handle responsive behavior for mobile devices
function initializeResponsiveFeatures() {
  // Handle tool category switching on mobile
  function handleMobileToolTabs() {
    const toolTabs = document.querySelectorAll('.tool-tab');
    
    if (window.innerWidth <= 768) {
      // Make tabs scrollable on mobile
      const tabsContainer = document.querySelector('.tool-tabs');
      if (tabsContainer) {
        tabsContainer.style.overflowX = 'auto';
        tabsContainer.style.scrollBehavior = 'smooth';
      }
    }
  }
  
  // Handle story card interactions on mobile
  function handleMobileStoryCards() {
    const storyCards = document.querySelectorAll('.story-card');
    
    storyCards.forEach(card => {
      if (window.innerWidth <= 768) {
        // Add touch feedback
        card.addEventListener('touchstart', () => {
          card.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', () => {
          setTimeout(() => {
            card.style.transform = '';
          }, 200);
        });
      }
    });
  }
  
  // Initialize responsive features
  handleMobileToolTabs();
  handleMobileStoryCards();
  
  // Re-initialize on window resize
  window.addEventListener('resize', debounce(() => {
    handleMobileToolTabs();
    handleMobileStoryCards();
  }, 250));
}

// ===== UTILITY FUNCTIONS =====
// Helper functions for smooth interactions
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

// Add scroll animations for Behind the Build elements
function initializeBehindBuildAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Add staggered animation for grid items
        if (entry.target.classList.contains('process-card')) {
          const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
          entry.target.style.animationDelay = (index * 0.2) + 's';
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe all animatable elements in Behind the Build section
  const animatableElements = document.querySelectorAll('#behind-build .animate-on-scroll');
  animatableElements.forEach(el => observer.observe(el));
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeBehindBuildAnimations();
});


// ===== BACK TO TOP BUTTON FUNCTIONALITY =====
function initializeBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  
  // Show/hide button based on scroll position
  function toggleBackToTopButton() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  
  // Smooth scroll to top when clicked
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  // Event listeners
  window.addEventListener('scroll', toggleBackToTopButton);
  backToTopBtn.addEventListener('click', scrollToTop);
  
  // Optional: Add keyboard support
  backToTopBtn.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add this to your existing initialization
  initializeBackToTop();
});

