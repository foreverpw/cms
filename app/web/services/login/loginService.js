const userDao = require('../../dao/userDao/userDao')
// import UserDao from '../../dao/userDao/userDao';
// var userDao = new UserDao()

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

module.exports = service