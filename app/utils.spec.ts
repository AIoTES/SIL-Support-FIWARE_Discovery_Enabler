/* eslint-disable @typescript-eslint/no-explicit-any */
import { assert, SinonSpy, SinonStub, spy } from 'sinon';
import chai, { expect } from 'chai';
import { checkDatabaseExists, connectDatabase } from './utils';
import { mockRequest, mockResponse } from './test.utils.spec';
import mockedEnv, { RestoreFn } from 'mocked-env';
import mongoUnit from 'mongo-unit';
import debug from 'debug';
import { fail } from 'assert';

const logger = debug('testapp:utilities');

chai.should();

describe.skip('Utilities', () => {
    let mongoUri: string;
    let nextSpy: SinonSpy;
    let mockReq: any;
    let mockRes: any;
    let restore: RestoreFn;

    before(() => {
        debug('Launching mongodb instance... ');
        const init = Date.now();
        return mongoUnit.start({ port: 9999, dbName: 'test', verbose: false })
            .then((testUrl) => {
                debug(`... instance launched successfully in ${Date.now() - init} ms`);
                mongoUri = testUrl;
            });
    });

    after(() => {
        return mongoUnit.stop()/* .then(() => {
            logger('stopping mongodb instance');
        }) */;
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
            assert.notCalled(nextSpy);
            assert.calledWith(mockRes.status, 400);
            assert.calledWithMatch(mockRes.json, { error: 'MongoParseError' })

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
        beforeEach(() => {
            restore = mockedEnv({
                MONGO_URI: 'mongodb://localhost:9999',
            });

        });
        afterEach(() => {
            restore();
        });

        it('should not fail when the datase exists', async () => {
            (mockReq.get as SinonStub).withArgs('Fiware-Service').returns('test');
            await connectDatabase(mockReq, mockRes, nextSpy);
            await checkDatabaseExists(mockReq, mockRes, nextSpy);
            assert.calledOnce(nextSpy);
        });

        it('should fail when the database does not exist', async () => {
            try {
                (mockReq.get as SinonStub).withArgs('Fiware-Service').returns('anotherDb');
                await connectDatabase(mockReq, mockRes, nextSpy);
                await checkDatabaseExists(mockReq, mockRes, nextSpy);
                assert.notCalled(nextSpy);
                fail('expected method to fail');
            } catch (e) {
                expect(e).not.to.be.undefined;
            }
        });
    });

});

