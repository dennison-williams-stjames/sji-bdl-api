module.exports = {
  buildQueryAdminReports(criteria) {
    const query = {};
    if (criteria.keywords) {
      query.$text = { $search: criteria.keywords }
    }

    if (criteria.name) {
      query["perpetrator.name"] = criteria.name;
    }

    if (criteria.date) {
      // TODO: we should only include the timezone if it is not included
      var g = new Date(new Date(criteria.date ).setHours(00, 00, 00));
      var l = new Date(new Date(criteria.date ).setHours(23, 59, 59));
      query.date = {
        $gte: g,
        $lte: l
      }
    }

    if (criteria.city) {
      query.city = criteria.city;
    };

    if (criteria.type) {
      query.type = criteria.type;
    };

    return query;
  },

  buildQueryReports(criteria) {
    const query = { edited: true };

    if (criteria.keywords) {
      query.$text = { $search: criteria.keywords }
    }

    if (criteria.city) {
      query.city = criteria.city;
    };

    if (criteria.type) {
      query.type = criteria.type;
    };

    return query;
  },

  buildQueryServices(criteria) {
    const query = {};

    if (criteria.keywords) {
      query.$text = { $search: criteria.keywords }
    }

    if (criteria.city) {
      query.city = criteria.city;
    };

    if (criteria.type) {
      query.type = criteria.type;
    };

    return query;
  }

}
