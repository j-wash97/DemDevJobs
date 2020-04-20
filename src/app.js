const path = require('path');
const express = require('express');
const comp = require('compression');
const favicon = require('serve-favicon');
const cookie = require('cookie-parser');
const body = require('body-parser');
const mongo = require('mongoose');
const handle = require('express-handlebars');
const session = require('express-session');
const store = require('connect-redis')(session);
const redis = require('redis');
const csurf = require('csurf');

mongo.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(`Could not connect to ${process.env.MONGODB_URI}`);
      throw err;
    }
  },
);

const redisURL = new URL(process.env.REDISCLOUD_URL);

const router = require('./router.js');

const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
// app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(comp());
app.use(body.urlencoded({ extended: true }));
app.use(session({
  key: 'sessionid',
  store: new store({
    client: redis.createClient({
      host: redisURL.hostname,
      port: redisURL.port,
      password: redisURL.password,
    }),
  }),
  secret: 'Hire me Please',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: true },
}));
app.engine('handlebars', handle({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by');
app.use(cookie());
app.use(csurf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }
  console.log('Missing CSRF token');
  return false;
});

router(app);

app.listen(process.env.PORT || process.env.NODE_PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${process.env.PORT || process.env.NODE_PORT}`);
});
