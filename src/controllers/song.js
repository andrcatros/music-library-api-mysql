const { Artist, Album, Song } = require('../models');
const album = require('../models/album');

// controllers for POST requests

exports.create = (req, res) => {
    const ArtistId = req.params.artistId
    const AlbumId = req.params.albumId
    Artist.findByPk(ArtistId).then(foundArtist => {
        if (!foundArtist) {
          res.status(404).json({ error: 'The artist could not be found.' });        
        } else {
            Album.findByPk(AlbumId).then(foundAlbum =>{
                if (!foundAlbum){
                    res.status(404).json({ error: 'The album could not be found.' });
                } else {
                    Song.create({name: req.body.name, ArtistId: ArtistId, AlbumId: AlbumId})
                    .then(newSong => {
                        Song.findByPk(
                            newSong.id, {
                            include: {
                                model: Artist,
                                as: 'Artist',
                                }
                            }).then(foundRecords => {
                                res.status(201).json(foundRecords)})
                        })         
                }
            })
        }
})};

// controllers for GET requests 

exports.list = (req, res) => {
    Song.findAll().then(songs => res.status(200).json(songs))
}