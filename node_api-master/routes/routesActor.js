const express = require('express');
const ActorController = require('../controllers/ActorController');

const router = express.Router();

router.get('/', ActorController.actors_list);
router.get('/:id', ActorController.actor_get);
router.post('/', ActorController.actor_create);
router.put('/:id', ActorController.actor_update);
router.delete('/:id', ActorController.actor_delete);

module.exports = router;
