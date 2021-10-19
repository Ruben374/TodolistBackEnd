const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const segredo='segredo'
const jwt= require('jsonwebtoken')

exports.setUsuario= (request, response, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return response.status(500).send({ error: error })
    }
    conn.query(
      'SELECT *FROM usuarios WHERE usuario=?',
      [request.body.usuario],
      (error, result) => {
        if (error) {
          return response.status(500).send({ error: error })
        }
        if (result.length > 0) {
          return response.status(409).send({ mensagem: 'usuario ja existe' })
        } else {
          bcrypt.hash(request.body.senha, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return response.status(500).send({ error: errBcrypt })
            }
            conn.query(
              'INSERT INTO usuarios (nome,usuario,senha) VALUES(?,?,?)',
              [request.body.nome, request.body.usuario, hash],
              (error, result) => {
                conn.release
                if (error) {
                  return response.status(500).send({ error: error })
                }
                const res = {
                  mensagem: 'usuário cadastrado com sucesso',
                  UsuárioCriado: {
                    id: result.insertId,
                    nome: request.body.nome,
                    email: request.body.usuario, 
                    foto_de_perfil: request.body.foto_de_perfil, 
                  }
                }
                return response.status(200).send(res)
              }
            )
          })
        }
      }
    )
  })
}

exports.loginUsuario=(request, response, next) => {
  mysql.getConnection((err, conn) => {
    if (err) {
      return response.status(500).send({ error: err })
    }
    conn.query(
      'SELECT *FROM usuarios WHERE usuario=?',
      [request.body.usuario],
      (error, results, fields) => {
        conn.release()
        if (error) {
          return response.status(500).send({ error: error })
        }
        if (results.lenght < 1) {
          return response
            .status(401)
            .send({ mensagem: 'falha na autenticação' })
        }
        bcrypt.compare(
          request.body.senha,
          results[0].senha,
          (err, result) => {

            if(err){
             return response.status(401).send({mensagem:'falha na autenticação'})
            }
            if(result){
               const token=jwt.sign({
                 id: results[0].id,
                 nome: results[0].nome, 
                 email:results[0].usuario
               },segredo,{expiresIn:"1h"})
               return response.status(200).send({mensagem:'autenticação efetuada',
               token:token
               })
            }
             return response.status(401).send({mensagem:'falha na autenticação'})
            
          }
        )
      }
    )
  })
}