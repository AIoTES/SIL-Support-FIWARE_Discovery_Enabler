import { ConfigParams, mongoRegex } from './config';
import express, { Request, Response } from 'express';
import { debug } from 'debug';
import { errorHandler } from './errorHandlers';
import { logConnectionDetails } from './utils';
import { MONGO_URI } from './constants';
import { RegisterApiDocs } from './api-doc';
import { RegisterRoutes } from './controllers';
import { Server } from 'http';

const logger = debug('app:server');

const app: express.Application = express();

const port = Number(process.env.HTTP_PORT || 3000); // default port 3000, but configurable from env variables

const initTimeStamp: number = Date.now();

const config = ConfigParams();

// verify that a valid mongo connection string was provided
if (config.mongoUri === '') {
    logger(`ERROR: No ${MONGO_URI} was specified`);
    process.exit(1);
} else if (!mongoRegex.test(config.mongoUri as string)) {
    logger(`ERROR: ${MONGO_URI}='${config.mongoUri}' is not a correct mongo connection string`);
    process.exit(1);
}

// verify that an API_KEY was configured
if (config.apiKey === undefined) {
    logger('ERROR: an API_KEY needs to be configured for this application');
    process.exit(1);
}

// verify that an ORION_URL was provided
if (config.orionUrl === undefined) {
    logger('ERROR: the public url of orion needs to be configured');
    process.exit(1);
}

// parse body
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Log request
app.use(logConnectionDetails);

// register app routes
RegisterRoutes(app);

// RegisterApiDocumentation(app);
RegisterApiDocs(app);

// Register custom Not Found handler
app.use((req: Request, res: Response) => {
    res.status(404).send('Not found');
});

// generic error handler
app.use(errorHandler);

// Bootstrap server
const server: Server = app.listen(port, () => {
    logger(`AIoTES enabler listening on port ${port}. Server started in ${Date.now() - initTimeStamp} ms`);
});

// Export module (disabled on production environments)
if (process.env.NODE_ENV !== 'prod') {
    module.exports = server;
}
