const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const segredo='segredo'
const jwt= require('jsonwebtoken')
const usuarios = require('../controllers/usuarios')


//rota de cadastro 
router.post('/cadastro',usuarios.setUsuario)
//rota de login
router.post('/login', usuarios.loginUsuario)

module.exports = router
