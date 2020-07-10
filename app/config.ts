import { API_KEY, MONGO_URI, ORION_URL, SERVICE_PREFIX } from './constants';

export const mongoRegex = /^(mongodb:(?:\/{2})?)((\w+?):(\w+?)@|:?@?)(\S+?):(\d+)(\/(\S+?))?(\?replicaSet=(\S+?))?$/;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ConfigParams(): Record<string, string | number | undefined> {
    return {
        servicePrefix: process.env[SERVICE_PREFIX] || 'orion-',
        mongoUri: process.env[MONGO_URI]?.trim() || '',
        apiKey: process.env[API_KEY],
        orionUrl: process.env[ORION_URL],
    }
}
