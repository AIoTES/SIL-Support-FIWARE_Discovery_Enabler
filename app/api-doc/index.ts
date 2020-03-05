import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import { Application } from 'express';
import { JsonObject, serve, setup } from 'swagger-ui-express';
import { debug } from 'debug';

const logger = debug('app:server:api-docs');
const options: Options = {

    // list of files to be processed
    apis: ['dist/**/*.js!(.*)', 'app/**/!(*.spec).ts'],

    basePath: '/',

    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            description: 'AIOTES-FIWARE Bridge enabler',
            title: 'AIOTES-FIWARE Bridge enabler',
            version: '1.0.0'
        },
    },
};

const specs: JsonObject = swaggerJsdoc(options);

// log generated specs
logger(specs);

/**
 * Registers the openapi endpoints into the application
 * @param app the app used to mount the endpoints
 * @param path the path where documentation is accessible. Defaults to ```/api-docs```
 */
export function RegisterApiDocs(app: Application, path = '/api-docs'): void {
    app.use(path, serve, setup(specs));
}
