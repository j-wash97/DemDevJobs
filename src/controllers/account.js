const models = require('../models');

const { Account } = models;
const { Company } = models;
const { JobSite } = models;

const loginPage = (req, res) => res.render('login', {
  header: 'Login',
  scriptEndpoint: '/assets/login.js',
  csrfToken: req.csrfToken(),
});

const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;

  if (!req.body.username || !req.body.pass) {
    return res.status(400).json({ error: 'A username and password are required' });
  }

  return Account.AccountModel.authenticate(req.body.username, req.body.pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/user' });
  });
};

const signup = (req, res) => {
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const newAccount = new Account.AccountModel({
      username: req.body.username,
      salt,
      password: hash,
    });

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/user' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

// allows signed in user to change their password
const changePassword = (req, res) => {
  req.body.old = `${req.body.old}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // check new password fields
  if (!req.body.old || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // check new password match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }

  // check if old password is valid before changing
  return Account.AccountModel.authenticate(req.session.account.username, req.body.old, (e, acc) => {
    if (e || !acc) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    // With valid authentication, create a new hash with the new password
    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      // Update the account with the new hash


      acc.salt = salt;
      acc.password = hash;

      const savePromise = acc.save();

      // reauthenicate with new password to confirm success
      savePromise.then(() => Account.AccountModel.authenticate(
        req.session.account.username,
        req.body.pass,
        (err, account) => {
          if (err || !account) {
            console.log(err);
            return res.status(400).json({ error: 'An error has occured' });
          }

          return res.json({ message: 'Password change successful' });
        },
      ));

      savePromise.catch((err) => {
        console.log(err);
        return res.status(400).json({ error: 'An error has occured' });
      });
    });
  });
};

const userPage = (req, res) => res.render('userDetails', {
  header: req.session.account.username,
  scriptEndpoint: '/assets/user.js',
  csrfToken: req.csrfToken(),
});

// get all companies owned by signed-in user
const getCompanies = (req, res) => Company.CompanyModel.findByOwner(
  req.session.account._id,
  (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ companies: docs });
  },
);

// submit a new company to the database
const submitCompany = (req, res) => {
  if (!req.body.name || req.body.name === '') {
    return res.status(400).json({ error: 'A name is required' });
  }

  const savePromise = new Company.CompanyModel({
    name: req.body.name,
    contact: req.body.contact,
    owners: [req.session.account._id],
  }).save();

  savePromise.then(() => res.json({ message: 'The company was successfully submitted' }));

  savePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This company already exists.  It may belong to another user.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return savePromise;
};

// edit a specified company already on the database
const editCompany = (req, res) => {
  // remove the entry if requested
  if (req.body.remove === 'true') {
    // ensure the entry belongs to the user before removing
    return Company.CompanyModel.deleteOne(
      { _id: req.body._id, owners: req.session.account._id },
      (err) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: 'An error occurred' });
        }

        // remove any job sites owned by the removed company
        return JobSite.JobSiteModel.deleteMany(
          { company: req.body._id },
          (error) => {
            if (error) {
              console.log(error);
              return res.status(400).json({ error: 'An error occurred' });
            }

            return res.json({ message: 'Company successfully removed' });
          },
        );
      },
    );
  }

  if (!req.body.name || req.body.name === '') {
    return res.status(400).json({ error: 'A name is required' });
  }

  // find the entry, and ensure it belongs to the user before editing
  return Company.CompanyModel.findOne(
    { _id: req.body._id, owners: req.session.account._id },
    (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      // make the changes to the entry
      doc.name = req.body.name;
      doc.contact = req.body.contact;

      const savePromise = doc.save();

      savePromise.then(() => res.json({ message: 'Company successfully editted' }));

      savePromise.catch((error) => {
        console.log(error);
        return res.status(400).json({ error: 'An error occurred' });
      });

      return savePromise;
    },
  );
};

// get all job sites owned by the companies owned by the signed-in user
const getjobSites = (req, res) => {
  // if an company is specified, get the job sites that are owned by it
  if (req.query.company) {
    return JobSite.JobSiteModel.findByCompany(req.query.company, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }
      return res.json({ jobSites: docs });
    });
  }

  return JobSite.JobSiteModel.findByOwnerTransformed(req.session.account._id, (err, docs) => {
    // use aggregate to perform a "join" with the company collection and transform the data
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ jobSites: docs });
  });
};

// submit a new job site to the database
const submitJobSite = (req, res) => {
  if (!req.body.name || req.body.name === '') {
    return res.status(400).json({ error: 'A name is required' });
  }

  if (!req.body.company || req.body.company === '') {
    return res.status(400).json({ error: 'A company is required' });
  }

  if (!req.body.address || req.body.address === '') {
    return res.status(400).json({ error: 'An address is required' });
  }

  const savePromise = new JobSite.JobSiteModel({
    name: req.body.name,
    description: req.body.description,
    company: req.body.company,
    address: req.body.address,
  }).save();

  savePromise.then(() => res.json({ message: 'The job site was successfully submitted' }));

  savePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This job site already exists.  It may belong to another company.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return savePromise;
};

// edit a specified job site already on the database
const editJobSite = (req, res) => {
  // remove the entry if requested
  if (req.body.remove === 'true') {
    return JobSite.JobSiteModel.deleteOne(
      { _id: req.body._id },
      (err) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: 'An error occurred' });
        }

        return res.json({ message: 'Job Site successfully removed' });
      },
    );
  }

  if (!req.body.name || req.body.name === '') {
    return res.status(400).json({ error: 'A name is required' });
  }

  if (!req.body.company || req.body.company === '') {
    return res.status(400).json({ error: 'A company is required' });
  }

  if (!req.body.address || req.body.address === '') {
    return res.status(400).json({ error: 'An address is required' });
  }

  return JobSite.JobSiteModel.findOne(
    { _id: req.body._id },
    (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      // make the changes to the entry
      doc.name = req.body.name;
      doc.description = req.body.description;
      doc.company = req.body.company;
      doc.address = req.body.address;

      const savePromise = doc.save();

      savePromise.then(() => res.json({ message: 'Job Site successfully editted' }));

      savePromise.catch((error) => {
        console.log(error);
        return res.status(400).json({ error: 'An error occurred' });
      });

      return savePromise;
    },
  );
};

module.exports = {
  loginPage,
  login,
  logout,
  getToken,
  signup,
  changePassword,
  userPage,
  getCompanies,
  submitCompany,
  editCompany,
  getjobSites,
  submitJobSite,
  editJobSite,
};
