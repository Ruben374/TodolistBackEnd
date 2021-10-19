const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


const rotaTarefas= require('./routes/tarefas')

const rotaUsuarios= require('./routes/usuarios')
app.use('/tarefas',rotaTarefas)

app.use('/usuarios',rotaUsuarios)

app.use((req, res, next) => {
    const erro = new Error('Pagina não encontrada 404');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});


module.exports=app;