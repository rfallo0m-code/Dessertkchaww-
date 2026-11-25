/* ============================================================
KONFIGURASI
============================================================ */
const WA_NUMBER = '6285150964596';
const IG_URL = 'https://www.instagram.com/rm.fresco?fqnt=MXA4OHhiYzZlZXM4eA==';
const STORE_NAME = 'Dessertkchaww';
const FREE_SHIP = 150000;
const SHIP_COST = 15000;

const $` = id => document.getElementById(id);
const rp = n => 'Rp ' + Number(n).toLocaleString('id-ID');

/* ============================================================
DATA PRODUK
============================================================ */
const PRODUCTS = [
{id:1, n:'Belgian Chocolate Molten Cake', c:'Cakes', p:65000, d:'Cake cokelat Belgia dengan lava lumer di tengah.', b:'ready', img:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=75&auto=format&fit=crop'},
{id:2, n:'Strawberry Shortcake', c:'Cakes', p:185000,d:'Sponge cake lembut, krim vanila, dan stroberi segar.', b:'ready', img:'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=75&auto=format&fit=crop'},
{id:3, n:'Red Velvet Cake', c:'Cakes', p:165000,d:'Red velvet klasik dengan cream cheese frosting.', b:'ready', img:'https://images.unsplash.com/photo-1586985289906-406988974504?w=500&q=75&auto=format&fit=crop'},
{id:4, n:'Butter Croissant', c:'Pastries',p:28000, d:'Croissant mentega Prancis, renyah di luar lembut di dalam.', b:'ready', img:'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=75&auto=format&fit=crop'},
{id:5, n:'Pain au Chocolat', c:'Pastries',p:32000, d:'Pastry berlapis dengan isian cokelat Belgia.', b:'ready', img:'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&q=75&auto=format&fit=crop'},
{id:6, n:'Cinnamon Roll', c:'Pastries',p:38000, d:'Roll kayu manis dengan glaze cream cheese.', b:'ready', img:'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&q=75&auto=format&fit=crop'},
{id:7, n:'Dessert Box Tiramisu', c:'Dessert Box',p:75000,d:'Tiramisu klasik dengan kopi dan mascarpone.', b:'ready', img:'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=75&auto=format&fit=crop'},
{id:8, n:'Dessert Box Mango Sticky', c:'Dessert Box',p:80000,d:'Mango sticky rice dalam box premium.', b:'po', img:'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=75&auto=format&fit=crop'},
{id:9, n:'Choco Chip Cookies', c:'Cookies',p:45000, d:'Cookies cokelat chip renyah, freshly baked.', b:'ready', img:'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=75&auto=format&fit=crop'},
{id:10,n:'Matcha Almond Cookies', c:'Cookies',p:52000, d:'Cookies matcha dengan almond slice.', b:'ready', img:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=75&auto=format&fit=crop'},
{id:11,n:'Vegan Chocolate Cake', c:'Vegan', p:195000,d:'Cake cokelat vegan tanpa produk hewani.', b:'vegan', img:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=75&auto=format&fit=crop'},
{id:12,n:'Gluten-Free Banana Bread', c:'Vegan', p:85000, d:'Banana bread gluten-free, lembut dan wangi.', b:'vegan', img:'https://images.unsplash.com/photo-1606101273945-e9eba91c0dc4?w=500&q=75&auto=format&fit=crop'}
];

/* ============================================================
STATE
============================================================ */
let cart = [];
let directOrder = null; // {id, qty}
let lastOrder = null;
let activeCategory = 'all';
let reviewRating = 5;
let reviews = [];

/* ============================================================
STORAGE (PERSIST)
============================================================ */
function saveCart(){
try{ localStorage.setItem('dessertkchaww_cart', JSON.stringify(cart)); }catch(e){}
}
function loadCart(){
try{
const s = localStorage.getItem('dessertkchaww_cart');
if (s){
const arr = JSON.parse(s);
if (Array.isArray(arr)) cart = arr.filter(x => x && x.id && x.qty > 0);
}
}catch(e){ cart = []; }
}
function saveReviews(){
try{ localStorage.setItem('dessertkchaww_reviews', JSON.stringify(reviews)); }catch(e){}
}
function loadReviews(){
try{
const s = localStorage.getItem('dessertkchaww_reviews');
if (s){ const arr = JSON.parse(s); if (Array.isArray(arr)) reviews = arr; }
}catch(e){}
if (!reviews.length){
reviews = [
{name:'Sarah', city:'Jakarta', product:'Belgian Chocolate Molten Cake', rating:5, comment:'Molten cake-nya juara! Cokelatnya lumer banget dan nggak bikin enek. Pengiriman juga cepat.', date: Date.now() - 864000002},
{name:'Andini', city:'Bandung', product:'Dessert Box Tiramisu', rating:5, comment:'Dessert box-nya cantik dan rasanya premium. Cocok banget buat hadiah ulang tahun teman.', date: Date.now() - 864000005},
{name:'Maria', city:'Surabaya', product:'Vegan Chocolate Cake', rating:5, comment:'Sebagai yang gluten-free, aku senang banget ada pilihan vegan & gluten-free yang enak!', date: Date.now() - 86400000*8}
 ];
saveReviews();
}
}

/* ============================================================
UTIL
============================================================ */
function showToast(msg){
const t = `$('toast');
if (!t) return;
t.textContent = msg;
t.classList.add('show');
clearTimeout(t._to);
t._to = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ============================================================
RENDER PRODUK
============================================================ */
function badgeHtml(b){
if (b === 'ready') return '<span class="badge ready">● Ready Stock</span>';
if (b === 'po') return '<span class="badge po">◐ Pre-Order</span>';
if (b === 'vegan') return '<span class="badge vegan">✿ Vegan / GF</span>';
return '';
}

function renderProducts(){
const grid = ('searchInput')?.value || '').toLowerCase().trim();
const list = PRODUCTS.filter(p => {
const okCat = activeCategory === 'all' || p.c === activeCategory;
const okQ = !q || p.n.toLowerCase().includes(q) || p.d.toLowerCase().includes(q) || p.c.toLowerCase().includes(q);
return okCat && okQ;
});
if (!list.length){
grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">Menu tidak ditemukan. Coba kata kunci lain.</div>';
return;
}
grid.innerHTML = list.map(p => &lt;article class="product-card" data-id="${p.id}">
<div class="product-media">
<img class="product-img" src="${p.img}" alt="${p.n}" loading="lazy" decoding="async" onerror="imgFail(this)">
<span class="media-cat">${p.c}&lt;/span&gt; &lt;/div&gt; &lt;div class="product-info"&gt; ${badgeHtml(p.b)}
<h4>${p.n}&lt;/h4&gt; &lt;p class="desc"&gt;${p.d}</p>
<div class="price-row">
<span class="price">${rp(p.p)}&lt;/span&gt; &lt;div class="btn-group"&gt; &lt;button class="add-btn" onclick="addToCart(${p.id}, this)" title="Tambah ke keranjang" aria-label="Tambah ke keranjang">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
</button>
<button class="buy-btn" onclick="buyNow(${p.id})"&gt;Beli&lt;/button&gt; &lt;/div&gt; &lt;/div&gt; &lt;/div&gt; &lt;/article&gt;).join('');

requestAnimationFrame(() => {
document.querySelectorAll('.product-card').forEach((el, i) => {
el.style.transitionDelay = (i * 30) + 'ms';
el.classList.add('show');
});
});
}

function filterCategory(cat, btn){
activeCategory = cat;
document.querySelectorAll('.filter-btn').forEach(b => {
b.classList.toggle('active', b.dataset.cat === cat);
});
renderProducts();
const menu = $`('menu');
if (menu) menu.scrollIntoView({behavior:'smooth', block:'start'});
}

/* ============================================================
FLY-TO-CART ANIMATION
============================================================ */
function flyToCart(sourceImg){
if (!sourceImg || !sourceImg.src) return;
const target = document.querySelector('.cart-btn') || document.querySelector('.cart-float');
if (!target) return;
const r1 = sourceImg.getBoundingClientRect();
const r2 = target.getBoundingClientRect();
const clone = document.createElement('img');
clone.src = sourceImg.src;
clone.className = 'fly-img';
clone.style.left = r1.left + 'px';
clone.style.top = r1.top + 'px';
clone.style.width = r1.width + 'px';
clone.style.height = r1.height + 'px';
clone.style.opacity = '1';
document.body.appendChild(clone);

requestAnimationFrame(() => {
const endSize = 36;
clone.style.left = (r2.left + r2.width/2 - endSize/2) + 'px';
clone.style.top = (r2.top + r2.height/2 - endSize/2) + 'px';
clone.style.width = endSize + 'px';
clone.style.height = endSize + 'px';
clone.style.opacity = '0.15';
clone.style.transform = 'rotate(360deg)';
});
setTimeout(() => clone.remove(), 750);
}

/* ============================================================
CART LOGIC
============================================================ */
function addToCart(id, btn){
const p = PRODUCTS.find(x => x.id === id);
if (!p) return;
const existing = cart.find(x => x.id === id);
if (existing) existing.qty += 1;
else cart.push({id, qty:1});
saveCart();
updateCartBadge(true);
renderCart();
showToast(p.n + ' ditambahkan ke keranjang');
if (btn){
const img = btn.closest('.product-card')?.querySelector('.product-img');
flyToCart(img);
}
const cb = document.querySelector('.cart-btn');
if (cb){ cb.classList.remove('pop'); void cb.offsetWidth; cb.classList.add('pop'); }
const cf = document.querySelector('.cart-float');
if (cf){ cf.classList.remove('bump'); void cf.offsetWidth; cf.classList.add('bump'); }
}

function buyNow(id){
directOrder = {id, qty:1};
openCheckout('direct');
}

function changeDirectQty(delta){
if (!directOrder) return;
directOrder.qty = Math.max(1, Math.min(99, directOrder.qty + delta));
renderDirectQty();
renderOrderSummary();
}

function updateQty(id, delta){
const item = cart.find(x => x.id === id);
if (!item) return;
item.qty += delta;
if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
saveCart();
updateCartBadge();
renderCart();
}

function removeFromCart(id){
cart = cart.filter(x => x.id !== id);
saveCart();
updateCartBadge();
renderCart();
showToast('Item dihapus dari keranjang');
}

function updateCartBadge(pop){
const totalQty = cart.reduce((s, i) => s + i.qty, 0);
['cartCount', 'cartFloatBadge'].forEach(id => {
const el = `$(id);
if (!el) return;
el.textContent = totalQty;
if (pop){
el.classList.remove('pop');
void el.offsetWidth;
el.classList.add('pop');
}
});
}

function renderCart(){
const wrap = ('cartTotal');
if (!wrap || !tot) return;
if (!cart.length){
wrap.innerHTML = <div class="cart-empty"&gt; &lt;svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"&gt;&lt;circle cx="8" cy="21" r="1"/&gt;&lt;circle cx="19" cy="21" r="1"/&gt;&lt;path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/&gt;&lt;/svg&gt; Keranjang masih kosong.&lt;br&gt;Yuk pilih dessert favoritmu! &lt;/div>;
tot.textContent = 'Rp 0';
return;
}
wrap.innerHTML = cart.map(item => {
const p = PRODUCTS.find(x => x.id === item.id);
if (!p) return '';
return &lt;div class="cart-item"&gt; &lt;img src="${p.img}" alt="${p.n}" onerror="imgFail(this)"&gt; &lt;div class="cart-item-info"&gt; &lt;h5&gt;${p.n}</h5>
<div class="price">${rp(p.p)}&lt;/div&gt; &lt;div class="qty-controls"&gt; &lt;button onclick="updateQty(${p.id},-1)" aria-label="Kurangi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg></button>
<span>${item.qty}&lt;/span&gt; &lt;button onclick="updateQty(${p.id},1)" aria-label="Tambah"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></button>
</div>
</div>
<button class="remove-item" onclick="removeFromCart(${p.id})" aria-label="Hapus"&gt; &lt;svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"&gt;&lt;path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/&gt;&lt;/svg&gt; &lt;/button&gt; &lt;/div&gt;;
}).join('');
const total = cart.reduce((s, i) => {
const p = PRODUCTS.find(x => x.id === i.id);
return p ? s + p.p * i.qty : s;
}, 0);
tot.textContent = rp(total);
}

function toggleCart(){
const m = ('overlay');
if (!m) return;
const open = m.classList.toggle('open');
if (o) o.classList.toggle('show', open);
if (open) renderCart();
document.body.style.overflow = open ? 'hidden' : '';
}

/* ============================================================
CHECKOUT
============================================================ */
function getOrderItems(){
if (directOrder){
const p = PRODUCTS.find(x => x.id === directOrder.id);
return p ? [{...p, qty: directOrder.qty}] : [];
}
return cart.map(i => {
const p = PRODUCTS.find(x => x.id === i.id);
return p ? {...p, qty: i.qty} : null;
}).filter(Boolean);
}

function renderDirectQty(){
const sec = {p.n}</b></span>
<div>
<button onclick="changeDirectQty(-1)" aria-label="Kurangi">−</button>
<b style="margin:0 8px">${directOrder.qty}&lt;/b&gt; &lt;button onclick="changeDirectQty(1)" aria-label="Tambah"&gt;+&lt;/button&gt; &lt;/div&gt; &lt;/div>;
}

function renderOrderSummary(){
const el = $('orderSummary'); if (!el) return; const items = getOrderItems(); if (!items.length){ el.innerHTML = '&lt;p style="color:var(--text-muted);text-align:center;padding:12px"&gt;Belum ada item.&lt;/p&gt;'; return; } const subtotal = items.reduce((s, i) =&gt; s + i.p * i.qty, 0); const ongkir = subtotal &gt;= FREE_SHIP ? 0 : SHIP_COST; const total = subtotal + ongkir; el.innerHTML =
latex
{items.map(i =&gt; `<div class="order-item"&gt;&lt;span&gt;

{i.n} × {rp(i.p * i.qty)}</span></div>).join('')} &lt;div class="order-item"&gt;&lt;span&gt;Ongkir&lt;/span&gt;&lt;span&gt;${ongkir ? rp(ongkir) : 'Gratis'}</span></div>
<div class="order-item total"><span>Total</span><span>${rp(total)}&lt;/span&gt;&lt;/div&gt;;
}

function openCheckout(mode){
if (mode === 'cart'){
directOrder = null;
if (!cart.length){
showToast('Keranjang masih kosong');
return;
}
if (latex
('cartModal')?.classList.contains('open')) toggleCart(); } const m = 

('checkoutModal');
if (!m) return;
renderDirectQty();
renderOrderSummary();
m.classList.add('open');
document.body.style.overflow = 'hidden';
('step2')?.classList.remove('active','done');
$`('step3')?.classList.remove('active','done');
}

function closeCheckout(){
const m = $('checkoutModal'); if (m) m.classList.remove('open'); if (!$('cartModal')?.classList.contains('open')) document.body.style.overflow = '';
}

function confirmOrder(){
const name = ($('coName')?.value || '').trim(); const phone = ($('coPhone')?.value || '').trim();
const addr = (`$('coAddress')?.value || '').trim();
if (!name || !phone || !addr){
showToast('Lengkapi nama, WhatsApp, dan alamat');
return;
}
if (phone.replace(/\D/g,'').length < 9){
showToast('Nomor WhatsApp tidak valid');
return;
}
const pay = document.querySelector('input[name="pay"]:checked')?.value || 'Transfer BCA';
const items = getOrderItems();
if (!items.length){
showToast('Tidak ada item');
return;
}
const subtotal = items.reduce((s, i) => s + i.p * i.qty, 0);
const ongkir = subtotal >= FREE_SHIP ? 0 : SHIP_COST;
const total = subtotal + ongkir;
const orderId = 'DK-' + Date.now().toString().slice(-8);

lastOrder = {
id: orderId,
name, phone, addr, pay,
note: ($`('coNote')?.value || '').trim(),
items, subtotal, ongkir, total,
date: new Date().toLocaleString('id-ID')
};

// Update steps
$('step1')?.classList.remove('active'); $('step1')?.classList.add('done');
$('step2')?.classList.remove('active'); $('step2')?.classList.add('done');
`$('step3')?.classList.add('active');

// Build result
const rb = latex
('resultBody'); const rekMap = { 'Transfer BCA': {bank:'BCA', no:'1234567890', an:'Dessertkchaww'}, 'Transfer Mandiri': {bank:'Mandiri', no:'9876543210', an:'Dessertkchaww'}, 'QRIS': null, 'COD': null }; const rek = rekMap[pay]; if (rb){ rb.innerHTML = ` &lt;div class="payment-detail"&gt; &lt;h5&gt;&lt;svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"&gt;&lt;path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/&gt;&lt;path d="M3 6h18"/&gt;&lt;path d="M16 10a4 4 0 0 1-8 0"/&gt;&lt;/svg&gt;Detail Pesanan&lt;/h5&gt; &lt;div class="row"&gt;&lt;span&gt;Order ID&lt;/span&gt;&lt;strong&gt;

{orderId}</strong></div>
<div class="row"><span>Nama</span><strong>{escapeHtml(phone)}</strong></div>
<div class="row"><span>Metode</span><strong>{rp(total)}</strong></div>
</div>
latex
{rek ? `<div class="payment-detail"&gt; &lt;h5&gt;&lt;svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"&gt;&lt;rect width="20" height="14" x="2" y="5" rx="2"/&gt;&lt;line x1="2" x2="22" y1="10" y2="10"/&gt;&lt;/svg&gt;Rekening Pembayaran&lt;/h5&gt; &lt;div class="row"&gt;&lt;span&gt;Bank&lt;/span&gt;&lt;strong&gt;

{rek.bank}</strong></div>
<div class="row"><span>a.n.</span><strong>{rek.no}</span>
<button class="copy-btn" onclick="copyText('{pay}</h5>
<div class="row"><span>Catatan</span><strong>latex
{pay === 'QRIS' ? 'Scan QR dari admin via WhatsApp' : 'Bayar tunai saat pesanan tiba'}&lt;/strong&gt;&lt;/div&gt; &lt;/div>`} `; } closeCheckout(); 

('paymentResult')?.classList.add('open');

// Clear cart if it was cart mode
if (!directOrder){
cart = [];
saveCart();
updateCartBadge();
renderCart();
}
directOrder = null;
}

function escapeHtml(s){
return String(s).replace(/[&<>"']/g, m => ({'&':'&','<':'<','>':'>','"':'"',"'":'''}[m]));
}

function copyText(text, btn){
const done = () => {
if (!btn) return;
const old = btn.innerHTML;
btn.innerHTML = '✓ Tersalin';
setTimeout(() => btn.innerHTML = old, 1500);
};
if (navigator.clipboard && window.isSecureContext){
navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
} else {
fallbackCopy(text, done);
}
}
function fallbackCopy(text, cb){
const ta = document.createElement('textarea');
ta.value = text;
ta.style.position = 'fixed'; ta.style.opacity = '0';
document.body.appendChild(ta);
ta.select();
try { document.execCommand('copy'); cb && cb(); } catch(e){}
ta.remove();
}

function confirmViaWA(){
if (!lastOrder) return;
const o = lastOrder;
const items = o.items.map(i => • ${i.n} × ${i.qty} = ${rp(i.p * i.qty)}).join('\n'); const msg =Halo `${STORE_NAME}! Saya ingin konfirmasi pesanan:

🆔 Order ID: {o.name}
📱 WhatsApp: {o.addr}
latex
{o.note ? '📝 Catatan: ' + o.note + '\n' : ''} 🛒 Pesanan: 

{items}

Subtotal: {o.ongkir ? rp(o.ongkir) : 'Gratis'}
Total: $`{rp(o.total)}

💳 Metode: ${o.pay} 🕐 Waktu: ${o.date}

Mohon diproses ya. Terima kasih! 🙏`;
const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
window.open(url, '_blank');
}

function closeResult(){
`$('paymentResult')?.classList.remove('open');
document.body.style.overflow = '';
lastOrder = null;
}

/* ============================================================
REVIEWS
============================================================ */
function setReviewRating(n){
reviewRating = n;
const stars = document.querySelectorAll('#starPicker span');
stars.forEach((s, i) => {
s.textContent = i < n ? '★' : '☆';
s.classList.toggle('active', i < n);
});
const txt = $`('ratingText');
if (txt){
const labels = {1:'Kurang',2:'Cukup',3:'Baik',4:'Sangat Baik',5:'Luar Biasa'};
txt.textContent = labels[n] + ' (' + n + '/5)';
}
}

function submitReview(e){
e.preventDefault();
const name = ($('revName')?.value || '').trim(); const city = ($('revCity')?.value || '').trim();
const product = ($('revProduct')?.value || '').trim(); const comment = ($('revComment')?.value || '').trim();
if (!name || !product || !comment){
showToast('Lengkapi nama, produk, dan ulasan');
return;
}
if (!reviewRating){
showToast('Pilih rating bintang dulu');
return;
}
reviews.unshift({
name, city, product, comment,
rating: reviewRating,
date: Date.now()
});
saveReviews();
renderReviews();
`$('reviewForm')?.reset();
reviewRating = 5;
setReviewRating(5);
showToast('Terima kasih atas ulasan Anda! 💚');
}

function renderReviews(){
const list = ('avgRating');
const avgStars = ('totalReviews');
const barsEl = $`('ratingBars');
if (!list) return;

const total = reviews.length;
const avg = total ? (reviews.reduce((s, r) => s + r.rating, 0) / total) : 0;
if (avgEl) avgEl.textContent = avg.toFixed(1);
if (avgStars){
const full = Math.round(avg);
avgStars.textContent = '★'.repeat(full) + '☆'.repeat(5 - full);
}
if (totalEl) totalEl.textContent = total;

if (barsEl){
const counts = {5:0,4:0,3:0,2:0,1:0};
reviews.forEach(r => counts[r.rating] = (counts[r.rating] || 0) + 1);
barsEl.innerHTML = [5,4,3,2,1].map(n => {
const c = counts[n] || 0;
const pct = total ? Math.round(c / total * 100) : 0;
return <div class="rating-bar"&gt; &lt;span class="label"&gt;${n} ★</span>
<div class="bar"><div class="bar-fill" style="width:{c}</span>
</div>`;
}).join('');
}

if (!total){
list.innerHTML = '<div class="empty-reviews">Belum ada ulasan. Jadilah yang pertama! ✨</div>';
return;
}
list.innerHTML = reviews.map(r => {
const initial = (r.name || '?').trim().charAt(0).toUpperCase();
const when = r.date ? timeAgo(r.date) : '';
return <div class="review-card"&gt; &lt;div class="review-card-header"&gt; &lt;div class="name-info"&gt; &lt;div class="review-avatar"&gt;${escapeHtml(initial)}</div>
<div>
<div class="review-name">${escapeHtml(r.name)}&lt;/div&gt; &lt;div class="review-meta"&gt;${r.city ? escapeHtml(r.city) + ' • ' : ''}${when}&lt;/div&gt; &lt;/div&gt; &lt;/div&gt; &lt;div class="review-stars"&gt;${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}&lt;/div&gt; &lt;/div&gt; &lt;span class="review-product-tag"&gt;&lt;svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"&gt;&lt;path d="m7.5 4.27 9 5.15"/&gt;&lt;path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/&gt;&lt;/svg&gt;${escapeHtml(r.product)}</span>
<p class="review-comment">${escapeHtml(r.comment)}&lt;/p&gt; &lt;/div>;
}).join('');
}

function timeAgo(ts){
const s = Math.floor((Date.now() - ts) / 1000);
if (s < 60) return 'Baru saja';
const m = Math.floor(s/60); if (m < 60) return m + ' menit lalu';
const h = Math.floor(m/60); if (h < 24) return h + ' jam lalu';
const d = Math.floor(h/24); if (d < 30) return d + ' hari lalu';
return new Date(ts).toLocaleDateString('id-ID');
}

/* ============================================================
CUSTOM ORDER
============================================================ */
function submitCustomOrder(e){
e.preventDefault();
const name = (('custPhone')?.value || '').trim();
const type = (('custMsg')?.value || '').trim();
if (!name || !phone || !type || !msg){
showToast('Lengkapi semua data');
return;
}
const body = Halo ${STORE_NAME}! Saya ingin custom order:%0A%0A👤 Nama: ${encodeURIComponent(name)}%0A📱 WhatsApp: ${encodeURIComponent(phone)}%0A🎁 Jenis: ${encodeURIComponent(type)}%0A📝 Detail: ${encodeURIComponent(msg)}`;
window.open('https://wa.me/' + WA_NUMBER + '?text=' + body, '_blank');
e.target.reset();
}

/* ============================================================
FAQ
============================================================ */
function toggleFaq(el){
const item = el.closest('.faq-item');
if (!item) return;
const open = item.classList.toggle('open');
document.querySelectorAll('.faq-item').forEach(i => {
if (i !== item) i.classList.remove('open');
});
}

/* ============================================================
NAVIGATION
============================================================ */
function toggleMenu(){
const nav = $('navLinks'); const ham = $('hamburger');
if (!nav) return;
const open = nav.classList.toggle('open');
if (ham){
ham.classList.toggle('open', open);
ham.setAttribute('aria-expanded', open ? 'true' : 'false');
}
}

function closeMenu(){
const nav = $('navLinks'); const ham = $('hamburger');
if (nav) nav.classList.remove('open');
if (ham){ ham.classList.remove('open'); ham.setAttribute('aria-expanded','false'); }
}

function goTop(){
window.scrollTo({top:0, behavior:'smooth'});
closeMenu();
}

function floatWA(){
const msg = encodeURIComponent(Halo${STORE_NAME}! Saya ingin bertanya tentang menu dessert.`);
window.open('https://wa.me/' + WA_NUMBER + '?text=' + msg, '_blank');
}

/* ============================================================
THEME
============================================================ */
function setThemeIcon(t){
const el = $`('themeIcon');
if (!el) return;
if (t === 'dark'){
el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
} else {
el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
}
}
function toggleTheme(){
const root = document.documentElement;
const cur = root.getAttribute('data-theme') || 'light';
const next = cur === 'dark' ? 'light' : 'dark';
root.setAttribute('data-theme', next);
setThemeIcon(next);
try{ localStorage.setItem('dessertkchaww_theme', next); }catch(e){}
const meta = document.querySelector('meta[name="theme-color"]');
if (meta) meta.setAttribute('content', next === 'dark' ? '#1A1816' : '#FFFDF9');
}

/* ============================================================
SECTION REVEAL + SCROLLSPY
============================================================ */
function setupReveal(){
const titles = document.querySelectorAll('.section-title, .section-sub');
if (!('IntersectionObserver' in window)){
titles.forEach(t => t.classList.add('show'));
return;
}
const io = new IntersectionObserver((entries) => {
entries.forEach(en => {
if (en.isIntersecting){
en.target.classList.add('show');
io.unobserve(en.target);
}
});
}, {threshold: 0.15, rootMargin: '0px 0px -60px 0px'});
titles.forEach(t => io.observe(t));

// product cards reveal
const cardIO = new IntersectionObserver((entries) => {
entries.forEach(en => {
if (en.isIntersecting){
en.target.classList.add('show');
cardIO.unobserve(en.target);
}
});
}, {threshold: 0.08});
document.querySelectorAll('.product-card').forEach(c => cardIO.observe(c));
}

function setupScrollSpy(){
const links = document.querySelectorAll('.nav-links a[data-sec]');
const sections = Array.from(links).map(a => document.getElementById(a.dataset.sec)).filter(Boolean);
if (!sections.length) return;
const onScroll = () => {
const y = window.scrollY + 120;
let current = sections[0].id;
for (const s of sections){
if (s.offsetTop <= y) current = s.id;
}
links.forEach(a => a.classList.toggle('active', a.dataset.sec === current));
};
let ticking = false;
window.addEventListener('scroll', () => {
if (ticking) return;
ticking = true;
requestAnimationFrame(() => { onScroll(); ticking = false; });
}, {passive:true});
onScroll();
}

function setupToTop(){
const btn = `$('toTop');
if (!btn) return;
window.addEventListener('scroll', () => {
btn.classList.toggle('show', window.scrollY > 500);
}, {passive:true});
btn.addEventListener('click', () => goTop());
}

function setupFallingDecor(){
const layer = $`('fallingLayer');
if (!layer || document.documentElement.classList.contains('lite')) return;
const emojis = ['🍰','🧁','🍪','🍩','🍫','🍓','🥐','🍮'];
for (let i = 0; i < 12; i++){
const span = document.createElement('span');
span.className = 'falling-item';
span.textContent = emojis[i % emojis.length];
span.style.left = Math.random() * 100 + '%';
span.style.fontSize = (14 + Math.random() * 14) + 'px';
span.style.animationDuration = (12 + Math.random() * 12) + 's';
span.style.animationDelay = (Math.random() * -20) + 's';
layer.appendChild(span);
}
}

/* ============================================================
INIT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
// Theme
const t = document.documentElement.getAttribute('data-theme') || 'light';
setThemeIcon(t);

// Year
const y = `$('year'); if (y) y.textContent = new Date().getFullYear();

// Persist
loadCart();
loadReviews();

// Render
renderProducts();
renderCart();
updateCartBadge();
renderReviews();
setReviewRating(5);

// Payment option visual toggle
document.querySelectorAll('input[name="pay"]').forEach(inp => {
inp.addEventListener('change', () => {
document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
inp.closest('.payment-option')?.classList.add('selected');
});
});

// Close cart overlay
const ov = $`('overlay');
if (ov) ov.addEventListener('click', toggleCart);

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
const nav = $('navLinks'); const ham = $('hamburger');
if (!nav || !nav.classList.contains('open')) return;
if (nav.contains(e.target) || (ham && ham.contains(e.target))) return;
closeMenu();
});

// Re-setup product card reveal after render
setTimeout(setupReveal, 100);

// Scrollspy & toTop & decor
setupScrollSpy();
setupToTop();
setupFallingDecor();

// Prevent body scroll when cart/checkout open
const observer = new MutationObserver(() => {
const cartOpen = $('cartModal')?.classList.contains('open'); const coOpen = $('checkoutModal')?.classList.contains('open');
const resOpen = `$('paymentResult')?.classList.contains('open');
document.body.style.overflow = (cartOpen || coOpen || resOpen) ? 'hidden' : '';
});
['cartModal','checkoutModal','paymentResult'].forEach(id => {
const el = $(id); if (el) observer.observe(el, {attributes:true, attributeFilter:['class']});
});

// Save cart on unload (safety net)
window.addEventListener('beforeunload', saveCart);

// Handle hash on load
if (location.hash){
const target = document.querySelector(location.hash);
if (target) setTimeout(() => target.scrollIntoView({behavior:'smooth'}), 300);
}
});
