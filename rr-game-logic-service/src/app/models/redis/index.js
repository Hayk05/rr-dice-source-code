import asyncRedis from 'async-redis';

export default {
    connect() {
        const redisClient = asyncRedis.createClient({
            host: CONFIGS.REDIS_HOST,
            port: CONFIGS.REDIS_PORT,
            password: CONFIGS.REDIS_PASS,
            db: CONFIGS.REDIS_DB,
        });
        // redisClient.select(CONFIGS.REDIS_DB);
        global.REDIS = redisClient;

        return new Promise((res, rej) => {
            REDIS.keys(`${CONFIGS.REDIS_PREFIX}*`).then(res).catch((err) => {
                console.error('REDIS DB connect error', err);
                rej(err);
            });
        });
    },
};
