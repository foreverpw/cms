const sqls = {
  insert: 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
  queryById: 'select * from user where id=?',
  queryByName: 'select * from user where name=?',
  queryAll: 'select * from user'
}

const dao = {
  add: function (name, age, connection) {
    return new Promise(function (resolve, reject) {
      connection.query(sqls.insert, [name, age], (err, data) => (err ? reject(err) : resolve(data)));
    })
  },
  queryById: function (id, connection) {
    var id = +id; // 为了拼凑正确的sql语句，这里要转下整数
    return new Promise(function (resolve, reject) {
      connection.query(sqls.queryById, id, (err, data) => (err ? reject(err) : resolve(data)));
    })
  },
  queryAll: function (connection) {
    return new Promise(function (resolve, reject) {
      connection.query(sqls.queryAll, (err, data) => (err ? reject(err) : resolve(data)));
    })
  }
}

module.exports = dao;