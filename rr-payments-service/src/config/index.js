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
    RABBITMQ_QUEUE: 'payments',
    RABBITMQ_EXCHANGE: 'dice_exchange',
    RABBITMQ_USER_PRIVATE_PREFIX: 'user_channel',
    RABBITMQ_PREFIX: 'payments',

    BOT_SESSION: process.env.BOT_SESSION,
    LAUNCH_MODE: process.env.LAUNCH_MODE,

    PAGE_ID: uuidv4(),

    URLS: {
        MAIN: 'https://rivalregions.com',
        MONEY_LOG: 'https://rivalregions.com/log/index/money',
        DONATE: 'https://rivalregions.com/#slide/donate/user/',
    },

    NOTIFICATIONS: notifications,
};
