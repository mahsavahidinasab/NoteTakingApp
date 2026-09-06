const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteControllers')
const ensureAuthenticated = require('../middleware/ensureAuthenticated')

router.use(ensureAuthenticated);

router.get('/notes', noteController.getAllNotes);
router.get('/notes/:id', noteController.getNoteById);
router.post('/notes', noteController.createNote);
router.put('/notes/:id', noteController.updateNote);
router.delete('/notes/:id', noteController.deleteNote);

module.exports = router;