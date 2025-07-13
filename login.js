(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        ANIMATION_DURATION: 400,
        LOADING_DELAY: 1000,
        SUBMIT_DELAY: 2000,
        SUCCESS_DELAY: 800,
        SUCCESS_DISPLAY_TIME: 2000,
        MIN_PASSWORD_LENGTH: 8,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE_REGEX: /^[\+]?[0-9\s\-\(\)]{8,}$/
    };

    // State management
    const state = {
        currentStep: 1,
        selectedUserType: null,
        isSubmitting: false,
        stepHistory: [1]
    };

    // Cached DOM elements
    const elements = {
        loadingAnimation: null,
        authSteps: null,
        authOptionBtns: null,
        forms: null,
        backBtns: null
    };

    // Step navigation mapping
    const stepNavigation = {
        1: { login: 3, signup: 2 },
        2: { private: 4, agency: 5 },
        3: { back: 1 },
        4: { back: 2 },
        5: { back: 2 }
    };

    // Initialize the application
    function init() {
        cacheElements();
        hideLoadingAnimation();
        setupEventListeners();
        setupFormValidation();
        setupHistoryHandling();
        addAnimations();
    }

    // Cache DOM elements for better performance
    function cacheElements() {
        elements.loadingAnimation = document.querySelector('.loading-animation');
        elements.authSteps = document.querySelectorAll('.auth-step');
        elements.authOptionBtns = document.querySelectorAll('.auth-option-btn');
        elements.forms = document.querySelectorAll('.auth-form');
        elements.backBtns = document.querySelectorAll('.back-btn');
    }

    // Hide loading animation
    function hideLoadingAnimation() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    if (elements.loadingAnimation) {
                        elements.loadingAnimation.style.display = 'none';
                    }
                }, CONFIG.LOADING_DELAY);
            });
        } else {
            setTimeout(() => {
                if (elements.loadingAnimation) {
                    elements.loadingAnimation.style.display = 'none';
                }
            }, CONFIG.LOADING_DELAY);
        }
    }

    // Setup event listeners with delegation for better performance
    function setupEventListeners() {
        // Use event delegation for auth option buttons
        document.addEventListener('click', handleAuthOptionClick);
        
        // Form submissions
        elements.forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
        });

        // Back button clicks
        document.addEventListener('click', handleBackClick);
        
        // Password toggle functionality
        document.addEventListener('click', handlePasswordToggle);
    }

    // Handle auth option button clicks with event delegation
    function handleAuthOptionClick(e) {
        const btn = e.target.closest('.auth-option-btn');
        if (!btn) return;

        const action = btn.dataset.action;
        const userType = btn.dataset.userType;

        if (action === 'login') {
            navigateToStep(3);
        } else if (action === 'signup') {
            navigateToStep(2);
        } else if (userType === 'private') {
            state.selectedUserType = 'private';
            navigateToStep(4);
        } else if (userType === 'agency') {
            state.selectedUserType = 'agency';
            navigateToStep(5);
        }
    }

    // Handle back button clicks with event delegation
    function handleBackClick(e) {
        const backBtn = e.target.closest('.back-btn');
        if (!backBtn) return;

        e.preventDefault();
        
        const currentStepElement = document.querySelector(`[data-step="${state.currentStep}"]`);
        if (currentStepElement && currentStepElement.contains(backBtn)) {
            const navigation = stepNavigation[state.currentStep];
            if (navigation && navigation.back) {
                navigateToStep(navigation.back);
            }
        }
    }

    // Handle password toggle functionality
    function handlePasswordToggle(e) {
        const toggleBtn = e.target.closest('.password-toggle');
        if (!toggleBtn) return;

        e.preventDefault();
        
        const inputGroup = toggleBtn.closest('.input-group');
        const passwordInput = inputGroup.querySelector('input[type="password"], input[type="text"]');
        const icon = toggleBtn.querySelector('i');
        
        if (!passwordInput || !icon) return;

        // Toggle password visibility
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
            toggleBtn.setAttribute('aria-label', 'Hide password');
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
            toggleBtn.setAttribute('aria-label', 'Show password');
        }
    }

    // Enhanced step navigation with history support
    function navigateToStep(step, pushState = true) {
        if (state.isSubmitting || step === state.currentStep) return;

        // Hide current step
        const currentStepElement = document.querySelector(`[data-step="${state.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.style.display = 'none';
        }

        // Show target step
        const targetStepElement = document.querySelector(`[data-step="${step}"]`);
        if (targetStepElement) {
            targetStepElement.style.display = 'block';
            state.currentStep = step;
            state.stepHistory.push(step);
            
            // Add animation class
            targetStepElement.classList.add('fade-in');
            setTimeout(() => {
                targetStepElement.classList.remove('fade-in');
            }, CONFIG.ANIMATION_DURATION);
        }

        // Update browser history
        if (pushState) {
            history.pushState({ step }, '', '');
        }
    }

    // Handle form submissions
    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (state.isSubmitting) return;

        const form = e.currentTarget;
        const formId = form.id;
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }

        // Show loading state
        setFormLoadingState(form, true);

        // Simulate API call
        setTimeout(() => {
            setFormLoadingState(form, false);
            
            // Handle different form types
            switch (formId) {
                case 'loginForm':
                    handleLoginSuccess();
                    break;
                case 'privateSignupForm':
                    handleSignupSuccess('private');
                    break;
                case 'agencySignupForm':
                    handleSignupSuccess('agency');
                    break;
            }
        }, CONFIG.SUBMIT_DELAY);
    }

    // Validate form with improved error handling
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        // Clear all previous errors first
        inputs.forEach(input => clearInputError(input));

        // Validate each input
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        // Additional validation for password confirmation
        const passwordInputs = form.querySelectorAll('input[type="password"]');
        if (passwordInputs.length === 2) {
            const password = passwordInputs[0].value;
            const confirmPassword = passwordInputs[1].value;
            
            if (password !== confirmPassword) {
                showInputError(passwordInputs[1], 'Passwords do not match');
                isValid = false;
            }
        }

        return isValid;
    }

    // Validate individual input with comprehensive validation
    function validateInput(input) {
        const type = input.type;
        const name = input.name;

        // Special handling for checkboxes
        if (type === 'checkbox') {
            if (input.hasAttribute('required') && !input.checked) {
                showInputError(input, 'You must agree to the terms of service');
                return false;
            }
            return true;
        }

        const value = input.value.trim();

        // Required validation for non-checkbox inputs
        if (input.hasAttribute('required') && !value) {
            showInputError(input, 'This field is required');
            return false;
        }

        // Skip further validation if empty and not required
        if (!value) return true;

        // Email validation
        if (type === 'email') {
            if (!CONFIG.EMAIL_REGEX.test(value)) {
                showInputError(input, 'Please enter a valid email address');
                return false;
            }
        }

        // Phone validation
        if (name === 'phone') {
            if (!CONFIG.PHONE_REGEX.test(value)) {
                showInputError(input, 'Please enter a valid phone number');
                return false;
            }
        }

        // Password validation
        if (type === 'password') {
            if (value.length < CONFIG.MIN_PASSWORD_LENGTH) {
                showInputError(input, `Password must be at least ${CONFIG.MIN_PASSWORD_LENGTH} characters long`);
                return false;
            }
            // Require at least one symbol
            if (!/[!@#$%^&*(),.?":{}|<>\[\]\\/~`_+=;'\-]/.test(value)) {
                showInputError(input, 'Password must contain at least one symbol (e.g., !@#$%)');
                return false;
            }
        }

        return true;
    }

    // Show input error with improved styling
    function showInputError(input, message) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        // Handle checkbox errors differently
        if (input.type === 'checkbox') {
            // For checkboxes, we don't change border color, just show error message
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: #ef4444;
                font-size: 0.8rem;
                margin-top: 0.25rem;
                display: block;
            `;
            formGroup.appendChild(errorDiv);
        } else {
            // For regular inputs, apply red border
            input.style.borderColor = '#ef4444';
            
            // Remove existing error message
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: #ef4444;
                font-size: 0.8rem;
                margin-top: 0.25rem;
                display: block;
            `;
            formGroup.appendChild(errorDiv);
        }
    }

    // Clear input error
    function clearInputError(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        // For checkboxes, don't reset border color
        if (input.type !== 'checkbox') {
            // Reset to default border color
            input.style.borderColor = '#e5e7eb';
        }
        
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Set form loading state
    function setFormLoadingState(form, loading) {
        const submitBtn = form.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const inputs = form.querySelectorAll('input');

        state.isSubmitting = loading;

        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            submitBtn.disabled = true;
            inputs.forEach(input => input.disabled = true);
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            inputs.forEach(input => input.disabled = false);
        }
    }

    // Handle login success
    function handleLoginSuccess() {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, CONFIG.SUCCESS_DELAY);
    }

    // Handle signup success
    function handleSignupSuccess(userType) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, CONFIG.SUCCESS_DELAY);
    }

    // Show success message (kept for potential future use)
    function showSuccessMessage(message) {
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
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                successDiv.remove();
            }, 300);
        }, CONFIG.SUCCESS_DISPLAY_TIME);
    }

    // Setup form validation with optimized event handling
    function setupFormValidation() {
        const inputs = document.querySelectorAll('input');
        
        inputs.forEach(input => {
            // Use passive listeners for better performance
            input.addEventListener('blur', () => {
                validateInput(input);
            }, { passive: true });
            
            // Handle different input types
            if (input.type === 'checkbox') {
                input.addEventListener('change', () => {
                    clearInputError(input);
                }, { passive: true });
            } else {
                input.addEventListener('input', () => {
                    clearInputError(input);
                }, { passive: true });
            }
        });
    }

    // Setup history handling
    function setupHistoryHandling() {
        // Set initial state
        history.replaceState({ step: 1 }, '', '');

        // Handle browser back/forward
        window.addEventListener('popstate', (event) => {
            const step = event.state && event.state.step ? event.state.step : 1;
            navigateToStep(step, false);
        });
    }

    // Add CSS animations
    function addAnimations() {
        if (document.querySelector('#login-animations')) return; // Prevent duplicate

        const style = document.createElement('style');
        style.id = 'login-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .fade-in {
                animation: fadeIn 0.4s ease-out;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Make functions globally available for debugging
    window.loginApp = {
        navigateToStep,
        validateForm,
        showSuccessMessage,
        state
    };

})(); 