// Clase Qr.js
class Qr {
    constructor() {
        // Inicializa la clase
    }

    makeCode(data) {
        const qrCodeElement = document.getElementById('qr-code-container');
        QRCode.toCanvas(qrCodeElement, data, { errorCorrectionLevel: 'H' }, function (error) {
            if (error) console.error(error);
            console.log('Código QR generado!');
        });
    }
    createImgTag() {
            // Este método debería devolver un string con la etiqueta <img> del QR generado
            const qrCodeElement = document.getElementById('qr-code-container');
            return `<img src="${qrCodeElement.toDataURL()}" alt="Código QR">`;
    }
}

// Función para generar el código QR
function generateQRCode(amount) {
    const qrData = {
        amount: amount,
        merchantId: 'your-merchant-id'
    };
    const qrCode = new Qr();
    qrCode.makeCode(JSON.stringify(qrData)); // Genera el código QR con la información de pago
    document.getElementById('qr-code-container').innerHTML = qrCode.createImgTag(); // Muestra el código QR en el contenedor
}

// Llamar a la función de generación de QR
generateQRCode(100); // Ejemplo de monto