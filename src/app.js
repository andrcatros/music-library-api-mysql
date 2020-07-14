const express = require('express');

const artistControllers = require('./controllers/artist');
const albumControllers = require('./controllers/album')

const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/album');

const app = express();

app.use(express.json());

// artists
app.post('/artists', artistControllers.create);
app.get('/artists', artistControllers.list);

app.get('/artists/:artistId', artistControllers.getArtistsById);
app.patch('/artists/:artistId', artistControllers.updateArtist);

app.delete('/artists/:artistId', artistControllers.delete);

// albums 
app.post('/artists/:artistId/albums', albumControllers.createAlbum);
app.get('/artists/:artistId/albums', albumControllers.getAlbumsByArtistId);

app.get('/artists/:artistId/albums/:albumId', albumControllers.getAlbumByAlbumId);

module.exports = app;
