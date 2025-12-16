/**
 * Central Nex Software House - Main JavaScript File
 * Version 1.2.0 - Added enhanced form submission with FormSubmit.co
 */

document.addEventListener('DOMContentLoaded', function () {
    // ============================
    // Global Variables
    // ============================
    let currentCaseIndex = 0;
    let currentTestimonialIndex = 0;
    let testimonialAutoAdvance;
    let isCubeSpinning = true;
    let isDarkTheme = true;

    // ============================
    // Fix for Modal Scrollbar Issue
    // ============================
    const originalBodyPadding = document.body.style.paddingRight;
    const navbar = document.getElementById('mainNavbar');

    // Store original navbar width
    const originalNavbarWidth = navbar ? navbar.offsetWidth : null;

    // Fix for Bootstrap modal opening
    document.addEventListener('show.bs.modal', function () {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        if (scrollbarWidth > 0) {
            // Add padding to body to prevent shift
            document.body.style.paddingRight = scrollbarWidth + 'px';

            // Add padding to navbar to prevent shift
            if (navbar) {
                navbar.style.paddingRight = scrollbarWidth + 'px';
            }

            // Fix for fixed elements
            document.querySelectorAll('.fixed-top, .fixed-bottom').forEach(el => {
                el.style.paddingRight = scrollbarWidth + 'px';
            });
        }

        // Add modal-open class to body
        document.body.classList.add('modal-open');
    });

    // Fix for Bootstrap modal closing
    document.addEventListener('hidden.bs.modal', function () {
        // Reset body padding
        document.body.style.paddingRight = originalBodyPadding;

        // Reset navbar padding
        if (navbar) {
            navbar.style.paddingRight = '';
        }

        // Reset fixed elements
        document.querySelectorAll('.fixed-top, .fixed-bottom').forEach(el => {
            el.style.paddingRight = '';
        });

        // Remove modal-open class
        document.body.classList.remove('modal-open');
    });

    // ============================
    // Theme Toggle Functionality
    // ============================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    const darkLogos = document.querySelectorAll('.dark-logo');
    const lightLogos = document.querySelectorAll('.light-logo');

    // Check for saved theme preference or prefer-color-scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('centralnex-theme');

    if (savedTheme) {
        isDarkTheme = savedTheme === 'dark';
    } else {
        isDarkTheme = prefersDarkScheme.matches;
    }

    // Apply initial theme
    applyTheme();

    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            isDarkTheme = !isDarkTheme;
            applyTheme();
            saveThemePreference();
            updateLogoDisplay();
            closeNavbarOnMobile();
        });
    }
    //  function to close navbar on mobile
    function closeNavbarOnMobile() {
        if (window.innerWidth <= 992) {
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.getElementById('navbarNav');

            if (navbarToggler && navbarCollapse && navbarToggler.getAttribute('aria-expanded') === 'true') {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
                navbarToggler.setAttribute('aria-expanded', 'false');
                navbarToggler.classList.add('collapsed');
            }
        }
    }
    // Function to apply theme
    function applyTheme() {
        if (isDarkTheme) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            if (themeToggle) themeToggle.title = 'Switch to light theme';
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            if (themeToggle) themeToggle.title = 'Switch to dark theme';
        }

        // Update modal close button
        updateModalCloseButton();
    }

    // Function to update logo display
    function updateLogoDisplay() {
        if (isDarkTheme) {
            darkLogos.forEach(logo => logo.style.display = 'block');
            lightLogos.forEach(logo => logo.style.display = 'none');
        } else {
            darkLogos.forEach(logo => logo.style.display = 'none');
            lightLogos.forEach(logo => logo.style.display = 'block');
        }
    }

    // Function to update modal close button
    function updateModalCloseButton() {
        const closeButtons = document.querySelectorAll('.btn-close-custom');
        closeButtons.forEach(btn => {
            if (isDarkTheme) {
                btn.style.filter = 'invert(1) grayscale(100%) brightness(200%)';
            } else {
                btn.style.filter = 'invert(0) grayscale(100%) brightness(20%)';
            }
        });
    }

    // Function to save theme preference
    function saveThemePreference() {
        localStorage.setItem('centralnex-theme', isDarkTheme ? 'dark' : 'light');
    }

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('centralnex-theme')) {
            isDarkTheme = e.matches;
            applyTheme();
            updateLogoDisplay();
            updateGlobeColors();
        }
    });

    // Initialize logo display
    updateLogoDisplay();
    updateModalCloseButton();

    // ============================
    // Navbar Functionality
    // ============================
    const navLinks = document.querySelectorAll('#navbarNav .nav-link');
    const sections = document.querySelectorAll('section[id], header[id]');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active nav link based on scroll position
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#' || !targetId.startsWith('#')) return;
            e.preventDefault();

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close navbar if expanded (mobile view)
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.getElementById('navbarNav');

                if (navbarToggler && navbarToggler.getAttribute('aria-expanded') === 'true') {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                    navbarToggler.setAttribute('aria-expanded', 'false');
                    navbarToggler.classList.add('collapsed');
                }

                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================
    // 3D Cube with Segments - Enhanced Interactivity
    // ============================
    const cubeWrapper = document.querySelector('.cube-wrapper');
    const cubeFaces = document.querySelectorAll('.cube-face');
    const cubeScene = document.querySelector('.cube-scene-container');
    const floatingElements = document.querySelectorAll('.floating-element');

    if (cubeWrapper && cubeFaces.length > 0) {
        // Store original animation
        const originalAnimation = cubeWrapper.style.animation;

        // Enhanced hover effect with segments highlighting
        if (cubeScene) {
            cubeScene.addEventListener('mouseenter', function () {
                isCubeSpinning = false;
                cubeWrapper.style.animationPlayState = 'paused';

                // Highlight segments on hover
                cubeFaces.forEach(face => {
                    face.classList.add('hovered');
                });
            });

            cubeScene.addEventListener('mouseleave', function () {
                isCubeSpinning = true;
                cubeWrapper.style.animationPlayState = 'running';

                // Remove segment highlighting
                cubeFaces.forEach(face => {
                    face.classList.remove('hovered');
                });
            });

            // Enhanced click effect with segment animation
            cubeScene.addEventListener('click', function (e) {
                // Create ripple effect
                const ripple = document.createElement('div');
                ripple.className = 'cube-ripple';
                ripple.style.left = `${e.offsetX}px`;
                ripple.style.top = `${e.offsetY}px`;
                cubeScene.appendChild(ripple);

                // Remove ripple after animation
                setTimeout(() => ripple.remove(), 1000);

                // Pulse animation on cube
                cubeWrapper.style.transform += ' scale(1.1)';
                cubeFaces.forEach(face => {
                    face.classList.add('clicked');

                    // Reset after animation
                    setTimeout(() => {
                        face.classList.remove('clicked');
                    }, 300);
                });

                // Reset scale
                setTimeout(() => {
                    cubeWrapper.style.transform = cubeWrapper.style.transform.replace(' scale(1.1)', '');
                }, 300);

                // Random rotation on click
                const randomX = Math.random() * 360;
                const randomY = Math.random() * 360;
                cubeWrapper.style.animation = 'none';
                cubeWrapper.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg)`;

                // Resume animation after 2 seconds
                setTimeout(() => {
                    if (isCubeSpinning) {
                        cubeWrapper.style.animation = originalAnimation;
                        cubeWrapper.style.animationPlayState = 'running';
                    }
                }, 2000);
            });

            // Touch support for mobile
            let touchStartX = 0;
            let touchStartY = 0;

            cubeScene.addEventListener('touchstart', function (e) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                e.preventDefault();
            });

            cubeScene.addEventListener('touchmove', function (e) {
                if (!touchStartX || !touchStartY) return;

                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;

                const diffX = touchStartX - touchX;
                const diffY = touchStartY - touchY;

                // Rotate cube based on touch movement
                cubeWrapper.style.animation = 'none';
                cubeWrapper.style.transform = `rotateX(${diffY}deg) rotateY(${diffX}deg)`;

                e.preventDefault();
            });

            cubeScene.addEventListener('touchend', function () {
                touchStartX = 0;
                touchStartY = 0;

                // Resume animation after touch
                setTimeout(() => {
                    if (isCubeSpinning) {
                        cubeWrapper.style.animation = originalAnimation;
                        cubeWrapper.style.animationPlayState = 'running';
                    }
                }, 1000);
            });
        }
    }

    // ============================
    // Floating Elements with Tooltips
    // ============================
    floatingElements.forEach((el, index) => {
        el.style.animationDuration = `${6 + index * 0.5}s`;
        el.style.backgroundColor = `rgba(194, 72, 34, ${0.3 + index * 0.1})`;

        // Add click interaction to floating elements
        el.addEventListener('click', function () {
            this.style.transform = 'scale(1.5)';
            this.style.backgroundColor = 'var(--red-orange)';
            this.style.boxShadow = '0 0 20px var(--red-orange)';

            // Show notification
            const tooltip = this.getAttribute('data-tooltip');
            if (tooltip) {
                showNotification(`We service ${tooltip}`, 'info');
            }

            setTimeout(() => {
                this.style.transform = '';
                this.style.backgroundColor = `rgba(194, 72, 34, ${0.3 + index * 0.1})`;
                this.style.boxShadow = '';
            }, 500);
        });
    });

    // ============================
    // Enhanced Partnerships Section - Manual Infinite Scroll
    // ============================
    const partnershipSlider = document.querySelector('.partnership-slider-container');
    const partnershipTrack = document.querySelector('.partnership-track');
    const partnershipItems = document.querySelectorAll('.partnership-item');

    if (partnershipSlider && partnershipTrack && partnershipItems.length > 0) {
        // Variables for manual scrolling
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;
        let velocity = 0;
        let lastX = 0;
        let lastTime = 0;
        let momentumAnimationId = null;

        // Store original items for infinite loop
        const itemWidth = partnershipItems[0].offsetWidth + 20; // width + gap

        // Create scroll indicator
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = `
        <span class="scroll-text">Scroll to explore</span>
        <div class="scroll-dots">
            <div class="scroll-dot"></div>
            <div class="scroll-dot"></div>
            <div class="scroll-dot"></div>
        </div>
    `;
        partnershipSlider.appendChild(scrollIndicator);

        // Initialize the track position
        function initializeTrack() {
            // Reset transform
            partnershipTrack.style.transform = 'translateX(0)';
            partnershipTrack.style.transition = 'none';

            // Store track width for reference
            partnershipTrack.trackWidth = partnershipTrack.scrollWidth;
            partnershipTrack.halfTrackWidth = partnershipTrack.trackWidth / 2;

            // Set initial position to middle (for infinite loop effect)
            const initialOffset = -partnershipTrack.trackWidth / 4;
            partnershipTrack.style.transform = `translateX(${initialOffset}px)`;
            partnershipTrack.currentTranslate = initialOffset;

            // Store for momentum calculations
            partnershipTrack.lastTranslate = initialOffset;
        }

        // Handle infinite loop
        function handleInfiniteLoop() {
            const currentTranslate = partnershipTrack.currentTranslate;
            const trackWidth = partnershipTrack.trackWidth;

            // If we've scrolled too far right (positive translate), loop to left
            if (currentTranslate > 0) {
                partnershipTrack.style.transition = 'none';
                partnershipTrack.style.transform = `translateX(${currentTranslate - trackWidth / 2}px)`;
                partnershipTrack.currentTranslate = currentTranslate - trackWidth / 2;
            }
            // If we've scrolled too far left (negative translate), loop to right
            else if (currentTranslate < -trackWidth / 2) {
                partnershipTrack.style.transition = 'none';
                partnershipTrack.style.transform = `translateX(${currentTranslate + trackWidth / 2}px)`;
                partnershipTrack.currentTranslate = currentTranslate + trackWidth / 2;
            }
        }

        // Mouse/Touch event handlers
        function startDrag(e) {
            isDragging = true;
            partnershipSlider.classList.add('grabbing');

            // Get initial position
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            startX = clientX;
            startScrollLeft = partnershipTrack.currentTranslate || 0;

            // Reset momentum
            velocity = 0;
            lastX = clientX;
            lastTime = Date.now();

            // Stop any ongoing momentum animation
            if (momentumAnimationId) {
                cancelAnimationFrame(momentumAnimationId);
                momentumAnimationId = null;
            }

            // Remove transition for direct manipulation
            partnershipTrack.style.transition = 'none';

            // Hide scroll indicator while dragging
            scrollIndicator.style.opacity = '0';

            // Prevent text selection during drag
            document.body.style.userSelect = 'none';
        }

        function doDrag(e) {
            if (!isDragging) return;

            e.preventDefault();

            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const deltaX = clientX - startX;

            // Calculate new position
            const newTranslate = startScrollLeft + deltaX;
            partnershipTrack.style.transform = `translateX(${newTranslate}px)`;
            partnershipTrack.currentTranslate = newTranslate;

            // Calculate velocity for momentum
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;

            if (deltaTime > 0) {
                const deltaXForVelocity = clientX - lastX;
                velocity = deltaXForVelocity / deltaTime;
            }

            lastX = clientX;
            lastTime = currentTime;

            // Check for infinite loop
            handleInfiniteLoop();
        }

        function endDrag() {
            if (!isDragging) return;

            isDragging = false;
            partnershipSlider.classList.remove('grabbing');

            // Restore text selection
            document.body.style.userSelect = '';

            // Show scroll indicator again
            scrollIndicator.style.opacity = '0.7';

            // Apply momentum if velocity is high enough
            if (Math.abs(velocity) > 0.5) {
                applyMomentum();
            } else {
                // Smooth snap back if no momentum
                partnershipTrack.classList.add('momentum');
                partnershipTrack.style.transition = 'transform 0.3s ease-out';

                setTimeout(() => {
                    partnershipTrack.classList.remove('momentum');
                }, 300);
            }
        }

        // Apply momentum scrolling
        function applyMomentum() {
            partnershipTrack.classList.add('momentum');

            const friction = 0.96;
            const minVelocity = 0.1;

            function animateMomentum() {
                if (Math.abs(velocity) < minVelocity) {
                    partnershipTrack.classList.remove('momentum');
                    return;
                }

                // Apply velocity
                partnershipTrack.currentTranslate += velocity * 16; // 16ms frame
                partnershipTrack.style.transform = `translateX(${partnershipTrack.currentTranslate}px)`;

                // Apply friction
                velocity *= friction;

                // Check for infinite loop
                handleInfiniteLoop();

                // Continue animation
                momentumAnimationId = requestAnimationFrame(animateMomentum);
            }

            animateMomentum();
        }

        // Wheel events - FIXED VERSION (natural scrolling direction)
        function handleWheel(e) {
            e.preventDefault();

            // Calculate scroll amount (more sensitive for wheel)
            const wheelDelta = e.deltaY || e.deltaX || 0;
            // FIXED: Invert the direction for natural scrolling
            const scrollAmount = -wheelDelta * 0.8; // Added minus sign

            // Apply scroll
            partnershipTrack.classList.add('momentum');
            partnershipTrack.style.transition = 'transform 0.2s ease-out';

            // Add slight deceleration to wheel scrolling
            velocity = scrollAmount * 0.1;
            partnershipTrack.currentTranslate += scrollAmount;
            partnershipTrack.style.transform = `translateX(${partnershipTrack.currentTranslate}px)`;

            // Check for infinite loop
            handleInfiniteLoop();

            // Remove transition class after animation
            setTimeout(() => {
                partnershipTrack.classList.remove('momentum');
            }, 200);
        }

        // Initialize
        initializeTrack();

        // Mouse events
        partnershipSlider.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', endDrag);

        // Touch events
        partnershipSlider.addEventListener('touchstart', startDrag, { passive: false });
        partnershipSlider.addEventListener('touchmove', doDrag, { passive: false });
        document.addEventListener('touchend', endDrag);

        // Prevent context menu on long press
        partnershipSlider.addEventListener('contextmenu', (e) => {
            if (isDragging) e.preventDefault();
        });

        // Wheel events
        partnershipSlider.addEventListener('wheel', handleWheel, { passive: false });

        // Prevent default drag behavior
        partnershipSlider.addEventListener('dragstart', (e) => e.preventDefault());

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                initializeTrack();
            }, 250);
        });

        // Auto-hide scroll indicator after 5 seconds of inactivity
        let hideIndicatorTimeout;
        let hideIndicatorTimer;

        function resetHideIndicator() {
            clearTimeout(hideIndicatorTimer);
            scrollIndicator.style.opacity = '0.7';
            hideIndicatorTimer = setTimeout(() => {
                scrollIndicator.style.opacity = '0.3';
            }, 5000);
        }

        // Reset hide timer on interaction
        partnershipSlider.addEventListener('mousedown', resetHideIndicator);
        partnershipSlider.addEventListener('touchstart', resetHideIndicator);
        partnershipSlider.addEventListener('wheel', resetHideIndicator);
        partnershipSlider.addEventListener('mouseenter', resetHideIndicator);

        // Also reset on mouse leave (if user interacts outside)
        partnershipSlider.addEventListener('mouseleave', () => {
            if (!isDragging) {
                resetHideIndicator();
            }
        });

        // Initial hide timer
        resetHideIndicator();

        // ============================
        // Enhanced Logo Click/Hover Effects - FIXED FOR DOUBLE CLICK
        // ============================

        // Track if we're currently in a drag operation to prevent accidental clicks
        let dragStartTime = 0;
        const DRAG_THRESHOLD = 100; // ms - time before considering it a drag vs click

        // Double click detection variables
        const DOUBLE_CLICK_DELAY = 300; // ms between clicks to count as double click
        let lastClickTime = 0;
        let lastClickedItem = null;
        let clickTimeout = null;

        partnershipItems.forEach(item => {
            // Track touch/mouse down time
            let downTime = 0;

            item.addEventListener('mousedown', () => {
                downTime = Date.now();
            });

            item.addEventListener('touchstart', () => {
                downTime = Date.now();
            });

            // FIXED: Replace single click with double click detection
            item.addEventListener('click', function (e) {
                // Prevent click during drag or if it was a quick drag
                const clickDuration = Date.now() - downTime;
                if (isDragging || clickDuration > DRAG_THRESHOLD) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                const currentTime = Date.now();

                // Clear any existing single click timeout
                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                    clickTimeout = null;
                }

                // Check if this is a double click (within the time limit and same item)
                if (currentTime - lastClickTime <= DOUBLE_CLICK_DELAY && lastClickedItem === this) {
                    // This is a double click - execute the desired action
                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle active class
                    this.classList.toggle('active');

                    // Add clicked animation class
                    this.classList.add('clicked');

                    // Show notification with logo name
                    const logoName = this.querySelector('.logo-caption').textContent;
                    showNotification(`We are currently partnering with ${logoName} `, 'info');

                    // Remove clicked class after animation
                    setTimeout(() => {
                        this.classList.remove('clicked');
                    }, 500);

                    // Remove active class after 2 seconds
                    setTimeout(() => {
                        this.classList.remove('active');
                    }, 2000);

                    // Reset click tracking
                    lastClickTime = 0;
                    lastClickedItem = null;
                } else {
                    // This is a single click - store for potential double click
                    lastClickTime = currentTime;
                    lastClickedItem = this;

                    // Set a timeout to clear the single click if no double click occurs
                    clickTimeout = setTimeout(() => {
                        lastClickTime = 0;
                        lastClickedItem = null;
                        clickTimeout = null;
                    }, DOUBLE_CLICK_DELAY);
                }
            });

            // Enhanced hover effect with delay for better UX
            let hoverTimer;
            item.addEventListener('mouseenter', function () {
                if (isDragging) return;

                hoverTimer = setTimeout(() => {
                    this.style.zIndex = '10';
                }, 100);
            });

            item.addEventListener('mouseleave', function () {
                clearTimeout(hoverTimer);
                if (!this.classList.contains('active')) {
                    this.style.zIndex = '';
                }
            });

            // Touch device hover simulation
            item.addEventListener('touchstart', function () {
                if (isDragging) return;

                this.style.zIndex = '10';
            });

            item.addEventListener('touchend', function () {
                if (!this.classList.contains('active')) {
                    setTimeout(() => {
                        this.style.zIndex = '';
                    }, 500);
                }
            });
        });

        // Also add click prevention during drag to the entire slider
        partnershipSlider.addEventListener('click', (e) => {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }
    // ============================
    // Cases Section - Stacked Cards
    // ============================
    const caseCards = document.querySelectorAll('.case-card');
    const prevCaseBtn = document.getElementById('prevCase');
    const nextCaseBtn = document.getElementById('nextCase');
    const currentCaseSpan = document.getElementById('currentCase');
    const totalCasesSpan = document.getElementById('totalCases');
    const totalCases = caseCards.length;

    // Initialize cases
    if (totalCasesSpan) totalCasesSpan.textContent = totalCases;
    setupCaseCards();
    updateCaseDisplay();
    updateCaseButtons();

    // Event listeners for cases
    if (prevCaseBtn) {
        prevCaseBtn.addEventListener('click', () => {
            if (currentCaseIndex > 0) {
                currentCaseIndex--;
                updateCaseDisplay();
                updateCaseButtons();
                animateCaseChange();
            }
        });
    }

    if (nextCaseBtn) {
        nextCaseBtn.addEventListener('click', () => {
            if (currentCaseIndex < totalCases - 1) {
                currentCaseIndex++;
                updateCaseDisplay();
                updateCaseButtons();
                animateCaseChange();
            }
        });
    }

    // Functions for cases
    function setupCaseCards() {
        caseCards.forEach(card => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }

    function updateCaseDisplay() {
        caseCards.forEach((card, index) => {
            card.classList.remove('active', 'behind', 'far-behind');

            // Mobile view
            if (window.innerWidth <= 768) {
                if (index === currentCaseIndex) {
                    card.classList.add('active');
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                } else {
                    card.style.display = 'none';
                }
            }
            // Desktop view
            else {
                card.style.display = 'flex';

                if (index === currentCaseIndex) {
                    card.classList.add('active');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
                    card.style.zIndex = '10';
                }
                else if (index === currentCaseIndex + 1 || (currentCaseIndex === totalCases - 1 && index === 0)) {
                    card.classList.add('behind');
                    card.style.opacity = '0.7';
                    card.style.transform = 'translateY(30px) scale(0.95) rotateY(5deg)';
                    card.style.zIndex = '9';
                }
                else if (index === currentCaseIndex + 2 ||
                    (currentCaseIndex === totalCases - 2 && index === 0) ||
                    (currentCaseIndex === totalCases - 1 && index === 1)) {
                    card.classList.add('far-behind');
                    card.style.opacity = '0.4';
                    card.style.transform = 'translateY(60px) scale(0.9) rotateY(10deg)';
                    card.style.zIndex = '8';
                }
                else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(100px)';
                    card.style.zIndex = '7';
                }
            }
        });

        // Update counter
        if (currentCaseSpan) currentCaseSpan.textContent = currentCaseIndex + 1;
    }

    function animateCaseChange() {
        // Add visual feedback to navigation buttons
        if (prevCaseBtn && !prevCaseBtn.disabled) {
            prevCaseBtn.style.transform = 'translateX(-5px)';
            setTimeout(() => prevCaseBtn.style.transform = '', 300);
        }

        if (nextCaseBtn && !nextCaseBtn.disabled) {
            nextCaseBtn.style.transform = 'translateX(5px)';
            setTimeout(() => nextCaseBtn.style.transform = '', 300);
        }
    }

    function updateCaseButtons() {
        if (prevCaseBtn) {
            prevCaseBtn.disabled = currentCaseIndex === 0;
            prevCaseBtn.style.opacity = prevCaseBtn.disabled ? '0.5' : '1';
            prevCaseBtn.style.cursor = prevCaseBtn.disabled ? 'not-allowed' : 'pointer';
            prevCaseBtn.title = prevCaseBtn.disabled ? 'First case' : 'Previous case';
        }

        if (nextCaseBtn) {
            nextCaseBtn.disabled = currentCaseIndex === totalCases - 1;
            nextCaseBtn.style.opacity = nextCaseBtn.disabled ? '0.5' : '1';
            nextCaseBtn.style.cursor = nextCaseBtn.disabled ? 'not-allowed' : 'pointer';
            nextCaseBtn.title = nextCaseBtn.disabled ? 'Last case' : 'Next case';
        }
    }

    // Handle window resize for cases
    window.addEventListener('resize', updateCaseDisplay);

    // ============================
    // Testimonials Section
    // ============================
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevTestimonialBtn = document.getElementById('prevTestimonial');
    const nextTestimonialBtn = document.getElementById('nextTestimonial');
    const currentTestimonialSpan = document.getElementById('currentTestimonial');
    const totalTestimonialsSpan = document.getElementById('totalTestimonials');
    const totalTestimonials = testimonialSlides.length;

    // Initialize testimonials
    if (totalTestimonialsSpan) totalTestimonialsSpan.textContent = totalTestimonials;
    updateTestimonialSlider();
    updateTestimonialButtons();

    // Event listeners for testimonials
    if (prevTestimonialBtn) {
        prevTestimonialBtn.addEventListener('click', () => {
            if (currentTestimonialIndex > 0) {
                currentTestimonialIndex--;
                updateTestimonialSlider();
                updateTestimonialButtons();
            }
        });
    }

    if (nextTestimonialBtn) {
        nextTestimonialBtn.addEventListener('click', () => {
            if (currentTestimonialIndex < totalTestimonials - 1) {
                currentTestimonialIndex++;
                updateTestimonialSlider();
                updateTestimonialButtons();
            }
        });
    }

    function updateTestimonialSlider() {
        testimonialSlides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentTestimonialIndex) {
                slide.classList.add('active');
            }
        });

        if (currentTestimonialSpan) currentTestimonialSpan.textContent = currentTestimonialIndex + 1;
    }

    function updateTestimonialButtons() {
        if (prevTestimonialBtn) {
            prevTestimonialBtn.disabled = currentTestimonialIndex === 0;
            prevTestimonialBtn.style.opacity = prevTestimonialBtn.disabled ? '0.5' : '1';
            prevTestimonialBtn.style.cursor = prevTestimonialBtn.disabled ? 'not-allowed' : 'pointer';
        }

        if (nextTestimonialBtn) {
            nextTestimonialBtn.disabled = currentTestimonialIndex === totalTestimonials - 1;
            nextTestimonialBtn.style.opacity = nextTestimonialBtn.disabled ? '0.5' : '1';
            nextTestimonialBtn.style.cursor = nextTestimonialBtn.disabled ? 'not-allowed' : 'pointer';
        }
    }

    // ============================
    // Contact Form Submission with FormSubmit.co
    // ============================

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Validate form before submission
            if (!validateForm()) {
                return;
            }

            // Get form values
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone') ? document.getElementById('phone').value.trim() : '',
                company: document.getElementById('company').value.trim(),
                message: document.getElementById('message').value.trim(),
                privacyPolicy: document.getElementById('privacyPolicy') ? document.getElementById('privacyPolicy').checked : true,
                date: new Date().toLocaleString(),
                source: 'Central Nex Website',
                _subject: 'New Contact Form Submission from Central Nex',
                _template: 'table'
            };

            // Show loading state
            const submitBtn = document.getElementById('submitBtn');
            const submitText = document.getElementById('submitText');
            const submitSpinner = document.getElementById('submitSpinner');

            if (submitBtn) {
                submitBtn.disabled = true;
                if (submitText) submitText.textContent = 'Sending...';
                if (submitSpinner) submitSpinner.classList.remove('d-none');
            }

            try {
                // Send to FormSubmit.co
                const response = await fetch("https://formsubmit.co/ajax/khantkyawlinn.kkl@gmail.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                if (data.success === "true") {
                    // Show success message
                    showNotification('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');

                    // Reset form
                    contactForm.reset();
                    contactForm.classList.remove('was-validated');

                    // Remove validation classes
                    document.querySelectorAll('.form-control, .form-check-input').forEach(input => {
                        input.classList.remove('is-valid', 'is-invalid');
                    });

                    // Scroll to top of contact section
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Failed to send message. Please try again or contact us directly.', 'error');
            } finally {
                // Reset button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (submitText) submitText.textContent = 'Send Message';
                    if (submitSpinner) submitSpinner.classList.add('d-none');
                }
            }
        });

        // Enhanced form validation
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            // Real-time validation on blur
            input.addEventListener('blur', function () {
                validateField(this);
            });

            // Clear validation on input
            input.addEventListener('input', function () {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                }
            });
        });
    }

    // Helper function for form validation
    function validateForm() {
        let isValid = true;

        // Check required fields
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Check email format
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }

        // Check privacy policy
        const privacyPolicyField = document.getElementById('privacyPolicy');
        if (privacyPolicyField && !privacyPolicyField.checked) {
            showFieldError(privacyPolicyField, 'You must agree to the privacy policy');
            isValid = false;
        }

        if (!isValid) {
            showNotification('Please fill in all required fields correctly.', 'error');
        }

        return isValid;
    }

    // Individual field validation
    function validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        const fieldName = field.name;

        // Clear existing validation
        clearFieldError(field);

        // Check required fields
        if (field.required && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }

        // Email validation
        if ((fieldId === 'email' || fieldName === 'email') && value && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }

        // Privacy policy validation
        if ((fieldId === 'privacyPolicy' || fieldName === 'privacyPolicy') && !field.checked) {
            showFieldError(field, 'You must agree to the privacy policy');
            return false;
        }

        // Mark as valid
        field.classList.add('is-valid');
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFieldError(field, message) {
        clearFieldError(field);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        field.parentNode.appendChild(errorDiv);
        field.classList.add('is-invalid');
    }

    function clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.classList.remove('is-invalid', 'is-valid');
    }

    // ============================
    // Notification System
    // ============================
    function showNotification(message, type) {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `custom-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
            min-width: 300px;
        `;

        const contentStyle = `
            display: flex;
            align-items: center;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            font-family: 'Poppins', sans-serif;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            background: ${type === 'success' ? 'var(--dark-blue)' : type === 'error' ? '#dc3545' : 'var(--dark-blue)'};
            border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#c82333' : 'var(--red-orange)'};
        `;

        notification.querySelector('.notification-content').style.cssText = contentStyle;

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: auto;
            padding: 0.25rem;
            opacity: 0.7;
            transition: opacity 0.2s;
        `;

        closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        const autoRemoveTimer = setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Clear timer if notification is manually closed
        closeBtn.addEventListener('click', () => clearTimeout(autoRemoveTimer));
    }

    // ============================
    // Initialize Everything
    // ============================

    // Re-initialize on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCaseDisplay();
            updateTestimonialSlider();
        }, 250);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .cube-ripple {
            position: absolute;
            width: 10px;
            height: 10px;
            background: rgba(194, 72, 34, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 1s linear;
            transform: translate(-50%, -50%);
        }
        
        @keyframes ripple {
            0% {
                width: 10px;
                height: 10px;
                opacity: 0.8;
            }
            100% {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('Central Nex website initialized successfully!');
});