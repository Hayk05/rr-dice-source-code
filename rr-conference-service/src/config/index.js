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
    RABBITMQ_QUEUE: `conference.${process.env.CONFERENCE_LANG}`,
    RABBITMQ_EXCHANGE: 'dice_exchange',
    RABBITMQ_USER_PRIVATE_PREFIX: 'user_channel',
    RABBITMQ_PREFIX: `conference.${process.env.CONFERENCE_LANG}`,

    PAGE_ID: uuidv4(),
    BOT_PROFILE_ID: process.env.BOT_PROFILE_ID,
    CONFERENCE_ID: process.env.CONFERENCE_ID,

    CONFERENCE_LANG: process.env.CONFERENCE_LANG,

    URLS: {
        MAIN: 'https://rivalregions.com',
        CONFERENCE: process.env.CONFERENCE_URL,
    },

    LAUNCH_MODE: process.env.LAUNCH_MODE,
    BOT_SESSION: process.env.BOT_SESSION,

    AUTHOMODERATION: process.env.AUTHOMODERATION,

    NOTIFICATIONS: notifications,
};
