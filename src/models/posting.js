const mongo = require('mongoose');
const _ = require('underscore');

mongo.Promise = global.Promise;

let PostingModel = {};

const setName = (name) => _.escape(name).trim();

const PostingSchema = new mongo.Schema({
  title: {
    type: String,
    required: true,
    set: setName,
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  category: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  location: {
    type: mongo.Schema.ObjectId,
    required: true,
    ref: 'JobSite',
  },
  company: {
    type: mongo.Schema.ObjectId,
    required: true,
    ref: 'Company',
  },
  salary: {
    type: Number,
  },
  link: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
});

PostingSchema.statics.transformOne = (id, callback) => PostingModel.aggregate(
  [
    {
      $lookup: {
        from: 'jobsites',
        localField: 'location',
        foreignField: '_id',
        as: 'location',
      },
    },
    {
      $lookup: {
        from: 'companies',
        localField: 'company',
        foreignField: '_id',
        as: 'company',
      },
    },
    { $unwind: '$location' },
    { $unwind: '$company' },
    { $match: { _id: mongo.Types.ObjectId(id) } },
    {
      $project: {
        title: '$title',
        level: '$level',
        category: '$category',
        location: '$location.address',
        company: '$company.name',
        contact: '$company.contact',
        salary: '$salary',
        link: '$link',
        description: '$description',
        date: '$date',
        __v: '$__v',
      },
    },
  ],
  callback,
);

PostingSchema.statics.transformAll = (match, callback) => PostingModel.aggregate(
  [
    {
      $lookup: {
        from: 'jobsites',
        localField: 'location',
        foreignField: '_id',
        as: 'location',
      },
    },
    {
      $lookup: {
        from: 'companies',
        localField: 'company',
        foreignField: '_id',
        as: 'company',
      },
    },
    { $unwind: '$location' },
    { $unwind: '$company' },
    { $match: match },
    {
      $project: {
        title: '$title',
        level: '$level',
        category: '$category',
        location: '$location.address',
        company: '$company.name',
        contact: '$company.contact',
        salary: '$salary',
        link: '$link',
        description: '$description',
        date: '$date',
        __v: '$__v',
      },
    },
  ],
  callback,
);

PostingSchema.statics.findByOwnerTransformed = (id, callback) => PostingModel.aggregate(
  [
    {
      $lookup: {
        from: 'jobsites',
        localField: 'location',
        foreignField: '_id',
        as: 'location',
      },
    },
    {
      $lookup: {
        from: 'companies',
        localField: 'company',
        foreignField: '_id',
        as: 'company',
      },
    },
    { $unwind: '$location' },
    { $unwind: '$company' },
    { $match: { 'company.owners': mongo.Types.ObjectId(id) } },
    {
      $project: {
        title: '$title',
        level: '$level',
        category: '$category',
        location: {
          $concat: [
            '$location.name', ' - ', '$location.address',
          ],
        },
        location_id: '$location._id',
        company: {
          $concat: [
            '$company.name', ' - ', '$company.contact',
          ],
        },
        company_id: '$company._id',
        salary: '$salary',
        link: '$link',
        description: '$description',
        date: '$date',
        __v: '$__v',
      },
    },
  ],
  callback,
);

PostingModel = mongo.model('Posting', PostingSchema);

module.exports = {
  PostingModel,
  PostingSchema,
};
