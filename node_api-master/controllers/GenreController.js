const db = require('../database');
const GenreRepository = require('../repository/GenreRepository');

exports.genre_list = (req, res) => {
    const repo = new GenreRepository(db);
    repo.list_Genre()
        .then((result) => {
            res.json({
                success: true,
                data: result,
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.genre_create = (req, res) => {
    const errors = [];
    ['name'].forEach((field) => {
        if (!req.body[field]) {
            errors.push(`Field '${field}' is missing from request body`);
        }
    });
    if (errors.length) {
        res.status(400).json({
            success: false,
            errors,
        });
        return;
    }

    const repo = new GenreRepository(db);

    repo.create_Genre({
        name: req.body.name,
    })
        .then((result) => {
            res
                .status(201)
                .json({
                    success: true,
                    id: result,
                });
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
};

exports.genre_delete = (req, res) => {
    const repo = new GenreRepository(db);

    repo.delete_Genre(req.params.id)
        .then(() => {
            res.status(204)
                .json({
                    success: true,
                    message: 'Genre deleted successfully.',
                });
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
};