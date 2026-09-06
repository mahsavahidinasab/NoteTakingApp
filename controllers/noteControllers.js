const Note = require('../models/Note');

const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            user: req.user._id
        });
        res.status(200).json(notes);
    } catch(error) {
        res.status(400).json({
            message: 'could not get notes'
        });
    }
}

const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById({
            _id: req.params.id,
            user: req.user._id
        });

        // if no note was found
        if(!note){
            return res.status(404).json({
                message: "no book was found"
            });
        }
        // return the note
        res.status(200).json(note);
    } catch(error){
        res.status(400).json({
            message: "invalid note id"
        });
    }
}

const createNote = async (req, res) => {
    try {
        const newNote = new Note({
            title: req.body.title,
            content: req.body.content,
            user: req.user._id
        });

        const savedNote = await newNote.save();

        res.status(201).json(savedNote);
    } catch(error) {
        res.status(400).json({
            message: 'could not create the note'
        });
    }
}

const deleteNote = async (req, res) => {
    try {
        const deleteNote = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if(!deleteNote) {
            return res.status(404).json({
                message: 'note not found'
            })
        }

        res.status(200).json({
            message: 'note deleted successfully',
            note: deleteNote
        });


    } catch(error) {
        res.status(400).json({
            message: 'could not delete the note'
        })
    }
}

const updateNote = async (res, req) => {
    try {
        const updateNote = await Note.findOneAndUpdate({
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

            // note doesn't exist or does not belong to this user
            if(!updateNote) {
                return status(404).json({
                    message: 'note not found'
                });
            }
            res.status(200).json(updateNote)
        } catch(error){
            res.status(400).json({
                message: 'could not update the note'
            });
        }
}

module.exports = {getAllNotes, getNoteById, createNote, deleteNote, updateNote}