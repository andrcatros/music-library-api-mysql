/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album } = require('../src/models');

describe('/albums', () => {
  let artist;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
    } catch (err) {
      console.log(err);
    }
  });

  // POST tests 
  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(201);

          Album.findByPk(res.body.id, { raw: true }).then((album) => {
            expect(album.name).to.equal('InnerSpeaker');
            expect(album.year).to.equal(2010);
            expect(album.artistId).to.equal(artist.id);
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', (done) => {
      request(app)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.');

          Album.findAll().then((albums) => {
            expect(albums.length).to.equal(0);
            done();
          });
        });
    });
  });

    describe('tests with albums in the database', () => {
      let albums;
      beforeEach((done) => {
        Promise.all([
          Album.create({ name: 'A Test Album', year: 1992 }).then(album => album.setArtist(artist)),
          Album.create({ name: 'Another Test Album', year: 2001 }).then(album => album.setArtist(artist)),
          Album.create({ name: 'Yet Another Test Album You Will Love', year: 2010 }).then(album => album.setArtist(artist)),
        ]).then((documents) => {
          albums = documents;
          done();
        });
      });
    
      // GET tests
      describe('GET /artists/${artist.id}/albums', () => {
        it('gets all album records of given artist', (done) => {
          request(app)
            .get(`/artists/${artist.id}/albums`)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(res.body.length).to.equal(3);
              res.body.forEach((album) => {
                const expected = albums.find((a) => a.id === album.id);
                expect(album.name).to.equal(expected.name);
                expect(album.year).to.equal(expected.year);
              });
              done();
            });
        });
      });


      describe('GET /artists/${artist.id}/albums/${album.id}', () => {
        it('get album of given artist by album id', (done) => {
          let album = albums[0]
          request(app)
            .get(`/artists/${artist.id}/albums/${album.id}`)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(res.body[0].name).to.equal('A Test Album');
              expect(res.body[0].year).to.equal(1992)
              });
              done();
            });
      

      it('returns a 404 if the artist does not exist', (done) => {
        request(app)
          .get('/artists/12345/albums')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The artist could not be found.');
            done();
          });
      });

      it('returns a 404 if the album does not exist', (done) => {
        request(app)
          .get(`/artists/${artist.id}/albums/12345`)
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found.');
            done();
          });
      });
    });

    // PATCH tests
    describe('PATCH /artists/:artistId/albums', () => {
      it('updates album name by album id', (done) => {
        const album = albums[0]
        request(app)
          .patch(`/artists/${artist.id}/albums/${album.id}`)
          .send({ name: 'Some Other Album' })
          .then((res) => {
            expect(res.status).to.equal(200);
            Album.findByPk(album.id).then((updatedAlbum) => {
              expect(updatedAlbum.name).to.equal('Some Other Album');
              done();
            });
          });
      });

      it('updates album year by album id', (done) => {
        const album = albums[0]
        request(app)
          .patch(`/artists/${artist.id}/albums/${album.id}`)
          .send({ year: 3000 })
          .then((res) => {
            expect(res.status).to.equal(200);
            Album.findByPk(album.id).then((updatedAlbum) => {
              expect(updatedAlbum.year).to.equal(3000);
              expect(updatedAlbum.name).to.equal('A Test Album')
              done();
            });
          });
      });

      it('returns a 404 if the artist does not exist', (done) => {
        request(app)
          .patch('/artists/12345/albums/12345')
          .send({ name: 'AlbumName' })
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found.');
            done();
          });
      }); 
    });

    // DELETE tests
    describe('DELETE /artists/:artistId/albums/:albumId', () => {
      it('deletes album record by id', (done) => {
        const album = albums[0] 
        request(app)
          .delete(`/artists/${artist.id}/albums/${album.id}`)
          .then((res) => {
            expect(res.status).to.equal(204);
            Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
              expect(updatedAlbum).to.equal(null);
              done();
            });
          });
      });

      it('returns a 404 if the artist does not exist', (done) => {
        request(app)
          .delete('/artists/12345/albums/12345')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found.');
            done();
          });
      });
    });

      })
    });
