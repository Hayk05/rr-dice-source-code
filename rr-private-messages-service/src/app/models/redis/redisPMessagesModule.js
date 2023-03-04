const tryToLock = async (lockName, resolve) => {
    const isSuccess = await REDIS.setnx(lockName, 'lorem');
    if (isSuccess) {
        await REDIS.EXPIRE(lockName, 5);
        resolve();
    } else {
        setTimeout(tryToLock.bind(this, lockName, resolve), 50 + Math.round(Math.random() * 50));
    }
};

export default {
    async lockPage() {
        const lockName = `${CONFIGS.REDIS_PREFIX}-pm_${CONFIGS.SERVICE_ID}_lock`;
        return new Promise((res) => {
            tryToLock(lockName, res);
        });
    },

    async unlockPage() {
        const lockName = `${CONFIGS.REDIS_PREFIX}-pm_${CONFIGS.SERVICE_ID}_lock`;
        return REDIS.del(lockName);
    },
};
