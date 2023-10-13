const User = require('../modles/userModel');

class UserService {
  async getAll() {
    return User.find();
  }

  async getById(userId) {
    return User.findById(userId);
  }

  async createUser(userData) {
    const newUser = new User(userData);
    return newUser.save();
  }

  async updateUser(userId, userData) {
    return User.findByIdAndUpdate(userId, userData, { new: true });
  }

  async deleteUser(userId) {
    return User.findByIdAndDelete(userId);
  }
}

module.exports = new UserService();
