const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'default_secret_key' //Este es un codigo secreto, entonces no se puede subir al repositorio

function sign(payload){
    return jwt.sign(payload, SECRET, {expiresIn:'2h'})
}


function authMiddleware(req, res, next){ //newxt ayuda a ejecutar la siugiente funci[on]
    const header = req.headers.authorization //dejalo en min
    
    if(!header) return res.status(401).json({error:"Falta Autorizacion"})
        
    //      bearer, [token]
 //   const {type, token} = header.split(" ")//EL type indica como estamos recibiendo la informacion
    const [type, token] = header.split(' ');

    if(type !== 'Bearer' || !token) return res.status(401).json({error:'Formato invalido'})

    try{
        res.user = jwt.verify(token, SECRET) //req user es lo qeu nos envio el usuario que viene con un objeto y es lo ue rtaes el usuario
        return next()
    }catch(er){
        return res.status(401).json({error:"Token invalido"})
    }

    function requireRole(...roles){
        return (req, res, next)=>{
            if(!roles.includes(req.user.role)){//si no viene el role
                return res.status(403).json({error:'No autorizado'})

            }
            next()
        }
    }
}
module.exports = {sign, authMiddleware}