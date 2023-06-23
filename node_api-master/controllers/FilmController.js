const db = require('../database');
const FilmRepository = require('../repository/FilmRepository');

exports.film_list = (req, res) => {
    const repo = new FilmRepository(db);
    repo.list_Film()
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

exports.film_get = (req, res) => {
  const repo = new FilmRepository(db);
  repo.get_Film(req.params.id)
      .then((result) => {
          res.json({
              success: true,
              data: result,
          });
      })
      .catch((err) => {
          res.status(404).json({ error: err.message });
      });
};
   
exports.film_create = (req, res) => {
  const errors = [];
  ['name', 'synopsis','release_year','genre_id','actor_ids'].forEach((field) => {
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

  const repo = new FilmRepository(db);

  repo.create_Film({
    name: req.body.name,
    synopsis: req.body.synopsis,
    release_year: req.body.release_year,
    genre_id: req.body.genre_id,
    actor_ids: req.body.actor_ids
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

exports.film_update = (req, res) => {
  const errors = [];
  ['name', 'synopsis','release_year','genre_id','actor_ids'].forEach((field) => {
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

  const repo = new FilmRepository(db);

  repo.update_Film(
      req.params.id,
      {
        name: req.body.name,
        synopsis: req.body.synopsis,
        releaseYear: req.body.releaseYear,
        genre_id: req.body.genre_id,
        actor_ids: req.body.actor_ids

      },
  )
      .then(() => {
          repo.get_Film(req.params.id)
              .then((result) => {
                  res.json({
                      success: true,
                      data: result,
                  });
              });
      })
      .catch((err) => {
          res.status(400).json({ error: err.message });
      });
};

exports.film_delete = (req, res) => {
    const repo = new FilmRepository(db);

    repo.delete_Film(req.params.id)
        .then(() => {
            res.status(204)
                .json({
                    success: true,
                });
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
  };
  