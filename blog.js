/* ============================================
   blog.js — Professional GreenEnergy Blog Page
   ============================================ */

const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

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
hamburger.addEventListener('click', () => navLinks.classList.contains('active') ? closeMenu() : openMenu());
navOverlay.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { if (window.innerWidth <= 768) closeMenu(); });
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

const blogLink = document.querySelector('.nav-links a[href="blog.html"]');
function forceActiveBlog() {
    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
    if (blogLink) blogLink.classList.add('active');
}
forceActiveBlog();
window.addEventListener('scroll', forceActiveBlog, { passive: true });
window.addEventListener('hashchange', forceActiveBlog);

// Canvas particles
(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W; this.y = H + Math.random() * 40;
            this.r = 1.5 + Math.random() * 2.5;
            this.vy = -(0.3 + Math.random() * 0.6);
            this.vx = (Math.random() - 0.5) * 0.3;
            this.alpha = 0; this.maxAlpha = 0.25 + Math.random() * 0.35;
            this.life = 0; this.maxLife = 220 + Math.random() * 160;
        }
        update() {
            this.x += this.vx; this.y += this.vy; this.life++;
            const t = this.life / this.maxLife;
            this.alpha = t < 0.15 ? (t / 0.15) * this.maxAlpha : t > 0.8 ? ((1 - t) / 0.2) * this.maxAlpha : this.maxAlpha;
            if (this.life >= this.maxLife) this.reset();
        }
        draw() {
            ctx.save(); ctx.globalAlpha = this.alpha; ctx.beginPath();
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
            g.addColorStop(0, 'rgba(74,222,128,1)'); g.addColorStop(1, 'rgba(74,222,128,0)');
            ctx.fillStyle = g; ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
    }
    for (let i = 0; i < 28; i++) { const p = new Particle(); p.life = Math.floor(Math.random() * p.maxLife); particles.push(p); }
    let raf;
    function loop() { ctx.clearRect(0, 0, W, H); particles.forEach(p => { p.update(); p.draw(); }); raf = requestAnimationFrame(loop); }
    loop();
    const heroEl = document.querySelector('.blog-hero-full');
    const heroObs = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { if (!raf) loop(); } else { cancelAnimationFrame(raf); raf = null; } });
    if (heroEl) heroObs.observe(heroEl);
})();

// Counter animation
function animateCounter(el, target, suffix, duration = 1800) {
    const isFloat = String(target).includes('.');
    const start = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const val = isFloat ? (eased * target).toFixed(1) : Math.round(eased * target);
        el.textContent = val + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const items = entry.target.querySelectorAll('.ahs-item');
        items.forEach((item, i) => {
            const counter = item.querySelector('.counter');
            const target = parseFloat(item.dataset.count);
            const suffix = item.dataset.suffix || '';
            setTimeout(() => animateCounter(counter, target, suffix, 1600), i * 120);
        });
        statsObs.unobserve(entry.target);
    });
}, { threshold: 0.5 });
const statsBar = document.querySelector('.blog-hero-stats');
if (statsBar) statsObs.observe(statsBar);

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal-fade, .reveal-up');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObs.unobserve(entry.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ===== FILTER BUTTONS – redirect to 404.html =====
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = '404.html';
    });
});

// ===== SIDEBAR NEWSLETTER (Weekly Newsletter widget) – red error below field, redirect on success =====
(function() {
    const sidebarWidget = document.querySelector('.sidebar-widget.bg-widget');
    if (!sidebarWidget) return;

    const emailInput = sidebarWidget.querySelector('.sidebar-newsletter input[type="email"]');
    const submitBtn = sidebarWidget.querySelector('.sidebar-newsletter .btn');

    if (!emailInput || !submitBtn) return;

    // Create message container below the button
    let msgDiv = sidebarWidget.querySelector('.newsletter-sidebar-message');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.className = 'newsletter-sidebar-message';
        msgDiv.style.fontSize = '0.75rem';
        msgDiv.style.marginTop = '10px';
        msgDiv.style.textAlign = 'center';
        submitBtn.parentNode.insertAdjacentElement('afterend', msgDiv);
    }

    function showError(msg) {
        msgDiv.textContent = msg;
        msgDiv.style.color = '#f87171';
        setTimeout(() => { msgDiv.textContent = ''; }, 3000);
    }

    function validateSidebarAndRedirect(e) {
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

        // Direct redirect to 404.html
        window.location.href = '404.html';
    }

    submitBtn.addEventListener('click', validateSidebarAndRedirect);
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validateSidebarAndRedirect(e);
    });
})();

// ===== FOOTER NEWSLETTER – red error below field, redirect on success =====
(function() {
    const footerNewsletter = document.querySelector('.footer-newsletter');
    if (!footerNewsletter) return;

    const emailInput = footerNewsletter.querySelector('input[type="email"]');
    const submitBtn = footerNewsletter.querySelector('button');

    if (!emailInput || !submitBtn) return;

    // Create message container below the newsletter row
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

        // Direct redirect to 404.html
        window.location.href = '404.html';
    }

    submitBtn.addEventListener('click', validateAndRedirect);
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validateAndRedirect(e);
    });
})();
