const { expect } = require('chai');
const sinon = require('sinon');
const Note = require('../models/Note');
const noteControllers = require('../controllers/noteControllers');

// Helper to build a fake Express response object we can inspect afterwards.
function createRes() {
    return {
        render: function (view, data) {
            this.view = view;
            this.data = data;
            return this;
        },
        redirect: function (url) {
            this.redirectedTo = url;
            return this;
        },
        status: function (code) {
            this.statusCode = code;
            return this;
        }
    };
}

describe('Note Controller Validation', () => {

    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getAllNotes', () => {

        it('should successfully get all notes', async () => {
            const fakeNotes = [{ title: 'Note 1' }, { title: 'Note 2' }];
            sandbox.stub(Note, 'find').returns({
                sort: sandbox.stub().resolves(fakeNotes)
            });

            const req = { user: { _id: '12345' } };
            const res = createRes();

            await noteControllers.getAllNotes(req, res);

            expect(res.view).to.equal('notes/index');
            expect(res.data).to.have.property('notes');
            expect(res.data.notes).to.equal(fakeNotes);
        });

        it('should render an error when notes cannot be loaded', async () => {
            sandbox.stub(Note, 'find').returns({
                sort: sandbox.stub().rejects(new Error('DB down'))
            });

            const req = { user: { _id: '12345' } };
            const res = createRes();

            await noteControllers.getAllNotes(req, res);

            expect(res.statusCode).to.equal(400);
            expect(res.view).to.equal('notes/index');
            expect(res.data.notes).to.deep.equal([]);
            expect(res.data.error).to.equal('Could not load notes');
        });

    });

    describe('getNoteById', () => {

        it('should render the note when it is found', async () => {
            const fakeNote = { _id: '507f1f77bcf86cd799439011', title: 'My Note' };
            sandbox.stub(Note, 'findOne').resolves(fakeNote);

            const req = { params: { id: fakeNote._id }, user: { _id: '12345' } };
            const res = createRes();

            await noteControllers.getNoteById(req, res);

            expect(res.view).to.equal('notes/show');
            expect(res.data.note).to.equal(fakeNote);
        });

        it('should handle a note that does not exist', async () => {
            sandbox.stub(Note, 'findOne').resolves(null);

            const req = {
                params: { id: '507f1f77bcf86cd799439011' },
                user: { _id: '12345' }
            };
            const res = createRes();

            await noteControllers.getNoteById(req, res);

            /*
             * If no note exists with this ID/user,
             * the controller should return 404.
             */
            expect(res.statusCode).to.equal(404);
            expect(res.view).to.equal('notes/notFound');
        });

        it('should handle unexpected errors', async () => {
            sandbox.stub(Note, 'findOne').rejects(new Error('DB down'));

            const req = { params: { id: 'bad-id' }, user: { _id: '12345' } };
            const res = createRes();

            await noteControllers.getNoteById(req, res);

            expect(res.statusCode).to.equal(400);
            expect(res.view).to.equal('notes/notFound');
        });

    });

    describe('newNoteForm', () => {

        it('should render the new note form', () => {

            const req = {};
            const res = createRes();

            noteControllers.newNoteForm(req, res);

            expect(res.view).to.equal('notes/new');
            expect(res.data.error).to.equal(null);
            expect(res.data.values.title).to.equal('');
            expect(res.data.values.content).to.equal('');

        });

    });

    describe('editNoteForm', () => {

        it('should render the edit form when the note is found', async () => {
            const fakeNote = { _id: '507f1f77bcf86cd799439011', title: 'My Note' };
            sandbox.stub(Note, 'findOne').resolves(fakeNote);

            const req = { params: { id: fakeNote._id }, user: { _id: '12345' } };
            const res = createRes();

            await noteControllers.editNoteForm(req, res);

            expect(res.view).to.equal('notes/edit');
            expect(res.data.note).to.equal(fakeNote);
            expect(res.data.error).to.equal(null);
        });

        it('should handle a note that does not exist', async () => {
            sandbox.stub(Note, 'findOne').resolves(null);

            const req = { params: { id: '507f1f77bcf86cd799439011' }, user: { _id: '12345' } };
            const res = createRes();

            await noteControllers.editNoteForm(req, res);

            expect(res.statusCode).to.equal(404);
            expect(res.view).to.equal('notes/notFound');
        });

        it('should handle unexpected errors', async () => {
            sandbox.stub(Note, 'findOne').rejects(new Error('DB down'));

            const req = { params: { id: 'bad-id' }, user: { _id: '12345' } };
            const res = createRes();

            await noteControllers.editNoteForm(req, res);

            expect(res.statusCode).to.equal(400);
            expect(res.view).to.equal('notes/notFound');
        });

    });

    describe('createNote', () => {

        it('should create a note and redirect to /notes', async () => {
            sandbox.stub(Note.prototype, 'save').resolves();

            const req = {
                body: { title: 'New Note', content: 'Some content' },
                user: { _id: '12345' }
            };
            const res = createRes();

            await noteControllers.createNote(req, res);

            expect(res.redirectedTo).to.equal('/notes');
        });

        it('should re-render the form with an error when creation fails', async () => {
            sandbox.stub(Note.prototype, 'save').rejects(new Error('Validation failed'));

            const req = {
                body: { title: '', content: '' },
                user: { _id: '12345' }
            };
            const res = createRes();

            await noteControllers.createNote(req, res);

            expect(res.statusCode).to.equal(400);
            expect(res.view).to.equal('notes/new');
            expect(res.data.error).to.equal('Could not create the note. Please fill in both a title and content.');
            expect(res.data.values).to.deep.equal({ title: '', content: '' });
        });

    });

    describe('updateNote', () => {

        it('should update the note and redirect to the note page', async () => {
            const updatedNote = { _id: '507f1f77bcf86cd799439011', title: 'Updated', content: 'Updated content' };
            sandbox.stub(Note, 'findOneAndUpdate').resolves(updatedNote);

            const req = {
                params: { id: updatedNote._id },
                body: { title: 'Updated', content: 'Updated content' },
                user: { _id: '12345' }
            };
            const res = createRes();

            await noteControllers.updateNote(req, res);

            expect(res.redirectedTo).to.equal(`/notes/${updatedNote._id}`);
        });

        it('should handle a note that does not exist', async () => {
            sandbox.stub(Note, 'findOneAndUpdate').resolves(null);

            const req = {
                params: { id: '507f1f77bcf86cd799439011' },
                body: { title: 'Updated', content: 'Updated content' },
                user: { _id: '12345' }
            };
            const res = createRes();

            await noteControllers.updateNote(req, res);

            expect(res.statusCode).to.equal(404);
            expect(res.view).to.equal('notes/notFound');
        });

        it('should re-render the edit form with an error when the update fails', async () => {
            sandbox.stub(Note, 'findOneAndUpdate').rejects(new Error('Validation failed'));

            const req = {
                params: { id: '507f1f77bcf86cd799439011' },
                body: { title: '', content: '' },
                user: { _id: '12345' }
            };
            const res = createRes();

            await noteControllers.updateNote(req, res);

            expect(res.statusCode).to.equal(400);
            expect(res.view).to.equal('notes/edit');
            expect(res.data.error).to.equal('Could not update the note. Please fill in both a title and content.');
            expect(res.data.note).to.deep.equal({ _id: req.params.id, title: '', content: '' });
        });

    });

    describe('deleteNote', () => {

        it('should delete the note and redirect to /notes', async () => {
            sandbox.stub(Note, 'findOneAndDelete').resolves({ _id: '507f1f77bcf86cd799439011' });

            const req = { params: { id: '507f1f77bcf86cd799439011' }, user: { _id: '12345' } };
            const res = createRes();

            await noteControllers.deleteNote(req, res);

            expect(res.redirectedTo).to.equal('/notes');
        });

        it('should still redirect to /notes when deletion fails', async () => {
            sandbox.stub(Note, 'findOneAndDelete').rejects(new Error('DB down'));

            const req = { params: { id: 'bad-id' }, user: { _id: '12345' } };
            const res = createRes();

            await noteControllers.deleteNote(req, res);

            expect(res.redirectedTo).to.equal('/notes');
        });

    });

});
