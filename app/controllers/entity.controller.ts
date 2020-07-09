import {
    checkDatabaseExists, checkHeader, connectDatabase, verifyApiKey
} from '../utils';
import { FIWARE_SERVICE } from '../constants';
import { Router } from 'express';
import cors from 'cors';
import proxy, { } from 'express-http-proxy';
import { ConfigParams } from '../config';

const router: Router = Router();
const config = ConfigParams();

// middleware specific to this router
router.use(
    verifyApiKey.bind(null),
    // verify the Fiware-Service header is present
    checkHeader.bind(null, FIWARE_SERVICE, undefined),
    // create connection to database
    connectDatabase,
    // verify the database for the service exists
    checkDatabaseExists.bind(null),
);

router.options('/', cors({
    methods: 'POST',
    allowedHeaders: 'Content-Type,x-api-key',
    exposedHeaders: 'content-range',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));

router.post('/',
    proxy(config.orionUrl as string, {
        proxyReqPathResolver: req => req.baseUrl
    }),
);

router.options('/:entityId', cors({
    methods: ['GET', 'DELETE'],
    allowedHeaders: 'Content-Type,x-api-key',
    exposedHeaders: 'content-range',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));

router.get('/:entityId',
    proxy(config.orionUrl as string, {
        parseReqBody: false,
        proxyReqPathResolver: req => req.baseUrl + req.path
    }),
);

router.delete('/:subsId',
    proxy(config.orionUrl as string, {
        parseReqBody: false,
        proxyReqPathResolver: req => req.baseUrl + req.path
    }),
);

router.options('/:entityId/attrs', cors({
    methods: ['POST', 'PUT', 'PATCH'],
    allowedHeaders: 'Content-Type,x-api-key',
    exposedHeaders: 'content-range',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));

router.post('/:entityId/attrs',
    proxy(config.orionUrl as string, {
        proxyReqPathResolver: req => req.baseUrl
    }),
);

router.put('/:entityId/attrs',
    proxy(config.orionUrl as string, {
        proxyReqPathResolver: req => req.baseUrl
    }),
);

router.patch('/:entityId/attrs',
    proxy(config.orionUrl as string, {
        proxyReqPathResolver: req => req.baseUrl
    }),
);

export const entityController: Router = router;
