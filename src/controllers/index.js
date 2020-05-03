module.exports.Account = require('./account.js');
module.exports.Posting = require('./posting.js');

module.exports.GetIndex = (req, res) => res.render('index', {
  scriptEndpoint: '/assets/index.js',
  loggedIn: !!req.session.account,
});

module.exports.NotFound = (req, res) => res.render('notFound', { header: 'Not Found' });
