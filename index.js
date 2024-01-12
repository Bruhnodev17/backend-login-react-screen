const express = require('express')
const app = express()
const uuid = require('uuid')

app.use(express.json())
const cors = require('cors');
app.use(cors());

const port = 3000

const users = []

const checkUserId = (request, response, next) => {
  const { id } = request.params
  const index = users.findIndex(user => user.id === id)


  if (index < 0) {
    return response.status(404).json({ message: "User not found!" })
  }
  request.userIndex = index
  next()
}


//ROTA QUE VAI MOSTRAR TODOS OS USUÁRIOS QUE TENHO => GET
app.get('/users', (request, response) => {
  return response.json(users)
})


//ROTA QUE ENVIE OS DADOS E OS ARMAZENE NO ARRAY DE USUARIOS => POST

app.post('/users', (request, response) => {
  try {

    const { name, age } = request.body

    if(age < 18 ) throw new Error("Only allow users over 18 years old")

    const user = { id: uuid.v4(), name, age }
    users.push(user)

    return response.status(201).json(user)
  } catch (err) {
    return response.status(400).json({error:err.message})
  } finally{
    console.log("Execução terminada!")
  }
})

//ROTA PARA ATUALIZAR OS USUÁRIOS EXISTENTES USANDO ROUTE PARAMS => PUT

app.put('/users/:id', checkUserId, (request, response) => {

  const { name, age } = request.body
  const index = request.userIndex
  const id = request.UserId

  const updatedUser = { id, name, age }


  users[index] = updatedUser

  return response.json(updatedUser)
})

//ROTA PARA DELETAR USUÁRIO A PARTIR DO SEU ID

app.delete('/users/:id', checkUserId, (request, response) => {
  const index = request.userIndex

  users.splice(index, 1)

  return response.status(204).json()
})



app.listen(3000, () => {
  console.log(`Server started on port ${port} ;) `)
})