   const albumControllers = require('../controllers/album')

module.exports = (app) => {
    // post requests
    app.post('/artists/:artistId/albums', albumControllers.createAlbum);

    // get requests
    app.get('/artists/:artistId/albums', albumControllers.getAlbumsByArtistId);
    app.get('/artists/:artistId/albums/:albumId', albumControllers.getAlbumByAlbumId);

};