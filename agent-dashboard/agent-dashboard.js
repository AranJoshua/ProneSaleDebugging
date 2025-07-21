function closeSidebarIfMobile() {
    if (window.innerWidth <= 768) {
        toggleSidebar(false);
    }
}

function showSection(sectionName) {
    // Close notifications when navigating
    const modal = document.getElementById('notificationsModal');
    if (modal && modal.style.display === 'block') {
        closeNotificationsModal();
    }
    
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    // Show selected section (including 'favorites')
    var targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    // Find the nav-item that triggered this, if possible
    if (showSection.caller && showSection.caller.arguments && showSection.caller.arguments[0]) {
        const evt = showSection.caller.arguments[0];
        if (evt && evt.target && evt.target.classList.contains('nav-item')) {
            evt.target.classList.add('active');
        }
    } else if (window.event && window.event.target && window.event.target.classList.contains('nav-item')) {
        window.event.target.classList.add('active');
    } else {
        // fallback: mark the nav-item for this section active
        navItems.forEach(item => {
            if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(sectionName)) {
                item.classList.add('active');
            }
        });
    }

    // If showing listings section, ensure Active tab is highlighted
    if (sectionName === 'listings') {
        initializeListingsTabs();
    }

    // Scroll to top of the main content area
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }

    // Close sidebar on mobile after navigation
    closeSidebarIfMobile();
}

let currentTab = 'active';

function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active', 'active-tab', 'pending-tab', 'sold-tab');
    });
    event.target.classList.add('active', tabName + '-tab');
    
    // Update listings content
    const listingsContent = document.querySelectorAll('.listings-content');
    listingsContent.forEach(content => content.classList.remove('active'));
    document.getElementById(tabName + '-listings').classList.add('active');
    
    // Update tab indicator
    const indicator = document.getElementById('listingsTabIndicator');
    if (indicator) {
        indicator.className = tabName;
    }
}

function toggleSwitch(element) {
    element.classList.toggle('active');
}

// List Property Modal Variables
let currentStep = 1;
let uploadedPhotos = [];
let photoCounter = 0;

function showListPropertyModal() {
    // Close notifications when opening property modal
    const notificationsModal = document.getElementById('notificationsModal');
    if (notificationsModal && notificationsModal.style.display === 'block') {
        closeNotificationsModal();
    }
    
    const modal = document.getElementById('listPropertyModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset form and step
    resetModalForm();
    currentStep = 1;
    showStep(1);
    
    // Add event listeners
    setupModalEventListeners();
}

function closeListPropertyModal() {
    const modal = document.getElementById('listPropertyModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Remove event listeners
    removeModalEventListeners();
}

function resetModalForm() {
    document.getElementById('listPropertyForm').reset();
    uploadedPhotos = [];
    photoCounter = 0;
    
    // Reset photo preview
    updatePhotoPreviewGrid();
    
    // Reset character counter
    document.getElementById('charCount').textContent = '0';
    
    // Hide sale options
    document.getElementById('saleOptionsGroup').style.display = 'none';
}

function setupModalEventListeners() {
    // Close modal on overlay click
    document.getElementById('listPropertyModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeListPropertyModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeListPropertyModal();
        }
    });
    
    // Character counter for description
    document.getElementById('description').addEventListener('input', function() {
        const charCount = this.value.length;
        document.getElementById('charCount').textContent = charCount;
        
        if (charCount > 1000) {
            this.value = this.value.substring(0, 1000);
            document.getElementById('charCount').textContent = '1000';
        }
    });
    
    // Form submission
    document.getElementById('listPropertyForm').addEventListener('submit', handleFormSubmission);
    
    // Drag and drop functionality
    setupDragAndDrop();
}

function setupDragAndDrop() {
    const uploadArea = document.getElementById('photoUploadArea');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight(e) {
        uploadArea.classList.add('drag-over');
    }
    
    function unhighlight(e) {
        uploadArea.classList.remove('drag-over');
    }
    
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            const fileInput = document.getElementById('photoInput');
            fileInput.files = files;
            handlePhotoUpload({ target: fileInput });
        }
    }
}

function removeModalEventListeners() {
    // Remove event listeners to prevent memory leaks
    const modal = document.getElementById('listPropertyModal');
    const newModal = modal.cloneNode(true);
    modal.parentNode.replaceChild(newModal, modal);
}

function toggleSaleOptions() {
    const listingType = document.getElementById('listingType').value;
    const saleOptionsGroup = document.getElementById('saleOptionsGroup');
    
    if (listingType === 'for-sale') {
        saleOptionsGroup.style.display = 'block';
        document.getElementById('saleType').required = true;
    } else {
        saleOptionsGroup.style.display = 'none';
        document.getElementById('saleType').required = false;
        document.getElementById('saleType').value = '';
    }
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < 3) {
            currentStep++;
            showStep(currentStep);
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function showStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(step => step.classList.remove('active'));
    
    // Show current step
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Update step indicator
    updateStepIndicator(stepNumber);
    
    // Update navigation buttons
    updateNavigationButtons(stepNumber);
}

function updateStepIndicator(stepNumber) {
    // Get all step indicators (there's one for each step)
    const stepIndicators = document.querySelectorAll('.step-indicator');
    
    stepIndicators.forEach((indicator, stepIndex) => {
        const stepNumbers = indicator.querySelectorAll('.step-number');
        const stepLines = indicator.querySelectorAll('.step-line');
        
        stepNumbers.forEach((number, index) => {
            number.classList.remove('active', 'completed');
            if (index + 1 === stepNumber) {
                number.classList.add('active');
            } else if (index + 1 < stepNumber) {
                number.classList.add('completed');
            }
        });
        
        stepLines.forEach((line, index) => {
            line.classList.remove('completed');
            if (index + 1 < stepNumber) {
                line.classList.add('completed');
            }
        });
    });
}

function updateNavigationButtons(stepNumber) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.style.display = stepNumber > 1 ? 'flex' : 'none';
    nextBtn.style.display = stepNumber < 3 ? 'flex' : 'none';
    submitBtn.style.display = stepNumber === 3 ? 'flex' : 'none';
}

function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'var(--color-danger)';
            field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
            
            // Remove error styling after user starts typing
            field.addEventListener('input', function() {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }, { once: true });
        }
    });
    
    // Special validation for step 3 (photos)
    if (currentStep === 3 && uploadedPhotos.length === 0) {
        isValid = false;
        showErrorMessage('Please upload at least one photo of the property.');
    }
    
    return isValid;
}

function showErrorMessage(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fef2f2;
        color: #dc2626;
        padding: 12px 24px;
        border-radius: 8px;
        border: 2px solid #dc2626;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 3000);
}

function handlePhotoUpload(event) {
    const files = event.target.files;
    
    if (files.length + uploadedPhotos.length > 20) {
        showErrorMessage('Maximum 20 photos allowed. Please remove some photos first.');
        return;
    }
    
    Array.from(files).forEach(file => {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showErrorMessage(`File ${file.name} is too large. Maximum size is 5MB.`);
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            showErrorMessage(`File ${file.name} is not an image.`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            addPhotoPreview(e.target.result, file.name);
        };
        reader.readAsDataURL(file);
    });
    
    // Reset input
    event.target.value = '';
}

function addPhotoPreview(src, fileName) {
    photoCounter++;
    const photoId = `photo-${photoCounter}`;
    
    uploadedPhotos.push({
        id: photoId,
        src: src,
        fileName: fileName,
        isMain: uploadedPhotos.length === 0 // First photo is main
    });
    
    updatePhotoPreviewGrid();
}

function updatePhotoPreviewGrid() {
    const photoPreviewGrid = document.getElementById('photoPreviewGrid');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const photoUploadCounter = document.getElementById('photoUploadCounter');
    const photoUploadArea = document.getElementById('photoUploadArea');
    
    // Clear grid
    photoPreviewGrid.innerHTML = '';
    
    // Show/hide upload placeholder, area, and grid
    if (uploadedPhotos.length === 0) {
        uploadPlaceholder.style.display = 'flex';
        photoPreviewGrid.style.display = 'none';
        photoUploadCounter.style.display = 'none';
        photoUploadArea.style.display = 'block';
        return;
    } else {
        uploadPlaceholder.style.display = 'none';
        photoPreviewGrid.style.display = 'grid';
        photoUploadCounter.style.display = 'block';
        photoUploadArea.style.display = 'none';
    }
    
    // Add photo counter
    photoUploadCounter.textContent = `${uploadedPhotos.length}/20 photos uploaded`;
    
    // Add photo items
    uploadedPhotos.forEach((photo, idx) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-preview-item';
        photoItem.id = photo.id;
        photoItem.innerHTML = `
            <img src="${photo.src}" alt="Property photo">
            ${photo.isMain ? '<div class="photo-main-badge">Main</div>' : ''}
            <div class="photo-preview-overlay">
                <button type="button" class="photo-remove-btn" onclick="removePhoto('${photo.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        photoItem.addEventListener('click', function(e) {
            if (e.target.closest('.photo-remove-btn')) return;
            setMainPhoto(photo.id);
        });
        photoPreviewGrid.appendChild(photoItem);
    });
    
    // Add plus button if less than 20 photos
    if (uploadedPhotos.length < 20) {
        const addBtn = document.createElement('div');
        addBtn.className = 'photo-preview-add';
        addBtn.title = 'Add more photos';
        addBtn.innerHTML = '<i class="fas fa-plus"></i>';
        addBtn.onclick = function() {
            document.getElementById('photoInput').click();
        };
        photoPreviewGrid.appendChild(addBtn);
    }
}

function removePhoto(photoId) {
    const photoIndex = uploadedPhotos.findIndex(photo => photo.id === photoId);
    if (photoIndex === -1) return;
    
    const wasMain = uploadedPhotos[photoIndex].isMain;
    uploadedPhotos.splice(photoIndex, 1);
    
    updatePhotoPreviewGrid();
    
    // If main photo was removed and there are other photos, set first as main
    if (wasMain && uploadedPhotos.length > 0) {
        uploadedPhotos[0].isMain = true;
        updateMainPhotoBadges();
    }
}

function setMainPhoto(photoId) {
    uploadedPhotos.forEach(photo => {
        photo.isMain = photo.id === photoId;
    });
    updateMainPhotoBadges();
}

function updateMainPhotoBadges() {
    const photoItems = document.querySelectorAll('.photo-preview-item');
    photoItems.forEach(item => {
        const badge = item.querySelector('.photo-main-badge');
        const photoId = item.id;
        const isMain = uploadedPhotos.find(photo => photo.id === photoId)?.isMain;
        
        if (isMain) {
            if (!badge) {
                const newBadge = document.createElement('div');
                newBadge.className = 'photo-main-badge';
                newBadge.textContent = 'Main';
                item.appendChild(newBadge);
            }
        } else if (badge) {
            badge.remove();
        }
    });
}

let isEditMode = false;
let editingPropertyId = null;

function handleFormSubmission(event) {
    event.preventDefault();
    if (!validateCurrentStep()) {
        return;
    }
    const formData = new FormData(event.target);
    const propertyData = {
        listingType: formData.get('listingType'),
        propertyType: formData.get('propertyType'),
        address: formData.get('address'),
        bedrooms: parseInt(formData.get('bedrooms')),
        bathrooms: parseInt(formData.get('bathrooms')),
        parkingSpaces: parseInt(formData.get('parkingSpaces')),
        propertySize: parseFloat(formData.get('propertySize')),
        floorArea: parseFloat(formData.get('floorArea')),
        saleType: formData.get('saleType'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        photos: uploadedPhotos,
        listedDate: new Date().toISOString(),
        status: 'active',
        id: isEditMode && editingPropertyId ? editingPropertyId : 'property-' + Date.now()
    };
    if (isEditMode && editingPropertyId) {
        updatePropertyListing(propertyData);
        isEditMode = false;
        editingPropertyId = null;
        document.getElementById('submitBtn').textContent = 'List Property';
    } else {
        addPropertyToListings(propertyData);
    }
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
    closeListPropertyModal();
    showSuccessMessage(isEditMode ? 'Property updated successfully!' : 'Property listed successfully!', 'active');
}

function addPropertyToListings(propertyData) {
    const activeListings = document.getElementById('active-listings');
    const propertyList = activeListings.querySelector('.property-list-vertical');
    
    // Create property card
    const propertyCard = createPropertyCard(propertyData);
    
    // Add to the beginning of the list
    propertyList.insertBefore(propertyCard, propertyList.firstChild);
    
    // Update metrics
    updateMetrics();
    attachEditListenersToAllCards();
}

function createPropertyCard(propertyData) {
    const card = document.createElement('div');
    card.className = 'property-listing-card';
    card.setAttribute('data-type', propertyData.listingType);
    card.setAttribute('data-property-id', propertyData.id);
    card.setAttribute('data-images', JSON.stringify(propertyData.photos.map(p => p.src)));
    card._photoArray = propertyData.photos.map(p => p.src);
    card._currentPhotoIndex = propertyData.photos.findIndex(p => p.isMain) || 0;
    const mainPhoto = propertyData.photos.find(p => p.isMain) || propertyData.photos[0];
    let priceFormatted = '€' + (Number.isInteger(propertyData.price) ? propertyData.price : propertyData.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }));
    // Add highlight state
    const isHighlighted = propertyData.highlighted;
    if (isHighlighted) {
        card.classList.add('highlighted-listing');
    }
    // Only add the highlight button for active listings
    let highlightBtnHTML = '';
    if (propertyData.status === 'active') {
        highlightBtnHTML = `<button class="highlight-listing-btn" title="Highlight Listing" type="button">Highlight Listing</button>`;
    }
    card.innerHTML = `
        <div class="property-actions">
            ${highlightBtnHTML}
            <button class="action-btn edit-btn" title="Edit Listing">
                <i class="fas fa-pencil"></i>
            </button>
            <button class="action-btn delete-btn" title="Delete Listing" onclick="deleteProperty('${propertyData.id}')">
                <i class="fas fa-trash"></i>
            </button>
            <div class="action-dropdown">
                <button class="action-btn more-btn" title="More Options">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <div class="action-dropdown-menu">
                    <button class="action-dropdown-item" onclick="changeStatus('${propertyData.id}', 'pending')">
                        <i class="fas fa-clock"></i> Mark as Pending
                    </button>
                    <button class="action-dropdown-item" onclick="changeStatus('${propertyData.id}', 'sold')">
                        <i class="fas fa-check-circle"></i> Mark as Sold
                    </button>
                </div>
            </div>
        </div>
        <div class="property-listing-image">
            <img class="property-listing-img" src="${mainPhoto.src}" alt="${propertyData.address}">
            <button class="property-nav prev" type="button" aria-label="Previous image">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button class="property-nav next" type="button" aria-label="Next image">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="property-listing-info">
            <div class="property-listing-price">${priceFormatted}</div>
            <div class="property-listing-address">${propertyData.address}</div>
            <div class="property-listing-specs">
                <span><i class="fas fa-bed"></i> ${propertyData.bedrooms}</span>
                <span><i class="fas fa-bath"></i> ${propertyData.bathrooms}</span>
                <span><i class="fas fa-car"></i> ${propertyData.parkingSpaces}</span>
                <span><i class="fas fa-ruler-combined"></i> ${propertyData.floorArea}m²</span>
                <span class="property-type-bullet">•</span>
                <span>${propertyData.propertyType.charAt(0).toUpperCase() + propertyData.propertyType.slice(1)}</span>
            </div>
            <div class="property-listing-date">Listed ${new Date(propertyData.listedDate).toLocaleDateString()}</div>
        </div>
    `;
    // Add highlight button logic
    const highlightBtn = card.querySelector('.highlight-listing-btn');
    if (highlightBtn) {
        highlightBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            card.classList.toggle('highlighted-listing');
        };
    }
    const imgEl = card.querySelector('.property-listing-img');
    const prevBtn = card.querySelector('.property-nav.prev');
    const nextBtn = card.querySelector('.property-nav.next');
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        card._currentPhotoIndex = (card._currentPhotoIndex - 1 + card._photoArray.length) % card._photoArray.length;
        imgEl.src = card._photoArray[card._currentPhotoIndex];
    });
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        card._currentPhotoIndex = (card._currentPhotoIndex + 1) % card._photoArray.length;
        imgEl.src = card._photoArray[card._currentPhotoIndex];
    });
    const editBtn = card.querySelector('.edit-btn');
    editBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openEditPropertyModal(propertyData);
    });
    return card;
}

function updatePropertyListing(propertyData) {
    const card = document.querySelector(`[data-property-id="${propertyData.id}"]`);
    if (!card) return;
    const newCard = createPropertyCard(propertyData);
    card.parentNode.replaceChild(newCard, card);
    updateMetrics();
    attachEditListenersToAllCards();
}

function openEditPropertyModal(propertyData) {
    isEditMode = true;
    editingPropertyId = propertyData.id;
    const modal = document.getElementById('listPropertyModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('listPropertyForm').reset();
    document.getElementById('listingType').value = propertyData.listingType;
    document.getElementById('propertyType').value = propertyData.propertyType;
    document.getElementById('address').value = propertyData.address;
    document.getElementById('bedrooms').value = propertyData.bedrooms;
    document.getElementById('bathrooms').value = propertyData.bathrooms;
    document.getElementById('parkingSpaces').value = propertyData.parkingSpaces;
    document.getElementById('propertySize').value = propertyData.propertySize;
    document.getElementById('floorArea').value = propertyData.floorArea;
    document.getElementById('saleType').value = propertyData.saleType || '';
    document.getElementById('description').value = propertyData.description;
    document.getElementById('price').value = propertyData.price;
    uploadedPhotos = propertyData.photos.map((p, idx) => ({ ...p, isMain: idx === 0 }));
    photoCounter = uploadedPhotos.length;
    updatePhotoPreviewGrid();
    document.getElementById('charCount').textContent = propertyData.description.length;
    document.getElementById('saleOptionsGroup').style.display = propertyData.listingType === 'for-sale' ? 'block' : 'none';
    document.getElementById('submitBtn').textContent = 'Save Changes';
    currentStep = 1;
    showStep(1);
    setupModalEventListeners();
}

function updateMetrics() {
    // Update total listings count
    const totalListings = document.querySelectorAll('.property-listing-card').length;
    const metricCards = document.querySelectorAll('.metric-card .metric-value');
    if (metricCards[0]) {
        metricCards[0].textContent = totalListings;
    }
}

// Profile functionality
function toggleEditMode(show = true) {
    const profileSection = document.getElementById('profile');
    const displayContent = profileSection.querySelector('.card-section');
    const editForm = document.getElementById('profileEditForm');
    const editBtn = document.querySelector('.edit-profile-btn');
    
    if (show) {
        displayContent.style.display = 'none';
        editForm.style.display = 'block';
        editBtn.textContent = 'Cancel Edit';
        editBtn.onclick = () => toggleEditMode(false);
        // Add event listener for photo upload click
        const photoUploadContainer = editForm.querySelector('.profile-photo-upload');
        if (photoUploadContainer) {
            photoUploadContainer.onclick = () => document.getElementById('profilePhotoUpload').click();
        }
    } else {
        displayContent.style.display = 'block';
        editForm.style.display = 'none';
        editBtn.textContent = 'Edit Profile';
        editBtn.onclick = () => toggleEditMode(true);
    }
}

function updateDisplayValues() {
    // Update display values with current form values
    const formData = {
        name: document.getElementById('displayName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        jobTitle: document.getElementById('jobTitle').value,
        licenseNumber: document.getElementById('licenseNumber').value,
        experience: document.getElementById('experience').value,
        streetAddress: document.getElementById('streetAddress').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value
    };
    
    document.getElementById('displayNameValue').textContent = formData.name;
    document.getElementById('displayEmailValue').textContent = formData.email;
    document.getElementById('displayPhoneValue').textContent = formData.phone;
    document.getElementById('displayJobTitleValue').textContent = formData.jobTitle;
    document.getElementById('displayLicenseValue').textContent = formData.licenseNumber;
    document.getElementById('displayExperienceValue').textContent = formData.experience + ' years';
    document.getElementById('displayAddressValue').textContent = `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
}

function updateProfilePhoto(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Update form image
            document.getElementById('modalProfileImg').src = e.target.result;
            // Update sidebar image
            document.getElementById('sidebar-profile-img').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Update profile photo click to navigate to profile section
document.getElementById('sidebar-profile-img-wrapper').onclick = function() {
    showSection('profile');
};

// Handle profile form submission
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const phone = document.getElementById('phone').value;
    const jobTitle = document.getElementById('jobTitle').value;
    const licenseNumber = document.getElementById('licenseNumber').value;
    const experience = document.getElementById('experience').value;
    const specialties = document.getElementById('specialties').value;
    const streetAddress = document.getElementById('streetAddress').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zipCode = document.getElementById('zipCode').value;
    const facebook = document.getElementById('facebook').value;
    const linkedin = document.getElementById('linkedin').value;
    const x = document.getElementById('x').value;
    const instagram = document.getElementById('instagram').value;
    
    // Save profile photo to localStorage
    const profileImgSrc = document.getElementById('modalProfileImg').src;
    if (profileImgSrc) {
        localStorage.setItem('agentProfilePhoto', profileImgSrc);
    }

    // Update sidebar information
    document.querySelector('.agent-name').textContent = document.getElementById('displayName').value;
    
    // Update display values
    updateDisplayValues();
    
    // Update display values for social media as icons
    const socialRow = document.getElementById('profileSocialRow');
    socialRow.innerHTML = '';
    const socials = [
        { id: 'facebook', url: facebook, icon: 'fab fa-facebook-f', label: 'Facebook' },
        { id: 'linkedin', url: linkedin, icon: 'fab fa-linkedin-in', label: 'LinkedIn' },
        { id: 'twitter', url: x, icon: 'fab fa-twitter', label: 'Twitter' },
        { id: 'instagram', url: instagram, icon: 'fab fa-instagram', label: 'Instagram' }
    ];
    socials.forEach(social => {
        if (social.url) {
            const a = document.createElement('a');
            a.href = social.url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.title = social.label;
            a.setAttribute('aria-label', social.label);
            a.className = 'profile-social-icon';
            a.innerHTML = `<i class='${social.icon}'></i>`;
            socialRow.appendChild(a);
        }
    });
    
    // Show success message
    showSuccessMessage('Profile updated successfully!');
    
    // Reset to display mode
    toggleEditMode(false);
});

function showSuccessMessage(message, status = 'sold') {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Define colors based on status
    const statusColors = {
        'active': {
            background: '#e6f0ff',
            color: '#133a7c',
            border: '#133a7c'
        },
        'pending': {
            background: '#fffbe7',
            color: '#92400e',
            border: '#fbbf24'
        },
        'sold': {
            background: '#10b981',
            color: 'white',
            border: '#10b981'
        },
        'delete': {
            background: '#fef2f2',
            color: '#dc2626',
            border: '#dc2626'
        }
    };
    
    const colors = statusColors[status] || statusColors['sold'];
    
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors.background};
        color: ${colors.color};
        padding: 12px 24px;
        border-radius: 8px;
        border: 2px solid ${colors.border};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

function goPremium() {
    window.location.href = 'premium-offers.html';
}

// Sidebar toggle for mobile
function toggleSidebar(forceOpen = null) {
    // Close notifications when toggling sidebar
    const notificationsModal = document.getElementById('notificationsModal');
    if (notificationsModal && notificationsModal.style.display === 'block') {
        closeNotificationsModal();
    }
    
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const hamburger = document.querySelector('.hamburger-menu');
    
    if (!sidebar || !overlay || !hamburger) return;
    
    // Prevent multiple rapid calls
    if (sidebar.dataset.transitioning === 'true') return;
    
    const isActive = sidebar.classList.contains('active');
    const shouldOpen = forceOpen === null ? !isActive : forceOpen;
    
    sidebar.dataset.transitioning = 'true';
    
    if (shouldOpen) {
        sidebar.style.display = 'block';
        overlay.style.display = 'block';
        
        // Force reflow then add classes
        sidebar.offsetHeight;
        
        sidebar.classList.add('active');
        overlay.classList.add('active');
        hamburger.classList.add('active');
        
        // Clear transitioning flag
        setTimeout(() => {
            sidebar.dataset.transitioning = 'false';
        }, 350);
        
    } else {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
        
        // Hide after transition
        setTimeout(() => {
            if (!sidebar.classList.contains('active')) {
                sidebar.style.display = 'none';
                overlay.style.display = 'none';
            }
            sidebar.dataset.transitioning = 'false';
        }, 300);
    }
}

// Property image navigation
function navigatePropertyImages(card, direction) {
    const images = JSON.parse(card.dataset.images);
    const imgElement = card.querySelector('.property-listing-img');
    let currentIndex = images.indexOf(imgElement.src.split('/').pop());
    
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % images.length;
    } else {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    imgElement.src = '../img/' + images[currentIndex];
}

// Change property status
function changeStatus(propertyId, newStatus) {
    // This would typically involve an API call to update the database
    // For now, we'll just show a success message and move the card
    const statusMessages = {
        'active': 'Property marked as active',
        'pending': 'Property marked as pending',
        'sold': 'Property marked as sold'
    };
    
    showSuccessMessage(statusMessages[newStatus], newStatus);
    
    // Find the property card by its ID
    const propertyCard = document.querySelector(`[data-property-id="${propertyId}"]`);
    if (propertyCard) {
        // Remove the card from its current location
        propertyCard.remove();
        
        // Add it to the appropriate tab
        const targetTab = document.getElementById(`${newStatus}-listings`);
        if (targetTab) {
            const propertyList = targetTab.querySelector('.property-list-vertical');
            if (propertyList) {
                // Update the card's classes
                propertyCard.className = `property-listing-card ${newStatus}`;
                
                // Update the action buttons for the new status
                updateActionButtons(propertyCard, newStatus);
                
                // Add the card to the new tab
                propertyList.appendChild(propertyCard);
            }
        }
    }
    
    // Close the dropdown
    document.querySelectorAll('.action-dropdown-menu').forEach(menu => {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateY(-10px)';
    });
}

// Delete property listing
function deleteProperty(propertyId) {
    const propertyCard = document.querySelector(`[data-property-id="${propertyId}"]`);
    if (!propertyCard) return;
    
    // Get property details for confirmation message
    const address = propertyCard.querySelector('.property-listing-address')?.textContent || 'this property';
    const price = propertyCard.querySelector('.property-listing-price')?.textContent || '';
    
    // Show custom confirmation dialog
    showDeleteConfirmation(price, address, () => {
        // Remove the property card with animation
        propertyCard.style.transition = 'all 0.3s ease';
        propertyCard.style.transform = 'scale(0.8)';
        propertyCard.style.opacity = '0';
        
        setTimeout(() => {
            propertyCard.remove();
            showSuccessMessage('Property deleted successfully', 'delete');
        }, 300);
    });
}

// Show custom delete confirmation dialog
function showDeleteConfirmation(price, address, onConfirm) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'delete-confirmation-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease-out;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'delete-confirmation-modal';
    modal.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: fadeIn 0.3s ease-out;
        text-align: center;
    `;
    
    // Create modal content HTML
    modal.innerHTML = `
        <div class="delete-icon" style="
            width: 80px;
            height: 80px;
            background: #fef2f2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem auto;
            border: 3px solid #dc2626;
        ">
            <i class="fas fa-trash" style="font-size: 2rem; color: #dc2626;"></i>
        </div>
        
        <h3 style="
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1rem;
            font-family: var(--font-family-heading);
        ">Delete Property</h3>
        
        <p style="
            color: #6b7280;
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
        ">Are you sure you want to delete <strong style="color: #1f2937;">${price} ${address}</strong>?</p>
        
        <p style="
            color: #dc2626;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 2rem;
            padding: 0.75rem;
            background: #fef2f2;
            border-radius: 8px;
        ">⚠️ This action cannot be undone.</p>
        
        <div class="delete-actions" style="
            display: flex;
            gap: 1rem;
            justify-content: center;
        ">
            <button class="cancel-btn" style="
                padding: 0.75rem 2rem;
                border: 2px solid #d1d5db;
                background: white;
                color: #6b7280;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 1rem;
            ">Cancel</button>
            
            <button class="confirm-btn" style="
                padding: 0.75rem 2rem;
                border: none;
                background: #dc2626;
                color: white;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 1rem;
            ">Delete Property</button>
        </div>
    `;
    
    // Add event listeners
    const cancelBtn = modal.querySelector('.cancel-btn');
    const confirmBtn = modal.querySelector('.confirm-btn');
    
    const closeModal = () => {
        overlay.style.animation = 'fadeOut 0.2s ease-in';
        modal.style.animation = 'fadeOut 0.2s ease-in';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 200);
    };
    
    cancelBtn.addEventListener('click', closeModal);
    confirmBtn.addEventListener('click', () => {
        closeModal();
        onConfirm();
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Add hover effects
    cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.background = '#f3f4f6';
        cancelBtn.style.borderColor = '#9ca3af';
    });
    cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.background = 'white';
        cancelBtn.style.borderColor = '#d1d5db';
    });
    
    confirmBtn.addEventListener('mouseenter', () => {
        confirmBtn.style.background = '#b91c1c';
        confirmBtn.style.transform = 'translateY(-1px)';
    });
    confirmBtn.addEventListener('mouseleave', () => {
        confirmBtn.style.background = '#dc2626';
        confirmBtn.style.transform = 'translateY(0)';
    });
    
    // Add to DOM
    document.body.appendChild(overlay);
    overlay.appendChild(modal);
}

// Update action buttons based on status
function updateActionButtons(card, status) {
    const actionsContainer = card.querySelector('.property-actions');
    if (!actionsContainer) return;
    
    // Remove existing action buttons
    actionsContainer.innerHTML = '';
    
    if (status === 'sold') {
        // For sold properties, show only the sold badge
        const soldBadge = document.createElement('div');
        soldBadge.className = 'sold-badge';
        soldBadge.innerHTML = '<i class="fas fa-check-circle"></i><span>SOLD</span>';
        card.appendChild(soldBadge);
    } else {
        // For active and pending properties, show action buttons
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.title = 'Edit Listing';
        editBtn.innerHTML = '<i class="fas fa-pencil"></i>';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.title = 'Delete Listing';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.onclick = () => deleteProperty(card.dataset.propertyId || 'unknown');
        
        const dropdown = document.createElement('div');
        dropdown.className = 'action-dropdown';
        dropdown.innerHTML = `
            <button class="action-btn more-btn" title="More Options">
                <i class="fas fa-ellipsis-v"></i>
            </button>
            <div class="action-dropdown-menu">
                ${status === 'active' ? 
                    `<button class="action-dropdown-item" onclick="changeStatus('${card.dataset.propertyId || 'unknown'}', 'pending')">
                        <i class="fas fa-clock"></i> Mark as Pending
                    </button>
                    <button class="action-dropdown-item" onclick="changeStatus('${card.dataset.propertyId || 'unknown'}', 'sold')">
                        <i class="fas fa-check-circle"></i> Mark as Sold
                    </button>` :
                    `<button class="action-dropdown-item" onclick="changeStatus('${card.dataset.propertyId || 'unknown'}', 'active')">
                        <i class="fas fa-play-circle"></i> Mark as Active
                    </button>
                    <button class="action-dropdown-item" onclick="changeStatus('${card.dataset.propertyId || 'unknown'}', 'sold')">
                        <i class="fas fa-check-circle"></i> Mark as Sold
                    </button>`
                }
            </div>
        `;
        
        actionsContainer.appendChild(editBtn);
        actionsContainer.appendChild(deleteBtn);
        actionsContainer.appendChild(dropdown);
    }
}

// Initialize property image navigation
function initializePropertyNavigation() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.property-nav')) {
            const navBtn = e.target.closest('.property-nav');
            const card = navBtn.closest('.property-listing-card');
            const direction = navBtn.classList.contains('next') ? 'next' : 'prev';
            navigatePropertyImages(card, direction);
        }
    });
}

// Initialize action dropdowns
function initializeActionDropdowns() {
    document.addEventListener('click', function(e) {
        const dropdown = e.target.closest('.action-dropdown');
        const moreBtn = e.target.closest('.more-btn');
        
        // Close all dropdowns first
        document.querySelectorAll('.action-dropdown-menu').forEach(menu => {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
        });
        
        // If clicking on more button, toggle its dropdown
        if (moreBtn) {
            e.preventDefault();
            e.stopPropagation();
            const menu = moreBtn.closest('.action-dropdown').querySelector('.action-dropdown-menu');
            const isVisible = menu.style.opacity === '1';
            
            if (!isVisible) {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
            }
        }
        
        // Close dropdowns when clicking outside
        if (!dropdown) {
            document.querySelectorAll('.action-dropdown-menu').forEach(menu => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
            });
        }
    });
}

// Initialize listings tabs to ensure Active tab is highlighted by default
function initializeListingsTabs() {
    // Reset all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active', 'active-tab', 'pending-tab', 'sold-tab');
    });
    
    // Set Active tab as active
    const activeTab = document.querySelector('.tab-btn[onclick="switchTab(\'active\')"]');
    if (activeTab) {
        activeTab.classList.add('active', 'active-tab');
    }
    
    // Show active listings content
    const listingsContent = document.querySelectorAll('.listings-content');
    listingsContent.forEach(content => content.classList.remove('active'));
    const activeListings = document.getElementById('active-listings');
    if (activeListings) {
        activeListings.classList.add('active');
    }
}

function attachEditListenersToAllCards() {
    document.querySelectorAll('.property-listing-card').forEach(card => {
        const editBtn = card.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                const propertyData = extractPropertyDataFromCard(card);
                if (propertyData) {
                    openEditPropertyModal(propertyData);
                }
            };
        }
    });
}

function extractPropertyDataFromCard(card) {
    try {
        const images = card.getAttribute('data-images') ? JSON.parse(card.getAttribute('data-images')) : [];
        const info = card.querySelector('.property-listing-info');
        const specs = info.querySelectorAll('.property-listing-specs span');
        return {
            id: card.getAttribute('data-property-id') || '',
            listingType: card.getAttribute('data-type') || '',
            propertyType: specs[5] ? specs[5].textContent.trim().toLowerCase() : '',
            address: info.querySelector('.property-listing-address')?.textContent.trim() || '',
            bedrooms: parseInt(specs[0]?.textContent.replace(/\D/g, '') || '0'),
            bathrooms: parseInt(specs[1]?.textContent.replace(/\D/g, '') || '0'),
            parkingSpaces: parseInt(specs[2]?.textContent.replace(/\D/g, '') || '0'),
            floorArea: parseFloat(specs[3]?.textContent.replace(/\D/g, '') || '0'),
            propertySize: parseFloat(specs[3]?.textContent.replace(/\D/g, '') || '0'),
            saleType: '',
            description: '',
            price: parseFloat(info.querySelector('.property-listing-price')?.textContent.replace(/[^\d.]/g, '') || '0'),
            photos: images.map((src, idx) => ({ id: `photo-${idx+1}`, src, fileName: src, isMain: idx === 0 })),
            listedDate: '',
            status: 'active',
        };
    } catch (e) {
        return null;
    }
}

// Notifications Modal Logic
let notificationsBtnClicked = false;

function openNotificationsModal() {
    closeSidebarIfMobile();
    const modal = document.getElementById('notificationsModal');
    const notificationsBtn = document.getElementById('notificationsBtn');
    if (!modal || !notificationsBtn) return;
    modal.style.display = 'block';
    modal.setAttribute('aria-modal', 'true');
    modal.focus();
    notificationsBtn.classList.add('active');
    
    // Close on outside click
    setTimeout(() => {
        document.addEventListener('mousedown', handleNotificationsOutsideClick);
    }, 0);
    
    // Close on Escape
    document.addEventListener('keydown', handleNotificationsEscape);
    
    // Add global click handler to close notifications on other button clicks
    setTimeout(() => {
        document.addEventListener('click', handleGlobalNotificationsClose);
    }, 0);
}

function closeNotificationsModal() {
    const modal = document.getElementById('notificationsModal');
    const notificationsBtn = document.getElementById('notificationsBtn');
    if (!modal || !notificationsBtn) return;
    modal.style.display = 'none';
    modal.removeAttribute('aria-modal');
    notificationsBtn.classList.remove('active');
    document.removeEventListener('mousedown', handleNotificationsOutsideClick);
    document.removeEventListener('keydown', handleNotificationsEscape);
    document.removeEventListener('click', handleGlobalNotificationsClose);
}

function handleNotificationsOutsideClick(e) {
    const modal = document.getElementById('notificationsModal');
    const notificationsBtn = document.getElementById('notificationsBtn');
    if (!modal || !notificationsBtn) return;
    if (notificationsBtnClicked) {
        notificationsBtnClicked = false;
        return;
    }
    if (!modal.contains(e.target) && e.target !== notificationsBtn) {
        closeNotificationsModal();
    }
}

function handleNotificationsEscape(e) {
    if (e.key === 'Escape') {
        closeNotificationsModal();
    }
}

function markAllNotificationsRead() {
    const items = document.querySelectorAll('.notification-item.unread');
    items.forEach(item => {
        item.classList.remove('unread');
        const dot = item.querySelector('.notification-dot');
        if (dot) {
            dot.style.opacity = '0';
            setTimeout(() => dot.remove(), 180);
        }
        item.style.transition = 'background 0.18s';
        item.style.background = '#fff';
    });
}

function handleGlobalNotificationsClose(e) {
    const modal = document.getElementById('notificationsModal');
    const notificationsBtn = document.getElementById('notificationsBtn');
    
    if (!modal || !notificationsBtn) return;
    
    // Don't close if clicking on notifications modal or button
    if (modal.contains(e.target) || e.target === notificationsBtn) {
        return;
    }
    
    // Close if clicking on specific UI elements that should close notifications
    const shouldClose = (
        e.target.closest('.hamburger-menu') ||
        e.target.closest('.nav-item') ||
        e.target.closest('.list-property-btn') ||
        e.target.closest('.edit-profile-btn') ||
        e.target.closest('.action-btn') ||
        e.target.closest('.tab-btn') ||
        e.target.closest('.sidebar') ||
        e.target.closest('.main-content')
    );
    
    if (shouldClose) {
        closeNotificationsModal();
    }
}

// Modal for Highlight Listing Offer
function showHighlightListingModal() {
  // Remove any existing modal
  const existing = document.getElementById('highlightListingModal');
  if (existing) existing.remove();
  // Modal overlay
  const modal = document.createElement('div');
  modal.id = 'highlightListingModal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(30,34,90,0.18)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '9999';
  modal.style.padding = '20px';
  modal.innerHTML = `
    <div style="position:relative;">
      <section class="premium-card">
        <div class="premium-badge">Most Popular</div>
        <h2>Highlight a Listing</h2>
        <div class="premium-price">€12.99 <span>/month</span></div>
        <ul class="premium-benefits">
          <li><strong>Feature one of your properties</strong> in the homepage’s Featured Listings section</li>
          <li>Ability to change which property is highlighted each month</li>
          <li>Attract more attention from potential buyers browsing the homepage</li>
        </ul>
        <button class="premium-cta">Highlight My Listing</button>
      </section>
      <button id="closeHighlightListingModal" class="highlight-modal-close">&times;</button>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Add mobile-responsive styles
  const style = document.createElement('style');
  style.textContent = `
    .highlight-modal-container {
      position: relative;
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }
    
    .highlight-modal-close {
      position: absolute;
      top: -12px;
      right: -12px;
      background: #fff;
      border: none;
      font-size: 1.8rem;
      color: #888;
      cursor: pointer;
      z-index: 1001;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      box-shadow: 0 2px 8px rgba(30,34,90,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .highlight-modal-close:hover {
      background: #f3f4f6;
      color: #666;
      transform: scale(1.1);
    }
    
    @media (max-width: 600px) {
      .highlight-modal-container {
        max-width: 100%;
        margin: 0 10px;
      }
      
      .highlight-modal-close {
        top: 8px;
        right: 8px;
        width: 36px;
        height: 36px;
        font-size: 1.5rem;
      }
      
      #highlightListingModal {
        padding: 10px;
        align-items: flex-start;
        padding-top: 60px;
      }
      
      #highlightListingModal .premium-card {
        padding: 24px 16px 20px 16px;
        margin-top: 20px;
      }
    }
    
    @media (max-width: 480px) {
      .highlight-modal-close {
        top: 6px;
        right: 6px;
        width: 34px;
        height: 34px;
        font-size: 1.4rem;
      }
      
      #highlightListingModal {
        padding: 8px;
        padding-top: 50px;
      }
      
      #highlightListingModal .premium-card {
        padding: 20px 12px 16px 12px;
        margin-top: 16px;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Close logic
  document.getElementById('closeHighlightListingModal').onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}
// Attach to Highlight Listing button(s)
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.highlight-listing-btn, .HighlightListingBtn, .highlight-listing').forEach(btn => {
    btn.onclick = showHighlightListingModal;
  });
  // If the button uses a different selector, add it here
  const directBtn = document.querySelector('button, .btn, .highlight-listing-btn');
  if (directBtn && directBtn.textContent && directBtn.textContent.includes('Highlight Listing')) {
    directBtn.onclick = showHighlightListingModal;
  }
});

document.addEventListener('DOMContentLoaded', function() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Hamburger menu click event - attach once and never remove
    const hamburger = document.querySelector('.hamburger-menu');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (hamburger) {
        // Remove any existing listeners first
        hamburger.removeEventListener('click', hamburger._clickHandler);
        
        // Create and store the handler
        hamburger._clickHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        };
        
        hamburger.addEventListener('click', hamburger._clickHandler);
    }
    
    if (overlay) {
        // Remove any existing listeners first
        overlay.removeEventListener('click', overlay._clickHandler);
        
        // Create and store the handler
        overlay._clickHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar(false);
        };
        
        overlay.addEventListener('click', overlay._clickHandler);
    }
    
    initializePropertyNavigation();
    initializeActionDropdowns();
    initializeListingsTabs();
    attachEditListenersToAllCards();

    // Load agent profile photo from localStorage
    const savedPhoto = localStorage.getItem('agentProfilePhoto');
    if (savedPhoto) {
        document.getElementById('sidebar-profile-img').src = savedPhoto;
        const modalImg = document.getElementById('modalProfileImg');
        if (modalImg) {
            modalImg.src = savedPhoto;
        }
    }

    // Notifications button logic
    const notificationsBtn = document.getElementById('notificationsBtn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('mousedown', function(e) {
            notificationsBtnClicked = true;
        });
        notificationsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = document.getElementById('notificationsModal');
            const isOpen = modal && modal.style.display === 'block';
            if (isOpen) {
                closeNotificationsModal();
            } else {
                openNotificationsModal();
            }
        });
    }
});

// Add event listener for Home button to redirect with agent info
window.addEventListener('DOMContentLoaded', function() {
    var homeBtn = document.getElementById('dashboardHomeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            // Get agent info from sidebar
            var img = document.getElementById('sidebar-profile-img');
            var name = document.querySelector('.agent-name');
            var imgSrc = img ? img.getAttribute('src') : '';
            // Fix path if needed
            if (imgSrc && imgSrc.startsWith('../img/')) {
                imgSrc = imgSrc.replace('../img/', 'img/');
            }
            var agentInfo = {
                name: name ? name.textContent : '',
                img: imgSrc
            };
            // Store in localStorage
            localStorage.setItem('dashboardAgentInfo', JSON.stringify(agentInfo));
            // Redirect to homepage
            window.location.href = '../index.html';
        });
    }
});

// === Logout Modal Logic ===
function openLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (!modal) return;
    modal.style.display = 'flex';
    modal.setAttribute('aria-modal', 'true');
    modal.focus();
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    // Close on Escape
    document.addEventListener('keydown', handleLogoutModalEscape);
    // Close on outside click
    setTimeout(() => {
        document.addEventListener('mousedown', handleLogoutModalOutsideClick);
    }, 0);
}

function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.removeAttribute('aria-modal');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleLogoutModalEscape);
    document.removeEventListener('mousedown', handleLogoutModalOutsideClick);
}

function handleLogoutModalEscape(e) {
    const modal = document.getElementById('logoutModal');
    if (e.key === 'Escape' && modal && modal.style.display !== 'none') {
        closeLogoutModal();
    }
}

function handleLogoutModalOutsideClick(e) {
    const modal = document.getElementById('logoutModal');
    if (!modal) return;
    if (!modal.contains(e.target)) {
        closeLogoutModal();
    }
}

function confirmLogout() {
    // Clear any session/local storage or cookies as needed
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to login page (or home page)
    window.location.href = '../index.html';
}