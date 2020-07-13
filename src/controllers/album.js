const { Artist } = require('../models');
const { Album } = require('../models');

exports.createAlbum = (req, res) => {
    const { artistId } = req.params;
    const body = req.body;
  
    Artist.findByPk(artistId).then(foundArtist => {
      if (!foundArtist) {
        res.status(404).json({ error: 'The artist could not be found.' });
      } else if (req.body.length != 1) {         
            Album.bulkCreate(req.body).then(albums => {
                res.status(201).json({albums})
            })
        } else {
            Album.create({year:req.body.year, name:req.body.name}).then(album => {
                album.setArtist(foundArtist).then(updatedAlbum => {
                  res.status(201).json(updatedAlbum);
                });
             });
        } 
    });
  };

exports.getAlbumsByArtistId = (req, res) => {
    const { artistId } = req.params;

    Artist.findByPk(artistId).then(foundArtist =>{
        if(!foundArtist){
            res.status(404).json({ error: 'The artist could not be found.' });
        } else {
            Album.findAll({where: {artistId: artistId}}).then(foundAlbums =>
                    res.status(200).json(foundAlbums))
        }
    })

}
