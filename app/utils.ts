import { NextFunction, Request, Response } from 'express';
import {
    badRequest,
    forbiddenRequest, handleMongoConnectionError, missingHeaderError,
    unAuthorizedRequest
} from './errorHandlers';
import { ConfigParams } from './config';
import mongoose, { Connection, ConnectionOptions, Schema } from 'mongoose';
import { FIWARE_SERVICE, X_API_KEY } from './constants';
import { debug } from 'debug';

const logger = debug('app:utils');
mongoose.set('debug', process.env.DEBUG !== undefined);
export const _mongoose = mongoose;

/**
 * Helper function that asserts a request contains a header. If a default value is provided and the header is not
 * present, the header is set to its default value.
 * If no default alue is specified and the header is not present, the request is finalized with a HTTP 400 Bad Request.
 * @param header the header name
 * @param defaultValue default value to set in case the header is absent
 * @param req the request object
 * @param res the response object
 * @param next the next function
 */
export function checkHeader(
    header: string, defaultValue: string | undefined, req: Request, res: Response, next: NextFunction): void {
    logger(`checking the presence of header ${header}`);
    const _header: string | undefined = req.get(header);
    if (_header === undefined && defaultValue === undefined) {
        // header not present, we send a 400 Bad Request error
        logger(`header ${header} is absent`);
        return missingHeaderError(res, header);
    } else if (_header === undefined && defaultValue !== undefined) {
        req.headers[header.toLowerCase()] = defaultValue;
    }
    next();
}

/**
 * Helper method that verifies that a query param is present in the request. If not present but a default value is
 * provided, the param will be
 * added to the request. If no default value is provided and the param is not present either, the request will
 * proceed to the next middleware handler
 * without further modifications.
 * @param name the param name
 * @param defaultValue the default value
 * @param separatorChar allows defining an array of values separated using this character. If set to undefined,
 * the param is assumed single-valued
 * @param req the request object
 * @param res the response object
 * @param next the next function
 */
export function verifyParamExists(
    name: string, defaultValue: string | undefined, separatorChar: string | undefined, req: Request, res: Response,
    next: NextFunction): void {
    logger(`checking the presence of parameter ${name}`);
    if (req.query[name] === undefined && defaultValue === undefined) {
        // TODO: what to do i this case?
        badRequest(res, 'MissingParameter', `The paramater "${name}" is mandatory but it is not present in the request`)
    } else if (req.query[name] === undefined && defaultValue !== undefined) {
        req.query[name] = defaultValue;
    }
    // handle multivalue
    if (separatorChar !== undefined && req.query[name] !== undefined) {
        const elements = (req.query[name] as string).split(separatorChar).filter(x => x !== undefined && x !== '');
        logger(elements);
        if (elements && elements.length > 1) {
            // when multivalue detected, change the param to a regular expression
            req.query[name] = new RegExp('^(' + elements.join('|').replace('*', '(.*)') + ')$');
        } else if (elements && elements.length === 1) {
            // handle the case when the original param is prepended or appended wit the separatorChar
            req.query[name] = elements[0];
        }
    }

    next();
}

/**
 * Helper function that logs to console details about the request
 * @param req the request object
 * @param res the response object
 * @param next the next function
 */
export function logConnectionDetails(req: Request, res: Response, next: NextFunction): void {
    logger(`DEBUG: incomming connection from ${req.connection.remoteAddress} to ${req.method} ${req.url}`);
    next();
}

/**
 * Helper function that connects to a Mongo database and returns a {@link Connection} object
 * @param req the request object
 * @param res the response object
 * @param next the next function
 */
export function connectDatabase(req: Request, res: Response, next: NextFunction): Promise<void> {
    return new Promise<void>(async (resolve) => {
        const config = ConfigParams();
        const service = req.get(FIWARE_SERVICE);

        try {
            const connection = await mongoose.createConnection(config.mongoUri, {
                bufferCommands: false,
                autoIndex: false,
                dbName: [config.servicePrefix, service].join(''),
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as ConnectionOptions);
            debug('successfully created a connection to the database');
            req.body.connection = connection;
            next();
            resolve();
        } catch (err) {
            logger(JSON.stringify(err));
            handleMongoConnectionError(err, res);
            resolve();
        }
    });
}

/**
 * Helper function that verifies that the proper security tokens have been provided
 * @param req the request object
 * @param res the response object
 * @param next the next function
 */
export function verifyApiKey(req: Request, res: Response, next: NextFunction): void {
    const apiKey = req.get(X_API_KEY);
    if (apiKey === undefined) {
        // return unauthorised
        badRequest(res, 'AuthError', 'Missing API KEY');
    } else {
        // validate apiKey
        const config = ConfigParams();
        if (apiKey === config.apiKey) {
            next();
        } else {
            unAuthorizedRequest(res, 'The provided API KEY is not valid');
        }
    }
}

/**
 * Helper function that verifies that, for a given ```fiware service```, the corresponfing
 * database exists on the connected mongodb instance.
 * The database name should be the concatenation of the ```servicePrefix``` defined in the configuration
 * module and the ```service``` name.
 * @param req the request object
 * @param res the response object
 * @param next the next function
 */
export async function checkDatabaseExists(req: Request, res: Response, next: NextFunction): Promise<void> {
    return new Promise<void>(async (resolve) => {

        const service: string | undefined = req.get(FIWARE_SERVICE);
        const databases = await req.body.connection.db.admin().listDatabases({ nameOnly: true });
        const config = ConfigParams();
        if (!databases.databases.some((database: { name: string }) => {
            return database.name === [config.servicePrefix, service].join('');
        })) {
            forbiddenRequest(res, 'ServiceNotFound', `Service ${service} does not exist on this server instance`);
        } else {
            next();
        }
        resolve();
    });
}

/**
 * Given a Schema definition, this function creates the associated model using the connection
 * already created and available as part of the request object.
 * The model will be set on the request body using the given ```modelName```
 * @param modelType the schema
 * @param modelName the model name. Should be the same as the collection in mongo but without pluralization
 * @param req request
 * @param res response
 * @param next next handler
 */
export function createModel(
    modelType: Schema,
    modelName: string,
    req: Request, res: Response, next: NextFunction): void | Promise<void> {
    logger(`creating model ${modelName} for schema ${modelType}`);
    const conn: Connection = req.body.connection;
    const model = conn.model(modelName, modelType)
    if (!req.body.model) {
        req.body.model = {}
    }
    req.body.model[modelName] = model;
    next();
}
