const { Artist } = require('../models');
const { Album } = require('../models');

exports.createAlbum = (req, res) => {
    const { artistId } = req.params;
  
    Artist.findByPk(artistId).then(foundArtist => {
      if (!foundArtist) {
        res.status(404).json({ error: 'The artist could not be found.' });
      } else if (req.body[0]) {
        const promiseArr = req.body.map(entry => {
          Album.create(entry).then(album => album.setArtist(foundArtist))
        });

        Promise.all(promiseArr).catch(err => console.log('something failed to resolve', err))
        .then(albums => res.status(201).json(albums))
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

};

exports.getAlbumByAlbumId = (req, res) => {
  const artistId = req.params.artistId;
  const albumId = req.params.albumId;

  Album.findAll({where: { artistId: artistId, id: albumId}}).then(foundAlbums =>{
    if (foundAlbums.length == 0){
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      res.status(200).json(foundAlbums)
    }
  })
}
