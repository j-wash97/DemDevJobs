const mongo = require('mongoose');

mongo.Promise = global.Promise;

let CompanyModel = {};

const CompanySchema = new mongo.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
  },
  owners: {
    type: [mongo.Schema.ObjectId],
    ref: 'Account',
  },
});

CompanyModel = mongo.model('Company', CompanyModel);

module.exports = {
  CompanyModel,
  CompanySchema,
};
