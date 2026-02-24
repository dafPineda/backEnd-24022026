const { NoticeMessage } = require('pg-protocol/dist/messages');
const {pool} = require('../db') //Base de datos

class ProductosRepository {
  async getAll() {
    const r =  await pool.query(
      'select id, nombre, precio, stock, marca, categoria, description, sku, imagen, modelo, updated_at from productos'
    );
    return [...r.rows]
  }
  async getAllActive() {
    const result = await pool.query(
      'select id, nombre, precio stock, marca, categoria, description, sku, imagen, modelo, updated_at from productos where activo = true;'
    )
    return result.rows
  }
  async getById(id) {
    const r = await pool.query(
      'select id, nombre, precio, stock, marca, categoria, description, sku, imagen, modelo, updated_at from productos where id = $1', [id]
    )
    return r.rows[0]
  }
  async buscar({nombre, minPrecio, maxPrecio, page = 1, size = 5}){
    const condiciones = []; //Guardar los parametros
    const valores = []; //Guardar los valores
    let index = 1; //Arreglo de proteccion

    const page1 = Number(page)
    const size1 = Number(size)
    if(!isFinite(page1) || !isFinite(size1) || page1<=0 || size1 <=0) return {error:"Size o page no son numeros"}

    if (nombre) { 
      condiciones.push(`nombre ILIKE $${index++}`); 
      valores.push(`%${nombre}%`); 
    } 
    if (minPrecio !== undefined) { 
      condiciones.push(`precio >= $${index++}`); 
      valores.push(Number(minPrecio)); 
    } 
    if (maxPrecio !== undefined ) { 
      condiciones.push(`precio <= $${index++}`); 
      valores.push(Number(maxPrecio)); 
    }
    const var1 = [...valores];//Copia para evitar error
    const offset = (page1 - 1) * size1; 
    valores.push(Number(size1), Number(offset)); 

    const query = `select id, nombre, precio, sku, stock, categoria from productos ${condiciones.length > 0 ? "WHERE " + condiciones.join(" AND ") : ""} order by id desc limit $${index++} offset $${index++}`;

    const data = await pool.query(query, valores); 

    const contador = ` SELECT COUNT(*) AS total FROM productos ${condiciones.length > 0 ? "WHERE " + condiciones.join(" AND ") : ""}; `
    const pages = await pool.query(contador, var1);

    if(data.rows.length <= 0) return {error: "No data"};

    const result ={
      "data": data.rows,
      "page":page1,
      "limit": size1,
      "total": pages.rows[0].total
    }
    return(result);
  }
  async create({nombre, p:precio, sku, sNum:stock, marca, categoria, description, imagen, modelo}) {
    const result = await pool.query(
      'insert into productos (nombre, precio, sku, stock, marca, categoria, description, imagen, modelo) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id, nombre, precio, stock, sku',
                              [nombre, precio, sku, stock, marca, categoria, description, imagen, modelo])
    return result.rows
  }
  async update(id, {nombre, precioNum: precio, sku, stockNum: stock, marca, categoria, description, imagen, modelo}) {
    const resul = await pool.query(
      'update productos set nombre = coalesce ($1, nombre), precio = coalesce ($2, precio), sku = coalesce($3, sku), stock = coalesce($4, stock), marca = coalesce ($5, marca) , categoria = coalesce($6, categoria), description = coalesce($7, description), imagen= coalesce($8, imagen), modelo = coalesce($9, modelo) where id = $10 returning nombre, precio, sku, stock, marca, categoria, description, imagen, modelo;', 
      [nombre ?? null, precio ?? null, sku ?? null, stock ?? null, marca ?? null, categoria ?? null, description ?? null, imagen ?? null, modelo ?? null,  id]);
    return resul.rows[0] || null;
  }
  async delete(id) {
      const result  = await pool.query(
        'delete from productos where id = $1 returning id', [id])
        return result.rows[0];
  }
}

module.exports = { ProductosRepository }