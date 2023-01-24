const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const AdminSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 3,
    validate: {
      validator: validator.isEmail,
      isAsync: false,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
}, {
  usePushEach: true
});

AdminSchema.methods.toJSON = function () {
  const adminUser = this;
  const adminObject = adminUser.toObject();

  return _.pick(adminObject, ['_id', 'email']);
};

AdminSchema.methods.generateAuthToken = function () {
  const adminUser = this;
  const access = 'auth';
  const token = jwt.sign({ _id: adminUser._id.toHexString(), access }, process.env.JWT_SECRET).toString();

  adminUser.tokens.push({ access, token });
  // Return the whole promise
  return adminUser.save().then(() => {
    return token;
  })
};

AdminSchema.methods.removeToken = function (token) {
  const adminUser = this;

  return adminUser.update({
    $pull: {
      tokens: { token }
    }
  });
};

AdminSchema.statics.findByToken = function (token) {
  const Admin = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject()
    });
  };

  return Admin.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

AdminSchema.statics.findByCredentials = function (email, password) {
  const Admin = this;

  return Admin.findOne({ email })
    .then((admin) => {
      if (!admin) {
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, admin.password, (err, res) => {
          if (res) { 
	    console.info(`${email} authenticated`);
	    resolve(admin);
	  } else {
	    console.info(`${email} authentication failed`);
	    reject();
	  }
        })
      })
    });
};

AdminSchema.pre('save', function (next) {
  const admin = this;
  let password = admin.password;

  if (admin.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        admin.password = hash;
        next();
      })
    })
  } else {
    next();
  };
});

const Admin = mongoose.model('admin', AdminSchema);

module.exports = Admin;
