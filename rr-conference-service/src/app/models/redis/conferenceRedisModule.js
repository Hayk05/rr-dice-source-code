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
        const lockName = `${CONFIGS.REDIS_PREFIX}-conference-page_${CONFIGS.PAGE_ID}_lock`;
        return new Promise((res) => {
            tryToLock(lockName, res);
        });
    },

    async unlockRoom() {
        const lockName = `${CONFIGS.REDIS_PREFIX}-conference-page_${CONFIGS.PAGE_ID}_lock`;
        return REDIS.del(lockName);
    },

    async setLastMessage(messageData) {
        const key = `${CONFIGS.REDIS_PREFIX}-${CONFIGS.PAGE_ID}-LAST_MESSAGE`;
        await REDIS.setex(key, 60 * 60 * 24, JSON.stringify(messageData));
    },

    async isPageBlock() {
        const key = `${CONFIGS.REDIS_PREFIX}-block_conference_page-${CONFIGS.PAGE_ID}`;
        return REDIS.get(key);
    },

    async addPageBlock() {
        const key = `${CONFIGS.REDIS_PREFIX}-block_conference_page-${CONFIGS.PAGE_ID}`;
        await REDIS.setex(key, 4, 1);
    },

    async getLastMessage() {
        try {
            const key = `${CONFIGS.REDIS_PREFIX}-${CONFIGS.PAGE_ID}-LAST_MESSAGE`;

            const result = await REDIS.get(key);
            if (result) {
                return JSON.parse(result);
            }

            return {};
        } catch (e) {
            console.error('getLastMessage err => ', e);
            return {};
        }
    },
};
