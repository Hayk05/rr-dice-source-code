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
    async lockPlayer(playerId) {
        const lockName = `${CONFIGS.REDIS_PREFIX}-player_${playerId}_lock`;
        return new Promise((res) => {
            tryToLock(lockName, res);
        });
    },

    async unlockPlayer(playerId) {
        const lockName = `${CONFIGS.REDIS_PREFIX}-player_${playerId}_lock`;
        return REDIS.del(lockName);
    },

    async getPlayer(playerId) {
        try {
            const key = `${CONFIGS.REDIS_PREFIX}-PLAYER-${playerId}`;

            const result = await REDIS.get(key);
            if (result) {
                return JSON.parse(result);
            }

            return {};
        } catch (e) {
            console.error('getPlayer err => ', e);
            return {};
        }
    },

    async updatePlayer(playerData) {
        try {
            const key = `${CONFIGS.REDIS_PREFIX}-PLAYER-${playerData.rrId}`;
            await REDIS.setex(key, 60 * 60 * 1, JSON.stringify(playerData));
        } catch (e) {
            console.error('updatePlayer err => ', e);
        }
    },
};
