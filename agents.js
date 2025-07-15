// AGENTS PAGE JAVASCRIPT

const navLinks = [
    { text: 'Home', href: 'index.html' },
    { text: 'For Sale', href: '#' },
    { text: 'For Rent', href: '#' },
    { text: 'Agents', href: 'agents.html' },
    { text: 'Blog', href: '#' },
    { text: 'Contact', href: '#' }
];

function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const mainNav = document.getElementById('mainNavLinks');
    const mobileNav = document.getElementById('mobileNavLinks');
    
    if (mainNav && mobileNav) {
        mainNav.innerHTML = navLinks.map(link => {
            const isActive = link.href === currentPage || 
                           (currentPage === 'index.html' && link.href === 'index.html');
            return `<li class='nav-item'><a class='nav-link${isActive ? ' active' : ''}' href='${link.href}'>${link.text}</a></li>`;
        }).join('');
        
        mobileNav.innerHTML = navLinks.map(link => {
            const isActive = link.href === currentPage || 
                           (currentPage === 'index.html' && link.href === 'index.html');
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

function initializeFilterModal() {
    const filterModal = document.querySelector('.filters-modal');
    const filterTabs = filterModal.querySelectorAll('.filter-tab');
    const tabUnderline = filterModal.querySelector('.tab-underline');
    const closeBtn = filterModal.querySelector('.filters-close-btn');
    const clearBtn = filterModal.querySelector('.clear-filters-btn');
    const searchBtn = filterModal.querySelector('.filters-search-btn');
    
    function showFilterModal() {
        filterModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function hideFilterModal() {
        filterModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    function moveFilterTabUnderline(idx) {
        if (tabUnderline) {
            tabUnderline.style.transform = `translateX(${idx * 100}%)`;
        }
    }
    
    function clearFilters() {
        const checkboxes = filterModal.querySelectorAll('input[type="checkbox"]');
        const selects = filterModal.querySelectorAll('select');
        const inputs = filterModal.querySelectorAll('input[type="number"]');
        
        checkboxes.forEach(checkbox => checkbox.checked = false);
        selects.forEach(select => select.selectedIndex = 0);
        inputs.forEach(input => input.value = '');
    }
    
    function handleFilterSearch() {
        const filterData = {
            propertyTypes: [],
            priceMin: filterModal.querySelector('.price-row select:first-child').value,
            priceMax: filterModal.querySelector('.price-row select:last-child').value,
            bedrooms: filterModal.querySelector('.single-dropdown select').value,
            bathrooms: filterModal.querySelectorAll('.single-dropdown select')[1]?.value || '',
            carSpaces: filterModal.querySelectorAll('.single-dropdown select')[2]?.value || '',
            tenanted: filterModal.querySelector('#tenanted').checked,
            vacant: filterModal.querySelector('#vacant').checked,
            landAreaMin: filterModal.querySelectorAll('.area-row input')[0]?.value || '',
            landAreaMax: filterModal.querySelectorAll('.area-row input')[1]?.value || '',
            floorAreaMin: filterModal.querySelectorAll('.area-row input')[2]?.value || '',
            floorAreaMax: filterModal.querySelectorAll('.area-row input')[3]?.value || ''
        };
        
        const propertyCheckboxes = filterModal.querySelectorAll('.property-options input[type="checkbox"]:checked');
        propertyCheckboxes.forEach(checkbox => {
            filterData.propertyTypes.push(checkbox.id);
        });
        
        console.log('Filter search data:', filterData);
        hideFilterModal();
    }
    
    filterTabs.forEach((tab, idx) => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            moveFilterTabUnderline(idx);
        });
    });
    
    if (closeBtn) closeBtn.addEventListener('click', hideFilterModal);
    if (clearBtn) clearBtn.addEventListener('click', clearFilters);
    if (searchBtn) searchBtn.addEventListener('click', handleFilterSearch);
    
    filterModal.addEventListener('click', function(e) {
        if (e.target === filterModal) hideFilterModal();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && filterModal.style.display === 'flex') {
            hideFilterModal();
        }
    });
    
    const searchFilterBtns = document.querySelectorAll('.search-filters');
    searchFilterBtns.forEach(btn => btn.addEventListener('click', showFilterModal));
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
    initializeNavigation();
    initializeSearchTabs();
    initializeFilterModal();
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