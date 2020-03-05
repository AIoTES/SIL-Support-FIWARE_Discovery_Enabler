
/**
 * @swagger
 * components:
 *    parameters:
 *      FiwareService:
 *        in: header
 *        name: Fiware-Service
 *        schema:
 *          type: string
 *        required: true
 *        description: the service
 *        allowEmptyValue: false
 */
export const FIWARE_SERVICE = 'Fiware-Service';

/**
 * @swagger
 * components:
 *    parameters:
 *      FiwareServicePath:
 *        in: header
 *        name: Fiware-ServicePath
 *        schema:
 *          type: string
 *        required: false
 *        description: the service path
 *        allowEmptyValue: true
 */
export const FIWARE_SERVICE_PATH = 'Fiware-ServicePath';

/**
 * @swagger
 * components:
 *    headers:
 *      Content-Range:
 *        schema:
 *          type: string
 *        required: true
 *        description: |
 *            indicates where in a full body message a partial message belongs.
 *
 *            Content-Range: &lt;unit&gt; &lt;range-start&gt;-&lt;range-end&gt;/&lt;size&gt;
 *
 *            &lt;unit&gt;: The unit in which ranges are specified. This is usually ```items```
 *
 *            &lt;range-start&gt;: An integer in the given unit indicating the beginning of the request range.
 *
 *            &lt;range-end&gt;: An integer in the given unit indicating the end of the requested range.
 *
 *            &lt;size>: The total size of the document (or ```'*'``` if unknown).
 *
 */
export const CONTENT_RANGE = 'Content-Range';

/**
 * @swagger
 * components:
 *   parameters:
 *     offset:
 *      in: query
 *      name: offset
 *      required: false
 *      schema:
 *        type: integer
 *        minimum: 0
 *      description: number of elements to skip in the result set
 */
export const OFFSET_PARAM = 'offset';

/**
 * @swagger
 * components:
 *   parameters:
 *     limit:
 *      in: query
 *      name: limit
 *      required: false
 *      schema:
 *        type: integer
 *        minimum: 0
 *      description: max number of elements to return
 */
export const LIMIT_PARAM = 'limit';

export const SERVICE_PREFIX = 'ORION_SERVICE_PREFIX';
export const MONGO_URI = 'MONGO_URI';

