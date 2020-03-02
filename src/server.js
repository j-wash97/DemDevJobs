const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./staticViews.js');
const dataHandler = require('./API.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.GetIndex,
  '/style.css': htmlHandler.GetStyle,
  '/index.js': htmlHandler.GetIndexJS,
  '/submit': htmlHandler.GetSubmit,
  '/submit.js': htmlHandler.GetSubmitJS,
  '/getAllPostings': dataHandler.GetAllPostings,
  '/getPosting': dataHandler.GetPosting,
  '/addPosting': dataHandler.AddPosting,
  '/updatePosting': dataHandler.UpdatePosting,
  notFound: dataHandler.NotFound,
};

const OnRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  let params = {};

  console.log(request.method);
  console.log(parsedUrl.pathname);
  console.log(request.headers.accept.split(','));

  if (urlStruct[parsedUrl.pathname]) {
    // collect the parameters from a request
    const res = response;
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      params = query.parse(Buffer.concat(body).toString());
      console.log(params);
      urlStruct[parsedUrl.pathname](request, response, params);
    });
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(OnRequest).listen(port);
console.log(`Listening on port ${port}`);
