const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../hosted/index.html`);
const submit = fs.readFileSync(`${__dirname}/../hosted/submit.html`);
const indexJS = fs.readFileSync(`${__dirname}/../hosted/index.js`);
const submitJS = fs.readFileSync(`${__dirname}/../hosted/submit.js`);
const style = fs.readFileSync(`${__dirname}/../hosted/style.css`);

const GetIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const GetSubmit = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(submit);
  response.end();
};

const GetIndexJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(indexJS);
  response.end();
};

const GetSubmitJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(submitJS);
  response.end();
};

const GetStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

module.exports = {
  GetIndex,
  GetSubmit,
  GetIndexJS,
  GetSubmitJS,
  GetStyle,
};
