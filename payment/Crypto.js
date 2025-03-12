//import Payment from "./Payment";
import { PaymentStrategy } from "/payment/PaymentStrategy.js";

export class Crypto extends PaymentStrategy {
    pay(amount) {
        console.log(`Pagando $${amount} con Criptomonedas.`);
    }
}
//
//     // Método principal para realizar el pago
//     async pay(amount) {
//         try {
//
//
//         } catch (error) {
//             console.error('Error al procesar el pago:', error);
//             return false; // Si hay error, consideramos la transacción fallida
//         }
//     }
//
//     // Obtener los precios de Bitcoin y Ethereum
//     async obtenerPrecios() {
//         const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd';
//         try {
//             const respuesta = await fetch(url);
//             return await respuesta.json();
//         } catch (error) {
//             console.error('Error al obtener los precios:', error);
//             throw error; // Si no se obtienen los precios, lanzar error
//         }
//     }
//
// }
//
// export default Crypto;
