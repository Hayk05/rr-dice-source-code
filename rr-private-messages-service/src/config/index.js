import { v4 as uuidv4 } from 'uuid';
import notifications from './notifications';

export default {
    REDIS_DB: process.env.REDIS_DB || 0,
    REDIS_PREFIX: process.env.REDIS_PREFIX || 'rr_dc',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PASS: process.env.REDIS_PASS || '',

    RABBITMQ_HOST: process.env.RABBITMQ_HOST || 'localhost',
    RABBITMQ_PORT: process.env.RABBITMQ_PORT || 5672,
    RABBITMQ_USER: process.env.RABBITMQ_USER,
    RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD,
    RABBITMQ_QUEUE: 'privateMessages',
    RABBITMQ_EXCHANGE: 'dice_exchange',
    RABBITMQ_USER_PRIVATE_PREFIX: 'user_channel',
    RABBITMQ_PREFIX: 'privateMessages',

    SERVICE_ID: uuidv4(),

    LAUNCH_MODE: process.env.LAUNCH_MODE,
    BOT_SESSION: process.env.BOT_SESSION,

    URLS: {
        MAIN: 'https://rivalregions.com',
        PM: 'https://rivalregions.com/#messages',
    },

    NOTIFICATIONS: notifications,
};
