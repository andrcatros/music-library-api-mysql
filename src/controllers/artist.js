const { Artist } = require('../models');

exports.create = (req, res) =>{
    Artist.create(req.body).then(artist => res.status(201).json(artist))
};

exports.list = (req, res) => {
    Artist.findAll().then(artists => res.status(200).json(artists))
};

exports.getArtistsById = (req, res) => {
    const id = req.params.artistId;
    Artist.findOne({where: { id: id}}).then(artist => {
        if (!artist){
            res.status(404).json({ error: 'The artist could not be found.'})
        } else {
            res.status(200).json(artist)
        }
    });
};

exports.updateArtist = (req, res) => {
    const id = req.params.artistId;
    Artist.findOne({where: {id: id}}).then(artist => {
        if (!artist){
            res.status(404).json({ error: 'The artist could not be found.'})
        } else {
            Artist.update(req.body, {where: {id: id}})
            .then(rowsUpdated => res.status(200).json(rowsUpdated))
        }
    });
};

exports.delete = (req, res) => {
    const id = req.params.artistId;
    Artist.destroy({where: {id: id}}).then(deleted => {
        if (!deleted){
            res.status(404).json({error: 'The artist could not be found.'})
        } else {
            res.status(204).json(deleted);
        }
    });
};