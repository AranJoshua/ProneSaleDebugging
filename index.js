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

    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.search-form .search-btn');
        if (btn) {
            const input = btn.closest('.search-form').querySelector('.form-control');
            if (input.value.trim() === '') {
                input.style.borderColor = '#e74c3c';
                input.focus();
                setTimeout(() => input.style.borderColor = '#e5e7eb', 2000);
            } else {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Search';
                setTimeout(() => btn.innerHTML = '<i class="fas fa-search"></i> Search', 2000);
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

    window.ftlistings = (function() {
        'use strict';
        
        const $ = (selector) => document.querySelector(selector);
        const $$ = (selector) => document.querySelectorAll(selector);
        
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
        
        function initializeApp() {
            initializeImageIndices();
            initializeAnimations();
            optimizeImages();
            initializeKeyboardNavigation();
            
            window.ftlistings.toggleFavorite = toggleFavorite;
            window.ftlistings.previousImage = previousImage;
            window.ftlistings.nextImage = nextImage;
            
            console.log('Property listings initialized');
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

    document.addEventListener('DOMContentLoaded', function() {
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
    });
})();

window.addEventListener('DOMContentLoaded', function() {
    var agentInfoStr = localStorage.getItem('dashboardAgentInfo');
    var userInfoStr = localStorage.getItem('dashboardUserInfo');
    var info = null;
    var dashboardType = null;
    if (agentInfoStr) {
        info = JSON.parse(agentInfoStr);
        dashboardType = 'agent';
        localStorage.removeItem('dashboardAgentInfo');
    } else if (userInfoStr) {
        info = JSON.parse(userInfoStr);
        dashboardType = 'user';
        localStorage.removeItem('dashboardUserInfo');
    }
    if (info) {
        var mobileAccount = document.querySelector('.navbar-mobile-account');
        var desktopAccount = document.querySelector('.navbar-actions .btn-account');
        var profileImg = document.createElement('img');
        profileImg.src = info.img || 'img/agent1.jpg';
        profileImg.alt = info.name || 'Profile';
        profileImg.title = info.name || 'Profile';
        profileImg.style.width = '40px';
        profileImg.style.height = '40px';
        profileImg.style.borderRadius = '50%';
        profileImg.style.objectFit = 'cover';
        profileImg.style.cursor = 'pointer';
        profileImg.id = 'dashboardProfileImg';
        if (mobileAccount) {
            mobileAccount.innerHTML = '';
            mobileAccount.appendChild(profileImg.cloneNode(true));
        }
        if (desktopAccount && desktopAccount.parentNode) {
            var parent = desktopAccount.parentNode;
            var img2 = profileImg.cloneNode(true);
            parent.replaceChild(img2, desktopAccount);
        }
        var addProfileClick = function(img) {
            img.addEventListener('click', function() {
                if (dashboardType === 'agent') {
                    window.location.href = 'user-dashboard/user-dashboard.html';
                } else {
                    window.location.href = 'user-dashboard/user-dashboard.html';
                }
            });
        };
        var imgs = document.querySelectorAll('#dashboardProfileImg');
        imgs.forEach(addProfileClick);
    }
});

function showSuccessNotification(message) {
  let notif = document.getElementById('successNotification');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'successNotification';
    notif.style.position = 'fixed';
    notif.style.top = '32px';
    notif.style.left = '50%';
    notif.style.transform = 'translateX(-50%)';
    notif.style.background = 'linear-gradient(90deg, #1e293b 60%, #334155 100%)';
    notif.style.color = '#fff';
    notif.style.fontWeight = '600';
    notif.style.fontSize = '1.08rem';
    notif.style.padding = '1rem 2.2rem';
    notif.style.borderRadius = '12px';
    notif.style.boxShadow = '0 4px 24px rgba(30,41,59,0.13)';
    notif.style.zIndex = '10000';
    notif.style.opacity = '0';
    notif.style.transition = 'opacity 0.3s';
    document.body.appendChild(notif);
  }
  notif.textContent = message;
  notif.style.opacity = '1';
  setTimeout(() => {
    notif.style.opacity = '0';
  }, 2000);
}

function showErrorNotification(message) {
  let notif = document.getElementById('errorNotification');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'errorNotification';
    notif.style.position = 'fixed';
    notif.style.top = '32px';
    notif.style.left = '50%';
    notif.style.transform = 'translateX(-50%)';
    notif.style.background = 'linear-gradient(90deg, #dc2626 60%, #ef4444 100%)';
    notif.style.color = '#fff';
    notif.style.fontWeight = '600';
    notif.style.fontSize = '1.08rem';
    notif.style.padding = '1rem 2.2rem';
    notif.style.borderRadius = '12px';
    notif.style.boxShadow = '0 4px 24px rgba(220,38,38,0.13)';
    notif.style.zIndex = '10000';
    notif.style.opacity = '0';
    notif.style.transition = 'opacity 0.3s';
    document.body.appendChild(notif);
  }
  notif.textContent = message;
  notif.style.opacity = '1';
  setTimeout(() => {
    notif.style.opacity = '0';
  }, 3000);
}

function confirmRemoveFavorite(listingId, favoriteBtnRef) {
  if (document.getElementById('favoritesConfirmDialog')) return;
  const dialog = document.createElement('div');
  dialog.className = 'favorites-confirm-dialog';
  dialog.id = 'favoritesConfirmDialog';
  dialog.innerHTML = `
    <div class="favorites-confirm-card">
      <div class="favorites-confirm-title">Are you sure you want to remove this listing from favorites?</div>
      <div class="favorites-confirm-actions">
        <button class="favorites-confirm-btn" onclick="removeFavorite('${listingId}', this)">Remove</button>
        <button class="favorites-confirm-btn cancel" onclick="closeFavoritesConfirmDialog()">Cancel</button>
      </div>
    </div>
  `;
  // Store the button reference in the dialog for later use
  dialog.favoriteBtnRef = favoriteBtnRef;
  document.body.appendChild(dialog);
}

function closeFavoritesConfirmDialog() {
  const dialog = document.getElementById('favoritesConfirmDialog');
  if (dialog) {
    dialog.classList.add('closing');
    setTimeout(() => {
      dialog.remove();
    }, 250);
  }
}

function removeFavorite(listingId, buttonElement) {
  // Get the favorite button reference from the dialog
  const dialog = document.getElementById('favoritesConfirmDialog');
  const favoriteBtn = dialog ? dialog.favoriteBtnRef : null;
  
  if (favoriteBtn) {
    // Remove the active class and change icon
    favoriteBtn.classList.remove('active');
    const icon = favoriteBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fas');
      icon.classList.add('far');
    }
  }

  // Remove from localStorage collections if it exists
  try {
    let collections = JSON.parse(localStorage.getItem('favoritesCollections') || '[]');
    collections.forEach(collection => {
      collection.listings = collection.listings.filter(listing => listing.id !== listingId);
    });
    localStorage.setItem('favoritesCollections', JSON.stringify(collections));
  } catch (e) {
    console.warn('Error removing from collections:', e);
  }

  showSuccessNotification('Removed from favorites!');
  closeFavoritesConfirmDialog();
}

function showAddToCollectionModal(listingId, favoriteBtnRef) {
  let collections = [];
  try {
    collections = JSON.parse(localStorage.getItem('favoritesCollections') || '[]');
  } catch (e) {}
  
  // Ensure default collections exist if none are found
  if (!collections || collections.length === 0) {
    collections = [
      {
        id: Date.now().toString(),
        name: 'Dream Homes',
        listings: [
          {
            id: 'sample-listing-1',
            title: 'Modern City Apartment',
            address: '1405/61 Macquarie Street, Tirana',
            bedrooms: 2,
            bathrooms: 1,
            parking: 1,
            size: 85,
            price: 450000,
            img: 'thumbnail1.jpg',
          }
        ]
      },
      {
        id: (Date.now() + 1).toString(),
        name: 'Investment Properties',
        listings: []
      }
    ];
    localStorage.setItem('favoritesCollections', JSON.stringify(collections));
  }
  
  const existing = document.getElementById('addToCollectionModal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'addToCollectionModal';
  modal.className = 'add-to-collection-modal-overlay';
  modal.innerHTML = `
    <div class="add-to-collection-modal">
      <button id="closeAddToCollectionModal" class="close-btn" aria-label="Close">&times;</button>       
      <h2>Add to Collection</h2>
      <div style="margin-bottom:1.2rem;">
        <label for="collectionSelect">Choose a collection:</label>
        <div class="add-to-collection-select-wrapper">
          <select id="collectionSelect" class="add-to-collection-select">
            ${collections.map(col => `<option value="${col.id}">${col.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <button id="confirmAddToCollectionBtn" class="add-btn">Add to Collection</button>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('closeAddToCollectionModal').onclick = () => modal.remove();
  document.getElementById('confirmAddToCollectionBtn').onclick = () => {
    const selectedCollectionId = document.getElementById('collectionSelect').value;
    if (!selectedCollectionId) {
      showErrorNotification('Please select a collection');
      return;
    }
    
    // Get current collections
    let collections = [];
    try {
      collections = JSON.parse(localStorage.getItem('favoritesCollections') || '[]');
    } catch (e) {
      collections = [];
    }
    
    // Find the selected collection
    const selectedCollection = collections.find(col => col.id === selectedCollectionId);
    if (!selectedCollection) {
      showErrorNotification('Collection not found');
      return;
    }
    
    // Create listing object from the current property card
    const propertyCard = favoriteBtnRef.closest('.property-card');
    let listing = {
      id: listingId || `listing-${Date.now()}`,
      title: propertyCard.querySelector('.property-price')?.textContent || 'Property',
      address: propertyCard.querySelector('.property-address')?.textContent || '',
      bedrooms: 2, // Default values - could be extracted from card if available
      bathrooms: 1,
      parking: 1,
      size: 85,
      price: '450,000 - 500,000',
      img: 'thumbnail1.jpg',
      type: 'Apartment',
      location: 'Tirana, City Center',
      images: ['thumbnail1.jpg', 'thumbnail2.jpg', 'thumbnail3.jpg']
    };
    
    // Add listing to collection if not already present
    const existingListing = selectedCollection.listings.find(l => l.id === listing.id);
    if (!existingListing) {
      selectedCollection.listings.push(listing);
      localStorage.setItem('favoritesCollections', JSON.stringify(collections));
    }
    
    // Robustly activate the star for this property card
    if (favoriteBtnRef && favoriteBtnRef.querySelector) {
      const icon = favoriteBtnRef.querySelector('i');
      if (icon) {
        icon.className = 'fas fa-star';
        favoriteBtnRef.classList.add('active');
      }
    }
    
    showSuccessNotification(`Added to ${selectedCollection.name}!`);
    modal.remove();
  };
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

// Expose functions globally for inline HTML handlers
window.confirmRemoveFavorite = confirmRemoveFavorite;
window.closeFavoritesConfirmDialog = closeFavoritesConfirmDialog;
window.removeFavorite = removeFavorite;

function attachHomepageFavoriteModals() {
  document.querySelectorAll('.favorite-btn, .property-card-star').forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      let card = btn.closest('.property-card, article');
      let listingId = card ? (card.getAttribute('data-id') || card.getAttribute('data-listing-id') || card.id || '') : '';
      
      // Check if the item is already favorited
      const isAlreadyFavorited = btn.classList.contains('active') || 
                                 btn.querySelector('i')?.classList.contains('fas');
      
      if (isAlreadyFavorited) {
        // Show remove confirmation modal
        if (typeof confirmRemoveFavorite === 'function') {
          confirmRemoveFavorite(listingId, btn);
        } else {
          // Fallback: directly remove the favorite
          btn.classList.remove('active');
          const icon = btn.querySelector('i');
          if (icon) {
            icon.classList.remove('fas');
            icon.classList.add('far');
          }
          showSuccessNotification('Removed from favorites!');
        }
      } else {
        // Show add to collection modal
        showAddToCollectionModal(listingId, btn);
      }
    };
  });
}
document.addEventListener('DOMContentLoaded', attachHomepageFavoriteModals);

window.propertyCardNavigate = function(event) {
    // Prevent navigation if the click was on an image or navigation arrow
    const target = event.target;
    if (
        target.closest('.property-image img') ||
        target.closest('.property-nav')
    ) {
        return; // Do nothing
    }
    // Otherwise, navigate
    window.location.href = 'property-details.html';
};
