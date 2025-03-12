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

// Función para abrir el modal
document.addEventListener('DOMContentLoaded', () => {
    // Agregar eventos para los botones
    document.getElementById('cryptoBtn').addEventListener('click', abrirModalPago);
    document.getElementById('selectBitcoinBtn').addEventListener('click', () => seleccionarCripto('bitcoin'));
    document.getElementById('selectEthereumBtn').addEventListener('click', () => seleccionarCripto('ethereum'));

    // Agregar el evento para cerrar el modal
    const closeButton = document.querySelector('#cryptoPaymentModal .close');
    if (closeButton) {
        closeButton.addEventListener('click', cerrarModalPago);
    } else {
        console.error('No se encontró el botón de cerrar modal.');
    }
    const closePriceModalButton = document.querySelector('#cryptoPriceModal .close');
    if (closePriceModalButton) {
        closePriceModalButton.addEventListener('click', cerrarModalCryptoPrice);
    } else {
        console.error('No se encontró el botón de cerrar modal de precio con criptomonedas.');
    }
});

// Función para abrir el modal
function abrirModalPago() {
    const modal = document.getElementById('cryptoPaymentModal');
    if (modal) {
        modal.style.display = 'block';  // Mostrar el modal
    } else {
        console.error("No se encontró el modal de pago con criptomonedas.");
    }
}

// Función para cerrar el modal
function cerrarModalPago() {
    const modal = document.getElementById('cryptoPaymentModal');
    if (modal) {
        modal.style.display = 'none';  // Ocultar el modal
    } else {
        console.error("No se encontró el modal de pago con criptomonedas.");
    }
}

// Función para manejar la selección de criptomoneda (Bitcoin o Ethereum)
async function seleccionarCripto(moneda) {
    // Crear instancia de Crypto (la estrategia de pago)
    const crypto = new Crypto();

    // Obtener el precio de la criptomoneda seleccionada
    const precioCrypto = await crypto.obtenerPrecios();

    // Obtener el total en USD (esto lo ajustas según tu lógica de total)
    const totalUSD = parseFloat(document.getElementById('total').innerText.replace('$', ''));
    const totalCripto = (totalUSD / precioCrypto[moneda].usd).toFixed(6);  // Convertir el total en USD a la criptomoneda seleccionada

    // Mostrar el precio de la criptomoneda seleccionada en el nuevo modal
    const cryptoPriceElement = document.getElementById('cryptoPrice');
    if (cryptoPriceElement) {
        cryptoPriceElement.innerText = `Total a pagar: ${totalCripto} ${moneda.toUpperCase()}`;
    } else {
        console.error('No se encontró el elemento de cryptoPrice');
    }

    // Abrir el nuevo modal para mostrar el precio y el campo de la billetera
    const cryptoPriceModal = document.getElementById('cryptoPriceModal');
    if (cryptoPriceModal) {
        cryptoPriceModal.style.display = 'block';
    } else {
        console.error('No se encontró el modal de cryptoPriceModal');
    }
}

// Función para cerrar el nuevo modal de cryptoPrice
function cerrarModalCryptoPrice() {
    const cryptoPriceModal = document.getElementById('cryptoPriceModal');
    if (cryptoPriceModal) {
        cryptoPriceModal.style.display = 'none';  // Ocultar el modal
    } else {
        console.error('No se encontró el modal de cryptoPriceModal');
    }
}








document.addEventListener('DOMContentLoaded', loadCart);