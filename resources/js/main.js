/* @class for toggling a HTML class of an element based on scroll position */
class toggleClassObserver {
  /**
   * @param {object} elementOptions - An object containing the the CSS selectors of the elements to control
   * @param {string} elementOptions.elToObserve - A string in the form of a CSS selector to get the element(s) to Observe
   * @param {string} elementOptions.classToToggle - A string specifying the class to be toggled
   * @param {boolean} [elementOptions.keepToggling=false] - Provide true to toggle the class on and off based on observer
   * @param {string} [elementOptions.targetElement] - The element to apply the class to. Optional - provide if different from elToObserve
   * @param {object} observerOptions - An object containing configuration for the intersection observer
   */
  constructor(elementOptions, observerOptions) {
    this.elToObserve = document.querySelectorAll(elementOptions.elToObserve);
    this.classToToggle = elementOptions.classToToggle;

    this.targetElement = elementOptions.targetElement
      ? document.querySelector(elementOptions.targetElement)
      : null;
    this.keepToggling = elementOptions.keepToggling
      ? elementOptions.keepToggling
      : false;
    this.observeroptions = observerOptions;
    // Binds
    this.createObserver = this.createObserver.bind(this);
    this.handleIntersect = this.handleIntersect.bind(this);
    // this.getAbsYCoords = this.getAbsYCoords.bind(this);
    this.init = this.init.bind(this);
  }

  createObserver() {
    if (this.targetElement) {
      let observer = new IntersectionObserver(
        this.handleIntersect,
        this.observeroptions
      );
      observer.observe(this.targetElement);
    } else {
      // For each element to observe, create an observer and pas it the element
      for (let el of this.elToObserve) {
        let observer = new IntersectionObserver(
          this.handleIntersect,
          this.observeroptions
        );
        observer.observe(el);
      }
    }
  }

  // Callback to Run on intersect
  handleIntersect(target) {
    if (target && target[0].intersectionRatio > 0.3) {
      if (this.keepToggling) {
        target[0].target.classList.toggle(this.classToToggle);
      } else {
        target[0].target.classList.remove(this.classToToggle);
        target[0].target.classList.add(this.classToToggle);
      }
    }
  }

  init() {
    this.createObserver();
  }
}

/* @class for handling nav bar behaviour */
class MobileNavController {
  /**
   * @param  {string} navElement - The element to apply the class to
   * @param  {string} toggleNavVisibilityClass - A string specifying the class to be toggled
   */
  constructor(navData, observerOptions) {
    this.nav = document.querySelector(navData.nav);
    this.navBar = document.querySelector(navData.navBar);
    this.navMobileMenuIcon = document.querySelector(navData.navMobileMenuIcon);
    this.navOptions = document.querySelector(navData.navOptions);

    this.navInitHeight = this.nav.offsetHeight;
    this.navBarInitHeight = this.navBar.offsetHeight;
    this.navOptionsInitHeight = this.navOptions.offsetHeight;
    this.navOptionsState = 0;
    this.observeroptions = observerOptions;

    // Binds
    this.toggleMobileNavVisibility = this.toggleMobileNavVisibility.bind(this);
    this.toggleDesktopNavVisibility =
      this.toggleDesktopNavVisibility.bind(this);
    this.hideNavOptions = this.hideNavOptions.bind(this);
    this.toggleNavOptions = this.toggleNavOptions.bind(this);
  }

  mobileInit() {
    const _ = this;

    let initialMidViewportHeight = window.innerHeight / 2;
    _.toggleMobileNavVisibility(initialMidViewportHeight);

    // Bind toggleNavOptions to mobileMenuIcon
    this.navMobileMenuIcon.addEventListener('click', _.toggleNavOptions);

    // Bind each link within the nav
    this.bindNavOptions();
  }

  desktopInit() {
    const _ = this;
    window.addEventListener('scroll', _.toggleDesktopNavVisibility);
    // this.toggleDesktopNavVisibility();
  }

  toggleMobileNavVisibility(MidViewportHeight) {
    let currentTopViewportHeight = window.pageYOffset;
    let initialMidViewportHeight = MidViewportHeight;

    // If the user has scrolled down, chech if the user has scrolled over the first half of the screen
    if (currentTopViewportHeight > initialMidViewportHeight) {
      // If nav is opened, use the sum of navBar and navOptions
      if (this.navOptionsState)
        this.nav.style.height = `${
          this.navBarInitHeight + this.navOptionsInitHeight
        }px`;

      this.hideNavOptions();

      this.nav.style.opacity = 1;
    } else {
      this.nav.style.height = `max-content`;

      // Hide nav options
      this.hideNavOptions();
    }
  }

  toggleDesktopNavVisibility() {
    const _ = this; // Bind this for use in setTimeout
    const topWindowHeight = window.pageYOffset;

    // If the user has scrolled down
    if (topWindowHeight > 10) {
      this.nav.style.height = `${this.navInitHeight}px`;
    } else {
      this.nav.style.height = '0px';
    }
  }

  hideNavOptions() {
    const _ = this; // Bind this for use in setTimeout
    // Remove class from menu icon
    this.navMobileMenuIcon.classList.remove('rotate');
    // Hide Nav Option
    this.navOptions.style.height = `${this.navOptions.offsetHeight}px`;

    window.setTimeout(function () {
      _.navOptions.style.height = '0px';
    }, 100);

    // this.navOptions.style.padding = '0px';
    window.setTimeout(function () {
      _.navOptions.style.display = 'none';
    }, 200);

    // Update menu state
    this.navOptionsState = 0;
  }

  showNavOptions() {
    const _ = this;

    this.navBar.style.height = this.navBarInitHeight + 'px';
    // Add rotate class to menu icon
    this.navMobileMenuIcon.classList.add('rotate');

    // Set nav heith to max content so that it grows with nav options
    this.nav.style.height = 'max-content';
    this.navOptions.style.opacity = 1;

    // Show nav options
    window.setTimeout(function () {
      _.navOptions.style.height = `${_.navOptionsInitHeight}px`;
      console.log(_.navOptions.offsetHeight);
    }, 1);

    window.setTimeout(function () {
      _.navOptions.style.height = 'max-content';
    }, 150);

    this.navOptions.style.display = 'flex';
    // Update menu state
    this.navOptionsState = 1;
  }

  toggleNavOptions() {
    if (this.navOptionsState) this.hideNavOptions();
    else this.showNavOptions();
  }

  // Bind nav options to click events so that the options nav closes
  bindNavOptions() {
    const _ = this;
    const links = this.navOptions.querySelectorAll('a');

    for (let link of links) {
      link.addEventListener('click', _.hideNavOptions);
    }
  }

  createObserver() {
    const _ = this;
    let initialMidViewportHeight = window.innerHeight / 2;

    let intObserver = new IntersectionObserver(function () {
      _.toggleMobileNavVisibility(initialMidViewportHeight);
    }, this.observeroptions);
    intObserver.observe(document.querySelector('#header__intro'));
  }
}

/* @class for handling smooth scroll to on page element */
class IndexToIdSmoothScroll {
  /**
   * @param {string} indexContainer - A string in the form of a CSS selector to get the elements containing the anchor links
   *
   **/
  constructor(indexContainer) {
    this.indexContainer = document.querySelector(indexContainer);
    // Bindings
    this.handleClick = this.handleClick.bind(this);
  }

  offset(el) {
    let rect = el.getBoundingClientRect(),
      scrollTop = window.pageYOffset;
    return { top: rect.top + scrollTop };
  }

  handleClick(e) {
    // Prevent Link from suddently scroll to the target id
    e.preventDefault();

    const targetElementId = e.target.href.match(/\#.*/);
    const targetElement = document.querySelector(targetElementId);

    // Get TargetElement Scroll height
    const elScrollHeight = this.offset(targetElement).top;

    // Scroll to element smoothly
    scrollTo({ left: 0, top: elScrollHeight - 100, behavior: 'smooth' });
  }

  bindIndexLinks() {
    const links = this.indexContainer.querySelectorAll('a[href*="#"]');
    // Loop over Links
    for (let link of links) {
      link.addEventListener('click', this.handleClick);
    }
  }

  init() {
    this.bindIndexLinks();
  }
}

// /* @class for toggling visibility of an element based on scroll position */
class VisibilityObserver {
  /**
   * @param  {string} elToObserve - A string in the form of a CSS selector to get the element to Observe
   * @param  {string} classToToggle - A string specifying the class to be toggled
   * @param  {string} [targetElement] - The element to apply the class to. Optional - provide if different from elToObserve
   * @param  {object} observerOptions - An object containing configuration for the intersection observer
   */
  constructor(elToObserve, classToToggle, targetElement, observerOptions) {
    this.elToObserve = document.querySelector(elToObserve);
    this.targetElement =
      typeof targetElement !== 'undefined'
        ? document.querySelector(targetElement)
        : this.elToObserve;

    this.classToToggle = classToToggle;
    this.elRelPos = this.elToObserve.getBoundingClientRect();
    this.elAbsPos = this.getAbsYCoords();
    this.observeroptions = observerOptions;
    // Binds
    this.createObserver = this.createObserver.bind(this);
    this.handleIntersect = this.handleIntersect.bind(this);
    this.getAbsYCoords = this.getAbsYCoords.bind(this);
    this.init = this.init.bind(this);
  }

  init() {
    this.createObserver();
  }

  createObserver() {
    let intObserver = new IntersectionObserver(
      this.handleIntersect,
      this.observeroptions
    );
    intObserver.observe(this.elToObserve);
  }

  // get elToObserve coordinates relative to the document
  getAbsYCoords() {
    return {
      top: this.elRelPos.top + window.pageYOffset,
      bottom: this.elRelPos.bottom + window.pageYOffset,
    };
  }

  // Callback to Run on intersect
  handleIntersect() {
    const _ = this; // Bind this for use in setTimeout
    const topWindowHeight = window.pageYOffset;
    const elToObserveMiddle =
      this.elAbsPos.top + (this.elAbsPos.bottom - this.elAbsPos.top) / 2;

    // if the top of the element is higher than the top of window height
    if (topWindowHeight > elToObserveMiddle) {
      this.targetElement.classList.add(this.classToToggle);
      window.setTimeout(function () {
        _.targetElement.style.opacity = '1';
      }, 600);
    } else {
      this.targetElement.style.opacity = '0';
      window.setTimeout(function () {
        _.targetElement.classList.remove(_.classToToggle);
      }, 200);
    }
  }
}

/* @class for adding and removing a html class on an element when an event occur */
class ClassHandler {
  /**
   * @param {object} elementOptions - An object containing the class options
   * @param {string} elementOptions.element - A string in the form of a CSS selector to get the target element
   * @param {string} elementOptions.event - A string representing the event to listen for
   * @param {string} elementOptions.classToToggle - A string specifying the class to be toggled
   * @param {boolean} [elementOptions.keepToggling=false] - Provide true to toggle the class on and off based on observer
   *
   **/
  constructor(elementOptions) {
    this.targetElements = document.querySelectorAll(elementOptions.element);
    this.classToToggle = elementOptions.classToToggle;
    this.event = elementOptions.event;
    this.keepToggling = elementOptions.keepToggling
      ? elementOptions.keepToggling
      : false;
    // Bindings
    this.handleEvent = this.handleEvent.bind(this);
    this.addlistener = this.addlistener.bind(this);
    this.init = this.init.bind(this);
  }

  handleEvent(e) {
    const targetElement = e.target;
    if (this.keepToggling) {
      targetElement.classList.toggle(this.classToToggle);
    } else {
      targetElement.classList.add(this.classToToggle);
    }
  }

  addlistener() {
    for (let el of this.targetElements) {
      el.addEventListener(this.event, this.handleEvent);
    }
  }

  init() {
    this.addlistener();
  }
}

/* @class to handle hadings animation */
class HaedingsAnimationController {
  /**
   * @param {Object[]}  data - An array containing objects with information on each heading to animate
   * @param {...Object} data[] - An object containing information on each heading to animate
   * @param {string}    data[].elementToObserve - Element to pass to the intersection observer
   * @param {string}    data[].elementTargeted A string in the form of a CSS selector to get the element to Observe
   * @param {string}    data[].classToAdd - A string specifying the class to be added for animation
   *
   **/
  constructor(data) {
    this.data = data;
  }

  init() {
    const _ = this;
    // Loop through the heading data
    this.data.forEach(function (el) {
      let elementToObserve = document.querySelector(el.elementToObserve);
      let elementTargeted = document.querySelector(el.elementTargeted);
      let classToAdd = el.classToAdd;
      console.log(el.elementTargeted);
      // Make targeted Elements not visible
      elementTargeted.style.opacity = 0;

      _.createObserver(elementToObserve, elementTargeted, classToAdd);
    });
  }

  createObserver(elementToObserve, elementTargeted, classToAdd) {
    const _ = this;

    let thresholds = [];
    for (let i = 10; i <= 100; i++) thresholds.push((i / 100).toFixed(2));

    let observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: thresholds,
    };

    let intObserver = new IntersectionObserver(function () {
      _.handleIntersect(elementTargeted, classToAdd);
    }, observerOptions);
    intObserver.observe(elementToObserve);
  }

  handleIntersect(elementTargeted, classToAdd) {
    let elementTargetedAbsPosition = this.getAbsYCoords(elementTargeted);
    let topOfviewport = window.pageYOffset;
    let bottomOfviewport = window.innerHeight + topOfviewport;

    // Only add class if the targeted element is between is visible
    if (
      elementTargetedAbsPosition.top > topOfviewport &&
      elementTargetedAbsPosition.top < bottomOfviewport
    ) {
      elementTargeted.classList.add(classToAdd);
    }
  }

  // get elToObserve coordinates relative to the document
  getAbsYCoords(element) {
    let elRelPos = element.getBoundingClientRect();
    return {
      top: elRelPos.top + window.pageYOffset,
      bottom: elRelPos.bottom + window.pageYOffset,
    };
  }
}

/* @class for activating slider arrows on dekstop */
class horizontalScrollController {
  /**
   * @param {object} options - An object containing the the CSS selectors of the elements to control
   * @param {string} options.galleries - A string in the form of a CSS selector to get the element to scroll
   * @param {string} [options.minDeviceWidth] - A string specifying a minimum (included) device width in px above which build controllers
   * 
   **/
  constructor(options) {
      this.galleriesNodes = document.querySelectorAll(options.galleries);
      this.minDeviceWidth = options.minDeviceWidth ? options.minDeviceWidth.replace('px', '') : undefined;
      this.galleriesData = [];

      // Binding
      this.scrollRight = this.scrollRight.bind(this);
      this.scrollLeft = this.scrollLeft.bind(this);
      this.buildScrollControllers = this.buildScrollControllers.bind(this);
      this.init = this.init.bind(this);
  }

  buildGalleriesData(galleriesNodes) {
      for (const el of (galleriesNodes ? galleriesNodes : this.galleriesNodes)) {
          const gData = {};
          gData.clickCounter = 0;
          gData.childrenCount = el.querySelectorAll('.gallery-item:not(.hide)').length;
          gData.galleryNode = el;
          gData.visibleItems = parseInt(gData.galleryNode.offsetWidth / gData.galleryNode.firstElementChild.offsetWidth);
          this.galleriesData.push(gData);
      }
  }

  buildScrollControllers() {
      const _ = this;

      for (const gData of this.galleriesData) {
          const { clickCounter, childrenCount, visibleItems, galleryNode } = gData;

          // If a text Gallery, don't build controllers
          if (galleryNode.parentNode.classList.contains('text-filter-gallery')) continue;

          // If the gallery doesn't have overflowed elements, no controllers are needed
          if (childrenCount === visibleItems) continue;

          // Bild the controllers
          // If there are elements hidden on the left, add left controller
          if (clickCounter > 0 && childrenCount > visibleItems) {
              const leftController = this.buildLeftController(galleryNode);

              // Add left scroll
              leftController.addEventListener('click', function () { _.scrollLeft(gData) });

              galleryNode.appendChild(leftController);
          }

          // If there are elements hidden on the right, add right controller
          if (childrenCount > visibleItems) {
              const rightController = this.buildRightController(galleryNode);

              // Add rigth scroll
              rightController.addEventListener('click', function () { _.scrollRight(gData) });

              galleryNode.appendChild(rightController);
          }
      }
  }

  destroyScrollControllers(galleries) {
      for (let gallery of galleries) {
          const controllers = gallery.querySelectorAll('.arrow');
          for (let controller of controllers) controller.parentNode.removeChild(controller);
      }

      // Clear galleries list
      this.galleriesData = [];
  }

  handleControllersOnScroll(gData) {
    console.log(gData);
      const _ = this;

      const { galleryNode, clickCounter, childrenCount, visibleItems } = gData;

      // Get the existing controllers
      let rightController = galleryNode.querySelector('.scroll-right');
      let leftController = galleryNode.querySelector('.scroll-left');

      // If a left controller already exists and there aren't elements overflowed on the left
      if (leftController && clickCounter === 0) {
          // Remove left controller
          leftController.parentNode.removeChild(leftController);

          // If a left controller doesn't exists and there are elements overflowed on the left
      } else if (!leftController && clickCounter > 0) {
          // Build Left Controller
          leftController = this.buildLeftController(galleryNode);
          galleryNode.appendChild(leftController);

          // Add left scroll Event
          leftController.addEventListener('click', function () { _.scrollLeft(gData) });
      }

      // If a right controller already exists and there aren't elements overflowed on the right
      if (rightController && clickCounter === childrenCount - visibleItems) {

          // Remove right controller
          rightController.parentNode.removeChild(rightController)

          // If a right controller doesn't exists and there are elements overflowed on the right
      } else if (!rightController && clickCounter < childrenCount) {
          // Build right Controller
          rightController = this.buildRightController(galleryNode);
          galleryNode.appendChild(rightController);

          // Add right scroll Event
          rightController.addEventListener('click', function () { _.scrollRight(gData) });
      }
  }

  handleControllersOnResize() {
      // Recalculate on window resize
      const _ = this;
      window.addEventListener('resize', function () {
          for (const gData of _.galleriesData) {
              _.handleControllersOnScroll(gData)
          }
      })
  }

  buildRightController(gallery) {
      const xmlns = 'http://www.w3.org/2000/svg';

      const span = document.createElement('span');
      const galleryImgHeight = gallery.firstElementChild.querySelector('img').offsetHeight;

      this.setAttributes(span, { 'style': `top: ${galleryImgHeight / 2}px` });
      span.classList.add('arrow', 'scroll-right');

      const svg = document.createElementNS(xmlns, 'svg');
      this.setAttributesNS(svg, {
          'viewBox': "0 0 10 10",
          'role': "img",
          'aria-label': "Next",
      });

      const polyline = document.createElementNS(xmlns, 'polyline');
      this.setAttributesNS(polyline, {
          'points': "4,1 7,5 4,9",
          'fill': 'none',
          'stroke': 'black'
      });

      svg.appendChild(polyline);
      span.appendChild(svg);

      return span;
  }

  buildLeftController(gallery) {
      const xmlns = 'http://www.w3.org/2000/svg';

      const span = document.createElement('span');
      const galleryImgHeight = gallery.firstElementChild.querySelector('img').offsetHeight;

      this.setAttributes(span, { 'style': `top: ${galleryImgHeight / 2}px` });
      span.classList.add('arrow', 'scroll-left');

      const svg = document.createElementNS(xmlns, 'svg');
      this.setAttributesNS(svg, {
          'viewBox': "0 0 10 10",
          'role': "img",
          'aria-label': "Previous",
      });

      const polyline = document.createElementNS(xmlns, 'polyline');
      this.setAttributesNS(polyline, {
          'points': "7,1 4,5 7,9",
          'fill': 'none',
          'stroke': 'black'
      });

      svg.appendChild(polyline);
      span.appendChild(svg);

      return span;
  }

  handleControllersOnSwipe() {
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;                                                        
    var yDown = null;

    function getTouches(evt) {
      return evt.touches
    }                                                     
                                                                            
    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                
                                                                            
    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
                                                                            
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                /* right swipe */ 
            } else {
                /* left swipe */
            }                       
        } else {
            if ( yDiff > 0 ) {
                /* down swipe */ 
            } else { 
                /* up swipe */
            }                                                                 
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };
  }

  scrollRight(gData) {
      // Get Gallery Elements width
      const galleryItemWidth = gData.galleryNode.firstElementChild.offsetWidth;

      gData.galleryNode.scrollTo({
          top: 0,
          left: Math.ceil(gData.galleryNode.scrollLeft) + galleryItemWidth,
          behavior: 'smooth'
      });

      // Increase Counter
      if (gData.clickCounter < gData.childrenCount) gData.clickCounter++;

      this.handleControllersOnScroll(gData);

  }

  scrollLeft(gData) {
      // Get Gallery Elements width
      const galleryItemWidth = gData.galleryNode.firstElementChild.offsetWidth;

      gData.galleryNode.scrollTo({
          top: 0,
          left: Math.ceil(gData.galleryNode.scrollLeft) - galleryItemWidth,
          behavior: 'smooth'
      });

      // Decrease Counter
      if (gData.clickCounter > 0) gData.clickCounter--;

      this.handleControllersOnScroll(gData);
  }

  setAttributesNS(el, attrs) {
      for (var key in attrs) {
          el.setAttributeNS(null, key, attrs[key]);
      }
  }

  setAttributes(el, attrs) {
      for (var key in attrs) {
          el.setAttribute(key, attrs[key]);
      }
  }

  init() {
    // If no minimum width provided, always build controllers
    if (!this.minDeviceWidth) {
        this.buildGalleriesData();
        this.buildScrollControllers();
        this.handleControllersOnResize();
        // if provided, only build controllers if current screen width is >= than minimum width provided
    } else if (window.offSetWidth >= this.minDeviceWidth) {
        this.buildGalleriesData();
    }
  }
}

window.addEventListener('DOMContentLoaded', function () {
  let thresholds = [];
  for (let i = 0; i <= 100; i++) thresholds.push((i / 100).toFixed(2));

  const navVisibilityController = new MobileNavController(
    {
      nav: 'nav',
      navOptions: '.nav__options',
      navBar: '.nav__bar',
      navMobileMenuIcon: '.nav__mobileMenuIcon',
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: thresholds,
    }
  );

  // Declared in the global scope to be used by other classes
  desktopGalleriesController = new horizontalScrollController({
    galleries: '.gallery-items-container'
  });

  const toggleScrollUpVisibilityController = new VisibilityObserver(
    '#mission',
    'scrollUpShow',
    '.scrollUp',
    {
      root: null,
      rootMargin: '0px',
      threshold: thresholds,
    }
  );

  const headingsAnimationController = new HaedingsAnimationController([
    {
      elementToObserve: 'header',
      elementTargeted: '.header__typedElements',
      classToAdd: 'fadeInLeft',
    },
    {
      elementToObserve: 'header',
      elementTargeted: '.header__imgContainer',
      classToAdd: 'fadeInUp',
    },
    {
      elementToObserve: '#mission',
      elementTargeted: '#mission .container',
      classToAdd: 'fadeInRight',
    },
    {
      elementToObserve: '#about',
      elementTargeted: '#about .container',
      classToAdd: 'fadeInLeft',
    },
    {
      elementToObserve: '#howToBuy',
      elementTargeted: '#howToBuy h2',
      classToAdd: 'fadeInRight',
    },
    {
      elementToObserve: '#howToBuy .howToBuy__item:nth-of-type(1)',
      elementTargeted: '#howToBuy .howToBuy__item:nth-of-type(1)',
      classToAdd: 'fadeInUp',
    },
    {
      elementToObserve: '#howToBuy .howToBuy__item:nth-of-type(2)',
      elementTargeted: '#howToBuy .howToBuy__item:nth-of-type(2)',
      classToAdd: 'fadeInUp',
    },
    {
      elementToObserve: '#howToBuy .howToBuy__item:nth-of-type(3)',
      elementTargeted: '#howToBuy .howToBuy__item:nth-of-type(3)',
      classToAdd: 'fadeInUp',
    },
    {
      elementToObserve: '#howToBuy',
      elementTargeted: '#howToBuy p',
      classToAdd: 'fadeInRight',
    },
    {
      elementToObserve: '#howToBuy',
      elementTargeted: '#howToBuy p',
      classToAdd: 'fadeInRight',
    },
    {
      elementToObserve: '#roadmap',
      elementTargeted: '#roadmap h2',
      classToAdd: 'fadeInRight',
    },
    {
      elementToObserve: '#roadmap',
      elementTargeted: '#roadmap .gallery-item',
      classToAdd: 'fadeInUp',
    },
  ]);

  const indexController = new IndexToIdSmoothScroll('body');
  // Only run on mobile devices
  if (window.innerWidth < 1024) {
    navVisibilityController.mobileInit();
    // toggleScrollUpVisibilityController.init();
  } else {
    navVisibilityController.desktopInit();
    
  }

  desktopGalleriesController.init();

  // Init classes
  indexController.init();
  headingsAnimationController.init();


  // Init Smooth scroll polyfill for Safari, Opera and IE
  !(function () {
    'use strict';
    function o() {
      var o = window,
        t = document;
      if (
        !(
          'scrollBehavior' in t.documentElement.style &&
          !0 !== o.__forceSmoothScrollPolyfill__
        )
      ) {
        var l,
          e = o.HTMLElement || o.Element,
          r = 468,
          i = {
            scroll: o.scroll || o.scrollTo,
            scrollBy: o.scrollBy,
            elementScroll: e.prototype.scroll || n,
            scrollIntoView: e.prototype.scrollIntoView,
          },
          s =
            o.performance && o.performance.now
              ? o.performance.now.bind(o.performance)
              : Date.now,
          c =
            ((l = o.navigator.userAgent),
            new RegExp(['MSIE ', 'Trident/', 'Edge/'].join('|')).test(l)
              ? 1
              : 0);
        (o.scroll = o.scrollTo =
          function () {
            void 0 !== arguments[0] &&
              (!0 !== f(arguments[0])
                ? h.call(
                    o,
                    t.body,
                    void 0 !== arguments[0].left
                      ? ~~arguments[0].left
                      : o.scrollX || o.pageXOffset,
                    void 0 !== arguments[0].top
                      ? ~~arguments[0].top
                      : o.scrollY || o.pageYOffset
                  )
                : i.scroll.call(
                    o,
                    void 0 !== arguments[0].left
                      ? arguments[0].left
                      : 'object' != typeof arguments[0]
                      ? arguments[0]
                      : o.scrollX || o.pageXOffset,
                    void 0 !== arguments[0].top
                      ? arguments[0].top
                      : void 0 !== arguments[1]
                      ? arguments[1]
                      : o.scrollY || o.pageYOffset
                  ));
          }),
          (o.scrollBy = function () {
            void 0 !== arguments[0] &&
              (f(arguments[0])
                ? i.scrollBy.call(
                    o,
                    void 0 !== arguments[0].left
                      ? arguments[0].left
                      : 'object' != typeof arguments[0]
                      ? arguments[0]
                      : 0,
                    void 0 !== arguments[0].top
                      ? arguments[0].top
                      : void 0 !== arguments[1]
                      ? arguments[1]
                      : 0
                  )
                : h.call(
                    o,
                    t.body,
                    ~~arguments[0].left + (o.scrollX || o.pageXOffset),
                    ~~arguments[0].top + (o.scrollY || o.pageYOffset)
                  ));
          }),
          (e.prototype.scroll = e.prototype.scrollTo =
            function () {
              if (void 0 !== arguments[0])
                if (!0 !== f(arguments[0])) {
                  var o = arguments[0].left,
                    t = arguments[0].top;
                  h.call(
                    this,
                    this,
                    void 0 === o ? this.scrollLeft : ~~o,
                    void 0 === t ? this.scrollTop : ~~t
                  );
                } else {
                  if (
                    'number' == typeof arguments[0] &&
                    void 0 === arguments[1]
                  )
                    throw new SyntaxError('Value could not be converted');
                  i.elementScroll.call(
                    this,
                    void 0 !== arguments[0].left
                      ? ~~arguments[0].left
                      : 'object' != typeof arguments[0]
                      ? ~~arguments[0]
                      : this.scrollLeft,
                    void 0 !== arguments[0].top
                      ? ~~arguments[0].top
                      : void 0 !== arguments[1]
                      ? ~~arguments[1]
                      : this.scrollTop
                  );
                }
            }),
          (e.prototype.scrollBy = function () {
            void 0 !== arguments[0] &&
              (!0 !== f(arguments[0])
                ? this.scroll({
                    left: ~~arguments[0].left + this.scrollLeft,
                    top: ~~arguments[0].top + this.scrollTop,
                    behavior: arguments[0].behavior,
                  })
                : i.elementScroll.call(
                    this,
                    void 0 !== arguments[0].left
                      ? ~~arguments[0].left + this.scrollLeft
                      : ~~arguments[0] + this.scrollLeft,
                    void 0 !== arguments[0].top
                      ? ~~arguments[0].top + this.scrollTop
                      : ~~arguments[1] + this.scrollTop
                  ));
          }),
          (e.prototype.scrollIntoView = function () {
            if (!0 !== f(arguments[0])) {
              var l = (function (o) {
                  for (
                    ;
                    o !== t.body &&
                    !1 ===
                      ((e = p((l = o), 'Y') && a(l, 'Y')),
                      (r = p(l, 'X') && a(l, 'X')),
                      e || r);

                  )
                    o = o.parentNode || o.host;
                  var l, e, r;
                  return o;
                })(this),
                e = l.getBoundingClientRect(),
                r = this.getBoundingClientRect();
              l !== t.body
                ? (h.call(
                    this,
                    l,
                    l.scrollLeft + r.left - e.left,
                    l.scrollTop + r.top - e.top
                  ),
                  'fixed' !== o.getComputedStyle(l).position &&
                    o.scrollBy({
                      left: e.left,
                      top: e.top,
                      behavior: 'smooth',
                    }))
                : o.scrollBy({ left: r.left, top: r.top, behavior: 'smooth' });
            } else
              i.scrollIntoView.call(
                this,
                void 0 === arguments[0] || arguments[0]
              );
          });
      }
      function n(o, t) {
        (this.scrollLeft = o), (this.scrollTop = t);
      }
      function f(o) {
        if (
          null === o ||
          'object' != typeof o ||
          void 0 === o.behavior ||
          'auto' === o.behavior ||
          'instant' === o.behavior
        )
          return !0;
        if ('object' == typeof o && 'smooth' === o.behavior) return !1;
        throw new TypeError(
          'behavior member of ScrollOptions ' +
            o.behavior +
            ' is not a valid value for enumeration ScrollBehavior.'
        );
      }
      function p(o, t) {
        return 'Y' === t
          ? o.clientHeight + c < o.scrollHeight
          : 'X' === t
          ? o.clientWidth + c < o.scrollWidth
          : void 0;
      }
      function a(t, l) {
        var e = o.getComputedStyle(t, null)['overflow' + l];
        return 'auto' === e || 'scroll' === e;
      }
      function d(t) {
        var l,
          e,
          i,
          c,
          n = (s() - t.startTime) / r;
        (c = n = n > 1 ? 1 : n),
          (l = 0.5 * (1 - Math.cos(Math.PI * c))),
          (e = t.startX + (t.x - t.startX) * l),
          (i = t.startY + (t.y - t.startY) * l),
          t.method.call(t.scrollable, e, i),
          (e === t.x && i === t.y) || o.requestAnimationFrame(d.bind(o, t));
      }
      function h(l, e, r) {
        var c,
          f,
          p,
          a,
          h = s();
        l === t.body
          ? ((c = o),
            (f = o.scrollX || o.pageXOffset),
            (p = o.scrollY || o.pageYOffset),
            (a = i.scroll))
          : ((c = l), (f = l.scrollLeft), (p = l.scrollTop), (a = n)),
          d({
            scrollable: c,
            method: a,
            startTime: h,
            startX: f,
            startY: p,
            x: e,
            y: r,
          });
      }
    }
    'object' == typeof exports && 'undefined' != typeof module
      ? (module.exports = { polyfill: o })
      : o();
  })();
});
