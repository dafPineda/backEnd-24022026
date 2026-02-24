const { UsersRepository } = require("../repositories/user.repository")
const bcrypt = require('bcryptjs')
const sign = require('../auth')

const repo = new UsersRepository();

async function logInUser(req, res) {
  const { email, password } = req.body
  const user = await repo.findByEmail(email)

  if(!user) return res.status(401).json({error:'Credenciales incorrectas'})
  
    const ok = await bcrypt.compare(password, user.password_hash) 

    if(!ok){
        return res.status(401).json({error:'Credenciales incorrectas'})
    }

    const token = sign({
        id: user.id,
        email: user.email,
        role: user.role
    })

    return res.json({ token })
}

async function create(req, res){
    const {email, password, role} = req.body;
    
    const passwordHash = bcrypt.hash(password, 8)
    console.log(email, password, role)

    const user = await repo.create(email, passwordHash, role)

    return  res.staus(201).jason({ok:true, user:user})
}

module.exports = {logInUser, create}
