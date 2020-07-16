const artistControllers = require('../controllers/artist');

module.exports = (app) => {
    // post routes
    app.post('/artists', artistControllers.create);
    
    // get routes
    app.get('/artists', artistControllers.list);
    app.get('/artists/:artistId', artistControllers.getArtistsById);

    // patch routes
    app.patch('/artists/:artistId', artistControllers.updateArtist);

    // delete routes
    app.delete('/artists/:artistId', artistControllers.delete);
}