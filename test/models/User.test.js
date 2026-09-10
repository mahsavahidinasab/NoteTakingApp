const { expect } = require('chai');
const User = require('../../models/User');

async function getValidationError(doc) {
    try {
        await doc.validate();
        return null;
    } catch (error) {
        return error;
    }
}

describe('User model', () => {

    it('should be valid with a googleId', async () => {
        const user = new User({
            googleId: 'google-id-123',
            displayName: 'Jane Doe',
            email: 'jane@example.com'
        });

        const error = await getValidationError(user);

        expect(error).to.be.null;
    });

    it('should require a googleId', async () => {
        const user = new User({
            displayName: 'Jane Doe',
            email: 'jane@example.com'
        });

        const error = await getValidationError(user);

        expect(error.errors.googleId).to.exist;
    });

    it('should be valid without a displayName or email', async () => {
        const user = new User({
            googleId: 'google-id-123'
        });

        const error = await getValidationError(user);

        expect(error).to.be.null;
    });

    it('should lowercase the email', () => {
        const user = new User({
            googleId: 'google-id-123',
            email: 'Jane@Example.com'
        });

        expect(user.email).to.equal('jane@example.com');
    });

    it('should trim whitespace from the googleId and displayName', () => {
        const user = new User({
            googleId: '  google-id-123  ',
            displayName: '  Jane Doe  '
        });

        expect(user.googleId).to.equal('google-id-123');
        expect(user.displayName).to.equal('Jane Doe');
    });

});
