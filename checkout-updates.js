(() => {
  const form = document.querySelector('#checkoutForm');
  const confirmation = document.querySelector('#orderDialog');
  const close = document.querySelector('#closeOrder');

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
    const orderId = `OCS-${Math.floor(10000 + Math.random() * 90000)}`;
    const total = document.querySelector('#checkoutTotal').textContent;
    document.querySelector('#orderMessage').textContent = `Cash order ${orderId} for ${name} has been received. Total due on delivery: ${total}. Oval Convenience Store can now prepare it.`;
    document.querySelector('#checkoutDialog').close();
    cart = [];
    renderCart();
    confirmation.showModal();
  }, true);

  close.addEventListener('click', () => confirmation.close());
})();
