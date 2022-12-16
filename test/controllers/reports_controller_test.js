const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app').app;
const dummyReports = require('./dummy_data');

const Report = mongoose.model('report');
const adminToken = dummyReports.admins[0].tokens[0].token;

describe('Reports controller', () => {
  // User can view all reports
  it('GET /api/reports returns all edited reports', (done) => {
    const unEditedReport = new Report(dummyReports.reportOne);
    const editedReport = new Report(dummyReports.reportTwo);

    Promise.all([unEditedReport.save(), editedReport.save()])
      .then(() => {
        request(app)
          .get('/api/reports')
	  .expect(200)
          .end((err, res) => {
            assert(res.body.length === 1);
            assert(res.body[0].title === 'Listen seeing you got ritualistic');
            assert(res.body[0].date === 'Thu May 18 2017')
            done();
          });
      });
  });

  // User can create a report
  it('POST to /api/reports/new creates a new report', (done) => {
    Report.count().then(count => {
      request(app)
        .post('/api/reports/new')
        .send(dummyReports.reportOne)
        .end(() => {
          Report.count().then(newCount => {
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });

  // Admin reads new unedited reports first
  it('GET to /api/admins/reports returns all the unedited reports', (done) => {
    const unEditedReport = new Report(dummyReports.reportOne);
    const editedReport = new Report(dummyReports.reportTwo);

    Promise.all([unEditedReport.save(), editedReport.save()])
      .then(() => {
        request(app)
          .get('/api/admins/reports')
          .set('x-auth', adminToken)
          .end((err, res) => {
            assert(res.body[0]._id.toString() === unEditedReport._id.toString());
            assert(res.body[1].edited === true);
            done();
          });
      });
  });

  // Admin can read one report
  it('GET to /api/reports/:id', (done) => {
    const report = new Report(dummyReports.reportOne);

    report.save().then(() => {
      request(app)
        .get(`/api/reports/${report._id}`)
        .set('x-auth', adminToken)
        .end((err, res) => {
          assert(res.body._id.toString() === report._id.toString())
          done();
        });
    });
  });

  // Admin can create an edited report or edit an edited report
  it('POST to /api/reports/:id creates/edits an edited subdocument', (done) => {
    const unEditedReport = new Report(dummyReports.reportOne);
    const edits = dummyReports.editedReportOne;

    unEditedReport.save().then(() => {
      request(app)
        .post(`/api/reports/${unEditedReport._id}`)
        .send(edits)
        .set('x-auth', adminToken)
        .end(() => {
          Report.findById({ _id: unEditedReport._id })
            .then((report) => {
              assert(report.editedReport.title === 'Leave feathers behind');
              assert(report.edited === true);
              done();
            });
        });
    });
  });

  // Admin can delete a edited report with removing original
  it('PUT to /api/reports/:id', (done) => {
    const report = new Report(dummyReports.reportTwo);

    report.save().then(() => {
      request(app)
        .put(`/api/reports/${report._id}`)
        .set('x-auth', adminToken)
        .end((err, res) => {
          assert(res.body.edited === false);
          assert(res.body.editedReport === undefined);
          done();
        });
    });
  });

  // A User can search reports using keywords
  it('GET to /api/reports/search searches based on keywords', (done) => {
    const report = new Report(dummyReports.reportTwo);

    report.save().then(() => {
      request(app)
        .get('/api/reports/search?keywords=Suspendisse')
        .end((err, res) => {
          assert(/Suspendisse/i.test(res.body[0].content));
          done();
        });
    });
  });

  it('Get to /api/reports/near will return reports within 2k radius', (done) => {
    const farReport = new Report(dummyReports.reportThree);
    const closeRepot = new Report(dummyReports.reportFour);

    Promise.all([closeRepot.save(), farReport.save()])
      .then(() => {
        request(app)
          .get('/api/reports/near?lng=122.2741&lat=37.8015')
          .end((err, res) => {
            assert(res.body.length === 1);
            assert(res.body[0].city === 'Oakland');
            done();
          });
      });
  });
});
