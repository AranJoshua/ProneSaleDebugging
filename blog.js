// Blog page navigation and UI logic
(function() {
    // Navigation links configuration (copied from index.js)
    const navLinks = [
        { text: 'Home', href: 'index.html' },
        { text: 'For Sale', href: 'for-sale.html' },
        { text: 'For Rent', href: '#' },
        { text: 'Agents', href: 'agents.html' },
        { text: 'Blog', href: 'blog.html' }
    ];
    // Set active navigation state
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const mainNav = document.getElementById('mainNavLinks');
    const mobileNav = document.getElementById('mobileNavLinks');
    if (mainNav && mobileNav) {
        mainNav.innerHTML = navLinks.map(link => {
            const isActive = link.text === 'Blog' || link.href === currentPage;
            return `<li class='nav-item'><a class='nav-link${isActive ? ' active' : ''}' href='${link.href}'>${link.text}</a></li>`;
        }).join('');
        mobileNav.innerHTML = navLinks.map(link => {
            const isActive = link.text === 'Blog' || link.href === currentPage;
            return `<li><a href='${link.href}'${isActive ? ' class="active"' : ''}>${link.text}</a></li>`;
        }).join('');
    }
    // Mobile menu open/close logic (copied from index.js)
    const header = document.querySelector('.header');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const mobileMenuPanel = document.querySelector('.mobile-menu-panel');
    const openMenuBtn = document.querySelector('.mobile-menu-open-trigger');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    if (openMenuBtn && mobileMenuPanel && mobileMenuOverlay) {
        openMenuBtn.addEventListener('click', function() {
            const isOpen = mobileMenuPanel.classList.contains('active');
            mobileMenuPanel.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            if (navbarToggler) navbarToggler.classList.toggle('active');
        });
        mobileMenuOverlay.addEventListener('click', function() {
            mobileMenuPanel.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            if (navbarToggler) navbarToggler.classList.remove('active');
        });
    }
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    });
    // Loading animation
    const loadingAnimation = document.querySelector('.loading-animation');
    window.addEventListener('load', () => {
        setTimeout(() => loadingAnimation && (loadingAnimation.style.display = 'none'), 1000);
    });
    // Blog search bar UI (no backend)
    const blogSearchForm = document.querySelector('.blog-search-form');
    const blogSearchInput = document.querySelector('.blog-search-input');
    if (blogSearchForm && blogSearchInput) {
        blogSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            blogSearchInput.blur();
            // For CMS: Integrate search logic here
        });
    }
    // Blog card hover effect (optional, for accessibility)
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-4px) scale(1.01)');
        card.addEventListener('mouseleave', () => card.style.transform = '');
    });
})();

document.addEventListener('DOMContentLoaded', function() {
    const tabsContainer = document.getElementById('blogSearchTabs');
    if (!tabsContainer) return;
    const tabs = tabsContainer.querySelectorAll('.search-tab');
    const underline = tabsContainer.querySelector('.tab-underline');
    const barGroup = tabsContainer.parentElement.querySelector('.search-bar-group');
    const input = barGroup.querySelector('.search-input');
    const filtersBtn = barGroup.querySelector('.search-filters');
    const mobileFiltersBtn = barGroup.querySelector('.search-buttons-row .search-filters');

    const placeholders = {
        articles: 'Search for articles by title, topic, or author',
        news: 'Search for news by keyword or date',
        guides: 'Search for guides by subject or step'
    };

    function moveUnderline(idx) {
        if (underline) {
            underline.style.transform = `translateX(${idx * 100}%)`;
        }
    }

    tabs.forEach((tab, idx) => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            moveUnderline(idx);
            const type = tab.dataset.tab;
            input.placeholder = placeholders[type] || 'Search for articles, news, or guides';
            if (filtersBtn) filtersBtn.style.display = 'none';
            if (mobileFiltersBtn) mobileFiltersBtn.style.display = 'none';
        });
    });

    // Initialize default state
    moveUnderline(0);
    input.placeholder = placeholders['articles'];
    if (filtersBtn) filtersBtn.style.display = 'none';
    if (mobileFiltersBtn) mobileFiltersBtn.style.display = 'none';

    // Article view toggle logic
    const readArticleBtn = document.getElementById('readArticleBtn');
    const blogArticleView = document.getElementById('blogArticleView');
    const blogGrid = document.querySelector('.blog-grid');
    const backToBlogBtn = document.getElementById('backToBlogBtn');
    const blogSearchFormContainer = document.getElementById('blogSearchFormContainer');

    // On page load, check if we should show the article view
    if (localStorage.getItem('blogArticleView') === 'true') {
        if (blogArticleView && blogGrid) {
            blogGrid.style.display = 'none';
            blogArticleView.style.display = 'block';
            if (blogSearchFormContainer) blogSearchFormContainer.style.display = 'none';
        }
    }

    if (readArticleBtn && blogArticleView && blogGrid && backToBlogBtn) {
        readArticleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            blogGrid.style.display = 'none';
            blogArticleView.style.display = 'block';
            if (blogSearchFormContainer) blogSearchFormContainer.style.display = 'none';
            // Add fade-in animation
            blogArticleView.classList.add('fade-in-article');
            blogArticleView.addEventListener('animationend', function handler() {
                blogArticleView.classList.remove('fade-in-article');
                blogArticleView.removeEventListener('animationend', handler);
            });
            // Set flag in localStorage
            localStorage.setItem('blogArticleView', 'true');
            // Force instant scroll (no animation) regardless of CSS
            const html = document.documentElement;
            const body = document.body;
            const prevHtmlScroll = html.style.scrollBehavior;
            const prevBodyScroll = body.style.scrollBehavior;
            html.style.scrollBehavior = 'auto';
            body.style.scrollBehavior = 'auto';
            window.scrollTo(0, 0);
            html.scrollTop = 0;
            body.scrollTop = 0;
            // Restore previous scroll-behavior if needed
            html.style.scrollBehavior = prevHtmlScroll;
            body.style.scrollBehavior = prevBodyScroll;
        });
        backToBlogBtn.addEventListener('click', function() {
            blogArticleView.style.display = 'none';
            blogGrid.style.display = 'grid';
            if (blogSearchFormContainer) blogSearchFormContainer.style.display = '';
            document.querySelector('.blog-section').scrollIntoView({ behavior: 'smooth' });
            // Remove flag from localStorage
            localStorage.removeItem('blogArticleView');
        });
    }

    // Share bar copy link functionality
    const copyLinkBtn = document.querySelector('.copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                copyLinkBtn.classList.add('copied');
                copyLinkBtn.setAttribute('aria-label', 'Link copied!');
                setTimeout(() => {
                    copyLinkBtn.classList.remove('copied');
                    copyLinkBtn.setAttribute('aria-label', 'Copy Link');
                }, 1200);
            });
        });
    }
}); 