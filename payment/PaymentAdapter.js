class PaymentAdapter {
    constructor(paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    async pay(amount) {
        return await this.paymentMethod.pay(amount);
    }
}

export default PaymentAdapter;
