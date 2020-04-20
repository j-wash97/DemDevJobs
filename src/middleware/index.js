const requireLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/login');
  }
  return next();
};

const requireLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/');
  }
  return next();
};

const requireSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const bypassSecure = (req, res, next) => next();

module.exports = {
  requireLogin,
  requireLogout,
  requireSecure: process.env.NODE_ENV ? requireSecure : bypassSecure,
};
