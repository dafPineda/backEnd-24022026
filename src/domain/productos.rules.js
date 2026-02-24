function validateCreate(
    {nombre, precio, sku, stock=0, marca='unknow', categoria='store', description='without description', imagen='No image', modelo='No modelo'}){

    if(!nombre || typeof nombre != 'string') return {ok:false, error:'Nombre invalido'}
    if(!sku || typeof sku!= 'string') return {ok:false, error:'sku invalido'}

    const p = Number(precio)
    if(p<=0 || !Number.isFinite(p)) return {ok:false, error:'Precio invalido'}

    let sNum = 0
    if(!stock){
         sNum= Number(stock);
        if(isNaN(sNum) || sNum <0 || Number.isFinite(sNum)) return {ok:false, error:'Stock invalido'}
    }
    return {ok: true, data: {nombre, p, sku, sNum, marca, categoria, description, imagen, modelo}}
}
function validateUpdate({nombre, precio, sku, stock=undefined, marca=undefined, categoria=undefined, description=undefined, imagen=undefined, modelo=undefined}){
    if(nombre !== undefined && typeof nombre != 'string') return {ok:false, error:'Nombre invalido'}
    
    let precioNum
    if(precio !== undefined){
        precioNum = Number(precio)
        if(precioNum <=0 || !isFinite(precioNum)){
            return {ok:false, error:'Precio invalido'}
        }
    }

    if(sku !== undefined && typeof sku !== 'string') return {ok:false, error:'SKU invalido'}
    
    let stockNum = 0
    if(stock !== undefined){
        stockNum = Number(stock)
        if(stock>=0 || !isFinite(stockNum)){
            return {ok:false, error:'Stock invalido'}
        }
    }
    
    if(marca !== undefined && typeof marca !== 'string') return {ok:false, error:'Marca invalida'}
    if(categoria !== undefined && typeof categoria !== 'string') return {ok: false, error:"Categoria invalida"}
    if(description !== undefined && typeof description !== 'string') return {ok: false, error:"Descripcion invalida"}
    if(imagen !== undefined && typeof imagen !== 'string') return {ok:false, error:"Link invalido"}
    if(modelo !== undefined && typeof modelo !== 'string') return {ok:false, error:"modelo invalido"}
    
    return {ok: true, data: {nombre, precioNum, sku, stockNum, marca, categoria, description, imagen, modelo}}

}
module.exports = {validateCreate, validateUpdate}