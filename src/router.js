const cont = require('./controllers');
const mid = require('./middleware');

module.exports = (app) => {
  // main page routes
  app.get('/', cont.GetIndex);

  // account routes
  app.get('/login', mid.requireSecure, mid.requireLogout, cont.Account.loginPage);
  app.post('/login', mid.requireSecure, mid.requireLogout, cont.Account.login);
  app.get('/getToken', mid.requireSecure, cont.Account.getToken);
  app.post('/signup', mid.requireSecure, mid.requireLogout, cont.Account.signup);
  app.get('/logout', mid.requireLogin, cont.Account.logout);
  app.post('/changePass', mid.requireSecure, mid.requireLogin, cont.Account.changePassword);
  app.get('/user', mid.requireSecure, mid.requireLogin, cont.Account.userPage);
  app.get('/companies', mid.requireLogin, cont.Account.getCompanies);
  app.post('/submitCompany', mid.requireSecure, mid.requireLogin, cont.Account.submitCompany);
  app.post('/editCompany', mid.requireSecure, mid.requireLogin, cont.Account.editCompany);
  app.get('/jobSites', mid.requireLogin, cont.Account.getjobSites);
  app.post('/submitJobSite', mid.requireSecure, mid.requireLogin, cont.Account.submitJobSite);
  app.post('/editJobSite', mid.requireSecure, mid.requireLogin, cont.Account.editJobSite);

  // posting routes
  app.get('/submit', mid.requireSecure, mid.requireLogin, cont.Posting.submitPage);
  app.post('/submit', mid.requireSecure, mid.requireLogin, cont.Posting.submit);
  app.get('/all', cont.Posting.getAll);
  app.get('/owned', mid.requireLogin, cont.Posting.getOwned);
  app.get('/posting', cont.Posting.viewPosting);
  app.post('/editPosting', mid.requireSecure, mid.requireLogin, cont.Posting.edit);

  // route not found
  app.get('/*', cont.NotFound);
};
