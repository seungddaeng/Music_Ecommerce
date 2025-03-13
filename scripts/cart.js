import { PaymentContext } from "../payment/PaymentContext.js";
import { CreditCard } from "../payment/CreditCard.js";
//import { PayPal } from "../payment/PayPal.js";
import { Crypto } from "../payment/Crypto.js";
//import { Qr } from "../payment/Qr.js";
import { VenmoPayment } from "../payment/VenmoPayment.js";

let criptoSeleccionada = "";

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

window.removeFromCart = function(productId) {
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


// document.getElementById('cryptoBtn').addEventListener('click', () => {
//     const total = parseFloat(document.getElementById('total').innerText.replace('$', ''));
//     processPayment(new Crypto(), total);
// });

document.getElementById('qrBtn').addEventListener('click', () => {
    const total = parseFloat(document.getElementById('total').innerText.replace('$', ''));
    processPayment(new Qr(), total);
});



// Función para abrir los distintos botones para abrir y cerrar modales
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cryptoBtn').addEventListener('click', abrirModalPago);
    document.getElementById('selectBitcoinBtn').addEventListener('click', () => seleccionarCripto('bitcoin'));
    document.getElementById('selectEthereumBtn').addEventListener('click', () => seleccionarCripto('ethereum'));
    document.getElementById('confirmCryptoPaymentBtn').addEventListener('click', procesarPagoCrypto);
    document.getElementById('checkout-btn').addEventListener('click', procesarPagoPayPal);
    document.querySelector('#cryptoPaymentModal .close')?.addEventListener('click', cerrarModalPago);
    document.querySelector('#cryptoPriceModal .close')?.addEventListener('click', cerrarModalCryptoPrice);
});

function abrirModalPago() {
    const modal = document.getElementById('cryptoPaymentModal');
    modal ? (modal.style.display = 'block') : console.error("No se encontró el modal de pago con criptomonedas.");
}

function cerrarModalPago() {
    const modal = document.getElementById('cryptoPaymentModal');
    modal ? (modal.style.display = 'none') : console.error("No se encontró el modal de pago con criptomonedas.");
}

function cerrarModalCryptoPrice() {
    const modal = document.getElementById('cryptoPriceModal');
    modal ? (modal.style.display = 'none') : console.error("No se encontró el modal de precios de criptomonedas.");
}
async function procesarPagoPayPal() {
    try {
        // Verificar si el carrito está vacío
        const carrito = JSON.parse(localStorage.getItem('cart')) || [];

        if (carrito.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de proceder al pago.");
            return;
        }

        const totalUSD = parseFloat(document.getElementById('total').innerText.replace('$', ''));
        const walletKey = document.getElementById('linkPaypalButton').value.trim(); // Campo de PayPal

        if (!walletKey) {
            alert("Por favor, ingrese su cuenta de PayPal.");
            return;
        }

        const paypal = new paypal();
        const pagoExitoso = await paypal.pay(totalUSD, walletKey);

        if (pagoExitoso) {
            alert("¡Pago realizado con éxito con PayPal!");
            localStorage.removeItem('cart');
            loadCart();
            cerrarModalPago();  // Cierra el modal de pago
        } else {
            alert("Error al procesar el pago con PayPal. Verifique su saldo e intente de nuevo.");
        }
    } catch (error) {
        console.error("Error al procesar el pago con PayPal:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadCart);


async function seleccionarCripto(moneda) {
    try {
        // Guardar la criptomoneda seleccionada
        console.log(`Seleccionaste: ${moneda}`);
        criptoSeleccionada = moneda;

        const crypto = new Crypto();

        // Obtener el precio de la criptomoneda seleccionada con la API
        const precioCrypto = await crypto.obtenerPrecios();

        //total en USD
        const totalUSD = parseFloat(document.getElementById('total').innerText.replace('$', ''));
        const totalCripto = (totalUSD / precioCrypto[moneda].usd).toFixed(6); // Convertir el total a criptomoneda

        //total en criptomoneda
        const cryptoPriceElement = document.getElementById('cryptoPrice');
        if (cryptoPriceElement) {
            cryptoPriceElement.innerText = `Total a pagar: ${totalCripto} ${moneda.toUpperCase()}`;
        } else {
            console.error('No se encontró el elemento de cryptoPrice');
        }

        // Abrir el modal de confirmación de pago con criptomonedas
        const cryptoPriceModal = document.getElementById('cryptoPriceModal');
        cryptoPriceModal ? (cryptoPriceModal.style.display = 'block') : console.error('No se encontró el modal de cryptoPriceModal');
    } catch (error) {
        console.error("Error al seleccionar criptomoneda:", error);
    }
}

// Función para procesar el pago con criptomonedas
async function procesarPagoCrypto() {
    try {
        // Verificar si el carrito está vacío
        const carrito = JSON.parse(localStorage.getItem('cart')) || [];

        if (carrito.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de proceder al pago.");
            return;
        }
        const totalUSD = parseFloat(document.getElementById('total').innerText.replace('$', ''));
        const walletKey = document.getElementById('walletKey').value.trim();
        if (!walletKey) {
            alert("Por favor, ingrese su wallet key.");
            return;
        }
        if (!criptoSeleccionada) {
            alert("Seleccione una criptomoneda antes de pagar.");
            return;
        }

        const crypto = new Crypto();
        const pagoExitoso = await crypto.pay(totalUSD, criptoSeleccionada, walletKey);
        if (pagoExitoso) {
            alert("¡Pago realizado con éxito!");
            localStorage.removeItem('cart');
            loadCart();
            cerrarModalPago();
            cerrarModalCryptoPrice();
        } else {
            alert("Error al procesar el pago. Verifique su saldo e intente de nuevo.");
        }
    } catch (error) {
        console.error("Error al procesar el pago con criptomonedas:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadCart);

document.getElementById('venmoBtn').addEventListener('click', () => {
    openUserModal();
});

async function confirmVenmoPayment() {
    const totalAmount = parseFloat(document.getElementById("total").innerText.replace("$", ""));
    const selectedUser = document.getElementById("userSelect").value;

    if (!selectedUser) {
        alert("Por favor, selecciona un usuario antes de pagar, si no tienes uno puedes registrarte con Venmo ;)");
        return;
    }

    const venmoPayment = new VenmoPayment(selectedUser);

    try {
        const success = await venmoPayment.pay(totalAmount);
        if (success) {
            alert(`Pago de $${totalAmount} realizado con éxito a través de Venmo.`);
            localStorage.removeItem("cart");
            window.location.href = "/index.html";
        } else {
            alert("Error en el pago. Inténtalo de nuevo.");
        }
    } catch (error) {
        console.error("Error al procesar el pago con Venmo:", error);
        alert("Hubo un problema con el pago...");
    }
}

window.confirmVenmoPayment = confirmVenmoPayment;

function openUserModal() {
    const modal = document.getElementById("userModal");
    if (modal) {
        modal.style.display = "block";
    } else {
        console.error("No se encontró el modal de usuario.");
    }
}

window.openUserModal = openUserModal;

function closeUserModal() {
    const modal = document.getElementById("userModal");
    if (modal) {
        modal.style.display = "none";
    } else {
        console.error("No se encontró el modal de usuario.");
    }
}

window.closeUserModal = closeUserModal;