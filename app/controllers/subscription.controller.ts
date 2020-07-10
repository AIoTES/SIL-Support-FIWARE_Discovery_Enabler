import { Router } from 'express';
// import { debug } from 'debug';
import { verifyApiKey } from '../utils';
import { ConfigParams } from '../config';
import proxy, { } from 'express-http-proxy';

const router: Router = Router();
// const logger = debug('app:subscription:controller');
const config = ConfigParams();

router.use(
    // check authorization
    verifyApiKey.bind(null),
);

router.get('/',
    proxy(config.orionUrl as string, {
        parseReqBody: false,
        proxyReqPathResolver: req => req.baseUrl
    }),
);

router.post('/',
    proxy(config.orionUrl as string, {
        proxyReqPathResolver: req => req.baseUrl
    }),
);

router.delete('/:subsId',
    proxy(config.orionUrl as string, {
        parseReqBody: false,
        proxyReqPathResolver: req => req.baseUrl + req.path
    }),
);

export const subscriptionController: Router = router;
