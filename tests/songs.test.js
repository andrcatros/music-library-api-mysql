/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album, Song } = require('../src/models');

describe('/songs', () => {
  let artist;
  let album;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
      await Song.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      await Song.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
      album = await Album.create({
        name: 'InnerSpeaker',
        year: 2010,
        ArtistId: artist.id,
      });
    } catch (err) {
      console.log(err);
    }
  });

  // POST tests
  describe('POST artists/:artistId/albums/:albumId/songs', () => {
    it('creates a new song under an album', (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums/${album.id}/songs`)
        .send({
          name: 'Solitude Is Bliss',
        })
        .then((res) => {
          expect(res.status).to.equal(201);
          const songId = res.body.id;
          expect(res.body.id).to.equal(songId);
          expect(res.body.name).to.equal('Solitude Is Bliss');
          expect(res.body.ArtistId).to.equal(artist.id);
          expect(res.body.AlbumId).to.equal(album.id);
          done();
        });
    });

    it('returns a 404 if the album does not exist', (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums/12345/songs`)
        .send({
          name: 'Solitude Is Bliss',
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The album could not be found.')
          done();
        })
    });

    it('returns a 404 if the artist does not exist', (done) => {
      request(app)
        .post(`/artists/12345/albums/${album.id}/songs`)
        .send({
          name: 'Solitude Is Bliss',
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.')
          done();
        })
    });
  
    describe('tests with songs in the database', () => {
      let songs;
      beforeEach((done) => {
        Promise.all([
          Song.create({ name: 'A Summer Song', ArtistId: artist.id, AlbumId: album.id }),
          Song.create({ name: 'Another Funky Summer Song', ArtistId: artist.id, AlbumId: album.id}),
          Song.create({ name: 'Yet Another Song You Will Just Love', ArtistId: artist.id, AlbumId: album.id }),
        ]).then((documents) => {
          songs = documents;
          done();
        });
      });
      
      // GET tests 

      // PATCH tests 

      // DELETE tests

  });
});
});