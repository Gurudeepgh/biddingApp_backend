const { User } = require('../models/userModel');
const { ErrorResponse } = require('../utils/errorUtils');

exports.getProfile = async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};