const knex = require('knex')({
    client: 'sqlite3', // or 'better-sqlite3'
    connection: {
      filename: "./comicStore.sqlite"
    }
});

const usersController = require('./usersController')
const comicsController = require('./comicsController')



async function createOrder(pet,resp){
  const datos = pet.body
  try{
    if(!datos.id_user||!datos.id_comic){
      resp.status(400);
      resp.send({
          code: 1,
          message: 'Faltan datos'
      })
    }
    else if(!comicsController.existComic(datos.id_comic)){
      resp.status(404);
      resp.send({
          code:7,
          message: 'Comic no encontrado'
      })
    }else if(!usersController.existUser(datos.id_user)){
      resp.status(404);
      resp.send({
          code:8,
          message: 'Usuario no existente'
      })
    }else{
      const fechaActual = new Date()
      const comic = await knex('orders').where({id}).first()
      const created = await knex('orders')
      .insert({
        id_user:datos.id_user,
        id_comic:datos.id_comic,
        price:comic.price,
        fecha: fechaActual
      })
      resp.status(200)
      resp.send(datos)
    }
  }catch(error){
    resp.status(500).send({error:error})
  }
}

async function listOrders(pet,resp){//paginar
  try{
    resp.status(200)
    resp.send(await knex('orders'))
  }catch(error){
    resp.status(500).send({error:error})
  }
}

module.exports = {
  createOrder,
  listOrders
};