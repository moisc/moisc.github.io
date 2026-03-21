// Main JavaScript functionality for Mois Cohen's portfolio website

(function() {
    'use strict';

    // Initialize all functionality when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initScrollProgress();
        initIntersectionObserver();
        initSmoothScrolling();
        initCounterAnimations();
        initBackToTop();
        // initFormHandling kept in file but not called — no form in HTML yet
    });

    // Navigation functionality
    function initNavigation() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', throttle(function() {
            navbar.style.boxShadow = window.scrollY > 0
                ? '0 1px 0 #E8EEF4'
                : 'none';
        }, 100));
    }

    // Scroll progress indicator
    function initScrollProgress() {
        const bar = document.getElementById('scroll-progress');
        if (!bar) return;
        window.addEventListener('scroll', function() {
            const scrolled = (document.documentElement.scrollTop /
                (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
            bar.style.width = scrolled + '%';
        });
    }

    // Intersection Observer for animations
    function initIntersectionObserver() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        if (!elements.length) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(function(el) { observer.observe(el); });
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

                    // Animate the metric card fade-in
                    const metricCard = counter.closest('.metric-card');
                    if (metricCard) {
                        metricCard.style.transition = 'opacity 0.6s ease-out';
                        metricCard.style.opacity = '1';
                    }

                    // Animate counter with easing
                    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
                    const startTime = Date.now();

                    const updateCounter = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easedProgress = easeOutQuart(progress);

                        current = Math.floor(easedProgress * target);
                        counter.textContent = current;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // Back to top button
    function initBackToTop() {
        const backToTopBtn = document.querySelector('.back-to-top');

        if (!backToTopBtn) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Performance optimizations
    window.addEventListener('scroll', throttle(function() {
        // Throttled scroll events handled in individual functions
    }, 16));

    window.addEventListener('resize', debounce(function() {
        // Debounced resize events
    }, 250));

})();