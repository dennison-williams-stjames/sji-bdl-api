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
      .catch((error) => {
        console.debug('getAllEditedReports() did not create reports : '+ error.message);
      });
  },

   userCreateReport(req, res, next) {
     const reportProps = req.body;

     Report.create(reportProps)
       .then((report) => { 
	 return report; 
       })
       .then(report => res.send(report))
       .catch((error) => {
	 console.debug('userCreateReport() did not create report document: '+ error.message);
     });
   },

  adminReadNewReports(req, res, next) {
    Report.find({}).sort({ edited: 1 })
      .then(newReports => res.send(newReports))
      .catch(next);
  },

  adminCreateEditedReport(req, res, next) {
    const reportId = req.params.id;
    const editProps = req.body.reportData;
    console.debug('adminCreateEditedReport() :');
    console.debug(editProps);

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

    // Names are often obfuscated with * characters for part of the name
    // since we are doing a case insensitive regular expression match
    if (criteria.name) {
      criteria.name 
        .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        .replace(/-/g, '\\x2d');
    }

    console.debug('adminSearchReports() search criteria: ');
    console.log(helpers.buildQueryAdminReports(criteria));
    Report.find(helpers.buildQueryAdminReports(criteria))
      .then((reports) => {
	console.debug('adminSearchReports() returned from find');
        editedReports = reports.map((report) => {
          let newObj = {};
	  if (!report) { return newObj; }
	  if ('editedReport' in report && report.editedReport) {
	    if ('title' in report.editedReport && report.editedReport.title) {
              newObj['title'] = report.editedReport.title;
	    }

	    if ('content' in report.editedReport) {
              newObj['content'] = report.editedReport.content;
	    }

	    // something is wrong if there is an editedReport without an _id
            newObj['id'] = report.editedReport._id;
	  }

          newObj['date'] = new Date(report.date).toDateString();
	
	  if (report.geolocation && report.geolocation.coordinates) {
            newObj['coordinates'] = report.geolocation.coordinates;
	  }

          return newObj
        })
        res.send(editedReports)
      })
      .catch((error) => {
	console.debug('adminSearchReports() error: '+ error.message);
        next;
      });
  },
};
