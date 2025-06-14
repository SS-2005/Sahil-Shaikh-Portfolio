(function() {
  "use strict";

  /**
   * Mobile Navigation Toggle
   */
function toggleMobileNav() {
  const navmenu = document.getElementById('navmenu');
  const toggleBtn = document.querySelector('.mobile-nav-toggle i');
  
  navmenu.classList.toggle('navmenu-show');
  
  // Change icon
  if (toggleBtn.classList.contains('bi-list')) {
    toggleBtn.classList.remove('bi-list');
    toggleBtn.classList.add('bi-x');
  } else {
    toggleBtn.classList.remove('bi-x');
    toggleBtn.classList.add('bi-list');
  }
  
  // Toggle body overflow
  document.body.style.overflow = navmenu.classList.contains('navmenu-show') 
    ? 'hidden' 
    : '';
}

  // Add click event to mobile nav toggle
  document.querySelector('.mobile-nav-toggle')?.addEventListener('click', toggleMobileNav);

  /**
   * Close mobile navigation when clicking on a nav link
   */
  document.querySelectorAll('#navmenu a').forEach(navLink => {
    navLink.addEventListener('click', (e) => {
      // For external links or links to other pages
      if (navLink.href && !navLink.hash) {
        // Show loading state
        document.body.classList.add('page-transition');
        return; // Allow default navigation
      }

      if (window.innerWidth <= 1199) {
        toggleMobileNav();
      }
    });
  });

  /**
   * Page Transition Handling
   */
  document.querySelectorAll('a[href]:not([href^="#"]):not([href^="javascript:"])').forEach(link => {
    link.addEventListener('click', function(e) {
      // Don't intercept if it's a hash link or javascript link
      if (this.hash || this.getAttribute('href').startsWith('javascript:')) return;
      
      e.preventDefault();
      document.body.classList.add('page-transition');
      
      setTimeout(() => {
        window.location.href = this.href;
      }, 300);
    });
  });

  /**
   * Dark Mode Toggle
   */
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    // Check for saved theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
      darkModeToggle.checked = true;
    }
    
    // Listen for toggle
    darkModeToggle.addEventListener('change', function() {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  /**
   * Skills Modal
   */
  const viewMoreBtn = document.getElementById('viewMoreSkills');
  const skillsModal = document.getElementById('skillsModal');
  const closeModal = document.querySelector('.close');
  
  if (viewMoreBtn && skillsModal) {
    viewMoreBtn.addEventListener('click', function() {
      skillsModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
    
    closeModal.addEventListener('click', function() {
      skillsModal.style.display = 'none';
      document.body.style.overflow = '';
    });
    
    window.addEventListener('click', function(event) {
      if (event.target === skillsModal) {
        skillsModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 300);
      }, 300);
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    function toggleScrollTop() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);
  }

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Contact form clear function
   */
  window.clearForm = function() {
    document.getElementById("contactForm").reset();
  }

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );
      new Swiper(swiperElement, config);
    });
  }
  window.addEventListener("load", initSwiper);

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');
  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  // Smooth scroll to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
})();
