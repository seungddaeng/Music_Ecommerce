const Payment = require('./Payment');

class PayPal extends Payment {
    pay(amount) {
        console.log(`Paying $${amount} with PayPal`);
        // Lógica para procesar el pago con PayPal
    }
}

module.exports = PayPal;