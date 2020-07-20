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
          expect(res.body.artistId).to.equal(artist.id);
          expect(res.body.albumId).to.equal(album.id);
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
  
  });

    describe('tests with songs in the database', () => {
      let songs;
      beforeEach((done) => {
        Promise.all([
          Song.create({ name: 'A Summer Song', artistId: artist.id, albumId: album.id }),
          Song.create({ name: 'Another Funky Summer Song', artistId: artist.id, albumId: album.id}),
          Song.create({ name: 'Yet Another Song You Will Just Love', artistId: artist.id, albumId: album.id }),
        ]).then((documents) => {
          songs = documents;
          done();
        });
      });
      
      // GET tests
      describe('GET /artists/:artistId/albums/:albumId/songs', () => {
        it('gets all song records on a given album', (done) => {
          request(app)
            .get(`/artists/${artist.id}/albums/${album.id}/songs`)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(res.body.length).to.equal(3);
              res.body.forEach((song) => {
                const expected = songs.find((a) => a.id === song.id);
                expect(song.name).to.equal(expected.name);
                expect(song.artistId).to.equal(artist.id);
                expect(song.albumId).to.equal(album.id);
              });
              done();
            });
        });
      });


      describe('GET /artists/:artistId}/albums/:albumId/songs/:songId', () => {
        it('gets song of given album by song id', (done) => {
          let song = songs[0]
          request(app)
            .get(`/artists/${artist.id}/albums/${album.id}/songs/${song.id}`)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(res.body.name).to.equal('A Summer Song');
              expect(res.body.artistId).to.equal(artist.id);
              expect(res.body.albumId).to.equal(album.id);
              });
              done();
            });
      });
 

      // PATCH tests 
    describe('PATCH /artists/:artistId/albums/:albumId/songs/:songId', () => {
      it('updates song name by song id', (done) => {
        const song = songs[0]
        request(app)
          .patch(`/artists/${artist.id}/albums/${album.id}/songs/${song.id}`)
          .send({ name: 'Test Song' })
          .then((res) => {
            expect(res.status).to.equal(200);
            Song.findByPk(song.id).then(updatedSong => {
              expect(updatedSong.name).to.equal('Test Song');
              done();
            });
          });
      });

      it('returns a 404 if the song does not exist (but artist and album exists)', (done) => {
        request(app)
          .patch(`/artists/${artist.id}/albums/${album.id}/songs/12345`)
          .send({ name: 'AlbumName' })
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The song could not be found.');
            done();
          });
      }); 
    });

      // DELETE tests

      describe('DELETE /artists/:artistId/albums/:albumId/songs/:songId', () => {
        it('deletes song record by id', (done) => {
          const song = songs[0] 
          request(app)
            .delete(`/artists/${artist.id}/albums/${album.id}/songs/${song.id}`)
            .then((res) => {
              expect(res.status).to.equal(204);
              Song.findByPk(album.id, { raw: true }).then(updatedSong => {
                expect(updatedSong).to.equal(null);
                done();
              });
            });
        });
  
        it('returns a 404 if the song does not exist', (done) => {
          request(app)
            .delete(`/artists/${artist.id}/albums/${album.id}/songs/12345`)
            .then((res) => {
              expect(res.status).to.equal(404);
              expect(res.body.error).to.equal('The song could not be found.');
              done();
            });
        });
      });

  });
});