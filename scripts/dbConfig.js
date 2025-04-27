import mysql from 'mysql';

const connection = mysql.createConnection({
    host: 'ecommerceaws.cqnaokm40u5l.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'AnaVillegas24',
    database: 'ecommerceaws',
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