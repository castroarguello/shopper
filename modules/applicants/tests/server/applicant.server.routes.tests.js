'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Applicant = mongoose.model('Applicant'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  applicant;

/**
 * Applicant routes tests
 */
describe('Applicant CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Applicant
    user.save(function () {
      applicant = {
        name: 'Applicant name'
      };

      done();
    });
  });

  it('should be able to save a Applicant if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Applicant
        agent.post('/api/applicants')
          .send(applicant)
          .expect(200)
          .end(function (applicantSaveErr, applicantSaveRes) {
            // Handle Applicant save error
            if (applicantSaveErr) {
              return done(applicantSaveErr);
            }

            // Get a list of Applicants
            agent.get('/api/applicants')
              .end(function (applicantsGetErr, applicantsGetRes) {
                // Handle Applicants save error
                if (applicantsGetErr) {
                  return done(applicantsGetErr);
                }

                // Get Applicants list
                var applicants = applicantsGetRes.body;

                // Set assertions
                (applicants[0].user._id).should.equal(userId);
                (applicants[0].name).should.match('Applicant name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Applicant if not logged in', function (done) {
    agent.post('/api/applicants')
      .send(applicant)
      .expect(403)
      .end(function (applicantSaveErr, applicantSaveRes) {
        // Call the assertion callback
        done(applicantSaveErr);
      });
  });

  it('should not be able to save an Applicant if no name is provided', function (done) {
    // Invalidate name field
    applicant.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Applicant
        agent.post('/api/applicants')
          .send(applicant)
          .expect(400)
          .end(function (applicantSaveErr, applicantSaveRes) {
            // Set message assertion
            (applicantSaveRes.body.message).should.match('Please fill Applicant name');

            // Handle Applicant save error
            done(applicantSaveErr);
          });
      });
  });

  it('should be able to update an Applicant if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Applicant
        agent.post('/api/applicants')
          .send(applicant)
          .expect(200)
          .end(function (applicantSaveErr, applicantSaveRes) {
            // Handle Applicant save error
            if (applicantSaveErr) {
              return done(applicantSaveErr);
            }

            // Update Applicant name
            applicant.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Applicant
            agent.put('/api/applicants/' + applicantSaveRes.body._id)
              .send(applicant)
              .expect(200)
              .end(function (applicantUpdateErr, applicantUpdateRes) {
                // Handle Applicant update error
                if (applicantUpdateErr) {
                  return done(applicantUpdateErr);
                }

                // Set assertions
                (applicantUpdateRes.body._id).should.equal(applicantSaveRes.body._id);
                (applicantUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Applicants if not signed in', function (done) {
    // Create new Applicant model instance
    var applicantObj = new Applicant(applicant);

    // Save the applicant
    applicantObj.save(function () {
      // Request Applicants
      request(app).get('/api/applicants')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Applicant if not signed in', function (done) {
    // Create new Applicant model instance
    var applicantObj = new Applicant(applicant);

    // Save the Applicant
    applicantObj.save(function () {
      request(app).get('/api/applicants/' + applicantObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', applicant.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Applicant with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/applicants/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Applicant is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Applicant which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Applicant
    request(app).get('/api/applicants/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Applicant with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Applicant if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Applicant
        agent.post('/api/applicants')
          .send(applicant)
          .expect(200)
          .end(function (applicantSaveErr, applicantSaveRes) {
            // Handle Applicant save error
            if (applicantSaveErr) {
              return done(applicantSaveErr);
            }

            // Delete an existing Applicant
            agent.delete('/api/applicants/' + applicantSaveRes.body._id)
              .send(applicant)
              .expect(200)
              .end(function (applicantDeleteErr, applicantDeleteRes) {
                // Handle applicant error error
                if (applicantDeleteErr) {
                  return done(applicantDeleteErr);
                }

                // Set assertions
                (applicantDeleteRes.body._id).should.equal(applicantSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Applicant if not signed in', function (done) {
    // Set Applicant user
    applicant.user = user;

    // Create new Applicant model instance
    var applicantObj = new Applicant(applicant);

    // Save the Applicant
    applicantObj.save(function () {
      // Try deleting Applicant
      request(app).delete('/api/applicants/' + applicantObj._id)
        .expect(403)
        .end(function (applicantDeleteErr, applicantDeleteRes) {
          // Set message assertion
          (applicantDeleteRes.body.message).should.match('User is not authorized');

          // Handle Applicant error error
          done(applicantDeleteErr);
        });

    });
  });

  it('should be able to get a single Applicant that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Applicant
          agent.post('/api/applicants')
            .send(applicant)
            .expect(200)
            .end(function (applicantSaveErr, applicantSaveRes) {
              // Handle Applicant save error
              if (applicantSaveErr) {
                return done(applicantSaveErr);
              }

              // Set assertions on new Applicant
              (applicantSaveRes.body.name).should.equal(applicant.name);
              should.exist(applicantSaveRes.body.user);
              should.equal(applicantSaveRes.body.user._id, orphanId);

              // force the Applicant to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Applicant
                    agent.get('/api/applicants/' + applicantSaveRes.body._id)
                      .expect(200)
                      .end(function (applicantInfoErr, applicantInfoRes) {
                        // Handle Applicant error
                        if (applicantInfoErr) {
                          return done(applicantInfoErr);
                        }

                        // Set assertions
                        (applicantInfoRes.body._id).should.equal(applicantSaveRes.body._id);
                        (applicantInfoRes.body.name).should.equal(applicant.name);
                        should.equal(applicantInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Applicant.remove().exec(done);
    });
  });
});
