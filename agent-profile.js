// Agent Profile JavaScript

// Navigation setup
const navLinks = [
    { text: 'Home', href: 'index.html' },
    { text: 'For Sale', href: '#' },
    { text: 'For Rent', href: '#' },
    { text: 'Agents', href: 'agents.html' },
    { text: 'Blog', href: '#' },
    { text: 'Contact', href: '#' }
];

// Initialize navigation
function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const mainNav = document.getElementById('mainNavLinks');
    const mobileNav = document.getElementById('mobileNavLinks');
    
    if (mainNav && mobileNav) {
        mainNav.innerHTML = navLinks.map(link => {
            const isActive = (
                link.href === currentPage ||
                (currentPage === 'index.html' && link.href === 'index.html') ||
                (link.href === 'agents.html' && (currentPage === 'agents.html' || currentPage === 'agent-profile.html'))
            );
            return `<li class='nav-item'><a class='nav-link${isActive ? ' active' : ''}' href='${link.href}'>${link.text}</a></li>`;
        }).join('');
        
        mobileNav.innerHTML = navLinks.map(link => {
            const isActive = (
                link.href === currentPage ||
                (currentPage === 'index.html' && link.href === 'index.html') ||
                (link.href === 'agents.html' && (currentPage === 'agents.html' || currentPage === 'agent-profile.html'))
            );
            return `<li><a href='${link.href}'${isActive ? ' class="active"' : ''}>${link.text}</a></li>`;
        }).join('');
    }
}

// Property filter dropdown functionality
function initializePropertyFilter() {
    const dropdown = document.getElementById('propertyDropdown');
    const btn = document.getElementById('propertyDropdownBtn');
    const menu = document.getElementById('propertyDropdownMenu');
    const selected = document.getElementById('propertyDropdownSelected');
    const options = menu.querySelectorAll('.property-dropdown-option');
    const propertyList = document.getElementById('gabrielPropertyList');
    const propertyCountDisplay = document.getElementById('propertyCountDisplay');
    const noPropertiesMessage = document.getElementById('noPropertiesMessage');
    let open = false;

    function updatePropertyCount() {
        const type = selected.textContent.trim().toLowerCase().includes('rent') ? 'rent' : 'sale';
        const allCards = propertyList.querySelectorAll('.property-listing-card');
        const visibleCards = Array.from(allCards).filter(card => card.getAttribute('data-type') === type);
        
        allCards.forEach(card => {
            card.style.display = (card.getAttribute('data-type') === type) ? '' : 'none';
        });
        
        if (visibleCards.length === 0) {
            propertyCountDisplay.style.display = 'none';
            noPropertiesMessage.style.display = 'block';
            noPropertiesMessage.textContent = `This agent has no properties posted for ${type}.`;
        } else {
            propertyCountDisplay.style.display = '';
            propertyCountDisplay.textContent = `Showing ${visibleCards.length} out of ${allCards.length} properties for ${type}`;
            noPropertiesMessage.style.display = 'none';
        }
    }

    function closeDropdown() {
        dropdown.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        open = false;
    }

    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        open = !open;
        dropdown.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    options.forEach(option => {
        option.addEventListener('click', function(e) {
            selected.textContent = this.textContent;
            closeDropdown();
            updatePropertyCount();
        });
    });

    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) closeDropdown();
    });

    btn.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeDropdown();
    });

    updatePropertyCount();
}

// Property image navigation
function initializePropertyImageNavigation() {
    const imageIndices = new Map();
    
    function getImagesArray(card) {
        try {
            const imagesData = card.getAttribute('data-images');
            return JSON.parse(imagesData) || [];
        } catch (error) {
            return [];
        }
    }
    
    function updateImage(card, newIndex) {
        const images = getImagesArray(card);
        if (!images.length) return;
        
        const img = card.querySelector('.property-listing-img');
        if (!img) return;
        
        imageIndices.set(card, newIndex);
        img.src = images[newIndex];
    }
    
    function previousImage(card) {
        const images = getImagesArray(card);
        if (images.length <= 1) return;
        
        const currentIndex = imageIndices.get(card) || 0;
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        updateImage(card, newIndex);
    }
    
    function nextImage(card) {
        const images = getImagesArray(card);
        if (images.length <= 1) return;
        
        const currentIndex = imageIndices.get(card) || 0;
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        updateImage(card, newIndex);
    }
    
    function setupCard(card) {
        imageIndices.set(card, 0);
        
        const prevBtn = card.querySelector('.property-nav.prev');
        const nextBtn = card.querySelector('.property-nav.next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => previousImage(card));
        if (nextBtn) nextBtn.addEventListener('click', () => nextImage(card));
        
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                previousImage(card);
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                nextImage(card);
            }
        });
    }
    
    document.querySelectorAll('.property-listing-card').forEach(setupCard);
}

// Smooth scroll functionality
function initializeSmoothScroll() {
    const infoLink = document.querySelector('.btn-info-link');
    if (infoLink) {
        infoLink.addEventListener('click', function(e) {
            e.preventDefault();
            const aboutSection = document.getElementById('about-gabriel');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializePropertyFilter();
    initializePropertyImageNavigation();
    initializeSmoothScroll();
}); 