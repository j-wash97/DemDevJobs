// The general struct of each posting submitted to and delivered by the API
class Posting {
  constructor(title, level, category, company, location, contact, salary, link, date, description) {
    this.title = title || null;
    this.level = level || null;
    this.category = category || null;
    this.company = company || null;
    this.location = location || null;
    this.contact = contact || null;
    this.salary = salary || null;
    this.link = link || null;
    this.date = date || null;
    this.description = description || null;
  }
}

// The collection of all postings handled by the API
const postingsList = [];

for (let i = 0; i < 5; i++) {
  postingsList.push(new Posting(`Posting ${i}`, 0, 0, 'Google', 'CA', null, null, 'https://www.google.com', Date.now(), null));
}

// Sends the GET response back
const RespondGet = (accept, response, status, object) => {
  response.writeHead(status, {
    'Content-Type': accept.includes('application/json') ? 'application/json' : accept[0],
  });
  response.write(JSON.stringify(object));
  response.end();
};

// Sends the HEAD response back
const RespondHead = (accept, response, status) => {
  response.writeHead(status, {
    'Content-Type': accept.includes('application/json') ? 'application/json' : accept[0],
  });
  response.end();
};

// Sends a response with a given object based on the request's request
const Respond = (request, response, status, object) => {
  if (request.method === 'HEAD') {
    RespondHead(request.headers.accept.split(','), response, status);
  }
  // Default to GET when irregular method type is given
  else {
    RespondGet(request.headers.accept.split(','), response, status, object);
  }
};

const NotFound = (request, response) => Respond(request, response, 404, {
  message: 'Resource not found',
  id: 'Not Found',
});

// A response that sends back all postings currently held by the API
const GetAllPostings = (request, response) => Respond(request,
  response,
  200,
  { postings: postingsList });

// A response that sends back a single posting at the specified index
const GetPosting = (request, response, params) => {
  if (!params.index || Number.isNaN(params.index)) {
    return Respond(request, response, 400, {
      message: 'A numerical index is required',
      id: 'Bad Index',
    });
  }

  if (!postingsList[params.index]) {
    return NotFound(request, response);
  }

  return Respond(request, response, 200, { posting: postingsList[params.index] });
};

// Creates a new posting instance with the given parameters
const AddPosting = (request, response, params) => {
  // Create posting instance
  const newPosting = new Posting();

  // Add any present parameters to the posting
  if (params.title && params.title !== '') {
    newPosting.title = params.title;
  }
  // If no title is given, respond with an error
  else {
    return Respond(request, response, 400, {
      message: 'A title has not been specified',
      id: 'Bad Parameter',
    });
  }

  if (params.level) {
    // If the given job level value is out of the range of options, respond with an error
    if (params.level < 0 || params.level > 3) {
      return Respond(request, response, 400, {
        message: 'An inappropriate job level has been specified',
        id: 'Bad Parameter',
      });
    }

    newPosting.level = parseInt(params.level, 10);
  }

  if (params.category) {
    // If the given category value is out of the range of options, respond with an error
    if (params.level < 0 || params.level > 3) {
      return Respond(request, response, 400, {
        message: 'An inappropriate category has been specified',
        id: 'Bad Parameter',
      });
    }

    newPosting.category = parseInt(params.category, 10);
  }

  if (params.company) {
    newPosting.company = params.company;
  }

  if (params.location) {
    newPosting.location = params.location;
  }

  if (params.contact) {
    newPosting.contact = params.contact;
  }

  if (params.salary) {
    newPosting.salary = params.salary;
  }

  if (params.link) {
    newPosting.link = params.link;
  }

  if (params.description) {
    newPosting.description = params.description;
  }

  // Add the current date to the new posting
  newPosting.date = Date.now();

  // Add the posting instance to the API's collection
  postingsList.push(newPosting);

  return Respond(request, response, 201, {
    message: 'A new posting has been made',
    posting: newPosting,
  });
};

// Updates a single posting currently held by the API
const UpdatePosting = (request, response, params) => {
  if (!params.index || Number.isNaN(params.index)) {
    return Respond(request, response, 400, {
      message: 'A numerical index is required',
      id: 'Bad Index',
    });
  }

  if (!postingsList[params.index]) {
    return NotFound(request, response);
  }

  // If the posting is flagged for removal, remove it from the collection
  if (params.remove && params.remove === 'on') {
    postingsList.splice(params.index, 1);
    return Respond(request, response, 204, { message: 'Posting has been removed' });
  }

  // Add any present parameters to the posting
  if (params.title) {
    postingsList[params.index].title = params.title;
  }

  if (params.level) {
    postingsList[params.index].level = params.level;
  }

  if (params.category) {
    postingsList[params.index].category = params.category;
  }

  if (params.company) {
    postingsList[params.index].company = params.company;
  }

  if (params.location) {
    postingsList[params.index].location = params.location;
  }

  if (params.contact) {
    postingsList[params.index].contact = params.contact;
  }

  if (params.salary) {
    postingsList[params.index].salary = params.salary;
  }

  if (params.link) {
    postingsList[params.index].link = params.link;
  }

  if (params.description) {
    postingsList[params.index].description = params.description;
  }

  // Update the posting with the current datetime
  postingsList[params.index].date = Date.now();

  return Respond(request, response, 204, {
    message: 'Posting has been updated',
    posting: postingsList[params.index],
  });
};

module.exports = {
  GetAllPostings,
  GetPosting,
  AddPosting,
  UpdatePosting,
  NotFound,
};
