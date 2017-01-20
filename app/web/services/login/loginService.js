const UserDao = require('../../dao/userDao/userDao')
const transactional = require('../../dao/dbHelper').transactional

var userDao = new UserDao()

class LoginService {
  @transactional
  async getUserInfo(userId,session){
    var user = await userDao.queryById(userId);
    return user
  }

  @transactional
  async addUsers(userName,session){
    var user = await userDao.add(userName,11);
    var user = await userDao.add(userName,12);
    return user
  }
}

module.exports = LoginService