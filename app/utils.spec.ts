import { SinonSpy, assert, SinonStub, spy } from 'sinon';
import chai, { expect } from 'chai';
import { connectDatabase, checkDatabaseExists } from './utils';
import { mockRequest, mockResponse } from './test.utils.spec';
import mockedEnv, { RestoreFn } from 'mocked-env';
import mongoUnit from 'mongo-unit';
import debug from 'debug';

const logger = debug('testapp:utilities');

chai.should();

describe('Utilities', () => {
    let mongoUri: string;
    let nextSpy: SinonSpy;
    let mockReq: any;
    let mockRes: any;
    let restore: RestoreFn;

    before((done) => {
        mongoUnit.start({ port: 9999, verbose: false }).then((testUrl) => {
            mongoUri = testUrl;
            done();
        });
    });

    after((done) => {
        mongoUnit.stop().then(() => {
            logger('stopping mongodb instance');
            done();
        });
    });

    beforeEach((done) => {
        mockReq = mockRequest();
        mockRes = mockResponse();
        nextSpy = spy();
        mongoUnit.initDb(mongoUri, {}).then(() => {
            logger('Database initiated');
            done();
        });
    });

    afterEach((done) => {
        mongoUnit.drop().then(() => {
            logger('database dropped');
            done();
        });
    });

    describe('connectDatabase helper', () => {
        it('should throw an error if the connection string is not valid', async () => {
            restore = mockedEnv({
                MONGO_URI: 'localhost:9999',
            });
            await connectDatabase(mockReq, mockRes, nextSpy);
            assert.calledOnce(nextSpy);

            const errValue = nextSpy.lastCall.lastArg;
            errValue.should.be.ok;
            errValue.name.should.be.ok;
            expect(errValue.name).to.equal('MongoParseError');
            restore();
        });

        it('should connect if the connection string is correct', async () => {
            restore = mockedEnv({
                MONGO_URI: 'mongodb://localhost:9999',
            });
            (mockReq.get as SinonStub).withArgs('Fiware-Service').returns('test');
            await connectDatabase(mockReq, mockRes, nextSpy);
            assert.calledOnce(nextSpy);

            const errValue = nextSpy.lastCall.lastArg;
            expect(errValue).to.be.not.ok;

            expect(mockReq.body).to.be.ok;
            expect(mockReq.body.connection).to.be.ok;
            restore();
        });
    });

    describe('checkDatabaseExists helper', () => {
        it('', async () => {
            await checkDatabaseExists(mockReq, mockRes, nextSpy);
        });
    });

});

