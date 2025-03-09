class PaymentAdapter {
    constructor(paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    pay(amount) {
        this.paymentMethod.pay(amount);
    }
}

module.exports = PaymentAdapter;