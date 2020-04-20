const mongo = require('mongoose');

mongo.Promise = global.Promise;

let JobSiteModel = {};

const JobSiteSchema = new mongo.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  company: {
    type: mongo.Schema.ObjectId,
    required: true,
    ref: 'Company',
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
});

JobSiteModel = mongo.model('JobSite', JobSiteSchema);

module.exports = {
  JobSiteModel,
  JobSiteSchema,
};
