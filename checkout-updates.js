(() => {
  const form = document.querySelector('#checkoutForm');
  const confirmation = document.querySelector('#orderDialog');
  const close = document.querySelector('#closeOrder');
  const update = document.querySelector('#whatsappUpdate');
  const message = document.querySelector('#orderMessage');

  const customerNumber = value => {
    let number = value.replace(/[^\d+]/g, '');
    if (number.startsWith('00')) number = `+${number.slice(2)}`;
    if (number.startsWith('0')) number = `+44${number.slice(1)}`;
    return number.replace(/\D/g, '');
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!form.reportValidity()) return;

    const name = form.querySelector('input[placeholder="Your name"]').value.trim();
    const phone = form.querySelector('input[type="tel"]').value;
    const payingCash = form.querySelector('input[name="pay"]:checked').value === 'cash';
    const orderId = `WP-${Math.floor(10000 + Math.random() * 90000)}`;
    const currentTotal = document.querySelector('#checkoutTotal').textContent;
    const payment = payingCash ? 'Cash on delivery' : 'Online payment pending';
    const text = `Hello ${name}, thank you for ordering from Woodland Pantry! Your order ${orderId} has been received. Total: ${currentTotal}. Payment: ${payment}. We will message you when it is on its way.`;

    update.href = `https://wa.me/${customerNumber(phone)}?text=${encodeURIComponent(text)}`;
    message.textContent = `Order ${orderId} is ready to be confirmed with ${name} on WhatsApp.`;
    document.querySelector('#checkoutDialog').close();
    cart = [];
    renderCart();
    confirmation.showModal();
  }, true);

  close.addEventListener('click', () => confirmation.close());
})();
