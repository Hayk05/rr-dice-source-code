import redis from './redis';

export default {
    init() {
        return Promise.all([
            redis.connect(),
        ]);
    },
};
