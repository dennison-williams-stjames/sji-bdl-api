const assert = require('assert');
const request = require('supertest');
const app = require('../app').app;

describe('The express app', () => {
	it('handles a GET request to /api', (done) => {
		request(app)
			.get('/api')
			.end((err, res) => {
				assert(res.body.hello === 'world');
				done();
			});
	});
});
