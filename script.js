/**
 * Central Nex Software House - Main JavaScript File
 * Version 1.1.0 - Updated with stacked testimonials and compact globe
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

   
    // Theme Toggle Functionality
    
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
            updateGlobeColors();
        });
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
                showNotification(`Clicked: ${tooltip}`, 'info');
            }

            setTimeout(() => {
                this.style.transform = '';
                this.style.backgroundColor = `rgba(194, 72, 34, ${0.3 + index * 0.1})`;
                this.style.boxShadow = '';
            }, 500);
        });
    });

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
    // Simple Testimonial Slider
    // ============================

    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevTestimonialBtn = document.getElementById('prevTestimonial');
    const nextTestimonialBtn = document.getElementById('nextTestimonial');
    const currentTestimonialSpan = document.getElementById('currentTestimonial');
    const totalTestimonialsSpan = document.getElementById('totalTestimonials');
    const totalTestimonials = testimonialSlides.length;


    // Initialize testimonials
    function initTestimonialSlider() {
        if (totalTestimonialsSpan) totalTestimonialsSpan.textContent = totalTestimonials;
        updateTestimonialSlider();
        updateTestimonialButtons();
        adjustLayoutForMobile();
    }

    // Update slider display
    function updateTestimonialSlider() {
        testimonialSlides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentTestimonialIndex) {
                slide.classList.add('active');
            }
        });

        if (currentTestimonialSpan) currentTestimonialSpan.textContent = currentTestimonialIndex + 1;

        // Adjust layout for mobile
        adjustLayoutForMobile();
    }

    // Update navigation buttons
    function updateTestimonialButtons() {
        if (prevTestimonialBtn) {
            prevTestimonialBtn.disabled = currentTestimonialIndex === 0;
            prevTestimonialBtn.style.opacity = prevTestimonialBtn.disabled ? '0.3' : '1';
            prevTestimonialBtn.style.cursor = prevTestimonialBtn.disabled ? 'not-allowed' : 'pointer';
        }

        if (nextTestimonialBtn) {
            nextTestimonialBtn.disabled = currentTestimonialIndex === totalTestimonials - 1;
            nextTestimonialBtn.style.opacity = nextTestimonialBtn.disabled ? '0.3' : '1';
            nextTestimonialBtn.style.cursor = nextTestimonialBtn.disabled ? 'not-allowed' : 'pointer';
        }
    }

    // Adjust layout for mobile screens
    function adjustLayoutForMobile() {
        const isMobile = window.innerWidth <= 768;
        const testimonialCard = document.querySelector('.testimonial-card.active');
        const navigation = document.querySelector('.stack-navigation');

        if (isMobile && testimonialCard && navigation) {
            // Ensure card has proper margin above navigation
            const cardBottom = testimonialCard.getBoundingClientRect().bottom;
            const navTop = navigation.getBoundingClientRect().top;

            if (cardBottom > navTop - 10) { // If card is too close to navigation
                testimonialCard.style.marginBottom = '1.5rem';
            }
        }
    }

    // Event listeners for testimonials
    if (prevTestimonialBtn) {
        prevTestimonialBtn.addEventListener('click', () => {
            if (currentTestimonialIndex > 0) {
                currentTestimonialIndex--;
                updateTestimonialSlider();
                updateTestimonialButtons();
                animateSliderChange();
            }
        });
    }

    if (nextTestimonialBtn) {
        nextTestimonialBtn.addEventListener('click', () => {
            if (currentTestimonialIndex < totalTestimonials - 1) {
                currentTestimonialIndex++;
                updateTestimonialSlider();
                updateTestimonialButtons();
                animateSliderChange();
            }
        });
    }

    // Add animation effect
    function animateSliderChange() {
        const activeSlide = document.querySelector('.testimonial-slide.active');
        if (activeSlide) {
            activeSlide.style.animation = 'none';
            setTimeout(() => {
                activeSlide.style.animation = '';
            }, 10);
        }
    }

    // ============================
    // Black Rotating Sphere
    // ============================
    function createBlackRotatingSphere() {
        const sphereWrapper = document.getElementById('sphere');
        if (!sphereWrapper) {
            console.error('Sphere wrapper element not found!');
            return;
        }

        // Clear existing content
        sphereWrapper.innerHTML = '';

        // Create the black rotating sphere
        const sphere = document.createElement('div');
        sphere.className = 'black-sphere';
        sphereWrapper.appendChild(sphere);

        console.log('Black rotating sphere created successfully');
    }

    // Window resize handler
    function handleResize() {
        adjustLayoutForMobile();

        // Adjust sphere size on very small screens
        const sphere = document.querySelector('.black-sphere');
        const scene = document.querySelector('.scene');

        if (sphere && scene) {
            const isVerySmall = window.innerWidth <= 360;
            if (isVerySmall) {
                scene.style.minHeight = '140px';
            }
        }
    }

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        initTestimonialSlider();
        createBlackRotatingSphere();

        // Add resize listener
        window.addEventListener('resize', handleResize);
    });

    // Fallback initialization
    window.addEventListener('load', () => {
        // Re-check if sphere was created
        if (!document.querySelector('.black-sphere')) {
            createBlackRotatingSphere();
        }

        // Initial layout adjustment
        adjustLayoutForMobile();
    });
    // ============================
    // Contact Form
    // ============================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const company = document.getElementById('company').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // In a real application, you would send this data to a server
                console.log('Form submitted:', { name, email, company, message });

                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');

                // Reset form
                contactForm.reset();

                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });

        // Form field validation on blur
        const formFields = contactForm.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            field.addEventListener('blur', function () {
                validateField(this);
            });

            field.addEventListener('input', function () {
                clearFieldError(this);
            });
        });
    }

    // Helper functions for form validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;

        if (field.required && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }

        if (fieldId === 'email' && value && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }

        clearFieldError(field);
        return true;
    }

    function showFieldError(field, message) {
        clearFieldError(field);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--red-orange)';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';

        field.parentNode.appendChild(errorDiv);
        field.classList.add('is-invalid');
    }

    function clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.classList.remove('is-invalid');
    }

    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            font-family: 'Poppins', sans-serif;
            max-width: 300px;
        `;

        if (type === 'success') {
            notification.style.backgroundColor = 'var(--red-orange)';
            notification.style.borderLeft = '4px solid #e65b32';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc3545';
            notification.style.borderLeft = '4px solid #c82333';
        } else {
            notification.style.backgroundColor = '#17a2b8';
            notification.style.borderLeft = '4px solid #138496';
        }

        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // ============================
    // Initialize Everything
    // ============================

    // Initialize globe with new compact design
    generateCompactGlobe();

    // Re-initialize on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            generateCompactGlobe();
            updateCaseDisplay();
            updateTestimonialDisplay();
        }, 250);
    });

    // Re-generate globe on theme change
    const themeObserver = new MutationObserver(() => {
        generateCompactGlobe();
    });

    if (body) {
        themeObserver.observe(body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // ============================
    // Additional Effects & Animations
    // ============================

    // Add scroll animations for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Add special animation for cube when hero section is in view
                if (entry.target.id === 'hero-section' && cubeWrapper) {
                    cubeWrapper.style.animationPlayState = 'running';
                    isCubeSpinning = true;
                }
            } else {
                // Pause cube animation when not in view
                if (entry.target.id === 'hero-section' && cubeWrapper) {
                    cubeWrapper.style.animationPlayState = 'paused';
                    isCubeSpinning = false;
                }
            }
        });
    }, observerOptions);

    // Observe sections for animations
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
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