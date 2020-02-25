const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./staticViews.js');
const dataHandler = require('./API.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.GetIndex,
  '/style.css': htmlHandler.GetCSS,
  '/getAllPostings': dataHandler.GetAllPostings,
  '/getPosting': dataHandler.GetPosting,
  '/addPosting': dataHandler.AddPosting,
  notFound: dataHandler.NotFound,
};

const OnRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  let params = {};
  const { method } = request;

  console.log(method);
  console.log(parsedUrl.pathname);
  console.log(params);

  if (urlStruct[parsedUrl.pathname]) {
    // collect the parameters from a POST request
    if (method === 'POST') {
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
        urlStruct[parsedUrl.pathname](method, response, params);
      });
    }
    else {
      urlStruct[parsedUrl.pathname](method, response);
    }
  } else {
    urlStruct.notFound(method, response);
  }
};

http.createServer(OnRequest).listen(port);
console.log(`Listening on port ${port}`);
