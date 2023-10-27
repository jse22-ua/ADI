const knex = require('knex')({
    client: 'sqlite3', // or 'better-sqlite3'
    connection: {
      filename: "./comicStore.sqlite"
    }
});


async function createOrder(pet,resp){
  const datos = pet.body
  try{
    if(!datos.id_user||!datos.id_comic||!datos.quantity){
      resp.status(400);
      resp.send({
          code: 1,
          message: 'Faltan datos'
      })
    }
    else if(!await knex('comics').where({id:datos.id_comic}).first()){
      resp.status(404);
      resp.send({
          code:7,
          message: 'Comic no encontrado'
      })
    }else if(!await knex('users').where("id","=",datos.id_user).first()){
      resp.status(404);
      resp.send({
          code:8,
          message: 'Usuario no existente'
      })
    }else{
      const fechaActual = new Date()
      const comic = await knex('comics').where("id","=",datos.id_comic).first()
      const formattedDate = fechaActual.toISOString().slice(0, 19).replace("T", " ");
      const created = await knex('orders').insert({
          id_user:datos.id_user,
          id_comic:datos.id_comic,
          price:comic.price,
          fecha: formattedDate,
          quantity:datos.quantity,
          totalprice:comic.price*datos.quantity
        })
      resp.status(201)
      resp.send(await knex('orders').where({fecha:formattedDate,id_user:datos.id_user}).first())
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