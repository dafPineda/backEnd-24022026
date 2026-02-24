## Para probar este proyecto:
- Postman: https://documenter.getpostman.com/view/51906938/2sBXcBo2q3 
- Instalar:
    * init npm
    * pg
    * (opcional) --save-dev nodemon

## Archivos
- En un archivo de la raiz, guarde la variable con acceso a la base de datos de productos
- Index gestiona las llamadas
- La carpeta src contiene el backend:
    * La carpeta routes contiene todos las rutas
    * La carpeta controllers avisa si los datos son validos
    * La carpeta domain hace filtrado de datos
    * La carpeta repositories hace las peticiones a la base de datos

## Justificación
En controlador extraigo todos los datos con destructuración desde el require. Los envio a mi repositorio y espero un resultado, si este llega a tener en un objeto el atributo error, envio error 404, de otra forma, entrego la petición.

En repositorio recibo todos los datos e inicializo dos arreglos, los cuales tendran los parametros que el usuario estara solicitando. Index estara manejando el index del arreglo que se dara como segundo parametro para evitar las inyecciones de código como se nos había enseñado.
El primer filtro verifica que el controlador de paginación sí son números. Luego se verifica si el usuario hizo una petición y dependiendo de la que haya hecho se agrega su petición y la varible ingresada. Agregamos al arreglo de valores el tamaño y el offset.
Concatenamos todo y hacemos el query y lo dado es la data.
Para hacer el reporte, usamos una variable que mantiene limpio los valores antes de usar y con un query contamos todos los casos posibles, esto seran todos los casos totales y lo demas son datos que el usuario envia. 
Bastante díficil el proceso.

## Postman
- Solo búsqueda por nombre
![busqueda por nombre](./img/Captura%20de%20pantalla%202026-02-14%20064138.png)
- Solo rango de precio
![rango de precio](./img/Captura%20de%20pantalla%202026-02-14%20064319.png)
- Combinación nombre + rango
![nombre y rango](./img/Captura%20de%20pantalla%202026-02-14%20064410.png)
- Uso de paginación
![paginacion](./img/Captura%20de%20pantalla%202026-02-14%20082209.png)