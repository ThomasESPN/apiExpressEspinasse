const express = require('express');
const FilmController = require('../controllers/FilmController');

const router = express.Router();

router.get('/', FilmController.film_list);
router.get('/:id', FilmController.film_get);
router.post('/', FilmController.film_create);
router.put('/:id', FilmController.film_update);
router.delete('/:id', FilmController.film_delete);

module.exports = router;