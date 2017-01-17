var mysql = require('mysql');
var $conf = require('../conf/db');

var pool = mysql.createPool($conf.mysql);

const helper = {
  startTransaction() {
    return new Promise(function (resolve, reject) {
      pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        connection.beginTransaction(function (err) {
          if (err) {
            throw err;
          } else {
            resolve(connection)
          }
        })
      })
    })
  },
  transactionProxy(fn, context) {
    var context = context || this;
    var manage = this;
    return async function () {
      //get connect and start transaction
      try {
        var connection = await manage.startTransaction();
        var arr = Array.from(arguments)
        arr.push(connection)
        var result = await fn.apply(context, arr)

        //commit
        connection.commit(function (err) {
          if (err) {
            connection.rollback(function () {
              throw err;
            });
          }
        })

        return result;
      } catch (error) {
        connection.rollback();
        throw error
      } finally {
        connection.release()
      }
    }
  }
}

module.exports = helper;