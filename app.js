const products=[
  {id:1,name:'Sourdough loaf',detail:'Freshly baked today',price:3.2,icon:'🍞'},
  {id:2,name:'Seasonal fruit box',detail:'A colourful selection',price:6.5,icon:'🍊'},
  {id:3,name:'Farm eggs',detail:'Free-range · 6 pack',price:2.9,icon:'🥚'},
  {id:4,name:'Pantry essentials',detail:'Milk, tea & biscuits',price:7.5,icon:'🛍️'}
];
let cart=[];
const $=s=>document.querySelector(s);const money=n=>`£${n.toFixed(2)}`;
function renderProducts(){ $('#products').innerHTML=products.map(p=>`<article class="product"><div class="product-image">${p.icon}</div><div class="product-info"><div><h3>${p.name}</h3><p>${p.detail}</p></div><strong>${money(p.price)}</strong></div><button class="add" data-id="${p.id}">Add to bag</button></article>`).join(''); }
function subtotal(){return cart.reduce((s,p)=>s+p.price*p.qty,0)}
function total(){const s=subtotal();return s+(s&&s<25?2.5:0)}
function renderCart(){const s=subtotal();$('#cartCount').textContent=cart.reduce((n,p)=>n+p.qty,0);$('#subtotal').textContent=money(s);$('#checkoutTotal').textContent=money(total());$('#cartItems').innerHTML=cart.length?cart.map(p=>`<div class="cart-item"><div><strong>${p.name} × ${p.qty}</strong><br><small>${money(p.price)} each</small></div><button class="remove" data-remove="${p.id}">Remove</button></div>`).join(''):'<p class="empty">Your bag is waiting for a few good things.</p>';}
function openCart(){ $('#cartPanel').classList.add('open');$('#overlay').classList.add('open');$('#cartPanel').setAttribute('aria-hidden','false') }
function closeCart(){ $('#cartPanel').classList.remove('open');$('#overlay').classList.remove('open');$('#cartPanel').setAttribute('aria-hidden','true') }
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),3500)}
renderProducts();renderCart();
$('#products').addEventListener('click',e=>{const id=+e.target.dataset.id;if(!id)return;const p=products.find(x=>x.id===id),existing=cart.find(x=>x.id===id);existing?existing.qty++:cart.push({...p,qty:1});renderCart();toast(`${p.name} added to your bag`)});
$('#cartItems').addEventListener('click',e=>{const id=+e.target.dataset.remove;if(!id)return;cart=cart.filter(p=>p.id!==id);renderCart()});
$('#openCart').onclick=openCart;$('#closeCart').onclick=closeCart;$('#overlay').onclick=closeCart;
$('#checkout').onclick=()=>{if(!cart.length){toast('Add an item before checking out.');return}closeCart();$('#checkoutDialog').showModal()};
$('#closeCheckout').onclick=()=>$('#checkoutDialog').close();
document.querySelectorAll('.payment').forEach(el=>el.addEventListener('click',()=>{document.querySelectorAll('.payment').forEach(x=>x.classList.remove('selected'));el.classList.add('selected')}));
$('#checkoutForm').addEventListener('submit',e=>{e.preventDefault();const choice=document.querySelector('input[name="pay"]:checked').value;$('#checkoutDialog').close();cart=[];renderCart();toast(choice==='cash'?'Order received — pay cash when your delivery arrives.':'Order received — connect Stripe here to process the secure payment.')});
$('#postcodeForm').addEventListener('submit',e=>{e.preventDefault();const value=$('#postcode').value.trim();$('#postcodeResult').textContent=`Great news — delivery is available to ${value.toUpperCase()}.`});
