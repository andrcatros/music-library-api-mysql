const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');

// import models here
const Example = require('../src/models')

describe('/examples', () => {

    // initialize tables before you do tests
    before(async () => {
        try {
          await Example.sequelize.sync();
        } catch (err) {
          console.log(err);
        }
      });

      // destroy data already in the tables
    beforeEach(async () => {
        try {
          await Example.destroy({ where: {} });
        // if you want/need data entries in your database, these can be created here
          example = await Example.create({
            exampleKey: 'this is an example'
          });
        } catch (err) {
          console.log(err);
        }
    });

    // POST tests 
    describe('POST /examples', () => {
        it('creates a new example', (done) => {
          request(app)
            .post(`/examples`)
            .send({
              exampleKey: 'Hello World'
            })
            .then((res) => {
                // check status and response body object
              expect(res.status).to.equal(201);
              expect(res.body.exampleKey).to.equal('Hello World');

              // check that example was created successfully 
              Example.findByPk(response.body.id).then((example) => {
                  expect(example.exampleKey).to.equal('Hello World');
                  done();
              })
              });
            });
        });

    // create more data entries for GET, PATCH and DELETE tests
    describe('tests with examples in the database', () => {
        let examples;
        beforeEach((done) => {
          Promise.all([
            Example.create({ exampleKey: 'This is an example' }),
            Example.create({ exampleKey: 'Please delete these entries and create your own'})
          ]).then((fulfilledPromises) => {
            examples = fulfilledPromises;
            done();
          });
        });

    // GET tests 

    // PATCH tests 

    // DELETE tests

    });
});