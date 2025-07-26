let collections = JSON.parse(localStorage.getItem('favoritesCollections') || '[]');
let currentCollectionId = null;

const collectionsGrid = document.getElementById('collectionsGrid');
const favoritesGrid = document.getElementById('favoritesGrid');
const collectionViewHeader = document.getElementById('collectionViewHeader');
const selectedCollectionTitle = document.getElementById('selectedCollectionTitle');
const backToCollectionsBtn = document.getElementById('backToCollectionsBtn');

function saveCollections() {
  localStorage.setItem('favoritesCollections', JSON.stringify(collections));
}

function ensureDefaultCollection() {
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
    saveCollections();
  }
}

function renderCollections(newCollectionId = null) {
  collectionsGrid.innerHTML = '';
  if (collections.length === 0) {
    collectionsGrid.innerHTML = '<div style="color:#888;font-size:1.1rem;">No collections yet.</div>';
    return;
  }
  collections.forEach((col, idx) => {
    const card = document.createElement('div');
    card.className = 'collection-card';
    
    if (newCollectionId && col.id === newCollectionId) {
      card.classList.add('new-collection');
    }
    
    card.onclick = () => openCollection(col.id);
    if (col.listings && col.listings.length > 0) {
      card.innerHTML += `
        <div class="collection-thumb filled-thumb">
          <img src="../img/${col.listings[0].img}" alt="${col.listings[0].title}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:14px 14px 0 0;">
        </div>
      `;
    } else if (idx === 0) {
      card.innerHTML += `
        <div class="collection-thumb filled-thumb">
          <img src="../img/thumbnail1.jpg" alt="Sample Listing" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:14px 14px 0 0;">
        </div>
      `;
    } else {
      card.innerHTML += `
        <div class="collection-thumb empty-thumb" style="display:flex;align-items:center;justify-content:center;background:#f3f4f6;flex-direction:column;">
          <i class="fas fa-home" style="font-size:2.2rem;color:#bdbdbd;"></i>
          <div style="color:#6b7280;font-size:1.05rem;margin-top:0.7rem;text-align:center;max-width:90%;">Tap the star <span style='color:#fbbf24;'>★</span> on any property to add it to this Collection.</div>
        </div>
      `;
    }
    card.innerHTML += `<div class="collection-info"><span class="collection-title">${col.name}</span><button class="collection-delete-btn" title="Delete Collection" onclick="event.stopPropagation(); confirmDeleteCollection('${col.id}')"><i class="fas fa-trash"></i></button></div>`;
    collectionsGrid.appendChild(card);
  });
  
  if (newCollectionId) {
    setTimeout(() => {
      const newCard = document.querySelector(`.collection-card.new-collection`);
      if (newCard) {
        newCard.classList.remove('new-collection');
      }
    }, 400);
  }
}

// --- Add Collection Modal Logic ---
const addCollectionModal = document.getElementById('addCollectionModal');
const addCollectionForm = document.getElementById('addCollectionForm');
function showAddCollectionModal() {
  addCollectionModal.style.display = 'flex';
  document.getElementById('collectionName').value = '';
}
function closeAddCollectionModal() {
  addCollectionModal.style.display = 'none';
}
addCollectionForm.onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('collectionName').value.trim();
  if (!name) return;
  const newCollectionId = Date.now().toString();
  collections.push({ id: newCollectionId, name, listings: [] });
  saveCollections();
  renderCollections(newCollectionId);
  closeAddCollectionModal();
};

// --- Open Collection View ---
function openCollection(id) {
  currentCollectionId = id;
  const col = collections.find(c => c.id === id);
  if (!col) return;
  
  // Animate collections section sliding out
  const collectionsSection = collectionsGrid.parentElement;
  collectionsSection.classList.add('sliding-out');
  
  setTimeout(() => {
    // Hide collections and show collection view
    collectionsSection.style.display = 'none';
    collectionViewHeader.style.display = 'flex';
    selectedCollectionTitle.textContent = col.name;
    
    // Clear and render favorites
    favoritesGrid.innerHTML = '';
    renderFavorites(col.listings);
    
    // Reset collections section for next time
    collectionsSection.classList.remove('sliding-out');
  }, 250); // Match the CSS transition duration
}

backToCollectionsBtn.onclick = function() {
  currentCollectionId = null;
  
  // Animate collection view sliding out
  collectionViewHeader.style.display = 'none';
  favoritesGrid.innerHTML = '';
  
  // Show collections section with slide-in animation
  const collectionsSection = collectionsGrid.parentElement;
  collectionsSection.style.display = '';
  collectionsSection.classList.add('sliding-in');
  
  // Remove animation class after animation completes
  setTimeout(() => {
    collectionsSection.classList.remove('sliding-in');
  }, 300); // Match the CSS animation duration
};

// --- Render Favorites in Collection ---
function renderFavorites(listings) {
  favoritesGrid.innerHTML = '';
  
  // Reset animation state for the grid
  favoritesGrid.style.animation = 'none';
  favoritesGrid.offsetHeight; // Trigger reflow
  
  // If viewing the first collection, show 3 sample cards for demo
  const isFirstCollection = collections.length > 0 && currentCollectionId === collections[0].id;
  if (isFirstCollection) {
    const sampleListings = [
      {
        id: 'sample-listing-1',
        title: 'Modern City Apartment',
        address: '1405/61 Macquarie Street, Tirana',
        bedrooms: 2,
        bathrooms: 1,
        parking: 1,
        size: 85,
        price: '450,000 - 500,000',
        img: 'thumbnail1.jpg',
        banner: null,
        type: 'Apartment',
        location: 'Tirana, City Center',
        images: ['thumbnail1.jpg', 'thumbnail2.jpg', 'thumbnail3.jpg']
      },
      {
        id: 'sample-listing-2',
        title: 'Luxury Villa with Pool',
        address: 'Durrës, Beachfront',
        bedrooms: 4,
        bathrooms: 3,
        parking: 2,
        size: 250,
        price: '750,000 - 850,000',
        img: 'thumbnail1.jpg',
        banner: { logo: 'PE', name: 'PrimeEstate' },
        type: 'Villa',
        location: 'Durrës, Beachfront',
        images: ['thumbnail1.jpg', 'thumbnail2.jpg', 'thumbnail3.jpg']
      },
      {
        id: 'sample-listing-3',
        title: 'Cozy Suburban House',
        address: 'Rruga e Kavajës, Tirana',
        bedrooms: 3,
        bathrooms: 2,
        parking: 1,
        size: 120,
        price: '320,000 - 350,000',
        img: 'thumbnail2.jpg',
        banner: null,
        type: 'House',
        location: 'Tirana, Suburbs',
        images: ['thumbnail2.jpg', 'thumbnail1.jpg', 'thumbnail3.jpg']
      }
    ];
    sampleListings.forEach(listing => renderPropertyCard(listing));
    
    // Trigger the slide-in animation
    setTimeout(() => {
      favoritesGrid.style.animation = 'favoritesGridSlideIn 0.3s ease-out forwards';
    }, 30);
    return;
  }
  // Otherwise, show real listings for the selected collection
  if (!listings || listings.length === 0) {
    renderEmptyState();
    // Trigger the slide-in animation for empty state
    setTimeout(() => {
      favoritesGrid.style.animation = 'favoritesGridSlideIn 0.3s ease-out forwards';
    }, 30);
    return;
  }
  listings.forEach(listing => renderPropertyCard(listing));
  
  // Trigger the slide-in animation
  setTimeout(() => {
    favoritesGrid.style.animation = 'favoritesGridSlideIn 0.3s ease-out forwards';
  }, 30);
}

function renderPropertyCard(listing) {
  const card = document.createElement('article');
  card.className = 'property-card loading';
  card.setAttribute('data-images', JSON.stringify(listing.images || []));
  if (listing.banner) {
    card.innerHTML += `
      <div class="property-banner">
        <div class="banner-brand">
          <div class="banner-logo">${listing.banner.logo}</div>
          <div class="banner-name">${listing.banner.name}</div>
        </div>
      </div>
    `;
  }
  card.innerHTML += `
    <div class="property-image">
      <img src="../img/${listing.img}" alt="${listing.title}" loading="lazy" width="400" height="400">
      <button class="property-nav prev" type="button" aria-label="Previous image">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="property-nav next" type="button" aria-label="Next image">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="property-content">
      <div class="property-price-row">
        <div class="property-price">For Sale $${listing.price}</div>
        <button class="favorite-btn active" type="button" aria-label="Remove from favorites" onclick="confirmRemoveFavorite('${listing.id}')">
          <i class="fas fa-star" aria-hidden="true"></i>
        </button>
      </div>
      <div class="property-address">${listing.address}</div>
      <div class="property-specs-row">
        <div class="property-specs">
          <div class="property-spec">
            <i class="fas fa-bed" aria-hidden="true"></i>
            <span>${listing.bedrooms}</span>
          </div>
          <div class="property-spec">
            <i class="fas fa-bath" aria-hidden="true"></i>
            <span>${listing.bathrooms}</span>
          </div>
          <div class="property-spec">
            <i class="fas fa-car" aria-hidden="true"></i>
            <span>${listing.parking}</span>
          </div>
          <div class="property-spec">
            <i class="fas fa-ruler-combined" aria-hidden="true"></i>
            <span>${listing.size}m²</span>
          </div>
          <div class="property-type-info">
            <span class="bullet" aria-hidden="true">•</span>
            <span>${listing.type}</span>
          </div>
        </div>
      </div>
    </div>
  `;
  favoritesGrid.appendChild(card);
}

// --- Empty State ---
function renderEmptyState() {
  favoritesGrid.innerHTML = `
    <div class="favorites-empty-state">
      <div class="favorites-empty-title">No favorites in this collection yet</div>
      <div class="favorites-empty-desc">Add listings to this collection by pressing the star button on property cards.<br>Start searching for properties now!</div>
      <button class="favorites-empty-search-btn" onclick="goToHomepageSearch()">Search</button>
    </div>
  `;
}
function goToHomepageSearch() {
  window.location.href = 'index.html#search';
}

// --- Confirmation Dialog for Removing Favorite ---
function confirmRemoveFavorite(listingId) {
  if (document.getElementById('favoritesConfirmDialog')) return;
  const dialog = document.createElement('div');
  dialog.className = 'favorites-confirm-dialog';
  dialog.id = 'favoritesConfirmDialog';
  dialog.innerHTML = `
    <div class="favorites-confirm-card">
      <div class="favorites-confirm-title">Are you sure you want to remove this listing from favorites?</div>
      <div class="favorites-confirm-actions">
        <button class="favorites-confirm-btn" onclick="removeFavorite('${listingId}')">Remove</button>
        <button class="favorites-confirm-btn cancel" onclick="closeFavoritesConfirmDialog()">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
}
function closeFavoritesConfirmDialog() {
  const dialog = document.getElementById('favoritesConfirmDialog');
  if (dialog) {
    dialog.classList.add('closing');
    setTimeout(() => {
      dialog.remove();
    }, 250); // Match the animation duration
  }
}
function removeFavorite(listingId) {
  // Find the card in the DOM
  const card = Array.from(favoritesGrid.children).find(el => {
    // Try to match by data-images or by a unique id if available
    return el.outerHTML.includes(listingId);
  });
  if (card) {
    card.style.transition = 'opacity 0.5s, transform 0.5s';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-30px)';
    setTimeout(() => {
      card.remove();
      closeFavoritesConfirmDialog();
    }, 500);
  } else {
    closeFavoritesConfirmDialog();
  }
  // Do NOT update the underlying data for demo purposes
}

// --- Delete Collection Logic ---
function confirmDeleteCollection(collectionId) {
  if (document.getElementById('favoritesConfirmDialog')) return;
  const dialog = document.createElement('div');
  dialog.className = 'favorites-confirm-dialog';
  dialog.id = 'favoritesConfirmDialog';
  dialog.innerHTML = `
    <div class="favorites-confirm-card">
      <div class="favorites-confirm-title">Are you sure you want to delete this collection?<br><span style='font-weight:400;font-size:0.97rem;color:#6b7280;'>All favorites in this collection will be removed.</span></div>
      <div class="favorites-confirm-actions">
        <button class="favorites-confirm-btn" onclick="deleteCollection('${collectionId}')">Delete</button>
        <button class="favorites-confirm-btn cancel" onclick="closeFavoritesConfirmDialog()">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
}
function deleteCollection(collectionId) {
  collections = collections.filter(c => c.id !== collectionId);
  saveCollections();
  renderCollections(null);
  closeFavoritesConfirmDialog();
}

// --- Initialization ---
function initFavoritesTab() {
  renderCollections(null);
  collectionViewHeader.style.display = 'none';
  
  // Ensure collections section starts in the correct state
  const collectionsSection = collectionsGrid.parentElement;
  collectionsSection.classList.remove('sliding-out', 'sliding-in');
  
  // Modal close logic
  document.getElementById('addCollectionModal').addEventListener('click', function(e) {
    if (e.target === this) closeAddCollectionModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeAddCollectionModal();
    if (e.key === 'Escape') closeFavoritesConfirmDialog();
  });
}

// --- Expose functions for inline HTML handlers ---
window.showAddCollectionModal = showAddCollectionModal;
window.closeAddCollectionModal = closeAddCollectionModal;
window.confirmRemoveFavorite = confirmRemoveFavorite;
window.closeFavoritesConfirmDialog = closeFavoritesConfirmDialog;
window.removeFavorite = removeFavorite;
window.goToHomepageSearch = goToHomepageSearch;
window.confirmDeleteCollection = confirmDeleteCollection;
window.deleteCollection = deleteCollection;

// --- Run on load if on favorites tab ---
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('favorites')) {
    ensureDefaultCollection();
    initFavoritesTab();
  }
}); 