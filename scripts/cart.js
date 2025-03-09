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

        const tax = subtotal * 0.1;
        const shipping = 5.99;
        const total = subtotal + tax + shipping;

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

function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'block';
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
}

function validateCreditCard(cardNumber, expiryDate, cvv) {
    if (!cardNumber || cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
        alert("Número de tarjeta inválido. Debe tener 16 dígitos.");
        return false;
    }

    const [month, year] = expiryDate.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2 || !/^\d+$/.test(month) || !/^\d+$/.test(year)) {
        alert("Fecha de expiración inválida. Use el formato MM/YY.");
        return false;
    }

    if (!cvv || cvv.length !== 3 || !/^\d+$/.test(cvv)) {
        alert("CVV inválido. Debe tener 3 dígitos.");
        return false;
    }

    return true;
}

function processCreditCardPayment(total) {
    const cardNumber = document.getElementById('cardNumber').value;
    const cardName = document.getElementById('cardName').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    if (!validateCreditCard(cardNumber, expiryDate, cvv)) {
        return false;
    }

    const paymentAdapter = new PaymentAdapter(new CreditCard());
    const paymentSuccess = paymentAdapter.pay(total);

    if (paymentSuccess) {
        alert(`Pago exitoso: $${total} pagados con tarjeta de crédito.`);
        localStorage.removeItem('cart');
        loadCart();
        closePaymentModal();
        return true;
    } else {
        alert("Error en el pago. Inténtalo de nuevo.");
        return false;
    }
}

document.getElementById('creditCardForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const total = parseFloat(document.getElementById('total').innerText.replace('$', ''));
    processCreditCardPayment(total);
});

document.getElementById('creditCardBtn').addEventListener('click', () => {
    openPaymentModal();
});

document.addEventListener('DOMContentLoaded', loadCart);

function openQrPaymentModal() {
    const modal = document.getElementById('qrPaymentModal');
    modal.style.display = 'block';
}

function closeQrPaymentModal() {
    const modal = document.getElementById('qrPaymentModal');
    modal.style.display = 'none';
}

function generateQRCode(amount) {
    const qrData = {
        amount: amount,
        merchantId: 'your-merchant-id'
    };
    const qrCode = new Qr();
    qrCode.makeCode(JSON.stringify(qrData));
    document.getElementById('qr-code-container').innerHTML = qrCode.createImgTag();
}
document.getElementById('qrBtn').addEventListener('click', () => {
    const total = parseFloat(document.getElementById('total').innerText.replace('$', ''));
    openQrPaymentModal();
    generateQRCode(total);
});

document.getElementById('confirmPaymentBtn').addEventListener('click', () => {
    const businessName = document.getElementById('businessName').value;
    const nit = document.getElementById('nit').value;

    if (businessName && nit) {
        alert("Pago realizado con éxito. Regresando a la página del carrito.");
        localStorage.removeItem('cart');
        window.location.href = 'cart.html';
    } else {
        alert("Por favor, completa todos los campos.");
    }
});