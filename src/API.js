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

// Sends the GET response back
const RespondGet = (response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// Sends the HEAD response back
const RespondHead = (response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Sends a response with a given object based on the request's method
const Respond = (method, response, status, object) => {
  if (method === 'HEAD') {
    RespondHead(response, status);
  }
  // Default to GET when irregular method type is given
  else {
    RespondGet(response, status, object);
  }
};

// A response that sends back all postings currently held by the API
const GetAllPostings = (method, response) => Respond(method, response, 200, { postings: postingsList });

// A response that sends back a single posting at the specified index
const GetPosting = (method, response, params) => {
  if (!params.index || isNaN(params.index)) {
    return Respond(method, response, 400, {
      message: 'A numerical index is required',
      id: 'Bad Index'
    });
  }
  
  if (!postingsList[params.index]) {
    return NotFound(method, response);
  }
  else {
    Respond(method, response, 200, { posting: postingsList[params.index] });
  }
};

// Creates a new posting instance with the given parameters
const AddPosting = (method, response, params => {
  // Create posting instance
  const newPosting = new Posting();

  // Add any present parameters to the posting
  if (params.title){
    newPosting.title = params.title;
  }
  
  if (params.level){
    newPosting.level = params.level;
  }
  
  if (params.category){
    newPosting.category = params.category;
  }
  
  if (params.company){
    newPosting.company = params.company;
  }
  
  if (params.location){
    newPosting.location = params.location;
  }
  
  if (params.contact){
    newPosting.contact = params.contact;
  }
  
  if (params.salary){
    newPosting.salary = params.salary;
  }
  
  if (params.link){
    newPosting.link = params.link;
  }
  
  if (params.description){
    newPosting.description = params.description;
  }
  
  // Add the current date to the new posting
  newPosting.date = Date.now();

  // Add the posting instance to the API's collection
  postingsList.push(newPosting);

  Respond(method, response, 201, {
    message: 'A new posting has been made',
    posting: newPosting
  });
});

// Updates a single posting currently held by the API
const UpdatePosting = (method, response, params) => {
  if (!params.index || isNaN(params.index)) {
    return Respond(method, response, 400, {
      message: 'A numerical index is required',
      id: 'Bad Index'
    });
  }
  
  if (!postingsList[params.index]) {
    return NotFound(method, response);
  }
  else {
    // If the posting is flagged for removal, remove it from the collection
    if (params.remove && params.remove === 'true') {

    }

    Respond(method, response, 204, { 
      message: `Posting at index ${params.index} has been updated`,
      posting: postingsList[params.index]
    });
  }
}

const NotFound = (method, response) => Respond(method, response, 404, {
  message: 'Resource not found',
  id: 'Not Found',
});

module.exports = {
  GetAllPostings,
  GetPosting,
  AddPosting,
  NotFound
}