<script>
/* ============================================================
✨ ANIMATION PACK JS
============================================================ */
(function initAnimations(){
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) return;

/* --- 1. Scroll Progress Bar --- */
const prog = document.createElement('div');
prog.id = 'scrollProgress';
document.body.appendChild(prog);
window.addEventListener('scroll', () => {
const h = document.documentElement.scrollHeight - window.innerHeight;
prog.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
}, { passive: true });

/* --- 2. Floating decorative blobs --- */
const shapes = document.createElement('div');
shapes.className = 'decor-shapes';
const colors = ['#8FA97B', '#C99B72', '#C87755'];
colors.forEach((col, i) => {
const s = document.createElement('div');
s.className = 'decor-shape';
const size = 200 + Math.random() * 200;
s.style.cssText = width:${size}px;height:${size}px;background:${col};+left:${10 + i * 30 + Math.random() * 10}%;top:${20 + i * 25 + Math.random() * 15}%;+animation-delay:${-i * 5}s;animation-duration:${15 + Math.random() * 10}s`;
shapes.appendChild(s);
});
document.body.appendChild(shapes);

/* --- 3. Ripple on click --- */
document.addEventListener('click', (e) => {
const btn = e.target.closest('.cta-btn, .cart-btn, .buy-btn, .checkout-btn, .btn-confirm, .filter-btn, .add-btn');
if (!btn) return;
const rect = btn.getBoundingClientRect();
const size = Math.max(rect.width, rect.height);
const r = document.createElement('span');
r.className = 'ripple';
r.style.cssText = width:${size}px;height:{e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;
btn.appendChild(r);
setTimeout(() => r.remove(), 600);
});

/* --- 4. Hero title word reveal (skip span "Dessert") --- */
const h1 = document.querySelector('.hero-text h1');
if (h1) {
const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
const nodes = [];
let n;
while ((n = walker.nextNode())) {
if (n.parentNode === h1) nodes.push(n); // only direct text nodes
}
let delay = 0;
nodes.forEach(node => {
const frag = document.createDocumentFragment();
node.textContent.split(/(\s+)/).forEach(w => {
if (!w || /^\s+`$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
const span = document.createElement('span');
span.className = 'reveal-word';
span.textContent = w;
span.style.animationDelay = (delay += 0.05) + 's';
frag.appendChild(span);
});
node.parentNode.replaceChild(frag, node);
});
}

/* --- 5. Cart shake on add --- */
const cartBtn = document.querySelector('.cart-btn');
const counter = document.getElementById('cartCount');
if (cartBtn && counter && 'MutationObserver' in window) {
new MutationObserver(() => {
cartBtn.classList.remove('shake');
void cartBtn.offsetWidth;
cartBtn.classList.add('shake');
}).observe(counter, { childList: true, characterData: true, subtree: true });
}

/* --- 6. Hero parallax --- */
const heroImg = document.querySelector('.hero-img img');
if (heroImg) {
let tick = false;
window.addEventListener('scroll', () => {
if (!tick) {
requestAnimationFrame(() => {
const rect = heroImg.parentElement.getBoundingClientRect();
if (rect.bottom > 0 && rect.top < window.innerHeight) {
heroImg.style.transform = scale(1.08) translateY(${rect.top * 0.05}px)`;
}
tick = false;
});
tick = true;
}
}, { passive: true });
}

/* --- 7. Confetti on payment success --- */
window.spawnConfetti = function () {
const colors = ['#8FA97B', '#C99B72', '#C87755', '#B8957F', '#E8A87C', '#6B4F3F'];
for (let i = 0; i < 40; i++) {
const c = document.createElement('div');
c.className = 'confetti';
const sz = 6 + Math.random() * 8;
c.style.cssText = left:${Math.random()*100}%;background:{Math.random()*0.5}s;animation-duration:{sz}px;height:{Math.random()>.5?'border-radius:50%':''}`;
document.body.appendChild(c);
setTimeout(() => c.remove(), 4500);
}
};
if (typeof window.showResult === 'function') {
const orig = window.showResult;
window.showResult = function () {
orig.apply(this, arguments);
setTimeout(window.spawnConfetti, 300);
};
}

/* --- 8. Number counter for rating --- */
const avgEl = document.getElementById('avgRating');
if (avgEl && 'IntersectionObserver' in window) {
const io = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (!e.isIntersecting) return;
const target = parseFloat(avgEl.textContent) || 5;
let cur = 0;
const timer = setInterval(() => {
cur += target / 30;
if (cur >= target) { avgEl.textContent = target.toFixed(1); clearInterval(timer); return; }
avgEl.textContent = cur.toFixed(1);
}, 30);
io.unobserve(e.target);
});
}, { threshold: 0.5 });
io.observe(avgEl);
}

/* --- 9. Form shake on error --- */
if (typeof window.toast === 'function') {
const origToast = window.toast;
window.toast = function (msg) {
origToast(msg);
if (/lengkapi|isi|pilih|wajib/i.test(msg)) {
document.querySelectorAll('#coName,#coPhone,#coAddress,#revName,#revComment,#revProduct').forEach(f => {
if (f && !f.value.trim()) {
f.classList.add('field-error', 'shake');
setTimeout(() => f.classList.remove('shake'), 500);
}
});
}
};
}

/* --- 10. Copy button flash --- */
if (typeof window.copyText === 'function') {
const origCopy = window.copyText;
window.copyText = function (t, btn) {
origCopy(t, btn);
if (btn) {
btn.classList.add('copied');
setTimeout(() => btn.classList.remove('copied'), 700);
}
};
}

/* --- 11. Payment option icon micro-interaction --- */
document.querySelectorAll('.payment-option').forEach(opt => {
const icon = opt.querySelector('.pay-icon svg');
if (!icon) return;
opt.addEventListener('mouseenter', () => {
icon.style.transform = 'scale(1.15) rotate(5deg)';
icon.style.transition = 'transform .3s cubic-bezier(.34,1.56,.64,1)';
});
opt.addEventListener('mouseleave', () => { icon.style.transform = ''; });
});

/* --- 12. Scroll hint arrow di hero --- */
const hero = document.getElementById('home');
if (hero) {
hero.style.position = 'relative';
const ind = document.createElement('div');
ind.style.cssText = 'position:absolute;bottom:20px;left:50%;transform:translateX(-50%);opacity:.6;animation:scrollHint 2s ease-in-out infinite;pointer-events:none;z-index:5;';
ind.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--accent)"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>';
hero.appendChild(ind);
}

/* --- 13. Stagger reveal untuk review & FAQ item --- */
if ('IntersectionObserver' in window) {
const io2 = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (e.isIntersecting) {
e.target.style.opacity = '1';
e.target.style.transform = 'translateY(0)';
io2.unobserve(e.target);
}
});
}, { threshold: 0.05 });
document.querySelectorAll('.review-card,.faq-item,.order-item').forEach(el => {
el.style.opacity = '0';
el.style.transform = 'translateY(15px)';
el.style.transition = 'opacity .5s ease, transform .5s cubic-bezier(.34,1.56,.64,1)';
io2.observe(el);
});
}
})();
</script>