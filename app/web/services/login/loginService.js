const userDao = require('../../dao/userDao/userDao')
const dbHelper = require('../../dao/dbHelper')

var service = {
  login (username,password,session) {
    if(session.user){
      return session.user;
    }
    var user = userDao.getUser()
    if(user){
      session.user = user;
      return user
    }
    return null
  }
}

async function getUserInfo(userId,session,connection){
    var user = await userDao.queryById(userId,connection);
    return user
}

service.getUserInfo = dbHelper.transactionProxy(getUserInfo,service)

module.exports = service