const express = require('express')
const app = express()
const usersControllers = require('./usersController');
const ordersController = require('./ordersController');
const comicsController = require('./comicsController');
app.use(express.json())



app.post('/users', usersControllers.registry)//registry

/*app.post('/users/login',(pet,post)=>{
// mirar lo de login
})*/

app.get('/users/:id', usersControllers.showUser)

app.delete('/users/:id',usersControllers.deleteUser)

app.put('/users/:id',usersControllers.editUser)

app.get('/comics',comicsController.listComics)//por probar

app.post('/comics',comicsController.createComic)//por probar

app.get('/comics/buscar', comicsController.searchComic)

app.get('/comics/:id',comicsController.showComic)

app.put('/comics/:id',comicsController.editComic)

app.delete('/comics/:id',comicsController.deleteComic)

app.post('/pedidos',ordersController.createOrder)//por probar

app.get('/pedidos',ordersController.listOrders)//por probar

app.listen(3000,()=>{
    console.log("Servidor escuchando en el puerto 3000...")
})
