const songControllers = require('../controllers/song')

module.exports = (app) => {
    // post requests
    app.post('/artists/:artistId/albums/:albumId/songs', songControllers.create);

    // get requests 
    app.get('/artists/:artistId/albums/:albumId/songs', songControllers.list)
};


//`artists/${artist.id}/albums/${album.id}/songs`