const express = require('express');

const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/album');


const app = express();
app.use(express.json());

// artists routes 
artistRouter(app);

// album routes 
albumRouter(app);

module.exports = app;
