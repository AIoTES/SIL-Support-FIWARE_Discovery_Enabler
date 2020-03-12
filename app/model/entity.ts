
import mongoose, { Document, Schema } from 'mongoose';

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
 *     Entity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         type:
 *           type: string
 *         service:
 *           type: string
 *         servicePath:
 *           type: string
 *         attrNames:
 *           type: array
 *           items:
 *             type: string
 *         attrs:
 *           type: object
 *           additionalProperties:
 *             $ref: '#/components/schemas/FiwareAttribute'
 *         creDate:
 *           type: integer
 *       required:
 *         - id
 *         - type
 *         - service
 *         - servicePath
 *         - attrNames
 *         - attrs
 *         - creDate
 */
export const FiwareEntitySchema: Schema = new Schema({
    _id: { type: Object, required: true, unique: true },
    creDate: { type: Number, required: true },
    modDate: { type: Number, required: true }
});

export interface EntityInterface {
    id: string;
    service: string;
    servicePath: string;
    creDate: number;
    attrNames: string[];
    attrs: { [key: string]: FiwareAttribute };
}

export const EntityModel = mongoose.model<FiwareEntityInterface>('Entity', FiwareEntitySchema);
