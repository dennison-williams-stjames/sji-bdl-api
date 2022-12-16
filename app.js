require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const app = express();

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-auth');
  res.header('Access-Control-Expose-Headers', 'x-auth')

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

// Change to ES6 Promise library
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI, {
  	useMongoClient: true
  });
};

app.use(allowCrossDomain);
app.use(bodyParser.json());
routes(app);

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});


module.exports = { app, mongoose };
