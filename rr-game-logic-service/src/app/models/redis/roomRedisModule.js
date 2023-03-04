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
    async lockRoom(roomId) {
        const lockName = `${CONFIGS.REDIS_PREFIX}-room_${roomId}_lock`;
        return new Promise((res) => {
            tryToLock(lockName, res);
        });
    },

    async unlockRoom(roomId) {
        const lockName = `${CONFIGS.REDIS_PREFIX}-room_${roomId}_lock`;
        return REDIS.del(lockName);
    },

    async getRoom(roomId) {
        try {
            const key = `${CONFIGS.REDIS_PREFIX}-ROOM-${roomId}`;

            const result = await REDIS.get(key);
            if (result) {
                return JSON.parse(result);
            }

            return {};
        } catch (e) {
            console.error('getRoom err => ', e);
            return {};
        }
    },

    async updateRoom(roomData, roomFrontData) {
        try {
            const key = `${CONFIGS.REDIS_PREFIX}-ROOM-${roomData.id}`;
            await REDIS.setex(key, 60 * 60 * 1, JSON.stringify(roomData));

            if (roomFrontData) {
                await this.updateStack(roomFrontData);
            }
        } catch (e) {
            console.error('updateRoom err => ', e);
        }
    },

    async deletRoom(roomId) {
        try {
            const key = `${CONFIGS.REDIS_PREFIX}-ROOM-${roomId}`;
            await REDIS.del(key);
        } catch (e) {
            console.error('updateRoom err => ', e);
        }
    },

    async updateStack(roomFrontData) {
        try {
            const key = `${CONFIGS.REDIS_PREFIX}-ROOM-STACK`;
            await REDIS.hset(key, roomFrontData.id, JSON.stringify(roomFrontData));
            await REDIS.EXPIRE(key, 60 * 60 * 24 * 30);
        } catch (e) {
            console.error('updateStack err => ', e);
        }
    },

    async removeFromStack(roomId) {
        try {
            const key = `${CONFIGS.REDIS_PREFIX}-ROOM-STACK`;
            await REDIS.hdel(key, roomId);
            await REDIS.EXPIRE(key, 60 * 60 * 24 * 30);
        } catch (e) {
            console.error('removeFromStack err => ', e);
        }
    },

    async getStack() {
        const key = `${CONFIGS.REDIS_PREFIX}-ROOM-STACK`;
        const result = await REDIS.hgetall(key);

        if (result) {
            const keys = Object.keys(result);
            const obj = {};
            for (let i = 0; i < keys.length; i += 1) {
                obj[keys[i]] = JSON.parse(result[keys[i]]);
            }
            return obj;
        }
        return {};
    },

    async addZTimer(value, date) {
        try {
            const key = `${CONFIGS.REDIS_PREFIX}-ROOM-TIMERS`;
            await REDIS.zadd(key, date, value);
        } catch (e) {
            console.error('addZTimer error => ', e);
        }
    },

    async getZTimer() {
        try {
            const key = `${CONFIGS.REDIS_PREFIX}-ROOM-TIMERS`;
            return await REDIS.zpopmin(key);
        } catch (e) {
            console.error('getZTimer error => ', e);
            return [];
        }
    },

    async delZTimer(roomId) {
        try {
            const key = `${CONFIGS.REDIS_PREFIX}-ROOM-TIMERS`;
            await REDIS.zrem(key, roomId);
        } catch (e) {
            console.error('delZTimer error => ', e);
        }
    },
};
