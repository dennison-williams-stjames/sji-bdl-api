const _ = require('lodash');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');

module.exports = {
  createNewAdmin(req, res, next) {
    const adminProps = _.pick(req.body, ['email', 'password']);
    const admin = new Admin(adminProps);

    admin.save().then(() => { return admin.generateAuthToken() })
      .then((token) => {
        res.header('x-auth', token).send(admin)
      })
      .catch(next);
  },

  login(req, res, next) {
    const loginProps = _.pick(req.body, ['email', 'password']);

    Admin.findByCredentials(loginProps.email, loginProps.password)
      .then((admin) => {
        return admin.generateAuthToken()
          .then((token) => {
            res.header('x-auth', token).send(admin);
          })
      })
      .catch((error) => {
	console.error('error: '+ error);
        res.status(400).send();
      });
  },

  logout(req, res, next) {
    req.admin.removeToken(req.token)
      .then(() => {
        res.status(200).send();
      })
      .catch(() => {
        res.status(400).send();
        next();
      });
  },

  updateLoginDetails(req, res, next) {
    const updateProps = req.body;
    Admin.findOne({ 'tokens.token': req.headers['x-auth'] })
      .then((admin) => {
        if (updateProps.email) {
          admin.set('email', updateProps.email);
        };

        if (updateProps.password) {
          admin.set('password', updateProps.password);
        };

        admin.save()
          .then((updatedAdmin) => {
            res.send(updatedAdmin);
          })
      })
      .catch(next)
  },

  testing(req, res, next) {
    res.send(req.admin)
  }
};
