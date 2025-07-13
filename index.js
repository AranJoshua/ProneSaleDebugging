(function() {
    const header = document.querySelector('.header');
    const loadingAnimation = document.querySelector('.loading-animation');
    const carousel = document.getElementById('bannerCarousel');
    const searchInputs = document.querySelectorAll('.search-form .form-control');
    const searchButtons = document.querySelectorAll('.search-form .btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const mobileMenuPanel = document.querySelector('.mobile-menu-panel');
    const openMenuBtn = document.querySelector('.mobile-menu-open-trigger');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

    function handleTransitionEnd(e) {
        if (e.propertyName === 'transform') {
            mobileMenuPanel.classList.remove('closing');
            mobileMenuPanel.removeEventListener('transitionend', handleTransitionEnd);
        }
    }

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    window.addEventListener('load', () => {
        setTimeout(() => loadingAnimation.style.display = 'none', 1000);
    });

    navLinks.forEach(e => {
        e.addEventListener('mouseenter', () => e.style.transform = 'translateY(-1px)');
        e.addEventListener('mouseleave', () => e.style.transform = 'translateY(0)');
    });

    // Use event delegation for search button microanimation
    document.addEventListener('click', function(e) {
<<<<<<< HEAD
        // Only trigger for .search-btn, not .search-filters
        const btn = e.target.closest('.search-form .search-btn');
=======
        const btn = e.target.closest('.search-form .btn');
>>>>>>> 80532c70f6867b3a4dc841d6f072c032165b1719
        if (btn) {
            const input = btn.closest('.search-form').querySelector('.form-control');
            if (input.value.trim() === '') {
                input.style.borderColor = '#e74c3c';
                input.focus();
                setTimeout(() => input.style.borderColor = '#e5e7eb', 2000);
            } else {
<<<<<<< HEAD
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Search';
                setTimeout(() => btn.innerHTML = '<i class="fas fa-search"></i> Search', 2000);
=======
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>Searching...';
                setTimeout(() => btn.innerHTML = '<i class="fas fa-search"></i>Search', 2000);
>>>>>>> 80532c70f6867b3a4dc841d6f072c032165b1719
            }
        }
    });

    navbarToggler.addEventListener('click', function () {
        this.classList.toggle('active');
    });

    const placeholderSets = [
        [
            'Enter location, property type, or postal code',
            'Search by neighborhood...',
            'Find your dream home...',
            'Type property features...'
        ],
        [
            'Search by neighborhood, features, or price range',
            'Find apartments, houses, or condos...',
            'Search prime locations...',
            'Enter your budget range...'
        ],
        [
            'Find homes, apartments, or commercial spaces',
            'Search by property type...',
            'Discover premium locations...',
            'Enter area or postal code...'
        ]
    ];

    searchInputs.forEach((input, index) => {
        let currentPlaceholder = 0;
        const placeholders = placeholderSets[index] || placeholderSets[0];
        setInterval(() => {
            input.placeholder = placeholders[currentPlaceholder];
            currentPlaceholder = (currentPlaceholder + 1) % placeholders.length;
        }, 3000 + 500 * index);
    });

    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            const c = bootstrap.Carousel.getInstance(carousel);
            c && c.pause();
        });
        carousel.addEventListener('mouseleave', () => {
            const c = bootstrap.Carousel.getInstance(carousel);
            c && c.cycle();
        });
    }

    // --- Featured Listings Section Logic (from ftlistings.html) ---
    window.ftlistings = (function() {
        'use strict';
        // Utility functions
        const $ = (selector) => document.querySelector(selector);
        const $$ = (selector) => document.querySelectorAll(selector);
        // Image navigation state
        const imageIndices = new Map();
        function initializeImageIndices() {
            $$('.property-card').forEach((card, index) => {
                imageIndices.set(card, 0);
            });
        }
        function getImagesArray(propertyCard) {
            try {
                const imagesData = propertyCard.getAttribute('data-images');
                return JSON.parse(imagesData) || [];
            } catch (error) {
                console.warn('Error parsing images data:', error);
                return [];
            }
        }
        function updateImageWithSlide(propertyCard, newIndex, direction) {
            const images = getImagesArray(propertyCard);
            if (images.length === 0) return;
            const img = propertyCard.querySelector('.property-image img');
            if (!img) return;
            imageIndices.set(propertyCard, newIndex);
            const slideOutClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
            const slideInClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';
            img.classList.add('sliding');
            img.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right', 'slide-active');
            img.classList.add(slideOutClass);
            requestAnimationFrame(() => {
                img.src = images[newIndex];
                img.classList.remove(slideOutClass);
                img.classList.add(slideInClass);
                requestAnimationFrame(() => {
                    img.classList.remove(slideInClass);
                    img.classList.add('slide-active');
                    setTimeout(() => {
                        img.classList.remove('sliding');
                    }, 300);
                });
            });
        }
        function previousImage(button) {
            try {
                const propertyCard = button.closest('.property-card');
                const images = getImagesArray(propertyCard);
                if (images.length <= 1) return;
                const currentIndex = imageIndices.get(propertyCard) || 0;
                const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
                updateImageWithSlide(propertyCard, newIndex, 'prev');
            } catch (error) {
                console.warn('Error in previousImage:', error);
            }
        }
        function nextImage(button) {
            try {
                const propertyCard = button.closest('.property-card');
                const images = getImagesArray(propertyCard);
                if (images.length <= 1) return;
                const currentIndex = imageIndices.get(propertyCard) || 0;
                const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
                updateImageWithSlide(propertyCard, newIndex, 'next');
            } catch (error) {
                console.warn('Error in nextImage:', error);
            }
        }
        function toggleFavorite(button) {
            try {
                const icon = button.querySelector('i');
                const isActive = icon.classList.contains('fas');
                icon.classList.toggle('far', isActive);
                icon.classList.toggle('fas', !isActive);
                button.classList.toggle('active', !isActive);
                const propertyId = button.closest('.property-card').dataset.propertyId || 'default';
                console.log(`Property ${propertyId} favorited:`, !isActive);
            } catch (error) {
                console.warn('Error toggling favorite:', error);
            }
        }
        function initializeAnimations() {
            if (!('IntersectionObserver' in window)) {
                $$('.property-card').forEach(card => {
                    card.classList.remove('loading');
                    card.classList.add('loaded');
                });
                return;
            }
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('loading');
                        entry.target.classList.add('loaded');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            $$('.property-card').forEach(card => observer.observe(card));
        }
        function optimizeImages() {
            $$('img[loading="lazy"]').forEach(img => {
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                });
                img.addEventListener('error', function() {
                    this.style.opacity = '0.5';
                    console.warn('Failed to load image:', this.src);
                });
            });
        }
        function initializeApp() {
            initializeImageIndices();
            initializeAnimations();
            optimizeImages();
            initializeKeyboardNavigation();
            window.ftlistings.toggleFavorite = toggleFavorite;
            window.ftlistings.previousImage = previousImage;
            window.ftlistings.nextImage = nextImage;
            console.log('Property listings initialized with slide animation');
        }
        function initializeKeyboardNavigation() {
            document.addEventListener('keydown', (event) => {
                const activeElement = document.activeElement;
                const propertyCard = activeElement && activeElement.closest && activeElement.closest('.property-card');
                if (!propertyCard) return;
                switch (event.key) {
                    case 'ArrowLeft':
                        event.preventDefault();
                        const prevButton = propertyCard.querySelector('.property-nav.prev');
                        if (prevButton) previousImage(prevButton);
                        break;
                    case 'ArrowRight':
                        event.preventDefault();
                        const nextButton = propertyCard.querySelector('.property-nav.next');
                        if (nextButton) nextImage(nextButton);
                        break;
                }
            });
            $$('.property-card').forEach(card => {
                card.setAttribute('tabindex', '0');
                card.addEventListener('focus', () => {
                    card.style.outline = '2px solid #1e3a8a';
                    card.style.outlineOffset = '2px';
                });
                card.addEventListener('blur', () => {
                    card.style.outline = 'none';
                });
            });
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }
        return {
            toggleFavorite,
            previousImage,
            nextImage
        };
    })();

    // Mobile menu open/close logic
    function openMobileMenu() {
        mobileMenuPanel.classList.add('active');
        openMenuBtn.classList.add('menu-open');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeMobileMenu() {
        mobileMenuPanel.classList.remove('active');
        openMenuBtn.classList.remove('menu-open');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (openMenuBtn && mobileMenuPanel) {
        openMenuBtn.addEventListener('click', function() {
            if (mobileMenuPanel.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    mobileMenuPanel.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') closeMobileMenu();
    });
})();
