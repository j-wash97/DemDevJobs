const mongo = require('mongoose');
const _ = require('underscore');

mongo.Promise = global.Promise;

let JobSiteModel = {};

const setName = (name) => _.escape(name).trim();

const JobSiteSchema = new mongo.Schema({
  name: {
    type: String,
    required: true,
    set: setName,
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
  // Splitting address field may make international addresses difficult.
  // Will decide on leaving split fields out later
  //
  // city: {
  //   type: String,
  //   required: true,
  // },
  // state: {
  //   type: String,
  //   required: true,
  // },
  // zip: {
  //   type: String,
  //   required: true,
  // },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

JobSiteSchema.statics.findByCompany = (id, callback) => JobSiteModel
  .find({ company: mongo.Types.ObjectId(id) })
  .lean()
  .exec(callback);

JobSiteSchema.statics.findByOwnerTransformed = (id, callback) => JobSiteModel.aggregate(
  [
    {
      $lookup: {
        from: 'companies',
        localField: 'company',
        foreignField: '_id',
        as: 'company',
      },
    },
    { $unwind: '$company' },
    { $match: { 'company.owners': mongo.Types.ObjectId(id) } },
    {
      $project: {
        name: '$name',
        description: '$description',
        company: {
          $concat: [
            '$company.name',
            ' - ',
            '$company.contact',
          ],
        },
        company_id: '$company._id',
        address: '$address',
        createdDate: '$createdDate',
        __v: '$__v',
      },
    },
  ],
  callback,
);

JobSiteModel = mongo.model('JobSite', JobSiteSchema);

module.exports = {
  JobSiteModel,
  JobSiteSchema,
};
