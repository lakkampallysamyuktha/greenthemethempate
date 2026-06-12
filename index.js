/* ===========================
   index.js — GreenEnergy (Fixed Active Nav on Scroll)
   =========================== */

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (hamburger && navLinks && navOverlay) {
    hamburger.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) closeMenu();
        else openMenu();
    });
    navOverlay.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) closeMenu();
        });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

// ===== HERO SLIDESHOW =====
const slideData = [
    'indexjs1.webp',
    'indexjs2.webp',
    'indexjs3.webp',
    'indexjs4.webp'
];

const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.slide-dot');
const previewImg = document.getElementById('heroPreviewImg');
let currentSlide = 0, autoTimer;

function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    if (previewImg) {
        previewImg.style.opacity = '0';
        setTimeout(() => {
            previewImg.src = slideData[currentSlide];
            previewImg.style.opacity = '1';
        }, 200);
    }
}
function startAutoSlide() { autoTimer = setInterval(() => goToSlide(currentSlide + 1), 5500); }
function resetAutoSlide()  { clearInterval(autoTimer); startAutoSlide(); }

const prevBtn = document.getElementById('slidePrev');
const nextBtn = document.getElementById('slideNext');
if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoSlide(); });
if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoSlide(); });
dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); resetAutoSlide(); }));
startAutoSlide();

// ===== LIVE ENERGY BAR =====
const hebFill = document.getElementById('hebFill');
const hebPct  = document.getElementById('hebPct');
function animateEnergyBar() {
    if (!hebFill || !hebPct) return;
    const target = 70 + Math.floor(Math.random() * 22);
    hebFill.style.width = target + '%';
    hebPct.textContent  = target + '%';
}
setTimeout(() => {
    animateEnergyBar();
    setInterval(animateEnergyBar, 4000);
}, 1200);

// ===== HERO PARTICLES =====
const particleContainer = document.getElementById('heroParticles');
if (particleContainer) {
    const PARTICLE_COUNT = 18;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement('div');
        p.className = 'hero-particle';
        const size = 2 + Math.random() * 4;
        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            animation-duration: ${6 + Math.random() * 10}s;
            animation-delay: ${Math.random() * 8}s;
            opacity: ${0.3 + Math.random() * 0.5};
        `;
        particleContainer.appendChild(p);
    }
}

// ===== STATS COUNTER =====
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1800;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.floor(easeOut(progress) * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }
    requestAnimationFrame(step);
}

const statsSection = document.getElementById('stats');
let statsAnimated = false;
if (statsSection) {
    const statsObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !statsAnimated) {
            statsAnimated = true;
            document.querySelectorAll('.stats-counter').forEach(animateCounter);
            statsObserver.disconnect();
        }
    }, { threshold: 0.35 });
    statsObserver.observe(statsSection);
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ===== SCROLL TO TOP =====
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== ACTIVE NAV LINK ON SCROLL (FIXED) =====
const sections = document.querySelectorAll('section[id]');  // includes #hero now
const navAnchors = document.querySelectorAll('.nav-links a');

function setActiveNav() {
    let current = '';
    const scrollPos = window.scrollY + 120; // offset for fixed navbar

    sections.forEach(sec => {
        const sectionTop = sec.offsetTop;
        const sectionBottom = sectionTop + sec.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
            current = sec.getAttribute('id');
        }
    });

    // Fallback: if at very top and no section matched, treat as 'hero'
    if (!current && window.scrollY < 150) current = 'hero';

    // On index.html all sections belong to "Home" — always keep Home active
    const isHomePage = window.location.pathname === '/' ||
                       window.location.pathname.endsWith('index.html') ||
                       window.location.pathname === '';

    navAnchors.forEach(anchor => {
        anchor.classList.remove('active');
        const href = anchor.getAttribute('href');

        if (isHomePage) {
            // On the home page, only highlight the Home link regardless of scroll position
            if (href === 'index.html' || href === '#') {
                anchor.classList.add('active');
            }
        } else {
            // On other pages, match by page filename
            const currentPage = window.location.pathname.split('/').pop();
            if (href === currentPage) {
                anchor.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', setActiveNav);
window.addEventListener('load', setActiveNav);
setActiveNav(); // immediate call

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (navLinks.classList.contains('active')) closeMenu();
        }
    });
});

// ===== STEP CARD STAGGER =====
const stepCards = document.querySelectorAll('.step-card');
if (stepCards.length) {
    const stepObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = Array.from(stepCards).indexOf(entry.target);
                setTimeout(() => entry.target.classList.add('visible'), idx * 120);
                stepObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    stepCards.forEach(c => stepObserver.observe(c));
}

// ===== TICKER PAUSE ON HOVER =====
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
    const tickerBand = tickerTrack.parentElement;
    tickerBand.addEventListener('mouseenter', () => tickerTrack.style.animationPlayState = 'paused');
    tickerBand.addEventListener('mouseleave', () => tickerTrack.style.animationPlayState = 'running');
}

// ===== SERVICE CARD TILT =====
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'all 0.5s ease';
        setTimeout(() => card.style.transition = '', 500);
    });
});

// ===== FOOTER NEWSLETTER – redirect to 404.html on success, error below field =====
(function() {
    const footerNewsletter = document.querySelector('.footer-newsletter');
    if (!footerNewsletter) return;

    const emailInput = footerNewsletter.querySelector('input[type="email"]');
    const submitBtn = footerNewsletter.querySelector('button');

    if (!emailInput || !submitBtn) return;

    // Create or get message container below the newsletter row
    let msgDiv = footerNewsletter.parentNode.querySelector('.footer-newsletter-message');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.className = 'footer-newsletter-message';
        msgDiv.style.fontSize = '0.75rem';
        msgDiv.style.marginTop = '8px';
        msgDiv.style.textAlign = 'center';
        footerNewsletter.insertAdjacentElement('afterend', msgDiv);
    }

    function showError(msg) {
        msgDiv.textContent = msg;
        msgDiv.style.color = '#f87171';
        setTimeout(() => { msgDiv.textContent = ''; }, 3000);
    }

    function validateAndRedirect(e) {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email) {
            showError('Please enter your email address');
            emailInput.focus();
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('Please enter a valid email address');
            emailInput.focus();
            return;
        }

        // Valid email → redirect to 404.html
        window.location.href = '404.html';
    }

    submitBtn.addEventListener('click', validateAndRedirect);
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validateAndRedirect(e);
    });
})();
// Clear footer newsletter input on page load (including back/forward navigation)
window.addEventListener('pageshow', () => {
    const newsletterInput = document.querySelector('.footer-newsletter input[type="email"]');
    if (newsletterInput) newsletterInput.value = '';
});
document.addEventListener('DOMContentLoaded', () => {
    const newsletterInput = document.querySelector('.footer-newsletter input[type="email"]');
    if (newsletterInput) newsletterInput.value = '';
});
