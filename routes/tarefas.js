const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const multer= require('multer')
const login =require('../middleware/login')
const tarefas =require('../controllers/tarefas')


const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './uploads/');
    },
    filename: function(request, file, callback) {
        callback(null, file.originalname);
    }
});

const fileFilter = (request, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
//todos os produtos
router.get('/',tarefas.getTarefas) 

//insere produtos
//router.post('/',login.obrigatorio,upload.single('produto-imagem'), produtos.setProdutos)
router.post('/',tarefas.setTarefas)
//um produto especifico
router.get('/:id',tarefas.getUmaTarefa)

//altera produto

router.patch('/',tarefas.updateTarefa)

//deleta produto
router.delete('/',tarefas.deleteTarefa)

module.exports = router
