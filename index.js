const header = document.querySelector('.header');
const loadingAnimation = document.querySelector('.loading-animation');
const carousel = document.getElementById('bannerCarousel');
const searchInputs = document.querySelectorAll('.search-form .form-control');
const searchButtons = document.querySelectorAll('.search-form .btn');
const navLinks = document.querySelectorAll('.nav-link');
const navbarToggler = document.querySelector('.navbar-toggler');

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

searchButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        const input = this.closest('.search-form').querySelector('.form-control');
        if (input.value.trim() === '') {
            input.style.borderColor = '#e74c3c';
            input.focus();
            setTimeout(() => input.style.borderColor = '#e5e7eb', 2000);
        } else {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>Searching...';
            setTimeout(() => this.innerHTML = '<i class="fas fa-search"></i>Search', 2000);
        }
    });
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

const observerOptions = {
    threshold: .1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.property-card').forEach(card => {
                card.classList.add('animate-in');
            });
            const sectionTitle = document.querySelector('.section-title');
            sectionTitle && sectionTitle.classList.add('animate-in');
        }
    });
}, observerOptions);

const firstCard = document.querySelector('.property-card');
if (firstCard) {
    observer.observe(firstCard);
}
