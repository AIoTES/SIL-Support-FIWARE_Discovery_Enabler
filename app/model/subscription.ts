
export interface SubscriptionSubject {
    entities: {
        id?: string;
        idPattern?: string;
        type?: string;
        typePattern?: string;
    };
    condition?: {
        attrs: string[];
        expression: string;
    };
}

export interface Subscription {
    id: string;
    description?: string;
    subject: SubscriptionSubject;
    notification: {
        attrs?: string[];
        expectAttrs?: string[];
        http?: {
            url: string;
        };
        httpCustom?: {
            url: string;
            headers?: { [key: string]: string };
            qs?: { [key: string]: string };
            method?: string;
            payload?: object;

        };
        attrsFormat?: 'normalized' | 'keyValues' | 'values';
        metadata?: string[];
        readonly timesSent?: number;
        readonly lastNotification?: string;
        readonly lastFailure?: string;
        readonly lastSuccess?: string;
    };
    expires: string;
    status: 'active' | 'inactive' | 'failed';
    throttling: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         description:
 *           type: string
 *         subject:
 *           $ref: '#/components/schemas/SubscriptionSubject'
 *         notification:
 *           type: object
 *           properties:
 *             attrs:
 *               type: array
 *               items:
 *                 type: string
 *             exceptAttrs:
 *                type: array
 *                items:
 *                  type: string
 *             http:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *               required:
 *                 - url
 *             httpCustom:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                 headers:
 *                   type: object
 *                 qs:
 *                   type: object
 *                 method:
 *                   type: string
 *                 payload:
 *                   type: object
 *               required:
 *                 - url
 *             attrsFormat:
 *                type: string
 *             metadata:
 *                type: array
 *                items:
 *                  type: string
 *             timesSent:
 *                type: number
 *             lastNotification:
 *                type: string
 *             lastFailure:
 *                type: string
 *             lastSuccess:
 *                type: string
 *         status:
 *           type: string
 *         throttling:
 *           type: number
 *       required:
 *         - subject
 *         - notification
 *     SubscriptionSubject:
 *       type: object
 *       properties:
 *         entities:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             idPattern:
 *               type: string
 *             type:
 *               type: string
 *             typePattern:
 *               type: string
 *         condition:
 *           type: object
 *           description: defines the "trigger" for the subscription. The attrs field contains a list of attribute names.
 *               These names define the "triggering attributes", i.e. attributes that upon creation/change due to
 *               *entity creation* or *update* trigger the notification
 *           properties:
 *             attrs:
 *               type: array
 *               description:
 *               items:
 *                 type: string
 *             expression:
 *               description: lajdkasjd
 *               type: string
 *       required:
 *         - entities
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emptyObject = {};
