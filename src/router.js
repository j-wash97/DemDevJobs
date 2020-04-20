const cont = require('./controllers');
const mid = require('./middleware');

module.exports = (app) => {
  // app.get('/login', mid.requireSecure, mid.requireLogout, cont.Account.loginPage);
  // app.post('/login', mid.requireSecure, mid.requireLogout, cont.Account.login);
  // app.get('/getToken', mid.requireSecure, cont.Account.getToken);
  // app.get('/getDomos', mid.requireLogin, cont.Domo.getDomos);
  // app.post('/signup', mid.requireSecure, mid.requireLogout, cont.Account.signup);
  // app.get('/logout', mid.requireLogin, cont.Account.logout);
  // app.get('/maker', mid.requireLogin, cont.Domo.makerPage);
  // app.post('/maker', mid.requireLogin, cont.Domo.maker);
  // app.get('/', mid.requireSecure, mid.requireLogout, cont.Account.loginPage);
  // app.get('/domos', cont.Domo.domoPage);

  app.get('/', cont.GetIndex);
};
