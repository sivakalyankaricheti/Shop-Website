(() => {
  const SHOP_OWNER_WHATSAPP = '447510815005';
  const form = document.querySelector('#checkoutForm');
  const confirmation = document.querySelector('#orderDialog');
  const close = document.querySelector('#closeOrder');
  const ownerWhatsApp = document.querySelector('#ownerWhatsApp');

  form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!form.reportValidity()) return;

    const payingCash = form.querySelector('input[name="pay"]:checked').value === 'cash';
    if (!payingCash) {
      window.alert('Online card and wallet payments must be connected to Stripe before they can be accepted. No order has been sent to Oval Convenience Store.');
      return;
    }

    const name = form.querySelector('input[placeholder="Your name"]').value.trim();
    const phone = form.querySelector('input[type="tel"]').value.trim();
    const address = form.querySelector('input[placeholder="House number and street"]').value.trim();
    const deliverySlot = form.querySelector('select').value;
    const orderId = `OCS-${Math.floor(10000 + Math.random() * 90000)}`;
    const total = document.querySelector('#checkoutTotal').textContent;
    const items = cart.map(item => `${item.name} x${item.qty}`).join(', ');
    const ownerMessage = `NEW OVAL ORDER\n\nOrder: ${orderId}\nCustomer: ${name}\nPhone: ${phone}\nAddress: ${address}\nDelivery: ${deliverySlot}\nItems: ${items}\nTotal: ${total}\nPayment: Cash on delivery`;
    const ownerUpdate = `https://wa.me/${SHOP_OWNER_WHATSAPP}?text=${encodeURIComponent(ownerMessage)}`;
    ownerWhatsApp.href = ownerUpdate;
    document.querySelector('#orderMessage').textContent = `Cash order ${orderId} for ${name} has been received. The order update is ready in Oval Convenience Store's WhatsApp.`;
    document.querySelector('#checkoutDialog').close();
    cart = [];
    renderCart();
    confirmation.showModal();
    window.open(ownerUpdate, '_blank', 'noopener');
  }, true);

  close.addEventListener('click', () => confirmation.close());
})();
