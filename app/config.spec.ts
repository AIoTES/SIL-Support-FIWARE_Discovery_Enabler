import mockedEnv, { RestoreFn } from 'mocked-env';
import { ConfigParams } from './config';
import expect from 'expect.js';

describe('Using default config parameters', () => {

    let restore: RestoreFn;

    beforeEach(() => {
        restore = mockedEnv({
            // default values
        });
    });

    afterEach(() => {
        restore();
    });

    it('Should create a configuration object', () => {
        expect(ConfigParams).to.be.ok();
        expect(typeof ConfigParams).to.equal('function');
        const config = ConfigParams();
        expect(config).to.be.ok();
    });

    it('should contain the property servicePrefix', () => {
        const config = ConfigParams();
        expect(config).to.have.property('servicePrefix');
        expect(config.servicePrefix).to.be.ok();
        // default value
        expect(config.servicePrefix).to.equal('orion-');
    });

    it('should contain the property mongoUri');
});

describe('Inject new config parameters through env variables', () => {
    let restore: RestoreFn;

    beforeEach(() => {
        restore = mockedEnv({
            ORION_SERVICE_PREFIX: 'another-prefix-',
        });
    });

    afterEach(() => {
        restore();
    });

    it('should contain the property servicePrefix', () => {
        const config = ConfigParams();
        expect(config).to.have.property('servicePrefix');
        expect(config.servicePrefix).to.be.ok();
        // modified value value
        expect(config.servicePrefix).to.equal('another-prefix-');
    });

});
