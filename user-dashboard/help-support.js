document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = this.nextElementSibling;
            const isActive = faqItem.classList.contains('active');
            
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) {
                    const otherAnswer = item.querySelector('.faq-answer');
                    item.classList.remove('active');
                    slideUp(otherAnswer);
                }
            });
            
            if (isActive) {
                faqItem.classList.remove('active');
                slideUp(answer);
            } else {
                faqItem.classList.add('active');
                slideDown(answer);
            }
        });
    });

    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            if (query.length > 0) {
                filterFAQs(query);
            } else {
                showAllFAQs();
            }
        });
    }
});

// Smooth slide down animation
function slideDown(element) {
    element.style.display = 'block';
    element.style.height = '0px';
    element.style.overflow = 'hidden';
    element.style.transition = 'height 0.3s ease, opacity 0.3s ease';
    element.style.opacity = '0';
    
    // Force reflow
    element.offsetHeight;
    
    const height = element.scrollHeight;
    element.style.height = height + 'px';
    element.style.opacity = '1';
    
    // Clean up after animation
    setTimeout(() => {
        element.style.height = 'auto';
        element.style.overflow = 'visible';
    }, 300);
}

// Smooth slide up animation
function slideUp(element) {
    element.style.height = element.scrollHeight + 'px';
    element.style.overflow = 'hidden';
    element.style.transition = 'height 0.3s ease, opacity 0.3s ease';
    
    // Force reflow
    element.offsetHeight;
    
    element.style.height = '0px';
    element.style.opacity = '0';
    
    // Hide after animation
    setTimeout(() => {
        element.style.display = 'none';
        element.style.height = '';
        element.style.overflow = '';
        element.style.transition = '';
        element.style.opacity = '';
    }, 300);
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length > 0) {
        filterFAQs(query);
    } else {
        showAllFAQs();
    }
}

function filterFAQs(query) {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.question-text').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(query) || answer.includes(query)) {
            item.style.display = 'block';
            // Highlight matching text
            highlightText(item, query);
        } else {
            item.style.display = 'none';
        }
    });
}

function showAllFAQs() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.style.display = 'block';
        // Remove highlighting
        removeHighlight(item);
    });
}

function highlightText(element, query) {
    const question = element.querySelector('.question-text');
    const answer = element.querySelector('.faq-answer');
    
    if (question) {
        const text = question.textContent;
        const highlightedText = text.replace(
            new RegExp(query, 'gi'),
            match => `<mark style="background-color: var(--color-primary-light); color: var(--color-primary); padding: 0.1rem 0.2rem; border-radius: 0.2rem;">${match}</mark>`
        );
        question.innerHTML = highlightedText;
    }
    
    if (answer) {
        const text = answer.textContent;
        const highlightedText = text.replace(
            new RegExp(query, 'gi'),
            match => `<mark style="background-color: var(--color-primary-light); color: var(--color-primary); padding: 0.1rem 0.2rem; border-radius: 0.2rem;">${match}</mark>`
        );
        answer.innerHTML = highlightedText;
    }
}

function removeHighlight(element) {
    const question = element.querySelector('.question-text');
    const answer = element.querySelector('.faq-answer');
    
    if (question) {
        question.innerHTML = question.textContent;
    }
    
    if (answer) {
        answer.innerHTML = answer.textContent;
    }
}

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Export functions for potential external use
window.HelpSupport = {
    performSearch,
    filterFAQs,
    showAllFAQs,
    smoothScrollTo
};