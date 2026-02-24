const { ProductosRepository } = require('../repositories/productos.repository');
const { validateCreate } = require('../domain/productos.rules')
const { validateUpdate } = require('../domain/productos.rules')

const repo = new ProductosRepository();

async function getAll(req, res) {
  const productos = await repo.getAll()
  if(!productos || productos === 0) return res.status(204).send('No data')
  return res.json(productos)
}

async function getAllActive(req, res) {
  const productos = await repo.getAll()
  if(!productos || productos.length <= 0) return res.status(204).send('No data')
  return res.json(productos)
}

async function getById(req, res) {
  const id = Number(req.params.id)
  const producto = await repo.getById(id)

  if (!producto || producto.length <= 0) {
    return res.status(404).json({error: 'Producto no encontrado'})
  }
  return res.json(producto)
}

 async function search(req, res){
  const { nombre, minPrecio, maxPrecio, page, size} = req.query;
  
  const resultados = await repo.buscar({ nombre, minPrecio, maxPrecio, page, size })
  if(resultados.error)return res.status(404).json(resultados.error)

  return res.status(200).json(resultados) 
} 
async function create(req, res) {
  if(!req.body) return res.status(400).json({error:"No se creo"})

  const { nombre, precio, sku, stock, marca, categoria, description, imagen, modelo } = req.body;
  const data = validateCreate({nombre, precio, sku, stock, marca, categoria, description, imagen, modelo})

  if(!data.ok) return res.status(400).json(data.error)

  const nuevo = await repo.create(data.data)
  return res.status(201).json(nuevo) 
}

async function update(req, res) {
  if(!req.body) return res.status(400).send()
  const id = Number(req.params.id);
  const {nombre, precio, sku, stock, marca, categoria, description, imagen, modelo} = req.body
  const update = {
    nombre: nombre !== undefined ? nombre : undefined,
    precio: precio !== undefined ? precio : undefined,
    sku:    sku   !== undefined ? sku : undefined, 
    stock:  stock !== undefined ? stock: undefined, 
    marca:  marca !== undefined ? marca : undefined, 
    categoria: categoria !== undefined ? categoria : undefined, 
    description: description !== undefined ? description : undefined, 
    imagen: imagen !== undefined ? imagen : undefined, 
    modelo: modelo !== undefined ? modelo : undefined
  }
  const data = validateUpdate(update)

  if(!data.ok) return res.status(404).jason(data.error)
  const actualizado = await repo.update(id, data.data)
  if (!actualizado) return res.status(404).json({error: 'No encontrado'})

  return res.status(200).json(update.row)
}

async function remove(req, res) {
  const id = Number(req.params.id);
  const ok = await repo.delete(id)

  if (!ok) {
    return res.status(404).json({error: 'No encontrado'})
  }
  return res.status(200).send()
}

module.exports = { getAll, getAllActive, getById, create, update, remove,  search}

