import {
    checkDatabaseExists, checkHeader, connectDatabase, createModel, verifyAppSecret,
    verifyParamExists
} from '../utils';
import { debug } from 'debug';
import { FiwareEntityInterface, FiwareEntitySchema } from '../model/entity';
import { CONTENT_RANGE, FIWARE_SERVICE, FIWARE_SERVICE_PATH } from '../constants';
import { Request, Response, Router } from 'express';
import { Connection, Document, Model } from 'mongoose';

const router: Router = Router();
const logger = debug('app:devices:controller');

// middleware specific to this router
router.use(
    verifyAppSecret.bind(null),
    // verify the Fiware-Service header is present
    checkHeader.bind(null, FIWARE_SERVICE, undefined),
    // create connection to database
    connectDatabase,
    // verify the database for the service exists
    checkDatabaseExists.bind(null),
);

router.get('/',
    // verify the Fiware-ServicePath is present or set a default value otherwise
    checkHeader.bind(null, FIWARE_SERVICE_PATH, '/#'),
    // Verify the type parameter exists; otherwise, throw a 400 error
    verifyParamExists.bind(null, 'type', undefined),
    // verfify lastCheck param exists or set it to a default of 01/01/2015 @ 12:00am (UTC)
    verifyParamExists.bind(null, 'lastCheck', '1420070400000'),
    verifyParamExists.bind(null, 'offset', '0'),
    verifyParamExists.bind(null, 'limit', ''),
    createModel.bind(null, FiwareEntitySchema, 'Entity'),
    async (req: Request, res: Response) => {
        // define variables
        const conn: Connection = req.body.connection;
        const entity: Model<FiwareEntityInterface> = req.body.model.Entity;
        const skip = Number(req.query.offset);
        const limit = Number(req.query.limit || 0);
        const service = req.get(FIWARE_SERVICE);
        // filtering parameters
        const query = {
            '_id.type': req.query.type,
            '_id.servicePath': {
                $regex: req.get(FIWARE_SERVICE_PATH)?.replace('/#', '/(.*)'),
                $options: 'i'
            }
        };
        // Get the total number of elements matching the filter
        const total: number = await entity.countDocuments(query);
        // query for results
        entity.aggregate([
            { $match: query },
            { $sort: { '_id.id': 1 } },
            { $skip: skip },
            limit > 0 ? { $limit: limit } : undefined,
            { $addFields: { 'service': service } },
            {
                $project: {
                    'id': '$_id.id',
                    'servicePath': '$_id.servicePath',
                    'service': 1,
                    'type': '$_id.type',
                    '_id': 0,
                    'attrNames': 1,
                    'attrs': 1,
                    'creDate': 1,
                }
            }
        ].filter(x => x !== undefined))
            .then((result: Document[]) => {
                logger(`getDevices returned ${result.length} results`);
                // Set the header with the results range
                res.set(CONTENT_RANGE, `items ${skip}-${skip + result.length - 1}/${total}`);
                conn.close().then(() => {
                    logger('Connection to db closed')
                });
                res.status(200).json(result);
            });
    },

);

export const deviceController: Router = router;
