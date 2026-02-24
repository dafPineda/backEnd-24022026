require('dotenv').config(); //Paquete Que hace la conexión
const{Pool} = require('pg');

if(!process.env.DATABASE_URL){
    throw new Error('falta DATABASE_url')
}
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
})

module.exports = {pool}