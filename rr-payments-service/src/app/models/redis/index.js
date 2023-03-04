import asyncRedis from 'async-redis';

export default {
    connect() {
        const redisClient = asyncRedis.createClient(CONFIGS.REDIS_PORT, CONFIGS.REDIS_HOST);
        redisClient.select(CONFIGS.REDIS_DB);
        global.REDIS = redisClient;

        return new Promise((res, rej) => {
            REDIS.keys(`${CONFIGS.REDIS_PREFIX}*`).then(res).catch((err) => {
                console.error(err);
                rej(err);
            });
        });
    },
};
