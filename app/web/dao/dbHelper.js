var mysql = require('mysql');
var $conf = require('../conf/db');
var asyncLocal = require('continuation-local-storage');

var pool = mysql.createPool($conf.mysql);
var connectionLocal = asyncLocal.createNamespace('connectionLocal');
var connectionName = 'connection';

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
  }
}

helper.transactional = function (target, name, descriptor) {
  let originMethod = descriptor.value;
  let newMethod = async function () {
    //get connect and start transaction
    try {
      let context = connectionLocal.createContext();
      connectionLocal.enter(context);
      var connection = await helper.startTransaction();
      connectionLocal.set(connectionName, connection);
      var arr = Array.from(arguments)
      arr.push(connection)
      var result = await originMethod.apply(target, arr)

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
  descriptor.value = newMethod;
  return descriptor;
}

helper.connection = function (target, name, descriptor){
  descriptor.get = function() {
    return connectionLocal.get(connectionName);
  }
  return descriptor;
}

module.exports = helper;