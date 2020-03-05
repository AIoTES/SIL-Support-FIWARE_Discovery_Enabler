import { SERVICE_PREFIX, MONGO_URI } from './constants';

export const mongoRegex = /^(mongodb:(?:\/{2})?)((\w+?):(\w+?)@|:?@?)(\S+?):(\d+)(\/(\S+?))?(\?replicaSet=(\S+?))?$/;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ConfigParams = () => {
    return {
        servicePrefix: process.env[SERVICE_PREFIX] || 'orion-',
        // TODO: validate MONGO_URI
        mongoUri: process.env[MONGO_URI]?.trim() || '',
    }
};
