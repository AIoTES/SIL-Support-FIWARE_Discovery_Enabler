import mongoose, { Document, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     FiwareAttribute:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *         value:
 *           nullable: true
 *           oneOf:
 *             - type: string
 *             - type: integer
 *             - type: boolean
 *             - type: array
 *               items: {}
 *             - type: object
 *         creDate:
 *           type: integer
 *         modDate:
 *           type: integer
 *       required:
 *         - type
 *         - value
 *         - creDate
 *         - modDate
 */
export interface FiwareAttribute {
    type: string;
    creDate: number;
    modDate: number;
    value: unknown;
}
export interface FiwareEntityInterface extends Document {
    _id: {
        id: string;
        servicePath: string;
        type: string;
    };
    atrrNames: string[];
    attrs: { [key: string]: FiwareAttribute };
    creDate: number;
    modDate: number;
}

export const FiwareEntitySchema: Schema = new Schema({
    _id: { type: Object, required: true, unique: true },
    creDate: { type: Number, required: true },
    modDate: { type: Number, required: true }
});

/**
 * @swagger
 * components:
 *  schemas:
 *   Entity:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       type:
 *         type: string
 *       service:
 *         type: string
 *       servicePath:
 *         type: string
 *       attrNames:
 *         type: array
 *         items:
 *           type: string
 *       attrs:
 *         type: object
 *         additionalProperties:
 *           $ref: '#/components/schemas/FiwareAttribute'
 *       creDate:
 *         type: integer
 *     required:
 *       - id
 *       - type
 *       - service
 *       - servicePath
 *       - attrNames
 *       - attrs
 *       - creDate
 */
export interface EntityInterface {
    id: string;
    service: string;
    servicePath: string;
    creDate: number;
    attrNames: string[];
    attrs: { [key: string]: FiwareAttribute };
}

export const EntityModel = mongoose.model<FiwareEntityInterface>('Entity', FiwareEntitySchema);
