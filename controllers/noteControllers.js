const Note = require('../models/Note');

const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.render('notes/index', { notes });
    } catch (error) {
        res.status(400).render('notes/index', { notes: [], error: 'Could not load notes' });
    }
}

const getNoteById = async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

        if (!note) {
            return res.status(404).render('notes/notFound');
        }

        res.render('notes/show', { note });
    } catch (error) {
        res.status(400).render('notes/notFound');
    }
}

const newNoteForm = (req, res) => {
    res.render('notes/new', { error: null, values: { title: '', content: '' } });
}

const editNoteForm = async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

        if (!note) {
            return res.status(404).render('notes/notFound');
        }

        res.render('notes/edit', { note, error: null });
    } catch (error) {
        res.status(400).render('notes/notFound');
    }
}

const createNote = async (req, res) => {
    try {
        const newNote = new Note({
            title: req.body.title,
            content: req.body.content,
            user: req.user._id
        });

        await newNote.save();

        res.redirect('/notes');
    } catch (error) {
        res.status(400).render('notes/new', {
            error: 'Could not create the note. Please fill in both a title and content.',
            values: { title: req.body.title, content: req.body.content }
        });
    }
}

const updateNote = async (req, res) => {
    try {
        const updatedNote = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            {
                title: req.body.title,
                content: req.body.content
            },
            {
                new: true,
                runValidators: true
            });

        if (!updatedNote) {
            return res.status(404).render('notes/notFound');
        }

        res.redirect(`/notes/${updatedNote._id}`);
    } catch (error) {
        res.status(400).render('notes/edit', {
            error: 'Could not update the note. Please fill in both a title and content.',
            note: { _id: req.params.id, title: req.body.title, content: req.body.content }
        });
    }
}

const deleteNote = async (req, res) => {
    try {
        await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        res.redirect('/notes');
    } catch (error) {
        res.redirect('/notes');
    }
}

module.exports = { getAllNotes, getNoteById, newNoteForm, editNoteForm, createNote, deleteNote, updateNote }
