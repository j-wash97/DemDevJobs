const mongo = require('mongoose');

mongo.Promise = global.Promise;

let PostingModel = {};

const PostingSchema = new mongo.Schema({
  title: {
    type: String,
    required: true,
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

PostingModel = mongo.model('Posting', PostingSchema);

module.exports = {
  PostingModel,
  PostingSchema,
};
