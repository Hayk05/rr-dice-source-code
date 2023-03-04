import redis from './redis';
import postgres from './postgre';

export default {
    init() {
        return Promise.all([
            redis.connect(),
            postgres.connect(),
        ]);
    },
};
