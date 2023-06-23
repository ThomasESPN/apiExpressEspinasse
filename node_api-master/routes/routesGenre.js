const express = require('express');
const GenreController = require('../controllers/GenreController');

const router = express.Router();

router.get('/', GenreController.genre_list);
router.post('/', GenreController.genre_create);
router.delete('/:id', GenreController.genre_delete);

module.exports = router;
