import { ErrorRequestHandler, Request, Response } from 'express';
import debug from 'debug';

const logger = debug('app:errorHandler');

/**
 * @swagger
 * components:
 *   schemas:
 *     GenericError:
 *       description: a generic error
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 *       required:
 *         - error
 *         - message
 */
export class GenericError {
    error: string;

    message: string;

    constructor(error: string, message: string) {
        this.message = message;
        this.error = error;
    }
}

export function errorHandler(err: ErrorRequestHandler, req: Request, res: Response): void {
    logger(`ERROR: unknown error ${err.name}`);
    res.status(500).end({ error: 'Unkwonw error', message: '' } as GenericError);
}

export function methodNotAllowerError(res: Response, reason: string): void {
    logger(`ERROR: method not allowed - ${reason}`);
    res.status(405).json({ error: 'MethodNotAllowed', message: reason } as GenericError);
}

/**
 * @swagger
 *  components:
 *   responses:
 *     400BadRequest:
 *       description: the request contains invalid parameters
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericError'
 */
export function badRequest(res: Response, error: string, reason: string): void {
    logger(`ERROR: bad request: ${reason}`);
    res.status(400).json({ error, message: reason } as GenericError);
}

/**
 * @swagger
 *  components:
 *   responses:
 *     403Forbidden:
 *       description: the specified resource is not accessible
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericError'
 *
 */
export function forbiddenRequest(res: Response, error: string, reason: string): void {
    logger(`ERROR: forbidden resource - ${reason}`);
    res.status(403).json({ error: error, message: reason } as GenericError);
}

export function missingHeaderError(res: Response, header: string): void {
    return badRequest(res, 'MissingHeader', `Header '${header}' not present`)
}

export function missingParameter(res: Response, param: string): void {
    return badRequest(res, 'MissingParameter', `Parameter '${param}' is mandatory but was not present in the request`);
}

/**
 * @swagger
 *  components:
 *   responses:
 *     401Unauthorized:
 *       description: API_KEY is absent or incorrect
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericError'
 *
 */
export function unAuthorizedRequest(res: Response, message: string): void {
    logger(`ERROR: unauthorized request: ${message}`)
    res.status(401).json({ error: 'UnauthorizedRequest', message } as GenericError);
}

export function handleMongoConnectionError(err: Error, res: Response): void {
    switch (err.name) {
        case 'MongoServerSelectionError':
            res.status(500).json({
                error: 'DatabaseConnectionError',
                message: err.message,
            } as GenericError);
            break;
        case 'MongoParseError':
            badRequest(res, err.name, 'Invalid connection string');
            break;
        default:
            res.status(500).json({
                error: 'UnexpectedError',
                message: err.message,
            } as GenericError);
    }
}
