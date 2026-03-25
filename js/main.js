// ===== Mobile menu toggle =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
});

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
    header.classList.toggle('header--scrolled', y > 50);
    floatingCta.classList.toggle('visible', y > 600);
}, { passive: true });

// ===== Floating CTA expand =====
const floatingBtn = document.getElementById('floatingBtn');

floatingBtn.addEventListener('click', () => {
    const fc = floatingCta;
    if (fc.classList.contains('expanded')) {
        fc.classList.remove('expanded');
    } else {
        fc.classList.add('expanded');
        // On desktop, also navigate to WhatsApp if not expanding
    }
});

// Close floating menu when clicking outside
document.addEventListener('click', (e) => {
    if (!floatingCta.contains(e.target)) {
        floatingCta.classList.remove('expanded');
    }
});

// ===== Scroll animations =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay;
            if (delay) {
                entry.target.style.transitionDelay = (delay * 0.1) + 's';
            }
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

[
    '.service-card', '.price-table', '.gallery__item',
    '.review-card', '.branch-card', '.section-header',
    '.hero__badge', '.hero__title', '.hero__subtitle',
    '.hero__phone', '.hero__actions', '.hero__stats',
    '.contacts__buttons', '.contacts__phone-big'
].forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
        el.classList.add('fade-in');
        if (!el.dataset.delay) el.dataset.delay = index;
        observer.observe(el);
    });
});

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Active nav link =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('nav__link--active',
                    link.getAttribute('href') === '#' + id);
            });
        }
    });
}, { threshold: 0.3 });

sections.forEach(s => navObserver.observe(s));

// ===== Lightbox / Gallery =====
const lightbox = document.getElementById('lightbox');
const lightboxMain = document.getElementById('lightboxMain');
const lightboxThumbs = document.getElementById('lightboxThumbs');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

const galleryItems = document.querySelectorAll('.gallery__item');
const totalSlides = galleryItems.length;
let currentSlide = 0;

function buildThumbs() {
    lightboxThumbs.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const thumb = document.createElement('div');
        thumb.className = 'lightbox__thumb' + (i === currentSlide ? ' active' : '');
        thumb.textContent = (i + 1);
        thumb.addEventListener('click', () => goToSlide(i));
        lightboxThumbs.appendChild(thumb);
    }
}

function showSlide(index) {
    lightboxMain.innerHTML = '';
    const slide = document.createElement('div');
    slide.className = 'lightbox__slide';
    slide.textContent = 'Фото работы ' + (index + 1);
    lightboxMain.appendChild(slide);

    // Update thumbs
    lightboxThumbs.querySelectorAll('.lightbox__thumb').forEach((t, i) => {
        t.classList.toggle('active', i === index);
    });

    // Scroll active thumb into view
    const activeThumb = lightboxThumbs.querySelector('.lightbox__thumb.active');
    if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

function goToSlide(index) {
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

function openLightbox(index) {
    currentSlide = index;
    buildThumbs();
    showSlide(currentSlide);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index, 10);
        openLightbox(idx);
    });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
lightboxNext.addEventListener('click', () => goToSlide(currentSlide + 1));

// Close on backdrop click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxMain) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
});

// Touch swipe support for lightbox
let touchStartX = 0;
let touchEndX = 0;

lightboxMain.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightboxMain.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
    }
}, { passive: true });
