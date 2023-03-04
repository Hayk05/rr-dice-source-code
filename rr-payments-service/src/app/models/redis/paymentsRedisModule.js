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
    async lockRoom() {
        const lockName = `${CONFIGS.REDIS_PREFIX}-payments-page_${CONFIGS.PAGE_ID}_lock`;
        return new Promise((res) => {
            tryToLock(lockName, res);
        });
    },

    async unlockRoom() {
        const lockName = `${CONFIGS.REDIS_PREFIX}-payments-page_${CONFIGS.PAGE_ID}_lock`;
        return REDIS.del(lockName);
    },

    async setLastPayment(paymentsData) {
        const key = `${CONFIGS.REDIS_PREFIX}-LAST_PAYMENTS`;
        await REDIS.setex(key, 60 * 60 * 24, JSON.stringify(paymentsData));
    },

    async getLastPayment() {
        try {
            const key = `${CONFIGS.REDIS_PREFIX}-LAST_PAYMENTS`;

            const result = await REDIS.get(key);
            if (result) {
                return JSON.parse(result);
            }

            return {};
        } catch (e) {
            console.error('getLastPayment err => ', e);
            return {};
        }
    },
};
