const Admin = require('../../models/admin');
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const adminOne = new ObjectID();
const adminTwo = new ObjectID();

module.exports = {
	reportOne: {
    city: 'San Francisco',
    locationType: 'Hotel/Motel',
    geolocation: { type: 'Point', coordinates: [-122.41, 37.77] },
    gender: 'female',
    date: '2016-05-18T16:00:00Z',
    assaultType: ['Robbery', 'Client drunk/high'],
    assaultDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse molestie rutrum lorem. Green pants. Cras feugiat nulla augue, eget fringilla odio ultrices a. Duis eu bibendum metus.',
    perpetrator: {
      name: 'Bobby',
      phone: '5555555555',
      email: 'test@test.com',
      perpType: 'cop',
      gender: 'male',
      age: '32',
      race: 'white',
      height: "5'10",
      hair: 'black hair',
      attributes: 'tattoo on right arm'
    }
  },

  reportTwo: {
    city: 'Oakland',
    locationType: 'Hotel/Motel',
    geolocation: { type: 'Point', coordinates: [122.27, 37.80] },
    gender: 'female',
    date: '2017-05-18T16:00:00Z',
    assaultType: ['Assault', 'Client drunk/high'],
    assaultDescription: 'Lorem ipsum dolor rutrum blue jacket philipa sit amet, consectetur adipiscing elit. Suspendisse molestie lorem. Cras feugiat nulla augue, eget fringilla odio ultrices a. Duis eu bibendum metus.',
    perpetrator: {
      name: 'Philip',
      phone: '5555555555',
      email: 'test2@test.com',
      perpType: 'client',
      gender: 'male',
      age: '24',
      race: 'white',
      height: "5'11",
      hair: 'blond hair',
      attributes: 'scar on left arm'
    },
    edited: true,
    editedReport: {
      title: 'Listen seeing you got ritualistic',
      content: 'Lorem ipsum dolor sit amet, consectetur blue light elit. Suspendisse molestie rutrum lorem.'
    }
  },

  reportThree: {
    city: 'San Francisco',
    locationType: 'House',
    geolocation: { type: 'Point', coordinates: [122.4194, 37.774] },
    gender: 'female',
    date: '2016-01-18T16:00:00Z',
    assaultType: ['Assault', 'Client drunk/high'],
    assaultDescription: 'Lorem ipsum dolor rutrum blue jacket philipa sit amet, consectetur adipiscing elit. Suspendisse molestie lorem. Cras feugiat nulla augue, eget fringilla odio ultrices a. Duis eu bibendum metus.',
    perpetrator: {
      name: 'Philip',
      phone: '5555555555',
      email: 'test2@test.com',
      perpType: 'client',
      gender: 'male',
      age: '24',
      race: 'white',
      height: "5'11",
      hair: 'blond hair',
      attributes: 'scar on left arm'
    },
    edited: true,
    editedReport: {
      title: 'Your ex is a waste man',
      content: 'Dempta enim aeternitate nihilo beatior Iuppiter quam Epicurus; Equidem etiam Epicurum, in physicis quidem, Democriteum puto. Illud dico, ea, quae dicat, praeclare inter se cohaerere. Huius ego nunc auctoritatem sequens idem faciam. Ad eas enim res ab Epicuro praecepta dantur. Nam illud vehementer repugnat, eundem beatum esse et multis malis oppressum.'
    }
  },

  reportFour: {
    city: 'Oakland',
    locationType: 'Hotel/Motel',
    geolocation: { type: 'Point', coordinates: [122.2729, 37.8022] },
    gender: 'female',
    date: '2016-10-18T17:00:00Z',
    assaultType: ['Assault', 'Client drunk/high'],
    assaultDescription: 'Lorem ipsum dolor rutrum blue jacket philipa sit amet, consectetur adipiscing elit. Suspendisse molestie lorem. Cras feugiat nulla augue, eget fringilla odio ultrices a. Duis eu bibendum metus.',
    perpetrator: {
      name: 'Philip',
      phone: '5555555555',
      email: 'test2@test.com',
      perpType: 'client',
      gender: 'male',
      age: '24',
      race: 'white',
      height: "5'11",
      hair: 'blond hair',
      attributes: 'scar on left arm'
    },
    edited: true,
    editedReport: {
      title: 'I might just say how I feel.',
      content: 'Qui igitur convenit ab alia voluptate dicere naturam proficisci, in alia summum bonum ponere? Illud quaero, quid ei, qui in voluptate summum bonum ponat, consentaneum sit dicere. Nam, ut sint illa vendibiliora, haec uberiora certe sunt.'
    }
  },

  editedReportOne: {
    title: 'Leave feathers behind',
    content: 'Lorem ipsum blue linen, consectetur adipiscing elit. Suspendisse molestie rutrum lorem.'
  },

  serviceOne: {
    name: 'St James Infirmary',
    streetAddress: '234 Eddy Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    phone: '4155584944',
    type: 'health'
  },

  serviceTwo: {
    name: 'General Service',
    streetAddress: '112 Telegraph Street',
    city: 'Oakland',
    state: 'CA',
    zipCode: '94111',
    phone: '4155583333',
    type: 'legal'
  },

  adminExampleOne: {
    email: 'testingAuth@test.com',
    password: '123456'
  },

  adminBrokenEmail: {
    email: 'testing',
    password: '123456'
  },

  admins: [{
    _id: adminOne,
    email: 'spencer@test.com',
    password: 'adminOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: adminOne, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: adminTwo,
    email: 'testingAuth@test.com',
    password: '123456'
  }]
};
