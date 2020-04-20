module.exports.Account = require('./account.js');
module.exports.Posting = require('./posting.js');

module.exports.GetIndex = (req, res) => res.render('index', { scriptEndpoint: '/assets/index.js' });
