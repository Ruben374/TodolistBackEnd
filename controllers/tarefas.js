const mysql = require('../mysql')

exports.getTarefas = async (request, response, next) => {
  try {
    const result = await mysql.execute('SELECT * FROM tarefas;')
    const res = {
      quantidade: result.length,
      produtos: result.map(tr => {
        return {
          id: tr.id,
          nome: tr.nome,
          preco: tr.preco,
          request: {
            tipo: 'GET',
            descrição: 'produto em especifico',
            url: 'http://localhost:3000/produtos/' + tr.id
          }
        }
      })
    }
    return response.status(200).send(res)
  } catch (error) {
    return response.status(500).send({ error: error })
  }
}

exports.setTarefas = async (request, response, next) => {
  try {
    const query = 'INSERT INTO tarefas(nome,id_usuario,data) VALUES (?, ?, ?)'
    const result = await mysql.execute(query, [
      request.body.nome,
      request.body.id_usuario,
      request.body.data,
    ])
    const res = {
      mensagem: 'tarefa inserida',
      ProdutoCriado: {
        id: result.id,
        nome: request.body.nome,
        id_usuario:   request.body.id_usuario,
        data:  request.body.data,
        request: {
          tipo: 'GET',
          descrição: 'Todas as tarefas',
          url: 'http://localhost:3005/tarefas/'
        }
      }
    }
    return response.status(200).send(res)
  } catch (error) {
    return response.status(400).send({ error: error })
  }
}

exports.getUmaTarefa = async (request, response, next) => {
  try {
    const query = 'SELECT * FROM tarefas WHERE id=?;'
    const result = await mysql.execute(query, [request.params.id])
    if (result.length == 0) {
      return response
        .status(404)
        .send({ mensagem: 'não foi encontrado nenhum produto com esse id' })
    }
    const res = {
      produto: {
        id: result[0].id,
        nome: result[0].nome,
        id_usuario: result[0].id_usuario,
        request: {
          tipo: 'GET',
          descrição: 'Todos os produtos',
          url: 'http://localhost:3000/produtos/'
        }
      }
    }
    return response.status(200).send(res)
  } catch (error) {
    return response.status(500).send({ error: error })
  }
}

exports.updateTarefa = (request, response, next) => {
  try {
    const query = 'UPDATE tarefas SET nome= ? WHERE id= ?'
    const result = mysql.execute(query, [
      request.body.nome,
      request.body.id
    ])
    const res = {
      mensagem: 'produto alterado',
      ProdutoAlterado: {
        id: request.body.id,
        nome: request.body.nome,
        request: {
          tipo: 'GET',
          descrição: 'Detalhes de um produto',
          url: 'http://localhost:3000/produtos/' + request.body.id
        }
      }
    }
    return response.status(200).send(res)
  } catch (error) {
    return response.status(500).send({ error: error })
  }
}

exports.deleteTarefa = async (request, response, next) => {
  try {
    const query = 'DELETE FROM tarefas WHERE id=?;'
    const result = await mysql.execute(query, [request.body.id])

    const res = {
      mensagem: 'tarefa removido',
      request: {
        tipo: 'POST',
        descrição: 'Insere tarefa',
        url: 'http://localhost:3005/tarefas/',
        body: {
          nome: 'string',
          preco: 'number'
        }
      }
    }
    return response.status(200).send(res)
  } catch (error) {
    return response.status(500).send({ error: error })
  }
}
