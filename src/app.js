const express = require('express');

const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/album');
const songRouter = require('./routes/song')

const app = express();
app.use(express.json());

// artists routes 
artistRouter(app);

// album routes 
albumRouter(app);

// song routes
songRouter(app);

module.exports = app;
