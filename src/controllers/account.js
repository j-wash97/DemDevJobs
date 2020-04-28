const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login', { csrfToken: req.csrfToken() });

const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;

  if (!req.body.username || !req.body.pass) {
    return res.status(400).json({ error: 'A username and password are required' });
  }

  return Account.AccountModel.authenticate(req.body.username, req.body.pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/user' });
  });
};

const signup = (req, res) => {
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const newAccount = new Account.AccountModel({
      username: req.body.username,
      salt,
      password: hash,
    });

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/user' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const changePassword = (req, res) => {
  req.body.old = `${req.body.old}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // check new password fields
  if (!req.body.old || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // check new password match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }

  // check if old password is valid before changing
  return Account.AccountModel.authenticate(req.session.account.username, req.body.old, (e, acc) => {
    if (e || !acc) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    // With valid authentication, create a new hash with the new password
    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      // Update the account with the new hash
      acc.salt = salt;
      acc.hash = hash;

      const savePromise = acc.save();

      // reauthenicate with new password to confirm success
      savePromise.then(() => Account.AccountModel.authenticate(
        req.body.account.username,
        req.body.pass,
        (err, account) => {
          if (err || !account) {
            console.log(err);
            return res.status(400).json({ error: 'An error has occured' });
          }

          return res.json({ message: 'Password change successful' });
        },
      ));

      savePromise.catch((err) => {
        console.log(err);
        return res.status(400).json({ error: 'An error has occured' });
      });
    });
  });
};

module.exports = {
  loginPage,
  login,
  logout,
  getToken,
  signup,
  changePassword,
};
