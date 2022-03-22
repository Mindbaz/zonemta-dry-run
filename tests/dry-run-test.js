const chai = require('chai');
const sinon = require('sinon');
var expect = chai.expect;
var dryRun = require('../index.js');

describe('Dry Run - Changes header to send mail to other receiver provided', () => {

    nextMock = undefined;
    doneMock = undefined;
    messageInfoMock = undefined;
    envelopeMock = {
        headers: {
            update: function (param, newAttr) {
                this[param] = newAttr;
            },
            getFirst: function (param) {
                return this[param];
            },
            from: '',
            to: [],
            'X-Fake-Header': '',
            'Delivered-To': ''
        },
        from: '',
        to: [],
        parsedEnvelope: {
            from: '',
            to: []
        },
    }

    appMock = {
        config: {
            header: 'X-Fake-Header',
            sender: 'fake@sender.com',
            receivers: [],
            fakeReceivers: [],
        },
        addHook: function (type, cb) {
            cb(envelopeMock, messageInfoMock, nextMock)
        }
    }

    beforeEach(function () {
        doneMock = sinon.fake.returns();
        nextMock = sinon.fake.returns();
    });

    it('should not change header', () => {
        envelopeMock.headers[appMock.config.header] = 'no';
        dryRun.init(appMock, doneMock);
        expect(nextMock.calledThrice).to.be.true;
    })

    it('should not send any mails - missing receivers', () => {
        envelopeMock.headers[appMock.config.header] = 'yes';
        dryRun.init(appMock, doneMock);
        let nextError = nextMock.getCalls()[0].args[0];
        expect(nextMock.calledTwice).to.be.true;
        expect(nextError).to.be.instanceof(Error)
        expect(nextError.toString()).to.equal('Error: No receivers found in config')
    })

    it('should change header with real receiver', () => {
        envelopeMock.headers[appMock.config.header] = 'yes';
        appMock.config.receivers = ['titi', 'toto'];
        dryRun.init(appMock, doneMock);
        expect(nextMock.calledOnce).to.be.true;
        expect(envelopeMock.to.length).to.be.equal(1);
        expect(envelopeMock.parsedEnvelope.from).to.be.equal('fake@sender.com')
    })

    it('should change header with fake receiver', () => {
        envelopeMock.headers[appMock.config.header] = 'yes';
        appMock.config.fakeReceivers = ['fakeTiti', 'fakeToto'];
        dryRun.init(appMock, doneMock);
        expect(nextMock.calledOnce).to.be.true;
        expect(envelopeMock.to.length).to.be.equal(1);
        expect(envelopeMock.parsedEnvelope.from).to.be.equal('fake@sender.com')
    })

    it('should change header with real or fake receiver', () => {
        envelopeMock.headers[appMock.config.header] = 'yes';
        appMock.config.receivers = ['titi', 'toto'];
        appMock.config.fakeReceivers = ['fakeTiti', 'fakeToto'];
        dryRun.init(appMock, doneMock);
        expect(nextMock.calledOnce).to.be.true;
        expect(envelopeMock.to.length).to.be.equal(1);
        expect(envelopeMock.parsedEnvelope.from).to.be.equal('fake@sender.com')
    })
});