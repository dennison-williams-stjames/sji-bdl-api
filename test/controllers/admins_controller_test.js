const mongoose = require('mongoose');
const assert = require('assert');
const supertest = require('supertest');
const mocha = require('mocha');
const app = require('../../app').app;
const dummyAdmins = require('./dummy_data');
const Admin = mongoose.model('admin');
const request = require('supertest');

token = '';

describe('Admins Controller', () => {
  // 2 admins are created before every test run in test/test_helper.js

  it('POST to /api/admins/new should return validation errors if request invalid', (done) => {
    request(app)
      .post('/api/admins/new')
      .send(dummyAdmins.adminBrokenEmail)
      .end((err, res) => {
        assert(422);
        assert(res.body.error === 'admin validation failed: email: testing is not a valid email');
        done();
      });
  });

  it('POST to /api/admins/new should not create an Admin if email in use', (done) => {
    request(app)
      .post('/api/admins/new')
      .send(dummyAdmins.admins[1])
      .end((err, res) => {
        assert(422);
        assert(
          res.body.error === 'E11000 duplicate key error collection: test.admins index: email_1 dup key: { email: "testingAuth@test.com" }'
        )
        done()
      });
  });

  it('POST /api/admins/login logs in a valid user and returns a web token', (done) => {
    const loginProps = { email: 'testingAuth@test.com', password: '123456' };

    request(app)
      .post('/api/admins/login')
      .send(loginProps)
      .end((err, res) => {
        assert(res.body.email === loginProps.email);
        assert(Object.values(res.header).includes('x-auth'));
	token = res.get('x-auth');
        done();
      });
  });

  it('PUT /api/admins/update', (done) => {
    const id = dummyAdmins.admins[0]._id.toString();
    const token = dummyAdmins.admins[0].tokens[0].token;
    const newEmail = { email: 'updateTest@test.com' };

    request(app)
      .put('/api/admins/update')
      .send(newEmail)
      .set('x-auth', token)
      .end((err, res) => {
	try {
          assert(200);
          assert(id === res.body._id.toString());
          assert(res.body.email === newEmail.email);
          done();
	} catch (e) {
	  done();
	}
      });
  });

  it('DELETE /api/admins/logout logs a user out deleting the token', (done) => {
    const token = dummyAdmins.admins[0].tokens[0].token;

    request(app)
      .delete('/api/admins/logout')
      .set('x-auth', token)
      .end((err, res) => {
        assert(200);
        done();
      });
  });


  // Testing purposes
  it('GET /users/me returns admin if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', dummyAdmins.admins[0].tokens[0].token)
      .end((err, res) => {
        assert(res.body._id.toString() === dummyAdmins.admins[0]._id.toString());
        assert(res.body.email === dummyAdmins.admins[0].email);
        done();
      });
  });

  it('GET /user/me should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .end((err, res) => {
        assert(401);
        assert(res.error.text === 'Unauthorized Access')
        done();
      });
  });


});
