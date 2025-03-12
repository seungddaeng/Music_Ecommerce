import { PaymentStrategy } from "./PaymentStrategy.js";

export class Crypto extends PaymentStrategy {
    async pay(amount, cryptoType) {
        try {
            console.log(`Obteniendo precios de ${cryptoType}...`);
            const precios = await this.obtenerPrecios();

            if (!precios[cryptoType]) {
                throw new Error("Criptomoneda no válida.");
            }

            // Convertir el monto en USD a la criptomoneda seleccionada
            const cryptoAmount = amount / precios[cryptoType].usd;
            console.log(`Monto en USD: $${amount} equivale a ${cryptoAmount.toFixed(6)} ${cryptoType.toUpperCase()}`);

            // Simulando la verificación de saldo del usuario (esto lo implementas según tu base de datos o backend)
            const saldoUsuario = 1; // Aquí deberías obtener el saldo real de la base de datos del usuario en esa criptomoneda
            if (saldoUsuario >= cryptoAmount) {
                console.log(`Pago exitoso: ${cryptoAmount.toFixed(6)} ${cryptoType.toUpperCase()} descontados.`);
                return true;
            } else {
                console.log("Saldo insuficiente para realizar la transacción.");
                return false;
            }
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            return false;
        }
    }

    async obtenerPrecios() {
        const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd";
        try {
            const respuesta = await fetch(url);
            return await respuesta.json();
        } catch (error) {
            console.error("Error al obtener los precios:", error);
            throw error;
        }
    }
}
