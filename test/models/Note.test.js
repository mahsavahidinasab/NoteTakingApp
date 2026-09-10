const { expect } = require('chai');
const mongoose = require('mongoose');
const Note = require('../../models/Note');

async function getValidationError(doc) {
    try {
        await doc.validate();
        return null;
    } catch (error) {
        return error;
    }
}

describe('Note model', () => {

    it('should be valid with a title, content and user', async () => {
        const note = new Note({
            title: 'Grocery list',
            content: 'Milk, eggs, bread',
            user: new mongoose.Types.ObjectId()
        });

        const error = await getValidationError(note);

        expect(error).to.be.null;
    });

    it('should require a title', async () => {
        const note = new Note({
            content: 'Milk, eggs, bread',
            user: new mongoose.Types.ObjectId()
        });

        const error = await getValidationError(note);

        expect(error.errors.title).to.exist;
        expect(error.errors.title.message).to.equal('Title is required');
    });

    it('should require content', async () => {
        const note = new Note({
            title: 'Grocery list',
            user: new mongoose.Types.ObjectId()
        });

        const error = await getValidationError(note);

        expect(error.errors.content).to.exist;
        expect(error.errors.content.message).to.equal('Content is required');
    });

    it('should require a user', async () => {
        const note = new Note({
            title: 'Grocery list',
            content: 'Milk, eggs, bread'
        });

        const error = await getValidationError(note);

        expect(error.errors.user).to.exist;
    });

    it('should reject a title longer than 100 characters', async () => {
        const note = new Note({
            title: 'a'.repeat(101),
            content: 'Milk, eggs, bread',
            user: new mongoose.Types.ObjectId()
        });

        const error = await getValidationError(note);

        expect(error.errors.title).to.exist;
        expect(error.errors.title.message).to.equal('Title cannot exceed 100 characters');
    });

    it('should trim whitespace from the title and content', () => {
        const note = new Note({
            title: '  Grocery list  ',
            content: '  Milk, eggs, bread  ',
            user: new mongoose.Types.ObjectId()
        });

        expect(note.title).to.equal('Grocery list');
        expect(note.content).to.equal('Milk, eggs, bread');
    });

});
