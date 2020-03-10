import express, { Application } from 'express';
import { deviceController } from './devices.controller';
import { Server } from 'http';
import supertest from 'supertest';
import chai, { } from 'chai';

chai.should();

describe.skip('Device controller', () => {
    let app: Application;
    let server: Server;
    beforeEach(() => {
        // TODO: implement
        app = express();
        app.use('/test', deviceController);
        server = app.listen(13000, () => {
            // TODO: implement
        });
    });

    afterEach(() => {
        server.close(() => {
            // TODO: implement
        });
    });

    it('should return 400 when calling without the "Fiware-Service" header', (done) => {
        supertest(app)
            .get('/test')
            .expect(400)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                res.should.be.ok;
                if (err) {
                    done(err);
                }
                done();
            });
    });

    it('should return 200 when setting the minimal set of headers/parameters', (done) => {
        supertest(app)
            .get('/test')
            .set('Fiware-Service', 'myService')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                res.should.be.ok;
                done();
            });
    });
});
