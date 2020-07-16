const { Artist, Album } = require('../models');

// controllers for POST requests
exports.createAlbum = (req, res) => {
  
    Artist.findByPk(req.params.artistId).then(foundArtist => {
      if (!foundArtist) {
        res.status(404).json({ error: 'The artist could not be found.' });        
      } 
      // if req.body is an array of json objects, create albums through Promise.all
      else if (req.body[0]) {
        const promiseArr = req.body.map(entry => {
          Album.create(entry).then(album => album.setArtist(foundArtist))
        });
        Promise.all(promiseArr).catch(err => console.log('something failed to resolve', err))
        .then(albums => res.status(201).json(albums))
        } 
      // if req.body is just one object, create albums without Promise.all  
      else {
        Album.create(req.body).then(album => {
            album.setArtist(foundArtist).then(updatedAlbum => res.status(201).json(updatedAlbum));
             });
        }; 
    });
  };

// controllers for GET requests
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
};

// controllers for PATCH requests 

// controllers for DELETE requests 