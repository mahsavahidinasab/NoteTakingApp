const { expect } = require('chai');
const sinon = require('sinon');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

describe('ensureAuthenticated middleware', () => {

    it('should call next() when the user is authenticated', () => {
        const req = { isAuthenticated: () => true };
        const res = { redirect: sinon.spy() };
        const next = sinon.spy();

        ensureAuthenticated(req, res, next);

        expect(next.calledOnce).to.be.true;
        expect(res.redirect.called).to.be.false;
    });

    it('should redirect to / when the user is not authenticated', () => {
        const req = { isAuthenticated: () => false };
        const res = { redirect: sinon.spy() };
        const next = sinon.spy();

        ensureAuthenticated(req, res, next);

        expect(next.called).to.be.false;
        expect(res.redirect.calledOnceWith('/')).to.be.true;
    });

});
