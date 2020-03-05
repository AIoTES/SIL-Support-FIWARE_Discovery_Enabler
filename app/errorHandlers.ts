import { Request, Response, ErrorRequestHandler } from 'express';

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
export interface GenericError {
    error: string;
    message: string;
}

export function errorHandler(err: ErrorRequestHandler, req: Request, res: Response): void {
    console.log(err);
    res.status(500).end({ error: 'Unkwonw error', message: '' } as GenericError);
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
 *
 */
export function badRequest(res: Response, error: string, reason: string): void {
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
    res.status(403).json({ error: error, message: reason } as GenericError);
}

export function missingHeaderError(res: Response, header: string): void {
    return badRequest(res, 'MissingHeader', `Header '${header}' not present`)
}

export function missingParameter(res: Response, param: string): void {
    return badRequest(res, 'MissingParameter', `Parameter '${param}' is mandatory but was not present in the request`);
}

export function handleMongoConnectionError(err: Error, res: Response): void {
    switch (err.name) {
        case 'MongoServerSelectionError':
            res.status(500).send({
                error: 'DatabaseConnectionError',
                message: err.message,
            } as GenericError);
        default:
            res.status(500).send({
                error: 'UnexpectedError',
                message: err.message,
            } as GenericError);
    }
}
