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
                this[newAttr] = param;
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


    // it('should not change header', () => {
    //     doneMock = sinon.fake.returns();
    //     nextMock = sinon.fake.returns();
    //envelopeMock.headers[appMock.config.header] = 'no';
    //     let res = dryRun.init(appMock, doneMock);
    //     // except(res.)
    // })

    // it('should not change header', () => {
    //     envelopeMock.headers[appMock.config.header] = 'yes';
    //     // appMock.config.receivers = ['titi', 'toto'];
    //     let test = sinon.stub(appMock, 'addHook');
    //     console.log(appMock)


    //     dryRun.init(appMock, doneMock);



    //     // console.log(res);
    //     // expect(test[0]['errorWithCallStack'] instanceof Error).to.true;
    // })

    it('should change header', () => {
        envelopeMock.headers[appMock.config.header] = 'yes';
        appMock.config.receivers = ['titi', 'toto'];
        let test = sinon.stub(appMock, 'addHook').yields('random-error', null);;
        dryRun.init(appMock, doneMock);


        let res = test.getCalls()[0];
        console.log(res.lastArg)
        expect(res.thisValue.config.receivers.length).to.equal(2)
    })
});