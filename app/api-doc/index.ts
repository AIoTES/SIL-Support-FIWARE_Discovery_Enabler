import swaggerJsdoc, { ApiInformation, Options } from 'swagger-jsdoc';
import { Application } from 'express';
import { JsonObject, serve, setup } from 'swagger-ui-express';
import { debug } from 'debug';
import { license, version } from '../../package.json';

const logger = debug('app:server:api-docs');
const options: Options = {

    // list of files to be processed
    apis: ['dist/**/*.js!(.*)', 'app/**/!(*.spec).ts'],

    basePath: '/',

    swaggerDefinition: {
        // the semantic version number of the OpenAPI Specification version that the OpenAPI document uses.
        openapi: '3.0.0',
        // Provides metadata about the API
        info: {
            // the title of the API
            title: 'AIOTES-FIWARE Bridge enabler',
            // A short description of the API
            description: 'AIOTES-FIWARE Bridge enabler',
            // eslint-disable-next-line multiline-comment-style
            // A URL to the Terms of Service for the API
            // termsOfService: '',
            // The contact information for the exposed API
            contact: {
                // The identifying name of the contact person/organization.
                name: process.env.API_CONTACT_NAME,
                // The URL pointing to the contact information.
                url: process.env.API_CONTACT_URL,
                // The email address of the contact person/organization
                email: process.env.API_CONTACT_EMAIL,
            },
            // The license information for the exposed API
            license: {
                name: license,
                url: undefined,
            },
            // The version of the OpenAPI document
            version: version,
        } as ApiInformation,
        /*
         * An array of Server Objects, which provide connectivity information to a target server. If the
         * servers property is not provided, or is an empty array, the default value would be a Server Object
         * with a url value of ```/```.
         */
        servers: [],
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
