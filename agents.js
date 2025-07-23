const navLinks = [
    { text: 'Home', href: 'index.html' },
    { text: 'For Sale', href: 'for-sale.html' },
    { text: 'For Rent', href: '#' },
    { text: 'Agents', href: 'agents.html' },
    { text: 'Blog', href: 'blog.html' }
];

function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const mainNav = document.getElementById('mainNavLinks');
    const mobileNav = document.getElementById('mobileNavLinks');
    
    if (mainNav && mobileNav) {
        mainNav.innerHTML = navLinks.map(link => {
            const isActive = link.href === currentPage;
            return `<li class='nav-item'><a class='nav-link${isActive ? ' active' : ''}' href='${link.href}'>${link.text}</a></li>`;
        }).join('');
        
        mobileNav.innerHTML = navLinks.map(link => {
            const isActive = link.href === currentPage;
            return `<li><a href='${link.href}'${isActive ? ' class="active"' : ''}>${link.text}</a></li>`;
        }).join('');
    }
}

function initializeSearchTabs() {
    const tabsContainer = document.getElementById('agentsSearchTabs');
    if (!tabsContainer) return;
    
    const tabs = tabsContainer.querySelectorAll('.search-tab');
    const underline = tabsContainer.querySelector('.tab-underline');
    const barGroup = tabsContainer.parentElement.querySelector('.search-bar-group');
    const input = barGroup.querySelector('.search-input');
    const filtersBtn = barGroup.querySelector('.search-filters');
    const mobileFiltersBtn = barGroup.querySelector('.search-buttons-row .search-filters');
    
    function moveUnderline(idx) {
        if (underline) {
            underline.style.transform = `translateX(${idx * 100}%)`;
        }
    }
    
    function updateSearchInterface(tabType) {
        if (tabType === 'agents') {
            input.placeholder = 'Search for agents by name, location, or agency';
            if (filtersBtn) filtersBtn.style.display = 'none';
            if (mobileFiltersBtn) mobileFiltersBtn.style.display = 'none';
        } else {
            input.placeholder = 'Search suburb, postcode or state';
            if (filtersBtn) filtersBtn.style.display = '';
            if (mobileFiltersBtn) mobileFiltersBtn.style.display = '';
        }
    }
    
    tabs.forEach((tab, idx) => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            moveUnderline(idx);
            updateSearchInterface(tab.dataset.tab);
        });
    });
    
    moveUnderline(2);
    updateSearchInterface('agents');
}

function initializeAgentCards() {
    const agentCards = document.querySelectorAll('.agent-card');
    
    agentCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.agent-contact') || e.target.closest('button')) {
                return;
            }
            
            if (!this.closest('a')) {
                console.log('Navigate to agent profile');
            }
        });
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        card.setAttribute('tabindex', '0');
    });
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        const activeTab = document.querySelector('.search-tab.active');
        const searchType = activeTab ? activeTab.dataset.tab : 'agents';
        
        if (!searchTerm) {
            console.log('No search term entered');
            return;
        }
        
        console.log('Search:', { term: searchTerm, type: searchType });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // --- Filter Modal Logic (copied and adapted from index.js for pixel-perfect underline and modal behavior) ---
    window.filtersModal = (function() {
        const modal = document.querySelector('.filters-modal');
        if (!modal) return;
        
        const closeBtn = modal.querySelector('.filters-close-btn');
        const clearBtn = modal.querySelector('.clear-filters-btn');
        const searchBtn = modal.querySelector('.filters-search-btn');
        const tabs = modal.querySelectorAll('.filter-tab');
        const underline = modal.querySelector('.tab-underline');
        
        function open() {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = scrollbarWidth + 'px';
            }
            modal.style.display = 'flex';
            setTimeout(() => {
                const activeTab = modal.querySelector('.filter-tab.active');
                updateUnderlinePosition(activeTab);
                updateTenantedVacantVisibility();
            }, 10);
        }
        
        function close() {
            // Remove animation class from content, then hide after transition
            const content = modal.querySelector('.filters-container');
            if (content) content.classList.remove('filters-container-animate-in');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }, 320); // match CSS transition duration
        }
        
        function clear() {
            modal.querySelectorAll('.filters-form-check-input, .filters-form-select, .filters-form-control').forEach(input => {
                if (input.type === 'checkbox') input.checked = false;
                else input.value = '';
            });
        }
        
        function updateUnderlinePosition(tab) {
            if (!tab || !underline) return;
            const tabRect = tab.getBoundingClientRect();
            const tabsRect = tab.parentElement.getBoundingClientRect();
            const left = tabRect.left - tabsRect.left;
            const width = tabRect.width;
            underline.style.left = `${left}px`;
            underline.style.width = `${width}px`;
        }

        function updateTenantedVacantVisibility() {
            const tenantedVacantRow = modal.querySelector('.tenanted-vacant-row');
            const activeTab = modal.querySelector('.filter-tab.active');
            if (!tenantedVacantRow || !activeTab) return;
            if (activeTab.dataset.tab === 'rent') {
                tenantedVacantRow.style.display = 'none';
            } else {
                tenantedVacantRow.style.display = '';
            }
        }
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                updateUnderlinePosition(this);
                updateTenantedVacantVisibility();
            });
        });
        
        window.addEventListener('resize', () => {
            const activeTab = modal.querySelector('.filter-tab.active');
            updateUnderlinePosition(activeTab);
            updateTenantedVacantVisibility();
        });
        
        if (closeBtn) closeBtn.addEventListener('click', close);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) close();
        });
        if (clearBtn) clearBtn.addEventListener('click', clear);
        if (searchBtn) searchBtn.addEventListener('click', close);
        
        // Open modal on filter button clicks
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.search-filters');
            if (btn) {
                e.preventDefault();
                open();
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                close();
            }
        });
        
        return { open, close, clear };
    })();
    initializeNavigation();
    initializeSearchTabs();
    initializeAgentCards();
    initializeSearch();
});

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        console.log('Agents page became visible');
    }
});

window.addEventListener('resize', function() {
    console.log('Window resized');
});

window.agentsPage = {
    initializeNavigation,
    initializeSearchTabs,
    initializeFilterModal,
    initializeAgentCards,
    initializeSearch
}; 