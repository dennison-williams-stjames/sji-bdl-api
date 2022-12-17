const mongoose = require('mongoose');
const dummyAdmins = require('./controllers/dummy_data');

const Admin = mongoose.model('admin');
const Service = mongoose.model('service');
const Report = mongoose.model('report');

beforeEach(async function() {

  Report.remove({})
    .then((err, result)=> { 
      done();
    });

  Service.remove({})
    .then(()=> {
      done();
    });

  await Admin.remove({})
    .then(function() {
    });

    let adminOne = new Admin(dummyAdmins.admins[0]);
    let adminTwo = new Admin(dummyAdmins.admins[1]);

    adminOne.save()
      .then(() => { 
      });

    await adminTwo.save()
      .then(() => { 
      });
});

after(done => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});
