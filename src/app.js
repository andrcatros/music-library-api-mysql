const express = require('express');

const artistControllers = require('./controllers/artist')
const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/album');

const app = express();

app.use(express.json());

app.post('/artists', artistControllers.create);
app.get('/artists', artistControllers.list);


module.exports = app;
