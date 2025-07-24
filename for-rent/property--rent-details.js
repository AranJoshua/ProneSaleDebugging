// Property Detail Page JS
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
    // Treat both 'for-sale.html' and 'property-details.html' as active for 'For Sale'
    function isForSaleActive(link) {
        if (link.href === 'for-sale.html') {
            return currentPage === 'for-sale.html' || currentPage === 'property-details.html';
        }
        return link.href === currentPage;
    }
    if (mainNav && mobileNav) {
        mainNav.innerHTML = navLinks.map(link => {
            const isActive = isForSaleActive(link);
            return `<li class='nav-item'><a class='nav-link${isActive ? ' active' : ''}' href='${link.href}'>${link.text}</a></li>`;
        }).join('');
        mobileNav.innerHTML = navLinks.map(link => {
            const isActive = isForSaleActive(link);
            return `<li><a href='${link.href}'${isActive ? ' class="active"' : ''}>${link.text}</a></li>`;
        }).join('');
    }

    // Interactive Gallery
    const propertyImages = [
        'img/thumbnail1.jpg',
        'img/thumbnail2.jpg',
        'img/thumbnail3.jpg'
    ];
    let currentPropertyImgIndex = 0;

    function propertyDetailsNav(direction) {
        if (direction === 'prev') {
            currentPropertyImgIndex = (currentPropertyImgIndex === 0) ? propertyImages.length - 1 : currentPropertyImgIndex - 1;
        } else if (direction === 'next') {
            currentPropertyImgIndex = (currentPropertyImgIndex === propertyImages.length - 1) ? 0 : currentPropertyImgIndex + 1;
        }
        document.getElementById('mainGalleryImg').src = propertyImages[currentPropertyImgIndex];
    }
    window.propertyDetailsNav = propertyDetailsNav;

    const emailBtn = document.getElementById('contactAgentBtn');
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

// Leaflet Map Initialization (Best Practice)
function initializeLeafletMap() {
    if (window.L && document.getElementById('propertyMap')) {
        var map = L.map('propertyMap').setView([41.3231, 19.4414], 13); // Durrës, Albania
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([41.3231, 19.4414]).addTo(map)
            .bindPopup('Durrës, Beachfront')
            .openPopup();
    } else {
        console.error('Leaflet library or map container not found.');
    }
}

// Smooth fade-in microanimation on page load
window.addEventListener('DOMContentLoaded', function() {
    var main = document.querySelector('.property-detail-main');
    if (main) {
        // Remove animation class if present (for hot reloads), then re-add
        main.classList.remove('fade-in-animate');
        // Trigger reflow to restart animation if needed
        void main.offsetWidth;
        main.classList.add('fade-in-animate');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    initializeLeafletMap();
}); 