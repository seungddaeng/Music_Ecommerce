const Payment = require('./Payment');

class CreditCard extends Payment {
    pay(amount) {
        console.log(`Procesando pago de $${amount} con tarjeta de crédito...`);
        const paymentSuccess = this.validatePayment();
        return paymentSuccess;
    }

    validatePayment() {
        const isValid = Math.random() > 0.2;
        return isValid;
    }
}
//completarxd
module.exports = CreditCard;