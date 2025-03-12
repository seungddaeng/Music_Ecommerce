export class PaymentContext {
    setStrategy(strategy) {
        this.strategy = strategy;
    }

    executePayment(amount) {
        if (!this.strategy) {
            throw new Error("No se ha definido una estrategia de pago.");
        }
        this.strategy.pay(amount);
    }
}