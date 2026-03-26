// ===== Mobile menu =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => { burger.classList.toggle('active'); nav.classList.toggle('active'); });
nav.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', () => { burger.classList.remove('active'); nav.classList.remove('active'); }));

// ===== Header scroll & floating CTA =====
const header = document.getElementById('header');
const floatingCta = document.getElementById('floatingCta');
window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', scrollY > 50);
    floatingCta.classList.toggle('visible', scrollY > 600);
}, { passive: true });

// ===== Floating CTA expand =====
document.getElementById('floatingBtn').addEventListener('click', () => floatingCta.classList.toggle('expanded'));
document.addEventListener('click', e => { if (!floatingCta.contains(e.target)) floatingCta.classList.remove('expanded'); });

// ===== Phone copy to clipboard =====
document.querySelectorAll('[data-phone]').forEach(el => {
    el.addEventListener('click', () => {
        navigator.clipboard.writeText(el.dataset.phone).then(() => {
            const msg = el.parentElement.querySelector('.hero__phone-copied, .contacts__phone-copied');
            if (msg) { msg.classList.add('show'); setTimeout(() => msg.classList.remove('show'), 1500); }
        });
    });
});

// ===== Scroll animations =====
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const d = e.target.dataset.delay;
            if (d) e.target.style.transitionDelay = (d * .1) + 's';
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: .08, rootMargin: '0px 0px -60px 0px' });

['.service-card','.price-table','.gallery__item','.branch-card','.section-header',
 '.hero__badge','.hero__title','.hero__subtitle','.hero__phone','.hero__actions',
 '.hero__stats','.contacts__buttons','.contacts__phone-big'].forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('fade-in');
        if (!el.dataset.delay) el.dataset.delay = i;
        observer.observe(el);
    });
});

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const id = this.getAttribute('href');
        if (id === '#') return;
        const t = document.querySelector(id);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
});

// ===== Active nav =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');
const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const id = e.target.id;
            navLinks.forEach(l => l.classList.toggle('nav__link--active', l.getAttribute('href') === '#' + id));
        }
    });
}, { threshold: .3 });
sections.forEach(s => navObs.observe(s));

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
const lbMain = document.getElementById('lightboxMain');
const lbThumbs = document.getElementById('lightboxThumbs');
const galleryItems = document.querySelectorAll('.gallery__item');
const images = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return img ? img.src : '';
});
let curSlide = 0;

function buildThumbs() {
    lbThumbs.innerHTML = '';
    images.forEach((src, i) => {
        const t = document.createElement('div');
        t.className = 'lightbox__thumb' + (i === curSlide ? ' active' : '');
        if (src) { const im = document.createElement('img'); im.src = src; im.alt = 'Фото ' + (i+1); t.appendChild(im); }
        t.addEventListener('click', () => goSlide(i));
        lbThumbs.appendChild(t);
    });
}
function showSlide(i) {
    lbMain.innerHTML = '';
    if (images[i]) {
        const img = document.createElement('img');
        img.src = images[i]; img.alt = 'Фото работы ' + (i+1);
        lbMain.appendChild(img);
    }
    lbThumbs.querySelectorAll('.lightbox__thumb').forEach((t,j) => t.classList.toggle('active', j===i));
    const at = lbThumbs.querySelector('.active');
    if (at) at.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
}
function goSlide(i) { curSlide = ((i % images.length) + images.length) % images.length; showSlide(curSlide); }
function openLB(i) { curSlide = i; buildThumbs(); showSlide(i); lightbox.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeLB() { lightbox.classList.remove('active'); document.body.style.overflow = ''; }

galleryItems.forEach(item => item.addEventListener('click', () => openLB(parseInt(item.dataset.index, 10))));
document.getElementById('lightboxClose').addEventListener('click', closeLB);
document.getElementById('lightboxPrev').addEventListener('click', () => goSlide(curSlide - 1));
document.getElementById('lightboxNext').addEventListener('click', () => goSlide(curSlide + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target === lbMain) closeLB(); });
document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') goSlide(curSlide - 1);
    if (e.key === 'ArrowRight') goSlide(curSlide + 1);
});
let tsx = 0;
lbMain.addEventListener('touchstart', e => { tsx = e.changedTouches[0].screenX; }, { passive: true });
lbMain.addEventListener('touchend', e => {
    const d = tsx - e.changedTouches[0].screenX;
    if (Math.abs(d) > 50) goSlide(curSlide + (d > 0 ? 1 : -1));
}, { passive: true });

// ===== Reviews marquee =====
(async function() {
    const track = document.getElementById('reviewsTrack');
    if (!track) return;
    let reviews = [];
    try {
        const res = await fetch('data/reviews.json');
        const data = await res.json();
        reviews = data.reviews || [];
    } catch (e) { return; }

    // Shuffle
    for (let i = reviews.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [reviews[i], reviews[j]] = [reviews[j], reviews[i]];
    }

    function starsSVG(n) {
        let s = '';
        for (let i = 0; i < n; i++) s += '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.18l-4.77 2.53.91-5.32-3.87-3.77 5.34-.78z"/></svg>';
        return s;
    }
    function sourceLabel(s) {
        if (s === '2gis') return '2ГИС';
        if (s === 'yandex') return 'Яндекс Карты';
        return s;
    }
    function makeCard(r) {
        const card = document.createElement('div');
        card.className = 'review-card';
        const initial = r.name.charAt(0).toUpperCase();
        card.innerHTML = `
            <div class="review-card__stars">${starsSVG(r.rating)}</div>
            <p class="review-card__text">&laquo;${r.text}&raquo;</p>
            <div class="review-card__footer">
                <div class="review-card__avatar">${initial}</div>
                <div><div class="review-card__name">${r.name}</div><div class="review-card__source">${sourceLabel(r.source)}</div></div>
            </div>`;
        return card;
    }

    // Duplicate for infinite scroll
    const allReviews = [...reviews, ...reviews];
    allReviews.forEach(r => track.appendChild(makeCard(r)));

    // Set speed based on count
    const speed = reviews.length * 5; // seconds
    track.style.setProperty('--marquee-duration', speed + 's');
})();

// ===== Maps (Leaflet + OpenStreetMap) =====
function initMaps() {
    if (typeof L === 'undefined') return;

    // Branch 1: ул. Чичерина, 37
    const map1 = L.map('map1', { scrollWheelZoom: false, attributionControl: false }).setView([51.7682, 55.1114], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map1);
    L.marker([51.7682, 55.1114]).addTo(map1).bindPopup('<b>Алекса</b><br>ул. Чичерина, 37').openPopup();

    // Branch 2: ул. 9 Января, 10
    const map2 = L.map('map2', { scrollWheelZoom: false, attributionControl: false }).setView([51.7623, 55.0994], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map2);
    L.marker([51.7623, 55.0994]).addTo(map2).bindPopup('<b>Алекса</b><br>ул. 9 Января, 10').openPopup();
}

// Wait for Leaflet to load
if (document.readyState === 'complete') {
    initMaps();
} else {
    window.addEventListener('load', initMaps);
}
