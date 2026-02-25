const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const { router: productosRouter } = require('./src/routes/productos.routes')
const { router: usersRouter } = require('./src/routes/users.routes')
const { pool } = require ('./src/db')

const app = express()
const PORT = process.env.PORT || 3001

const allowed = [
  'http://localhost:3000',
  'http://localhost:3001'
]

//app.use(cors({orgin:'http://localhost:3000'}))
app.use(
  cors({
    origin: function (origin, cb){
      if(!origin) return cb(null, true)
      if(allowed.includes(origin)) return cb(null, true)
      return cb(new Error('CORS bloqueado: '+ origin))
    }
  })
);

const limiter = rateLimit({
  windowMs:15*60*1000,
  max:100,
  message: 'Demasiadas peticiones'
})
app.use(limiter)
const{sign, authMiddleware} = require('./src/auth')

app.use(express.json())
app.use('/productos', productosRouter);
app.use('/users', usersRouter)

app.use((req, res, next) =>{
  console.log(`${req.method} ${req.url}`)
})

app.post('/login', (req, res)=>{
  const {email, password} = req.body

  //Harcorear: Es poner codigo dinamico como estatico.
  //No usar esto en produccion
  if(email !== 'admin@test.com' || password !== '1234') return res.status(401).json({error:'Credenciales incorrectas'})
  
  const token = sign({email, role:'Admin'})
  return res.json({token})
})

app.get('/private', authMiddleware, (req, res) =>{
  return res.json({
    ok:true,
    user:req.user
  })
})


app.listen(PORT, () => {
  console.log(`Servidor Corriendo en http://localhost:${PORT}`)
})

//esta parte es la salud del sistema. Checa constantemente si la conexion es corecta y se recibe cominucacion
app.get('/health', async (req, res) => {
  try{
    const res = await pool.query('select 1')
    return res.json({ok:true})
  }catch(err){
    return res.status(500).json({ok: false,})
  }
})