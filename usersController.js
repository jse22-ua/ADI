const knex = require('knex')({
    client: 'sqlite3', // or 'better-sqlite3'
    connection: {
      filename: "./comicStore.sqlite"
    }
});

function validateEmail(email){
    const emailOK = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailOK.test(email);

      
}

async function existUser(id){
    user = await knex('users').where({id}).first()
    if(!user){
      return false
    }
    return true
  }

async function existEmail(email){
    const existEmail = await knex('users').where({email}).first();
    if(existEmail){
        return true
    }
    else{
        return false
    }
}

function login(pet,resp){

}

async function registry(pet,resp){
    const datos = pet.body;
    try{
        if(!datos.email||!datos.password||!datos.nickname){
            resp.status(400);
            resp.send({
                code: 1,
                message: 'Faltan datos'
            })
        }else if(!validateEmail(datos.email)){
            resp.status(400);
            resp.send({
                code:2,
                message: 'Datos incorrectos'
            })
        }else if(await existEmail(datos.email)){
            resp.status(409);
            resp.send({
                code:3,
                message: 'ya existe una cuenta con este email'
            })
        }else{
            
                if(datos.admid){
                    added = await knex('users')
                        .insert({
                            email:datos.email,
                            password:datos.password,
                            nickname:datos.nickname,
                            admid:datos.admid
                        });
                }
                else{
                    added = await knex('users')
                        .insert({
                            email:datos.email,
                            password:datos.password,
                            nickname:datos.nickname
                        });
                }
                resp.status(201)
                resp.setHeader("Location","http://localhost:3000/users/"+added)
                resp.send(await knex('users').where('id','=',added).first())
            
        }
    }catch(error){
        resp.status(500).send({error:error})
    }
}

async function editUser(pet,resp){
    const id = parseInt(pet.params.id)
    const datos = pet.body;
    if(isNaN(id)){
        resp.status(400)
        resp.send({
            code: 4,
            message: "El parametro id debería ser un número"
        })
    }
    else if(!datos.email||!datos.password||!datos.nickname){
        resp.status(400);
        resp.send({
            code: 1,
            message: 'Faltan datos'
        })
    }else if(!validateEmail(datos.email)){
        resp.status(400);
        resp.send({
            code:2,
            message: 'Datos incorrectos'
        })
    }else{
        try{
            update = await knex('users')
            .where('id','=',id)
            .update({
                email:datos.email,
                password:datos.password,
                nickname:datos.nickname
            });
            if(!update){
                resp.status(404)
                resp.send({
                    code:5,
                    message:"Usuario no encontrado"
                })
            }else{
                resp.status(200);
                resp.send(await knex('users').where('id','=',update).first())
            }
        }catch(error){
            resp.status(500).send({error:error})
        }
    }
}

async function deleteUser(pet,resp){
    const id = parseInt(pet.params.id)
    if(isNaN(id)){
        resp.status(400)
        resp.send({
            code: 4,
            message: "El parametro id debería ser un número"
        })
    }else{
        try{
            const deleted = await knex('users').where({id}).del();
            if(!deleted){
                resp.status(404)
                resp.send({
                    code:5,
                    message:"Usuario no encontrado"
                })
            }else{
                resp.status(204)
                resp.send({
                    code:6,
                    message:"Usuario eliminado"
                })
            }
        }catch(error){
            resp.status(500).send({error:error})
        }
    }
}

async function showUser(pet,resp){
    const id = parseInt(pet.params.id)
    if(isNaN(id)){
        resp.status(400)
        resp.send({
            code: 4,
            message: "El parametro id debería ser un número"
        })
    }else{
        try{
            const user = await knex('users').where({id}).first();
            if(!user){
                resp.status(404)
                resp.send({
                    code:5,
                    message:"Usuario no encontrado"
                })
            }else{
                resp.status(200)
                resp.send(user)
            }
        }catch(error){
            resp.status(500).send({error:error})
        }
    }
}


module.exports = {
    login,
    registry,
    editUser,
    deleteUser,
    showUser,
    existUser
};
