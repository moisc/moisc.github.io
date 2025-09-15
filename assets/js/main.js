// Main JavaScript functionality for Mois Cohen's portfolio website

(function() {
    'use strict';

    // Initialize all functionality when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initTheme();
        initScrollProgress();
        initTypingAnimation();
        initIntersectionObserver();
        initFormHandling();
        initSmoothScrolling();
        initParallaxEffects();
        initSkillsProgressBars();
        initCounterAnimations();
        initHoverEffects();
    });

    // Navigation functionality
    function initNavigation() {
        const navbar = document.getElementById('navbar');
        const mobileToggle = document.getElementById('mobile-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        // Mobile menu toggle
        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', function() {
                mobileToggle.classList.toggle('open');
                mobileMenu.classList.toggle('open');
                document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
            });
            
            // Close mobile menu when clicking on a link
            mobileMenu.querySelectorAll('.navbar__link').forEach(link => {
                link.addEventListener('click', function() {
                    mobileToggle.classList.remove('open');
                    mobileMenu.classList.remove('open');
                    document.body.style.overflow = '';
                });
            });
        }
        
        // Navbar scroll effect
        if (navbar) {
            let lastScrollY = window.scrollY;
            
            window.addEventListener('scroll', function() {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                lastScrollY = currentScrollY;
            });
        }
        
        // Active nav link highlighting
        const navLinks = document.querySelectorAll('.navbar__link[href^="#"]');
        if (navLinks.length > 0) {
            window.addEventListener('scroll', updateActiveNavLink);
        }
    }

    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.navbar__link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Theme functionality
    function initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        const mobileThemeIcon = document.getElementById('mobile-theme-icon');
        
        // Initialize theme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        setTheme(initialTheme);
        
        // Theme toggle handlers
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', toggleTheme);
        }
        
        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        }
        
        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            
            if (themeIcon && mobileThemeIcon) {
                const iconClass = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                themeIcon.className = iconClass;
                mobileThemeIcon.className = iconClass;
            }
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Scroll progress indicator
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-blue), var(--accent-orange));
            z-index: 9999;
            transition: width 0.2s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Typing animation for hero section
    function initTypingAnimation() {
        const typingElement = document.querySelector('.hero__title .typing-text');
        if (!typingElement) return;
        
        const phrases = [
            'Mechanical Engineer',
            'Problem Solver', 
            'Design Expert',
            'Innovation Driver'
        ];
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (!isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex >= currentPhrase.length) {
                    isDeleting = true;
                    setTimeout(type, 2000); // Pause at end
                    return;
                }
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex);
                charIndex--;
                
                if (charIndex < 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(type, 500); // Pause before new phrase
                    return;
                }
            }
            
            const typeSpeed = isDeleting ? 50 : 100;
            setTimeout(type, typeSpeed);
        }
        
        // Start typing animation
        setTimeout(type, 1000);
    }

    // Enhanced Intersection Observer for animations
    function initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    
                    // Apply different animations based on element type
                    if (target.classList.contains('project-card')) {
                        target.classList.add('animate-fadeInScale');
                    } else if (target.classList.contains('experience-timeline__item')) {
                        target.classList.add('animate-slideInFromBottom');
                    } else if (target.classList.contains('skill-highlight')) {
                        target.classList.add('animate-fadeInUp');
                    } else if (target.classList.contains('section-header')) {
                        target.classList.add('animate-fadeInUp');
                        // Animate section header elements with stagger
                        const subtitle = target.querySelector('.section-header__subtitle');
                        const title = target.querySelector('.section-header__title');
                        const description = target.querySelector('.section-header__description');
                        
                        if (subtitle) subtitle.classList.add('animate-fadeInUp', 'animate-stagger-1');
                        if (title) title.classList.add('animate-fadeInUp', 'animate-stagger-2');
                        if (description) description.classList.add('animate-fadeInUp', 'animate-stagger-3');
                    } else {
                        target.classList.add('animate-fadeInUp');
                    }
                    
                    observer.unobserve(target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.hero__content, .section-header, .card, .skill-category, .experience-timeline__item, .project-card, .skill-highlight, .contact-info__item'
        );
        
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Form handling
    function initFormHandling() {
        const contactForm = document.querySelector('#contact-form');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = `
                <div class="loading"></div>
                <span>Sending...</span>
            `;
            submitButton.disabled = true;
            
            // Get form data
            const formData = new FormData(this);
            
            // Submit to Formspree or similar service
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then(data => {
                // Success
                submitButton.innerHTML = `
                    <i class="fas fa-check"></i>
                    <span>Message Sent!</span>
                `;
                submitButton.classList.add('btn--success');
                
                // Reset form
                this.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.classList.remove('btn--success');
                }, 3000);
            })
            .catch(error => {
                // Error
                console.error('Error:', error);
                submitButton.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Error - Please try again</span>
                `;
                submitButton.classList.add('btn--error');
                
                // Reset button after delay
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.classList.remove('btn--error');
                }, 3000);
            });
        });
    }

    // Project filtering
    function initProjectFiltering() {
        const filterButtons = document.querySelectorAll('[data-filter]');
        const projectCards = document.querySelectorAll('[data-category]');
        
        if (filterButtons.length === 0 || projectCards.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects with smooth animation
                projectCards.forEach((card, index) => {
                    const categories = card.getAttribute('data-category').split(' ');
                    const shouldShow = filter === 'all' || categories.includes(filter);
                    
                    if (shouldShow) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        }, index * 50); // Staggered animation
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px) scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        // Initialize with proper styles
        projectCards.forEach(card => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Skills progress bars animation
    function initSkillsAnimation() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        if (skillBars.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.skill-progress-bar');
                    const percentage = progressBar.getAttribute('data-percentage');
                    
                    setTimeout(() => {
                        progressBar.style.width = percentage + '%';
                    }, 200);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => observer.observe(bar));
    }

    // Initialize additional features if elements exist
    document.addEventListener('DOMContentLoaded', function() {
        initProjectFiltering();
        initSkillsAnimation();
    });

    // Utility functions
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
        };
    }

    // Parallax effects
    function initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero__image img');
        
        if (parallaxElements.length === 0) return;
        
        window.addEventListener('scroll', throttle(function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 16));
    }

    // Skills progress bars with counter animation
    function initSkillsProgressBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        if (skillBars.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.skill-progress-bar');
                    const percentage = progressBar?.getAttribute('data-percentage');
                    
                    if (progressBar && percentage) {
                        setTimeout(() => {
                            progressBar.style.width = percentage + '%';
                        }, 200);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => observer.observe(bar));
    }

    // Counter animations for statistics
    function initCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        if (counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-counter'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.7 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    // Enhanced hover effects
    function initHoverEffects() {
        // Add magnetic effect to buttons
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.classList.add('hover-lift');
            });
            
            button.addEventListener('mouseleave', function() {
                this.classList.remove('hover-lift');
            });
        });
        
        // Add floating animation to hero image
        const heroImage = document.querySelector('.hero__image img');
        if (heroImage) {
            heroImage.classList.add('animate-float');
        }
        
        // Add pulse animation to CTA buttons
        const ctaButtons = document.querySelectorAll('.btn--primary');
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.classList.add('animate-pulse');
            });
            
            button.addEventListener('mouseleave', function() {
                this.classList.remove('animate-pulse');
            });
        });
        
        // Add tilt effect to project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // Add loading animation
    function showLoadingAnimation() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>Loading...</p>
            </div>
        `;
        
        const loaderStyles = `
            .page-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                transition: opacity 0.5s ease;
            }
            
            .loader-content {
                text-align: center;
            }
            
            .loader-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid var(--gray-200);
                border-top: 3px solid var(--primary-blue);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = loaderStyles;
        document.head.appendChild(styleSheet);
        document.body.appendChild(loader);
        
        // Hide loader after page loads
        window.addEventListener('load', function() {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                    styleSheet.remove();
                }, 500);
            }, 500);
        });
    }

    // Initialize loading animation
    showLoadingAnimation();

    // Performance optimizations
    window.addEventListener('scroll', throttle(function() {
        // Throttled scroll events handled in individual functions
    }, 16));

    window.addEventListener('resize', debounce(function() {
        // Debounced resize events
    }, 250));

})();