import mysql from 'mysql';

const connection = mysql.createConnection({
    host: 'ecommerceaws.cqnaokm40u5l.us-east-1.rds.amazonaws.com', // Tu endpoint RDS
    user: 'admin', // Tu usuario RDS
    password: 'AnaVillegas24', // Aquí tu contraseña real de AWS RDS
    database: 'ecommerceaws', // Nombre de la base tal como la creaste
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos en AWS RDS:', err);
        return;
    }
    console.log('Conectado a la base de datos AWS RDS');
});

export default connection;