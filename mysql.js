const mysql = require('mysql')

const pool = mysql.createPool({
  connectionLimit: 1000,
  user: 'root',
  password: '',
  database: 'todolistdb',
  host: 'localhost',
  port: '3306'
})
exports.execute = (query, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, result, fields) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

exports.pool = pool
