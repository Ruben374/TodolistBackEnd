const jwt = require('jsonwebtoken')

exports.obrigatorio = (request, response, next) => {
  try {
      const token=request.headers.authorization.split(' ')[1]
    const decode = jwt.verify(token,'segredo')
    request.usuario=decode
    next()
  } catch (error) {
      response.status(401).send({mensagem:'falha na autenticação'})
  }
}
exports.opcional = (request, response, next) => {
  try {
      const token=request.headers.authorization.split(' ')[1]
    const decode = jwt.verify(token,'segredo')
    request.usuario=decode
    next()
  } catch (error) {
     next()
  }
}
