const express = require('express');
const router = express.Router();
const turfController = require('../controllers/turfController');

router.post('/', turfController.createTurf);

router.get('/', turfController.getAllTurfs);

router.get('/:id', turfController.getTurfById);

router.put('/:id', turfController.updateTurf);

router.delete('/:id', turfController.deleteTurf);

module.exports = router;
