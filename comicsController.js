const knex = require('knex')({
  client: 'sqlite3', // or 'better-sqlite3'
  connection: {
    filename: "./comicStore.sqlite"
  }
});

const categories = {
DC : "DC",
MARVEL : "MARVEL",
INDIE : "INDIE"
}

async function existComic(id){
comic = await knex('comics').where({id}).first()
if(!comic){
  return false
}
return true
}

async function createComic(pet,resp){ //añadir autentificación
const datos = pet.body
if(!datos.name||!datos.autor||!datos.description||!datos.category||!datos.price||!datos.stock){
  resp.status(400);
  resp.send({
      code: 1,
      message: 'Faltan datos'
  })
}else{
  try{
    const created = await knex('comics')
      .insert({
        name: datos.name,
        autor: datos.autor,
        description:datos.description,
        category:datos.category,
        price:datos.price,
        stock:datos.stock,
      });
    resp.status(201);
    resp.setHeader("Location","http://localhost:3000/users/"+created)
    resp.status(datos)
  }catch(error){
    resp.status(500).send({error:error})
  }
}
}

async function editComic(pet,resp){
  const id = parseInt(pet.params.id)
  const datos = pet.body
  try{
    if(!datos.name||!datos.autor||!datos.description||!datos.category||!datos.price||!datos.stock){
      resp.status(400);
      resp.send({
          code: 1,
          message: 'Faltan datos'
      })
    }else{
        const update = await knex('comics')
          .where('id','=',id)
          .update({
            name: datos.name,
            autor: datos.autor,
            description:datos.description,
            category:datos.category,
            price:datos.price,
            stock:datos.stock
          });
        if(!update){
          resp.status(404)
          resp.send({
            code:5,
            message:"Comic no encontrado"
          })
        }else{
          resp.status(200)
          resp.send(await knex('comics').where('id','=',id).first())
        }
    }
  }catch(error){
    resp.status(500).send({error:error})
  }
}

async function deleteComic(pet,resp){
  const id = parseInt(pet.params.id)
  if(isNaN(id)){
    resp.status(400)
    resp.send({
      code:4,
      message: "El parametro id debería ser un número"
    })
  }else{
    try{
      const deleted = await knex('comics').where({id}).del()
      if(!deleted){
        resp.status(404)
        resp.send({
          code:5,
          message:"Comic no encontrado"
        })
      }else{
        resp.status(204)
        resp.send({
          code:6,
          message:"Comic eliminado"
        })
      }
    }catch(error){
      resp.status(500).send({error:error})
    }
  }
}

async function showComic(pet,resp){
const id = parseInt(pet.params.id)
if(isNaN(id)){
  resp.status(400)
  resp.send({
    code:4,
    message: "El parametro id debería ser un número"
  })
}else{
  try{
    const comic = await knex('comics').where({id}).first()
    if(!comic){
      resp.status(404)
      resp.send({
        code:5,
        message:"Comic no encontrado"
      })
    }else{
      resp.status(200)
      resp.send(comic)
    }
  }catch(error){
    resp.status(500).send({error:error})
  }
}
}

async function listComics(pet,resp){
try{
  resp.status(200)
  resp.send(await knex.select().from("comics"))
}catch(error){
  resp.status(500).send({error:error})
}
}

async function searchComic(pet,resp){
const datos = pet.query;
if(!datos.name && !datos.autor){
  resp.status(400)
  resp.send({
    code:8,
    message:"Parametro no validos: debes proporcional al menos el nombre o el autor"
  })
}else{
  if(!datos.name){
    found = await knex('comics').where('name','=',datos.name)
  }else if(!datos.autor){
    found = await knex('comics').where({autor:datos.autor})
  }else{
    found = await knex('comics').where({name:datos.name,autor:datos.autor})
  }
  resp.status(200)
  resp.send(found)
}
}

module.exports = {
createComic,
editComic,
deleteComic,
showComic,
listComics,
searchComic,
existComic
};