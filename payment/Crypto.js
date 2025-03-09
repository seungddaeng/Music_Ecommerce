const Payment = require('./Payment');

class Crypto extends Payment {
    pay(amount) {
        console.log(`Paying $${amount} with Cryptocurrency`);
        // Lógica para procesar el pago con criptomonedas
    }
}

module.exports = Crypto;