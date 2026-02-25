const express = require('express')
const cors = require('cors')
const { pool } = require ('./src/db')
const { sign, authMiddleware } = require('./src/auth');
const { router: productosRouter } = require('./src/routes/productos.routes')
const { router: usersRouter } = require('./src/routes/users.routes')

const app = express()
const PORT = process.env.PORT || 3001 

const allowed = [
  'http://localhost:3000',
  'http://localhost:3001'
  //,ruta de vercel
]

app.use(cors({
  origin: function (origin, cb) {
    if (!origin) return cb(null, true); // Postman
    if (allowed.includes(origin)) return cb(null, true);
    return cb(new Error('CORS bloqueado: ' + origin));
  }
}));

app.use(express.json())
app.get('/', (req, res) => {
  res.send('API OK');
})
app.use('/productos', productosRouter);
app.use('/users', usersRouter)

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
app.get('/health', (req, res) => {
  res.json({ok:true, service:'api'})
})

app.get('/health/db', async (req, res) => {
  try {
    const r = await pool.query('select 1 as ok');
    return res.json({ok:true, db:r.rows[0].ok})
  } catch (err) {
    console.log('DB Error', err.message)
    return res.status(500).json({ok:false, error:'DB no disponible'})
  }
})

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

const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs:15*60*1000,
  max:100,
  message: 'Demasiadas peticiones'
})
app.use(limiter)

const { errorHandler } = require('./src/middlewares/error.middleware');
app.use(errorHandler);