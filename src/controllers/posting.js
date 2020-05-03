const models = require('../models');

const { Posting } = models;
const { Company } = models;

const submitPage = (req, res) => Company.CompanyModel.findByOwner(
  // get the companies owned by the signed-in user
  req.session.account._id,
  (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    // deliver companies with the page
    return res.render('submit', {
      header: 'Submit',
      scriptEndpoint: '/assets/submit.js',
      csrfToken: req.csrfToken(),
      companies: docs,
    });
  },
);

// submit a new posting to the database
const submit = (req, res) => {
  if (!req.body.title || req.body.title === '') {
    return res.status(400).json({ error: 'A title is required' });
  }

  if (!req.body.level || req.body.level === '') {
    return res.status(400).json({ error: 'A level is required' });
  }

  if (!req.body.category || req.body.category === '') {
    return res.status(400).json({ error: 'A category is required' });
  }

  if (!req.body.location || req.body.location === '') {
    return res.status(400).json({ error: 'A location is required' });
  }

  if (!req.body.company || req.body.company === '') {
    return res.status(400).json({ error: 'A company is required' });
  }

  if (!req.body.link || req.body.link === '') {
    return res.status(400).json({ error: 'A link is required' });
  }

  const savePromise = new Posting.PostingModel({
    title: req.body.title,
    level: req.body.level,
    category: req.body.category,
    location: req.body.location,
    company: req.body.company,
    salary: req.body.salary,
    link: req.body.link,
    description: req.body.description,
  }).save();

  savePromise.then(() => res.json({ message: `The posting for ${req.body.title} was successfully posted` }));

  savePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This posting already exists.  You may want to check existing postings.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return savePromise;
};

// get every posting currently on the database
const getAll = (req, res) => Posting.PostingModel.transformAll({}, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }

  return res.json({ postings: docs });
});

// get every posting owned by the signed-in user
const getOwned = (req, res) => Posting.PostingModel.findByOwnerTransformed(
  req.session.account._id,
  (err, docs) => {
    // use aggregate to perform "join" with the company/job site collections and transform the data
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ postings: docs });
  },
);

// return a view with a single, specified posting
const viewPosting = (req, res) => {
  // if a posting ID is not given, return to the main page
  if (!req.query.id || req.query.id === '') {
    return res.redirect('/');
  }

  // get and transform the posting with the associated ID
  return Posting.PostingModel.transformOne(req.query.id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    // clean the returned posting of any blank fields
    [doc] = doc;
    Object.entries(doc).forEach((pair) => {
      const [key, value] = pair;
      if (value === null || value === undefined || value === '') {
        delete doc[key];
      }
    });

    // transform selection fields with their corresponding descriptors
    switch (doc.level) {
      case 0:
        doc.level = 'Internship/Student';
        break;

      case 1:
        doc.level = 'Entry';
        break;

      case 2:
        doc.level = 'Mid';
        break;

      case 3:
        doc.level = 'Senior';
        break;

      default:
        break;
    }

    switch (doc.category) {
      case 0:
        doc.category = 'Art';
        break;

      case 1:
        doc.category = 'Design';
        break;

      case 2:
        doc.category = 'Engineering';
        break;

      case 3:
        doc.category = 'Production';
        break;

      default:
        break;
    }

    return res.render('postDetails', {
      header: `${doc.title} - ${doc.company}`,
      scriptEndpoint: '/assets/posting.js',
      posting: doc,
      loggedIn: !!req.session.account,
    });
  });
};

// edit a specified posting
const edit = (req, res) => {
  // remove the entry if requested
  if (req.body.remove === 'true') {
    return Posting.PostingModel.deleteOne(
      { _id: req.body._id },
      (err) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: 'An error occurred' });
        }

        return res.json({ message: 'Posting successfully removed' });
      },
    );
  }

  if (!req.body.title || req.body.title === '') {
    return res.status(400).json({ error: 'A title is required' });
  }

  if (!req.body.level || req.body.level === '') {
    return res.status(400).json({ error: 'A level is required' });
  }

  if (!req.body.category || req.body.category === '') {
    return res.status(400).json({ error: 'A category is required' });
  }

  if (!req.body.location || req.body.location === '') {
    return res.status(400).json({ error: 'A location is required' });
  }

  if (!req.body.company || req.body.company === '') {
    return res.status(400).json({ error: 'A company is required' });
  }

  if (!req.body.link || req.body.link === '') {
    return res.status(400).json({ error: 'A link is required' });
  }

  return Posting.PostingModel.findOne(
    { _id: req.body._id },
    (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      // make the changes to the entry
      doc.title = req.body.title;
      doc.level = req.body.level;
      doc.category = req.body.category;
      doc.location = req.body.location;
      doc.company = req.body.company;
      doc.salary = req.body.salary;
      doc.link = req.body.link;
      doc.description = req.body.description;

      const savePromise = doc.save();

      savePromise.then(() => res.json({ message: 'Posting successfully editted' }));

      savePromise.catch((error) => {
        console.log(error);
        return res.status(400).json({ error: 'An error occurred' });
      });

      return savePromise;
    },
  );
};

module.exports = {
  submitPage,
  submit,
  getAll,
  getOwned,
  viewPosting,
  edit,
};
