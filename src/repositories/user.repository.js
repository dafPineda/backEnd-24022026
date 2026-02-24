const {pool} = require('../db') //Base de datos

class UsersRepository {
  async findByEmail(email) {
    const r =  await pool.query(
      `select id, email, password_hash, role from users where email = $1`, [email]
    );
    return r.rows[0] || null
  }
  async create(email, passwordHash, role = 'user') { //Se busca cuando quieren hacer loggin para no repetirlos
    const result = await pool.query(
      `insert into users(email, password, password_hash, role) values ($1, $2, $3) returning id, email, role`, [email, passwordHash, role]
    )
    return result.rows[0]
  }
  async findById(id) { //Id se usa cuando ya tiene loggeados a lso usuarios
    const r = await pool.query(
      'select id, email, role from users where id = $1', [id]
    )
    return r.rows[0] || null
  }
}
  module.exports = {UsersRepository} 
