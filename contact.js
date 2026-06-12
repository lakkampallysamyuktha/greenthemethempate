/* ============================================
   contact.js — GreenEnergy Contact Page (redirects to 404 after submit)
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

const contactLink = document.querySelector('.nav-links a[href="contact.html"]');
function forceActiveContact() {
    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
    if (contactLink) contactLink.classList.add('active');
}
forceActiveContact();
window.addEventListener('scroll', forceActiveContact, { passive: true });

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
    const heroEl = document.querySelector('.contact-hero');
    const heroObs = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { if (!raf) loop(); } else { cancelAnimationFrame(raf); raf = null; } });
    if (heroEl) heroObs.observe(heroEl);
})();

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObs.unobserve(entry.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// Contact form – redirect to 404.html after successful submit
(function () {
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('formStatus');
    const submitBtn = form.querySelector('.submit-btn');
    const fields = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('email'),
        message: document.getElementById('message'),
    };
    function setStatus(msg, type) { statusEl.textContent = msg; statusEl.className = 'form-status ' + type; }
    function clearStatus() { statusEl.textContent = ''; statusEl.className = 'form-status'; }
    function markError(el) { el.classList.add('error'); el.focus(); }
    function clearError(el) { el.classList.remove('error'); }
    function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
    Object.values(fields).forEach(el => { el.addEventListener('input', () => { clearError(el); clearStatus(); }); });
    function validate() {
        if (!fields.firstName.value.trim()) { setStatus('Please enter your first name.', 'error'); markError(fields.firstName); return false; }
        if (!fields.lastName.value.trim()) { setStatus('Please enter your last name.', 'error'); markError(fields.lastName); return false; }
        if (!isValidEmail(fields.email.value)) { setStatus('Please enter a valid email address.', 'error'); markError(fields.email); return false; }
        if (!fields.message.value.trim()) { setStatus('Please write a message before sending.', 'error'); markError(fields.message); return false; }
        return true;
    }
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearStatus();
        if (!validate()) return;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
        setTimeout(() => {
            // Redirect to 404.html after successful submission
            window.location.href = '404.html';
        }, 800);
    });
})();
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