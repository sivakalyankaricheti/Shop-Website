const STORAGE_KEY = 'oval-store-products';
const defaultProducts = [
  {id:1,name:'Sourdough loaf',detail:'Freshly baked today',price:3.2,icon:'🍞'}, {id:2,name:'Seasonal fruit box',detail:'A colourful selection',price:6.5,icon:'🍊'}, {id:3,name:'Farm eggs',detail:'Free-range · 6 pack',price:2.9,icon:'🥚'}, {id:4,name:'Pantry essentials',detail:'Milk, tea & biscuits',price:7.5,icon:'🛍️'}
];
let products = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultProducts;
let cart = [];
const $ = selector => document.querySelector(selector);
const money = amount => `£${amount.toFixed(2)}`;
const escapeHtml = value => { const node = document.createElement('span'); node.textContent = value; return node.innerHTML; };
function renderProducts() { $('#products').innerHTML = products.map(product => `<article class="product"><div class="product-image ${product.image ? 'has-photo' : ''}">${product.image ? `<img src="${product.image}" alt="${escapeHtml(product.name)}">` : product.icon}</div><div class="product-info"><div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.detail)}</p></div><strong>${money(product.price)}</strong></div><button class="add" data-id="${product.id}">Add to bag</button></article>`).join(''); }
function subtotal() { return cart.reduce((sum, product) => sum + product.price * product.qty, 0); }
function total() { const amount = subtotal(); return amount + (amount && amount < 25 ? 2.5 : 0); }
function renderCart() { const amount = subtotal(); $('#cartCount').textContent = cart.reduce((count, product) => count + product.qty, 0); $('#subtotal').textContent = money(amount); $('#checkoutTotal').textContent = money(total()); $('#cartItems').innerHTML = cart.length ? cart.map(product => `<div class="cart-item"><div><strong>${escapeHtml(product.name)}</strong><br><small>${money(product.price)} each</small></div><div class="cart-item-actions"><div class="quantity-control" aria-label="Quantity for ${escapeHtml(product.name)}"><button data-decrease="${product.id}" aria-label="Reduce quantity">−</button><span>${product.qty}</span><button data-increase="${product.id}" aria-label="Increase quantity">+</button></div><button class="remove" data-remove="${product.id}">Remove</button></div></div>`).join('') : '<p class="empty">Your bag is waiting for a few good things.</p>'; }
function openCart() { $('#cartPanel').classList.add('open'); $('#overlay').classList.add('open'); $('#cartPanel').setAttribute('aria-hidden', 'false'); }
function closeCart() { $('#cartPanel').classList.remove('open'); $('#overlay').classList.remove('open'); $('#cartPanel').setAttribute('aria-hidden', 'true'); }
function toast(message) { const element = $('#toast'); element.textContent = message; element.classList.add('show'); setTimeout(() => element.classList.remove('show'), 3500); }
function updateQuantity(id, change) { const product = cart.find(item => item.id === id); if (!product) return; product.qty += change; if (product.qty <= 0) cart = cart.filter(item => item.id !== id); renderCart(); }
renderProducts(); renderCart();
$('#products').addEventListener('click', event => { const id = Number(event.target.dataset.id); if (!id) return; const product = products.find(item => item.id === id); const existing = cart.find(item => item.id === id); existing ? existing.qty++ : cart.push({...product, qty: 1}); renderCart(); toast(`${product.name} added to your bag`); });
$('#cartItems').addEventListener('click', event => { const increase = Number(event.target.dataset.increase); const decrease = Number(event.target.dataset.decrease); const remove = Number(event.target.dataset.remove); if (increase) updateQuantity(increase, 1); else if (decrease) updateQuantity(decrease, -1); else if (remove) { cart = cart.filter(item => item.id !== remove); renderCart(); } });
$('#openCart').onclick = openCart; $('#closeCart').onclick = closeCart; $('#overlay').onclick = closeCart;
$('#checkout').onclick = () => { if (!cart.length) { toast('Add an item before checking out.'); return; } closeCart(); $('#checkoutDialog').showModal(); };
$('#closeCheckout').onclick = () => $('#checkoutDialog').close();
document.querySelectorAll('.payment').forEach(element => element.addEventListener('click', () => { document.querySelectorAll('.payment').forEach(item => item.classList.remove('selected')); element.classList.add('selected'); }));
$('#postcodeForm').addEventListener('submit', event => { event.preventDefault(); const value = $('#postcode').value.trim(); $('#postcodeResult').textContent = `Great news — delivery is available to ${value.toUpperCase()}.`; });
