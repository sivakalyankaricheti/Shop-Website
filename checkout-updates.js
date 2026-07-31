(() => {
  const BANK_KEY = 'oval-store-bank-details';
  const SHOP_OWNER_WHATSAPP = '447510815005';
  const form = document.querySelector('#checkoutForm');
  const confirmation = document.querySelector('#orderDialog');
  const close = document.querySelector('#closeOrder');
  const ownerWhatsApp = document.querySelector('#ownerWhatsApp');
  const bankOption = form.querySelector('input[value="card"]').closest('.payment');
  bankOption.querySelector('strong').textContent = 'Bank transfer';
  bankOption.querySelector('small').textContent = 'Use the shop bank details shown after placing your order.';
  bankOption.querySelector('span').textContent = '£';
  form.addEventListener('submit', event => {
    event.preventDefault(); if (!form.reportValidity()) return;
    const payment = form.querySelector('input[name="pay"]:checked').value;
    const bank = JSON.parse(localStorage.getItem(BANK_KEY) || '{}');
    if (payment === 'card' && !bank.accountName) { window.alert('Bank transfer is not available yet. Please select cash on delivery or ask the shop to add its bank details.'); return; }
    const name = form.querySelector('input[placeholder="Your name"]').value.trim();
    const phone = form.querySelector('input[type="tel"]').value.trim();
    const address = form.querySelector('input[placeholder="House number and street"]').value.trim();
    const deliverySlot = form.querySelector('select').value;
    const orderId = `OCS-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderTotal = document.querySelector('#checkoutTotal').textContent;
    const items = cart.map(item => `${item.name} x${item.qty}`).join(', ');
    const paymentText = payment === 'cash' ? 'Cash on delivery' : 'Bank transfer';
    const ownerMessage = `NEW OVAL ORDER\n\nOrder: ${orderId}\nCustomer: ${name}\nPhone: ${phone}\nAddress: ${address}\nDelivery: ${deliverySlot}\nItems: ${items}\nTotal: ${orderTotal}\nPayment: ${paymentText}`;
    ownerWhatsApp.href = `https://wa.me/${SHOP_OWNER_WHATSAPP}?text=${encodeURIComponent(ownerMessage)}`;
    document.querySelector('#orderMessage').innerHTML = payment === 'cash' ? `Cash order <strong>${orderId}</strong> for ${name} has been received.` : `Order <strong>${orderId}</strong> for ${name} has been received.<br><br><strong>Bank transfer details</strong><br>${bank.accountName}<br>${bank.bankName ? `${bank.bankName}<br>` : ''}Sort code: ${bank.sortCode || '—'}<br>Account number: ${bank.accountNumber || '—'}<br><br>${bank.paymentNote || `Please use ${orderId} as your payment reference.`}`;
    document.querySelector('#checkoutDialog').close(); cart = []; renderCart(); confirmation.showModal(); window.open(ownerWhatsApp.href, '_blank', 'noopener');
  });
  close.addEventListener('click', () => confirmation.close());
})();
