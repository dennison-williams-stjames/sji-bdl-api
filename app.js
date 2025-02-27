require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
require('dotenv').config();

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

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'sji-bdl-api';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'sji-bdl-api';
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_DB = process.env.MONGO_DB || 'sji-bdl';
const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=${MONGO_DB}`;

const options = {
  useNewUrlParser: true,
  connectTimeoutMS: 10000,
  useUnifiedTopology: true
};

// Change to ES6 Promise library
mongoose.Promise = global.Promise;
mongoose.connect(url, options)
.then( function() {
   console.debug('MongoDB is connected');
} )
.catch (function(err) { 
   console.error('MongoDB did not connect: '+ url);
   console.log(err);
});

if (! process.env.JWT_SECRET ) {
  console.warn('JWT_SECRET set to default is a security issue');
  process.env.JWT_SECRET = 'sji-bdl';
}

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(morgan('combined'));
routes(app);

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});


module.exports = { app, mongoose };
