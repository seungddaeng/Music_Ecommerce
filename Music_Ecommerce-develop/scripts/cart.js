function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items-container');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
  
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = '';
  
      let subtotal = 0;
  
      cart.forEach((item) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <h3>${item.name}</h3>
          <p>$${item.price}</p>
          <p>Quantity: ${item.quantity}</p>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
  
        subtotal += item.price * item.quantity;
      });
  
      // Calcular el impuesto (10% del subtotal)
      const tax = subtotal * 0.1;
  
      // Calcular el total (subtotal + impuesto + envío)
      const shipping = 5.99; // Costo fijo de envío
      const total = subtotal + tax + shipping;
  
      // Actualizar los valores en la página
      subtotalElement.innerText = `$${subtotal.toFixed(2)}`;
      taxElement.innerText = `$${tax.toFixed(2)}`;
      shippingElement.innerText = `$${shipping.toFixed(2)}`;
      totalElement.innerText = `$${total.toFixed(2)}`;
    }
  }
  
  function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    cart = cart.filter((item) => item.id !== productId);
  
    localStorage.setItem('cart', JSON.stringify(cart));
  
    loadCart();
  }
  
  document.addEventListener('DOMContentLoaded', loadCart);