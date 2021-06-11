const User = require('./../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  const user = await User.findOne({email});

  if (!user) {
    const user = new User({email, displayName});
    const error = user.validateSync();

    if (error) {
      done(error, false);
      return;
    }

    await user.save();
    done(null, user);
  }

  done(null, user);
};
