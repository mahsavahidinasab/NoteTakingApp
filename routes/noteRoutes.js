const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteControllers')
const ensureAuthenticated = require('../middleware/ensureAuthenticated')

router.use(ensureAuthenticated);

router.get('/notes', noteController.getAllNotes);
router.get('/notes/new', noteController.newNoteForm);
router.post('/notes', noteController.createNote);
router.get('/notes/:id', noteController.getNoteById);
router.get('/notes/:id/edit', noteController.editNoteForm);
router.put('/notes/:id', noteController.updateNote);
router.delete('/notes/:id', noteController.deleteNote);

module.exports = router;
