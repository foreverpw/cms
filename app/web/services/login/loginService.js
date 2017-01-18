const userDao = require('../../dao/userDao/userDao')
const transactional = require('../../dao/dbHelper').transactional

class LoginService {
  @transactional
  async getUserInfo(userId,session,connection){
    var user = await userDao.queryById(userId,connection);
    return user
  }
}

module.exports = LoginService