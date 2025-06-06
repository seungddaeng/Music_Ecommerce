# MusicStore - Ecommerce de Música

MusicStore es un proyecto de ecommerce especializado en la venta de álbumes de música. Este proyecto está diseñado para ofrecer una experiencia de compra fluida y segura, con funcionalidades como registro de usuarios, inicio de sesión, carrito de compras y múltiples métodos de pago.

## Funcionalidades Principales

### 1. **Registro e Inicio de Sesión**
   - Los usuarios pueden registrarse proporcionando su nombre completo, correo electrónico y contraseña.
   - Los usuarios registrados pueden iniciar sesión para acceder a su cuenta.

### 2. **Carrito de Compras**
   - Los usuarios pueden agregar productos al carrito de compras.
   - El carrito muestra el subtotal, impuestos, envío y el total a pagar.
   - Los usuarios pueden eliminar productos del carrito.

### 3. **Métodos de Pago**
   - **Tarjeta de Crédito**: Validación de datos y procesamiento de pagos.
   - **Criptomonedas**: Soporte para pagos con Bitcoin y Ethereum.
   - **Venmo**: Integración con Venmo para pagos rápidos.
   - **PayPal**: Vinculación de cuenta PayPal para pagos seguros.
   - **QR**: Generación de códigos QR para pagos.

### 4. **Gestión de Productos**
   - Los productos se cargan dinámicamente desde una base de datos MySQL.
   - Los usuarios pueden buscar productos por nombre de álbum o artista.
   - Los productos se muestran en una cuadrícula con opciones para agregar al carrito.

### 5. **Base de Datos**
   - El proyecto utiliza MySQL para almacenar información de usuarios, productos y pagos.
   - Se incluyen scripts para la conexión y consultas a la base de datos.

## Instalación y Configuración
1. **Clonar el Repositorio**
   ```bash
   git clone https://github.com/seungddaeng/Music_Ecommerce
   cd Music_Ecommerce
2. **Instalar Dependencias**
npm install Express

3. **Configurar la Base de Datos**
Crear una base de datos MySQL llamada musicecommerce.
Importar el archivo SQL proporcionado en la carpeta database/ para crear las tablas necesarias.

4. **Iniciar el Servidor**
node server.js

5. **Acceder al Proyecto**
Abre tu navegador y visita http://localhost:3000.

## Tecnologías Utilizadas

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Express.js
- **Base de Datos**: MySQL
- **Métodos de Pago**: Tarjeta de Crédito, Criptomonedas, Venmo, PayPal, QR

Gracias por explorar **MusicStore** !!


