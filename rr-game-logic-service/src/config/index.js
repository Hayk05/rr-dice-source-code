import localization from './localization';
import notifications from './notifications';

export default {
    REDIS_DB: process.env.REDIS_DB || 0,
    REDIS_PREFIX: process.env.REDIS_PREFIX || 'rr_dc',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PASS: process.env.REDIS_PASS || '',

    POSTGRE_CONNECTION: {
        host: process.env.POSTGRE_HOST || '127.0.0.1',
        port: process.env.POSTGRE_PORT || 5432,
        user: process.env.POSTGRE_USER,
        password: process.env.POSTGRE_PASS,
        database: process.env.POSTGRE_DB || 'dice',
    },

    RABBITMQ_HOST: process.env.RABBITMQ_HOST || 'localhost',
    RABBITMQ_PORT: process.env.RABBITMQ_PORT || 5672,
    RABBITMQ_USER: process.env.RABBITMQ_USER,
    RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD,
    RABBITMQ_QUEUE: 'gameLogic',
    RABBITMQ_EXCHANGE: 'dice_exchange',
    RABBITMQ_USER_PRIVATE_PREFIX: 'user_channel',
    RABBITMQ_PREFIX: 'gameLogic',

    TABLES: {
        PLAYERS: 'prod.core_players',
        TRANSACTIONS: 'prod.core_tranzactions',
        ROOM: 'prod.core_tables',
        WARNINGS: 'prod.core_warnings',
    },

    TRNASACTIONS_KINDS: {
        DEPOSIT: 'DEPOSIT',
        BET: 'BET',
        REFUND: 'REFUND',
        WIN: 'WIN',
        WITHDRAWAL: 'WITHDRAWAL',
        RAKE_TRANSFER: 'RAKE_TRANSFER',
    },

    ROOM_STATE: {
        CREATED: 'created',
        STARTED: 'started',
        FINISHED: 'finished',
        DELETED: 'deleted',
        DRAW: 'draw',
        CRUSHED: 'crushed',
    },

    ROOM_KIND: {
        CLASSIC: 'classic',
    },

    MIN_BET: 50000000000,

    LOCALIZATION: localization,
    NOTIFICATIONS: notifications,

    DICE_IMG_URL: {
        1: 'https://images2.imgbox.com/3e/a2/k0ysAhrV_o.png',
        2: 'https://images2.imgbox.com/0c/f4/eNtt0FXt_o.png',
        3: 'https://images2.imgbox.com/4a/07/5nxQ2Y2D_o.png',
        4: 'https://images2.imgbox.com/c4/97/1L5wv9xK_o.png',
        5: 'https://images2.imgbox.com/4b/4b/rR18EjYL_o.png',
        6: 'https://images2.imgbox.com/ce/0a/9ZFw4gwb_o.png',
    },
    RAKE: 0.05,

    BOT_SESSION: process.env.BOT_SESSION,
    BOT_AUTHORIZATION_COOKES: process.env.BOT_AUTHORIZATION_COOKES,
    BOT_HUYZNAET_TOKEN: process.env.BOT_HUYZNAET_TOKEN,

    RAKE_TRANSFER_ACCOUNT_ID: process.env.RAKE_TRANSFER_ACCOUNT_ID,
};
