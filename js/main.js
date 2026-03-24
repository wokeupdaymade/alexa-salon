// ===== Mobile menu toggle =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
});

// Close menu on link click
nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
    });
});

// ===== Header scroll effect =====
const header = document.getElementById('header');
const floatingCta = document.getElementById('floatingCta');

window.addEventListener('scroll', () => {
    const y = window.scrollY;

    if (y > 50) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }

    // Show floating CTA after scrolling past hero
    if (y > 600) {
        floatingCta.classList.add('visible');
    } else {
        floatingCta.classList.remove('visible');
    }
}, { passive: true });

// ===== Scroll animations =====
const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Stagger animation delay for grid children
            const delay = entry.target.dataset.delay;
            if (delay) {
                entry.target.style.transitionDelay = (delay * 0.1) + 's';
            }
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply fade-in to elements
const animatedSelectors = [
    '.service-card',
    '.price-table',
    '.gallery__item',
    '.review-card',
    '.branch-card',
    '.section-header',
    '.hero__badge',
    '.hero__title',
    '.hero__subtitle',
    '.hero__actions',
    '.hero__stats',
    '.contacts__buttons',
    '.contacts__details'
];

animatedSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
        el.classList.add('fade-in');
        if (!el.dataset.delay) {
            el.dataset.delay = index;
        }
        observer.observe(el);
    });
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Active nav link on scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('nav__link--active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('nav__link--active');
                }
            });
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => navObserver.observe(section));
