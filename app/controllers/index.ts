import { Application } from 'express';
import { deviceController } from './devices.controller';
import { subscriptionController } from './subscription.controller';

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
     *     '400':
     *          $ref: '#/components/responses/400BadRequest'
     *     '401':
     *       $ref: '#/components/responses/401Unauthorized'
     *     '403':
     *       $ref: '#/components/responses/403Forbidden'
     */
    app.use('/devices', deviceController);

    /**
     * @swagger
     * /v2/subscriptions:
     *   get:
     *     summary: retrieves all subscriptions
     *     tags:
     *       - Subscriptions
     *     parameters:
     *      - $ref: '#/components/parameters/FiwareService'
     *      - $ref: '#/components/parameters/FiwareServicePath'
     *     produces:
     *       - application/json
     *     security:
     *      - api_key: []
     *     responses:
     *       '200':
     *          description: success
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *       '307':
     *          description: temporal redirect
     *       '400':
     *          $ref: '#/components/responses/400BadRequest'
     *       '401':
     *         $ref: '#/components/responses/401Unauthorized'
     *   post:
     *     description: creates a new subscription
     *     security:
     *      - api_key: []
     *     parameters:
     *      - $ref: '#/components/parameters/FiwareService'
     *      - $ref: '#/components/parameters/FiwareServicePath'
     *     requestBody:
     *       description: the subscription definiton
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     tags:
     *       - Subscriptions
     *     responses:
     *       '201':
     *          description: subscription created successfully
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *       '307':
     *          description: temporal redirect
     *       '400':
     *          $ref: '#/components/responses/400BadRequest'
     *       '401':
     *         $ref: '#/components/responses/401Unauthorized'
     * /v2/subscriptions/{subsId}:
     *   delete:
     *     summary: removes an existing subscription
     *     security:
     *      - api_key: []
     *     tags:
     *       - Subscriptions
     *     parameters:
     *       - $ref: '#/components/parameters/FiwareService'
     *       - $ref: '#/components/parameters/FiwareServicePath'
     *       - name: subsId
     *         in: path
     *         description: ID of the subscription to delete
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       '204':
     *          description: success
     *       '307':
     *          description: temporal redirect
     *       '400':
     *          $ref: '#/components/responses/400BadRequest'
     *       '401':
     *         $ref: '#/components/responses/401Unauthorized'
     */
    app.use('/v2/subscriptions', subscriptionController);
}
