import { PaymentContext } from "../payment/PaymentContext.js";
import { CreditCard } from "../payment/CreditCard.js";
//import { PayPal } from "../payment/PayPal.js";
import { Crypto } from "../payment/Crypto.js";
//import { Qr } from "../payment/Qr.js";

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

window.closePaymentModal = closePaymentModal;


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

async function processPayment(paymentMethod, amount) {
    const paymentContext = new PaymentContext(paymentMethod);
    const paymentSuccess = await paymentContext.executePayment(amount);

    if (paymentSuccess) {
        alert(`Pago exitoso: $${amount} pagados con ${paymentMethod.constructor.name}.`);
        localStorage.removeItem('cart');
        loadCart();
        closePaymentModal();
    } else {
        alert("Error en el pago. Inténtalo de nuevo.");
    }
}

document.getElementById('creditCardForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const total = parseFloat(document.getElementById('total').innerText.replace('$', ''));
    processPayment(new CreditCard(), total);
});

document.getElementById('creditCardBtn').addEventListener('click', () => {
    openPaymentModal();
});

document.getElementById('paypalBtn').addEventListener('click', () => {
    const total = parseFloat(document.getElementById('total').innerText.replace('$', ''));
    processPayment(new PayPal(), total);
});

document.getElementById('cryptoBtn').addEventListener('click', () => {
    const total = parseFloat(document.getElementById('total').innerText.replace('$', ''));
    processPayment(new Crypto(), total);
});

document.getElementById('qrBtn').addEventListener('click', () => {
    const total = parseFloat(document.getElementById('total').innerText.replace('$', ''));
    processPayment(new Qr(), total);
});

document.addEventListener('DOMContentLoaded', loadCart);