import { Application } from 'express';
import { deviceController } from './devices.controller';

export function RegisterRoutes(app: Application): void {

    /**
     * @swagger
     * /devices:
     *  get:
     *    summary: retrieves a list of devices
     *    tags:
     *     - Devices
     *    produces:
     *     - application/json
     *    parameters:
     *      - $ref: '#/components/parameters/FiwareService'
     *      - $ref: '#/components/parameters/FiwareServicePath'
     *      - in: query
     *        name: type
     *        required: true
     *        schema:
     *          type: string
     *        description: the device type. It can be a comma-separated list of device types. E.g.,
     *          ```type=Device1```  or ```type=Device1,Device2```
     *      - in: query
     *        name: lastCheck
     *        required: false
     *        schema:
     *          type: integer
     *        description: unix time (in ms) indicating the previous check done. This will
     *                     filter results based on the creation date field
     *      - $ref: '#/components/parameters/offset'
     *      - $ref: '#/components/parameters/limit'
     *    security:
     *      - api_key: []
     *    responses:
     *     '200':
     *       description: success
     *       headers:
     *         Content-Range:
     *           $ref: '#/components/headers/Content-Range'
     *       content:
     *         application/json:
     *           schema:
     *             type: array
     *             items:
     *               $ref: '#/components/schemas/Entity'
     *     '401':
     *       $ref: '#/components/responses/401Unauthorized'
     *     '403':
     *       $ref: '#/components/responses/403Forbidden'
     */
    app.use('/devices', deviceController);
}
