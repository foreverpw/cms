var mysql = require('mysql');
var asyncLocal = require('continuation-local-storage');

var pool;
var connectionLocal = asyncLocal.createNamespace('connectionLocal');
var connectionName = 'connection';

var Promise = require('bluebird');
var clsBluebird = require('cls-bluebird');
 
clsBluebird( connectionLocal );

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

helper.init = function(config){
  pool = mysql.createPool(config);
  return helper;
}

var cid = 0;

/*helper.transactional = function (target, name, descriptor) {
  let originMethod = descriptor.value;
  let newMethod = function () {
    let context = connectionLocal.createContext();
    connectionLocal.enter(context);
    var p = new Promise(async function (resolve, reject){
      //get connect and start transaction
      try {
        var connection = await helper.startTransaction();
        connection.cid = cid++;
        connectionLocal.set(connectionName, connection);
        var arr = Array.from(arguments)
        arr.push(connection)
        debugger;
        var result = await originMethod.apply(target, arr)

        //commit
        connection.commit(function (err) {
          if (err) {
            connection.rollback(function () {
              throw err;
            });
          }
        })

        resolve(result);
      } catch (error) {
        debugger;
        connection.rollback();
        reject(error)
      } finally {
        connection.release()
      }
    })
    connectionLocal.exit(context);
    return p;
  }
  descriptor.value = newMethod;
  return descriptor;
}*/

helper.transactional = function (target, name, descriptor) {
  let originMethod = descriptor.value;
  let newMethod = function () {
    var args = arguments;
    var connection;
    let context = connectionLocal.createContext();
    connectionLocal.enter(context);
    var p = new Promise(function (resolve, reject){
      //get connect and start transaction
      helper.startTransaction().then((conn)=>{
        connection = conn;
        connection.cid = cid++;
        connectionLocal.set(connectionName, connection);
        debugger;
        return originMethod.apply(target, args)  //async function lose context
      })
      .then((result)=>{
        connection.commit(function (err) {
          if (err) {
            connection.rollback(function () {
              throw err;
            });
          }
        })
        resolve(result);
      })
      .catch((err)=>{
        connection.rollback();
        reject(err);
      })
      .finally(()=>(connection.release()))
    })
    connectionLocal.exit(context);
    return p;
  }
  descriptor.value = newMethod;
  return descriptor;
}

/*helper.transactional = function (target, name, descriptor) {
  let originMethod = descriptor.value;
  let newMethod = async function () {
    //get connect and start transaction
    try {
      let context = connectionLocal.createContext();
      connectionLocal.enter(context);
      var connection = await helper.startTransaction();
      connection.cid = cid++;
      connectionLocal.set(connectionName, connection);
      var arr = Array.from(arguments)
      arr.push(connection)
      debugger;
      var result = await originMethod.apply(target, arr)

      //commit
      connection.commit(function (err) {
        if (err) {
          connection.rollback(function () {
            throw err;
          });
        }
      })
      connectionLocal.exit(context);

      return result;
    } catch (error) {
      debugger;
      connection.rollback();
      throw error
    } finally {
      connection.release()
    }
  }
  descriptor.value = newMethod;
  return descriptor;
}*/

helper.connection = function (target, name, descriptor){
  descriptor.get = function() {
    return connectionLocal.get(connectionName);
  }
  return descriptor;
}

module.exports = helper;