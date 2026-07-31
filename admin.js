const STORAGE_KEY = 'oval-store-products';
const BANK_KEY = 'oval-store-bank-details';
const defaultProducts = [
  {id:1,name:'Sourdough loaf',detail:'Freshly baked today',price:3.2,icon:'🍞'},
  {id:2,name:'Seasonal fruit box',detail:'A colourful selection',price:6.5,icon:'🍊'},
  {id:3,name:'Farm eggs',detail:'Free-range · 6 pack',price:2.9,icon:'🥚'},
  {id:4,name:'Pantry essentials',detail:'Milk, tea & biscuits',price:7.5,icon:'🛍️'}
];
const $ = selector => document.querySelector(selector);
const getProducts = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultProducts;
const saveProducts = products => localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
const escapeHtml = value => { const node = document.createElement('span'); node.textContent = value; return node.innerHTML; };
let pendingImage = '';
function renderProducts() {
  const products = getProducts();
  $('#adminProductList').innerHTML = products.length ? products.map(product => `<article class="admin-product"><div>${product.image ? `<img src="${product.image}" alt="">` : `<div class="placeholder">${product.icon || '🛍️'}</div>`}</div><div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.detail)} · £${Number(product.price).toFixed(2)}</p></div><button class="edit-product" data-edit="${product.id}">Edit</button><button class="delete-product" data-delete="${product.id}">Delete</button></article>`).join('') : '<p class="card-copy">No products published yet.</p>';
}
function resetProductForm() { $('#productForm').reset(); $('#productId').value = ''; pendingImage = ''; $('#imagePreview').innerHTML = '<span>No photo selected</span>'; $('#saveProduct').textContent = 'Publish product'; $('#cancelEdit').hidden = true; }
function editProduct(id) { const product = getProducts().find(item => item.id === id); if (!product) return; $('#productId').value = product.id; $('#productName').value = product.name; $('#productDetail').value = product.detail; $('#productPrice').value = product.price; pendingImage = product.image || ''; $('#imagePreview').innerHTML = pendingImage ? `<img src="${pendingImage}" alt="Product preview">` : `<span>${product.icon || '🛍️'} No photo uploaded</span>`; $('#saveProduct').textContent = 'Save changes'; $('#cancelEdit').hidden = false; window.scrollTo({top: 0, behavior: 'smooth'}); }
const savedBank = JSON.parse(localStorage.getItem(BANK_KEY) || '{}');
$('#accountName').value = savedBank.accountName || ''; $('#bankName').value = savedBank.bankName || ''; $('#sortCode').value = savedBank.sortCode || ''; $('#accountNumber').value = savedBank.accountNumber || ''; $('#paymentNote').value = savedBank.paymentNote || '';
$('#bankForm').addEventListener('submit', event => { event.preventDefault(); localStorage.setItem(BANK_KEY, JSON.stringify({accountName: $('#accountName').value.trim(), bankName: $('#bankName').value.trim(), sortCode: $('#sortCode').value.trim(), accountNumber: $('#accountNumber').value.trim(), paymentNote: $('#paymentNote').value.trim()})); $('#bankStatus').textContent = 'Bank details saved.'; });
$('#productImage').addEventListener('change', event => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { pendingImage = reader.result; $('#imagePreview').innerHTML = `<img src="${pendingImage}" alt="Product preview">`; }; reader.readAsDataURL(file); });
$('#productForm').addEventListener('submit', event => { event.preventDefault(); const products = getProducts(); const id = Number($('#productId').value); const product = {id: id || Date.now(), name: $('#productName').value.trim(), detail: $('#productDetail').value.trim(), price: Number($('#productPrice').value), image: pendingImage, icon: '🛍️'}; const index = products.findIndex(item => item.id === id); if (index >= 0) products[index] = product; else products.push(product); saveProducts(products); $('#productStatus').textContent = index >= 0 ? 'Product updated and published.' : 'Product published to the storefront.'; resetProductForm(); renderProducts(); });
$('#adminProductList').addEventListener('click', event => { const editId = Number(event.target.dataset.edit); const deleteId = Number(event.target.dataset.delete); if (editId) editProduct(editId); if (deleteId) { const product = getProducts().find(item => item.id === deleteId); if (product && window.confirm(`Delete ${product.name}?`)) { saveProducts(getProducts().filter(item => item.id !== deleteId)); renderProducts(); } } });
$('#cancelEdit').addEventListener('click', resetProductForm);
renderProducts();
