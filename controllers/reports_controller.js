const Report = require('../models/report');
const helpers = require('./helper_functions');

module.exports = {
	greeting(req, res) {
		res.send({ hello: 'world' });
	},

  nearMe(req, res, next) {
    const { lng, lat } = req.query;

    Report.aggregate([ {
      $geoNear: {
        near: { type: "Point", coordinates: [ parseFloat(lng) , parseFloat(lat) ] },
        distanceField: "dist.calculated",
        maxDistance: 2000,
        includeLocs: "dist.location",
        spherical: true
      }
    } ])
    .then(reports => res.send(reports))
    .catch(next)
  },

  getAllEditedReports(req, res, next) {
    let editedReports;
    Report.find({ edited: true })
      .then((reports) => {
        editedReports = reports.map((report) => {
          let newObj = {};
          newObj['title'] = report.editedReport.title;
          newObj['content'] = report.editedReport.content;
          newObj['date'] = new Date(report.date).toDateString();
          newObj['coordinates'] = report.geolocation.coordinates;
          newObj['id'] = report.editedReport._id;

          return newObj
        })
        res.send(editedReports)
      })
      .catch(next);
  },

	userCreateReport(req, res, next) {
		const reportProps = req.body;

    Report.create(reportProps)
      .then(report => res.send(report))
      .catch(next);
	},

  adminReadNewReports(req, res, next) {
    Report.find({}).sort({ edited: 1 })
      .then(newReports => res.send(newReports))
      .catch(next);
  },

  adminCreateEditedReport(req, res, next) {
    const reportId = req.params.id;
    const editProps = req.body;

    Report.findByIdAndUpdate(reportId, { $set: { editedReport: editProps, edited: true }})
      .then(() => Report.findById({ _id: reportId }))
      .then(report => {
        res.send(report)
      })
      .catch(next);
  },

  adminReadOneReport(req, res, next) {
    const reportId = req.params.id;

    Report.findById(reportId)
      .then(report => res.send(report))
      .catch(next)
  },

  adminDeleteEditedReport(req, res, next) {
    const reportId = req.params.id;

    Report.update({ _id: reportId }, { $set: {edited: false }, $unset: { editedReport: 1 }})
      .then(() => Report.findById({ _id: reportId }))
      .then(report => res.send(report))
      .catch(next);
  },

  searchEditedReports(req, res, next) {
    const criteria = req.query;
    let editedReports;

    Report.find(helpers.buildQueryReports(criteria))
      .then((reports) => {
        editedReports = reports.map((report) => {
          let newObj = {};
          newObj['title'] = report.editedReport.title;
          newObj['content'] = report.editedReport.content;
          newObj['date'] = new Date(report.date).toDateString();
          newObj['coordinates'] = report.geolocation.coordinates;
          newObj['id'] = report.editedReport._id;

          return newObj
        })
        res.send(editedReports)
      })
      .catch(next);
  },

  adminSearchReports(req, res, next) {
    const criteria = req.query;
    let editedReports;

    Report.find(helpers.buildQueryAdminReports(criteria))
      .then((reports) => {
        editedReports = reports.map((report) => {
	  console.debug(report);
          let newObj = {};
	  if (typeof report.editedReport !== 'undefined') {
            newObj['title'] = report.editedReport.title;
            newObj['content'] = report.editedReport.content || '';
            newObj['id'] = report.editedReport._id;
	  } else {
            newObj['id'] = report._id;
	  }
          newObj['date'] = new Date(report.date).toDateString();
          newObj['coordinates'] = report.geolocation.coordinates;

          return newObj
        })
        res.send(editedReports)
      })
      .catch(next);
  },
};
