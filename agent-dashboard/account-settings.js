// Account Settings JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle functionality
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Password change form submission
    const changePasswordBtn = document.querySelector('.change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', handlePasswordChange);
    }

    // Email change link functionality
    const changeLink = document.querySelector('.change-link');
    if (changeLink) {
        changeLink.addEventListener('click', handleEmailChange);
    }

    // Password reset link functionality
    const resetLink = document.querySelector('.reset-link');
    if (resetLink) {
        resetLink.addEventListener('click', handlePasswordReset);
    }
});

function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.querySelector('.password-input[placeholder="Current Password"]');
    const newPassword = document.querySelector('.password-input[placeholder="New Password"]');
    
    if (!currentPassword.value.trim()) {
        showNotification('Please enter your current password', 'error');
        currentPassword.focus();
        return;
    }
    
    if (!newPassword.value.trim()) {
        showNotification('Please enter a new password', 'error');
        newPassword.focus();
        return;
    }
    
    if (newPassword.value.length < 8) {
        showNotification('New password must be at least 8 characters long', 'error');
        newPassword.focus();
        return;
    }
    
    // Here you would typically make an API call to change the password
    // For now, we'll just show a success message
    showNotification('Password changed successfully!', 'success');
    
    // Clear the form
    currentPassword.value = '';
    newPassword.value = '';
    
    // Reset password visibility
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        const icon = button.querySelector('i');
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    });
    
    const inputs = document.querySelectorAll('.password-input');
    inputs.forEach(input => {
        input.type = 'password';
    });
}

function handleEmailChange(e) {
    e.preventDefault();
    
    // Here you would typically open a modal or navigate to an email change page
    showNotification('Email change functionality would be implemented here', 'info');
}

function handlePasswordReset(e) {
    e.preventDefault();
    
    // Here you would typically open a password reset modal or navigate to a reset page
    showNotification('Password reset functionality would be implemented here', 'info');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#e74c3c' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        .notification-close:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            notification.style.animationFillMode = 'forwards';
            
            // Add slideOut animation
            const slideOutStyle = document.createElement('style');
            slideOutStyle.textContent = `
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(slideOutStyle);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Form validation helpers
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
        errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
        errors.push('Password must contain at least one special character');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Export functions for potential external use
window.AccountSettings = {
    handlePasswordChange,
    handleEmailChange,
    handlePasswordReset,
    showNotification,
    validatePassword
}; 