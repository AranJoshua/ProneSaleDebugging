let searchState = {
  query: '',
  filters: {},
};

function renderHero() {
}

function renderSearchBar() {
}

function showLoading() {
}

function showError() {
}

function initForSale() {
  renderHero();
  renderSearchBar();
}

document.addEventListener('DOMContentLoaded', function() {
  const bannerData = [
    {
      slideClass: 'banner-slide-1',
      h1: 'Find Your Perfect Home',
      p: 'Explore a wide range of properties for sale and rent throughout Albania.'
    }
  ];
  const bannerCarouselInner = document.getElementById('bannerCarouselInner');
  if (bannerCarouselInner) {
    bannerCarouselInner.innerHTML = bannerData.map((item, idx) => `
      <div class="carousel-item${idx === 0 ? ' active' : ''}">
        <div class="banner-slide ${item.slideClass}">
          <div class="banner-content">
            <h1>${item.h1}</h1>
            <p>${item.p}</p>
            <div class="search-form search-form-tabs">
              <div class="search-tabs" id="forSaleSearchTabs">
                <button class="search-tab active" data-tab="buy" type="button">Buy</button>
                <button class="search-tab" data-tab="rent" type="button">Rent</button>
                <button class="search-tab" data-tab="agents" type="button">Agents</button>
                <div class="tab-underline"></div>
              </div>
              <div class="search-bar-group">
                <input type="text" class="form-control search-input" placeholder="Search suburb, postcode or state" aria-label="Search properties">
                <button type="button" class="btn btn-outline-secondary search-filters"><i class="fas fa-sliders-h"></i> Filters</button>
                <button type="button" class="btn btn-primary search-btn"><i class="fas fa-search"></i> Search</button>
                <div class="search-buttons-row">
                  <button type="button" class="btn btn-outline-secondary search-filters"><i class="fas fa-sliders-h"></i> Filters</button>
                  <button type="button" class="btn btn-primary search-btn"><i class="fas fa-search"></i> Search</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  const allTabs = document.querySelectorAll('.search-tabs');
  allTabs.forEach((tabsContainer) => {
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

    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        moveUnderline(idx);
        if (tab.dataset.tab === 'agents') {
          input.placeholder = 'Search for agents by name, location, or agency';
          if (filtersBtn) filtersBtn.style.display = 'none';
          if (mobileFiltersBtn) mobileFiltersBtn.style.display = 'none';
        } else {
          input.placeholder = 'Search suburb, postcode or state';
          if (filtersBtn) filtersBtn.style.display = '';
          if (mobileFiltersBtn) mobileFiltersBtn.style.display = '';
        }
      });
    });
    moveUnderline(0);
    input.placeholder = 'Search suburb, postcode or state';
    if (filtersBtn) filtersBtn.style.display = '';
    if (mobileFiltersBtn) mobileFiltersBtn.style.display = '';
  });

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
        const content = modal.querySelector('.filters-container');
        if (content) content.classList.add('filters-container-animate-in');
        const activeTab = modal.querySelector('.filter-tab.active');
        updateUnderlinePosition(activeTab);
        updateTenantedVacantVisibility();
      }, 10);
    }
    function close() {
      const content = modal.querySelector('.filters-container');
      if (content) content.classList.remove('filters-container-animate-in');
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 320);
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
    tabs.forEach((tab, idx) => {
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
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) close();
    });
    clearBtn.addEventListener('click', clear);
    searchBtn.addEventListener('click', close);
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('.search-filters');
      if (btn) {
        e.preventDefault();
        open();
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        close();
      }
    });
    return { open, close, clear };
  })();

  // --- Property Image Navigation for For Sale Listings ---
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
  initializePropertyImageNavigation();
}); 