const navLinks = [
    { text: 'Home', href: 'index.html' },
    { text: 'For Sale', href: 'for-sale.html' },
    { text: 'For Rent', href: 'for-rent.html' },
    { text: 'Agents', href: 'agents.html' },
    { text: 'Blog', href: 'blog.html' }
];

function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const forRentPages = ['for-rent.html', 'property-rent-details.html'];
    const mainNav = document.getElementById('mainNavLinks');
    const mobileNav = document.getElementById('mobileNavLinks');
    
    if (mainNav && mobileNav) {
        mainNav.innerHTML = navLinks.map(link => {
            let isActive = false;
            if (link.href === 'for-rent.html') {
                isActive = forRentPages.includes(currentPage);
            } else {
                isActive = (
                    link.href === currentPage ||
                    (currentPage === 'index.html' && link.href === 'index.html') ||
                    (link.href === 'agents.html' && (currentPage === 'agents.html' || currentPage === 'agent-profile.html'))
                );
            }
            return `<li class='nav-item'><a class='nav-link${isActive ? ' active' : ''}' href='${link.href}'>${link.text}</a></li>`;
        }).join('');
        
        mobileNav.innerHTML = navLinks.map(link => {
            let isActive = false;
            if (link.href === 'for-rent.html') {
                isActive = forRentPages.includes(currentPage);
            } else {
                isActive = (
                    link.href === currentPage ||
                    (currentPage === 'index.html' && link.href === 'index.html') ||
                    (link.href === 'agents.html' && (currentPage === 'agents.html' || currentPage === 'agent-profile.html'))
                );
            }
            return `<li><a href='${link.href}'${isActive ? ' class="active"' : ''}>${link.text}</a></li>`;
        }).join('');
    }
}

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
            renderPropertyPage(1); // Ensure pagination is updated immediately after filter change
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

let leafletMap;
let leafletMarkers = [];

function dummyGeocode(address) {
    // Dummy geocode: generate random coordinates within Tirana
    const baseLat = 41.3275;
    const baseLng = 19.8187;
    const hash = Array.from(address).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const lat = baseLat + ((hash % 100) - 50) * 0.0015;
    const lng = baseLng + ((hash % 100) - 50) * 0.0015;
    return { lat, lng };
}

function clearLeafletMarkers() {
    leafletMarkers.forEach(marker => marker.remove());
    leafletMarkers = [];
}

function updateLeafletMapMarkers() {
    if (!leafletMap) return;
    clearLeafletMarkers();
    const propertyList = document.getElementById('gabrielPropertyList');
    const selected = document.getElementById('propertyDropdownSelected');
    const type = selected.textContent.trim().toLowerCase().includes('rent') ? 'rent' : 'sale';
    const visibleCards = Array.from(propertyList.querySelectorAll('.property-listing-card'))
        .filter(card => card.style.display !== 'none' && card.getAttribute('data-type') === type);
    if (visibleCards.length === 0) {
        // Center map to Tirana if no properties
        leafletMap.setView([41.3275, 19.8187], 13);
        return;
    }
    let bounds = [];
    visibleCards.forEach(card => {
        const addressDiv = card.querySelector('.property-listing-address');
        if (addressDiv) {
            const address = addressDiv.textContent.trim();
            const { lat, lng } = dummyGeocode(address);
            const marker = L.marker([lat, lng]).addTo(leafletMap).bindPopup(address);
            leafletMarkers.push(marker);
            bounds.push([lat, lng]);
        }
    });
    if (bounds.length > 0) {
        leafletMap.fitBounds(bounds, { padding: [30, 30] });
    }
}

function initializeLeafletMap() {
    leafletMap = L.map('propertyMap').setView([41.3275, 19.8187], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap);
    updateLeafletMapMarkers();
}

const originalUpdatePropertyCount = initializePropertyFilter;
initializePropertyFilter = function() {
    originalUpdatePropertyCount();
    // Listen for filter changes to update map
    const menu = document.getElementById('propertyDropdownMenu');
    const options = menu.querySelectorAll('.property-dropdown-option');
    function triggerMapUpdate() {
        setTimeout(updateLeafletMapMarkers, 100);
    }
    options.forEach(option => {
        option.addEventListener('click', triggerMapUpdate);
    });
    // Also update on page load
    triggerMapUpdate();
};

// PAGINATION LOGIC FOR PROPERTY LISTINGS
const PROPERTY_CARDS_PER_PAGE = 5;
let currentPage = 1;

function getAllPropertyCards() {
    // Get all property card HTML as array
    const propertyList = document.getElementById('gabrielPropertyList');
    return Array.from(propertyList.children).filter(
        el => el.classList.contains('property-listing-card')
    );
}

function renderPropertyPage(page) {
    const propertyList = document.getElementById('gabrielPropertyList');
    const allCards = getAllPropertyCards();
    // Only count visible cards (filtered by type)
    const selected = document.getElementById('propertyDropdownSelected');
    const type = selected.textContent.trim().toLowerCase().includes('rent') ? 'rent' : 'sale';
    const visibleCards = allCards.filter(card => card.getAttribute('data-type') === type);
    // If there are no visible cards, set totalPages to 1 and hide pagination
    let totalPages = visibleCards.length === 0 ? 1 : Math.ceil(visibleCards.length / PROPERTY_CARDS_PER_PAGE);
    currentPage = Math.max(1, Math.min(page, totalPages));

    // Hide all, then show only those for this page
    visibleCards.forEach((card, idx) => {
        if (idx >= (currentPage - 1) * PROPERTY_CARDS_PER_PAGE && idx < currentPage * PROPERTY_CARDS_PER_PAGE) {
            card.style.display = '';
            // Add microanimation class
            card.classList.remove('fade-in-listing');
            void card.offsetWidth; // trigger reflow for restart
            card.classList.add('fade-in-listing');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in-listing');
        }
    });
    // Hide all cards that are not of the selected type
    allCards.forEach(card => {
        if (card.getAttribute('data-type') !== type) {
            card.style.display = 'none';
            card.classList.remove('fade-in-listing');
        }
    });

    // --- Update property count display for pagination ---
    const propertyCountDisplay = document.getElementById('propertyCountDisplay');
    const noPropertiesMessage = document.getElementById('noPropertiesMessage');
    if (visibleCards.length === 0) {
        propertyCountDisplay.style.display = 'none';
        noPropertiesMessage.style.display = 'block';
        noPropertiesMessage.textContent = `This agent has no properties posted for ${type}.`;
    } else {
        propertyCountDisplay.style.display = '';
        noPropertiesMessage.style.display = 'none';
        const startIdx = (currentPage - 1) * PROPERTY_CARDS_PER_PAGE + 1;
        const endIdx = Math.min(currentPage * PROPERTY_CARDS_PER_PAGE, visibleCards.length);
        propertyCountDisplay.textContent = `Showing ${startIdx}-${endIdx} out of ${visibleCards.length} properties for ${type}`;
    }
    // --- End update ---

    renderPaginationControls(totalPages, visibleCards.length);
    initializePropertyImageNavigation && initializePropertyImageNavigation(); // Re-init image nav for visible cards
    updateLeafletMapMarkers && updateLeafletMapMarkers();

    // Smooth scroll to top of listings
    const listingsSection = document.querySelector('.listings-section');
    if (listingsSection) {
        listingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function renderPaginationControls(totalPages, visibleCount) {
    const pagination = document.getElementById('propertyPagination');
    if (!pagination) return;
    // Hide pagination if there are no visible cards
    if (visibleCount === 0) {
        pagination.innerHTML = '';
        pagination.style.display = 'none';
        return;
    } else {
        pagination.style.display = '';
    }
    let html = '';
    html += `<button class="pagination-btn" id="paginationPrev" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-page${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="pagination-btn" id="paginationNext" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>`;
    pagination.innerHTML = html;

    // Add event listeners
    pagination.querySelectorAll('.pagination-page').forEach(btn => {
        btn.addEventListener('click', e => {
            const page = parseInt(btn.getAttribute('data-page'));
            renderPropertyPage(page);
        });
    });
    const prevBtn = document.getElementById('paginationPrev');
    const nextBtn = document.getElementById('paginationNext');
    if (prevBtn) prevBtn.addEventListener('click', () => renderPropertyPage(currentPage - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => renderPropertyPage(currentPage + 1));
}

(function() {
  const emailBtn = document.querySelector('.btn-email');
  const modal = document.getElementById('contactModal');
  const closeBtn = document.getElementById('contactModalClose');
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('contactFormSuccess');

  // Helper to get scrollbar width
  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function openModal() {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('contact-modal-animate');
    }, 10);
    const scrollBarWidth = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = scrollBarWidth + 'px';
    }
  }

  function closeModal() {
    modal.classList.remove('contact-modal-animate');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      form.reset();
      successMsg.style.display = 'none';
    }, 300);
  }

  // Professional notification (copied from login.js, slightly adapted)
  function showSuccessNotification(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      z-index: 10000;
      font-size: 1.08rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.7rem;
      animation: slideInRight 0.3s ease-out;
    `;
    // Add checkmark icon
    const icon = document.createElement('span');
    icon.innerHTML = '<svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#fff"/><path d="M6 10.5L9 13.5L14 8.5" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    successDiv.prepend(icon);
    document.body.appendChild(successDiv);
    setTimeout(() => {
      successDiv.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        successDiv.remove();
      }, 300);
    }, 2200);
  }

  if (emailBtn && modal && closeBtn && form) {
    emailBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
    closeBtn.addEventListener('click', function() {
      closeModal();
    });
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const sendBtn = form.querySelector('.contact-form-send-btn');
      sendBtn.classList.add('sending');
      sendBtn.disabled = true;
      // Simulate sending (replace with backend call later)
      setTimeout(function() {
        // Animate checkmark on button
        sendBtn.classList.remove('sending');
        sendBtn.classList.add('sent');
        sendBtn.innerHTML = '<span class="btn-checkmark"><svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#fff"/><path d="M6 10.5L9 13.5L14 8.5" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span> Sent!';
        setTimeout(function() {
          sendBtn.classList.remove('sent');
          sendBtn.innerHTML = 'Send';
          sendBtn.disabled = false;
          closeModal();
          // Removed showSuccessNotification
        }, 900);
      }, 900);
    });
  }

  // Add notification animation keyframes if not present
  if (!document.getElementById('contact-success-animations')) {
    const style = document.createElement('style');
    style.id = 'contact-success-animations';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      .contact-form-send-btn.sent {
        background: #10b981 !important;
        color: #fff !important;
        position: relative;
        transition: background 0.2s, color 0.2s;
      }
      .btn-checkmark {
        display: inline-flex;
        align-items: center;
        margin-right: 0.5em;
      }
    `;
    document.head.appendChild(style);
  }
})();

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializePropertyFilter();
    initializePropertyImageNavigation();
    initializeSmoothScroll();
    initializeLeafletMap();
    // PAGINATION INIT
    renderPropertyPage(1);
}); 