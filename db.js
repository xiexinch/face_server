const mysql = require('mysql')
const uuid = require('uuid/v1') // v1 for timestamp

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'facev'
})


let insetSql = 'insert into face_user set ? ,`create_time` = current_timestamp, `update_time`=current_timestamp '

exports.connect = function() {
  connection.connect(function(err){
    if (err) {
      return err;
    }
  });
}


/**
 * @name insertUser
 * @param user = {uuid: 'string', name: 'string',url: 'string', state: 'exists or delete'}
}
*/
exports.insertUser = function(user) {
  let sql = 'insert into face_user set ?, `create_time` = current_timestamp, `update_time` = current_timestamp'
  connection.query(sql, user, function(error, results, fields) {
    return error, results, fields
  })
}

exports.selectByUUID = function(uuid) {
  let sql = 'select name, url, state from face_user where uuid=' + uuid
  connection.query(sql, function(error, results, fields) {
    return error,results, fields
  })
}

exports.close = function() {
  connection.end(err => {
    if (err) throw err
  })
}

//connection.end();