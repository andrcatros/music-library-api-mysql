const { Artist, Album, Song } = require('../models');

// controllers for POST requests

exports.create = (req, res) => {
    const artistId = req.params.artistId
    const albumId = req.params.albumId
    Artist.findByPk(artistId).then(foundArtist => {
        if (!foundArtist) {
          res.status(404).json({ error: 'The artist could not be found.' });        
        } else {
            Album.findByPk(albumId).then(foundAlbum =>{
                if (!foundAlbum){
                    res.status(404).json({ error: 'The album could not be found.' });
                } else {
                    Song.create({name: req.body.name, artistId: artistId, albumId: albumId})
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
    Song.findAll({include: {model: Artist, as: 'Artist'}}).then(songs => res.status(200).json(songs))
};

exports.listById = (req, res) => {
    Song.findByPk(req.params.songId, {include: {model: Artist, as: 'Artist'}}).then(song => res.status(200).json(song))
}

// controllers for PATCH requests 

exports.updatedById = (req, res) => {
    const artistId = req.params.artistId;
    const albumId = req.params.albumId;
    const songId = req.params.songId;
  
  Song.findAll({where: { artistId: artistId, albumId: albumId, id: songId}}).then(foundSongs =>{
    if (foundSongs.length == 0){
      res.status(404).json({ error: 'The song could not be found.' });
    } else {
      Song.update(req.body, {where: { artistId: artistId, albumId: albumId, id: songId}})
      .then(rowsUpdated => res.status(200).json(rowsUpdated))
    }
  });  
}
// controllers for DELETE requests

exports.delete = (req, res) => {
    const artistId = req.params.artistId;
    const albumId = req.params.albumId;
    const songId = req.params.songId;

    Song.destroy({where:{albumId:albumId, artistId:artistId, id: songId}}).then(deleted => {
    if (!deleted){
      res.status(404).json({error: 'The song could not be found.'})
    } else {
      res.status(204).json(deleted);
      }
    })

}