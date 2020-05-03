const mongo = require('mongoose');
const _ = require('underscore');

mongo.Promise = global.Promise;

let CompanyModel = {};

const setName = (name) => _.escape(name).trim();

const CompanySchema = new mongo.Schema({
  name: {
    type: String,
    required: true,
    set: setName,
  },
  contact: {
    type: String,
  },
  owners: {
    type: [mongo.Schema.ObjectId],
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

CompanySchema.statics.findByOwner = (id, callback) => CompanyModel
  .find({ owners: mongo.Types.ObjectId(id) })
  .lean()
  .exec(callback);

CompanyModel = mongo.model('Company', CompanySchema);

module.exports = {
  CompanyModel,
  CompanySchema,
};
