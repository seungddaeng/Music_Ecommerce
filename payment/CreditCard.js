import Payment from './Payment.js';
import db from '../scripts/dbConfig.js';

class CreditCard extends Payment {
    async pay(amount) {
        console.log(`Procesando pago de $${amount} con tarjeta de crédito...`);

        const isValid = await this.validatePayment();
        if (!isValid) {
            console.log("Pago fallido: Datos de la tarjeta inválidos.");
            return false;
        }

        const hasEnoughBalance = await this.checkBalance(amount);
        if (!hasEnoughBalance) {
            console.log("Pago fallido: Saldo insuficiente.");
            return false;
        }

        const paymentSuccess = await this.processPayment(amount);
        return paymentSuccess;
    }

    async validatePayment() {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardName = document.getElementById('cardName').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        if (!cardNumber || cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
            alert("Número de tarjeta inválido. Debe tener 16 dígitos.");
            return false;
        }

        if (!cardName || cardName.trim() === "") {
            alert("Nombre del titular inválido.");
            return false;
        }

        if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
            alert("Fecha de expiración inválida. Use el formato MM/YY.");
            return false;
        }

        if (!cvv || cvv.length !== 3 || !/^\d+$/.test(cvv)) {
            alert("CVV inválido. Debe tener 3 dígitos.");
            return false;
        }

        const sql = `
            SELECT * FROM credit_cards
            WHERE card_number = ? AND card_name = ? AND expiry_date = ? AND cvv = ?
        `;
        const params = [cardNumber, cardName, expiryDate, cvv];

        try {
            const results = await db.query(sql, params);
            if (results.length === 0) {
                alert("Tarjeta no encontrada. Verifique los datos.");
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error al validar la tarjeta:", error);
            return false;
        }
    }

    async checkBalance(amount) {
        const cardNumber = document.getElementById('cardNumber').value;

        const sql = `SELECT balance FROM credit_cards WHERE card_number = ?`;
        const params = [cardNumber];

        try {
            const results = await db.query(sql, params);
            if (results.length === 0) {
                alert("Tarjeta no encontrada.");
                return false;
            }

            const balance = parseFloat(results[0].balance);
            if (balance < amount) {
                alert("Saldo insuficiente.");
                return false;
            }

            return true; // Saldo suficiente
        } catch (error) {
            console.error("Error al verificar el saldo:", error);
            return false;
        }
    }

    async processPayment(amount) {
        const cardNumber = document.getElementById('cardNumber').value;

        const sql = `UPDATE credit_cards SET balance = balance - ? WHERE card_number = ?`;
        const params = [amount, cardNumber];

        try {
            await db.query(sql, params);
            console.log(`Pago exitoso: $${amount} descontados.`);
            return true;
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            return false;
        }
    }
}

export default CreditCard;
