const albumControllers = require('../controllers/album')

module.exports = (app) => {
    // post requests
    app.post('/artists/:artistId/albums', albumControllers.createAlbum);

    // get requests
    app.get('/artists/:artistId/albums', albumControllers.getAlbumsByArtistId);
    app.get('/artists/:artistId/albums/:albumId', albumControllers.getAlbumByAlbumId);

    // patch requests 
    app.patch('/artists/:artistId/albums/:albumId', albumControllers.updateAlbumById);

    // delete requests 
    app.delete('/artists/:artistId/albums/:albumId', albumControllers.delete);

};